import React, { useState } from 'react';
import { Experience, CVStyleOptions } from '../../types';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Briefcase,
  AlertCircle,
  Percent,
} from 'lucide-react';
import { RichTextEditor } from '../common/RichTextEditor';
import { LayoutOptionsPopover } from './LayoutOptionsPopover';

interface ExperienceTabProps {
  experiences?: Experience[];
  style?: CVStyleOptions;
  onChange: (updated: Experience[]) => void;
  onChangeStyle?: (newStyle: CVStyleOptions) => void;
  activePopover?: string | null;
  onTogglePopover?: (section: string) => void;
  onClosePopover?: () => void;
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({
  experiences = [],
  style,
  onChange,
  onChangeStyle,
  activePopover: externalActivePopover,
  onTogglePopover: externalTogglePopover,
  onClosePopover: externalClosePopover,
}) => {
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const [expandedId, setExpandedId] = useState<string | null>(safeExperiences[0]?.id || null);
  const [internalPopover, setInternalPopover] = useState<string | null>(null);

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

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      jobTitle: 'New Position',
      company: 'Company Name',
      location: 'City, Country',
      startDate: 'Jan 2023',
      endDate: 'Present',
      current: true,
      bullets: [
        'Spearheaded key operational initiatives increasing project throughput by 25%.',
        'Collaborated with cross-functional teams to deliver scalable solutions on time.',
      ],
    };
    onChange([newExp, ...safeExperiences]);
    setExpandedId(newExp.id);
  };

  const handleUpdateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(
      safeExperiences.map((exp) => {
        if (exp.id === id) {
          return { ...exp, [field]: value };
        }
        return exp;
      })
    );
  };

  const handleDeleteExperience = (id: string) => {
    onChange(safeExperiences.filter((exp) => exp.id !== id));
  };

  const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= safeExperiences.length) return;
    const newItems = [...safeExperiences];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    onChange(newItems);
  };

  const handleAddBullet = (expId: string) => {
    onChange(
      safeExperiences.map((exp) => {
        if (exp.id === expId) {
          const currentBullets = Array.isArray(exp.bullets) ? exp.bullets : [];
          return {
            ...exp,
            bullets: [...currentBullets, 'Achieved measurable impact by optimizing core workflow processes by 20%.'],
          };
        }
        return exp;
      })
    );
  };

  const handleUpdateBullet = (expId: string, index: number, text: string) => {
    onChange(
      safeExperiences.map((exp) => {
        if (exp.id === expId) {
          const newBullets = [...(Array.isArray(exp.bullets) ? exp.bullets : [])];
          newBullets[index] = text;
          return { ...exp, bullets: newBullets };
        }
        return exp;
      })
    );
  };

  const handleDeleteBullet = (expId: string, index: number) => {
    onChange(
      safeExperiences.map((exp) => {
        if (exp.id === expId) {
          const currentBullets = Array.isArray(exp.bullets) ? exp.bullets : [];
          return {
            ...exp,
            bullets: currentBullets.filter((_, i) => i !== index),
          };
        }
        return exp;
      })
    );
  };

  const handleMoveBullet = (expId: string, bulletIndex: number, direction: 'up' | 'down') => {
    onChange(
      safeExperiences.map((exp) => {
        if (exp.id === expId) {
          const bullets = [...(Array.isArray(exp.bullets) ? exp.bullets : [])];
          const target = direction === 'up' ? bulletIndex - 1 : bulletIndex + 1;
          if (target < 0 || target >= bullets.length) return exp;
          const [moved] = bullets.splice(bulletIndex, 1);
          bullets.splice(target, 0, moved);
          return { ...exp, bullets };
        }
        return exp;
      })
    );
  };

  const polishBulletWithActionVerb = (expId: string, index: number, currentText: string) => {
    const actionVerbs = [
      'Spearheaded',
      'Orchestrated',
      'Architected',
      'Engineered',
      'Delivered',
      'Accelerated',
      'Maximized',
      'Pioneered',
      'Streamlined',
    ];
    const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    let improved = currentText.trim();
    if (!improved.match(/^[A-Z][a-z]+ed\b/)) {
      improved = `${randomVerb} key initiative: ${currentText}`;
    }
    handleUpdateBullet(expId, index, improved);
  };

  const insertMetricTemplate = (expId: string, index: number, currentText: string) => {
    const improved = `${currentText} resulting in a 30% increase in efficiency.`;
    handleUpdateBullet(expId, index, improved);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div
          onMouseEnter={() => openPopover('experience')}
          onClick={() => togglePopover('experience')}
          className="cursor-pointer group select-none"
          title="Hover or click for Layout Options"
        >
          <label className="text-[11px] font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1.5 group-hover:text-purple-700 transition-colors cursor-pointer">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600 group-hover:text-purple-600 transition-colors" />
            <span>Work Experience ({safeExperiences.length})</span>
          </label>
          <p className="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors">
            Reorder positions or individual bullet points to highlight your strongest impact
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddExperience}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Position
          </button>
          <LayoutOptionsPopover
            sectionKey="experience"
            sectionTitle="Work Experience"
            isGroupable={true}
            style={style}
            onChangeStyle={onChangeStyle}
            isOpen={activePopover === 'experience'}
            onToggle={() => togglePopover('experience')}
            onOpen={() => openPopover('experience')}
            onClose={closePopover}
          />
        </div>
      </div>

      {/* Empty State */}
      {safeExperiences.length === 0 && (
        <div className="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No work experience entries yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Work experience is the most weighted section on standard and ATS resumes.
          </p>
          <button
            onClick={handleAddExperience}
            className="mt-3 text-xs font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-xs hover:bg-indigo-700 cursor-pointer"
          >
            + Add First Position
          </button>
        </div>
      )}

      {/* Experience List */}
      <div className="space-y-3">
        {safeExperiences.map((exp, expIdx) => {
          const isExpanded = expandedId === exp.id;
          const bullets = Array.isArray(exp.bullets) ? exp.bullets : [];
          const totalCharCount = bullets.reduce((acc, b) => acc + b.length, 0);

          return (
            <div
              key={exp.id}
              className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden transition-all"
            >
              {/* Accordion Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                className="p-3.5 bg-slate-50/80 hover:bg-slate-100/90 cursor-pointer flex items-center justify-between select-none"
              >
                <div className="flex items-center gap-2.5">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      disabled={expIdx === 0}
                      onClick={() => handleMoveExperience(expIdx, 'up')}
                      title="Move Position Up"
                      className="p-0.5 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-600 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      disabled={expIdx === safeExperiences.length - 1}
                      onClick={() => handleMoveExperience(expIdx, 'down')}
                      title="Move Position Down"
                      className="p-0.5 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-600 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {expIdx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{exp.jobTitle || 'Untitled Position'}</h4>
                    <p className="text-[11px] text-slate-500">
                      {exp.company || 'Company'} · {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    title="Delete position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Accordion Content Form */}
              {isExpanded && (
                <div className="p-4 space-y-4 border-t border-slate-200/80 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.jobTitle || ''}
                        onChange={(e) => handleUpdateExperience(exp.id, 'jobTitle', e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                        placeholder="e.g. Google, Stripe, Acme Corp"
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
                        value={exp.location || ''}
                        onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
                        placeholder="e.g. San Francisco, CA (or Remote)"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                        placeholder="e.g. Mar 2021"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">End Date</label>
                        <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(exp.current)}
                            onChange={(e) => {
                              handleUpdateExperience(exp.id, 'current', e.target.checked);
                              if (e.target.checked) {
                                handleUpdateExperience(exp.id, 'endDate', 'Present');
                              }
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3 cursor-pointer"
                          />
                          <span>Current</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        disabled={Boolean(exp.current)}
                        value={exp.current ? 'Present' : exp.endDate || ''}
                        onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                        placeholder="e.g. Present or Dec 2023"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Bullet Points with Reorder & Rich Formatting */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        Key Responsibilities & Quantified Achievements
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">
                          {bullets.length} bullet(s) · {totalCharCount} total chars
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddBullet(exp.id)}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Bullet</span>
                        </button>
                      </div>
                    </div>

                    {bullets.map((bullet, bulletIdx) => (
                      <div
                        key={bulletIdx}
                        className="flex items-start gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200/80 group"
                      >
                        {/* Bullet Reorder Handles */}
                        <div className="flex flex-col gap-0.5 pt-1 shrink-0">
                          <button
                            disabled={bulletIdx === 0}
                            onClick={() => handleMoveBullet(exp.id, bulletIdx, 'up')}
                            title="Move bullet up"
                            className="p-0.5 hover:bg-slate-200 disabled:opacity-20 rounded text-slate-500 cursor-pointer"
                          >
                            <ArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            disabled={bulletIdx === bullets.length - 1}
                            onClick={() => handleMoveBullet(exp.id, bulletIdx, 'down')}
                            title="Move bullet down"
                            className="p-0.5 hover:bg-slate-200 disabled:opacity-20 rounded text-slate-500 cursor-pointer"
                          >
                            <ArrowDown className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <div className="flex-1 space-y-1">
                          <RichTextEditor
                            value={bullet}
                            onChange={(newVal) => handleUpdateBullet(exp.id, bulletIdx, newVal)}
                            placeholder="Describe achievement with quantifiable metrics (e.g. Increased conversion rate by 34% by redesigning onboarding flow)..."
                            rows={2}
                            maxRecommendedLength={220}
                            enableActionVerbs={true}
                          />

                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => polishBulletWithActionVerb(exp.id, bulletIdx, bullet)}
                              className="text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium cursor-pointer"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                              Action Verb
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMetricTemplate(exp.id, bulletIdx, bullet)}
                              className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium cursor-pointer"
                            >
                              <Percent className="w-2.5 h-2.5 text-emerald-500" />
                              Add Metric (+30%)
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBullet(exp.id, bulletIdx)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors shrink-0 cursor-pointer mt-1"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
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
