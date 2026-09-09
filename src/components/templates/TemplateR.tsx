import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { SkillItemRow, getLanguageLevel, SkillMeter, DefaultAvatar } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateR: React.FC<TemplateProps> = ({ data, primaryColor = '#be123c' }) => {
  const { personal, experiences, education, skills, languages, achievements, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-relaxed w-full min-h-full font-sans select-text">
      {/* Full width bold header */}
      <div className="flex items-center justify-between px-8 md:px-10 py-6 text-white" style={{ backgroundColor: primaryColor }}>
        <div>
          <h1 className="text-3xl font-black tracking-tight">{personal.fullName || 'John Doe'}</h1>
          <p className="text-xs font-semibold tracking-wider text-white/85 mt-0.5">{(personal.jobTitle || 'Software Engineer').toUpperCase()}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9.5px] text-white/80 pt-2">
            {personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal.email}</span>}
            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal.phone}</span>}
            {personal.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal.address}</span>}
            {personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personal.linkedin}</span>}
            {personal.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personal.website}</span>}
          </div>
        </div>
        <DefaultAvatar fullName={personal.fullName || 'John Doe'} photoUrl={personal.photoUrl} sizeClass="w-20 h-20" borderColor="border-white/60" />
      </div>

      <div className="p-8 md:p-10 space-y-5">
        {personal.summary && (
          <div className="space-y-1">
            <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Profile')}</h2>
            <p className="text-[10px] text-slate-600 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {experiences && experiences.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Work Experience')}</h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-0.5 border-l-2 pl-3" style={{ borderColor: `${primaryColor}40` }}>
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

        <div className="grid grid-cols-2 gap-8">
          {education && education.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Education')}</h2>
              {education.map((edu) => (
                <div key={edu.id} className="text-[9.5px]">
                  <div className="font-bold text-slate-900">{edu.institution}</div>
                  <div className="text-slate-600">{edu.degree}</div>
                  <div className="text-slate-500">{edu.endDate}</div>
                </div>
              ))}
            </div>
          )}

          {languages && languages.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Languages')}</h2>
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <div key={idx} className="flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-700">{name}</span>
                    <SkillMeter level={level} style="dots" activeColor={primaryColor} inactiveColor="#fecdd3" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {skills && skills.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>{st('Skills')}</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((item, idx) => (
                <SkillItemRow key={idx} item={item} style={data.skillStyle || 'badges'} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        )}

        {achievements && achievements.length > 0 && (
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
      </div>
    </div>
  );
};
