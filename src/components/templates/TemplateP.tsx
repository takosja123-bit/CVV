import React from 'react';
import { CVData } from '../../types';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateP: React.FC<TemplateProps> = ({ data, primaryColor = '#1f2937' }) => {
  const { personal, experiences, education, skills, languages, certifications, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-relaxed w-full min-h-full font-sans p-8 md:p-10 space-y-4 select-text">
      <div className="text-center space-y-0.5 pb-3">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{personal.fullName || 'John Doe'}</h1>
        <p className="text-[11px] text-slate-600">{personal.jobTitle || 'Software Engineer'}</p>
        <p className="text-[9.5px] text-slate-500">
          {[personal.phone, personal.email, personal.address, personal.linkedin, personal.website].filter(Boolean).join('  |  ')}
        </p>
      </div>

      {personal.summary && (
        <div>
          <h2 className="text-[11px] font-bold border-b border-slate-300 pb-0.5 mb-1 text-slate-900">{st('Summary')}</h2>
          <p className="text-[10px] text-slate-700">{personal.summary}</p>
        </div>
      )}

      {experiences && experiences.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold border-b border-slate-300 pb-0.5 mb-1.5 text-slate-900">{st('Experience')}</h2>
          <div className="space-y-2.5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[10.5px] text-slate-900">{exp.jobTitle}, {exp.company}</span>
                  <span className="text-[9px] text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <div className="text-[9.5px] text-slate-500 italic">{exp.location}</div>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc ml-4 text-[9.5px] text-slate-700 space-y-0.5 pt-0.5">
                    {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold border-b border-slate-300 pb-0.5 mb-1.5 text-slate-900">{st('Education')}</h2>
          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-[10.5px] text-slate-900">{edu.institution}</span>
                  <span className="text-[10px] text-slate-600"> — {edu.degree}</span>
                </div>
                <span className="text-[9px] text-slate-500">{edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold border-b border-slate-300 pb-0.5 mb-1 text-slate-900">{st('Skills')}</h2>
          <p className="text-[10px] text-slate-700">
            {skills.map((s) => (typeof s === 'string' ? s : s.name)).join(' · ')}
          </p>
        </div>
      )}

      {languages && languages.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold border-b border-slate-300 pb-0.5 mb-1 text-slate-900">{st('Languages')}</h2>
          <p className="text-[10px] text-slate-700">
            {languages.map((l) => (typeof l === 'string' ? l : l.name)).join(' · ')}
          </p>
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold border-b border-slate-300 pb-0.5 mb-1 text-slate-900">{st('Certifications')}</h2>
          <div className="space-y-0.5">
            {certifications.map((c) => (
              <div key={c.id} className="text-[10px] text-slate-700">
                {c.name} — {c.issuer} ({c.date})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
