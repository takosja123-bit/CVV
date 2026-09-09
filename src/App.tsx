import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CVData,
  TemplateId,
  ActivePage,
  ResumeItem,
  CoverLetterItem,
  JobItem,
} from './types';
import {
  INITIAL_CV_DATA,
  TEMPLATES,
  sanitizeResumeList,
  createDefaultResumeForUser,
} from './data/initialData';
import { sanitizeCVData } from './utils/sanitizeData';
import { LandingPage } from './components/landing/LandingPage';
import { CVBuilderPage } from './components/builder/CVBuilderPage';
import { JobseekerDashboard } from './components/dashboard/JobseekerDashboard';
import { LoginModal } from './components/dashboard/LoginModal';
import {
  subscribeToAuth,
  logoutUser,
  AuthUserState,
} from './firebase/authService';
import {
  fetchUserResumes,
  saveUserResume,
  deleteUserResume,
  batchSyncResumes,
  fetchUserCoverLetters,
  saveUserCoverLetter,
  deleteUserCoverLetter,
  fetchUserJobs,
  saveUserJob,
  deleteUserJob,
  isDeviceBlocked,
} from './firebase/cvService';
import { getDeviceId, getBrowserFingerprint } from './utils/deviceId';

// Account-specific local storage keys to ensure each user account stores only its own data
const getAccountResumesKey = (uid?: string | null) =>
  uid ? `jobseeker_resumes_uid_${uid}` : 'jobseeker_resumes_guest';

const getAccountCoverLettersKey = (uid?: string | null) =>
  uid ? `jobseeker_cover_letters_uid_${uid}` : 'jobseeker_cover_letters_guest';

const getAccountJobsKey = (uid?: string | null) =>
  uid ? `jobseeker_jobs_uid_${uid}` : 'jobseeker_jobs_guest';

const STORAGE_USER_KEY = 'jobseeker_user_v1';

const sanitizeTrackedJobs = (list: any): JobItem[] => {
  if (!Array.isArray(list)) return [];
  return list.filter((j: any) => {
    if (!j || !j.id) return false;
    // Exclude mock seed jobs
    if (['job-1', 'job-2', 'job-3'].includes(j.id)) return false;
    // Only show jobs the user actually applied to
    if (j.status === 'saved') return false;
    return true;
  });
};

