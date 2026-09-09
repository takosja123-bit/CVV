import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CVData, TemplateId, BuilderTab, ResumeItem } from '../../types';
import { TEMPLATES, COLOR_PALETTES, INITIAL_CV_DATA, sanitizeCVData } from '../../data/initialData';
import { TemplateDispatcher } from '../templates/TemplateDispatcher';
import { TemplateCarousel } from '../landing/TemplateCarousel';
import { PersonalTab } from './PersonalTab';
import { ExperienceTab } from './ExperienceTab';
import { EducationTab } from './EducationTab';
import { SkillsTab } from './SkillsTab';
import { ProjectsTab } from './ProjectsTab';
import { AIEnhanceModal } from './AIEnhanceModal';
import { DownloadMenu } from './DownloadMenu';
import { ATSCheckModal } from '../ats/ATSCheckModal';
import { JobMatcherModal } from '../ats/JobMatcherModal';
import { ShareModal } from '../common/ShareModal';
import { PrivacyPolicyModal } from '../common/PrivacyPolicyModal';
import {
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Star,
  FolderKanban,
  Printer,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Palette,
  Layout,
  Check,
  Download,
  Share2,
  Upload,
  X,
  Cloud,
  CloudOff,
  Loader2,
  ShieldCheck,
  Undo2,
  Redo2,
  FileCheck2,
  Target,
  HelpCircle,
  Maximize2,
  FileText,
} from 'lucide-react';

interface CVBuilderPageProps {
  data: CVData;
  selectedTemplate: TemplateId;
  onChangeData: (data: CVData) => void;
  onSelectTemplate: (templateId: TemplateId) => void;
  onBackToLanding: () => void;
  onBackToDashboard?: () => void;
  resumeTitle?: string;
  cloudSyncStatus?: 'saved' | 'saving' | 'error' | 'offline';
  allResumes?: ResumeItem[];
  activeResumeId?: string;
  onSwitchResume?: (resume: ResumeItem) => void;
  onOpenLogin?: () => void;
  userEmail?: string | null;
}

