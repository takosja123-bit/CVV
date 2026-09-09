import React, { useState, useRef } from 'react';
import {
  X,
  Send,
  Upload,
  FileText,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  Briefcase,
  User,
  Mail,
  Phone,
  Paperclip,
  Trash2,
  Lock,
  LogIn,
} from 'lucide-react';
import { PublicJob, ResumeItem, CandidateApplication } from '../../types';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: PublicJob | null;
  resumes: ResumeItem[];
  userEmail?: string;
  userName?: string;
  onSubmitApplication?: (application: CandidateApplication) => void;
  onSubmit?: (application: CandidateApplication) => void;
  onRequestLogin?: () => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  job,
  resumes,
  userEmail,
  userName,
  onSubmitApplication,
  onSubmit,
  onRequestLogin,
}) => {
  if (!isOpen || !job) return null;

  const [fullName, setFullName] = useState(userName || '');
  const [gmail, setGmail] = useState(userEmail || '');
  const [phone, setPhone] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [notes, setNotes] = useState('');

  // CV File Upload from PC (PDF or DOCX)
  const [cvFileName, setCvFileName] = useState<string>('');
  const [cvFileSize, setCvFileSize] = useState<string>('');
  const [cvFileType, setCvFileType] = useState<'pdf' | 'docx' | 'other'>('pdf');
  const [cvFileData, setCvFileData] = useState<string>('');
  const [selectedBuilderResumeId, setSelectedBuilderResumeId] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension
    const name = file.name.toLowerCase();
    let type: 'pdf' | 'docx' | 'other' = 'other';
    if (name.endsWith('.pdf')) type = 'pdf';
    else if (name.endsWith('.docx') || name.endsWith('.doc')) type = 'docx';

    if (type === 'other') {
      setError('Please select a valid PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('File size exceeds 8MB. Please attach a smaller CV file.');
      return;
    }

    setError(null);
    setCvFileName(file.name);
    setCvFileType(type);
    setCvFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    setSelectedBuilderResumeId('');

    const reader = new FileReader();
    reader.onload = () => {
      setCvFileData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectBuilderResume = (resumeId: string) => {
    setSelectedBuilderResumeId(resumeId);
    const chosen = resumes.find((r) => r.id === resumeId);
    if (chosen) {
      setCvFileName(`${chosen.title}.pdf`);
      setCvFileType('pdf');
      setCvFileSize('CV Builder Export');
      setCvFileData('data:application/pdf;builder=' + chosen.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) {
      setError('Please sign in first before applying for this job.');
      onRequestLogin?.();
      return;
    }
    if (!fullName.trim()) {
      setError('Please provide your Full Name.');
      return;
    }
    if (!gmail.trim() || !gmail.includes('@')) {
      setError('Please provide a valid Gmail or Email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your Phone Number.');
      return;
    }
    if (!telegramHandle.trim()) {
      setError('Please provide your Telegram contact link or handle (e.g. @username or t.me/username).');
      return;
    }
    if (!cvFileName || (!cvFileData && !selectedBuilderResumeId)) {
      setError('Please upload your CV file (PDF or DOCX) or select an existing resume.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Format telegram handle if missing @ or URL
      let cleanTelegram = telegramHandle.trim();
      if (!cleanTelegram.startsWith('@') && !cleanTelegram.startsWith('http') && !cleanTelegram.includes('t.me/')) {
        cleanTelegram = `@${cleanTelegram}`;
      }

      const applicationData: CandidateApplication = {
        fullName: fullName.trim(),
        gmail: gmail.trim(),
        phone: phone.trim(),
        telegramHandle: cleanTelegram,
        cvFileName,
        cvFileType,
        cvFileSize,
        cvFileData,
        notes: notes.trim(),
        publicJobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedAt: new Date().toISOString(),
      };

      const submitCallback = onSubmitApplication || onSubmit;
      if (typeof submitCallback === 'function') {
        submitCallback(applicationData);
      }
      setIsSubmittedSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Job Application Form</h2>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-slate-700">{job.title}</span>
                <span>•</span>
                <span className="text-amber-600 font-medium">{job.company}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {isSubmittedSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center flex-1 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Application Sent for Review!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been received and placed in the <strong>Admin Dashboard</strong> review queue.
              </p>
            </div>

            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-left max-w-md w-full text-xs space-y-2 text-amber-900">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Send className="w-3.5 h-3.5 text-amber-600" />
                <span>What happens next?</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                1. The administrator will review your credentials and CV in the Admin Hub.<br />
                2. When the admin accepts your submission, your candidate profile and contact details will be dispatched immediately to the hiring Telegram bot.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-all active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!userEmail && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-amber-900">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium">Sign in required to apply for jobs and submit applications.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestLogin?.();
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

          {/* Full Name & Gmail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Gmail / Email Address *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. candidate@gmail.com"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Phone Number & Telegram Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +855 12 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Telegram Contact Link / Username *
              </label>
              <div className="relative">
                <Send className="w-3.5 h-3.5 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. @username or t.me/myname"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Admin or employer will contact you directly via Telegram regarding interview updates.
              </p>
            </div>
          </div>

          {/* CV File Upload as PDF or DOCX */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              CV File (PDF or DOCX) *
            </label>

            {/* Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                cvFileName
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                onChange={handleFileUpload}
                className="hidden"
              />

              {cvFileName ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {cvFileType}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs truncate max-w-xs">{cvFileName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span>{cvFileSize}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready to Submit
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCvFileName('');
                      setCvFileData('');
                      setCvFileSize('');
                      setSelectedBuilderResumeId('');
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-md cursor-pointer"
                    title="Remove attached file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 mb-2">
                    <Upload className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-semibold text-slate-800 text-xs">
                    Click or Drag to Upload CV from PC
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Accepted formats: <strong>PDF (.pdf)</strong> or <strong>Word Document (.docx)</strong> up to 8MB
                  </span>
                </div>
              )}
            </div>

            {/* Alternative: Select from saved resumes in CV Builder */}
            {resumes.length > 0 && !cvFileName && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Or pick from your CV Builder resumes:</span>
                </div>
                <select
                  value={selectedBuilderResumeId}
                  onChange={(e) => handleSelectBuilderResume(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
                >
                  <option value="">-- Choose from saved resumes --</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.data.personal.jobTitle || 'Resume'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Notes / Message to Employer */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Short Introduction or Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Why you're a great fit for this role, availability to interview..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              Your application credentials and CV file will be routed directly to the hiring administrator and logged to your personal <strong>Applications Pipeline</strong>.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm shadow-amber-950/20 cursor-pointer flex items-center gap-1.5 transition-all active:scale-[0.99]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);
};
