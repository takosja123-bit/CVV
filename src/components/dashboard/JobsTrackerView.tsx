import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Lock,
  FileText,
} from 'lucide-react';
import { JobItem, ResumeItem } from '../../types';

interface JobsTrackerViewProps {
  jobs: JobItem[];
  resumes: ResumeItem[];
  onAddJob: () => void;
  onEditJob: (job: JobItem) => void;
  onDeleteJob: (id: string) => void;
  onUpdateJobStatus: (id: string, status: JobItem['status']) => void;
  isAdmin?: boolean;
}

const COLUMNS: { id: JobItem['status']; label: string; color: string; badgeBg: string }[] = [
  { id: 'applied', label: 'Applied', color: 'border-blue-300 text-blue-700', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'interviewing', label: 'Interviewing', color: 'border-amber-300 text-amber-700', badgeBg: 'bg-amber-100 text-amber-700' },
  { id: 'offered', label: 'Offer Received', color: 'border-emerald-300 text-emerald-700', badgeBg: 'bg-emerald-100 text-emerald-700' },
  { id: 'rejected', label: 'Archived', color: 'border-rose-300 text-rose-700', badgeBg: 'bg-rose-100 text-rose-700' },
];

export const JobsTrackerView: React.FC<JobsTrackerViewProps> = ({
  jobs,
  resumes,
  onAddJob,
  onEditJob,
  onDeleteJob,
  onUpdateJobStatus,
  isAdmin = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const appliedOnlyJobs = jobs.filter(
    (j) => j.status !== 'saved' && !['job-1', 'job-2', 'job-3'].includes(j.id)
  );

  const filteredJobs = appliedOnlyJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <div className="px-8 pt-8 pb-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Job Tracker & Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track job opportunities, interview rounds, and tailored resumes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 h-9 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-44 md:w-56 transition-all"
            />
          </div>

          <button
            onClick={onAddJob}
            className="h-9 px-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm shadow-amber-950/20 transition-all cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Job</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="p-8 flex-1 overflow-x-auto">
        <div className="flex gap-5 min-w-[1000px] items-start">
          {COLUMNS.map((col) => {
            const colJobs = filteredJobs.filter((j) => j.status === col.id);
            return (
              <div
                key={col.id}
                className="flex-1 bg-slate-100/70 border border-slate-200/90 rounded-xl p-3 min-w-[220px] flex flex-col max-h-[calc(100vh-210px)]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{col.label}</span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${col.badgeBg}`}>
                      {colJobs.length}
                    </span>
                  </div>
                </div>

                {/* Job Cards */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {colJobs.map((job) => {
                    const resumeUsed = resumes.find((r) => r.id === job.resumeUsedId);
                    return (
                      <div
                        key={job.id}
                        onClick={() => onEditJob(job)}
                        className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-xs tracking-tight group-hover:text-amber-600 transition-colors">
                            {job.title}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteJob(job.id);
                              }}
                              className="text-slate-400 hover:text-red-500 p-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs font-semibold text-slate-700 mt-1">
                          {job.company}
                        </div>

                        <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </div>
                          )}
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                        </div>

                        {job.candidateCvName && (
                          <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center justify-between">
                            <span className="flex items-center gap-1 font-semibold truncate">
                              <FileText className="w-3 h-3" />
                              <span className="truncate">{job.candidateCvName}</span>
                            </span>
                            {job.candidateTelegram && (
                              <span className="text-sky-600 font-mono text-[9px] shrink-0 font-bold">
                                {job.candidateTelegram}
                              </span>
                            )}
                          </div>
                        )}

                        {job.notes && (
                          <p className="mt-2 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 line-clamp-2">
                            {job.notes}
                          </p>
                        )}

                        {/* Status Mover Dropdown (Admin only) or Stage Badge (JobifyCV Candidate) */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          {isAdmin ? (
                            <select
                              value={job.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                onUpdateJobStatus(job.id, e.target.value as JobItem['status'])
                              }
                              className="text-[10px] font-semibold bg-amber-50/70 border border-amber-200 rounded px-2 py-0.5 text-amber-900 focus:outline-none cursor-pointer"
                              title="Admin: Advance or modify pipeline stage"
                            >
                              <option value="saved">Saved</option>
                              <option value="applied">Applied</option>
                              <option value="interviewing">Interviewing</option>
                              <option value="offered">Offer</option>
                              <option value="rejected">Archived</option>
                            </select>
                          ) : (
                            <span
                              className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200/80 rounded px-2 py-0.5 flex items-center gap-1"
                              title="Stage is managed and updated by the Administrator"
                            >
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                              <span className="capitalize">{job.status}</span>
                            </span>
                          )}

                          {job.jobUrl && (
                            <a
                              href={job.jobUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                            >
                              <span>Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {colJobs.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs border-2 border-dashed border-slate-200/60 rounded-lg">
                      No jobs
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
