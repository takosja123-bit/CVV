import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Download,
  FileText,
  Printer,
  FileType,
  Sparkles,
  Check,
  FileCheck,
} from 'lucide-react';
import { ResumeItem } from '../../types';
import { TemplateDispatcher } from '../templates/TemplateDispatcher';
import { downloadTrueDocx, downloadWordDoc, downloadPlainText } from '../../utils/exportCV';

interface ResumeCardPreviewProps {
  resume: ResumeItem;
  onEdit: (resume: ResumeItem) => void;
  onDuplicate: (resume: ResumeItem) => void;
  onDelete: (resume: ResumeItem) => void;
  onRename: (resume: ResumeItem) => void;
}

export const ResumeCardPreview: React.FC<ResumeCardPreviewProps> = ({
  resume,
  onEdit,
  onDuplicate,
  onDelete,
  onRename,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Format relative time
  const getRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return 'Edited just now';
      if (diffMins < 60) return `Edited ${diffMins} minutes ago`;
      if (diffHours === 1) return 'Edited an hour ago';
      if (diffHours < 24) return `Edited ${diffHours} hours ago`;
      if (diffDays === 1) return 'Edited yesterday';
      return `Edited ${diffDays} days ago`;
    } catch {
      return 'Edited recently';
    }
  };

  const handleDownloadDocx = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    try {
      await downloadTrueDocx(resume.data, resume.primaryColor, resume.templateId);
      setDownloadSuccess('Word document downloaded');
      setTimeout(() => setDownloadSuccess(null), 2500);
    } catch {
      downloadWordDoc(resume.data, resume.primaryColor, resume.templateId);
      setDownloadSuccess('Word document downloaded');
      setTimeout(() => setDownloadSuccess(null), 2500);
    }
  };

  const handleDownloadDoc = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    downloadWordDoc(resume.data, resume.primaryColor, resume.templateId);
    setDownloadSuccess('Word .doc downloaded');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleDownloadTxt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    downloadPlainText(resume.data);
    setDownloadSuccess('Text file downloaded');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit(resume);
  };

  return (
    <div className="flex flex-col group relative">
      {/* Resume Thumbnail Container (Aspect ratio ~ 1:1.41 A4) */}
      <div
        onClick={() => onEdit(resume)}
        className="relative w-full aspect-[1/1.414] bg-white rounded-lg border border-slate-200 shadow-xs group-hover:shadow-xl group-hover:border-blue-300 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-start"
      >
        {/* Real Scaled Preview of Resume */}
        <div className="absolute inset-0 pointer-events-none origin-top-left scale-[0.32] w-[312%] h-[312%] bg-white overflow-hidden p-2 select-none">
          <TemplateDispatcher
            templateId={resume.templateId}
            data={resume.data}
            primaryColor={resume.primaryColor}
          />
        </div>

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors pointer-events-none" />

        {/* Floating 3-dots Menu Button at Bottom Right (matching screenshot exactly) */}
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2.5 right-2.5 z-20"
        >
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Resume Options"
            className="w-7 h-7 bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-md hover:bg-white text-slate-700 hover:text-slate-900 rounded-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* Action Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 bottom-full mb-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit(resume);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-slate-800 flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
              >
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>Edit Resume</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRename(resume);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Rename</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onDuplicate(resume);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Duplicate</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleDownloadPdf}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-rose-500" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleDownloadDocx}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Download Word (.doc / .docx)</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <FileType className="w-4 h-4 text-amber-500" />
                <span>Download TXT</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(resume);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2.5 cursor-pointer transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Info Below Preview (Title + Relative Time) */}
      <div className="mt-2.5">
        <h3
          onClick={() => onEdit(resume)}
          title={resume.title}
          className="font-bold text-slate-900 text-sm tracking-tight truncate hover:text-blue-600 cursor-pointer transition-colors"
        >
          {resume.title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          {downloadSuccess ? (
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> {downloadSuccess}
            </span>
          ) : (
            getRelativeTime(resume.updatedAt)
          )}
        </p>
      </div>
    </div>
  );
};

