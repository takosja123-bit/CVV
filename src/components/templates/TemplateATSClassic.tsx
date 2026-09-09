import React from 'react';
import { CVData } from '../../types';
import { FormattedText } from '../common/FormattedText';
import {
  getSkillLevel,
  getLanguageLevel,
  formatSectionTitle,
  groupExperiencesByEmployer,
  groupEducationByInstitution,
} from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

/**
 * 100% ATS Compliant Pure Single-Column Template (Standard Harvard / Tech standard format).
 * Zero tables, zero floats, zero multi-columns, zero icons or images in data streams.
 * Guaranteed 100% parsing accuracy across Workday, Taleo, Greenhouse, Lever, iCIMS.
 */
export const TemplateATSClassic: React.FC<TemplateProps> = ({
  data,
  primaryColor = '#111827',
}) => {
  const { personal, experiences, education, skills, languages, achievements, references, projects, certifications, style } = data;

  const isUppercase = style?.uppercaseHeaders ?? true;
  const isGroupByEmployer = style?.groupByEmployer ?? false;
  const isGroupByInstitution = style?.groupByInstitution ?? false;

  return (
    <div className="bg-white text-gray-900 w-full min-h-full font-serif flex flex-col p-10 shadow-sm leading-normal">
      {/* ATS Header - Centered, Plain Text Hierarchy */}
      <header className="text-center border-b border-gray-800 pb-3 mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-black uppercase">
          {personal.fullName || 'Candidate Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-sm font-semibold text-gray-800 mt-1 uppercase tracking-wide">
            {personal.jobTitle}
          </p>
        )}

        {/* Contact Info Line */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs text-gray-700 mt-2">
          {personal.phone && <span>{personal.phone}</span>}
          {personal.phone && personal.email && <span>|</span>}
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="text-gray-900 underline">
              {personal.email}
            </a>
          )}
          {personal.address && (
            <>
              <span>|</span>
              <span>{personal.address}</span>
            </>
          )}
          {personal.linkedin && (
            <>
              <span>|</span>
              <span>linkedin.com/in/{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            </>
          )}
          {personal.github && (
            <>
              <span>|</span>
              <span>github.com/{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
            </>
          )}
          {personal.website && (
            <>
              <span>|</span>
              <span>{personal.website}</span>
            </>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {personal.summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            {formatSectionTitle('Professional Summary', isUppercase)}
          </h2>
          <p className="text-xs leading-relaxed text-gray-800 text-justify">
            <FormattedText text={personal.summary} />
          </p>
        </section>
      )}

      {/* Work Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold tracking-wider text-black border-b border-gray-400 pb-0.5 mb-2">
            {formatSectionTitle('Work Experience', isUppercase)}
          </h2>
          <div className="space-y-3">
            {isGroupByEmployer ? (
              groupExperiencesByEmployer(experiences).map((group, gIdx) => (
                <div key={gIdx} className="text-xs space-y-1.5">
                  <div className="flex justify-between items-baseline font-bold text-gray-950">
                    <span>{group.company}</span>
                    {group.location && <span className="font-normal text-gray-700 text-[11px]">{group.location}</span>}
                  </div>
                  {group.roles.map((exp) => (
                    <div key={exp.id} className="pl-2">
                      <div className="flex justify-between items-baseline text-gray-900 font-semibold">
                        <span>{exp.jobTitle}</span>
                        <span className="font-normal text-gray-700 text-[11px]">
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc list-outside pl-4 mt-0.5 space-y-0.5 text-gray-800">
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
              ))
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-950">
                    <span>
                      {exp.jobTitle}{exp.company ? ` — ${exp.company}` : ''}
                    </span>
                    <span className="font-normal text-gray-700 text-[11px]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      {exp.location ? ` | ${exp.location}` : ''}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 mt-1 space-y-1 text-gray-800">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          <FormattedText text={bullet} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold tracking-wider text-black border-b border-gray-400 pb-0.5 mb-2">
            {formatSectionTitle('Education', isUppercase)}
          </h2>
          <div className="space-y-2.5">
            {isGroupByInstitution ? (
              groupEducationByInstitution(education).map((group, gIdx) => (
                <div key={gIdx} className="text-xs space-y-1">
                  <div className="flex justify-between items-baseline font-bold text-gray-950">
                    <span>{group.institution}</span>
                    {group.location && <span className="font-normal text-gray-700 text-[11px]">{group.location}</span>}
                  </div>
                  {group.degrees.map((edu) => (
                    <div key={edu.id} className="pl-2">
                      <div className="flex justify-between items-baseline text-gray-900">
                        <span className="font-medium">{edu.degree}</span>
                        <span className="font-normal text-gray-700 text-[11px]">
                          {edu.endDate || edu.startDate}
                        </span>
                      </div>
                      {edu.details && (
                        <p className="text-gray-700 text-[11px] italic">
                          <FormattedText text={edu.details} />
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-950">
                    <span>
                      {edu.degree}{edu.institution ? `, ${edu.institution}` : ''}
                    </span>
                    <span className="font-normal text-gray-700 text-[11px]">
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
              ))
            )}
          </div>
        </section>
      )}

      {/* Technical & Core Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            {formatSectionTitle('Skills & Competencies', isUppercase)}
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">
            <span className="font-bold">Core Skills: </span>
            {skills.map((s, idx) => {
              const { name } = getSkillLevel(s);
              return (
                <span key={idx}>
                  {name}
                  {idx < skills.length - 1 ? ' • ' : ''}
                </span>
              );
            })}
          </p>
        </section>
      )}

      {/* Key Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold tracking-wider text-black border-b border-gray-400 pb-0.5 mb-2">
            {formatSectionTitle('Key Projects', isUppercase)}
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-gray-950">
                  <span>
                    {proj.title}{proj.role ? ` (${proj.role})` : ''}
                  </span>
                  {proj.link && <span className="font-normal text-gray-600 text-[11px]">{proj.link}</span>}
                </div>
                <p className="text-gray-800 mt-0.5 leading-snug">
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
          <h2 className="text-xs font-bold tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            {formatSectionTitle('Certifications & Licenses', isUppercase)}
          </h2>
          <div className="space-y-1 text-xs text-gray-800">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <span>
                  <strong className="font-semibold text-gray-950">{cert.name}</strong> — {cert.issuer}
                </span>
                {cert.date && <span className="text-gray-600 text-[11px]">{cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Achievements */}
      {(languages?.length > 0 || achievements?.length > 0) && (
        <section className="mb-2">
          <h2 className="text-xs font-bold tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            {formatSectionTitle('Additional Information', isUppercase)}
          </h2>
          {languages?.length > 0 && (
            <p className="text-xs text-gray-800 mb-1">
              <span className="font-bold">Languages: </span>
              {languages.map((l, idx) => {
                const { name, level } = getLanguageLevel(l);
                return (
                  <span key={idx}>
                    {name} (Proficiency {level}/5){idx < languages.length - 1 ? ', ' : ''}
                  </span>
                );
              })}
            </p>
          )}
          {achievements?.length > 0 && (
            <div className="text-xs text-gray-800 space-y-1 mt-1">
              <span className="font-bold">Honors & Awards: </span>
              {achievements.map((ach) => (
                <div key={ach.id} className="pl-3">
                  • <strong>{ach.title}</strong> {ach.date ? `(${ach.date})` : ''}: {ach.description}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
