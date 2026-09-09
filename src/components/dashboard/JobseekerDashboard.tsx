import React, { useState, useEffect } from 'react';
import {
  SidebarSection,
  ResumeItem,
  CoverLetterItem,
  JobItem,
  TemplateId,
  PublicJob,
  AdminSubmission,
  UserAccountProfile,
  TelegramConfig,
  PlanTier,
  ADMIN_EMAIL,
  CandidateApplication,
  BlockedDevice,
} from '../../types';
import { Sidebar } from './Sidebar';
import { ResumesView } from './ResumesView';
import { CoverLettersView } from './CoverLettersView';
import { JobsBoardView } from './JobsBoardView';
import { AdminDashboardView } from './AdminDashboardView';
import { ApplicationsView } from './ApplicationsView';
import { TemplatePickerModal } from './TemplatePickerModal';
import { RenameResumeModal } from './RenameResumeModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { CoverLetterEditorModal } from './CoverLetterEditorModal';
import { JobEditModal } from './JobEditModal';
import { PublicJobModal } from './PublicJobModal';
import { UserUpgradeModal } from './UserUpgradeModal';
import { LoginModal } from './LoginModal';
import { HelpModal } from './HelpModal';
import { INITIAL_CV_DATA, TEMPLATES, INITIAL_PUBLIC_JOBS, INITIAL_SUBMISSIONS } from '../../data/initialData';
import {
  fetchPublicJobs,
  savePublicJob,
  deletePublicJob,
  fetchAdminSubmissions,
  createAdminSubmission,
  updateAdminSubmission,
  getStoredTelegramConfig,
  saveStoredTelegramConfig,
  sendTelegramNotification,
  sendTelegramDocument,
  fetchPlatformUsers,
  updateUserPlanTier,
  blockDevice,
  fetchBlockedDevices,
  unblockDevice,
} from '../../firebase/cvService';
import { Check, ShieldCheck, Sparkles, User } from 'lucide-react';

interface JobseekerDashboardProps {
  resumes: ResumeItem[];
  coverLetters: CoverLetterItem[];
  jobs: JobItem[];
  user: { name: string; email: string } | null;
  onUpdateResumes: (resumes: ResumeItem[]) => void;
  onUpdateCoverLetters: (letters: CoverLetterItem[]) => void;
  onUpdateJobs: (jobs: JobItem[]) => void;
  onUpdateUser: (user: { name: string; email: string } | null) => void;
  onOpenResumeInBuilder: (resume: ResumeItem) => void;
  onGoToLanding: () => void;
  onLogoutUser?: () => void;
  cloudSyncStatus?: 'saved' | 'saving' | 'error' | 'offline';
  onSaveResumeItem?: (resume: ResumeItem) => void;
  onDeleteResumeItem?: (id: string) => void;
  onSaveCoverLetterItem?: (letter: CoverLetterItem) => void;
  onDeleteCoverLetterItem?: (id: string) => void;
  onSaveJobItem?: (job: JobItem) => void;
  onDeleteJobItem?: (id: string) => void;
}

