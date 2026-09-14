import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { TEMPLATES, INITIAL_CV_DATA } from '../../data/initialData';
import { TemplateId } from '../../types';
import { TemplateCarousel } from '../landing/TemplateCarousel';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: TemplateId, resumeTitle?: string) => void;
  initialTemplateId?: TemplateId;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  initialTemplateId,
}) => {
  if (!isOpen) return null;

  const [selectedTmpl, setSelectedTmpl] = useState<TemplateId>(initialTemplateId || TEMPLATES[0].id);
  const [resumeTitle, setResumeTitle] = useState('My New Resume');

  const handleStartWithTemplate = (templateIdToUse: TemplateId) => {
    const chosenTmpl = TEMPLATES.find((t) => t.id === templateIdToUse);
    const titleToUse = resumeTitle.trim() || `${chosenTmpl?.name || 'New'} Resume`;
    onSelectTemplate(templateIdToUse, titleToUse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Choose a Template for Your New Resume
            </h2>
            <p className="text-xs text-slate-500">
              Browse full-size designs below. You can freely customize all sections and colors anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Name input */}
        <div className="px-6 py-3 bg-blue-50/40 border-b border-blue-100 flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 shrink-0">
            Resume Title:
          </label>
          <input
            type="text"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer Resume"
            className="flex-1 max-w-md px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Template Carousel */}
        <div className="flex-1 overflow-y-auto py-6">
          <TemplateCarousel
            data={INITIAL_CV_DATA}
            selectedTemplate={selectedTmpl}
            onSelectTemplate={setSelectedTmpl}
            onCreateCV={handleStartWithTemplate}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Selected Design: <strong className="text-slate-800">{TEMPLATES.find((t) => t.id === selectedTmpl)?.name}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleStartWithTemplate(selectedTmpl)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
