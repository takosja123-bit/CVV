import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User } from 'lucide-react';
import { SkillItemRow, SkillMeter, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateJ: React.FC<TemplateProps> = ({ data, primaryColor = '#e11d48' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui p-8 space-y-5">
      {/* Top Header matching Column J: Left Big Pink Name, Right 2-column contact items with pink icons */}
      <div className="flex items-start justify-between border-b-2 border-rose-100 pb-4">
        <div>
          <h1 className="text-3xl font-black text-rose-600 tracking-tight">{personal.fullName || 'John Doe'}</h1>
          <div className="text-xs font-semibold text-slate-700 tracking-wider mt-0.5">
            {personal.jobTitle || 'Software Engineer'}
          </div>
        </div>

        {/* Right Contact Grid with pink icons */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-600">
          {personal.gender && <div className="flex items-center gap-1.5"><User className="w-3 h-3 text-rose-500" /><span>{personal.gender}</span></div>}
          {personal.birthDate && <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-rose-500" /><span>{personal.birthDate}</span></div>}
          {personal.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-rose-500" /><span className="truncate">{personal.email}</span></div>}
          {personal.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-rose-500" /><span>{personal.phone}</span></div>}
          {personal.address && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-rose-500" /><span>{personal.address}</span></div>}
          {personal.github && <div className="flex items-center gap-1.5"><Github className="w-3 h-3 text-rose-500" /><span>{personal.github}</span></div>}
          {personal.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 text-rose-500" /><span>{personal.linkedin}</span></div>}
          {personal.website && <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-rose-500" /><span>{personal.website}</span></div>}
        </div>
      </div>

      {/* PROFILE with centered bullet header • Profile • */}
      {personal.summary && (
        <div className="space-y-1.5">
          <div className={headerClass("text-center font-bold text-xs text-rose-600 tracking-wider flex items-center justify-center gap-2")}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Profile</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed text-justify max-w-3xl mx-auto">{personal.summary}</p>
        </div>
      )}

      {/* WORK EXPERIENCE with • Work Experience • */}
      {experiences && experiences.length > 0 && (
        <div className="space-y-2.5">
          <div className={headerClass("text-center font-bold text-xs text-rose-600 tracking-wider flex items-center justify-center gap-2")}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Work Experience</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          </div>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[10.5px] text-slate-900">
                  <span>{exp.jobTitle}</span>
                  <span className="text-[9px] text-slate-500 font-normal">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[10px] font-semibold text-rose-700">{exp.company} • {exp.location}</div>
                {exp.bullets && (
                  <ul className="list-disc ml-3.5 text-[9.5px] text-slate-600 space-y-0.5 pt-0.5">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION with • Education • */}
      {education && education.length > 0 && (
        <div className="space-y-2">
          <div className={headerClass("text-center font-bold text-xs text-rose-600 tracking-wider flex items-center justify-center gap-2")}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Education</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          </div>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[10.5px] text-slate-900">
                  <span>{edu.institution}</span>
                  <span className="text-[9px] text-slate-500 font-normal">{edu.endDate}</span>
                </div>
                <div className="text-[10px] text-slate-700">{edu.degree}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILLS */}
      {skills && skills.length > 0 && (
        <div className="space-y-1.5">
          <div className={headerClass("text-center font-bold text-xs text-rose-600 tracking-wider flex items-center justify-center gap-2")}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Skills & Proficiencies</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          </div>
          <div className={data.skillStyle === 'segmented' || data.skillStyle === 'bars' ? 'grid grid-cols-2 gap-3 max-w-xl mx-auto pt-1' : 'flex flex-wrap justify-center gap-2'}>
            {skills.map((item, idx) => (
              <SkillItemRow
                key={idx}
                item={item}
                style={data.skillStyle || 'badges'}
                primaryColor="#e11d48"
              />
            ))}
          </div>
        </div>
      )}

      {/* LANGUAGES */}
      {languages && languages.length > 0 && (
        <div className="space-y-1.5">
          <div className={headerClass("text-center font-bold text-xs text-rose-600 tracking-wider flex items-center justify-center gap-2")}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Languages</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-[10px] text-slate-700">
            {languages.map((lang, idx) => {
              const { name, level } = getLanguageLevel(lang);
              return (
                <span key={idx} className="bg-rose-50/80 border border-rose-200/80 text-rose-800 text-[9.5px] px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5">
                  <span>{name}</span>
                  <SkillMeter
                    level={level}
                    style="dots"
                    activeColor="#e11d48"
                    inactiveColor="#fecdd3"
                  />
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS & REFERENCES */}
      <div className="grid grid-cols-2 gap-6 pt-2 border-t border-rose-100">
        {achievements.length > 0 && (
          <div className="space-y-2">
            <div className={headerClass("font-bold text-xs text-rose-600 tracking-wider flex items-center gap-1.5")}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Achievements</span>
            </div>
            {achievements.map((ach) => (
              <div key={ach.id} className="text-[9.5px]">
                <div className="font-bold text-slate-900">{ach.title}</div>
                <p className="text-slate-600">{ach.description}</p>
              </div>
            ))}
          </div>
        )}

        {references.length > 0 && (
          <div className="space-y-2">
            <div className={headerClass("font-bold text-xs text-rose-600 tracking-wider flex items-center gap-1.5")}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>References</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {references.map((ref) => (
                <div key={ref.id} className="text-[9.5px]">
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="text-slate-600">{ref.title}</div>
                  <div className="text-slate-500">{ref.phone}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
