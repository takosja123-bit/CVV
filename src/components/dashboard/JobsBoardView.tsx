import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  ExternalLink,
  Plus,
  Building,
  CheckCircle2,
  Calendar,
  Filter,
  Tag,
  ShieldCheck,
  Edit2,
  Trash2,
  Sparkles,
  ArrowRight,
  Send,
  FileCheck,
  Globe,
  Share2,
  Bookmark,
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  Lock,
  User,
  Check,
} from 'lucide-react';
import { PublicJob, ResumeItem, CandidateApplication } from '../../types';
import { JobImageZoomModal } from './JobImageZoomModal';
import { JobApplicationModal } from './JobApplicationModal';

interface JobsBoardViewProps {
  jobs: PublicJob[];
  resumes: ResumeItem[];
  isAdmin: boolean;
  userEmail?: string;
  userName?: string;
  onPostJob: () => void;
  onEditJob: (job: PublicJob) => void;
  onDeleteJob: (jobId: string) => void;
  onRequestUpgrade: () => void;
  onSuggestJob: () => void;
  onApplyWithResume?: (job: PublicJob, resumeId: string) => void;
  onSubmitCandidateApplication?: (application: CandidateApplication) => void;
  onTrackJobApplication?: (job: PublicJob) => void;
  onRequestLogin?: () => void;
}

