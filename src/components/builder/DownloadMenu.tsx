import React, { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { CVData, TemplateId } from '../../types';
import { downloadDirectPdf, downloadPdf } from '../../utils/exportCV';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadDirectPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadDirectPdf(data, templateId, primaryColor);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      // Fallback
      downloadPdf();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const baseButtonStyles =
    variant === 'primary'
      ? 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-md shadow-xs flex items-center gap-1.5 text-xs transition-all active:scale-98 cursor-pointer'
      : variant === 'secondary'
      ? 'bg-[#432874] hover:bg-[#351e5e] text-white font-semibold px-3 py-1.5 rounded-md shadow-xs flex items-center gap-1.5 text-xs transition-all cursor-pointer'
      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1 cursor-pointer';

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={handleDownloadDirectPdf}
        disabled={isGeneratingPdf}
        className={`${baseButtonStyles} ${isGeneratingPdf ? 'opacity-75 cursor-wait' : ''}`}
      >
        {isGeneratingPdf ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        <span>{isGeneratingPdf ? 'Generating PDF...' : label}</span>
      </button>

      {/* Confirmation Notification when downloaded */}
      {downloaded && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>PDF Document (.pdf) downloaded successfully!</span>
        </div>
      )}
    </div>
  );
};
