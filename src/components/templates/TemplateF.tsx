import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { DefaultAvatar, SkillItemRow, SkillMeter, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateF: React.FC<TemplateProps> = ({ data, primaryColor = '#064e3b' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui grid grid-cols-12">
      {/* Left Column (5 cols): White background with circular green badges matching Column F */}
      <div className="col-span-5 p-6 bg-white border-r border-slate-200 space-y-5">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <DefaultAvatar photoUrl={personal.photoUrl} fullName={personal.fullName} sizeClass="w-20 h-20" borderColor="border-emerald-800" />
          </div>
          <h1 className="text-lg font-black tracking-wide text-slate-900 uppercase">{personal.fullName || 'John Doe'}</h1>
          <div className="text-[10.5px] font-bold text-emerald-800 tracking-wider uppercase">
            {personal.jobTitle || 'SOFTWARE ENGINEER'}
          </div>
        </div>

        {/* Contact info with green badge icons */}
        <div className="space-y-1.5 text-[10px] text-slate-700 pt-2 border-t border-slate-200">
          {personal.gender && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px]"><User className="w-3 h-3" /></div>
              <span>{personal.gender}</span>
            </div>
          )}
          {personal.birthDate && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px]"><Calendar className="w-3 h-3" /></div>
              <span>{personal.birthDate}</span>
            </div>
          )}
          {personal.email && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px]"><Mail className="w-3 h-3" /></div>
              <span className="truncate">{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px]"><Phone className="w-3 h-3" /></div>
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.address && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px]"><MapPin className="w-3 h-3" /></div>
              <span>{personal.address}</span>
            </div>
          )}
          {personal.github && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px]"><Github className="w-3 h-3" /></div>
              <span>{personal.github}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px]"><Linkedin className="w-3 h-3" /></div>
              <span>{personal.linkedin}</span>
            </div>
          )}
          {personal.website && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px]"><Globe className="w-3 h-3" /></div>
              <span>{personal.website}</span>
            </div>
          )}
        </div>

        {/* PROFILE */}
        {personal.summary && (
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-emerald-900 flex items-center gap-1.5")}>
              {showIcons && <User className="w-3.5 h-3.5" />} {st('Profile')}
            </h2>
            <p className="text-[10px] text-slate-600 leading-relaxed text-justify">{personal.summary}</p>
          </div>
        )}

        {/* SKILLS */}
        {skills && skills.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-emerald-900 flex items-center gap-1.5")}>
              {showIcons && <Award className="w-3.5 h-3.5" />} {st('Skills')}
            </h2>
            <div className={data.skillStyle === 'tags' ? 'flex flex-wrap gap-1.5' : 'space-y-2'}>
              {skills.map((item, idx) => (
                <SkillItemRow
                  key={idx}
                  item={item}
                  style={data.skillStyle || 'segmented'}
                  primaryColor="#064e3b"
                />
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        {languages && languages.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-emerald-900 flex items-center gap-1.5")}>
              {showIcons && <Globe className="w-3.5 h-3.5" />} {st('Languages')}
            </h2>
            <div className="space-y-2">
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <span className="font-medium text-slate-700">{name}</span>
                    <SkillMeter
                      level={level}
                      style={data.skillStyle === 'tags' ? 'segmented' : (data.skillStyle || 'segmented')}
                      activeColor="#064e3b"
                      inactiveColor="#e2e8f0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REFERENCES */}
        {references && references.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-emerald-900 flex items-center gap-1.5")}>
              {showIcons && <Users className="w-3.5 h-3.5" />} {st('References')}
            </h2>
            <div className="space-y-2 text-[9.5px]">
              {references.map((ref) => (
                <div key={ref.id}>
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="text-slate-600">{ref.title} • {ref.company}</div>
                  <div className="text-slate-500">{ref.email}</div>
                  <div className="text-slate-500">{ref.phone}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {achievements && achievements.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-emerald-900 flex items-center gap-1.5")}>
              {showIcons && <Award className="w-3.5 h-3.5" />} {st('Achievements')}
            </h2>
            <div className="space-y-2 text-[9.5px]">
              {achievements.map((ach) => (
                <div key={ach.id}>
                  <span className="font-bold text-slate-900">{ach.title}</span> <span className="text-slate-500">({ach.date})</span>
                  <p className="text-slate-600">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (7 cols): Deep Forest Green with Gold Timeline matching Col F */}
      <div style={{ backgroundColor: primaryColor }} className="col-span-7 p-7 text-white space-y-7">
        {/* WORK EXPERIENCE */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-amber-400/40 text-amber-300">
              <Briefcase className="w-4 h-4" />
              <h2 className={headerClass("font-black text-xs tracking-widest")}>{st('Work Experience')}</h2>
            </div>

            {/* Golden Vertical Timeline */}
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-400">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative space-y-1">
                  {/* Gold Node Bullet */}
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-900" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-amber-300">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">{exp.jobTitle}</div>
                    <div className="text-[10px] text-emerald-200 font-semibold">{exp.company} • {exp.location}</div>
                  </div>
                  {exp.bullets && (
                    <ul className="list-disc ml-3.5 text-[9.5px] text-slate-200 space-y-0.5 pt-0.5">
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-amber-400/40 text-amber-300">
              <GraduationCap className="w-4 h-4" />
              <h2 className={headerClass("font-black text-xs tracking-widest")}>{st('Education')}</h2>
            </div>

            {/* Golden Vertical Timeline */}
            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-400">
              {education.map((edu) => (
                <div key={edu.id} className="relative space-y-0.5">
                  {/* Gold Node Bullet */}
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-900" />
                  <div className="text-[10px] font-bold text-amber-300">{edu.endDate}</div>
                  <div className="font-bold text-xs text-white">{edu.institution}</div>
                  <div className="text-[10px] text-emerald-200">{edu.degree}</div>
                  {edu.details && <p className="text-[9.5px] text-slate-300 italic">{edu.details}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
