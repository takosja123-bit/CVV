import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { DefaultAvatar, SkillItemRow, SkillMeter, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateL: React.FC<TemplateProps> = ({ data, primaryColor = '#f97316' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui">
      {/* Top Coral Header matching Column L */}
      <div className="bg-orange-200/60 p-6 flex items-center justify-between border-b border-orange-200">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wide">{personal.fullName || 'John Doe'}</h1>
          <div className="text-xs font-bold text-orange-600 uppercase tracking-widest">
            {personal.jobTitle || 'SOFTWARE ENGINEER'}
          </div>
        </div>
        <DefaultAvatar photoUrl={personal.photoUrl} fullName={personal.fullName} sizeClass="w-20 h-20" borderColor="border-white" />
      </div>

      {/* 2-Column Body */}
      <div className="grid grid-cols-12">
        {/* Left Column (5 cols): Dark Navy Sidebar with Orange Accents */}
        <div className="col-span-5 bg-[#0f172a] text-white p-6 space-y-5">
          {/* CONTACT */}
          <div className="space-y-2">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-orange-400 border-b border-slate-700 pb-1")}>
              {st('Contact')}
            </h2>
            <div className="space-y-1.5 text-[10px] text-slate-300">
              {personal.gender && <div className="flex items-center gap-1.5"><User className="w-3 h-3 text-orange-400" /><span>{personal.gender}</span></div>}
              {personal.birthDate && <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-orange-400" /><span>{personal.birthDate}</span></div>}
              {personal.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-orange-400" /><span className="truncate">{personal.email}</span></div>}
              {personal.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-orange-400" /><span>{personal.phone}</span></div>}
              {personal.address && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-400" /><span>{personal.address}</span></div>}
              {personal.github && <div className="flex items-center gap-1.5"><Github className="w-3 h-3 text-orange-400" /><span>{personal.github}</span></div>}
              {personal.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 text-orange-400" /><span>{personal.linkedin}</span></div>}
              {personal.website && <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-orange-400" /><span>{personal.website}</span></div>}
            </div>
          </div>

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-orange-400 border-b border-slate-700 pb-1")}>
                {st('Education')}
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[10px] space-y-0.5">
                    <div className="font-bold text-white">{edu.institution}</div>
                    <div className="text-slate-400 text-[9px]">{edu.endDate}</div>
                    <div className="text-orange-200">{edu.degree}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {skills && skills.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-orange-400 border-b border-slate-700 pb-1")}>
                {st('Skills')}
              </h2>
              <div className={data.skillStyle === 'tags' ? 'flex flex-wrap gap-1.5' : 'space-y-2'}>
                {skills.map((item, idx) => (
                  <SkillItemRow
                    key={idx}
                    item={item}
                    style={data.skillStyle || 'bars'}
                    isDark={true}
                    primaryColor="#f97316"
                  />
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages && languages.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-orange-400 border-b border-slate-700 pb-1")}>
                {st('Languages')}
              </h2>
              <div className="space-y-2">
                {languages.map((lang, idx) => {
                  const { name, level } = getLanguageLevel(lang);
                  return (
                    <div key={idx} className="space-y-0.5">
                      <div className="text-[10px] font-medium text-slate-200">{name}</div>
                      <SkillMeter
                        level={level}
                        style={data.skillStyle || 'bars'}
                        isDark={true}
                        activeColor="#f97316"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-orange-400 border-b border-slate-700 pb-1")}>
                {st('Achievements')}
              </h2>
              <div className="space-y-2 text-[9.5px]">
                {achievements.map((ach) => (
                  <div key={ach.id}>
                    <div className="font-bold text-white">{ach.title}</div>
                    <p className="text-slate-300">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Clean White Content matching Column L */}
        <div className="col-span-7 p-7 space-y-6">
          {/* PROFILE */}
          {personal.summary && (
            <div className="space-y-1">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b-2 border-orange-500 pb-0.5")}>
                {st('Profile')}
              </h2>
              <p className="text-[10px] text-slate-600 leading-relaxed text-justify">{personal.summary}</p>
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {experiences && experiences.length > 0 && (
            <div className="space-y-3">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b-2 border-orange-500 pb-0.5")}>
                {st('Work Experience')}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-bold text-[10.5px] text-slate-900">
                      <span>{exp.jobTitle}</span>
                      <span className="text-[9px] text-orange-600 font-semibold">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
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

          {/* REFERENCES */}
          {references && references.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b-2 border-orange-500 pb-0.5")}>
                {st('References')}
              </h2>
              <div className="grid grid-cols-2 gap-3 text-[9.5px]">
                {references.map((ref) => (
                  <div key={ref.id} className="p-2 bg-slate-50 rounded border border-slate-200">
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
  );
};
