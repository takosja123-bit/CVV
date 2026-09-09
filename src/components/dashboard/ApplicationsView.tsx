import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Building,
  FileText,
  ChevronRight,
  Lock,
  ShieldCheck,
  Send,
  LayoutList,
  Kanban,
  Trash2,
} from 'lucide-react';
import { JobItem, ResumeItem, JobStatus } from '../../types';

interface ApplicationsViewProps {
  jobs: JobItem[];
  resumes: ResumeItem[];
  onAddJob: () => void;
  onEditJob: (job: JobItem) => void;
  onDeleteJob?: (id: string) => void;
  onUpdateJobStatus?: (id: string, status: JobStatus) => void;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  onRequestLogin?: () => void;
}

const STAGES: { id: JobStatus; label: string; activeClass: string; badgeClass: string }[] = [
  { id: 'applied', label: 'Applied', activeClass: 'bg-blue-600 text-white shadow-xs', badgeClass: 'bg-blue-100 text-blue-800' },
  { id: 'interviewing', label: 'Interviewing', activeClass: 'bg-amber-500 text-white shadow-xs', badgeClass: 'bg-amber-100 text-amber-800' },
  { id: 'offered', label: 'Offer Received', activeClass: 'bg-emerald-600 text-white shadow-xs', badgeClass: 'bg-emerald-100 text-emerald-800' },
  { id: 'rejected', label: 'Archived', activeClass: 'bg-rose-600 text-white shadow-xs', badgeClass: 'bg-rose-100 text-rose-800' },
];

