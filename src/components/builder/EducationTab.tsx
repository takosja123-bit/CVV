import React, { useState, useEffect } from 'react';
import { Education, CVStyleOptions } from '../../types';
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown, GraduationCap } from 'lucide-react';
import { RichTextEditor } from '../common/RichTextEditor';
import { LayoutOptionsPopover } from './LayoutOptionsPopover';

interface EducationTabProps {
  education?: Education[];
  style?: CVStyleOptions;
  onChange: (updated: Education[]) => void;
  onChangeStyle?: (newStyle: CVStyleOptions) => void;
  activePopover?: string | null;
  onTogglePopover?: (section: string) => void;
  onClosePopover?: () => void;
  focusEntryId?: string | null;
}

export const EducationTab: React.FC<EducationTabProps> = ({
  education = [],
  style,
  onChange,
  onChangeStyle,
  activePopover: externalActivePopover,
  onTogglePopover: externalTogglePopover,
  onClosePopover: externalClosePopover,
  focusEntryId,
}) => {
  const safeEducation = Array.isArray(education) ? education : [];
  const [expandedId, setExpandedId] = useState<string | null>(safeEducation[0]?.id || null);
  const [internalPopover, setInternalPopover] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    if (focusEntryId) {
      setExpandedId(focusEntryId);
      setHighlightId(focusEntryId);
      const scrollTimer = setTimeout(() => {
        document.getElementById(`edu-entry-${focusEntryId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
      const clearTimer = setTimeout(() => setHighlightId(null), 1800);
      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [focusEntryId]);

  const activePopover = externalActivePopover !== undefined ? externalActivePopover : internalPopover;
  const togglePopover = (key: string) => {
    if (externalTogglePopover) {
      externalTogglePopover(key);
    } else {
      setInternalPopover((prev) => (prev === key ? null : key));
    }
  };
  const openPopover = (key: string) => {
    if (externalTogglePopover) {
      if (externalActivePopover !== key) {
        externalTogglePopover(key);
      }
    } else {
      setInternalPopover(key);
    }
  };
  const closePopover = () => {
    if (externalClosePopover) {
      externalClosePopover();
    } else {
      setInternalPopover(null);
    }
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: 'University Name',
      degree: 'Bachelor of Science in Computer Science',
      location: 'City, Country',
      startDate: '2018',
      endDate: '2022',
      details: 'Graduated with Magna Cum Laude honors. Relevant coursework: Distributed Systems, Algorithms, UX Engineering.',
    };
    onChange([...safeEducation, newEdu]);
    setExpandedId(newEdu.id);
  };

  const handleUpdate = (id: string, field: keyof Education, value: any) => {
    onChange(
      safeEducation.map((edu) => {
        if (edu.id === id) {
          return { ...edu, [field]: value };
        }
        return edu;
      })
    );
  };

  const handleDelete = (id: string) => {
    onChange(safeEducation.filter((edu) => edu.id !== id));
  };

  const handleMoveEducation = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= safeEducation.length) return;
    const items = [...safeEducation];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div
          onMouseEnter={() => openPopover('education')}
          onClick={() => togglePopover('education')}
          className="cursor-pointer group select-none"
          title="Hover or click for Layout Options"
        >
          <label className="text-[11px] font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1.5 group-hover:text-purple-700 transition-colors cursor-pointer">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600 group-hover:text-purple-600 transition-colors" />
            <span>Education & Degrees ({safeEducation.length})</span>
          </label>
          <p className="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors">
            List academic degrees, diplomas, and academic honors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddEducation}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Education
          </button>
          <LayoutOptionsPopover
            sectionKey="education"
            sectionTitle="Education"
            isGroupable={true}
            style={style}
            onChangeStyle={onChangeStyle}
            isOpen={activePopover === 'education'}
            onToggle={() => togglePopover('education')}
            onOpen={() => openPopover('education')}
            onClose={closePopover}
          />
        </div>
      </div>

      {safeEducation.length === 0 && (
        <div className="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6">
          <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No education entries yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Add university, college, or certified bootcamps to demonstrate formal foundations.
          </p>
          <button
            onClick={handleAddEducation}
            className="mt-3 text-xs font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-xs hover:bg-indigo-700 cursor-pointer"
          >
            + Add Education
          </button>
        </div>
      )}

      <div className="space-y-3">
        {safeEducation.map((edu, idx) => {
          const isExpanded = expandedId === edu.id;
          return (
            <div
              key={edu.id}
              id={`edu-entry-${edu.id}`}
              className={`bg-white border rounded-xl shadow-2xs overflow-hidden transition-all ${
                highlightId === edu.id ? 'ring-2 ring-[#0057B8] border-[#0057B8]' : 'border-slate-200'
              }`}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                className="p-3.5 bg-slate-50/80 hover:bg-slate-100/90 cursor-pointer flex items-center justify-between select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveEducation(idx, 'up')}
                      title="Move up"
                      className="p-0.5 hover:bg-slate-200 disabled:opacity-20 rounded text-slate-600 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      disabled={idx === safeEducation.length - 1}
                      onClick={() => handleMoveEducation(idx, 'down')}
                      title="Move down"
                      className="p-0.5 hover:bg-slate-200 disabled:opacity-20 rounded text-slate-600 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{edu.institution || 'University / Institution'}</h4>
                    <p className="text-[11px] text-slate-500">{edu.degree || 'Degree'} · {edu.endDate || edu.startDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    title="Delete education"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-4 border-t border-slate-200/80 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                        placeholder="e.g. Stanford University"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Degree / Major
                      </label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                        placeholder="e.g. B.S. in Computer Science"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={edu.location || ''}
                        onChange={(e) => handleUpdate(edu.id, 'location', e.target.value)}
                        placeholder="e.g. Cambridge, MA"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Start Year / Date
                      </label>
                      <input
                        type="text"
                        value={edu.startDate || ''}
                        onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                        placeholder="e.g. 2018"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Graduation Year / Date
                      </label>
                      <input
                        type="text"
                        value={edu.endDate || ''}
                        onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                        placeholder="e.g. 2022"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Honors, GPA & Notable Coursework
                    </label>
                    <RichTextEditor
                      value={edu.details || ''}
                      onChange={(newVal) => handleUpdate(edu.id, 'details', newVal)}
                      placeholder="e.g. GPA 3.9/4.0, Dean's Honor List, Relevant coursework in Machine Learning and System Architecture..."
                      rows={2}
                      maxRecommendedLength={250}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
