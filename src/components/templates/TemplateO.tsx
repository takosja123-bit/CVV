import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';
import { SkillItemRow, getLanguageLevel, SkillMeter } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateO: React.FC<TemplateProps> = ({ data, primaryColor = '#4338ca' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-relaxed w-full min-h-full font-sans p-8 md:p-10 space-y-6 select-text">
      {/* Centered header */}
      <div className="text-center space-y-1 pb-4 border-b" style={{ borderColor: `${primaryColor}30` }}>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{personal.fullName || 'John Doe'}</h1>
        <p className="text-xs font-semibold tracking-widest" style={{ color: primaryColor }}>{(personal.jobTitle || 'Software Engineer').toUpperCase()}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[9.5px] text-slate-500 pt-1.5">
          {personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: primaryColor }} />{personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: primaryColor }} />{personal.phone}</span>}
          {personal.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: primaryColor }} />{personal.address}</span>}
          {personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" style={{ color: primaryColor }} />{personal.linkedin}</span>}
          {personal.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" style={{ color: primaryColor }} />{personal.github}</span>}
          {personal.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: primaryColor }} />{personal.website}</span>}
        </div>
      </div>

      {personal.summary && (
        <p className="text-[10px] text-slate-600 text-center max-w-2xl mx-auto leading-relaxed">{personal.summary}</p>
      )}

      {experiences && experiences.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Experience')}</h2>
          <div className="relative pl-5 space-y-5 border-l-2" style={{ borderColor: `${primaryColor}30` }}>
            {experiences.map((exp) => (
              <div key={exp.id} className="relative">
                <span className="absolute -left-[26px] top-1 w-3 h-3 rounded-full ring-4 ring-white" style={{ backgroundColor: primaryColor }} />
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[10.5px] text-slate-900">{exp.jobTitle}</span>
                  <span className="text-[9px] text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[10px] font-semibold" style={{ color: primaryColor }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc ml-3.5 text-[9.5px] text-slate-600 space-y-0.5 pt-0.5">
                    {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Education')}</h2>
          <div className="relative pl-5 space-y-3 border-l-2" style={{ borderColor: `${primaryColor}30` }}>
            {education.map((edu) => (
              <div key={edu.id} className="relative">
                <span className="absolute -left-[26px] top-1 w-3 h-3 rounded-full ring-4 ring-white" style={{ backgroundColor: primaryColor }} />
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[10.5px] text-slate-900">{edu.institution}</span>
                  <span className="text-[9px] text-slate-500">{edu.endDate}</span>
                </div>
                <div className="text-[10px] text-slate-600">{edu.degree}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {skills && skills.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Skills')}</h2>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((item, idx) => (
                <SkillItemRow key={idx} item={item} style={data.skillStyle || 'dots'} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Languages')}</h2>
            <div className="space-y-1">
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <div key={idx} className="flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-700">{name}</span>
                    <SkillMeter level={level} style="dots" activeColor={primaryColor} inactiveColor="#e0e7ff" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {(achievements.length > 0 || references.length > 0) && (
        <div className="grid grid-cols-2 gap-8 pt-3 border-t" style={{ borderColor: `${primaryColor}30` }}>
          {achievements.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Achievements')}</h2>
              {achievements.map((a) => (
                <div key={a.id} className="text-[9.5px]">
                  <span className="font-bold text-slate-900">{a.title}</span>
                  <p className="text-slate-600">{a.description}</p>
                </div>
              ))}
            </div>
          )}
          {references.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('References')}</h2>
              <div className="grid grid-cols-2 gap-2">
                {references.map((r) => (
                  <div key={r.id} className="text-[9.5px]">
                    <div className="font-bold text-slate-900">{r.name}</div>
                    <div className="text-slate-600">{r.title}</div>
                    <div className="text-slate-500">{r.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