export default function App() {
  // Firebase Auth user state
  const [authUser, setAuthUser] = useState<AuthUserState | null>(null);

  // User display profile state (synced with Firebase or Local Storage)
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load user', e);
    }
    return null;
  });

  // Cloud sync status: 'saved' | 'saving' | 'error' | 'offline'
  const [cloudSyncStatus, setCloudSyncStatus] = useState<
    'saved' | 'saving' | 'error' | 'offline'
  >('offline');

  // Resumes list state (loaded from account storage or guest storage)
  // Guests (not signed in) start with an empty list rather than demo resumes.
  const [resumes, setResumes] = useState<ResumeItem[]>(() => {
    try {
      const guestSaved = localStorage.getItem(getAccountResumesKey(null));
      if (guestSaved) {
        return sanitizeResumeList(JSON.parse(guestSaved), false);
      }
    } catch (e) {
      console.warn('Failed to load resumes', e);
    }
    return [];
  });

  // Cover letters state
  const [coverLetters, setCoverLetters] = useState<CoverLetterItem[]>(() => {
    try {
      const guestSaved = localStorage.getItem(getAccountCoverLettersKey(null));
      if (guestSaved) return JSON.parse(guestSaved);
    } catch (e) {
      console.warn('Failed to load cover letters', e);
    }
    return [];
  });

  // Jobs pipeline state (only jobs the user applied to)
  const [jobs, setJobs] = useState<JobItem[]>(() => {
    try {
      const guestSaved = localStorage.getItem(getAccountJobsKey(null));
      if (guestSaved) return sanitizeTrackedJobs(JSON.parse(guestSaved));
    } catch (e) {
      console.warn('Failed to load jobs', e);
    }
    return [];
  });

  // Currently active resume being edited
  const [activeResumeId, setActiveResumeId] = useState<string>(() => {
    return resumes[0]?.id || 'resume-sample-1';
  });

  // Navigation page
  const [currentPage, setCurrentPage] = useState<ActivePage>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#builder') return 'builder';
      if (window.location.hash === '#dashboard') return 'dashboard';
    }
    return 'landing';
  });

  // Global Login Modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Set when this browser is on the admin's block list; shown as a persistent banner
  const [deviceBlockedMessage, setDeviceBlockedMessage] = useState<string | null>(null);

  // Debounce timer reference for autosaving to Firestore
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Listen to Firebase Authentication state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const blocked = await isDeviceBlocked(getDeviceId(), getBrowserFingerprint());
        if (blocked) {
          await logoutUser();
          setAuthUser(null);
          setDeviceBlockedMessage(
            'This device has been blocked from accessing JobifyCV. If you believe this is a mistake, please contact support.'
          );
          return;
        }
      }

      setAuthUser(firebaseUser);

      if (firebaseUser) {
        const profile = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
        };
        setUser(profile);
        setCloudSyncStatus('saving');

        try {
          // Fetch user's saved CVs from Firestore strictly for their own UID
          const remoteResumes = await fetchUserResumes(firebaseUser.uid);

          if (remoteResumes && remoteResumes.length > 0) {
            // User has their own resumes in Firestore
            setResumes(remoteResumes);
            setActiveResumeId(remoteResumes[0].id);
            try {
              localStorage.setItem(getAccountResumesKey(firebaseUser.uid), JSON.stringify(remoteResumes));
            } catch (e) {
              console.warn('Failed caching user resumes locally', e);
            }
          } else {
            // Check if this specific account has cached resumes in localStorage
            const localAccountData = localStorage.getItem(getAccountResumesKey(firebaseUser.uid));
            if (localAccountData) {
              const parsed = sanitizeResumeList(JSON.parse(localAccountData), false);
              if (parsed.length > 0) {
                setResumes(parsed);
                setActiveResumeId(parsed[0].id);
                await batchSyncResumes(firebaseUser.uid, parsed);
              } else {
                // First-time account with no resumes: create a fresh isolated resume for this user
                const defaultResume = createDefaultResumeForUser(firebaseUser.uid, profile.name, profile.email);
                setResumes([defaultResume]);
                setActiveResumeId(defaultResume.id);
                await saveUserResume(firebaseUser.uid, defaultResume);
              }
            } else {
              // Brand new user account: create their own personal resume, NEVER copy another user's or guest's
              const defaultResume = createDefaultResumeForUser(firebaseUser.uid, profile.name, profile.email);
              setResumes([defaultResume]);
              setActiveResumeId(defaultResume.id);
              await saveUserResume(firebaseUser.uid, defaultResume);
            }
          }

          // Fetch Cover letters strictly for this user
          const remoteLetters = await fetchUserCoverLetters(firebaseUser.uid);
          if (remoteLetters && remoteLetters.length > 0) {
            setCoverLetters(remoteLetters);
          } else {
            const cachedLetters = localStorage.getItem(getAccountCoverLettersKey(firebaseUser.uid));
            setCoverLetters(cachedLetters ? JSON.parse(cachedLetters) : []);
          }

          // Fetch Jobs strictly for this user (only jobs applied to)
          const remoteJobs = await fetchUserJobs(firebaseUser.uid);
          if (remoteJobs && remoteJobs.length > 0) {
            setJobs(sanitizeTrackedJobs(remoteJobs));
          } else {
            const cachedJobs = localStorage.getItem(getAccountJobsKey(firebaseUser.uid));
            setJobs(cachedJobs ? sanitizeTrackedJobs(JSON.parse(cachedJobs)) : []);
          }

          setCloudSyncStatus('saved');
        } catch (err) {
          console.error('Error synchronizing user data with Firestore:', err);
          setCloudSyncStatus('error');
        }
      } else {
        // User logged out: load guest account state ONLY, never retain previous user's data
        setCloudSyncStatus('offline');
        setUser(null);

        try {
          const guestResumes = localStorage.getItem(getAccountResumesKey(null));
          if (guestResumes) {
            const parsed = sanitizeResumeList(JSON.parse(guestResumes), false);
            setResumes(parsed);
            setActiveResumeId(parsed[0]?.id || '');
          } else {
            setResumes([]);
            setActiveResumeId('');
          }

          const guestLetters = localStorage.getItem(getAccountCoverLettersKey(null));
          setCoverLetters(guestLetters ? JSON.parse(guestLetters) : []);

          const guestJobs = localStorage.getItem(getAccountJobsKey(null));
          setJobs(guestJobs ? sanitizeTrackedJobs(JSON.parse(guestJobs)) : []);
        } catch (e) {
          console.warn('Failed restoring guest state on logout', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Local storage persistence (isolated by user ID)
  useEffect(() => {
    try {
      const key = getAccountResumesKey(authUser?.uid);
      localStorage.setItem(key, JSON.stringify(resumes));
    } catch (e) {
      console.warn('Failed saving resumes to local storage', e);
    }
  }, [resumes, authUser?.uid]);

  useEffect(() => {
    try {
      const key = getAccountCoverLettersKey(authUser?.uid);
      localStorage.setItem(key, JSON.stringify(coverLetters));
    } catch (e) {
      console.warn('Failed saving cover letters to local storage', e);
    }
  }, [coverLetters, authUser?.uid]);

  useEffect(() => {
    try {
      const key = getAccountJobsKey(authUser?.uid);
      localStorage.setItem(key, JSON.stringify(jobs));
    } catch (e) {
      console.warn('Failed saving jobs to local storage', e);
    }
  }, [jobs, authUser?.uid]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch (e) {
      console.warn('Failed saving user to local storage', e);
    }
  }, [user]);

  // 3. URL Hash navigation listener
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#builder') setCurrentPage('builder');
      else if (hash === '#landing') setCurrentPage('landing');
      else setCurrentPage('dashboard');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Find currently active resume
  const currentResume = resumes.find((r) => r.id === activeResumeId) || resumes[0] || {
    id: 'resume-1',
    title: 'Untitled Resume',
    templateId: 'template-b' as TemplateId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: INITIAL_CV_DATA,
  };

  // 4. Debounced Autosave to Firestore when currentResume data changes
  const debouncedAutosaveResume = useCallback(
    (resumeToSave: ResumeItem) => {
      if (!authUser) {
        setCloudSyncStatus('offline');
        return;
      }

      setCloudSyncStatus('saving');

      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }

      autosaveTimerRef.current = setTimeout(async () => {
        try {
          await saveUserResume(authUser.uid, resumeToSave);
          setCloudSyncStatus('saved');
        } catch (err) {
          console.error('Debounced autosave failed:', err);
          setCloudSyncStatus('error');
        }
      }, 900); // Debounce duration: ~900ms
    },
    [authUser]
  );

  // Handlers for CV Builder
  const handleOpenResumeInBuilder = (resume: ResumeItem) => {
    setActiveResumeId(resume.id);
    window.location.hash = '#builder';
    setCurrentPage('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateActiveResumeData = (updatedData: CVData) => {
    const sanitized = sanitizeCVData(updatedData);
    const updatedResume: ResumeItem = {
      ...currentResume,
      data: sanitized,
      updatedAt: new Date().toISOString(),
    };

    setResumes((prev) =>
      prev.map((r) => (r.id === currentResume.id ? updatedResume : r))
    );

    // Trigger debounced Firestore save
    debouncedAutosaveResume(updatedResume);
  };

  const handleUpdateActiveResumeTemplate = (templateId: TemplateId) => {
    const tmplObj = TEMPLATES.find((t) => t.id === templateId);
    const updatedResume: ResumeItem = {
      ...currentResume,
      templateId,
      primaryColor: tmplObj?.primaryColor || currentResume.primaryColor,
      updatedAt: new Date().toISOString(),
    };

    setResumes((prev) =>
      prev.map((r) => (r.id === currentResume.id ? updatedResume : r))
    );

    // Trigger debounced Firestore save
    debouncedAutosaveResume(updatedResume);
  };

  const handleUpdateResumesList = (newResumes: ResumeItem[]) => {
    const listWithUid = authUser
      ? newResumes.map((r) => ({ ...r, userId: authUser.uid }))
      : newResumes;
    setResumes(listWithUid);
  };

  const handleNavigateToLanding = () => {
    window.location.hash = '#landing';
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDashboard = () => {
    window.location.hash = '#dashboard';
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateFromLanding = async (templateId?: TemplateId) => {
    if (!authUser) {
      setIsLoginModalOpen(true);
      return;
    }
    const chosenTemplateId = templateId || 'template-ats-classic';
    const chosenTmpl = TEMPLATES.find((t) => t.id === chosenTemplateId) || TEMPLATES[0];
    const newResume: ResumeItem = {
      id: `resume-${Date.now()}`,
      userId: authUser?.uid,
      title: `${chosenTmpl.name} Resume`,
      templateId: chosenTemplateId,
      primaryColor: chosenTmpl?.primaryColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {
        ...INITIAL_CV_DATA,
        personal: {
          ...INITIAL_CV_DATA.personal,
          fullName: user?.name || INITIAL_CV_DATA.personal.fullName,
          email: user?.email || INITIAL_CV_DATA.personal.email,
        },
      },
    };

    setResumes((prev) => [newResume, ...prev]);
    setActiveResumeId(newResume.id);

    if (authUser) {
      setCloudSyncStatus('saving');
      try {
        await saveUserResume(authUser.uid, newResume);
        setCloudSyncStatus('saved');
      } catch (e) {
        console.error('Failed to create resume in cloud:', e);
        setCloudSyncStatus('error');
      }
    }

    window.location.hash = '#builder';
    setCurrentPage('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSingleResume = async (resumeToSave: ResumeItem) => {
    if (authUser) {
      const itemWithUid: ResumeItem = {
        ...resumeToSave,
        userId: authUser.uid,
      };
      setCloudSyncStatus('saving');
      try {
        await saveUserResume(authUser.uid, itemWithUid);
        setCloudSyncStatus('saved');
      } catch (e) {
        console.error('Failed saving single resume to cloud:', e);
        setCloudSyncStatus('error');
      }
    }
  };

  const handleDeleteSingleResume = async (id: string) => {
    if (authUser) {
      try {
        await deleteUserResume(authUser.uid, id);
      } catch (e) {
        console.error('Failed deleting resume from cloud:', e);
      }
    }
  };

  const handleSaveSingleCoverLetter = async (letterToSave: CoverLetterItem) => {
    if (authUser) {
      const itemWithUid = { ...letterToSave, userId: authUser.uid };
      try {
        await saveUserCoverLetter(authUser.uid, itemWithUid);
      } catch (e) {
        console.error('Failed saving cover letter to cloud:', e);
      }
    }
  };

  const handleDeleteSingleCoverLetter = async (id: string) => {
    if (authUser) {
      try {
        await deleteUserCoverLetter(authUser.uid, id);
      } catch (e) {
        console.error('Failed deleting cover letter from cloud:', e);
      }
    }
  };

  const handleSaveSingleJob = async (jobToSave: JobItem) => {
    if (authUser) {
      const itemWithUid = { ...jobToSave, userId: authUser.uid };
      try {
        await saveUserJob(authUser.uid, itemWithUid);
      } catch (e) {
        console.error('Failed saving job to cloud:', e);
      }
    }
  };

  const handleDeleteSingleJob = async (id: string) => {
    if (authUser) {
      try {
        await deleteUserJob(authUser.uid, id);
      } catch (e) {
        console.error('Failed deleting job from cloud:', e);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAuthUser(null);
      setUser(null);
      setCloudSyncStatus('offline');

      // Reset in-memory state to guest profile
      const guestResumes = localStorage.getItem(getAccountResumesKey(null));
      if (guestResumes) {
        const parsed = sanitizeResumeList(JSON.parse(guestResumes), false);
        setResumes(parsed);
        setActiveResumeId(parsed[0]?.id || '');
      } else {
        setResumes([]);
        setActiveResumeId('');
      }

      const guestLetters = localStorage.getItem(getAccountCoverLettersKey(null));
      setCoverLetters(guestLetters ? JSON.parse(guestLetters) : []);

      const guestJobs = localStorage.getItem(getAccountJobsKey(null));
      setJobs(guestJobs ? sanitizeTrackedJobs(JSON.parse(guestJobs)) : []);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F5F2]">
      {deviceBlockedMessage && (
        <div className="fixed inset-x-0 top-0 z-[100] bg-red-600 text-white text-xs sm:text-sm font-semibold text-center py-2.5 px-4 shadow-lg">
          {deviceBlockedMessage}
        </div>
      )}
      {currentPage === 'dashboard' && (
        <JobseekerDashboard
          resumes={resumes}
          coverLetters={coverLetters}
          jobs={jobs}
          user={user}
          onUpdateResumes={handleUpdateResumesList}
          onUpdateCoverLetters={setCoverLetters}
          onUpdateJobs={setJobs}
          onUpdateUser={setUser}
          onOpenResumeInBuilder={handleOpenResumeInBuilder}
          onGoToLanding={handleNavigateToLanding}
          onLogoutUser={handleLogout}
          cloudSyncStatus={cloudSyncStatus}
          onSaveResumeItem={handleSaveSingleResume}
          onDeleteResumeItem={handleDeleteSingleResume}
          onSaveCoverLetterItem={handleSaveSingleCoverLetter}
          onDeleteCoverLetterItem={handleDeleteSingleCoverLetter}
          onSaveJobItem={handleSaveSingleJob}
          onDeleteJobItem={handleDeleteSingleJob}
        />
      )}

      {currentPage === 'landing' && (
        <LandingPage
          data={currentResume.data}
          selectedTemplate={currentResume.templateId}
          onSelectTemplate={handleUpdateActiveResumeTemplate}
          onCreateCV={handleCreateFromLanding}
          onGoToDashboard={handleNavigateToDashboard}
        />
      )}

      {currentPage === 'builder' && (
        <CVBuilderPage
          data={currentResume.data}
          selectedTemplate={currentResume.templateId}
          resumeTitle={currentResume.title}
          onChangeData={handleUpdateActiveResumeData}
          onSelectTemplate={handleUpdateActiveResumeTemplate}
          onBackToLanding={handleNavigateToLanding}
          onBackToDashboard={handleNavigateToDashboard}
          cloudSyncStatus={cloudSyncStatus}
          allResumes={resumes}
          activeResumeId={currentResume.id}
          onSwitchResume={handleOpenResumeInBuilder}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          userEmail={user?.email}
        />
      )}

      {/* Global Login & Sign Up Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={authUser}
        onAuthSuccess={(loggedInUser) => {
          setUser({
            name: loggedInUser.displayName || loggedInUser.email?.split('@')[0] || 'User',
            email: loggedInUser.email || '',
          });
          setIsLoginModalOpen(false);
        }}
      />
    </main>
  );
}
