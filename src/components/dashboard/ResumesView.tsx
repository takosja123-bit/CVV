import React, { useState } from 'react';
import {
  LayoutGrid,
  List as ListIcon,
  Plus,
  Search,
  SlidersHorizontal,
  FileText,
  Clock,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Download,
  Filter,
  Lock,
  LogIn,
} from 'lucide-react';
import { ResumeItem, TemplateId } from '../../types';
import { ResumeCardPreview } from './ResumeCardPreview';
import { TEMPLATES } from '../../data/initialData';

interface ResumesViewProps {
  resumes: ResumeItem[];
  onCreateNew: () => void;
  onEditResume: (resume: ResumeItem) => void;
  onDuplicateResume: (resume: ResumeItem) => void;
  onDeleteResume: (resume: ResumeItem) => void;
  onRenameResume: (resume: ResumeItem) => void;
  isLoggedIn?: boolean;
  onRequestLogin?: () => void;
}


export const ResumesView: React.FC<ResumesViewProps> = ({
  resumes,
  onCreateNew,
  onEditResume,
  onDuplicateResume,
  onDeleteResume,
  onRenameResume,
  isLoggedIn = true,
  onRequestLogin,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');

  const handleCreateResumeClick = () => {
    if (!isLoggedIn) {
      if (onRequestLogin) onRequestLogin();
      return;
    }
    onCreateNew();
  };

  const filteredResumes = resumes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.data.personal.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.data.personal.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTemplate =
      filterTemplate === 'all' || r.templateId === filterTemplate;
    return matchesSearch && matchesTemplate;
  });

  return (
    <div className="flex-1 min-h-screen bg-white flex flex-col">
      {/* Top Header Row with Title and View Switcher */}
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Resumes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, customize, and export your professional resumes
          </p>
        </div>

        {/* Action Controls & View Mode Toggles */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 h-9 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-44 md:w-56 transition-all"
            />
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center h-9 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`h-full px-2.5 flex items-center justify-center transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`h-full px-2.5 flex items-center justify-center transition-colors cursor-pointer border-l border-slate-200 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCreateResumeClick}
            className="h-9 px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-950/20 transition-all cursor-pointer active:scale-[0.98]"
          >
            {isLoggedIn ? <Plus className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>New Resume</span>
          </button>
        </div>
      </div>

      {/* Guest Warning Banner if not logged in */}
      {!isLoggedIn && (
        <div className="mx-8 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">
              You are currently browsing as a guest. Please sign in to create new CVs and save them to your account.
            </span>
          </div>
          <button
            type="button"
            onClick={onRequestLogin}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* Main Resumes Content */}
      <div className="p-8 flex-1">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* "Create new resume" Card (Matching Screenshot exactly) */}
            <div className="flex flex-col">
              <button
                onClick={handleCreateResumeClick}
                className="w-full aspect-[1/1.414] rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group shadow-2xs active:scale-[0.99]"
              >
                <div className="text-slate-400 group-hover:text-blue-600 transition-colors flex flex-col items-center gap-2">
                  <span className="font-semibold text-sm text-slate-500 group-hover:text-blue-600">
                    Create new resume
                  </span>
                  <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-transform font-light" />
                  {!isLoggedIn && (
                    <span className="text-[11px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200 mt-1 flex items-center gap-1 font-medium">
                      <Lock className="w-2.5 h-2.5" /> Sign in required
                    </span>
                  )}
                </div>
              </button>
              {/* Invisible spacer to match title height below resume cards */}
              <div className="mt-2.5 h-10 invisible" />
            </div>

            {/* Render Existing Resumes */}
            {filteredResumes.map((resume) => (
              <ResumeCardPreview
                key={resume.id}
                resume={resume}
                onEdit={onEditResume}
                onDuplicate={onDuplicateResume}
                onDelete={onDeleteResume}
                onRename={onRenameResume}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="max-w-5xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-5">Resume Title</div>
              <div className="col-span-3">Template</div>
              <div className="col-span-2">Last Updated</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Create New in List View */}
              <button
                onClick={handleCreateResumeClick}
                className="w-full px-5 py-3.5 hover:bg-blue-50/40 flex items-center gap-3 text-left transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-md border border-dashed border-blue-300 text-blue-600 flex items-center justify-center bg-blue-50">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                    + Create new resume
                  </span>
                  <p className="text-xs text-slate-400">
                    Start fresh or customize from 12 templates
                  </p>
                </div>
              </button>

              {filteredResumes.map((resume) => {
                const tmpl = TEMPLATES.find((t) => t.id === resume.templateId);
                return (
                  <div
                    key={resume.id}
                    className="px-5 py-3.5 hover:bg-slate-50/80 grid grid-cols-12 items-center gap-2 transition-colors group"
                  >
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-10 rounded border border-slate-200 bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                        <FileText className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <h4
                          onClick={() => onEditResume(resume)}
                          className="font-bold text-slate-900 text-sm truncate hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {resume.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {resume.data.personal.fullName || 'No name'} •{' '}
                          {resume.data.personal.jobTitle || 'No title'}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-3 text-xs text-slate-600 truncate">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
                        {tmpl?.name || resume.templateId}
                      </span>
                    </div>

                    <div className="col-span-2 text-xs text-slate-500">
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditResume(resume)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onRenameResume(resume)}
                        title="Rename"
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicateResume(resume)}
                        title="Duplicate"
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteResume(resume)}
                        title="Delete"
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
