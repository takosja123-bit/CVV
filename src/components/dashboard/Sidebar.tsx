import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  CheckSquare,
  Plus,
  HelpCircle,
  User,
  LogOut,
  ExternalLink,
  ChevronDown,
  FilePlus,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { SidebarSection, PlanTier, ADMIN_EMAIL } from '../../types';

interface SidebarProps {
  activeSection: SidebarSection;
  onSelectSection: (section: SidebarSection) => void;
  onNewResume: () => void;
  onNewCoverLetter?: () => void;
  onNewJob: () => void;
  onOpenHelp: () => void;
  onOpenLogin: () => void;
  user: { name: string; email: string; avatarUrl?: string } | null;
  onLogout: () => void;
  onGoToLanding: () => void;
  resumeCount: number;
  coverLetterCount?: number;
  jobCount: number;
  applicationsCount?: number;
  cloudSyncStatus?: 'saved' | 'saving' | 'error' | 'offline';
  isAdmin?: boolean;
  pendingSubmissionsCount?: number;
  planTier?: PlanTier;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  onNewResume,
  onNewJob,
  onOpenHelp,
  onOpenLogin,
  user,
  onLogout,
  onGoToLanding,
  resumeCount,
  jobCount,
  applicationsCount,
  isAdmin = false,
  pendingSubmissionsCount = 0,
  planTier = 'Free Plan',
}) => {
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  const navItems: {
    id: SidebarSection;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { id: 'resumes', label: 'Resumes', icon: FileText, badge: resumeCount },
    { id: 'jobs', label: 'Job Board', icon: Briefcase, badge: jobCount },
    { id: 'applications', label: 'Applications', icon: CheckSquare, badge: applicationsCount },
  ];

  if (isAdmin) {
    navItems.push({
      id: 'admin',
      label: 'Admin Hub',
      icon: ShieldCheck,
      badge: pendingSubmissionsCount,
    });
  }

  return (
    <aside className="w-64 bg-[#12151b] text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none relative z-30">
      {/* Top Header / Brand Logo */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
        <button
          onClick={() => onSelectSection('resumes')}
          className="flex items-center gap-3 text-white font-bold text-lg tracking-tight hover:opacity-90 transition-opacity group cursor-pointer"
        >
          <img
            src="/jobify-logo.png"
            alt="Jobify"
            className="w-9 h-9 rounded-lg shadow-md shadow-black/30 ring-1 ring-white/10 group-hover:scale-105 transition-transform shrink-0 object-cover"
          />
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tight leading-none text-white">Jobify<span style={{ color: '#38bdf8' }}>CV</span></span>
            <span className="w-px h-3.5 bg-slate-700" />
            <span className="text-[10px] font-semibold text-slate-400 tracking-[0.12em] uppercase leading-none">Cambodia</span>
          </div>
        </button>

        <button
          onClick={onOpenHelp}
          title="Help & Support"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Main Action "+ Create New" Button */}
      <div className="p-4 relative">
        <div className="relative">
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="w-full h-10 px-3.5 bg-[#0057B8] hover:bg-[#0066d6] text-white font-medium text-xs rounded-lg flex items-center justify-between transition-all shadow-sm shadow-black/30 cursor-pointer active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="font-semibold text-xs tracking-tight">Create New</span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-blue-100 transition-transform duration-200 ${
                isNewMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* "+ New" Dropdown Menu */}
          {isNewMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNewMenuOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#171b24] border border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    onNewResume();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#0057B8]/20 text-slate-200 hover:text-white flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-md bg-[#0057B8]/15 text-[#38bdf8] flex items-center justify-center shrink-0 group-hover:bg-[#0057B8]/25">
                    <FilePlus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold">New Resume</div>
                    <div className="text-[10px] text-slate-400">12 ATS-friendly templates</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    onNewJob();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#00AAAA]/20 text-slate-200 hover:text-white flex items-center gap-3 transition-colors cursor-pointer group mt-0.5"
                >
                  <div className="w-7 h-7 rounded-md bg-[#00AAAA]/15 text-[#5eead4] flex items-center justify-center shrink-0 group-hover:bg-[#00AAAA]/25">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold">Log Application</div>
                    <div className="text-[10px] text-slate-400">Track an applied role</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full h-10 flex items-center justify-between px-3.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#252a35] text-white font-semibold border border-slate-700/60 shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#38bdf8]' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  className={`text-[11px] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full font-mono font-semibold ${
                    isActive
                      ? 'bg-[#0057B8]/25 text-blue-100 border border-[#0057B8]/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Templates Showcase Link */}
        <div className="pt-3 mt-3 border-t border-slate-800/80">
          <button
            onClick={onGoToLanding}
            className="w-full h-10 flex items-center justify-between px-3.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer group border border-transparent"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-[#38bdf8] group-hover:scale-105 transition-transform" />
              <span>Templates Showcase</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </button>
        </div>
      </nav>

      {/* Bottom User Profile / Account Section (Clean & Balanced without Cloud banner) */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0f1217]">
        {user ? (
          <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/70 hover:bg-slate-800/60 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                    isAdmin
                      ? 'bg-amber-600 ring-2 ring-amber-500/30'
                      : 'bg-gradient-to-tr from-[#0057B8] to-[#00AAAA]'
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                    <span className="truncate">{user.name}</span>
                    {isAdmin && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Plan Tier Badge */}
            {!isAdmin && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-800/70 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Current Tier:</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full ${
                    planTier === 'Premium Plan'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : planTier === 'Pro Plan'
                      ? 'bg-[#0057B8]/20 text-blue-200 border border-[#0057B8]/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {planTier}
                </span>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full h-10 px-3.5 rounded-lg border border-slate-800/90 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white flex items-center justify-between text-xs font-medium transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-[#38bdf8] transition-colors">
                <User className="w-3.5 h-3.5" />
              </div>
              <span>Sign In / Account</span>
            </div>
            <span className="text-[10px] text-[#7dd3fc] font-semibold bg-[#0057B8]/20 border border-[#0057B8]/40 px-2 py-0.5 rounded-full">
              Free
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};