export const CVBuilderPage: React.FC<CVBuilderPageProps> = ({
  data,
  selectedTemplate,
  onChangeData,
  onSelectTemplate,
  onBackToLanding,
  onBackToDashboard,
  resumeTitle,
  cloudSyncStatus = 'offline',
  allResumes = [],
  activeResumeId,
  onSwitchResume,
  onOpenLogin,
  userEmail,
}) => {
  const [activeTab, setActiveTab] = useState<BuilderTab>('personal');
  const [focusExperienceId, setFocusExperienceId] = useState<string | null>(null);
  const [focusEducationId, setFocusEducationId] = useState<string | null>(null);
  const [activeLayoutPopover, setActiveLayoutPopover] = useState<string | null>(null);
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
  
  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isATSModalOpen, setIsATSModalOpen] = useState<boolean>(false);
  const [isJobMatcherOpen, setIsJobMatcherOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const jsonImportInputRef = useRef<HTMLInputElement>(null);

  // Undo / Redo history state
  const [history, setHistory] = useState<CVData[]>([data]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef<boolean>(false);

  // Sync external changes into history if not triggered by undo/redo
  const handleDataChange = useCallback(
    (newData: CVData) => {
      if (isUndoRedoAction.current) {
        isUndoRedoAction.current = false;
        onChangeData(newData);
        return;
      }
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, newData].slice(-30); // keep up to 30 history steps
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 29));
      onChangeData(newData);
    },
    [historyIndex, onChangeData]
  );

  // --- Double-click on preview text -> jump to its location in the edit form ---
  const findPreviewJumpTarget = useCallback(
    (rawText: string): { tab: BuilderTab; experienceId?: string; educationId?: string } | null => {
      const text = rawText.trim();
      if (!text || text.length < 2) return null;
      const norm = (s?: string) => (s || '').trim();
      const matches = (field?: string) => {
        const f = norm(field);
        if (!f) return false;
        return f === text || text.includes(f) || f.includes(text);
      };

      const personalFields = [
        data.personal.fullName,
        data.personal.jobTitle,
        data.personal.summary,
        data.personal.email,
        data.personal.phone,
        data.personal.address,
        data.personal.website,
        data.personal.github,
        data.personal.linkedin,
      ];
      if (personalFields.some(matches)) {
        return { tab: 'personal' };
      }

      for (const exp of data.experiences || []) {
        const fields = [exp.jobTitle, exp.company, exp.location, ...(exp.bullets || [])];
        if (fields.some(matches)) {
          return { tab: 'experience', experienceId: exp.id };
        }
      }

      for (const edu of data.education || []) {
        const fields = [edu.institution, edu.degree, edu.location, edu.details];
        if (fields.some(matches)) {
          return { tab: 'education', educationId: edu.id };
        }
      }

      const skillNames = (data.skills || []).map((s) => (typeof s === 'string' ? s : s.name));
      const langNames = (data.languages || []).map((l) => (typeof l === 'string' ? l : l.name));
      if ([...skillNames, ...langNames].some(matches)) {
        return { tab: 'skills' };
      }

      const projFields = (data.projects || []).flatMap((p) => [p.title, p.role, p.description]);
      const certFields = (data.certifications || []).flatMap((c) => [c.name, c.issuer]);
      const achFields = (data.achievements || []).flatMap((a) => [a.title, a.description]);
      const refFields = (data.references || []).flatMap((r) => [r.name, r.title, r.company]);
      if ([...projFields, ...certFields, ...achFields, ...refFields].some(matches)) {
        return { tab: 'projects' };
      }

      return null;
    },
    [data]
  );

  const handlePreviewDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      let el = e.target as HTMLElement | null;
      let text = '';
      for (let i = 0; i < 4 && el; i++) {
        const t = (el.textContent || '').trim();
        if (t && t.length >= 2 && t.length <= 400) {
          text = t;
          break;
        }
        el = el.parentElement;
      }
      if (!text) return;

      const result = findPreviewJumpTarget(text);
      if (!result) return;

      setActiveTab(result.tab);
      setFocusExperienceId(result.tab === 'experience' ? result.experienceId || null : null);
      setFocusEducationId(result.tab === 'education' ? result.educationId || null : null);
    },
    [findPreviewJumpTarget]
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    isUndoRedoAction.current = true;
    const newIdx = historyIndex - 1;
    setHistoryIndex(newIdx);
    onChangeData(history[newIdx]);
    showToast('Undo edit');
  }, [canUndo, history, historyIndex, onChangeData]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    isUndoRedoAction.current = true;
    const newIdx = historyIndex + 1;
    setHistoryIndex(newIdx);
    onChangeData(history[newIdx]);
    showToast('Redo edit');
  }, [canRedo, history, historyIndex, onChangeData]);

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y / Cmd+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const currentTemplateObj =
    TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
  const activeColor = customPrimaryColor || currentTemplateObj.primaryColor;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleResetToSample = () => {
    if (window.confirm('Reset all details to the sample resume data?')) {
      handleDataChange(INITIAL_CV_DATA);
      showToast('Reset to sample data');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all resume fields to start completely from scratch?')) {
      handleDataChange({
        personal: {
          fullName: '',
          jobTitle: '',
          email: '',
          phone: '',
          address: '',
          website: '',
          summary: '',
          photoUrl: '',
        },
        experiences: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        achievements: [],
        references: [],
      });
      showToast('All fields cleared');
    }
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawJson = JSON.parse(event.target?.result as string);
        const validated = sanitizeCVData(rawJson);
        handleDataChange(validated);
        showToast('CV data imported successfully!');
      } catch (err) {
        alert('Invalid JSON file format. Please upload a valid resume backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-[#EBE8E1] text-[#1E293B] font-sans-ui flex flex-col">
      {/* Top Navbar */}
      <header className="no-print bg-[#1e293b] text-white px-4 md:px-6 py-2.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        {/* Left: Back button, Title & Multi-CV switcher */}
        <div className="flex items-center gap-2.5">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          )}

          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 cursor-pointer transition-colors"
          >
            <span>Templates</span>
          </button>

          <div className="h-5 w-px bg-slate-700 hidden sm:block" />

          {/* Resume Title & Multi-CV switcher */}
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                {allResumes.length > 1 && onSwitchResume ? (
                  <select
                    value={activeResumeId || ''}
                    onChange={(e) => {
                      const selected = allResumes.find((r) => r.id === e.target.value);
                      if (selected) onSwitchResume(selected);
                    }}
                    className="text-sm font-bold text-white bg-slate-800/90 border border-slate-700 rounded px-2 py-0.5 focus:outline-none cursor-pointer"
                  >
                    {allResumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-sm font-bold text-white tracking-wide">
                    {resumeTitle || 'CV Builder'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-xs">
                Editing: <span className="text-slate-200 font-medium">{data.personal.fullName || 'Untitled CV'}</span>
              </p>
            </div>

            {/* Cloud Sync Status Badge */}
            {cloudSyncStatus === 'saving' && (
              <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded-full font-semibold shrink-0">
                <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                <span className="hidden sm:inline">Saving to Firestore...</span>
              </span>
            )}
            {cloudSyncStatus === 'saved' && (
              <span
                className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 px-2 py-0.5 rounded-full font-semibold shrink-0"
                title={`Saved to Firestore (User: ${userEmail || 'Authenticated'})`}
              >
                <Cloud className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Saved to Cloud</span>
              </span>
            )}
            {cloudSyncStatus === 'offline' && (
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 px-2 py-0.5 rounded-full font-medium shrink-0 cursor-pointer transition-colors"
                title="Currently saving to browser local storage. Click to sign in for cloud sync."
              >
                <CloudOff className="w-3 h-3 text-slate-400" />
                <span className="hidden md:inline">Local Storage</span>
                <span className="text-indigo-400 underline font-semibold ml-0.5">Sign in</span>
              </button>
            )}
            {cloudSyncStatus === 'error' && (
              <span
                className="flex items-center gap-1 text-[10px] text-rose-300 bg-rose-950/60 border border-rose-700/60 px-2 py-0.5 rounded-full font-semibold shrink-0"
                title="Could not sync to cloud, saved locally."
              >
                <span>Saved locally</span>
              </span>
            )}
          </div>
        </div>



        {/* Right: Template picker & Color swatches & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Template color swatches */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/90 px-2.5 py-1.5 rounded-lg border border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mr-0.5">
              THEME:
            </span>
            {COLOR_PALETTES.map((pal) => {
              const isSelected = activeColor.toLowerCase() === pal.color.toLowerCase();
              return (
                <button
                  key={pal.color}
                  onClick={() => setCustomPrimaryColor(pal.color)}
                  title={pal.name}
                  className={`w-4 h-4 rounded-xs transition-all cursor-pointer relative ${
                    isSelected ? 'ring-2 ring-white scale-110 shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: pal.color }}
                />
              );
            })}
          </div>

          {/* Template Switcher Dropdown */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 cursor-pointer transition-colors"
              title="Browse template showcase carousel"
            >
              <Layout className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Designs</span>
            </button>

            <select
              value={selectedTemplate}
              onChange={(e) => {
                onSelectTemplate(e.target.value as TemplateId);
                setCustomPrimaryColor(null);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-medium max-w-[140px]"
            >
              {TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>

          {/* AI Enhance Quick Action */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-purple-700/60 shadow-2xs cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Polish</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 cursor-pointer transition-colors"
            title="Public shareable link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Download Dropdown */}
          <DownloadMenu
            data={data}
            templateId={selectedTemplate}
            primaryColor={activeColor}
            variant="primary"
            label="Download"
          />
        </div>
      </header>

      {/* Main Builder Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-53px)] overflow-hidden">
        {/* LEFT COLUMN: FORM EDITOR (5 columns on large screens) */}
        <div className="no-print lg:col-span-5 bg-white border-r border-slate-300/80 flex flex-col h-full shadow-sm z-10">
          {/* Top Category Tabs */}
          <div className="grid grid-cols-5 bg-slate-100/90 border-b border-slate-200 p-1.5 gap-1">
            {[
              { id: 'personal', label: 'PERSONAL', icon: User },
              { id: 'experience', label: 'EXPERIENCE', icon: Briefcase },
              { id: 'education', label: 'EDUCATION', icon: GraduationCap },
              { id: 'skills', label: 'SKILLS', icon: Star },
              { id: 'projects', label: 'PROJECTS', icon: FolderKanban },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as BuilderTab)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="truncate w-full text-center">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Undo / Redo Sub-Toolbar */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                disabled={!canUndo}
                onClick={handleUndo}
                className="px-2 py-1 bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 rounded-md text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Undo</span>
              </button>
              <button
                disabled={!canRedo}
                onClick={handleRedo}
                className="px-2 py-1 bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 rounded-md text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Redo</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsATSModalOpen(true)}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ATS Check</span>
              </button>

              <button
                onClick={() => setIsJobMatcherOpen(true)}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>Match Job</span>
              </button>
            </div>
          </div>

          {/* Form Content Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === 'personal' && (
              <PersonalTab
                personal={data.personal}
                style={data.style}
                onChange={(updated) => handleDataChange({ ...data, personal: updated })}
                onChangeStyle={(newStyle) => handleDataChange({ ...data, style: newStyle })}
                onAIPolishSummary={() => setIsAIModalOpen(true)}
                activePopover={activeLayoutPopover}
                onTogglePopover={(key) => setActiveLayoutPopover((prev) => (prev === key ? null : key))}
                onClosePopover={() => setActiveLayoutPopover(null)}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceTab
                experiences={data.experiences}
                style={data.style}
                onChange={(updated) => handleDataChange({ ...data, experiences: updated })}
                onChangeStyle={(newStyle) => handleDataChange({ ...data, style: newStyle })}
                activePopover={activeLayoutPopover}
                onTogglePopover={(key) => setActiveLayoutPopover((prev) => (prev === key ? null : key))}
                onClosePopover={() => setActiveLayoutPopover(null)}
                focusEntryId={focusExperienceId}
              />
            )}

            {activeTab === 'education' && (
              <EducationTab
                education={data.education}
                style={data.style}
                onChange={(updated) => handleDataChange({ ...data, education: updated })}
                onChangeStyle={(newStyle) => handleDataChange({ ...data, style: newStyle })}
                activePopover={activeLayoutPopover}
                onTogglePopover={(key) => setActiveLayoutPopover((prev) => (prev === key ? null : key))}
                onClosePopover={() => setActiveLayoutPopover(null)}
                focusEntryId={focusEducationId}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsTab
                skills={data.skills}
                languages={data.languages}
                skillStyle={data.skillStyle}
                style={data.style}
                onChangeSkills={(updated) => handleDataChange({ ...data, skills: updated })}
                onChangeLanguages={(updated) => handleDataChange({ ...data, languages: updated })}
                onChangeSkillStyle={(style) => handleDataChange({ ...data, skillStyle: style })}
                onChangeStyle={(newStyle) => handleDataChange({ ...data, style: newStyle })}
                activePopover={activeLayoutPopover}
                onTogglePopover={(key) => setActiveLayoutPopover((prev) => (prev === key ? null : key))}
                onClosePopover={() => setActiveLayoutPopover(null)}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsTab
                projects={data.projects}
                certifications={data.certifications}
                achievements={data.achievements}
                references={data.references}
                style={data.style}
                onUpdateProjects={(updated) => handleDataChange({ ...data, projects: updated })}
                onUpdateCertifications={(updated) =>
                  handleDataChange({ ...data, certifications: updated })
                }
                onUpdateAchievements={(updated) =>
                  handleDataChange({ ...data, achievements: updated })
                }
                onUpdateReferences={(updated) =>
                  handleDataChange({ ...data, references: updated })
                }
                onChangeStyle={(newStyle) => handleDataChange({ ...data, style: newStyle })}
                activePopover={activeLayoutPopover}
                onTogglePopover={(key) => setActiveLayoutPopover((prev) => (prev === key ? null : key))}
                onClosePopover={() => setActiveLayoutPopover(null)}
              />
            )}
          </div>

          {/* Bottom Editor Action Toolbar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleResetToSample}
                className="text-slate-600 hover:text-slate-900 text-[11px] font-medium flex items-center gap-1 hover:underline cursor-pointer"
                title="Reset to sample data"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                Reset Sample
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => jsonImportInputRef.current?.click()}
                className="text-slate-600 hover:text-indigo-600 text-[11px] font-medium flex items-center gap-1 hover:underline cursor-pointer"
                title="Import JSON resume backup file"
              >
                <Upload className="w-3 h-3 text-slate-400" />
                Import JSON
              </button>
              <input
                type="file"
                ref={jsonImportInputRef}
                onChange={handleImportJsonFile}
                accept=".json,application/json"
                className="hidden"
              />
              <span className="text-slate-300">|</span>
              <button
                onClick={handleClearAll}
                className="text-slate-500 hover:text-red-600 text-[11px] font-medium cursor-pointer"
                title="Clear all fields"
              >
                Clear all
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-slate-400 hover:text-slate-700 text-[11px] font-medium cursor-pointer flex items-center gap-1"
                title="Privacy & Terms"
              >
                <ShieldCheck className="w-3 h-3" />
                Privacy
              </button>
            </div>

            <DownloadMenu
              data={data}
              templateId={selectedTemplate}
              primaryColor={activeColor}
              variant="primary"
              label="Download CV"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW AREA (7 columns on large screens) */}
        <div className="print-page-wrapper lg:col-span-7 bg-[#E5E2DA] flex flex-col h-full overflow-y-auto relative">
          {/* Live Preview Sub-header Toolbar */}
          <div className="no-print sticky top-0 z-20 bg-[#E5E2DA]/95 backdrop-blur-xs px-6 py-3 border-b border-slate-300/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                LIVE PREVIEW
              </span>
              <span className="bg-[#1e293b] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                {currentTemplateObj.name}
              </span>
              {currentTemplateObj.isAtsCompliant && (
                <span className="bg-emerald-600 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                  ATS Verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Page Format Toggle (A4 vs US Letter) */}
              <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden text-xs shadow-2xs">
                <button
                  onClick={() => {
                    setPageSize('A4');
                    showToast('Page size set to A4 (210 × 297 mm)');
                  }}
                  className={`px-2 py-1 font-semibold cursor-pointer text-[11px] transition-colors ${
                    pageSize === 'A4' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="ISO A4 Standard (210 × 297 mm)"
                >
                  A4
                </button>
                <button
                  onClick={() => {
                    setPageSize('Letter');
                    showToast('Page size set to US Letter (8.5 × 11 in)');
                  }}
                  className={`px-2 py-1 font-semibold cursor-pointer text-[11px] transition-colors ${
                    pageSize === 'Letter' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="US Letter Standard (8.5 × 11 in)"
                >
                  US Letter
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden text-xs shadow-2xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                  title="Zoom out"
                  className="px-2 py-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  title="Reset to 100%"
                  className="px-2 py-1 font-mono text-[11px] text-slate-700 bg-slate-50 border-x border-slate-200 hover:bg-slate-100 cursor-pointer"
                >
                  {zoomLevel}%
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                  title="Zoom in"
                  className="px-2 py-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Share button */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                title="Open share options & recruiter link"
                className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {/* Download dropdown in preview toolbar */}
              <DownloadMenu
                data={data}
                templateId={selectedTemplate}
                primaryColor={activeColor}
                variant="secondary"
                label="Download"
              />
            </div>
          </div>

          {/* CV Document Rendering Container */}
          <div className="flex-1 p-4 md:p-8 flex justify-center items-start overflow-auto">
            <div
              onDoubleClick={handlePreviewDoubleClick}
              className={`cv-document-sheet transition-transform duration-150 origin-top shadow-xl rounded-sm w-full bg-white ${
                pageSize === 'A4' ? 'max-w-[794px] min-h-[1123px]' : 'max-w-[816px] min-h-[1056px]'
              }`}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <TemplateDispatcher
                templateId={selectedTemplate}
                data={data}
                primaryColor={activeColor}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Enhancer Modal */}
      <AIEnhanceModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentSummary={data.personal.summary}
        jobTitle={data.personal.jobTitle}
        fullName={data.personal.fullName}
        onApply={(newSummary) => {
          handleDataChange({
            ...data,
            personal: {
              ...data.personal,
              summary: newSummary,
            },
          });
          showToast('Applied AI summary');
        }}
      />

      {/* ATS Check Modal */}
      <ATSCheckModal
        isOpen={isATSModalOpen}
        onClose={() => setIsATSModalOpen(false)}
        cvData={data}
        templateId={selectedTemplate}
        selectedTemplate={selectedTemplate}
        onSwitchTemplate={(targetId) => {
          onSelectTemplate(targetId);
          showToast('Switched to ATS Template!');
        }}
        onSwitchToAtsTemplate={() => {
          onSelectTemplate('template-ats-classic');
          showToast('Switched to ATS Classic Template!');
        }}
        onNavigateToTab={(tab) => {
          setActiveTab(tab as BuilderTab);
        }}
      />

      {/* Job Description Matcher Modal */}
      <JobMatcherModal
        isOpen={isJobMatcherOpen}
        onClose={() => setIsJobMatcherOpen(false)}
        cvData={data}
        onAddKeyword={(keyword) => {
          const currentSkills = Array.isArray(data.skills) ? data.skills : [];
          handleDataChange({
            ...data,
            skills: [...currentSkills, { name: keyword, level: 4 }],
          });
          showToast(`Added ${keyword} to your skills`);
        }}
      />

      {/* Public Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        cvData={data}
        resumeTitle={resumeTitle}
      />

      {/* Privacy Policy & Terms Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        userEmail={userEmail}
        onClearCloudData={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Template Showcase Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#EDEDE9] rounded-2xl w-full max-w-7xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-400/40 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1e293b] text-white flex items-center justify-between border-b border-slate-700">
              <div>
                <h3 className="text-base font-bold">Choose CV Template</h3>
                <p className="text-xs text-slate-300">
                  Select an authentic JobCraft layout. Your data will instantly adapt.
                </p>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Carousel */}
            <div className="flex-1 overflow-y-auto">
              <TemplateCarousel
                data={data}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={(newId) => {
                  onSelectTemplate(newId);
                  setCustomPrimaryColor(null);
                  showToast('Template switched!');
                }}
                onCreateCV={(newId) => {
                  if (newId) onSelectTemplate(newId);
                  setIsTemplateModalOpen(false);
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-slate-300 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                Currently selected: <strong>{currentTemplateObj.name}</strong> ({currentTemplateObj.planTier})
              </span>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="bg-[#1e293b] hover:bg-black text-white text-xs font-bold px-6 py-2 rounded-lg shadow-sm cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
