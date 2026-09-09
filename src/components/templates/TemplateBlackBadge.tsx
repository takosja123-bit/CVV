import React from 'react';
import { CVData } from '../../types';
import { getSkillLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateBlackBadge: React.FC<TemplateProps> = ({ data, primaryColor = '#000000' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-[#111827] text-[11px] leading-relaxed w-full min-h-full font-sans p-8 md:p-10 flex flex-col justify-between select-text">
      <div className="space-y-5">
        {/* Header matching Screenshot: SAM HILL */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black uppercase">
            {personal.fullName || 'SAM HILL'}
          </h1>
          <div className="text-[12.5px] font-medium text-slate-800 mt-1">
            {personal.jobTitle || 'Customer Service Rep with 98% Customer Satisfaction Rate'}
          </div>
          {/* Thick Solid Rule */}
          <div className="h-[3.5px] bg-black mt-3 mb-4 w-full" style={{ backgroundColor: primaryColor }} />
        </div>

        {/* PERSONAL DETAILS Section */}
        <div className="space-y-1.5">
          <div
            className={headerClass("inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white rounded-xs")}
            style={{ backgroundColor: primaryColor }}
          >
            {st('Personal Details')}
          </div>
          <div className="text-[10.5px] text-slate-800 space-y-0.5 pl-0.5">
            {personal.address && <div>{personal.address}</div>}
            <div className="flex flex-wrap gap-x-3 text-slate-700">
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>• {personal.phone}</span>}
              {personal.website && <span>• {personal.website}</span>}
            </div>
          </div>
        </div>

        {/* PROFILE Section */}
        {personal.summary && (
          <div className="space-y-1.5">
            <div
              className={headerClass("inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white rounded-xs")}
              style={{ backgroundColor: primaryColor }}
            >
              {st('Profile')}
            </div>
            <p className="text-[10.5px] text-slate-800 leading-relaxed text-justify pl-0.5">
              {personal.summary}
            </p>
          </div>
        )}

        {/* EMPLOYMENT Section */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-3">
            <div
              className={headerClass("inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white rounded-xs")}
              style={{ backgroundColor: primaryColor }}
            >
              {st('Employment')}
            </div>
            <div className="space-y-3.5 pl-0.5">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="font-bold text-black">{exp.jobTitle}</span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-700 font-normal">
                    {exp.company} {exp.location ? `, ${exp.location}` : ''}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc ml-4 text-[10px] text-slate-800 space-y-0.5 pt-0.5">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION Section */}
        {education && education.length > 0 && (
          <div className="space-y-2.5">
            <div
              className={headerClass("inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white rounded-xs")}
              style={{ backgroundColor: primaryColor }}
            >
              {st('Education')}
            </div>
            <div className="space-y-3 pl-0.5">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="font-bold text-black">{edu.degree}</span>
                    <span className="text-[10px] text-slate-600 font-medium">{edu.endDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-700">
                    {edu.institution} {edu.location ? `, ${edu.location}` : ''}
                  </div>
                  {edu.details && (
                    <div className="text-[9.5px] text-slate-600 leading-snug">
                      {edu.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS Section */}
        {skills && skills.length > 0 && (
          <div className="space-y-2.5">
            <div
              className={headerClass("inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white rounded-xs")}
              style={{ backgroundColor: primaryColor }}
            >
              {st('Skills')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pl-0.5 text-[10px]">
              {skills.map((skill, idx) => {
                const { name, level } = getSkillLevel(skill);
                return (
                  <div key={idx} className="space-y-0.5">
                    <span className="font-bold text-black">{name}:</span>{' '}
                    <span className="text-slate-700">
                      {level >= 5
                        ? 'Expert level execution with verified industry achievements.'
                        : level >= 4
                        ? 'High proficiency and independent execution in production.'
                        : level >= 3
                        ? 'Strong working knowledge and collaborative proficiency.'
                        : 'Foundational practical experience.'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LANGUAGES or ACHIEVEMENTS */}
        {languages && languages.length > 0 && (
          <div className="space-y-2">
            <div
              className={headerClass("inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white rounded-xs")}
              style={{ backgroundColor: primaryColor }}
            >
              {st('Languages')}
            </div>
            <div className="flex flex-wrap gap-4 pl-0.5 text-[10px] text-slate-800">
              {languages.map((l, idx) => (
                <span key={idx}>
                  <strong className="text-black">{l.name}:</strong> Level {l.level}/5
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer watermark matching screenshot */}
      <div className="pt-8 text-center text-[9.5px] text-slate-400 font-sans tracking-wide">
        © JobifyCV
      </div>
    </div>
  );
};
