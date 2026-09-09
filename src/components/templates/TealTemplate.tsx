import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { SkillItemRow } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TealTemplate: React.FC<TemplateProps> = ({ data, primaryColor = '#0d766e' }) => {
  const { personal, experiences, education, skills, projects, certifications } = data;

  const initials = personal.fullName
    ? personal.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AC';

  return (
    <div className="bg-white text-slate-800 w-full min-h-full font-sans-ui flex flex-col shadow-sm rounded-sm overflow-hidden">
      {/* Header Band */}
      <div className="p-8 border-b-4 border-slate-100 flex items-center justify-between" style={{ borderBottomColor: primaryColor }}>
        <div className="flex items-center gap-5">
          {personal.photoUrl ? (
            <img
              src={personal.photoUrl}
              alt={personal.fullName}
              referrerPolicy="no-referrer"
              className="w-18 h-18 rounded-full object-cover shadow-sm border-2"
              style={{ borderColor: primaryColor }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold font-serif-title shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {initials}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-serif-title font-bold tracking-wide" style={{ color: primaryColor }}>
              {personal.fullName || 'Your Name'}
            </h1>
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mt-0.5">
              {personal.jobTitle || 'Your Professional Title'}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="text-xs space-y-1 text-slate-600 text-right">
          {personal.email && (
            <div className="flex items-center justify-end gap-1.5">
              <span>{personal.email}</span>
              <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center justify-end gap-1.5">
              <span>{personal.phone}</span>
              <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            </div>
          )}
          {personal.address && (
            <div className="flex items-center justify-end gap-1.5">
              <span>{personal.address}</span>
              <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            </div>
          )}
          {personal.website && (
            <div className="flex items-center justify-end gap-1.5">
              <span>{personal.website}</span>
              <Globe className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-8 grid grid-cols-12 gap-8 flex-1">
        {/* Left Column (7 cols) */}
        <div className="col-span-8 space-y-6">
          {personal.summary && (
            <div>
              <h2
                className="text-xs font-bold tracking-wider uppercase pb-1 mb-2 border-b-2"
                style={{ color: primaryColor, borderBottomColor: `${primaryColor}33` }}
              >
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-xs leading-relaxed text-slate-700">{personal.summary}</p>
            </div>
          )}

          {experiences.length > 0 && (
            <div>
              <h2
                className="text-xs font-bold tracking-wider uppercase pb-1 mb-3 border-b-2"
                style={{ color: primaryColor, borderBottomColor: `${primaryColor}33` }}
              >
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{exp.jobTitle}</span>
                        <span className="text-slate-600 block font-medium" style={{ color: primaryColor }}>
                          {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px] font-medium shrink-0">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.bullets && (
                      <ul className="space-y-1 text-xs text-slate-700 pl-3">
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

          {projects && projects.length > 0 && (
            <div>
              <h2
                className="text-xs font-bold tracking-wider uppercase pb-1 mb-2 border-b-2"
                style={{ color: primaryColor, borderBottomColor: `${primaryColor}33` }}
              >
                KEY PROJECTS
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <span className="font-bold text-slate-800">{proj.title}</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{proj.description}</p>
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
              <h2
                className="text-xs font-bold tracking-wider uppercase pb-1 mb-3 border-b-2"
                style={{ color: primaryColor, borderBottomColor: `${primaryColor}33` }}
              >
                EDUCATION
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-900">{edu.institution}</p>
                    <p className="text-slate-700">{edu.degree}</p>
                    <p className="text-[11px] text-slate-500">{edu.endDate || edu.startDate}</p>
                    {edu.details && <p className="text-[11px] text-slate-600 italic">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h2
                className="text-xs font-bold tracking-wider uppercase pb-1 mb-3 border-b-2"
                style={{ color: primaryColor, borderBottomColor: `${primaryColor}33` }}
              >
                KEY SKILLS
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

          {certifications && certifications.length > 0 && (
            <div>
              <h2
                className="text-xs font-bold tracking-wider uppercase pb-1 mb-2 border-b-2"
                style={{ color: primaryColor, borderBottomColor: `${primaryColor}33` }}
              >
                CERTIFICATES
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
