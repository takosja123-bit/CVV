import React, { useState } from 'react';
import { SkillItem, LanguageItem, SkillDisplayStyle, CVStyleOptions } from '../../types';
import { Plus, Trash2, Star, Globe2, Palette, Check, Layers, BarChart2, Tag, Percent, ArrowUp, ArrowDown } from 'lucide-react';
import { getSkillLevel, getLanguageLevel, SkillMeter } from '../templates/TemplateHelpers';
import { LayoutOptionsPopover } from './LayoutOptionsPopover';

interface SkillsTabProps {
  skills?: (string | SkillItem)[];
  languages?: (string | LanguageItem)[];
  skillStyle?: SkillDisplayStyle;
  style?: CVStyleOptions;
  onChangeSkills: (updated: (string | SkillItem)[]) => void;
  onChangeLanguages?: (updated: (string | LanguageItem)[]) => void;
  onChangeSkillStyle?: (style: SkillDisplayStyle) => void;
  onChangeStyle?: (newStyle: CVStyleOptions) => void;
  activePopover?: string | null;
  onTogglePopover?: (section: string) => void;
  onClosePopover?: () => void;
}

const STYLE_OPTIONS: {
  id: SkillDisplayStyle;
  label: string;
  desc: string;
  previewExample: string;
}[] = [
  {
    id: 'segmented',
    label: 'Segmented Meter',
    desc: 'Executive modern 5-bar blocks',
    previewExample: '4/5',
  },
  {
    id: 'bars',
    label: 'Progress Bar',
    desc: 'Sleek continuous linear bar',
    previewExample: '80%',
  },
  {
    id: 'badges',
    label: 'Pill Badges',
    desc: 'Subtle filled tags with rating badge',
    previewExample: 'Adv.',
  },
  {
    id: 'stars',
    label: 'Star Rating',
    desc: 'Polished vector star rating',
    previewExample: '★ 4/5',
  },
  {
    id: 'percentage',
    label: 'Percentage %',
    desc: 'Clear numeric percentage score',
    previewExample: '80%',
  },
  {
    id: 'tags',
    label: 'Minimalist Tags',
    desc: 'Clean bordered keywords (no meters)',
    previewExample: 'Tag',
  },
  {
    id: 'dots',
    label: 'Classic Dots',
    desc: 'Subtle circular rating dots',
    previewExample: '••••○',
  },
];

