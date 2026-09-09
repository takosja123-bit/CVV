import React from 'react';
import { X, HelpCircle, FileText, Download, Sparkles, CheckCircle2, Shield } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-blue-100 text-blue-700">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Jobify</span><span className="text-blue-600">CV</span> Guide & Help ✨
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-600 overflow-y-auto max-h-[70vh]">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>How do I create and customize resumes?</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Click <strong>&quot;Create new resume&quot;</strong> or select an existing resume card to open the CV Builder. You can customize personal details, experiences, education, skills, language proficiency meters, projects, achievements, and switch between 12 distinct layout designs.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export & Print Options</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Inside the builder or from the 3-dots menu on any resume card, click <strong>Download PDF</strong> (print preview configured for exact A4 rendering), <strong>Download Word (.doc)</strong>, <strong>Plain Text (.txt)</strong>, or <strong>Export JSON</strong> backup.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI Writing & Cover Letters</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Use the built-in AI assistant to generate professional bullet points, summarize work history, improve phrasing, and draft targeted cover letters for specific job postings.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Data Privacy & Local Storage</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              All your resumes, job applications, and cover letters are stored securely and privately in your browser&apos;s local storage.
            </p>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
