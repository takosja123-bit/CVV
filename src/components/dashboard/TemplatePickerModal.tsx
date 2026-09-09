import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { TEMPLATES } from '../../data/initialData';
import { TemplateId } from '../../types';
import { TemplateCardThumbnail } from '../landing/TemplateCardThumbnail';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Designs' },
    { id: 'ats', label: 'ATS Standard' },
    { id: 'creative', label: 'Modern & Creative' },
    { id: 'executive', label: 'Executive' },
  ];

  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ats') return tmpl.id.startsWith('template-ats') || tmpl.badge.includes('ATS');
    if (selectedCategory === 'executive') return tmpl.badge.includes('Executive') || tmpl.name.includes('Formal');
    if (selectedCategory === 'creative') return !tmpl.id.startsWith('template-ats');
    return true;
  });

  const handleStartWithTemplate = (templateIdToUse: TemplateId) => {
    const chosenTmpl = TEMPLATES.find((t) => t.id === templateIdToUse);
    const titleToUse = resumeTitle.trim() || `${chosenTmpl?.name || 'New'} Resume`;
    onSelectTemplate(templateIdToUse, titleToUse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Choose a Template for Your New Resume
            </h2>
            <p className="text-xs text-slate-500">
              Select any design below. You can freely customize all sections and colors anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Name input & Category Filter */}
        <div className="px-6 py-3 bg-blue-50/40 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-bold text-slate-700 shrink-0">
              Resume Title:
            </label>
            <input
              type="text"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer Resume"
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredTemplates.map((tmpl) => {
              const isSelected = selectedTmpl === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTmpl(tmpl.id)}
                  onDoubleClick={() => handleStartWithTemplate(tmpl.id)}
                  className={`border rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-150 relative group ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/30 shadow-md scale-[1.01]'
                      : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/60'
                  }`}
                >
                  {/* Column Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                    Col {tmpl.columnKey}
                  </div>

                  {/* Thumbnail */}
                  <div className="rounded-lg overflow-hidden border border-slate-200 shadow-2xs relative bg-white">
                    <TemplateCardThumbnail templateId={tmpl.id} />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm z-20">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-left space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {tmpl.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate">{tmpl.badge}</span>
                      <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                        {tmpl.planTier}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
