import React from 'react';
import { CVData } from '../../types';
import { getLanguageLevel, SkillMeter } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateQ: React.FC<TemplateProps> = ({ data, primaryColor = '#78350f' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="text-slate-800 text-[11px] leading-relaxed w-full min-h-full font-serif p-9 md:p-11 space-y-5 select-text" style={{ backgroundColor: '#fdfaf3' }}>
      <div className="text-center space-y-1 pb-3">
        <h1 className="text-3xl tracking-wide text-slate-900" style={{ fontWeight: 700 }}>{personal.fullName || 'John Doe'}</h1>
        <div className="w-16 h-px mx-auto" style={{ backgroundColor: primaryColor }} />
        <p className="text-[11px] italic tracking-wide" style={{ color: primaryColor }}>{personal.jobTitle || 'Software Engineer'}</p>
        <p className="text-[9.5px] text-slate-500 pt-1">
          {[personal.email, personal.phone, personal.address, personal.website].filter(Boolean).join('   •   ')}
        </p>
      </div>

      {personal.summary && (
        <p className="text-[10.5px] text-slate-700 text-center max-w-2xl mx-auto italic leading-relaxed">{personal.summary}</p>
      )}

      {experiences && experiences.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="text-[12px] tracking-[0.15em] text-center" style={{ color: primaryColor }}>{st('Experience')}</h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[10.5px] text-slate-900">{exp.jobTitle}</span>
                  <span className="text-[9px] text-slate-500 italic">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[10px] italic" style={{ color: primaryColor }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc ml-4 text-[9.5px] text-slate-600 space-y-0.5 pt-0.5">
                    {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-[12px] tracking-[0.15em] text-center" style={{ color: primaryColor }}>{st('Education')}</h2>
          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-[10.5px] text-slate-900">{edu.institution}</span>
                  <span className="text-[10px] text-slate-600 italic"> — {edu.degree}</span>
                </div>
                <span className="text-[9px] text-slate-500 italic">{edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 pt-2">
        {skills && skills.length > 0 && (
          <div className="space-y-1">
            <h2 className="text-[12px] tracking-[0.15em]" style={{ color: primaryColor }}>{st('Skills')}</h2>
            <p className="text-[10px] text-slate-700">{skills.map((s) => (typeof s === 'string' ? s : s.name)).join(', ')}</p>
          </div>
        )}
        {languages && languages.length > 0 && (
          <div className="space-y-1">
            <h2 className="text-[12px] tracking-[0.15em]" style={{ color: primaryColor }}>{st('Languages')}</h2>
            <div className="space-y-1">
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <div key={idx} className="flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-700 italic">{name}</span>
                    <SkillMeter level={level} style="dots" activeColor={primaryColor} inactiveColor="#eaddc7" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {(achievements.length > 0 || references.length > 0) && (
        <div className="grid grid-cols-2 gap-8 pt-2 border-t" style={{ borderColor: '#e5d9c3' }}>
          {achievements.length > 0 && (
            <div className="space-y-1">
              <h2 className="text-[12px] tracking-[0.15em]" style={{ color: primaryColor }}>{st('Achievements')}</h2>
              {achievements.map((a) => (
                <div key={a.id} className="text-[9.5px]">
                  <span className="font-bold text-slate-900">{a.title}</span>
                  <p className="text-slate-600 italic">{a.description}</p>
                </div>
              ))}
            </div>
          )}
          {references.length > 0 && (
            <div className="space-y-1">
              <h2 className="text-[12px] tracking-[0.15em]" style={{ color: primaryColor }}>{st('References')}</h2>
              {references.map((r) => (
                <div key={r.id} className="text-[9.5px]">
                  <span className="font-bold text-slate-900">{r.name}</span>
                  <span className="text-slate-600 italic"> — {r.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
