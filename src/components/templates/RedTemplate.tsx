import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { SkillItemRow } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const RedTemplate: React.FC<TemplateProps> = ({ data, primaryColor = '#991b1b' }) => {
  const { personal, experiences, education, skills, projects, certifications } = data;

  return (
    <div className="bg-white text-slate-800 w-full min-h-full font-sans-ui flex flex-col shadow-sm rounded-sm overflow-hidden">
      {/* Top Banner Accent Line */}
      <div className="h-3 w-full" style={{ backgroundColor: primaryColor }} />

      {/* Header section */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {personal.photoUrl && (
              <img
                src={personal.photoUrl}
                alt={personal.fullName}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-md object-cover border-2 shadow-sm"
                style={{ borderColor: primaryColor }}
              />
            )}
            <div>
              <h1 className="text-3xl font-serif-title font-bold tracking-tight text-slate-950">
                {personal.fullName || 'Your Name'}
              </h1>
              <p className="text-sm font-semibold tracking-wider uppercase mt-1" style={{ color: primaryColor }}>
                {personal.jobTitle || 'Your Professional Title'}
              </p>
            </div>
          </div>

          <div className="text-xs space-y-1 text-slate-600 text-right">
            {personal.email && <div>{personal.email}</div>}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.address && <div>{personal.address}</div>}
            {personal.website && <div className="font-medium" style={{ color: primaryColor }}>{personal.website}</div>}
          </div>
        </div>
      </div>

      {/* Body Grid */}
      <div className="p-8 grid grid-cols-12 gap-8 flex-1">
        {/* Left Column (8 cols) */}
        <div className="col-span-8 space-y-6">
          {personal.summary && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: primaryColor }} />
                <h2 className="text-xs font-bold tracking-widest text-slate-900 uppercase">
                  PROFILE SUMMARY
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 pl-5">{personal.summary}</p>
            </div>
          )}

          {experiences.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: primaryColor }} />
                <h2 className="text-xs font-bold tracking-widest text-slate-900 uppercase">
                  EXPERIENCE
                </h2>
              </div>
              <div className="space-y-4 pl-5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{exp.jobTitle}</span>
                        <span className="text-slate-600 block font-medium">{exp.company}</span>
                      </div>
                      <span className="text-slate-500 text-[11px] font-medium">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.bullets && (
                      <ul className="space-y-1 text-xs text-slate-700 pt-1">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="list-disc list-inside leading-snug">
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

          {projects && projects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: primaryColor }} />
                <h2 className="text-xs font-bold tracking-widest text-slate-900 uppercase">
                  PROJECTS
                </h2>
              </div>
              <div className="space-y-2 pl-5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <span className="font-semibold text-slate-900">{proj.title}</span>
                    <p className="text-slate-700 mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols) */}
        <div className="col-span-4 space-y-6">
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-900 uppercase border-b-2 pb-1 mb-3" style={{ borderBottomColor: primaryColor }}>
                EDUCATION
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-slate-900">{edu.institution}</p>
                    <p className="text-slate-700">{edu.degree}</p>
                    <p className="text-[11px] text-slate-500">{edu.endDate || edu.startDate}</p>
                    {edu.details && <p className="text-[11px] text-slate-600 italic mt-0.5">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-900 uppercase border-b-2 pb-1 mb-3" style={{ borderBottomColor: primaryColor }}>
                SKILLS
              </h2>
              <div className={data.skillStyle === 'tags' || data.skillStyle === 'badges' ? 'flex flex-wrap gap-1.5' : 'space-y-2'}>
                {skills.map((skill, index) => (
                  <SkillItemRow
                    key={index}
                    item={skill}
                    style={data.skillStyle || 'badges'}
                    primaryColor={primaryColor}
                  />
                ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-900 uppercase border-b-2 pb-1 mb-2" style={{ borderBottomColor: primaryColor }}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-2 text-xs">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="font-semibold text-slate-800">{cert.name}</p>
                    <p className="text-[11px] text-slate-500">{cert.issuer} · {cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
