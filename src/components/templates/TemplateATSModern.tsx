import React from 'react';
import { CVData } from '../../types';
import { FormattedText } from '../common/FormattedText';
import { getSkillLevel, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

/**
 * 100% ATS Compliant Modern Sans-Serif Single-Column Template.
 * Clean, modern typography with zero tables or sidebar containers.
 */
export const TemplateATSModern: React.FC<TemplateProps> = ({
  data,
  primaryColor = '#0f172a',
}) => {
  const { personal, experiences, education, skills, languages, achievements, projects, certifications, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;

  return (
    <div className="bg-white text-slate-900 w-full min-h-full font-sans flex flex-col p-10 shadow-sm leading-normal">
      {/* Left-Aligned Modern Header */}
      <header className="border-b-2 border-slate-900 pb-3 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 uppercase">
          {personal.fullName || 'Candidate Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-sm font-semibold text-slate-700 mt-0.5 tracking-wide">
            {personal.jobTitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
          {personal.email && (
            <span className="font-medium text-slate-800">{personal.email}</span>
          )}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.address && <span>· {personal.address}</span>}
          {personal.linkedin && (
            <span>· linkedin.com/in/{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
          )}
          {personal.github && (
            <span>· github.com/{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
          )}
          {personal.website && <span>· {personal.website}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {personal.summary && (
        <section className="mb-5">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2")}>
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700">
            <FormattedText text={personal.summary} />
          </p>
        </section>
      )}

      {/* Work Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-5">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3")}>
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experiences.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-950 text-sm">{exp.jobTitle}</span>
                    {exp.company && (
                      <span className="text-slate-800 font-semibold ml-1.5">— {exp.company}</span>
                    )}
                  </div>
                  <span className="text-slate-600 font-medium text-[11px]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    {exp.location ? ` | ${exp.location}` : ''}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-slate-700">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="leading-snug">
                        <FormattedText text={bullet} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2")}>
            Skills & Technical Proficiencies
          </h2>
          <div className="text-xs text-slate-800 leading-relaxed">
            {skills.map((s, idx) => {
              const { name } = getSkillLevel(s);
              return (
                <span key={idx}>
                  <span className="font-medium">{name}</span>
                  {idx < skills.length - 1 ? ' · ' : ''}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2")}>
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-950">
                  <span>
                    {edu.degree}{edu.institution ? ` — ${edu.institution}` : ''}
                  </span>
                  <span className="font-normal text-slate-600 text-[11px]">
                    {edu.endDate || edu.startDate}
                    {edu.location ? ` | ${edu.location}` : ''}
                  </span>
                </div>
                {edu.details && (
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    <FormattedText text={edu.details} />
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2")}>
            Key Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-950">
                    {proj.title}{proj.role ? ` (${proj.role})` : ''}
                  </span>
                  {proj.link && <span className="text-slate-500 text-[11px]">{proj.link}</span>}
                </div>
                <p className="text-slate-700 mt-0.5 leading-snug">
                  <FormattedText text={proj.description} />
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mb-4">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5")}>
            Certifications
          </h2>
          <div className="space-y-1 text-xs text-slate-800">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <span>
                  <strong className="font-medium text-slate-950">{cert.name}</strong> — {cert.issuer}
                </span>
                {cert.date && <span className="text-slate-500 text-[11px]">{cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Achievements */}
      {(languages?.length > 0 || achievements?.length > 0) && (
        <section className="mb-2">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5")}>
            Additional Credentials
          </h2>
          {languages?.length > 0 && (
            <p className="text-xs text-slate-700 mb-1">
              <span className="font-semibold text-slate-900">Languages: </span>
              {languages.map((l, idx) => {
                const { name, level } = getLanguageLevel(l);
                return (
                  <span key={idx}>
                    {name} ({level}/5){idx < languages.length - 1 ? ', ' : ''}
                  </span>
                );
              })}
            </p>
          )}
          {achievements?.length > 0 && (
            <div className="text-xs text-slate-700 space-y-0.5">
              {achievements.map((ach) => (
                <div key={ach.id}>
                  • <strong className="text-slate-900">{ach.title}</strong>: {ach.description}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