export const JobseekerDashboard: React.FC<JobseekerDashboardProps> = ({
  resumes,
  coverLetters,
  jobs,
  user,
  onUpdateResumes,
  onUpdateCoverLetters,
  onUpdateJobs,
  onUpdateUser,
  onOpenResumeInBuilder,
  onGoToLanding,
  onLogoutUser,
  cloudSyncStatus = 'offline',
  onSaveResumeItem,
  onDeleteResumeItem,
  onSaveCoverLetterItem,
  onDeleteCoverLetterItem,
  onSaveJobItem,
  onDeleteJobItem,
}) => {
  const [activeSection, setActiveSection] = useState<SidebarSection>('resumes');

  // Resume Modals & State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [resumeToRename, setResumeToRename] = useState<ResumeItem | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<ResumeItem | null>(null);
  const [coverLetterToDelete, setCoverLetterToDelete] = useState<CoverLetterItem | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobItem | null>(null);

  // Cover letter & Job tracking modals
  const [activeCoverLetter, setActiveCoverLetter] = useState<CoverLetterItem | null>(null);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState<Partial<JobItem> | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  // Public Jobs & Admin Workflow State
  const [publicJobs, setPublicJobs] = useState<PublicJob[]>(INITIAL_PUBLIC_JOBS);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>(INITIAL_SUBMISSIONS);
  const [platformUsers, setPlatformUsers] = useState<UserAccountProfile[]>([]);
  const [blockedDevices, setBlockedDevices] = useState<BlockedDevice[]>([]);
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>(() => getStoredTelegramConfig());

  // Public Job & Upgrade Modals
  const [isPublicJobModalOpen, setIsPublicJobModalOpen] = useState(false);
  const [publicJobToEdit, setPublicJobToEdit] = useState<Partial<PublicJob> | null>(null);
  const [isUserUpgradeModalOpen, setIsUserUpgradeModalOpen] = useState(false);

  // Auth & Support Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Determine if the current user is Administrator
  const isAdmin = Boolean(user && (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()));

  // Guard: If not admin and active section is admin, redirect immediately
  useEffect(() => {
    if (!isAdmin && activeSection === 'admin') {
      setActiveSection('resumes');
    }
  }, [isAdmin, activeSection]);

  // Find user's plan tier from platformUsers or default to 'Free Plan'
  const currentUserProfile = platformUsers.find(
    (u) => u.email.toLowerCase() === (user?.email || '').toLowerCase()
  );
  const currentPlanTier: PlanTier = currentUserProfile?.planTier || (isAdmin ? 'Pro Plan' : 'Free Plan');

  // Load public jobs, submissions, and users on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [jobsData, subsData, usersData, blockedData] = await Promise.all([
          fetchPublicJobs(),
          fetchAdminSubmissions(),
          fetchPlatformUsers(),
          fetchBlockedDevices(),
        ]);
        if (isMounted) {
          if (jobsData && jobsData.length > 0) setPublicJobs(jobsData);
          if (subsData && subsData.length > 0) setSubmissions(subsData);
          if (usersData && usersData.length > 0) setPlatformUsers(usersData);
          setBlockedDevices(blockedData || []);
        }
      } catch (err) {
        console.warn('Initial data load warning:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // ----------------------------------------------------
  // Resume Handlers
  // ----------------------------------------------------
  const handleCreateNewResumeWithTemplate = (templateId: TemplateId, resumeTitle?: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      showToast('Please sign in to create a CV');
      return;
    }
    const chosenTmpl = TEMPLATES.find((t) => t.id === templateId);
    const newResume: ResumeItem = {
      id: `resume-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: resumeTitle || `${chosenTmpl?.name || 'New'} Resume`,
      templateId,
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
    const updated = [newResume, ...resumes];
    onUpdateResumes(updated);
    if (onSaveResumeItem) onSaveResumeItem(newResume);
    showToast(`Created resume with ${chosenTmpl?.name || 'selected'} template!`);
    onOpenResumeInBuilder(newResume);
  };

  const handleDuplicateResume = (resume: ResumeItem) => {
    if (!user) {
      setIsLoginModalOpen(true);
      showToast('Please sign in to duplicate or create a CV');
      return;
    }
    const chosenTmpl = TEMPLATES.find((t) => t.id === resume.templateId);
    const duplicated: ResumeItem = {
      ...resume,
      id: `resume-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${resume.title} (Copy)`,
      templateId: resume.templateId,
      primaryColor: resume.primaryColor || chosenTmpl?.primaryColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(resume.data)),
    };
    const updated = [duplicated, ...resumes];
    onUpdateResumes(updated);
    if (onSaveResumeItem) onSaveResumeItem(duplicated);
    showToast(`Duplicated "${resume.title}"`);
  };

  const handleConfirmDeleteResume = () => {
    if (!resumeToDelete) return;
    const targetId = resumeToDelete.id;
    const updated = resumes.filter((r) => r.id !== targetId);
    onUpdateResumes(updated);
    if (onDeleteResumeItem) onDeleteResumeItem(targetId);
    showToast(`Deleted "${resumeToDelete.title}"`);
    setResumeToDelete(null);
  };

  const handleSaveRenameResume = (id: string, newTitle: string) => {
    const target = resumes.find((r) => r.id === id);
    if (target) {
      const updatedResume = { ...target, title: newTitle, updatedAt: new Date().toISOString() };
      const updated = resumes.map((r) => (r.id === id ? updatedResume : r));
      onUpdateResumes(updated);
      if (onSaveResumeItem) onSaveResumeItem(updatedResume);
    }
    showToast(`Renamed to "${newTitle}"`);
  };

  // ----------------------------------------------------
  // Cover Letter Handlers
  // ----------------------------------------------------
  const handleCreateNewCoverLetter = () => {
    const newLetter: CoverLetterItem = {
      id: `cl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `Cover Letter ${coverLetters.length + 1}`,
      recipientName: 'Hiring Team',
      companyName: 'Company Name',
      jobTitle: 'Position Role',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      senderName: user?.name || 'Candidate',
      senderEmail: user?.email || 'myemail@example.com',
      senderPhone: '+1 (555) 019-2834',
      senderAddress: 'San Francisco, CA',
      body: `Dear Hiring Team,\n\nI am thrilled to submit my application for the Position Role at Company Name. With my background in high-impact problem solving and dedicated work ethic, I am confident in adding immediate value to your team.\n\nThank you for your time and consideration.\n\nSincerely,\n${user?.name || 'Candidate'}`,
    };
    setActiveCoverLetter(newLetter);
    setIsCoverLetterModalOpen(true);
  };

  const handleSaveCoverLetter = (updatedLetter: CoverLetterItem) => {
    const exists = coverLetters.some((c) => c.id === updatedLetter.id);
    let updatedList: CoverLetterItem[];
    if (exists) {
      updatedList = coverLetters.map((c) => (c.id === updatedLetter.id ? updatedLetter : c));
    } else {
      updatedList = [updatedLetter, ...coverLetters];
    }
    onUpdateCoverLetters(updatedList);
    if (onSaveCoverLetterItem) onSaveCoverLetterItem(updatedLetter);
    showToast('Cover letter saved!');
  };

  const handleConfirmDeleteCoverLetter = () => {
    if (!coverLetterToDelete) return;
    const targetId = coverLetterToDelete.id;
    onUpdateCoverLetters(coverLetters.filter((c) => c.id !== targetId));
    if (onDeleteCoverLetterItem) onDeleteCoverLetterItem(targetId);
    showToast(`Deleted "${coverLetterToDelete.title}"`);
    setCoverLetterToDelete(null);
  };

  // ----------------------------------------------------
  // Personal Job Pipeline Tracker Handlers
  // ----------------------------------------------------
  const handleSaveTrackedJob = (jobToSave: JobItem) => {
    const exists = jobs.some((j) => j.id === jobToSave.id);
    let updatedList: JobItem[];
    if (exists) {
      updatedList = jobs.map((j) => (j.id === jobToSave.id ? jobToSave : j));
    } else {
      updatedList = [jobToSave, ...jobs];
    }
    onUpdateJobs(updatedList);
    if (onSaveJobItem) onSaveJobItem(jobToSave);
    showToast('Job saved to your tracker!');
  };

  const handleConfirmDeleteTrackedJob = () => {
    if (!jobToDelete) return;
    const targetId = jobToDelete.id;
    onUpdateJobs(jobs.filter((j) => j.id !== targetId));
    if (onDeleteJobItem) onDeleteJobItem(targetId);
    showToast('Removed job from tracker');
    setJobToDelete(null);
  };

  const handleUpdateJobStatus = (id: string, status: JobItem['status']) => {
    const target = jobs.find((j) => j.id === id);
    if (target) {
      const updatedJob = { ...target, status, updatedAt: new Date().toISOString() };
      const updated = jobs.map((j) => (j.id === id ? updatedJob : j));
      onUpdateJobs(updated);
      if (onSaveJobItem) onSaveJobItem(updatedJob);
    }
    showToast(`Moved to ${status}`);
  };

  // ----------------------------------------------------
  // Public Job Board Handlers (Admin vs User)
  // ----------------------------------------------------
  const handleSavePublicJob = async (job: PublicJob) => {
    await savePublicJob(job);
    setPublicJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      return exists ? prev.map((j) => (j.id === job.id ? job : j)) : [job, ...prev];
    });
    setIsPublicJobModalOpen(false);
    setPublicJobToEdit(null);
    showToast(`Job "${job.title}" published successfully!`);
  };

  const handleDeletePublicJob = async (jobId: string) => {
    await deletePublicJob(jobId);
    setPublicJobs((prev) => prev.filter((j) => j.id !== jobId));
    showToast('Public job posting removed');
  };

  const handleUserSubmitJobProposal = async (proposalData: any) => {
    const newSubmission: AdminSubmission = {
      id: `sub-job-${Date.now()}`,
      userId: user?.email || 'guest',
      userEmail: user?.email || 'user@example.com',
      userName: user?.name || 'JobCraft Contributor',
      type: 'job_posting',
      title: `Job Posting Proposal: ${proposalData.title || 'New Vacancy'} at ${proposalData.company || 'Company'}`,
      details: proposalData.description || 'Employer vacancy submission submitted by user.',
      data: proposalData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      telegramSent: false,
    };

    await createAdminSubmission(newSubmission);
    setSubmissions((prev) => [newSubmission, ...prev]);
    setIsPublicJobModalOpen(false);
    setPublicJobToEdit(null);
    showToast('Your job submission has been sent to Admin for review!');
  };

  // ----------------------------------------------------
  // User Plan Upgrade Workflow
  // ----------------------------------------------------
  const handleUserSubmitUpgradeRequest = async (targetTier: PlanTier, message: string) => {
    const newSubmission: AdminSubmission = {
      id: `sub-upgrade-${Date.now()}`,
      userId: user?.email || 'guest',
      userEmail: user?.email || 'user@example.com',
      userName: user?.name || 'JobCraft Member',
      type: targetTier === 'Premium Plan' ? 'premium_upgrade' : 'pro_upgrade',
      title: `Plan Upgrade Request: ${targetTier}`,
      details: message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      telegramSent: false,
    };

    await createAdminSubmission(newSubmission);
    setSubmissions((prev) => [newSubmission, ...prev]);
    showToast(`Sent ${targetTier} upgrade request to Admin Dashboard!`);
  };

  // ----------------------------------------------------
  // Admin Operations: Approve, Reject, Telegram Bot
  // ----------------------------------------------------
  const handleAdminApproveSubmission = async (sub: AdminSubmission, targetTier?: PlanTier) => {
    // 1. If it was an upgrade, update user tier
    if (targetTier || sub.type === 'pro_upgrade' || sub.type === 'premium_upgrade') {
      const grantTier: PlanTier = targetTier || (sub.type === 'premium_upgrade' ? 'Premium Plan' : 'Pro Plan');
      await updateUserPlanTier(sub.userId, grantTier);
      setPlatformUsers((prev) =>
        prev.map((u) => (u.uid === sub.userId || u.email === sub.userEmail ? { ...u, planTier: grantTier } : u))
      );
    }

    // 2. If it was a job proposal, publish it to PublicJob
    if (sub.type === 'job_posting' && sub.data) {
      const newJob: PublicJob = {
        id: `job-${Date.now()}`,
        title: sub.data.title || 'New Job Opportunity',
        company: sub.data.company || 'Verified Employer',
        location: sub.data.location || 'Remote',
        workType: sub.data.workType || 'Remote',
        employmentType: sub.data.employmentType || 'Full-time',
        salary: sub.data.salary || '$80,000 - $110,000 / yr',
        description: sub.data.description || sub.details,
        requirements: sub.data.requirements || ['Relevant experience', 'Strong communication skills'],
        applyUrl: sub.data.applyUrl || 'https://jobs.example.com',
        tags: sub.data.tags || ['Verified', 'Direct Apply'],
        postedBy: `Admin approved (${sub.userName})`,
        postedAt: new Date().toISOString().split('T')[0],
        status: 'active',
        featured: true,
      };
      await savePublicJob(newJob);
      setPublicJobs((prev) => [newJob, ...prev]);
    }

    // 3. Mark submission as approved
    let sentToTelegram = false;
    let sentAt: string | undefined;

    // 4. Handle Telegram notification
    if (sub.type === 'application') {
      // Job Application: Send full candidate profile and CV details to Telegram bot upon Admin Acceptance!
      const cData = sub.data || {};
      const jobTitle = cData.jobTitle || sub.title;
      const company = cData.company || 'Job Opportunity';
      const name = cData.candidateName || sub.userName;
      const email = cData.candidateGmail || sub.userEmail;
      const phone = cData.candidatePhone || 'N/A';
      const tg = cData.candidateTelegram || 'N/A';
      const cvName = cData.candidateCvName || 'Attached in Admin Portal';
      const cvSize = cData.candidateCvSize ? ` (${cData.candidateCvSize})` : '';
      const notes = cData.message || 'No candidate note provided';

      const appTelegramMsg =
        `<b>✅ [APPLICATION ACCEPTED BY ADMIN]</b>\n\n` +
        `<b>Position:</b> ${jobTitle} at ${company}\n` +
        `<b>Candidate Name:</b> ${name}\n` +
        `<b>Gmail / Email:</b> <code>${email}</code>\n` +
        `<b>Phone:</b> <code>${phone}</code>\n` +
        `<b>Telegram Contact:</b> <code>${tg}</code>\n` +
        `<b>CV Document:</b> ${cvName}${cvSize}\n\n` +
        `<b>Candidate Introduction / Note:</b>\n<i>${notes}</i>\n\n` +
        `<b>Status:</b> Approved & Forwarded by Admin\n` +
        `<b>Approved By:</b> ${ADMIN_EMAIL}\n` +
        `<b>Review Date:</b> ${new Date().toLocaleString()}`;

      if (telegramConfig.botToken?.trim() && telegramConfig.chatId?.trim()) {
        const res = await sendTelegramNotification(telegramConfig, appTelegramMsg);
        let docSent = false;
        let docError: string | undefined;

        // Also send the candidate's CV document file directly to Telegram!
        if (cData.candidateCvData) {
          const docRes = await sendTelegramDocument(
            telegramConfig,
            cData.candidateCvData,
            cData.candidateCvName || `${name.replace(/\s+/g, '_')}_CV.pdf`,
            `📄 <b>Attached Candidate CV:</b> ${cData.candidateCvName || 'Candidate CV'}\n<b>Applicant:</b> ${name}\n<b>Role:</b> ${jobTitle}`
          );
          if (docRes.success) {
            docSent = true;
          } else {
            docError = docRes.message;
          }
        }

        if (res.success || docSent) {
          sentToTelegram = true;
          sentAt = new Date().toISOString();
          showToast(`Application accepted! Candidate profile & CV document dispatched to your Telegram bot.`);
        } else {
          showToast(`Application approved, but Telegram send failed: ${res.message || docError}`);
        }
      } else {
        showToast(`Application accepted! Configure Telegram Bot in the Admin tab to receive future forwards.`);
      }
    } else if (telegramConfig.autoForwardApproved && telegramConfig.botToken && telegramConfig.chatId) {
      const messageHtml = `<b>🔔 [TAK TEMPEST ADMIN NOTIFICATION]</b>\n\n` +
        `<b>Action:</b> Approved Submission\n` +
        `<b>Type:</b> ${sub.type.toUpperCase()}\n` +
        `<b>User:</b> ${sub.userName} (<code>${sub.userEmail}</code>)\n` +
        `<b>Title:</b> ${sub.title}\n` +
        (targetTier ? `<b>Granted Tier:</b> ⭐️ ${targetTier}\n` : '') +
        `<b>Approved By:</b> ${ADMIN_EMAIL}\n` +
        `<b>Timestamp:</b> ${new Date().toLocaleString()}`;

      const res = await sendTelegramNotification(telegramConfig, messageHtml);
      if (res.success) {
        sentToTelegram = true;
        sentAt = new Date().toISOString();
      }
    }

    await updateAdminSubmission(sub.id, {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      telegramSent: sentToTelegram,
      telegramSentAt: sentAt,
    });

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? {
              ...s,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              telegramSent: sentToTelegram,
              telegramSentAt: sentAt,
            }
          : s
      )
    );
  };

  const handleAdminRejectSubmission = async (subId: string) => {
    await updateAdminSubmission(subId, {
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
    });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'rejected', reviewedAt: new Date().toISOString() } : s))
    );
  };

  const handleAdminSendToTelegram = async (sub: AdminSubmission): Promise<{ success: boolean; message?: string }> => {
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      return {
        success: false,
        message: 'Please fill in Bot Token and Chat ID in Telegram Bot Setup tab first.',
      };
    }

    let messageHtml = '';
    if (sub.type === 'application') {
      const cData = sub.data || {};
      messageHtml =
        `<b>📑 [CANDIDATE APPLICATION]</b>\n\n` +
        `<b>Position:</b> ${cData.jobTitle || sub.title}\n` +
        `<b>Company:</b> ${cData.company || 'Job Board'}\n` +
        `<b>Candidate:</b> ${cData.candidateName || sub.userName}\n` +
        `<b>Gmail / Email:</b> <code>${cData.candidateGmail || sub.userEmail}</code>\n` +
        `<b>Phone:</b> <code>${cData.candidatePhone || 'N/A'}</code>\n` +
        `<b>Telegram:</b> <code>${cData.candidateTelegram || 'N/A'}</code>\n` +
        `<b>CV Document:</b> ${cData.candidateCvName || 'Attached in Admin Portal'}\n\n` +
        `<b>Candidate Note / Message:</b>\n<i>${cData.message || 'None attached'}</i>\n\n` +
        `<b>Review Status:</b> ${sub.status.toUpperCase()}\n` +
        `<i>Forwarded from JobCraft Admin Dashboard</i>`;
    } else {
      messageHtml = `<b>📢 [TAK TEMPEST ADMIN FORWARD]</b>\n\n` +
        `<b>Title:</b> ${sub.title}\n` +
        `<b>User:</b> ${sub.userName} (<code>${sub.userEmail}</code>)\n` +
        `<b>Status:</b> ${sub.status.toUpperCase()}\n` +
        `<b>Details:</b>\n${sub.details}\n\n` +
        (sub.data?.applyUrl ? `🔗 <b>Link:</b> ${sub.data.applyUrl}\n` : '') +
        `<b>Sent via:</b> JobCraft Admin Dashboard`;
    }

    const res = await sendTelegramNotification(telegramConfig, messageHtml);
    if (sub.type === 'application' && sub.data?.candidateCvData) {
      await sendTelegramDocument(
        telegramConfig,
        sub.data.candidateCvData,
        sub.data.candidateCvName || `${(sub.data.candidateName || 'Candidate').replace(/\s+/g, '_')}_CV.pdf`,
        `📄 <b>Candidate CV File:</b> ${sub.data.candidateCvName || 'Attached CV'}\n<b>Applicant:</b> ${sub.data.candidateName || sub.userName}\n<b>Position:</b> ${sub.data.jobTitle || sub.title}`
      );
    }
    if (res.success) {
      await updateAdminSubmission(sub.id, {
        telegramSent: true,
        telegramSentAt: new Date().toISOString(),
      });
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === sub.id ? { ...s, telegramSent: true, telegramSentAt: new Date().toISOString() } : s
        )
      );
    }
    return res;
  };

  const handleAdminUpdateUserPlan = async (userId: string, tier: PlanTier) => {
    await updateUserPlanTier(userId, tier);
    setPlatformUsers((prev) => prev.map((u) => (u.uid === userId ? { ...u, planTier: tier } : u)));
  };

  const handleAdminBlockUserDevice = async (targetUser: UserAccountProfile) => {
    const deviceIds = targetUser.deviceIds || [];
    const fingerprints = targetUser.fingerprints || [];
    if (deviceIds.length === 0 && fingerprints.length === 0) {
      throw new Error(
        'No device on record for this account yet — they need to have logged in at least once.'
      );
    }
    // Block every device ID + fingerprint this account has ever logged in with.
    // Any of these values being blocked will lock the browser out, regardless of
    // which account is used to sign in.
    await blockDevice([...deviceIds, ...fingerprints], {
      reason: `Blocked via admin panel (linked to ${targetUser.email})`,
      relatedUserEmail: targetUser.email,
      deviceIds,
    });
    const refreshed = await fetchBlockedDevices();
    setBlockedDevices(refreshed);
  };

  const handleAdminUnblockDevice = async (id: string) => {
    await unblockDevice(id);
    setBlockedDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSaveTelegramConfig = (newConfig: TelegramConfig) => {
    saveStoredTelegramConfig(newConfig);
    setTelegramConfig(newConfig);
  };

  const handleTestTelegramBot = async (): Promise<{ success: boolean; message?: string }> => {
    const testMessage = `<b>🎉 Telegram Bot Connected!</b>\n\n` +
      `Your bot is successfully paired with the <b>Tak Tempest JobCraft Admin Hub</b>.\n` +
      `Admin Account: <code>${ADMIN_EMAIL}</code>\n` +
      `Time: ${new Date().toLocaleString()}`;

    return await sendTelegramNotification(telegramConfig, testMessage);
  };

  const handleTrackJobFromBoard = (publicJob: PublicJob) => {
    if (!user) {
      setIsLoginModalOpen(true);
      showToast('Please sign in to apply for jobs');
      return;
    }
    const newTracked: JobItem = {
      id: `job-track-${Date.now()}`,
      title: publicJob.title,
      company: publicJob.company,
      location: publicJob.location,
      salary: publicJob.salary,
      jobUrl: publicJob.applyUrl,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: `Applied via direct employer portal: ${publicJob.applyUrl}`,
      createdAt: new Date().toISOString(),
    };
    handleSaveTrackedJob(newTracked);
    showToast(`Added "${publicJob.title}" to your Applications pipeline!`);
  };

  const handleCandidateApplicationSubmit = async (application: CandidateApplication) => {
    if (!user) {
      setIsLoginModalOpen(true);
      showToast('Please sign in to apply for jobs');
      return;
    }
    // 1. Create a tracked job item with candidate info & CV
    const newTracked: JobItem = {
      id: `job-app-${Date.now()}`,
      title: application.jobTitle,
      company: application.company,
      location: 'Remote',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: `Applied with CV (${application.cvFileName}). Telegram: ${application.telegramHandle}.${
        application.notes ? ` Candidate note: ${application.notes}` : ''
      }`,
      candidateName: application.fullName,
      candidateGmail: application.gmail,
      candidatePhone: application.phone,
      candidateTelegram: application.telegramHandle,
      candidateCvName: application.cvFileName,
      candidateCvData: application.cvFileData,
      candidateCvType: application.cvFileType,
      candidateCvSize: application.cvFileSize,
      createdAt: new Date().toISOString(),
    };
    handleSaveTrackedJob(newTracked);

    // 2. Submit to Admin Dashboard for Admin to review and advance pipeline stage
    const newSubmission: AdminSubmission = {
      id: `sub-app-${Date.now()}`,
      userId: user?.email || application.gmail,
      userEmail: application.gmail,
      userName: application.fullName,
      type: 'application',
      title: `Job Application: ${application.fullName} for ${application.jobTitle} at ${application.company}`,
      details: `Candidate applied with contact:\n- Gmail: ${application.gmail}\n- Phone: ${application.phone}\n- Telegram: ${application.telegramHandle}\n- CV File: ${application.cvFileName} (${application.cvFileSize || ''})\n\nCover Note:\n${application.notes || 'No message attached'}`,
      data: {
        candidateName: application.fullName,
        candidateGmail: application.gmail,
        candidatePhone: application.phone,
        candidateTelegram: application.telegramHandle,
        candidateCvName: application.cvFileName,
        candidateCvData: application.cvFileData,
        candidateCvType: application.cvFileType,
        candidateCvSize: application.cvFileSize,
        jobId: application.publicJobId,
        jobTitle: application.jobTitle,
        company: application.company,
        message: application.notes,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      telegramSent: false,
    };

    await createAdminSubmission(newSubmission);
    setSubmissions((prev) => [newSubmission, ...prev]);

    // Note: Sent to Admin Dashboard first for review!
    // When admin accepts the application in Admin Hub, it is dispatched to Telegram.
    showToast(`Application submitted to Admin Dashboard for review!`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onNewResume={() => setIsTemplateModalOpen(true)}
        onNewCoverLetter={handleCreateNewCoverLetter}
        onNewJob={() => {
          if (isAdmin) {
            setPublicJobToEdit(null);
            setIsPublicJobModalOpen(true);
          } else {
            setActiveJob({});
            setIsJobModalOpen(true);
          }
        }}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        user={user}
        onLogout={() => {
          if (onLogoutUser) {
            onLogoutUser();
          } else {
            onUpdateUser(null);
          }
          showToast('Signed out');
        }}
        onGoToLanding={onGoToLanding}
        resumeCount={resumes.length}
        coverLetterCount={coverLetters.length}
        jobCount={publicJobs.length}
        applicationsCount={jobs.filter((j) => j.status !== 'saved' && !['job-1', 'job-2', 'job-3'].includes(j.id)).length}
        cloudSyncStatus={cloudSyncStatus}
        isAdmin={isAdmin}
        pendingSubmissionsCount={submissions.filter((s) => s.status === 'pending').length}
        planTier={currentPlanTier}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
        {/* RESUMES VIEW */}
        {(activeSection === 'resumes' || activeSection === 'dashboard' || activeSection === 'cover-letters') && (
          <ResumesView
            resumes={resumes}
            onCreateNew={() => setIsTemplateModalOpen(true)}
            onEditResume={onOpenResumeInBuilder}
            onDuplicateResume={handleDuplicateResume}
            onDeleteResume={(resume) => setResumeToDelete(resume)}
            onRenameResume={(r) => setResumeToRename(r)}
          />
        )}

        {/* PUBLIC JOBS BOARD */}
        {activeSection === 'jobs' && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <JobsBoardView
                jobs={publicJobs}
                resumes={resumes}
                isAdmin={isAdmin}
                onPostJob={() => {
                  setPublicJobToEdit(null);
                  setIsPublicJobModalOpen(true);
                }}
                onEditJob={(job) => {
                  setPublicJobToEdit(job);
                  setIsPublicJobModalOpen(true);
                }}
                onDeleteJob={handleDeletePublicJob}
                onRequestUpgrade={() => setIsUserUpgradeModalOpen(true)}
                onSuggestJob={() => {
                  setPublicJobToEdit(null);
                  setIsPublicJobModalOpen(true);
                }}
                userEmail={user?.email}
                userName={user?.name}
                onSubmitCandidateApplication={handleCandidateApplicationSubmit}
                onApplyWithResume={(job, resumeId) => {
                  showToast(`Resume attached! Opening application link...`);
                  handleTrackJobFromBoard(job);
                }}
                onTrackJobApplication={handleTrackJobFromBoard}
                onRequestLogin={() => setIsLoginModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* APPLICATIONS VIEW - ONLY SHOWS JOBS YOU APPLY TO */}
        {activeSection === 'applications' && (
          <ApplicationsView
            jobs={jobs}
            resumes={resumes}
            onAddJob={() => {
              setActiveJob({ status: 'applied' });
              setIsJobModalOpen(true);
            }}
            onEditJob={(job) => {
              setActiveJob(job);
              setIsJobModalOpen(true);
            }}
            onDeleteJob={(id) => {
              const job = jobs.find((j) => j.id === id);
              if (job) setJobToDelete(job);
            }}
            onUpdateJobStatus={handleUpdateJobStatus}
            isAdmin={isAdmin}
            isLoggedIn={Boolean(user)}
            onRequestLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* ADMIN DASHBOARD VIEW */}
        {activeSection === 'admin' && isAdmin && (
          <AdminDashboardView
            submissions={submissions}
            users={platformUsers}
            publicJobs={publicJobs}
            telegramConfig={telegramConfig}
            onSaveTelegramConfig={handleSaveTelegramConfig}
            onTestTelegramBot={handleTestTelegramBot}
            onApproveSubmission={handleAdminApproveSubmission}
            onRejectSubmission={handleAdminRejectSubmission}
            onSendToTelegram={handleAdminSendToTelegram}
            onUpdateUserPlan={handleAdminUpdateUserPlan}
            onBlockUserDevice={handleAdminBlockUserDevice}
            blockedDevices={blockedDevices}
            onUnblockDevice={handleAdminUnblockDevice}
            onPostNewJob={() => {
              setPublicJobToEdit(null);
              setIsPublicJobModalOpen(true);
            }}
            onEditJob={(job) => {
              setPublicJobToEdit(job);
              setIsPublicJobModalOpen(true);
            }}
            onDeleteJob={handleDeletePublicJob}
          />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Template Picker */}
      <TemplatePickerModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleCreateNewResumeWithTemplate}
      />

      {/* 2. Rename Resume */}
      <RenameResumeModal
        isOpen={Boolean(resumeToRename)}
        resume={resumeToRename}
        onClose={() => setResumeToRename(null)}
        onRename={handleSaveRenameResume}
      />

      {/* 3. Delete Modals */}
      <DeleteConfirmModal
        isOpen={Boolean(resumeToDelete)}
        title="Delete Resume"
        itemName={resumeToDelete?.title || 'Resume'}
        itemType="resume"
        onClose={() => setResumeToDelete(null)}
        onConfirm={handleConfirmDeleteResume}
      />

      <DeleteConfirmModal
        isOpen={Boolean(coverLetterToDelete)}
        title="Delete Cover Letter"
        itemName={coverLetterToDelete?.title || 'Cover Letter'}
        itemType="cover letter"
        onClose={() => setCoverLetterToDelete(null)}
        onConfirm={handleConfirmDeleteCoverLetter}
      />

      <DeleteConfirmModal
        isOpen={Boolean(jobToDelete)}
        title="Delete Job"
        itemName={`${jobToDelete?.company || ''} - ${jobToDelete?.title || 'Job'}`}
        itemType="job application"
        onClose={() => setJobToDelete(null)}
        onConfirm={handleConfirmDeleteTrackedJob}
      />

      {/* 4. Cover Letter Modal */}
      <CoverLetterEditorModal
        isOpen={isCoverLetterModalOpen}
        letter={activeCoverLetter}
        onClose={() => {
          setIsCoverLetterModalOpen(false);
          setActiveCoverLetter(null);
        }}
        onSave={handleSaveCoverLetter}
      />

      {/* 5. Tracked Job Modal */}
      <JobEditModal
        isOpen={isJobModalOpen}
        job={activeJob}
        resumes={resumes}
        onClose={() => {
          setIsJobModalOpen(false);
          setActiveJob(null);
        }}
        onSave={handleSaveTrackedJob}
        isAdmin={isAdmin}
      />

      {/* 6. Public Job Creator / Editor Modal */}
      <PublicJobModal
        isOpen={isPublicJobModalOpen}
        onClose={() => {
          setIsPublicJobModalOpen(false);
          setPublicJobToEdit(null);
        }}
        onSaveJob={handleSavePublicJob}
        initialJob={publicJobToEdit}
        isAdmin={isAdmin}
        userEmail={user?.email}
        userName={user?.name}
        onUserSubmitProposal={handleUserSubmitJobProposal}
      />

      {/* 7. User Upgrade Modal */}
      <UserUpgradeModal
        isOpen={isUserUpgradeModalOpen}
        onClose={() => setIsUserUpgradeModalOpen(false)}
        userEmail={user?.email || 'user@example.com'}
        userName={user?.name || 'JobCraft Member'}
        currentTier={currentPlanTier}
        onSubmitUpgradeRequest={handleUserSubmitUpgradeRequest}
      />

      {/* 8. Global Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={
          user
            ? {
                uid: isAdmin ? 'admin-tak-001' : 'user-logged-in',
                email: user.email,
                displayName: user.name,
                isAnonymous: false,
              }
            : null
        }
        onAuthSuccess={(authResult) => {
          onUpdateUser({
            name: authResult.displayName || authResult.email?.split('@')[0] || 'User',
            email: authResult.email || '',
          });
          setIsLoginModalOpen(false);
          showToast(`Logged in as ${authResult.displayName || authResult.email}`);
        }}
      />

      {/* 9. Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
