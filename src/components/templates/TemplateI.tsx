import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { SkillItemRow, SkillMeter, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateI: React.FC<TemplateProps> = ({ data, primaryColor = '#0891b2' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui p-6 border-8 border-cyan-700">
      {/* Inner cyan border matching Column I */}
      <div className="border border-cyan-300 p-6 space-y-6">
        {/* Header centered matching Col I */}
        <div className="text-center space-y-1.5 pb-4 border-b border-cyan-200">
          <h1 className="text-2xl font-black text-cyan-800 uppercase tracking-wide">{personal.fullName || 'John Doe'}</h1>
          <div className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">
            {personal.jobTitle || 'Software Engineer'}
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-slate-600 pt-1">
            {personal.gender && <span className="flex items-center gap-1"><User className="w-3 h-3 text-cyan-600" />{personal.gender}</span>}
            {personal.birthDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-cyan-600" />{personal.birthDate}</span>}
            {personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-cyan-600" />{personal.email}</span>}
            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-cyan-600" />{personal.phone}</span>}
            {personal.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-600" />{personal.address}</span>}
            {personal.github && <span className="flex items-center gap-1"><Github className="w-3 h-3 text-cyan-600" />{personal.github}</span>}
            {personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-cyan-600" />{personal.linkedin}</span>}
            {personal.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-cyan-600" />{personal.website}</span>}
          </div>

          {personal.summary && (
            <p className="text-[10px] text-slate-600 leading-relaxed max-w-2xl mx-auto pt-2 text-justify">
              {personal.summary}
            </p>
          )}
        </div>

        {/* 2-Column Body */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column (7 cols): Work Experience & Education */}
          <div className="col-span-7 space-y-5">
            {/* WORK EXPERIENCE */}
            {experiences && experiences.length > 0 && (
              <div className="space-y-3">
                <h2 className={headerClass("text-xs font-bold tracking-wider text-cyan-800 border-b-2 border-cyan-600 pb-0.5")}>
                  Work Experience
                </h2>
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-[10.5px] text-slate-900">
                        <span>{exp.jobTitle}</span>
                        <span className="text-[9px] text-slate-500 font-normal">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <div className="text-[10px] font-semibold text-cyan-700">{exp.company} • {exp.location}</div>
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

            {/* EDUCATION */}
            {education && education.length > 0 && (
              <div className="space-y-3">
                <h2 className={headerClass("text-xs font-bold tracking-wider text-cyan-800 border-b-2 border-cyan-600 pb-0.5")}>
                  Education
                </h2>
                <div className="space-y-2.5">
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
          </div>

          {/* Right Column (5 cols): Skills, Languages, Achievements, References */}
          <div className="col-span-5 space-y-5">
            {/* SKILLS */}
            {skills && skills.length > 0 && (
              <div className="space-y-2">
                <h2 className={headerClass("text-xs font-bold tracking-wider text-cyan-800 border-b-2 border-cyan-600 pb-0.5")}>
                  Skills
                </h2>
                <div className={data.skillStyle === 'segmented' || data.skillStyle === 'bars' ? 'space-y-2' : 'flex flex-wrap gap-1.5'}>
                  {skills.map((item, idx) => (
                    <SkillItemRow
                      key={idx}
                      item={item}
                      style={data.skillStyle || 'tags'}
                      primaryColor="#0891b2"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* LANGUAGES */}
            {languages && languages.length > 0 && (
              <div className="space-y-2">
                <h2 className={headerClass("text-xs font-bold tracking-wider text-cyan-800 border-b-2 border-cyan-600 pb-0.5")}>
                  Languages
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((lang, idx) => {
                    const { name, level } = getLanguageLevel(lang);
                    return (
                      <span key={idx} className="border border-cyan-500 text-cyan-800 text-[9.5px] px-2 py-0.5 rounded font-semibold bg-cyan-50/50 flex items-center gap-1.5">
                        <span>{name}</span>
                        <SkillMeter
                          level={level}
                          style="dots"
                          activeColor="#0891b2"
                          inactiveColor="#cffafe"
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACHIEVEMENTS */}
            {achievements && achievements.length > 0 && (
              <div className="space-y-2">
                <h2 className={headerClass("text-xs font-bold tracking-wider text-cyan-800 border-b-2 border-cyan-600 pb-0.5")}>
                  Achievements
                </h2>
                <div className="space-y-2">
                  {achievements.map((ach) => (
                    <div key={ach.id} className="text-[9.5px]">
                      <div className="font-bold text-slate-900">{ach.title}</div>
                      <p className="text-slate-600">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REFERENCES */}
            {references && references.length > 0 && (
              <div className="space-y-2">
                <h2 className={headerClass("text-xs font-bold tracking-wider text-cyan-800 border-b-2 border-cyan-600 pb-0.5")}>
                  References
                </h2>
                <div className="space-y-2">
                  {references.map((ref) => (
                    <div key={ref.id} className="text-[9.5px]">
                      <div className="font-bold text-slate-900">{ref.name}</div>
                      <div className="text-slate-600">{ref.title} • {ref.company}</div>
                      <div className="text-slate-500">{ref.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
