import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { getLanguageLevel, SkillMeter, getSkillLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateT: React.FC<TemplateProps> = ({ data, primaryColor = '#0f766e' }) => {
  const { personal, experiences, education, skills, languages, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-relaxed w-full min-h-full font-sans p-9 md:p-11 space-y-6 select-text">
      <div className="flex items-end justify-between pb-4">
        <div>
          <h1 className="text-[28px] font-light tracking-tight text-slate-900">{personal.fullName || 'John Doe'}</h1>
          <p className="text-[11px] font-medium tracking-wide mt-1" style={{ color: primaryColor }}>{personal.jobTitle || 'Software Engineer'}</p>
        </div>
        <div className="text-right text-[9.5px] text-slate-500 space-y-0.5">
          {personal.email && <div className="flex items-center justify-end gap-1.5"><span>{personal.email}</span><Mail className="w-3 h-3" style={{ color: primaryColor }} /></div>}
          {personal.phone && <div className="flex items-center justify-end gap-1.5"><span>{personal.phone}</span><Phone className="w-3 h-3" style={{ color: primaryColor }} /></div>}
          {personal.address && <div className="flex items-center justify-end gap-1.5"><span>{personal.address}</span><MapPin className="w-3 h-3" style={{ color: primaryColor }} /></div>}
          {personal.linkedin && <div className="flex items-center justify-end gap-1.5"><span>{personal.linkedin}</span><Linkedin className="w-3 h-3" style={{ color: primaryColor }} /></div>}
          {personal.website && <div className="flex items-center justify-end gap-1.5"><span>{personal.website}</span><Globe className="w-3 h-3" style={{ color: primaryColor }} /></div>}
        </div>
      </div>
      <div className="h-px w-full" style={{ backgroundColor: '#e2e8f0' }} />

      {personal.summary && (
        <p className="text-[10.5px] text-slate-600 leading-relaxed max-w-3xl">{personal.summary}</p>
      )}

      {experiences && experiences.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-slate-400">{st('Experience')}</h2>
          <div className="space-y-3.5">
            {experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[110px_1fr] gap-4">
                <div className="text-[9.5px] text-slate-400 pt-0.5">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-[11px] text-slate-900">{exp.jobTitle} <span className="font-normal text-slate-500">· {exp.company}</span></div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc ml-3.5 text-[9.5px] text-slate-600 space-y-0.5 pt-0.5">
                      {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-slate-400">{st('Education')}</h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-[110px_1fr] gap-4">
                <div className="text-[9.5px] text-slate-400">{edu.endDate}</div>
                <div className="font-semibold text-[11px] text-slate-900">{edu.institution} <span className="font-normal text-slate-500">· {edu.degree}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-10">
        {skills && skills.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-slate-400">{st('Skills')}</h2>
            <p className="text-[10px] text-slate-700 leading-relaxed">
              {skills.map((s) => getSkillLevel(s).name).join('  ·  ')}
            </p>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-slate-400">{st('Languages')}</h2>
            <div className="space-y-1">
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <div key={idx} className="flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-700">{name}</span>
                    <SkillMeter level={level} style="bars" activeColor={primaryColor} inactiveColor="#e2e8f0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
