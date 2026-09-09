import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { DefaultAvatar, SkillItemRow, SkillMeter, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateH: React.FC<TemplateProps> = ({ data, primaryColor = '#1b4332' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui grid grid-cols-12">
      {/* Left Column (4 cols): Scenic Nature/Forest Tree sidebar matching Column H */}
      <div className="col-span-4 relative text-white p-5 space-y-4 overflow-hidden"
           style={{
             backgroundImage: `linear-gradient(rgba(15, 30, 20, 0.85), rgba(15, 30, 20, 0.9)), url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
           }}>
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <DefaultAvatar photoUrl={personal.photoUrl} fullName={personal.fullName} sizeClass="w-20 h-20" borderColor="border-emerald-400" />
          </div>
          <h1 className="text-base font-bold text-white uppercase tracking-wider">{personal.fullName || 'John Doe'}</h1>
          <div className="text-[10px] font-medium text-emerald-300 uppercase tracking-widest">
            {personal.jobTitle || 'Software Engineer'}
          </div>
        </div>

        {/* Contact info overlay */}
        <div className="space-y-1.5 text-[9.5px] text-slate-200 pt-2 border-t border-white/20">
          {personal.gender && <div className="flex items-center gap-1.5"><User className="w-3 h-3 text-emerald-400 shrink-0" /><span>{personal.gender}</span></div>}
          {personal.birthDate && <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-emerald-400 shrink-0" /><span>{personal.birthDate}</span></div>}
          {personal.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-emerald-400 shrink-0" /><span className="truncate">{personal.email}</span></div>}
          {personal.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-emerald-400 shrink-0" /><span>{personal.phone}</span></div>}
          {personal.address && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-emerald-400 shrink-0" /><span>{personal.address}</span></div>}
          {personal.github && <div className="flex items-center gap-1.5"><Github className="w-3 h-3 text-emerald-400 shrink-0" /><span className="truncate">{personal.github}</span></div>}
          {personal.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 text-emerald-400 shrink-0" /><span className="truncate">{personal.linkedin}</span></div>}
          {personal.website && <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-emerald-400 shrink-0" /><span className="truncate">{personal.website}</span></div>}
        </div>
      </div>

      {/* Right Column (8 cols): Clean White Content Area matching Column H */}
      <div className="col-span-8 p-7 space-y-5">
        {/* PROFILE */}
        {personal.summary && (
          <div className="space-y-1">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b border-slate-200 pb-0.5")}>
              {st('Profile')}
            </h2>
            <p className="text-[10px] text-slate-600 leading-relaxed text-justify">{personal.summary}</p>
          </div>
        )}

        {/* WORK EXPERIENCE */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-2.5">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b border-slate-200 pb-0.5")}>
              {st('Work Experience')}
            </h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-[10.5px] text-slate-900">
                    <span>{exp.jobTitle}</span>
                    <span className="text-[9px] text-slate-500 font-normal">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-800">{exp.company} • {exp.location}</div>
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
          <div className="space-y-2.5">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b border-slate-200 pb-0.5")}>
              {st('Education')}
            </h2>
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
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b border-slate-200 pb-0.5")}>
              {st('Skills')}
            </h2>
            <div className={data.skillStyle === 'segmented' || data.skillStyle === 'bars' ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-1.5'}>
              {skills.map((item, idx) => (
                <SkillItemRow
                  key={idx}
                  item={item}
                  style={data.skillStyle || 'badges'}
                  primaryColor="#1b4332"
                />
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        {languages && languages.length > 0 && (
          <div className="space-y-1.5">
            <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b border-slate-200 pb-0.5")}>
              {st('Languages')}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <span key={idx} className="bg-slate-700 text-white text-[9.5px] px-2 py-0.5 rounded font-medium flex items-center gap-1.5">
                    <span>{name}</span>
                    <SkillMeter
                      level={level}
                      style="dots"
                      activeColor="#34d399"
                      inactiveColor="rgba(255,255,255,0.3)"
                    />
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS & REFERENCES */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          {achievements.length > 0 && (
            <div className="space-y-1">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b border-slate-200 pb-0.5")}>
                {st('Achievements')}
              </h2>
              {achievements.map((ach) => (
                <div key={ach.id} className="text-[9.5px]">
                  <div className="font-bold text-slate-900">{ach.title}</div>
                  <p className="text-slate-600">{ach.description}</p>
                </div>
              ))}
            </div>
          )}

          {references.length > 0 && (
            <div className="space-y-1">
              <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-900 border-b border-slate-200 pb-0.5")}>
                {st('References')}
              </h2>
              {references.map((ref) => (
                <div key={ref.id} className="text-[9.5px]">
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="text-slate-600">{ref.title} • {ref.company}</div>
                  <div className="text-slate-500">{ref.phone}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