export const JobsBoardView: React.FC<JobsBoardViewProps> = ({
  jobs,
  resumes,
  isAdmin,
  userEmail,
  userName,
  onPostJob,
  onEditJob,
  onDeleteJob,
  onRequestUpgrade,
  onSuggestJob,
  onApplyWithResume,
  onSubmitCandidateApplication,
  onTrackJobApplication,
  onRequestLogin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState<'All' | 'Remote' | 'Hybrid' | 'Onsite'>('All');
  const [selectedJob, setSelectedJob] = useState<PublicJob | null>(jobs[0] || null);
  const [applyModalJob, setApplyModalJob] = useState<PublicJob | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string; company: string } | null>(null);
  const [appliedSuccessNotice, setAppliedSuccessNotice] = useState<string | null>(null);

  // Keep selected job updated or fallback to first
  const activeSelectedJob = selectedJob && jobs.some((j) => j.id === selectedJob.id)
    ? selectedJob
    : jobs[0] || null;

  // Filter jobs
  const filteredJobs = jobs.filter((j) => {
    // If regular user, only show active jobs; admin can see active and closed
    if (!isAdmin && j.status === 'closed') return false;

    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.tags && j.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesWorkType =
      selectedWorkType === 'All' || j.workType.toLowerCase() === selectedWorkType.toLowerCase();

    return matchesSearch && matchesWorkType;
  });

  const handleApplyExternal = (job: PublicJob) => {
    if (!userEmail) {
      onRequestLogin?.();
      return;
    }
    if (!job.applyUrl) return;
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    if (onTrackJobApplication) {
      onTrackJobApplication(job);
    }
  };

  const handleOpenApplyModal = (job: PublicJob) => {
    if (!userEmail) {
      onRequestLogin?.();
      return;
    }
    setApplyModalJob(job);
  };

  const handleApplicationSubmit = (application: CandidateApplication) => {
    if (onSubmitCandidateApplication) {
      onSubmitCandidateApplication(application);
    }
    setAppliedSuccessNotice(
      `Application for "${application.jobTitle}" sent to Admin Review! Once accepted by admin, it will be forwarded to the Telegram bot.`
    );
    setTimeout(() => {
      setAppliedSuccessNotice(null);
    }, 8000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Top Banner & Header */}
      <div className="px-8 pt-8 pb-4 shrink-0 bg-white border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Job Board & Recruitment Zone</h1>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  Admin Full Control (Posting & Posters Enabled)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isAdmin
                ? 'You have administrative control to post new jobs with PC poster flyer uploads, edit postings, and manage applicants.'
                : 'Browse verified positions, view employer recruitment posters in the Full Zoom Zone, and apply with your CV & Telegram.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin ? (
              <button
                onClick={onPostJob}
                className="h-10 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-amber-950/20 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Plus className="w-4 h-4" />
                <span>Post Job with Flyer (Admin)</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onSuggestJob}
                  className="h-10 px-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                  <span>Propose a Job</span>
                </button>
                <button
                  onClick={onRequestUpgrade}
                  className="h-10 px-3.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-amber-950/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Request Pro / VIP</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search & Work Type Filters */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, company name, skill, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0 w-full sm:w-auto overflow-x-auto">
            {(['All', 'Remote', 'Hybrid', 'Onsite'] as const).map((wt) => (
              <button
                key={wt}
                onClick={() => setSelectedWorkType(wt)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  selectedWorkType === wt
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {wt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applied Success Toast */}
      {appliedSuccessNotice && (
        <div className="px-8 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-semibold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{appliedSuccessNotice}</span>
          </div>
          <button
            onClick={() => setAppliedSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Split Pane */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Column: Job Cards List */}
        <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col gap-3 overflow-y-auto pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between px-1">
            <span>Openings ({filteredJobs.length})</span>
            <span>Click to view details</span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
              <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">No matching jobs found</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Try clearing your search filters or check back for new postings.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSelected = activeSelectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-amber-500 ring-2 ring-amber-500/10 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                        {job.featured && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{job.company}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        job.workType === 'Remote'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : job.workType === 'Hybrid'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {job.workType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-500 my-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Poster indicator badge if flyer exists */}
                  {job.imageUrl && (
                    <div className="mt-1.5 mb-2 flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/80 w-fit">
                      <ImageIcon className="w-3 h-3 text-amber-600" />
                      <span>Flyer Attached • Click to View</span>
                    </div>
                  )}

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.tags.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                      {job.tags.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{job.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Admin inline controls */}
                  {isAdmin && (
                    <div
                      className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[10px] text-slate-400 font-mono">
                        Status: <strong className="text-slate-700">{job.status}</strong>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditJob(job)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded cursor-pointer"
                          title="Edit Job"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteJob(job.id)}
                          className="p-1 hover:bg-red-50 text-red-600 rounded cursor-pointer"
                          title="Delete Job"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Job Full Details */}
        <div className="hidden md:flex flex-1 flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          {activeSelectedJob ? (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header Box */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                        {activeSelectedJob.company}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{activeSelectedJob.employmentType}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      {activeSelectedJob.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-2.5">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {activeSelectedJob.location} ({activeSelectedJob.workType})
                      </span>
                      {activeSelectedJob.salary && (
                        <span className="flex items-center gap-1.5 font-bold text-slate-800">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          {activeSelectedJob.salary}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Posted {activeSelectedJob.postedAt}
                      </span>
                    </div>
                  </div>

                  {/* Admin controls badge */}
                  {isAdmin && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onEditJob(activeSelectedJob)}
                        className="h-8 px-3 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteJob(activeSelectedJob.id)}
                        className="h-8 px-3 text-xs font-semibold bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Guest Sign-In Notice if not logged in */}
                {!userEmail && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-medium">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Sign in required to apply for this position or submit your CV.</span>
                    </div>
                    <button
                      type="button"
                      onClick={onRequestLogin}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer transition-all shrink-0"
                    >
                      Sign In to Apply
                    </button>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-3">
                  {/* DIRECT APPLY LINK: Click link to employer website that needs employee */}
                  <button
                    onClick={() => handleApplyExternal(activeSelectedJob)}
                    className="h-10 px-5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-amber-950/20 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <span>Apply on Company Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {/* DIRECT CANDIDATE APPLICATION FORM (Full Name, Gmail, Phone, CV PDF/DOCX, Telegram) */}
                  <button
                    onClick={() => handleOpenApplyModal(activeSelectedJob)}
                    className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Apply with CV & Telegram</span>
                  </button>

                  {/* View Poster Full Zone Button */}
                  {activeSelectedJob.imageUrl && (
                    <button
                      onClick={() =>
                        setZoomImage({
                          url: activeSelectedJob.imageUrl!,
                          title: activeSelectedJob.title,
                          company: activeSelectedJob.company,
                        })
                      }
                      className="h-10 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Open full interactive zoom zone"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>View Poster Zone</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-6 flex-1 text-xs">
                {/* Job Poster Flyer Banner Preview (if attached) */}
                {activeSelectedJob.imageUrl && (
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-900 relative group shadow-xs">
                    <img
                      src={activeSelectedJob.imageUrl}
                      alt={`${activeSelectedJob.title} Recruitment Poster`}
                      className="w-full max-h-64 object-cover object-center cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
                      onClick={() =>
                        setZoomImage({
                          url: activeSelectedJob.imageUrl!,
                          title: activeSelectedJob.title,
                          company: activeSelectedJob.company,
                        })
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4 pointer-events-none">
                      <div>
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Recruitment Poster & Flyer
                        </span>
                        <p className="text-xs text-white/90 font-medium mt-0.5">
                          Click image or the button below to inspect in Full Zoom Zone (Pan & Rotate)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomImage({
                            url: activeSelectedJob.imageUrl!,
                            title: activeSelectedJob.title,
                            company: activeSelectedJob.company,
                          });
                        }}
                        className="pointer-events-auto px-3 py-1.5 bg-white/95 hover:bg-white text-slate-900 font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Open Zoom Zone</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    About The Role
                  </h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {activeSelectedJob.description ||
                      'No specific job description provided. Please review details on the hiring company website.'}
                  </p>
                </div>

                {/* Requirements */}
                {activeSelectedJob.requirements && activeSelectedJob.requirements.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Key Qualifications & Requirements
                    </h3>
                    <ul className="space-y-2">
                      {activeSelectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {activeSelectedJob.tags && activeSelectedJob.tags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Target Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSelectedJob.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-xs flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Employer Notice */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-start gap-3">
                  <Globe className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-bold text-slate-800">Employer Direct Application:</span> When you click "Apply on Company Website", you will be redirected straight to the official career portal for <strong>{activeSelectedJob.company}</strong> where you can submit your portfolio and credentials directly.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Briefcase className="w-12 h-12 text-slate-200 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Select a job from the list</p>
              <p className="text-[11px] text-slate-400 mt-1">
                View complete responsibilities, salary brackets, and direct employer application links.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Job Poster Full Zoom Zone Modal */}
      <JobImageZoomModal
        isOpen={Boolean(zoomImage)}
        imageUrl={zoomImage?.url || ''}
        jobTitle={zoomImage?.title}
        companyName={zoomImage?.company}
        onClose={() => setZoomImage(null)}
      />

      {/* Direct Job Application Modal with Full Name, Gmail, Phone, CV (PDF/DOCX), and Telegram */}
      {applyModalJob && (
        <JobApplicationModal
          isOpen={Boolean(applyModalJob)}
          job={applyModalJob}
          resumes={resumes}
          userEmail={userEmail}
          userName={userName}
          onClose={() => setApplyModalJob(null)}
          onSubmitApplication={handleApplicationSubmit}
          onSubmit={handleApplicationSubmit}
          onRequestLogin={onRequestLogin}
        />
      )}
    </div>
  );
};
