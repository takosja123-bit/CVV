import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';
import { SkillItemRow } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, primaryColor = '#1e3a5f' }) => {
  const { personal, experiences, education, skills, projects, certifications } = data;

  return (
    <div className="bg-white text-slate-800 w-full min-h-full font-sans-ui flex flex-col shadow-sm rounded-sm overflow-hidden">
      {/* Header Banner */}
      <div 
        className="px-8 py-8 text-white flex items-center justify-between transition-colors duration-200"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-6">
          {personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={personal.fullName}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border-2 border-white/40 shadow-sm shrink-0"
            />
          )}
          <div>
            <h1 className="text-3xl font-serif-title font-semibold tracking-wide text-white">
              {personal.fullName || 'Your Name'}
            </h1>
            <p className="text-sm font-medium tracking-wider text-slate-200 mt-1 uppercase">
              {personal.jobTitle || 'Your Professional Title'}
            </p>
          </div>
        </div>

        {/* Contact info grid */}
        <div className="text-xs space-y-1.5 text-slate-200 text-right shrink-0">
          {personal.email && (
            <div className="flex items-center justify-end gap-2">
              <span>{personal.email}</span>
              <Mail className="w-3.5 h-3.5 opacity-80" />
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center justify-end gap-2">
              <span>{personal.phone}</span>
              <Phone className="w-3.5 h-3.5 opacity-80" />
            </div>
          )}
          {personal.address && (
            <div className="flex items-center justify-end gap-2">
              <span>{personal.address}</span>
              <MapPin className="w-3.5 h-3.5 opacity-80" />
            </div>
          )}
          {personal.website && (
            <div className="flex items-center justify-end gap-2">
              <span>{personal.website}</span>
              <Globe className="w-3.5 h-3.5 opacity-80" />
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Content Body */}
      <div className="p-8 grid grid-cols-12 gap-8 flex-1 bg-white">
        {/* Left main column: Profile, Experience, Projects (7 cols) */}
        <div className="col-span-8 space-y-6">
          {/* Profile / Summary */}
          {personal.summary && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase pb-1 mb-2 border-b border-slate-200">
                PROFILE
              </h2>
              <p className="text-xs leading-relaxed text-slate-700">
                {personal.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase pb-1 mb-3 border-b border-slate-200 flex items-center justify-between">
                <span>EXPERIENCE</span>
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{exp.jobTitle}</span>
                        {exp.company && (
                          <span className="text-slate-600 block font-medium">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</span>
                        )}
                      </div>
                      <span className="text-slate-500 text-[11px] font-medium shrink-0">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-1 text-xs text-slate-700 pl-3">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="list-disc list-outside text-slate-700 leading-snug">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase pb-1 mb-2 border-b border-slate-200">
                KEY PROJECTS
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{proj.title}</span>
                      {proj.link && <span className="text-[11px] text-blue-600">{proj.link}</span>}
                    </div>
                    {proj.role && <p className="text-[11px] text-slate-500 italic">{proj.role}</p>}
                    <p className="text-slate-700 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar column: Education, Skills, Certifications (4 cols) */}
        <div className="col-span-4 space-y-6 border-l border-slate-100 pl-6">
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase pb-1 mb-3 border-b border-slate-200">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-900">{edu.institution}</p>
                    <p className="text-slate-700 font-medium">{edu.degree}</p>
                    <p className="text-[11px] text-slate-500">{edu.endDate || edu.startDate}</p>
                    {edu.details && <p className="text-[11px] text-slate-600 italic mt-0.5">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase pb-1 mb-3 border-b border-slate-200">
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

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase pb-1 mb-2 border-b border-slate-200">
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
