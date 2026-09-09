import React from 'react';
import { CVData } from '../../types';
import { FormattedText } from '../common/FormattedText';
import { getSkillLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

/**
 * 100% ATS Compliant Executive Single-Column Template.
 * High-legibility serif layout with bold horizontal dividers and clear ATS readable hierarchy.
 */
export const TemplateATSExecutive: React.FC<TemplateProps> = ({
  data,
  primaryColor = '#1e293b',
}) => {
  const { personal, experiences, education, skills, languages, achievements, projects, certifications, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;

  return (
    <div className="bg-white text-gray-900 w-full min-h-full font-serif flex flex-col p-10 shadow-sm leading-relaxed">
      {/* Executive Header */}
      <header className="border-b-2 border-gray-950 pb-4 mb-5 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-950 uppercase font-serif">
          {personal.fullName || 'Candidate Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-sm font-semibold text-gray-800 mt-1 uppercase tracking-widest font-sans">
            {personal.jobTitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-3 text-xs text-gray-700 mt-2.5 font-sans">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="text-gray-900 underline">
              {personal.email}
            </a>
          )}
          {personal.phone && <span>| {personal.phone}</span>}
          {personal.address && <span>| {personal.address}</span>}
          {personal.linkedin && (
            <span>| linkedin.com/in/{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
          )}
          {personal.website && <span>| {personal.website}</span>}
        </div>
      </header>

      {/* Executive Summary */}
      {personal.summary && (
        <section className="mb-5">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-gray-950 border-b border-gray-300 pb-1 mb-2 font-sans")}>
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-gray-800 text-justify">
            <FormattedText text={personal.summary} />
          </p>
        </section>
      )}

      {/* Professional Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-5">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-gray-950 border-b border-gray-300 pb-1 mb-3 font-sans")}>
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-gray-950">
                  <span className="text-sm">
                    {exp.jobTitle}{exp.company ? ` | ${exp.company}` : ''}
                  </span>
                  <span className="font-normal text-gray-700 text-[11px] font-sans">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    {exp.location ? ` (${exp.location})` : ''}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-gray-800">
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

      {/* Core Competencies & Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-gray-950 border-b border-gray-300 pb-1 mb-2 font-sans")}>
            Core Competencies & Areas of Expertise
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">
            {skills.map((s, idx) => {
              const { name } = getSkillLevel(s);
              return (
                <span key={idx}>
                  <strong className="font-semibold">{name}</strong>
                  {idx < skills.length - 1 ? '  •  ' : ''}
                </span>
              );
            })}
          </p>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-gray-950 border-b border-gray-300 pb-1 mb-2 font-sans")}>
            Education & Academic Background
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-gray-950">
                  <span>
                    {edu.degree}{edu.institution ? `, ${edu.institution}` : ''}
                  </span>
                  <span className="font-normal text-gray-600 text-[11px] font-sans">
                    {edu.endDate || edu.startDate}
                    {edu.location ? ` | ${edu.location}` : ''}
                  </span>
                </div>
                {edu.details && (
                  <p className="text-gray-700 mt-0.5 text-[11px] italic">
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
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-gray-950 border-b border-gray-300 pb-1 mb-2 font-sans")}>
            Key Initiatives & Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-gray-950">
                  <span>
                    {proj.title}{proj.role ? ` (${proj.role})` : ''}
                  </span>
                  {proj.link && <span className="font-normal text-gray-600 text-[11px] font-sans">{proj.link}</span>}
                </div>
                <p className="text-gray-800 mt-0.5 leading-snug">
                  <FormattedText text={proj.description} />
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Additional */}
      {certifications && certifications.length > 0 && (
        <section className="mb-3">
          <h2 className={headerClass("text-xs font-bold  tracking-wider text-gray-950 border-b border-gray-300 pb-1 mb-1.5 font-sans")}>
            Certifications & Affiliations
          </h2>
          <div className="space-y-1 text-xs text-gray-800">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <span>
                  <strong className="font-semibold text-gray-950">{cert.name}</strong> — {cert.issuer}
                </span>
                {cert.date && <span className="text-gray-600 text-[11px] font-sans">{cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
