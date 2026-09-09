import React, { useState } from 'react';
import { Sparkles, X, Check, RefreshCw, Plus, CheckCircle2, Copy } from 'lucide-react';

interface AIEnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSummary: string;
  jobTitle: string;
  fullName: string;
  onApply: (newSummary: string) => void;
}

export const AIEnhanceModal: React.FC<AIEnhanceModalProps> = ({
  isOpen,
  onClose,
  currentSummary,
  jobTitle,
  fullName,
  onApply,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<'executive' | 'metrics' | 'creative' | 'concise'>('metrics');
  const [isGenerating, setIsGenerating] = useState(false);
  const [acceptedSentences, setAcceptedSentences] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const role = jobTitle || 'Professional';

  const generatedOptions = {
    executive: [
      `Accomplished ${role} with a demonstrated record of strategic leadership, revenue generation, and organizational transformation.`,
      `Expert at aligning cross-functional teams, steering multimillion-dollar programs, and driving high-impact commercial outcomes in fast-paced competitive markets.`,
      `Pioneers forward-thinking operational standards that boost stakeholder confidence and accelerate enterprise growth.`,
    ],
    metrics: [
      `Results-driven ${role} with extensive track record in optimizing operational efficiency and scaling core revenues by 35%+.`,
      `Specialized in data-led decision frameworks, performance optimization, and high-velocity project execution.`,
      `Delivered 99.9% on-time milestone completion across high-stakes initiatives while cutting project overhead by 22%.`,
    ],
    creative: [
      `Innovative and vision-focused ${role} passionate about building memorable brand narratives and engaging customer experiences.`,
      `Proven capability in turning complex market challenges into high-converting campaigns and impactful digital products.`,
      `Combines aesthetic craftsmanship with user-centric engineering to inspire high-performing teams.`,
    ],
    concise: [
      `Versatile ${role} recognized for disciplined execution, team leadership, and strategic problem-solving.`,
      `Consistently delivers measurable performance, streamlined architectures, and scalable business growth.`,
    ],
  };

  const currentSentences = generatedOptions[selectedStyle];

  const handleToggleSentence = (index: number) => {
    setAcceptedSentences((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleApplyAll = () => {
    onApply(currentSentences.join(' '));
    onClose();
  };

  const handleApplySelected = () => {
    const selected = currentSentences.filter((_, idx) => acceptedSentences[idx] !== false);
    if (selected.length === 0) {
      onApply(currentSentences.join(' '));
    } else {
      onApply(selected.join(' '));
    }
    onClose();
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">AI Professional Summary Enhancer</h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-300/30">
                  Granular Approval
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                Review and accept/reject suggestions individually before applying
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Tone Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">
              SELECT DESIRED TONE & OBJECTIVE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'metrics', label: '📊 Metrics & Growth', desc: 'Focus on numbers & KPIs' },
                { id: 'executive', label: '👔 Executive Leader', desc: 'High-level strategy & leadership' },
                { id: 'creative', label: '🎨 Creative & Narrative', desc: 'Brand & engagement focus' },
                { id: 'concise', label: '⚡ Punchy & Direct', desc: 'Clean, fast to read' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setSelectedStyle(style.id as any);
                    setAcceptedSentences({});
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    selectedStyle === style.id
                      ? 'border-purple-600 bg-purple-50/80 text-purple-950 font-semibold ring-2 ring-purple-600/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div>{style.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Granular Suggestions List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <span>AI SUGGESTED STATEMENTS</span>
                <span className="text-[10px] text-purple-600 font-normal bg-purple-50 px-1.5 py-0.5 rounded">
                  Toggle checkmarks to include/exclude
                </span>
              </label>
              <button
                onClick={handleRegenerate}
                className="text-[11px] text-purple-700 hover:text-purple-900 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="space-y-2">
              {currentSentences.map((sentence, idx) => {
                const isSelected = acceptedSentences[idx] !== false;
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleSentence(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-purple-50/60 border-purple-300 text-slate-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 line-through opacity-60'
                    }`}
                  >
                    <div className="pt-0.5">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <div className="flex-1 text-xs leading-relaxed font-medium">
                      {sentence}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current vs Proposed Comparison */}
          {currentSummary && (
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Currently in Resume
              </label>
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic line-clamp-3">
                "{currentSummary}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplySelected}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Apply Selected ({currentSentences.filter((_, i) => acceptedSentences[i] !== false).length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
