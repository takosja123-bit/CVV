import React from 'react';
import {
  FileText,
  Mail,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { ResumeItem, CoverLetterItem, JobItem, SidebarSection } from '../../types';

interface OverviewDashboardViewProps {
  resumes: ResumeItem[];
  coverLetters: CoverLetterItem[];
  jobs: JobItem[];
  onNavigateSection: (section: SidebarSection) => void;
  onCreateResume: () => void;
  onCreateCoverLetter: () => void;
  onEditResume: (resume: ResumeItem) => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({
  resumes,
  coverLetters,
  jobs,
  onNavigateSection,
  onCreateResume,
  onCreateCoverLetter,
  onEditResume,
}) => {
  const realAppliedJobs = jobs.filter(
    (j) => j.status !== 'saved' && !['job-1', 'job-2', 'job-3'].includes(j.id)
  );
  const interviewingJobs = realAppliedJobs.filter((j) => j.status === 'interviewing');
  const appliedJobs = realAppliedJobs.filter((j) => j.status === 'applied');
  const offeredJobs = realAppliedJobs.filter((j) => j.status === 'offered');

  return (
    <div className="flex-1 min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <div className="px-8 pt-8 pb-6 bg-white border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Welcome to <span>Job</span><span className="text-[#0057B8]">Craft</span>
          <span className="text-xl">✨</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Here is an overview of your career progress, active resumes, and applied job opportunities.
        </p>
      </div>

      <div className="p-8 max-w-6xl space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateSection('resumes')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-[#0057B8]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Resumes
              </span>
              <div className="p-2 rounded-lg bg-[#e6f0fb] text-[#0057B8] group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900">
              {resumes.length}
            </div>
            <div className="mt-1 text-xs text-[#0057B8] font-medium flex items-center gap-1">
              <span>View all resumes</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigateSection('cover-letters')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cover Letters
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900">
              {coverLetters.length}
            </div>
            <div className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span>View letters</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigateSection('applications')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Applications
              </span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900">
              {realAppliedJobs.length}
            </div>
            <div className="mt-1 text-xs text-amber-600 font-medium flex items-center gap-1">
              <span>{interviewingJobs.length} interviewing</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigateSection('applications')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-violet-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Offers & Wins
              </span>
              <div className="p-2 rounded-lg bg-violet-50 text-violet-600 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900">
              {offeredJobs.length}
            </div>
            <div className="mt-1 text-xs text-violet-600 font-medium flex items-center gap-1">
              <span>{appliedJobs.length} sent applications</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-gradient-to-r from-[#003d82] to-[#00807a] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#7dd3fc]" />
              <span>AI-Powered Career Toolkit</span>
            </div>
            <h3 className="text-lg font-bold">Ready to apply for your dream role?</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Create ATS-optimized resumes in 12 layout archetypes, craft customized cover letters, and track every application stage in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onCreateResume}
              className="px-4 py-2.5 bg-white hover:bg-[#eef6ff] text-[#0057B8] text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Resume</span>
            </button>
            <button
              onClick={onCreateCoverLetter}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>New Cover Letter</span>
            </button>
          </div>
        </div>

        {/* Recent Resumes Quick Carousel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Your Resumes</h3>
            <button
              onClick={() => onNavigateSection('resumes')}
              className="text-xs font-semibold text-[#0057B8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all ({resumes.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resumes.slice(0, 3).map((r) => (
              <div
                key={r.id}
                onClick={() => onEditResume(r)}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-md hover:border-[#0057B8]/40 transition-all cursor-pointer flex items-center gap-3.5 group"
              >
                <div className="w-10 h-12 rounded bg-[#e6f0fb] border border-[#cfe3f7] text-[#0057B8] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-[#0057B8] transition-colors">
                    {r.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {r.data.personal.fullName || 'Untitled'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Updated {new Date(r.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