export const SkillsTab: React.FC<SkillsTabProps> = ({
  skills = [],
  languages = [],
  skillStyle = 'segmented',
  style,
  onChangeSkills,
  onChangeLanguages,
  onChangeSkillStyle,
  onChangeStyle,
  activePopover: externalActivePopover,
  onTogglePopover: externalTogglePopover,
  onClosePopover: externalClosePopover,
}) => {
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeLanguages = Array.isArray(languages) ? languages : [];
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<number>(4);
  const [newLangName, setNewLangName] = useState('');
  const [newLangLevel, setNewLangLevel] = useState<number>(4);
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

  const suggestedSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS',
    'SQL', 'Git & GitHub', 'Project Management', 'Agile / Scrum',
    'Figma / UI Design', 'SEO Optimization', 'Communication'
  ];

  const suggestedLanguages = [
    'English', 'Khmer', 'Spanish', 'French', 'Chinese', 'German', 'Japanese'
  ];

  const handleAddSkill = (nameToAdd: string, level = 4) => {
    const trimmed = nameToAdd.trim();
    if (!trimmed) return;
    const exists = safeSkills.some((s) => getSkillLevel(s).name.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      onChangeSkills([...safeSkills, { name: trimmed, level }]);
      setNewSkillName('');
    }
  };

  const handleUpdateSkillLevel = (index: number, level: number) => {
    const current = safeSkills[index];
    const { name } = getSkillLevel(current);
    const updated = [...safeSkills];
    updated[index] = { name, level };
    onChangeSkills(updated);
  };

  const handleRemoveSkill = (index: number) => {
    onChangeSkills(safeSkills.filter((_, i) => i !== index));
  };

  const handleMoveSkill = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= safeSkills.length) return;
    const updated = [...safeSkills];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    onChangeSkills(updated);
  };

  const handleMoveLanguage = (index: number, direction: 'up' | 'down') => {
    if (!onChangeLanguages) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= safeLanguages.length) return;
    const updated = [...safeLanguages];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    onChangeLanguages(updated);
  };

  const handleAddLanguage = (nameToAdd: string, level = 4) => {
    if (!onChangeLanguages) return;
    const trimmed = nameToAdd.trim();
    if (!trimmed) return;
    const exists = safeLanguages.some((l) => getLanguageLevel(l).name.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      onChangeLanguages([...safeLanguages, { name: trimmed, level }]);
      setNewLangName('');
    }
  };

  const handleUpdateLangLevel = (index: number, level: number) => {
    if (!onChangeLanguages) return;
    const current = safeLanguages[index];
    const { name } = getLanguageLevel(current);
    const updated = [...safeLanguages];
    updated[index] = { name, level };
    onChangeLanguages(updated);
  };

  const handleRemoveLang = (index: number) => {
    if (!onChangeLanguages) return;
    onChangeLanguages(safeLanguages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* SKILL DISPLAY STYLE SELECTOR */}
      {onChangeSkillStyle && (
        <div className="space-y-2.5 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold tracking-wider text-indigo-900 uppercase flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span>SKILL DISPLAY STYLE</span>
            </label>
            <span className="text-[10px] text-indigo-600 font-medium">Applied to template preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STYLE_OPTIONS.map((opt) => {
              const isSelected = skillStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeSkillStyle(opt.id)}
                  className={`p-2 rounded-md text-left transition-all border cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/70 hover:bg-white border-slate-200 text-slate-700 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {opt.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[9.5px] text-slate-500 line-clamp-1">{opt.desc}</span>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-medium">Preview:</span>
                    <div className="scale-90 origin-right">
                      <SkillMeter level={4} style={opt.id} activeColor="#4f46e5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SKILLS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div
            onMouseEnter={() => openPopover('skills')}
            onClick={() => togglePopover('skills')}
            className="cursor-pointer group select-none"
            title="Hover or click for Layout Options"
          >
            <label className="text-[11px] font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1.5 group-hover:text-purple-700 transition-colors cursor-pointer">
              <Star className="w-3.5 h-3.5 text-indigo-600 group-hover:text-purple-600 transition-colors" />
              <span>SKILLS & PROFICIENCY ({safeSkills.length})</span>
            </label>
            <p className="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors">
              Core competencies, frameworks, technologies, and soft skills
            </p>
          </div>
          <LayoutOptionsPopover
            sectionKey="skills"
            sectionTitle="Skills"
            style={style}
            onChangeStyle={onChangeStyle}
            isOpen={activePopover === 'skills'}
            onToggle={() => togglePopover('skills')}
            onOpen={() => openPopover('skills')}
            onClose={closePopover}
          />
        </div>

        {/* Add Skill Form */}
        <div className="flex gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(newSkillName, newSkillLevel);
              }
            }}
            placeholder="Skill name (e.g. React.js)..."
            className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {/* Level selector 1-5 */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-300">
            <span className="text-[10px] text-slate-400 font-bold">Lvl:</span>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setNewSkillLevel(lvl)}
                className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center cursor-pointer transition-all ${
                  newSkillLevel >= lvl ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleAddSkill(newSkillName, newSkillLevel)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {/* Active Skills List */}
        <div className="space-y-1.5">
          {safeSkills.map((skill, index) => {
            const { name, level } = getSkillLevel(skill);
            return (
              <div key={index} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg text-xs shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <div className="flex flex-col gap-0.5">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveSkill(index, 'up')}
                      className="p-0.5 hover:bg-slate-100 disabled:opacity-20 rounded text-slate-500 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-2.5 h-2.5" />
                    </button>
                    <button
                      disabled={index === safeSkills.length - 1}
                      onClick={() => handleMoveSkill(index, 'down')}
                      className="p-0.5 hover:bg-slate-100 disabled:opacity-20 rounded text-slate-500 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-slate-800">{name}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Rating Visual */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleUpdateSkillLevel(index, lvl)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                          level >= lvl ? 'bg-indigo-600 ring-1 ring-indigo-600' : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                        title={`Set proficiency to ${lvl}/5`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="text-slate-400 hover:text-red-600 cursor-pointer p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick add suggestions */}
        <div className="flex flex-wrap gap-1 pt-1">
          <span className="text-[10px] text-slate-400 self-center mr-1">Suggestions:</span>
          {suggestedSkills.slice(0, 6).map((s) => (
            <button
              key={s}
              onClick={() => handleAddSkill(s, 4)}
              className="text-[10px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2 py-0.5 rounded cursor-pointer border border-slate-200"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* LANGUAGES SECTION */}
      {onChangeLanguages && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div
              onMouseEnter={() => openPopover('languages')}
              onClick={() => togglePopover('languages')}
              className="cursor-pointer group select-none"
              title="Hover or click for Layout Options"
            >
              <label className="text-[11px] font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1.5 group-hover:text-purple-700 transition-colors cursor-pointer">
                <Globe2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-purple-600 transition-colors" />
                <span>LANGUAGES ({safeLanguages.length})</span>
              </label>
              <p className="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors">
                Native tongues, bilingual proficiencies, and conversational fluency
              </p>
            </div>
            <LayoutOptionsPopover
              sectionKey="languages"
              sectionTitle="Languages"
              style={style}
              onChangeStyle={onChangeStyle}
              isOpen={activePopover === 'languages'}
              onToggle={() => togglePopover('languages')}
              onOpen={() => openPopover('languages')}
              onClose={closePopover}
            />
          </div>

          {/* Add Language Form */}
          <div className="flex gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <input
              type="text"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              placeholder="Language name (e.g. English)..."
              className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-300">
              <span className="text-[10px] text-slate-400 font-bold">Lvl:</span>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setNewLangLevel(lvl)}
                  className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center cursor-pointer transition-all ${
                    newLangLevel >= lvl ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleAddLanguage(newLangName, newLangLevel)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          {/* Active Languages List */}
          <div className="space-y-1.5">
            {safeLanguages.map((lang, index) => {
              const { name, level } = getLanguageLevel(lang);
              return (
                <div key={index} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md text-xs">
                  <span className="font-semibold text-slate-800">{name}</span>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleUpdateLangLevel(index, lvl)}
                          className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                            level >= lvl ? 'bg-emerald-600 ring-1 ring-emerald-600' : 'bg-slate-200 hover:bg-slate-300'
                          }`}
                          title={`Set language proficiency to ${lvl}/5`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleRemoveLang(index)}
                      className="text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Language quick suggestions */}
          <div className="flex flex-wrap gap-1 pt-1">
            <span className="text-[10px] text-slate-400 self-center mr-1">Suggestions:</span>
            {suggestedLanguages.slice(0, 5).map((l) => (
              <button
                key={l}
                onClick={() => handleAddLanguage(l, 4)}
                className="text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2 py-0.5 rounded cursor-pointer border border-slate-200"
              >
                + {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
