import React from 'react';
import { CVData } from '../../types';
import { SkillItemRow } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const MinimalistTemplate: React.FC<TemplateProps> = ({ data, primaryColor = '#18181b' }) => {
  const { personal, experiences, education, skills, projects, certifications } = data;

  return (
    <div className="bg-white text-zinc-800 w-full min-h-full font-sans-ui flex flex-col p-10 shadow-sm rounded-sm overflow-hidden">
      {/* Minimal Header */}
      <div className="border-b border-zinc-200 pb-6 mb-6">
        <h1 className="text-3xl font-light tracking-tight text-zinc-950">
          {personal.fullName || 'Your Name'}
        </h1>
        <p className="text-sm font-normal text-zinc-500 mt-1">
          {personal.jobTitle || 'Your Title'}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-100">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.address && <span>· {personal.address}</span>}
          {personal.website && <span>· {personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mb-6">
          <p className="text-xs leading-relaxed text-zinc-600">
            {personal.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6 space-y-4">
          <h2 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-semibold text-zinc-900">{exp.jobTitle} — <span className="font-normal text-zinc-600">{exp.company}</span></span>
                  <span className="text-zinc-400 text-[11px]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets && (
                  <ul className="space-y-1 text-xs text-zinc-600 pl-3">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="list-disc list-outside leading-snug">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Col Bottom Row */}
      <div className="grid grid-cols-2 gap-8 pt-4 border-t border-zinc-100">
        {education.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              EDUCATION
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <p className="font-medium text-zinc-900">{edu.degree}</p>
                <p className="text-zinc-600">{edu.institution}</p>
                <p className="text-[11px] text-zinc-400">{edu.endDate || edu.startDate}</p>
              </div>
            ))}
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              SKILLS
            </h2>
            <div className={data.skillStyle === 'tags' || data.skillStyle === 'badges' ? 'flex flex-wrap gap-1.5' : 'space-y-2'}>
              {skills.map((skill, index) => (
                <SkillItemRow
                  key={index}
                  item={skill}
                  style={data.skillStyle || 'tags'}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
