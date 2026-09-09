import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { DefaultAvatar, SkillItemRow, SkillMeter, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateG: React.FC<TemplateProps> = ({ data, primaryColor = '#d97706' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-[#FFFDF9] text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui p-8 space-y-6">
      {/* Top Header matching Column G: Centered Avatar with subtle amber ring, contact row */}
      <div className="text-center space-y-2 border-b-2 border-amber-100 pb-5">
        <div className="flex justify-center">
          <DefaultAvatar photoUrl={personal.photoUrl} fullName={personal.fullName} sizeClass="w-20 h-20" borderColor="border-amber-400" />
        </div>
        <h1 className="text-2xl font-black text-amber-900 tracking-wide uppercase">{personal.fullName || 'John Doe'}</h1>
        <div className="text-xs font-bold text-amber-700 tracking-widest uppercase">
          {personal.jobTitle || 'SOFTWARE ENGINEER'}
        </div>

        {/* Contact info row with amber icons */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-slate-600 pt-1">
          {personal.gender && <span className="flex items-center gap-1"><User className="w-3 h-3 text-amber-600" />{personal.gender}</span>}
          {personal.birthDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-amber-600" />{personal.birthDate}</span>}
          {personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-amber-600" />{personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-amber-600" />{personal.phone}</span>}
          {personal.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-600" />{personal.address}</span>}
          {personal.github && <span className="flex items-center gap-1"><Github className="w-3 h-3 text-amber-600" />{personal.github}</span>}
          {personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-amber-600" />{personal.linkedin}</span>}
          {personal.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-amber-600" />{personal.website}</span>}
        </div>
      </div>

      {/* 2-Column Body */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column (5 cols) */}
        <div className="col-span-5 space-y-6">
          {/* PROFILE */}
          {personal.summary && (
            <div className="space-y-1.5">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-amber-900 border-b border-amber-200 pb-1")}>
                {st('Profile')}
              </h2>
              <p className="text-[10px] text-slate-600 leading-relaxed text-justify">{personal.summary}</p>
            </div>
          )}

          {/* SKILLS */}
          {skills && skills.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-amber-900 border-b border-amber-200 pb-1")}>
                {st('Skills')}
              </h2>
              <div className={data.skillStyle === 'tags' ? 'flex flex-wrap gap-1.5' : 'space-y-2'}>
                {skills.map((item, idx) => (
                  <SkillItemRow
                    key={idx}
                    item={item}
                    style={data.skillStyle || 'bars'}
                    primaryColor="#d97706"
                  />
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages && languages.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-amber-900 border-b border-amber-200 pb-1")}>
                {st('Languages')}
              </h2>
              <div className="space-y-2">
                {languages.map((lang, idx) => {
                  const { name, level } = getLanguageLevel(lang);
                  return (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-medium text-slate-700">{name}</span>
                      </div>
                      <SkillMeter
                        level={level}
                        style={data.skillStyle || 'bars'}
                        activeColor="#d97706"
                        inactiveColor="#fef3c7"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* REFERENCES */}
          {references && references.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-amber-900 border-b border-amber-200 pb-1")}>
                {st('References')}
              </h2>
              <div className="space-y-2 text-[9.5px]">
                {references.map((ref) => (
                  <div key={ref.id} className="p-2 bg-amber-50/60 rounded border border-amber-100">
                    <div className="font-bold text-slate-900">{ref.name}</div>
                    <div className="text-slate-600">{ref.title} • {ref.company}</div>
                    <div className="text-slate-500">{ref.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 cols) */}
        <div className="col-span-7 space-y-6">
          {/* WORK EXPERIENCE */}
          {experiences && experiences.length > 0 && (
            <div className="space-y-3">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-amber-900 border-b border-amber-200 pb-1")}>
                {st('Work Experience')}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-bold text-[10.5px] text-slate-900">
                      <span>{exp.jobTitle}</span>
                      <span className="text-[9px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.2 rounded">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-600">{exp.company} • {exp.location}</div>
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
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-amber-900 border-b border-amber-200 pb-1")}>
                {st('Education')}
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-bold text-[10.5px] text-slate-900">
                      <span>{edu.institution}</span>
                      <span className="text-[9px] text-slate-500 font-normal">{edu.endDate}</span>
                    </div>
                    <div className="text-[10px] text-slate-700">{edu.degree}</div>
                    {edu.details && <p className="text-[9px] text-slate-500 italic">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-3">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-amber-900 border-b border-amber-200 pb-1")}>
                {st('Achievements')}
              </h2>
              <div className="space-y-2">
                {achievements.map((ach) => (
                  <div key={ach.id} className="text-[10px]">
                    <div className="font-bold text-slate-900">{ach.title} <span className="text-[9px] text-amber-700 font-normal">({ach.date})</span></div>
                    <p className="text-[9.5px] text-slate-600">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
