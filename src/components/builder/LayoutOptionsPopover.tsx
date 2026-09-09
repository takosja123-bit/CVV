import React, { useRef, useEffect } from 'react';
import { CVStyleOptions } from '../../types';
import {
  MoreVertical,
  Columns,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Type,
  X,
  Check,
} from 'lucide-react';

export interface LayoutOptionsPopoverProps {
  sectionKey: string;
  sectionTitle: string;
  style?: CVStyleOptions;
  onChangeStyle?: (newStyle: CVStyleOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onOpen?: () => void;
  isGroupable?: boolean; // True for Employment and Education
  children?: React.ReactNode; // Optional header/label to wrap as hover target
}

export const LayoutOptionsPopover: React.FC<LayoutOptionsPopoverProps> = ({
  sectionKey,
  sectionTitle,
  style,
  onChangeStyle,
  isOpen,
  onToggle,
  onClose,
  onOpen,
  isGroupable = false,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, onClose]);

  // Handle smooth hover open & close
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (!isOpen) {
      if (onOpen) {
        onOpen();
      } else {
        onToggle();
      }
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 280);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Safe defaults
  const currentSidebarSections = style?.sidebarSections ?? ['personal', 'skills', 'languages', 'references'];
  const isSectionInSidebar = style?.sectionInSidebar?.[sectionKey] !== undefined
    ? Boolean(style.sectionInSidebar[sectionKey])
    : currentSidebarSections.includes(sectionKey);

  const groupByInstitution = Boolean(style?.groupByInstitution || style?.groupByEmployer);
  const showLogos = style?.showLogos !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;

  const handleToggleSidebar = () => {
    if (!onChangeStyle) return;
    let nextSections: string[];
    if (isSectionInSidebar) {
      nextSections = currentSidebarSections.filter((s) => s !== sectionKey);
    } else {
      nextSections = [...currentSidebarSections, sectionKey];
    }
    const nextSectionInSidebar = {
      ...(style?.sectionInSidebar || {}),
      [sectionKey]: !isSectionInSidebar,
    };
    onChangeStyle({
      ...style,
      sidebarSections: nextSections,
      sectionInSidebar: nextSectionInSidebar,
    });
  };

  const handleToggleOption = (key: keyof CVStyleOptions, currentValue: boolean) => {
    if (!onChangeStyle) return;
    const nextValue = !currentValue;
    const updatedStyle: CVStyleOptions = {
      ...style,
      [key]: nextValue,
    };
    if (key === 'groupByInstitution') {
      updatedStyle.groupByEmployer = nextValue;
      updatedStyle.groupByInstitution = nextValue;
    }
    if (key === 'showIcons') {
      updatedStyle.showSectionIcons = nextValue;
    }
    onChangeStyle(updatedStyle);
  };

  return (
    <div
      className="relative inline-flex items-center"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Optional Wrapped Trigger / Letters Children */}
      {children && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="cursor-pointer select-none"
        >
          {children}
        </div>
      )}

      {/* 3-Dot Trigger Button */}
      <button
        type="button"
        id={`layout-options-btn-${sectionKey}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        title={`Layout Options: ${sectionTitle} (hover or click)`}
        aria-label={`Layout Options for ${sectionTitle}`}
        aria-expanded={isOpen}
        className={`p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-all cursor-pointer border ${
          isOpen
            ? 'bg-purple-50 text-purple-700 border-purple-400 ring-2 ring-purple-500/20 shadow-xs'
            : 'border-transparent hover:border-slate-200'
        }`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div
          id={`layout-options-popover-${sectionKey}`}
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Row */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50/70 to-indigo-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
                  LAYOUT OPTIONS
                </span>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {sectionTitle}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors cursor-pointer"
              title="Close options"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Options Rows List */}
          <div className="p-3 space-y-1 divide-y divide-slate-50">
            {/* Option 1: Section in sidebar */}
            <div className="pt-1.5 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSectionInSidebar
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 text-[11.5px] leading-snug">
                    Section in sidebar
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {isSectionInSidebar ? 'Placed in sidebar column' : 'Placed in main content column'}
                  </div>
                </div>
              </div>

              {/* Pill Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isSectionInSidebar}
                onClick={handleToggleSidebar}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isSectionInSidebar ? 'bg-purple-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isSectionInSidebar ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Option 2: Group by employer / institution (For Experience & Education) */}
            {isGroupable && (
              <div className="pt-1.5 flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      groupByInstitution
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 text-[11.5px] leading-snug">
                      {sectionKey === 'education' ? 'Group by institution' : 'Group by employer'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Nest positions under one organization
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={groupByInstitution}
                  onClick={() => handleToggleOption('groupByInstitution', groupByInstitution)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    groupByInstitution ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      groupByInstitution ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Option 3: Show employer / institution logos */}
            <div className="pt-1.5 flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    showLogos
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 text-[11.5px] leading-snug">
                    Show logos / badges
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Display organization logo or badge
                  </div>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={showLogos}
                onClick={() => handleToggleOption('showLogos', showLogos)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  showLogos ? 'bg-purple-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showLogos ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Option 4: Show section icons */}
            <div className="pt-1.5 flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    showIcons
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 text-[11.5px] leading-snug">
                    Show section icon
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Display vector icon in section title
                  </div>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={showIcons}
                onClick={() => handleToggleOption('showIcons', showIcons)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  showIcons ? 'bg-purple-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showIcons ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Option 5: Uppercase headers */}
            <div className="pt-1.5 flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    uppercaseHeaders
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 text-[11.5px] leading-snug">
                    Uppercase headers
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {uppercaseHeaders ? 'UPPERCASE (e.g. WORK EXPERIENCE)' : 'Title Case (e.g. Work Experience)'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={uppercaseHeaders}
                onClick={() => handleToggleOption('uppercaseHeaders', uppercaseHeaders)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  uppercaseHeaders ? 'bg-purple-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    uppercaseHeaders ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer with Done button */}
          <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10.5px] text-slate-500 font-medium">
              Changes apply live
            </span>
            <button
              type="button"
              id={`layout-options-done-${sectionKey}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

