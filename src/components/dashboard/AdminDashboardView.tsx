import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Crown,
  Sparkles,
  Bot,
  Key,
  MessageSquare,
  Plus,
  Briefcase,
  Users,
  Check,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Edit2,
  Trash2,
  Settings,
  HelpCircle,
  Eye,
  EyeOff,
  Download,
  FileText,
  Phone,
  Mail,
  User,
  X,
  Ban,
  ShieldOff,
} from 'lucide-react';
import {
  AdminSubmission,
  PublicJob,
  UserAccountProfile,
  TelegramConfig,
  PlanTier,
  ADMIN_EMAIL,
  BlockedDevice,
} from '../../types';

interface AdminDashboardViewProps {
  submissions: AdminSubmission[];
  users: UserAccountProfile[];
  publicJobs: PublicJob[];
  telegramConfig: TelegramConfig;
  onSaveTelegramConfig: (config: TelegramConfig) => void;
  onTestTelegramBot: () => Promise<{ success: boolean; message?: string }>;
  onApproveSubmission: (sub: AdminSubmission, targetTier?: PlanTier) => Promise<void>;
  onRejectSubmission: (subId: string) => Promise<void>;
  onSendToTelegram: (sub: AdminSubmission) => Promise<{ success: boolean; message?: string }>;
  onUpdateUserPlan: (userId: string, tier: PlanTier) => Promise<void>;
  onBlockUserDevice: (user: UserAccountProfile) => Promise<void>;
  blockedDevices: BlockedDevice[];
  onUnblockDevice: (id: string) => Promise<void>;
  onPostNewJob: () => void;
  onEditJob: (job: PublicJob) => void;
  onDeleteJob: (jobId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  submissions,
  users,
  publicJobs,
  telegramConfig,
  onSaveTelegramConfig,
  onTestTelegramBot,
  onApproveSubmission,
  onRejectSubmission,
  onSendToTelegram,
  onUpdateUserPlan,
  onBlockUserDevice,
  blockedDevices,
  onUnblockDevice,
  onPostNewJob,
  onEditJob,
  onDeleteJob,
}) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'users' | 'blocked' | 'telegram' | 'jobs'>('submissions');
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Telegram settings local state
  const [botToken, setBotToken] = useState(telegramConfig.botToken || '');
  const [chatId, setChatId] = useState(telegramConfig.chatId || '');
  const [autoForward, setAutoForward] = useState(telegramConfig.autoForwardApproved);
  const [showToken, setShowToken] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [confirmBlockUser, setConfirmBlockUser] = useState<UserAccountProfile | null>(null);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  const handleUnblock = async (id: string) => {
    setUnblockingId(id);
    try {
      await onUnblockDevice(id);
      setActionFeedback('Device unblocked.');
    } catch (err: any) {
      setActionFeedback(err?.message || 'Failed to unblock device.');
    } finally {
      setUnblockingId(null);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleBlockDevice = async (u: UserAccountProfile) => {
    setBlockingUserId(u.uid);
    try {
      await onBlockUserDevice(u);
      setActionFeedback(`Device(s) linked to ${u.email} have been blocked.`);
    } catch (err: any) {
      setActionFeedback(err?.message || 'Failed to block device.');
    } finally {
      setBlockingUserId(null);
      setConfirmBlockUser(null);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };
  const [previewCv, setPreviewCv] = useState<{
    candidateName: string;
    candidateEmail: string;
    jobTitle: string;
    fileName: string;
    fileSize?: string;
    fileType?: string;
    fileData: string;
  } | null>(null);

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === 'all') return true;
    return s.status === submissionFilter;
  });

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTelegramConfig({
      botToken: botToken.trim(),
      chatId: chatId.trim(),
      autoForwardApproved: autoForward,
    });
    setActionFeedback('Telegram bot settings saved successfully!');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleTestBot = async () => {
    // First save current values
    onSaveTelegramConfig({
      botToken: botToken.trim(),
      chatId: chatId.trim(),
      autoForwardApproved: autoForward,
    });

    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTestTelegramBot();
      setTestResult({
        success: res.success,
        message: res.success
          ? 'Test message delivered to Telegram bot successfully!'
          : res.message || 'Failed to send test message to Telegram.',
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Error communicating with Telegram Bot API.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleApproveWithNotification = async (sub: AdminSubmission, targetTier?: PlanTier) => {
    await onApproveSubmission(sub, targetTier);
    setActionFeedback(`Approved request for ${sub.userName} (${targetTier || 'Job approved'})!`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleRejectWithNotification = async (subId: string) => {
    await onRejectSubmission(subId);
    setActionFeedback('Submission rejected.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleManualTelegramSend = async (sub: AdminSubmission) => {
    const res = await onSendToTelegram(sub);
    if (res.success) {
      setActionFeedback(`Forwarded "${sub.title}" to Telegram bot!`);
    } else {
      setActionFeedback(`Telegram error: ${res.message}`);
    }
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleGrantUserTier = async (userId: string, userName: string, tier: PlanTier) => {
    await onUpdateUserPlan(userId, tier);
    setActionFeedback(`Updated ${userName} to ${tier}!`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Top Header */}
      <div className="px-8 pt-8 pb-4 shrink-0 bg-white border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Admin Control Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {ADMIN_EMAIL}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review user requests, grant Pro/Premium tiers, forward notifications to your Telegram bot, and manage job board postings.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onPostNewJob}
              className="h-10 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-amber-950/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Post Public Job</span>
            </button>
          </div>
        </div>

        {/* Global Feedback notification */}
        {actionFeedback && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">{actionFeedback}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">Pending Review</div>
            <div className="text-xl font-bold text-amber-600 mt-0.5">
              {pendingSubmissions.length}
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">Active Job Posts</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">
              {publicJobs.filter((j) => j.status === 'active').length}
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">Platform Users</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">{users.length}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">Telegram Bot</div>
            <div className="text-xs font-bold mt-1.5 flex items-center gap-1">
              {telegramConfig.botToken && telegramConfig.chatId ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Configured
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Setup Needed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 border-b border-slate-200 pb-px">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'submissions'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Submissions & Upgrades</span>
            {pendingSubmissions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {pendingSubmissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users & Tier Management</span>
          </button>

          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'blocked'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldOff className="w-3.5 h-3.5" />
            <span>Blocked Devices</span>
            {blockedDevices.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold">
                {blockedDevices.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'telegram'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Telegram Bot Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Board Directory</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* TAB 1: SUBMISSIONS & UPGRADE QUEUE */}
        {activeTab === 'submissions' && (
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Filter Sub-bar */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800">
                User Requests Queue ({filteredSubmissions.length})
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSubmissionFilter(filter)}
                    className={`px-3 py-1 rounded text-xs font-medium capitalize transition-all cursor-pointer ${
                      submissionFilter === filter
                        ? 'bg-amber-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold">No submissions in this filter</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  When users request Pro/Premium or suggest jobs, they will appear here first.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((sub) => {
                  const isPending = sub.status === 'pending';
                  const isPro = sub.type === 'pro_upgrade';
                  const isPremium = sub.type === 'premium_upgrade';
                  const isJobProposal = sub.type === 'job_posting';
                  const isApplication = sub.type === 'application';

                  return (
                    <div
                      key={sub.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isPro
                                  ? 'bg-blue-100 text-blue-800'
                                  : isPremium
                                  ? 'bg-amber-100 text-amber-800'
                                  : isJobProposal
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isApplication
                                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {isPro
                                ? 'Pro Upgrade Request'
                                : isPremium
                                ? 'Premium Upgrade Request'
                                : isJobProposal
                                ? 'Employer Job Proposal'
                                : isApplication
                                ? 'Candidate Application'
                                : 'User Submission'}
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sub.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : sub.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {sub.status.toUpperCase()}
                            </span>

                            {sub.telegramSent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                                <Send className="w-2.5 h-2.5" />
                                Sent to Telegram
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 pt-1">{sub.title}</h3>

                          <div className="text-slate-500 text-[11px] flex items-center gap-2 flex-wrap">
                            <span>From: <strong>{sub.userName}</strong> ({sub.userEmail})</span>
                            <span>•</span>
                            <span>{new Date(sub.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Actions for this submission */}
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 flex-wrap">
                          {isPending && (
                            <>
                              {isApplication && (
                                <button
                                  onClick={() => handleApproveWithNotification(sub)}
                                  className="h-8 px-3.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5 transition-all active:scale-[0.98]"
                                  title="Accept candidate application and send to Telegram bot"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <Send className="w-3 h-3 text-emerald-100" />
                                  <span>Accept & Send to Telegram</span>
                                </button>
                              )}

                              {isPro && (
                                <button
                                  onClick={() => handleApproveWithNotification(sub, 'Pro Plan')}
                                  className="h-8 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Grant Pro</span>
                                </button>
                              )}

                              {isPremium && (
                                <button
                                  onClick={() => handleApproveWithNotification(sub, 'Premium Plan')}
                                  className="h-8 px-3 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
                                >
                                  <Crown className="w-3 h-3" />
                                  <span>Grant Premium</span>
                                </button>
                              )}

                              {isJobProposal && (
                                <button
                                  onClick={() => handleApproveWithNotification(sub)}
                                  className="h-8 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Publish Job</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleRejectWithNotification(sub.id)}
                                className="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {/* Combined View & Download CV button moved out to the main action bar */}
                          {isApplication && sub.data?.candidateCvData && (
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewCv({
                                  candidateName: sub.data.candidateName || sub.userName,
                                  candidateEmail: sub.data.candidateGmail || sub.userEmail,
                                  jobTitle: sub.data.jobTitle || sub.title,
                                  fileName: sub.data.candidateCvName || 'Candidate_CV.pdf',
                                  fileSize: sub.data.candidateCvSize,
                                  fileType: sub.data.candidateCvType || 'pdf',
                                  fileData: sub.data.candidateCvData,
                                });
                              }}
                              className="h-8 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                              title="View & Download candidate CV document"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <Download className="w-3.5 h-3.5 text-blue-600" />
                              <span>View & Download CV</span>
                            </button>
                          )}

                          {/* Forward or Resend to Telegram button */}
                          <button
                            onClick={() => handleManualTelegramSend(sub)}
                            className="h-8 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                            title="Send or resend notification to Telegram bot"
                          >
                            <Send className="w-3 h-3 text-sky-600" />
                            <span>{sub.telegramSent ? 'Resend to Bot' : 'Send to Bot'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Details box: Special formatted layout for Candidate Applications */}
                      {isApplication && sub.data ? (
                        <div className="mt-3.5 space-y-3">
                          {/* Candidate Contact Card */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <User className="w-3 h-3" /> Full Name
                              </span>
                              <p className="font-semibold text-slate-900">{sub.data.candidateName || sub.userName}</p>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Gmail / Email
                              </span>
                              <p className="font-semibold text-slate-900">
                                <a
                                  href={`mailto:${sub.data.candidateGmail || sub.userEmail}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {sub.data.candidateGmail || sub.userEmail}
                                </a>
                              </p>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Phone className="w-3 h-3" /> Phone Number
                              </span>
                              <p className="font-semibold text-slate-900">{sub.data.candidatePhone || 'Not provided'}</p>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Send className="w-3 h-3" /> Telegram
                              </span>
                              <p className="font-semibold text-sky-700">
                                {sub.data.candidateTelegram ? (
                                  <a
                                    href={
                                      sub.data.candidateTelegram.startsWith('http')
                                        ? sub.data.candidateTelegram
                                        : `https://t.me/${sub.data.candidateTelegram.replace('@', '')}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline flex items-center gap-1"
                                  >
                                    <span>{sub.data.candidateTelegram}</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                  </a>
                                ) : (
                                  'Not provided'
                                )}
                              </p>
                            </div>
                          </div>

                          {/* CV Document row (clickable to preview & download) */}
                          <div
                            onClick={() => {
                              if (!sub.data?.candidateCvData) return;
                              setPreviewCv({
                                candidateName: sub.data.candidateName || sub.userName,
                                candidateEmail: sub.data.candidateGmail || sub.userEmail,
                                jobTitle: sub.data.jobTitle || sub.title,
                                fileName: sub.data.candidateCvName || 'Candidate_CV.pdf',
                                fileSize: sub.data.candidateCvSize,
                                fileType: sub.data.candidateCvType || 'pdf',
                                fileData: sub.data.candidateCvData,
                              });
                            }}
                            className={`p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 flex items-center justify-between gap-3 ${
                              sub.data?.candidateCvData ? 'cursor-pointer hover:bg-slate-100/90 transition-colors group' : ''
                            }`}
                            title={sub.data?.candidateCvData ? 'Click to preview and download CV' : undefined}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-500/20 shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-800 flex items-center gap-2 truncate">
                                  <span className="truncate">{sub.data.candidateCvName || 'Candidate CV Document'}</span>
                                  {sub.data.candidateCvSize && (
                                    <span className="text-[10px] font-normal text-slate-400 shrink-0">
                                      ({sub.data.candidateCvSize})
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  Format: {(sub.data.candidateCvType || 'PDF').toUpperCase()} Document • Attached by applicant
                                </div>
                              </div>
                            </div>

                            {sub.data?.candidateCvData && (
                              <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 shrink-0">
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Preview Document</span>
                              </span>
                            )}
                          </div>

                          {/* Candidate Note if provided */}
                          {sub.data.message && (
                            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-slate-700 text-xs">
                              <span className="font-bold text-amber-900 block mb-1">Candidate Note:</span>
                              <p className="italic text-slate-700 leading-relaxed whitespace-pre-wrap">
                                "{sub.data.message}"
                              </p>
                            </div>
                          )}

                          {/* Review status notice */}
                          <div className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${
                            isPending
                              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                              : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          }`}>
                            <div className="flex items-center gap-2">
                              {isPending ? (
                                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                              <span>
                                {isPending
                                  ? 'Awaiting Admin Review. Click "Accept & Send to Telegram" to forward this applicant to the Telegram bot.'
                                  : 'Accepted by Admin. Candidate profile has been forwarded to the Telegram bot.'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Standard Details box for other submission types */
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-xs leading-relaxed">
                          {sub.details}
                          {sub.data?.applyUrl && (
                            <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-blue-600 font-mono text-[11px]">
                              <ExternalLink className="w-3 h-3" />
                              <a
                                href={sub.data.applyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline hover:text-blue-800"
                              >
                                {sub.data.applyUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USERS & PLAN TIERS */}
        {activeTab === 'users' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Registered Users & Tier Controls</h2>
                <p className="text-xs text-slate-500">
                  Give out Pro or Premium access to any user account with one click.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Current Plan</th>
                    <th className="py-3 px-4 text-right">Actions (Grant Tier)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isAdminUser = u.email === ADMIN_EMAIL || u.role === 'admin';
                    return (
                      <tr key={u.uid} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{u.name || 'User'}</div>
                          <div className="text-slate-500 text-[11px] font-mono">{u.email}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {isAdminUser ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Admin
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                              JobCraft Member
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.planTier === 'Premium Plan'
                                ? 'bg-amber-100 text-amber-800'
                                : u.planTier === 'Pro Plan'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.planTier || 'Free Plan'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleGrantUserTier(u.uid, u.name, 'Pro Plan')}
                              disabled={u.planTier === 'Pro Plan'}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded bg-blue-50 hover:bg-blue-100 text-blue-700 disabled:opacity-40 cursor-pointer"
                            >
                              Grant Pro
                            </button>
                            <button
                              onClick={() => handleGrantUserTier(u.uid, u.name, 'Premium Plan')}
                              disabled={u.planTier === 'Premium Plan'}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-50 hover:bg-amber-100 text-amber-700 disabled:opacity-40 cursor-pointer"
                            >
                              Grant Premium
                            </button>
                            <button
                              onClick={() => handleGrantUserTier(u.uid, u.name, 'Free Plan')}
                              disabled={u.planTier === 'Free Plan'}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                            >
                              Reset Free
                            </button>
                            {!isAdminUser && (
                              <button
                                onClick={() => setConfirmBlockUser(u)}
                                disabled={blockingUserId === u.uid}
                                title="Block this account's device(s) from logging in with ANY account"
                                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-red-50 hover:bg-red-100 text-red-700 disabled:opacity-40 cursor-pointer"
                              >
                                <Ban className="w-3 h-3" />
                                {blockingUserId === u.uid ? 'Blocking…' : 'Block Device'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: BLOCKED DEVICES */}
        {activeTab === 'blocked' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Blocked Devices</h2>
              <p className="text-xs text-slate-500">
                Browsers currently locked out of JobCraft, regardless of which account they try to
                sign into. Unblock removes the entry immediately.
              </p>
            </div>

            {blockedDevices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No devices are currently blocked.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                      <th className="py-3 px-4">Linked Account</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Blocked On</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {blockedDevices.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">
                            {d.relatedUserEmail || 'Unknown'}
                          </div>
                          <div className="text-slate-400 text-[10px] font-mono truncate max-w-[220px]">
                            {d.id}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              d.type === 'deviceId'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {d.type === 'deviceId' ? 'Device ID' : 'Fingerprint'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{d.reason || '—'}</td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {d.createdAt ? new Date(d.createdAt).toLocaleString() : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleUnblock(d.id)}
                            disabled={unblockingId === d.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 disabled:opacity-40 cursor-pointer"
                          >
                            <ShieldOff className="w-3 h-3" />
                            {unblockingId === d.id ? 'Unblocking…' : 'Unblock'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TELEGRAM BOT INTEGRATION */}
        {activeTab === 'telegram' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Telegram Bot Forwarder</h2>
                  <p className="text-xs text-slate-500">
                    Forward user upgrade submissions and job openings straight to your Telegram channel or bot chat.
                  </p>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              <form onSubmit={handleSaveTelegram} className="space-y-4 text-xs">
                {/* Bot Token */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telegram Bot Token <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Created via Telegram <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-600 underline">@BotFather</a>.
                  </p>
                </div>

                {/* Chat ID */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telegram Chat ID (Your User ID or Channel ID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 987654321 or @my_admin_channel"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Get your personal Chat ID from <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-sky-600 underline">@userinfobot</a> or your Telegram group ID.
                  </p>
                </div>

                {/* Auto Forward Toggle */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Auto-forward on Approval</div>
                    <div className="text-[11px] text-slate-500">
                      Instantly send Telegram alert when you approve an upgrade or job proposal
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoForward}
                    onChange={(e) => setAutoForward(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="h-10 px-5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm shadow-amber-950/20 cursor-pointer"
                  >
                    Save Bot Config
                  </button>

                  <button
                    type="button"
                    disabled={isTesting || !botToken || !chatId}
                    onClick={handleTestBot}
                    className="h-10 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-sky-500" />}
                    <span>Test Bot Connection</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Setup Instructions Card */}
            <div className="p-5 bg-sky-50 border border-sky-200 rounded-2xl text-xs space-y-2 text-sky-900">
              <div className="font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>How to set up your Telegram Bot (2 minutes):</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-sky-800 leading-relaxed">
                <li>Open Telegram and message <strong>@BotFather</strong>.</li>
                <li>Send <code>/newbot</code>, choose a name and username ending in <code>bot</code>.</li>
                <li>Copy the provided <strong>HTTP API token</strong> and paste it above into "Bot Token".</li>
                <li>Start a chat with your bot, then message <strong>@userinfobot</strong> to get your numeric <strong>Chat ID</strong>.</li>
                <li>Click <strong>"Test Bot Connection"</strong> to verify!</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 4: JOB BOARD DIRECTORY */}
        {activeTab === 'jobs' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Manage Public Job Postings</h2>
                <p className="text-xs text-slate-500">
                  Total of {publicJobs.length} job vacancies currently on the platform.
                </p>
              </div>
              <button
                onClick={onPostNewJob}
                className="h-9 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Job</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Title & Company</th>
                    <th className="py-3 px-4">Work Type</th>
                    <th className="py-3 px-4">Application Link</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {publicJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{job.title}</div>
                        <div className="text-slate-500 text-[11px]">
                          {job.company} • {job.location}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {job.workType} ({job.employmentType})
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px] max-w-[200px] truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{job.applyUrl}</span>
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            job.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {job.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditJob(job)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded cursor-pointer"
                            title="Edit Job"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteJob(job.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                            title="Delete Job"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Interactive CV Document Previewer Modal */}
      {previewCv && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {previewCv.fileName}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                    <span>Candidate: <strong>{previewCv.candidateName}</strong></span>
                    <span>•</span>
                    <span>Role: <strong>{previewCv.jobTitle}</strong></span>
                    {previewCv.fileSize && (
                      <>
                        <span>•</span>
                        <span>Size: {previewCv.fileSize}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Controls in Modal Header */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewCv.fileData}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 px-3 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Open file in a new browser window"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">New Tab</span>
                </a>

                <a
                  href={previewCv.fileData}
                  download={previewCv.fileName}
                  className="h-8 px-3 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Download candidate CV document"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewCv(null)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer ml-1"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Document Viewer Body */}
            <div className="p-4 bg-slate-100 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[500px]">
              {previewCv.fileData.startsWith('data:application/pdf') || previewCv.fileName.toLowerCase().endsWith('.pdf') ? (
                <div className="w-full h-full flex flex-col items-center flex-1">
                  <iframe
                    src={previewCv.fileData}
                    title={previewCv.fileName}
                    className="w-full h-[70vh] rounded-xl border border-slate-300 bg-white shadow-sm"
                  />
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Rendering PDF document in secure sandbox viewer.</span>
                    <span>•</span>
                    <a
                      href={previewCv.fileData}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Open full page</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ) : previewCv.fileData.startsWith('data:image/') ? (
                <div className="max-h-[72vh] overflow-auto p-2 bg-white rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
                  <img src={previewCv.fileData} alt={previewCv.fileName} className="max-h-[70vh] object-contain" />
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md w-full space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{previewCv.fileName}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This document is in <strong>{(previewCv.fileType || 'DOCX').toUpperCase()}</strong> format. You can download it directly or open it in your desktop Word application.
                  </p>
                  <a
                    href={previewCv.fileData}
                    download={previewCv.fileName}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM BLOCK DEVICE MODAL */}
      {confirmBlockUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden">
            <div className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Ban className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Block this device?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This blocks the browser(s) <strong>{confirmBlockUser.name || confirmBlockUser.email}</strong> has
                logged in from. That browser will be locked out even if they sign up with a brand
                new account. This is a best-effort browser-level block — it can be bypassed by
                clearing browser storage or switching devices, so it deters casual repeat trolling
                rather than guaranteeing a permanent ban.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmBlockUser(null)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBlockDevice(confirmBlockUser)}
                  disabled={blockingUserId === confirmBlockUser.uid}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 cursor-pointer"
                >
                  {blockingUserId === confirmBlockUser.uid ? 'Blocking…' : 'Block Device'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
