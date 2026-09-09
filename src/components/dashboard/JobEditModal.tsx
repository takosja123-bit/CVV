import React, { useState } from 'react';
import {
  X,
  Briefcase,
  DollarSign,
  MapPin,
  Link as LinkIcon,
  FileText,
  Lock,
  ShieldCheck,
  Building,
  User,
  Mail,
  Phone,
  Send,
  Download,
  ExternalLink,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { JobItem, ResumeItem } from '../../types';

interface JobEditModalProps {
  job: Partial<JobItem> | null;
  resumes: ResumeItem[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: JobItem) => void;
  isAdmin: boolean;
}

const STAGE_LABELS: Record<JobItem['status'], { label: string; color: string; bg: string }> = {
  saved: { label: 'Saved / Bookmarked', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' },
  applied: { label: 'Application Submitted', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  interviewing: { label: 'Interview Scheduled / In Progress', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  offered: { label: 'Job Offer Received', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  rejected: { label: 'Archived / Not Selected', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
};

export const JobEditModal: React.FC<JobEditModalProps> = ({
  job,
  resumes,
  isOpen,
  onClose,
  onSave,
  isAdmin,
}) => {
  if (!isOpen || !job) return null;

  const [formData, setFormData] = useState<Partial<JobItem>>({
    id: job.id || `job-${Date.now()}`,
    title: job.title || '',
    company: job.company || '',
    location: job.location || '',
    salary: job.salary || '',
    status: job.status || 'applied',
    appliedDate: job.appliedDate || new Date().toISOString().split('T')[0],
    notes: job.notes || '',
    jobUrl: job.jobUrl || '',
    resumeUsedId: job.resumeUsedId || (resumes[0]?.id || ''),
    candidateName: job.candidateName || '',
    candidateGmail: job.candidateGmail || '',
    candidatePhone: job.candidatePhone || '',
    candidateTelegram: job.candidateTelegram || '',
    candidateCvName: job.candidateCvName || '',
    candidateCvData: job.candidateCvData || '',
    candidateCvType: job.candidateCvType || 'pdf',
    candidateCvSize: job.candidateCvSize || '',
    imageUrl: job.imageUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onClose();
      return;
    }
    if (!formData.title || !formData.company) {
      alert('Please provide at least a Job Title and Company.');
      return;
    }
    onSave(formData as JobItem);
    onClose();
  };

  const handleDownloadCv = () => {
    if (!formData.candidateCvData) return;
    const link = document.createElement('a');
    link.href = formData.candidateCvData;
    link.download = formData.candidateCvName || 'Candidate_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentStageInfo = STAGE_LABELS[formData.status || 'applied'] || STAGE_LABELS.applied;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold ${
                isAdmin ? 'bg-amber-600' : 'bg-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{isAdmin ? 'Edit Job Application' : 'View Job Application'}</span>
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin Editor
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-500" /> View Only
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isAdmin
                  ? 'Administrator control: update fields and manage pipeline stages.'
                  : 'JobifyCV applicant read-only view: only administrators can edit pipeline stages.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View-Only Banner for Non-Admins */}
        {!isAdmin && (
          <div className="bg-amber-50/70 border-b border-amber-200/80 px-6 py-2.5 flex items-center gap-2.5 text-xs text-amber-900 shrink-0">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Application Locked:</strong> You are viewing this application in read-only mode. Pipeline stage updates and revisions are managed exclusively by the Administrator.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Job Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin
                    ? 'border-slate-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-800 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                placeholder="e.g. Google / Stripe"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin
                    ? 'border-slate-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-800 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                disabled={!isAdmin}
                placeholder="e.g. Remote / Singapore"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin
                    ? 'border-slate-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-800 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                disabled={!isAdmin}
                placeholder="e.g. $90k - $120k / year"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin
                    ? 'border-slate-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-800 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          {/* Pipeline Stage */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">
                Application Pipeline Stage
              </label>
              {!isAdmin && (
                <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Admin Controlled
                </span>
              )}
            </div>

            {isAdmin ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'applied', label: 'Applied', active: 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs ring-2 ring-blue-600/30' },
                    { id: 'interviewing', label: 'Interviewing', active: 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs ring-2 ring-amber-500/30' },
                    { id: 'offered', label: 'Offer Received', active: 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs ring-2 ring-emerald-600/30' },
                    { id: 'rejected', label: 'Archived', active: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-2 ring-rose-600/30' },
                  ].map((opt) => {
                    const isSelected = formData.status === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            status: opt.id as JobItem['status'],
                          })
                        }
                        className={`py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected
                            ? `${opt.active}`
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-400'}`}></span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${currentStageInfo.bg}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span className={`font-bold ${currentStageInfo.color}`}>
                    {currentStageInfo.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Read-Only</span>
              </div>
            )}
          </div>

          {/* Candidate Contact & CV Info (if attached) */}
          {(formData.candidateName || formData.candidateGmail || formData.candidateTelegram || formData.candidateCvName) && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  Candidate Application Profile
                </span>
                {formData.candidateTelegram && (
                  <a
                    href={
                      formData.candidateTelegram.startsWith('http')
                        ? formData.candidateTelegram
                        : `https://t.me/${formData.candidateTelegram.replace('@', '')}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded border border-sky-200"
                  >
                    <Send className="w-3 h-3" />
                    <span>Telegram Contact</span>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
                {formData.candidateName && (
                  <div>
                    <span className="text-slate-400">Name: </span>
                    <strong className="text-slate-800">{formData.candidateName}</strong>
                  </div>
                )}
                {formData.candidateGmail && (
                  <div>
                    <span className="text-slate-400">Gmail: </span>
                    <a
                      href={`mailto:${formData.candidateGmail}`}
                      className="text-amber-700 underline font-mono"
                    >
                      {formData.candidateGmail}
                    </a>
                  </div>
                )}
                {formData.candidatePhone && (
                  <div>
                    <span className="text-slate-400">Phone: </span>
                    <a href={`tel:${formData.candidatePhone}`} className="text-slate-800 font-mono">
                      {formData.candidatePhone}
                    </a>
                  </div>
                )}
                {formData.candidateTelegram && (
                  <div>
                    <span className="text-slate-400">Telegram: </span>
                    <strong className="text-sky-700 font-mono">{formData.candidateTelegram}</strong>
                  </div>
                )}
              </div>

              {formData.candidateCvName && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                      {formData.candidateCvName}
                    </span>
                    {formData.candidateCvSize && (
                      <span className="text-[10px] text-slate-400">({formData.candidateCvSize})</span>
                    )}
                  </div>
                  {formData.candidateCvData && (
                    <button
                      type="button"
                      onClick={handleDownloadCv}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      <span>Download CV</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Job URL & Linked Resume */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Employer Job Listing URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  disabled={!isAdmin}
                  placeholder="https://company.com/jobs/123"
                  value={formData.jobUrl}
                  onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isAdmin
                      ? 'border-slate-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white font-mono'
                      : 'border-slate-200 bg-slate-50 text-slate-800 font-mono cursor-not-allowed'
                  }`}
                />
                {formData.jobUrl && (
                  <a
                    href={formData.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2.5 top-2.5 text-blue-600 hover:text-blue-800"
                    title="Open employer website link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Linked CV Builder Resume
              </label>
              {isAdmin ? (
                <select
                  value={formData.resumeUsedId}
                  onChange={(e) =>
                    setFormData({ ...formData, resumeUsedId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- None --</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  value={
                    resumes.find((r) => r.id === formData.resumeUsedId)?.title ||
                    formData.candidateCvName ||
                    'Attached Resume'
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 cursor-not-allowed"
                />
              )}
            </div>
          </div>

          {/* Notes & Follow-ups */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Notes & Follow-ups
            </label>
            <textarea
              rows={3}
              disabled={!isAdmin}
              placeholder="Interview notes, contacts, compensation notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={`w-full p-2.5 border rounded-lg ${
                isAdmin
                  ? 'border-slate-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white'
                  : 'border-slate-200 bg-slate-50 text-slate-800 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            >
              {isAdmin ? 'Cancel' : 'Close'}
            </button>
            {isAdmin && (
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-amber-950/20 cursor-pointer transition-all active:scale-[0.99]"
              >
                Save Application Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
