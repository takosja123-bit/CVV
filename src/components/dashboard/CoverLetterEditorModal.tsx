import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Download,
  FileText,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Send,
} from 'lucide-react';
import { CoverLetterItem } from '../../types';

interface CoverLetterEditorModalProps {
  letter: CoverLetterItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CoverLetterItem) => void;
}

export const CoverLetterEditorModal: React.FC<CoverLetterEditorModalProps> = ({
  letter,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !letter) return null;

  const [formData, setFormData] = useState<CoverLetterItem>({ ...letter });
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = `Dear ${formData.recipientName || 'Hiring Team'},\n\nI am writing to express my enthusiastic interest in the ${formData.jobTitle || 'Role'} position at ${formData.companyName || 'your company'}. With a proven track record of delivering impactful technical and creative solutions, I am confident that my skills and proactive approach align perfectly with your organizational goals.\n\nIn my previous roles, I have consistently exceeded benchmarks, collaborated with cross-functional teams, and spearheaded initiatives that reduced operational bottlenecks while delivering high-quality user experiences. What excites me most about ${formData.companyName || 'your company'} is your commitment to innovation and customer success.\n\nI would welcome the opportunity to discuss how my background and dedication can contribute to the ongoing success of your team. Thank you for your time and consideration.\n\nSincerely,\n${formData.senderName || 'Job Seeker'}`;
      setFormData((prev) => ({ ...prev, body: generated }));
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(formData.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Edit Cover Letter
            </h2>
            <p className="text-xs text-slate-500">
              Customize text and tailor your application to the role
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Job Position
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Name / Team
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientName: e.target.value })
                  }
                  placeholder="e.g. Hiring Team / John Smith"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) =>
                    setFormData({ ...formData, senderName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  value={formData.senderEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, senderEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Phone
                </label>
                <input
                  type="text"
                  value={formData.senderPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, senderPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Cover Letter Content
                </label>
                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Drafting...' : 'AI Auto-Draft'}</span>
                </button>
              </div>
              <textarea
                rows={8}
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                className="w-full p-3 text-xs border border-slate-300 rounded-lg font-sans leading-relaxed focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Right Live Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-xs font-serif leading-relaxed text-slate-800 space-y-4">
              <div>
                <div className="font-bold text-slate-900 font-sans">
                  {formData.senderName || 'Your Name'}
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  {formData.senderEmail} • {formData.senderPhone}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-sans">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              <div>
                <div className="font-bold text-slate-900 font-sans">
                  {formData.recipientName || 'Hiring Team'}
                </div>
                <div className="text-slate-600 font-sans">
                  {formData.companyName || 'Company'}
                </div>
                <div className="text-slate-500 text-[11px] font-sans">
                  Position: {formData.jobTitle || 'Role'}
                </div>
              </div>

              <div className="whitespace-pre-line text-slate-700 pt-2 border-t border-slate-100 font-sans">
                {formData.body}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
