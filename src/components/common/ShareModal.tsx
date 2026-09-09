import React, { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, QrCode, Globe, Shield, X, Eye } from 'lucide-react';
import { CVData } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  resumeTitle?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  cvData,
  resumeTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPublicAccessEnabled, setIsPublicAccessEnabled] = useState(true);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : 'https://cvbuilder.app';
  const shareId = encodeURIComponent(
    (cvData.personal.fullName || 'resume').toLowerCase().replace(/[^a-z0-9]/g, '-')
  );
  const shareableUrl = `${currentUrl}#preview=${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Share Your Resume</h3>
              <p className="text-[11px] text-slate-300">Generate a clean, web-viewable link for recruiters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Public link field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>PUBLIC SHAREABLE LINK</span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live & Read-Only
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Privacy info */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>How recruiters experience your link</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 pl-1">
              <li>Recruiters see a clean full-screen interactive view of your CV without editing controls.</li>
              <li>Includes one-click PDF and DOCX download buttons for the hiring manager.</li>
              <li>Always shows your latest edits in real time.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              window.open(shareableUrl, '_blank');
            }}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Open Live Preview
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
