import React from 'react';
import { CVData } from '../../types';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateTealGrid: React.FC<TemplateProps> = ({ data, primaryColor = '#3b8478' }) => {
  const { personal, experiences, education, skills, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;

  return (
    <div className="bg-white text-[#1f2937] text-[11px] leading-relaxed w-full min-h-full font-sans p-8 md:p-10 flex flex-col justify-between select-text">
      <div className="space-y-6">
        {/* Centered Header matching Peter Madison */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950">
            {personal.fullName || 'Peter Madison'}
          </h1>
          <div className="text-[12px] font-medium text-slate-700">
            {personal.jobTitle || 'Masters-Qualified Pharmacist'}
          </div>
        </div>

        {/* Personal details Box */}
        <div className="space-y-0">
          <div
            className={headerClass("w-full text-white px-3 py-1 text-xs font-bold tracking-wide")}
            style={{ backgroundColor: primaryColor }}
          >
            Personal details
          </div>
          <div className="border border-t-0 border-slate-300 p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[10.5px]">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-bold text-slate-900">Email address</span>
              <span className="col-span-2 text-slate-700 truncate">{personal.email || 'peter_madison@example.com'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-bold text-slate-900">Phone number</span>
              <span className="col-span-2 text-slate-700">{personal.phone || '+44 76379 896573'}</span>
            </div>
            {personal.address && (
              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <span className="font-bold text-slate-900">Address</span>
                <span className="col-span-2 text-slate-700">{personal.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Box */}
        {personal.summary && (
          <div className="space-y-0">
            <div
              className={headerClass("w-full text-white px-3 py-1 text-xs font-bold tracking-wide")}
              style={{ backgroundColor: primaryColor }}
            >
              Profile
            </div>
            <div className="border border-t-0 border-slate-300 p-3.5 text-[10.5px] text-slate-800 leading-relaxed text-justify">
              {personal.summary}
            </div>
          </div>
        )}

        {/* Employment Box */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-0">
            <div
              className={headerClass("w-full text-white px-3 py-1 text-xs font-bold tracking-wide")}
              style={{ backgroundColor: primaryColor }}
            >
              Employment
            </div>
            <div className="border border-t-0 border-slate-300 p-4 space-y-4 text-[10.5px]">
              {experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-4 sm:col-span-3 font-bold text-slate-900 text-[10px]">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <div className="col-span-8 sm:col-span-9 space-y-1">
                    <div className="font-bold text-slate-900">{exp.jobTitle}</div>
                    <div className="text-[10px] font-medium" style={{ color: primaryColor }}>
                      {exp.company} {exp.location ? `, ${exp.location}` : ''}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc ml-3.5 text-[10px] text-slate-700 space-y-1 pt-0.5">
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

        {/* Education or Professional Affiliations */}
        {education && education.length > 0 && (
          <div className="space-y-0">
            <div
              className={headerClass("w-full text-white px-3 py-1 text-xs font-bold tracking-wide")}
              style={{ backgroundColor: primaryColor }}
            >
              Education & Qualifications
            </div>
            <div className="border border-t-0 border-slate-300 p-4 space-y-3 text-[10.5px]">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-4 sm:col-span-3 font-bold text-slate-900 text-[10px]">
                    {edu.endDate}
                  </div>
                  <div className="col-span-8 sm:col-span-9 space-y-0.5">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-[10px]" style={{ color: primaryColor }}>
                      {edu.institution} {edu.location ? `, ${edu.location}` : ''}
                    </div>
                    {edu.details && <p className="text-[9.5px] text-slate-600 italic">{edu.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Affiliations / Skills */}
        <div className="space-y-0">
          <div
            className={headerClass("w-full text-white px-3 py-1 text-xs font-bold tracking-wide")}
            style={{ backgroundColor: primaryColor }}
          >
            Professional Affiliations & Skills
          </div>
          <div className="border border-t-0 border-slate-300 p-3.5 text-[10.5px] text-slate-800 space-y-1.5">
            {achievements && achievements.length > 0 ? (
              achievements.map((ach) => (
                <div key={ach.id}>
                  <strong className="text-slate-900">{ach.title}</strong> — {ach.description}
                </div>
              ))
            ) : (
              <div>
                <strong className="text-slate-900">Member of the Royal Pharmaceutical Society</strong> (2018 - present)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer watermark matching screenshot */}
      <div className="pt-8 text-center text-[9.5px] text-slate-400 font-sans tracking-wide">
        © JobCraft
      </div>
    </div>
  );
};
