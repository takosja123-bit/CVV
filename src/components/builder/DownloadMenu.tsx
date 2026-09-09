import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Printer, ChevronDown, Check, FileType, Code, Copy, FileCheck, Globe, Sparkles, Loader2 } from 'lucide-react';
import { CVData, TemplateId } from '../../types';
import {
  downloadDirectPdf,
  downloadTrueDocx,
  downloadWordDoc,
  downloadHtmlDocument,
  downloadPdf,
  downloadPlainText,
  downloadJson,
  copyCVToClipboard,
} from '../../utils/exportCV';

interface DownloadMenuProps {
  data: CVData;
  templateId?: TemplateId | string;
  primaryColor?: string;
  variant?: 'primary' | 'secondary' | 'compact';
  label?: string;
  className?: string;
}

export const DownloadMenu: React.FC<DownloadMenuProps> = ({
  data,
  templateId = 'template-ats-classic',
  primaryColor = '#1e3a5f',
  variant = 'primary',
  label = 'Download CV',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadedType, setDownloadedType] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadDirectPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadDirectPdf(data, templateId, primaryColor);
      setDownloadedType('pdf');
      setIsOpen(false);
      setTimeout(() => setDownloadedType(null), 3000);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      // Fallback
      downloadPdf();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      await downloadTrueDocx(data, primaryColor, templateId);
      setDownloadedType('docx');
      setIsOpen(false);
      setTimeout(() => setDownloadedType(null), 3000);
    } catch (err) {
      console.error('Failed to generate DOCX', err);
      downloadWordDoc(data, primaryColor, templateId);
      setDownloadedType('doc');
      setIsOpen(false);
      setTimeout(() => setDownloadedType(null), 3000);
    }
  };

  const handleDownloadDoc = () => {
    downloadWordDoc(data, primaryColor, templateId);
    setDownloadedType('doc');
    setIsOpen(false);
    setTimeout(() => setDownloadedType(null), 3000);
  };

  const handleDownloadHtml = () => {
    downloadHtmlDocument(data, primaryColor, templateId);
    setDownloadedType('html');
    setIsOpen(false);
    setTimeout(() => setDownloadedType(null), 3000);
  };

  const handlePrintWindow = () => {
    downloadPdf();
    setDownloadedType('print');
    setIsOpen(false);
    setTimeout(() => setDownloadedType(null), 3000);
  };

  const handleDownloadText = () => {
    downloadPlainText(data);
    setDownloadedType('txt');
    setIsOpen(false);
    setTimeout(() => setDownloadedType(null), 3000);
  };

  const handleDownloadJson = () => {
    downloadJson(data);
    setDownloadedType('json');
    setIsOpen(false);
    setTimeout(() => setDownloadedType(null), 3000);
  };

  const handleCopyText = async () => {
    const success = await copyCVToClipboard(data);
    if (success) {
      setDownloadedType('copy');
      setIsOpen(false);
      setTimeout(() => setDownloadedType(null), 3000);
    }
  };

  const baseButtonStyles =
    variant === 'primary'
      ? 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-md shadow-xs flex items-center gap-1.5 text-xs transition-all active:scale-98 cursor-pointer'
      : variant === 'secondary'
      ? 'bg-[#432874] hover:bg-[#351e5e] text-white font-semibold px-3 py-1.5 rounded-md shadow-xs flex items-center gap-1.5 text-xs transition-all cursor-pointer'
      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1 cursor-pointer';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isGeneratingPdf}
        className={`${baseButtonStyles} ${isGeneratingPdf ? 'opacity-75 cursor-wait' : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isGeneratingPdf ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        <span>{isGeneratingPdf ? 'Generating PDF...' : label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-84 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 py-2 animate-in fade-in zoom-in-95 duration-100 text-slate-800">
          <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Export Format
            </span>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.2 rounded font-mono">
              All Formats
            </span>
          </div>

          {/* Option 1: Direct PDF (.pdf) */}
          <button
            onClick={handleDownloadDirectPdf}
            className="w-full text-left px-3.5 py-2 text-xs hover:bg-rose-50/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
          >
            <div className="p-1.5 rounded bg-rose-50 text-rose-600 border border-rose-200 group-hover:bg-rose-100 mt-0.5 shrink-0">
              <Printer className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>PDF Document (.pdf)</span>
                <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-semibold">
                  1-Click PDF
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Pixel-perfect vector/raster PDF file download formatted for A4 applications
              </p>
            </div>
          </button>

          {/* Option 2: Modern DOCX (.docx) */}
          <button
            onClick={handleDownloadDocx}
            className="w-full text-left px-3.5 py-2 text-xs hover:bg-blue-50/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
          >
            <div className="p-1.5 rounded bg-blue-50 text-blue-600 border border-blue-200 group-hover:bg-blue-100 mt-0.5 shrink-0">
              <FileCheck className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Microsoft Word (.docx)</span>
                <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                  Editable Word
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Structured Word .docx with clean headings, bullets, dates & color accents
              </p>
            </div>
          </button>

          {/* Option 3: Word Document (.doc) */}
          <button
            onClick={handleDownloadDoc}
            className="w-full text-left px-3.5 py-2 text-xs hover:bg-sky-50/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
          >
            <div className="p-1.5 rounded bg-sky-50 text-sky-600 border border-sky-200 group-hover:bg-sky-100 mt-0.5 shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Styled Word Doc (.doc)</span>
                <span className="text-[9px] bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded font-semibold">
                  Template Styled
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Formatted Word file adapting to your selected template layout & colors
              </p>
            </div>
          </button>

          {/* Option 4: Standalone HTML (.html) */}
          <button
            onClick={handleDownloadHtml}
            className="w-full text-left px-3.5 py-2 text-xs hover:bg-indigo-50/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
          >
            <div className="p-1.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200 group-hover:bg-indigo-100 mt-0.5 shrink-0">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Web HTML Document (.html)</span>
                <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                  Web Page
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Self-contained responsive web file with full CSS ready to open in any browser
              </p>
            </div>
          </button>

          {/* Option 5: Browser Print Dialog */}
          <button
            onClick={handlePrintWindow}
            className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer group text-slate-700"
          >
            <div className="p-1.5 rounded bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-slate-200 mt-0.5 shrink-0">
              <Printer className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-slate-800">Print / Browser PDF Dialog</span>
            </div>
          </button>

          <div className="border-t border-slate-100 my-1"></div>

          {/* Option 6: Plain Text */}
          <button
            onClick={handleDownloadText}
            className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-amber-50/80 flex items-center gap-2.5 transition-colors cursor-pointer group"
          >
            <div className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-200 group-hover:bg-amber-100 shrink-0">
              <FileType className="w-3 h-3" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span className="font-semibold text-slate-800">Plain Text (.txt)</span>
              <span className="text-[9px] text-slate-400">ATS Text</span>
            </div>
          </button>

          {/* Option 7: JSON Backup */}
          <button
            onClick={handleDownloadJson}
            className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-emerald-50/80 flex items-center gap-2.5 transition-colors cursor-pointer group"
          >
            <div className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:bg-emerald-100 shrink-0">
              <Code className="w-3 h-3" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span className="font-semibold text-slate-800">Data Backup (.json)</span>
              <span className="text-[9px] text-slate-400">JSON</span>
            </div>
          </button>

          {/* Option 8: Copy to Clipboard */}
          <button
            onClick={handleCopyText}
            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="p-1 rounded bg-slate-100 text-slate-500 shrink-0">
              <Copy className="w-3 h-3" />
            </div>
            <span className="font-medium text-slate-700">Copy Formatted Text to Clipboard</span>
          </button>
        </div>
      )}

      {/* Confirmation Notification when downloaded */}
      {downloadedType && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {downloadedType === 'pdf' && 'PDF Document (.pdf) downloaded successfully!'}
            {downloadedType === 'docx' && 'Word Document (.docx) downloaded successfully!'}
            {downloadedType === 'doc' && 'Styled Word Document (.doc) downloaded successfully!'}
            {downloadedType === 'html' && 'Standalone HTML Document (.html) downloaded!'}
            {downloadedType === 'print' && 'Opening browser print dialog...'}
            {downloadedType === 'txt' && 'Plain text CV (.txt) downloaded!'}
            {downloadedType === 'json' && 'JSON Resume data backup downloaded!'}
            {downloadedType === 'copy' && 'Resume text copied to clipboard!'}
          </span>
        </div>
      )}
    </div>
  );
};