const BOARD_COLUMNS: { id: JobStatus; label: string; color: string; badgeBg: string }[] = [
  { id: 'applied', label: 'Applied', color: 'border-blue-300 text-blue-700', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'interviewing', label: 'Interviewing', color: 'border-amber-300 text-amber-700', badgeBg: 'bg-amber-100 text-amber-700' },
  { id: 'offered', label: 'Offer Received', color: 'border-emerald-300 text-emerald-700', badgeBg: 'bg-emerald-100 text-emerald-700' },
  { id: 'rejected', label: 'Archived', color: 'border-rose-300 text-rose-700', badgeBg: 'bg-rose-100 text-rose-700' },
];

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  jobs,
  resumes,
  onAddJob,
  onEditJob,
  onDeleteJob,
  onUpdateJobStatus,
  isAdmin = false,
  isLoggedIn = true,
  onRequestLogin,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Strictly only show jobs that have been applied to (exclude unapplied/saved wishlist and mock demo jobs)
  const appliedJobs = jobs.filter(
    (j) => j.status !== 'saved' && !['job-1', 'job-2', 'job-3'].includes(j.id)
  );

  const filtered = appliedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 min-h-screen bg-slate-50/50 flex flex-col">
      {/* Top Header */}
      <div className="px-8 pt-8 pb-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Job Applications
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {appliedJobs.length} {appliedJobs.length === 1 ? 'Applied Job' : 'Applied Jobs'}
            </span>
            {isAdmin ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin (Can Advance Stages)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" /> View-Only Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin
              ? 'Click any application to view details, add interview notes, and advance stages.'
              : 'Displays only the jobs you have applied to. Click any item to inspect details.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle: List vs Board */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              title="Table View"
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              title="Board View"
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applied jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 h-9 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-44 md:w-52 transition-all"
            />
          </div>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                onRequestLogin?.();
                return;
              }
              onAddJob();
            }}
            className="h-9 px-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm shadow-amber-950/20 transition-all cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Application</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table or Board */}
      {viewMode === 'list' ? (
        <div className="p-8 flex-1">
          <div className="max-w-5xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-4">Company & Position</div>
              <div className="col-span-5">Application Stage</div>
              <div className="col-span-2">CV & Contact</div>
              <div className="col-span-1 text-right">Applied Date</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filtered.map((job) => {
                const resumeUsed = resumes.find((r) => r.id === job.resumeUsedId);
                return (
                  <div
                    key={job.id}
                    onClick={() => onEditJob(job)}
                    className="px-5 py-4 hover:bg-slate-50/80 grid grid-cols-12 items-center gap-2 transition-colors group cursor-pointer"
                  >
                    <div className="col-span-4 min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate group-hover:text-amber-600 transition-colors">
                        {job.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{job.company}</span>
                        {job.location && <span>• {job.location}</span>}
                      </div>
                    </div>

                    <div className="col-span-5">
                      {isAdmin ? (
                        <div
                          className="inline-flex items-center p-1 bg-slate-100/90 rounded-lg border border-slate-200 shadow-2xs gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {STAGES.map((st) => {
                            const isActive = job.status === st.id;
                            return (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => onUpdateJobStatus?.(job.id, st.id)}
                                title={`Set status to ${st.label}`}
                                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                                  isActive
                                    ? st.activeClass
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                                }`}
                              >
                                {st.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                            job.status === 'interviewing'
                              ? 'bg-amber-100 text-amber-800'
                              : job.status === 'offered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : job.status === 'applied'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>
                            {job.status === 'rejected'
                              ? 'Archived'
                              : job.status === 'offered'
                              ? 'Offer Received'
                              : job.status === 'interviewing'
                              ? 'Interviewing'
                              : 'Applied'}
                          </span>
                          <Lock className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                        </span>
                      )}
                    </div>

                    <div className="col-span-2 text-xs text-slate-600 truncate flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        {job.candidateCvName || (resumeUsed ? resumeUsed.title : 'Attached CV')}
                      </span>
                      {job.candidateTelegram && (
                        <span className="text-[10px] text-sky-600 font-mono font-semibold flex items-center gap-0.5">
                          <Send className="w-2.5 h-2.5" />
                          {job.candidateTelegram}
                        </span>
                      )}
                    </div>

                    <div className="col-span-1 text-right text-xs text-slate-400 flex items-center justify-end gap-1">
                      <span className="truncate">{job.appliedDate || 'Recently'}</span>
                      {onDeleteJob && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteJob(job.id);
                          }}
                          title="Remove application"
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="py-14 text-center text-slate-400 text-xs">
                  No submitted applications found. Apply to jobs on the Job Board to track them here.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Board / Kanban View */
        <div className="p-8 flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-[900px] items-start">
            {BOARD_COLUMNS.map((col) => {
              const colJobs = filtered.filter((j) => j.status === col.id);
              return (
                <div
                  key={col.id}
                  className="flex-1 bg-slate-100/70 border border-slate-200/90 rounded-xl p-3 min-w-[210px] flex flex-col max-h-[calc(100vh-210px)]"
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-slate-800">{col.label}</span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${col.badgeBg}`}>
                      {colJobs.length}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                    {colJobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => onEditJob(job)}
                        className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-bold text-slate-900 text-xs tracking-tight group-hover:text-amber-600 transition-colors">
                            {job.title}
                          </h4>
                          {onDeleteJob && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteJob(job.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <div className="text-xs font-medium text-slate-700 mt-1">
                          {job.company}
                        </div>

                        {job.location && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {job.location}
                          </div>
                        )}

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{job.appliedDate || 'Applied'}</span>
                          {job.candidateCvName && (
                            <span className="text-emerald-600 font-medium truncate max-w-[100px]">
                              {job.candidateCvName}
                            </span>
                          )}
                        </div>

                        {/* Admin Stage Quick Button Select */}
                        {isAdmin && (
                          <div
                            className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <span>Admin Stage:</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {STAGES.map((st) => {
                                const isActive = job.status === st.id;
                                return (
                                  <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => onUpdateJobStatus?.(job.id, st.id)}
                                    title={`Set to ${st.label}`}
                                    className={`px-1.5 py-1 text-[10px] font-bold rounded text-center transition-all cursor-pointer truncate ${
                                      isActive
                                        ? st.activeClass
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                    }`}
                                  >
                                    {st.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {colJobs.length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-[11px] italic">
                        No jobs in {col.label.toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
