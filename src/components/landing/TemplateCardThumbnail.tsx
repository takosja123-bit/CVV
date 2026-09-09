import React from 'react';
import { TemplateId } from '../../types';

interface TemplateCardThumbnailProps {
  templateId: TemplateId;
}

export const TemplateCardThumbnail: React.FC<TemplateCardThumbnailProps> = ({ templateId }) => {
  return (
    <div className="w-full h-24 bg-white rounded-t border-b border-slate-100 overflow-hidden relative select-none text-[6px] leading-[8px] pointer-events-none">
      {/* Harvard ATS Standard */}
      {templateId === 'template-ats-classic' && (
        <div className="w-full h-full p-2 bg-white flex flex-col justify-between font-serif">
          <div className="text-center space-y-0.5 border-b border-slate-700 pb-1">
            <div className="w-16 h-1 bg-slate-900 mx-auto rounded-xs font-bold" />
            <div className="w-10 h-0.5 bg-slate-600 mx-auto rounded-xs" />
            <div className="w-14 h-0.5 bg-slate-400 mx-auto rounded-xs" />
          </div>
          <div className="space-y-1 my-auto">
            <div className="w-8 h-0.5 bg-slate-800 rounded-xs font-bold" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
            <div className="w-5/6 h-0.5 bg-slate-200 rounded-xs" />
          </div>
          <div className="space-y-0.5">
            <div className="w-6 h-0.5 bg-slate-800 rounded-xs" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
          </div>
        </div>
      )}

      {/* Modern Sans ATS */}
      {templateId === 'template-ats-modern' && (
        <div className="w-full h-full p-2 bg-white flex flex-col justify-between font-sans">
          <div className="space-y-0.5 border-b-2 border-slate-900 pb-1">
            <div className="w-14 h-1.5 bg-slate-900 rounded-xs font-bold" />
            <div className="w-8 h-0.5 bg-indigo-600 rounded-xs" />
          </div>
          <div className="space-y-1">
            <div className="w-10 h-0.5 bg-slate-800 rounded-xs" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
            <div className="w-4/5 h-0.5 bg-slate-200 rounded-xs" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
            <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
          </div>
        </div>
      )}

      {/* Executive ATS Formal */}
      {templateId === 'template-ats-executive' && (
        <div className="w-full h-full p-2 bg-[#FAF9F6] flex flex-col justify-between font-serif">
          <div className="text-center space-y-0.5 border-b-2 border-double border-slate-800 pb-1">
            <div className="w-16 h-1 bg-slate-900 mx-auto rounded-xs tracking-wider" />
            <div className="w-12 h-0.5 bg-slate-500 mx-auto rounded-xs" />
          </div>
          <div className="space-y-1">
            <div className="w-8 h-0.5 bg-slate-800 rounded-xs" />
            <div className="w-full h-0.5 bg-slate-300 rounded-xs" />
            <div className="w-3/4 h-0.5 bg-slate-200 rounded-xs" />
          </div>
          <div className="space-y-0.5">
            <div className="w-7 h-0.5 bg-slate-800 rounded-xs" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
          </div>
        </div>
      )}

      {/* Black Badge Archetype (Sam Hill) */}
      {templateId === 'template-black-badge' && (
        <div className="w-full h-full flex flex-col bg-white">
          <div className="bg-black p-1.5 text-white flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="w-12 h-1 bg-white rounded-xs" />
              <div className="w-8 h-0.5 bg-white/70 rounded-xs" />
            </div>
            <div className="w-4 h-4 rounded-full bg-white/30" />
          </div>
          <div className="flex flex-1 p-1 gap-1">
            <div className="w-1/3 bg-slate-100 p-0.5 space-y-0.5">
              <div className="w-full h-0.5 bg-slate-300" />
              <div className="w-3/4 h-0.5 bg-slate-300" />
            </div>
            <div className="w-2/3 space-y-1 p-0.5">
              <div className="w-10 h-0.5 bg-black" />
              <div className="w-full h-0.5 bg-slate-200" />
            </div>
          </div>
        </div>
      )}

      {/* Teal Grid Archetype (Peter Madison) */}
      {templateId === 'template-teal-grid' && (
        <div className="w-full h-full flex flex-col bg-white">
          <div className="bg-[#3b8478] p-1.5 text-white flex items-center justify-between">
            <div className="w-12 h-1 bg-white rounded-xs" />
            <div className="w-4 h-4 rounded-full bg-white/30" />
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 flex-1">
            <div className="border border-[#3b8478]/30 p-0.5 space-y-0.5">
              <div className="w-6 h-0.5 bg-[#3b8478]" />
              <div className="w-full h-0.5 bg-slate-200" />
            </div>
            <div className="border border-[#3b8478]/30 p-0.5 space-y-0.5">
              <div className="w-6 h-0.5 bg-[#3b8478]" />
              <div className="w-full h-0.5 bg-slate-200" />
            </div>
          </div>
        </div>
      )}

      {/* Sage Sidebar Archetype (Joanna Brown) */}
      {templateId === 'template-sage-sidebar' && (
        <div className="w-full h-full flex bg-white">
          <div className="w-4/12 bg-[#67917f] p-1 text-white space-y-1">
            <div className="w-3 h-3 rounded-full bg-white/40 mx-auto" />
            <div className="w-full h-0.5 bg-white/60" />
            <div className="w-3/4 h-0.5 bg-white/40" />
          </div>
          <div className="w-8/12 p-1.5 space-y-1">
            <div className="w-10 h-1 bg-[#67917f] rounded-xs" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
            <div className="w-4/5 h-0.5 bg-slate-100 rounded-xs" />
          </div>
        </div>
      )}

      {/* Template B: Classic Navy Banner */}
      {(templateId === 'template-b' || templateId === 'classic') && (
        <div className="w-full h-full flex flex-col">
          <div className="bg-[#1e3a5f] p-1.5 text-white flex flex-col items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/40 mb-0.5" />
            <div className="w-12 h-1 bg-white rounded-xs" />
            <div className="w-8 h-0.5 bg-white/60 rounded-xs mt-0.5" />
          </div>
          <div className="flex gap-1.5 p-1 flex-1">
            <div className="w-5/12 space-y-1">
              <div className="w-6 h-0.5 bg-blue-900 rounded-xs" />
              <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
              <div className="w-4/5 h-0.5 bg-slate-100 rounded-xs" />
            </div>
            <div className="w-7/12 border-l border-slate-100 pl-1 space-y-1">
              <div className="w-8 h-0.5 bg-blue-900 rounded-xs" />
              <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
            </div>
          </div>
        </div>
      )}

      {/* Template C: Vintage Stone Frame */}
      {templateId === 'template-c' && (
        <div className="w-full h-full p-1 bg-[#FAF8F5]">
          <div className="w-full h-full border border-[#D5CDBD] p-1 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <div className="w-10 h-1 bg-[#3a352f] rounded-xs" />
                <div className="w-6 h-0.5 bg-[#8A7F6E] rounded-xs mt-0.5" />
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-[#D5CDBD]" />
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <div className="w-full h-0.5 bg-[#E8E3DA] rounded-xs" />
              <div className="w-full h-0.5 bg-[#E8E3DA] rounded-xs" />
            </div>
          </div>
        </div>
      )}

      {/* Template D: Slate Split Sidebar */}
      {(templateId === 'template-d' || templateId === 'modern') && (
        <div className="w-full h-full flex">
          <div className="w-5/12 bg-[#475569] p-1 text-white space-y-1">
            <div className="w-3.5 h-3.5 rounded-full bg-white/40 mx-auto" />
            <div className="w-8 h-0.5 bg-white mx-auto rounded-xs" />
            <div className="w-full h-0.5 bg-white/30 rounded-xs" />
          </div>
          <div className="w-7/12 p-1 space-y-1">
            <div className="w-8 h-1 bg-[#475569] rounded-xs" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
            <div className="w-4/5 h-0.5 bg-slate-100 rounded-xs" />
          </div>
        </div>
      )}

      {/* Template E: Burgundy Hexagon */}
      {(templateId === 'template-e' || templateId === 'red') && (
        <div className="w-full h-full flex flex-col">
          <div className="bg-[#881337] p-1 text-white flex items-center gap-1">
            <div className="w-3.5 h-3.5 bg-white/30 rotate-45 shrink-0" />
            <div>
              <div className="w-10 h-1 bg-white rounded-xs" />
              <div className="w-6 h-0.5 bg-rose-200 rounded-xs mt-0.5" />
            </div>
          </div>
          <div className="flex gap-1 p-1 flex-1">
            <div className="w-7/12 space-y-1">
              <div className="w-6 h-0.5 bg-rose-900 rounded-xs" />
              <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
            </div>
            <div className="w-5/12 space-y-1">
              <div className="w-5 h-0.5 bg-rose-900 rounded-xs" />
              <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
            </div>
          </div>
        </div>
      )}

      {/* Template F: Emerald Gold Timeline */}
      {templateId === 'template-f' && (
        <div className="w-full h-full flex">
          <div className="w-5/12 p-1 space-y-1 bg-white border-r border-slate-100">
            <div className="w-3 h-3 rounded-full bg-emerald-700 mx-auto" />
            <div className="w-8 h-0.5 bg-slate-800 mx-auto rounded-xs" />
          </div>
          <div className="w-7/12 bg-[#064e3b] p-1 text-white space-y-1">
            <div className="w-8 h-0.5 bg-amber-400 rounded-xs" />
            <div className="w-full h-0.5 bg-white/40 rounded-xs" />
          </div>
        </div>
      )}

      {/* Template G: Golden Minimalist */}
      {(templateId === 'template-g' || templateId === 'minimalist') && (
        <div className="w-full h-full p-1 bg-[#FFFDF9] space-y-1">
          <div className="text-center space-y-0.5">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 mx-auto" />
            <div className="w-10 h-1 bg-amber-900 mx-auto rounded-xs" />
          </div>
          <div className="flex gap-1">
            <div className="w-1/2 h-0.5 bg-amber-200" />
            <div className="w-1/2 h-0.5 bg-amber-200" />
          </div>
        </div>
      )}

      {/* Template H: Nature Forest Sidebar */}
      {templateId === 'template-h' && (
        <div className="w-full h-full flex">
          <div className="w-4/12 bg-[#1b4332] p-1 text-white space-y-1">
            <div className="w-3 h-3 rounded-full bg-emerald-400 mx-auto" />
            <div className="w-full h-0.5 bg-white/40" />
          </div>
          <div className="w-8/12 p-1 space-y-1">
            <div className="w-8 h-1 bg-slate-800 rounded-xs" />
            <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
          </div>
        </div>
      )}

      {/* Template I: Cyan Double Border */}
      {templateId === 'template-i' && (
        <div className="w-full h-full p-1 bg-white">
          <div className="w-full h-full border border-cyan-600 p-1 flex flex-col justify-between">
            <div className="text-center">
              <div className="w-10 h-1 bg-cyan-800 mx-auto rounded-xs" />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="w-full h-0.5 bg-cyan-200" />
              <div className="w-full h-0.5 bg-cyan-200" />
            </div>
          </div>
        </div>
      )}

      {/* Template J: Rose Blossom Header */}
      {templateId === 'template-j' && (
        <div className="w-full h-full p-1.5 space-y-1 bg-white">
          <div className="flex justify-between">
            <div className="w-10 h-1.5 bg-rose-600 rounded-xs" />
            <div className="w-6 h-1 bg-rose-200 rounded-xs" />
          </div>
          <div className="w-8 h-0.5 bg-rose-400 mx-auto" />
          <div className="w-full h-0.5 bg-slate-100" />
        </div>
      )}

      {/* Template K: Royal Blue Timeline */}
      {templateId === 'template-k' && (
        <div className="w-full h-full flex">
          <div className="w-5/12 p-1 space-y-1">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-600 mx-auto" />
            <div className="w-full h-1 bg-blue-600 rounded-xs" />
          </div>
          <div className="w-7/12 p-1 border-l-2 border-blue-600 space-y-1">
            <div className="w-8 h-1 bg-blue-600 rounded-xs" />
            <div className="w-full h-0.5 bg-slate-100" />
          </div>
        </div>
      )}

      {/* Template L: Coral & Navy Split */}
      {templateId === 'template-l' && (
        <div className="w-full h-full flex flex-col">
          <div className="bg-orange-200 p-1 flex justify-between items-center">
            <div className="w-8 h-1 bg-slate-900 rounded-xs" />
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <div className="flex flex-1">
            <div className="w-5/12 bg-[#0f172a] p-1">
              <div className="w-6 h-0.5 bg-orange-400" />
            </div>
            <div className="w-7/12 p-1 space-y-1">
              <div className="w-6 h-0.5 bg-slate-800" />
              <div className="w-full h-0.5 bg-slate-100" />
            </div>
          </div>
        </div>
      )}

      {/* Template M: Ocean Teal Modern */}
      {(templateId === 'template-m' || templateId === 'teal' || templateId === 'executive') && (
        <div className="w-full h-full flex flex-col">
          <div className="p-1 text-center">
            <div className="w-3 h-3 rounded-full bg-sky-500 mx-auto mb-0.5" />
            <div className="w-8 h-0.5 bg-slate-900 mx-auto" />
          </div>
          <div className="flex flex-1">
            <div className="w-5/12 bg-[#0284c7] p-1">
              <div className="w-6 h-0.5 bg-sky-200" />
            </div>
            <div className="w-7/12 p-1 space-y-1">
              <div className="w-6 h-0.5 bg-slate-800" />
              <div className="w-full h-0.5 bg-slate-100" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
