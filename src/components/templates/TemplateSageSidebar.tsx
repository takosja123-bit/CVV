import React from 'react';
import { CVData } from '../../types';
import { getSkillLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateSageSidebar: React.FC<TemplateProps> = ({ data, primaryColor = '#67917f' }) => {
  const { personal, experiences, education, skills, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-relaxed w-full min-h-full font-sans flex flex-col justify-between select-text">
      <div>
        {/* Top Header */}
        <div className="p-8 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {personal.fullName || 'Joanna Brown'}
          </h1>
          <div className="text-[12px] font-medium text-slate-700 mt-0.5">
            {personal.jobTitle || "Registered Nurse with 8 Years' Experience in Geriatric Care"}
          </div>
        </div>

        {/* 2-Column Body */}
        <div className="grid grid-cols-12 border-t border-slate-200">
          {/* Left Column (Sage Green Sidebar) */}
          <div
            className="col-span-4 text-white p-6 space-y-6"
            style={{ backgroundColor: primaryColor }}
          >
            {/* Personal details */}
            <div className="space-y-2.5">
              <h2 className={headerClass("text-xs font-bold text-white tracking-wide border-b border-white/30 pb-1")}>
                Personal details
              </h2>
              <div className="space-y-2 text-[10px] text-white/95">
                <div>
                  <div className="font-bold text-white/80 text-[9px]">Name</div>
                  <div>{personal.fullName || 'Joanna Brown'}</div>
                </div>
                {personal.email && (
                  <div>
                    <div className="font-bold text-white/80 text-[9px]">Email address</div>
                    <div className="truncate">{personal.email}</div>
                  </div>
                )}
                {personal.phone && (
                  <div>
                    <div className="font-bold text-white/80 text-[9px]">Phone number</div>
                    <div>{personal.phone}</div>
                  </div>
                )}
                {personal.address && (
                  <div>
                    <div className="font-bold text-white/80 text-[9px]">Address</div>
                    <div>{personal.address}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills with square block bullets */}
            {skills && skills.length > 0 && (
              <div className="space-y-2.5">
                <h2 className={headerClass("text-xs font-bold text-white tracking-wide border-b border-white/30 pb-1")}>
                  Skills
                </h2>
                <div className="space-y-2.5 text-[9.5px] text-white/95">
                  {skills.map((skill, idx) => {
                    const { name, level } = getSkillLevel(skill);
                    return (
                      <div key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-white/60 shrink-0 text-[10px]">■</span>
                        <div>
                          <strong className="text-white font-bold">{name}:</strong>{' '}
                          {level >= 5
                            ? 'Experience delivering advanced technical solutions and critical workflows.'
                            : level >= 4
                            ? 'Supervising key tasks and coordinating direct requirements.'
                            : level >= 3
                            ? 'Strong communicative and operational ability.'
                            : 'Practical foundational execution.'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (White Main Body) */}
          <div className="col-span-8 p-6 md:p-8 space-y-6">
            {/* Profile */}
            {personal.summary && (
              <div className="space-y-1.5">
                <h2 className={headerClass("text-xs font-bold text-slate-900 tracking-wide border-b border-slate-200 pb-1")}>
                  Profile
                </h2>
                <p className="text-[10.5px] text-slate-700 leading-relaxed text-justify">
                  {personal.summary}
                </p>
              </div>
            )}

            {/* Employment */}
            {experiences && experiences.length > 0 && (
              <div className="space-y-3">
                <h2 className={headerClass("text-xs font-bold text-slate-900 tracking-wide border-b border-slate-200 pb-1")}>
                  Employment
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="grid grid-cols-12 gap-3 items-start text-[10.5px]">
                      <div className="col-span-4 font-bold text-slate-900 text-[10px]">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </div>
                      <div className="col-span-8 space-y-1">
                        <div className="font-bold text-slate-900">{exp.jobTitle}</div>
                        <div className="text-[10px] font-medium" style={{ color: primaryColor }}>
                          {exp.company} {exp.location ? `, ${exp.location}` : ''}
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="list-disc ml-3.5 text-[9.5px] text-slate-700 space-y-0.5 pt-0.5">
                            {exp.bullets.map((b, idx) => (
                              <li key={idx} className="leading-snug">{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <div className="space-y-3">
                <h2 className={headerClass("text-xs font-bold text-slate-900 tracking-wide border-b border-slate-200 pb-1")}>
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-12 gap-3 items-start text-[10.5px]">
                      <div className="col-span-4 font-bold text-slate-900 text-[10px]">
                        {edu.startDate ? `${edu.startDate} - ` : ''}{edu.endDate}
                      </div>
                      <div className="col-span-8 space-y-0.5">
                        <div className="font-bold text-slate-900">{edu.degree}</div>
                        <div className="text-[10px]" style={{ color: primaryColor }}>
                          {edu.institution} {edu.location ? `, ${edu.location}` : ''}
                        </div>
                        {edu.details && (
                          <p className="text-[9px] text-slate-600 italic">{edu.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer watermark matching screenshot */}
      <div className="pt-8 pb-4 text-center text-[9.5px] text-slate-400 font-sans tracking-wide">
        © JobCraft
      </div>
    </div>
  );
};
