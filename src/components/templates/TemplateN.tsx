import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';
import { SkillItemRow, getLanguageLevel, SkillMeter, DefaultAvatar } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateN: React.FC<TemplateProps> = ({ data, primaryColor = '#334155' }) => {
  const { personal, experiences, education, skills, languages, projects, certifications, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-relaxed w-full min-h-full font-sans grid grid-cols-[34%_66%] select-text">
      {/* Left column */}
      <div className="p-7 space-y-6" style={{ backgroundColor: '#f1f5f9' }}>
        <div className="flex flex-col items-center text-center gap-2">
          <DefaultAvatar fullName={personal.fullName || 'John Doe'} photoUrl={personal.photoUrl} sizeClass="w-20 h-20" borderColor="border-white" />
          <h1 className="text-lg font-bold text-slate-900 leading-tight mt-1">{personal.fullName || 'John Doe'}</h1>
          <p className="text-[10px] font-semibold tracking-wide" style={{ color: primaryColor }}>{personal.jobTitle || 'Software Engineer'}</p>
        </div>

        <div className="space-y-1.5 text-[9.5px] text-slate-600">
          {personal.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 shrink-0" style={{ color: primaryColor }} /><span className="truncate">{personal.email}</span></div>}
          {personal.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 shrink-0" style={{ color: primaryColor }} /><span>{personal.phone}</span></div>}
          {personal.address && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" style={{ color: primaryColor }} /><span>{personal.address}</span></div>}
          {personal.website && <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 shrink-0" style={{ color: primaryColor }} /><span className="truncate">{personal.website}</span></div>}
          {personal.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 shrink-0" style={{ color: primaryColor }} /><span className="truncate">{personal.linkedin}</span></div>}
          {personal.github && <div className="flex items-center gap-1.5"><Github className="w-3 h-3 shrink-0" style={{ color: primaryColor }} /><span className="truncate">{personal.github}</span></div>}
        </div>

        {skills && skills.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-[10.5px] font-bold tracking-wider" style={{ color: primaryColor }}>{st('Skills')}</h2>
            <div className="space-y-1.5">
              {skills.map((item, idx) => (
                <SkillItemRow key={idx} item={item} style={data.skillStyle || 'bars'} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-[10.5px] font-bold tracking-wider" style={{ color: primaryColor }}>{st('Languages')}</h2>
            <div className="space-y-1">
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <div key={idx} className="flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-700">{name}</span>
                    <SkillMeter level={level} style="dots" activeColor={primaryColor} inactiveColor="#cbd5e1" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-[10.5px] font-bold tracking-wider" style={{ color: primaryColor }}>{st('Certifications')}</h2>
            <div className="space-y-1.5">
              {certifications.map((c) => (
                <div key={c.id} className="text-[9.5px]">
                  <div className="font-semibold text-slate-800">{c.name}</div>
                  <div className="text-slate-500">{c.issuer} · {c.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column */}
      <div className="p-8 space-y-5">
        {personal.summary && (
          <div className="space-y-1">
            <h2 className="text-xs font-bold tracking-wider border-b-2 pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>{st('Professional Summary')}</h2>
            <p className="text-[10px] text-slate-600 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {experiences && experiences.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-wider border-b-2 pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>{st('Work Experience')}</h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
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
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-wider border-b-2 pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>{st('Education')}</h2>
            <div className="space-y-1.5">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <div className="font-bold text-[10.5px] text-slate-900">{edu.institution}</div>
                    <div className="text-[10px] text-slate-600">{edu.degree}</div>
                  </div>
                  <span className="text-[9px] text-slate-500">{edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-wider border-b-2 pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>{st('Projects')}</h2>
            <div className="space-y-1.5">
              {projects.map((p) => (
                <div key={p.id} className="text-[9.5px]">
                  <span className="font-bold text-slate-900">{p.title}</span>
                  {p.role && <span className="text-slate-500"> — {p.role}</span>}
                  <p className="text-slate-600">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
