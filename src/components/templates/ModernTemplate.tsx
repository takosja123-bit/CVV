import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { SkillItemRow } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, primaryColor = '#0f172a' }) => {
  const { personal, experiences, education, skills, projects, certifications } = data;

  return (
    <div className="bg-white text-slate-800 w-full min-h-full font-sans-ui flex shadow-sm rounded-sm overflow-hidden">
      {/* Left Sidebar (35% width) */}
      <div 
        className="w-[35%] p-6 text-slate-100 flex flex-col justify-between space-y-6"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="space-y-6">
          {/* Avatar & Monogram */}
          <div className="text-center pt-2">
            {personal.photoUrl ? (
              <img
                src={personal.photoUrl}
                alt={personal.fullName}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-white/30 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-2xl font-bold text-white">
                {personal.fullName ? personal.fullName.charAt(0) : 'CV'}
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 text-xs text-slate-300">
            <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-white/10 pb-1">
              CONTACT
            </h3>
            {personal.email && (
              <div className="flex items-start gap-2 break-all">
                <Mail className="w-3.5 h-3.5 mt-0.5 text-blue-400 shrink-0" />
                <span>{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-blue-400 shrink-0" />
                <span>{personal.address}</span>
              </div>
            )}
            {personal.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{personal.website}</span>
              </div>
            )}
          </div>

          {/* Education in Sidebar */}
          {education.length > 0 && (
            <div className="space-y-3 text-xs">
              <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-white/10 pb-1">
                EDUCATION
              </h3>
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <p className="font-semibold text-white">{edu.institution}</p>
                  <p className="text-slate-300">{edu.degree}</p>
                  <p className="text-[10px] text-slate-400">{edu.endDate || edu.startDate}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills in Sidebar */}
          {skills && skills.length > 0 && (
            <div className="space-y-2 text-xs">
              <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-white/10 pb-1">
                SKILLS & EXPERTISE
              </h3>
              <div className={data.skillStyle === 'tags' || data.skillStyle === 'badges' ? 'flex flex-wrap gap-1.5 pt-1' : 'space-y-2 pt-1'}>
                {skills.map((skill, index) => (
                  <SkillItemRow
                    key={index}
                    item={skill}
                    style={data.skillStyle || 'badges'}
                    isDark={true}
                    primaryColor="#38bdf8"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {certifications && certifications.length > 0 && (
          <div className="text-xs space-y-1.5 pt-2 border-t border-white/10">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              CERTIFICATIONS
            </h3>
            {certifications.map((cert) => (
              <p key={cert.id} className="text-[11px] text-slate-300">
                • {cert.name}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Body (65% width) */}
      <div className="w-[65%] p-8 flex flex-col space-y-6 bg-white">
        {/* Name & Title Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif-title">
            {personal.fullName || 'Your Name'}
          </h1>
          <p className="text-sm font-semibold tracking-wider text-blue-600 mt-1 uppercase">
            {personal.jobTitle || 'Your Professional Title'}
          </p>
        </div>

        {/* Profile Summary */}
        {personal.summary && (
          <div>
            <h2 className="text-xs font-bold tracking-widest text-slate-900 uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              ABOUT ME
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">
              {personal.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-widest text-slate-900 uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              WORK EXPERIENCE
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1 relative pl-3 border-l-2 border-slate-200">
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{exp.jobTitle}</span>
                      <span className="text-slate-600 block font-medium">{exp.company}</span>
                    </div>
                    <span className="text-slate-500 text-[11px] font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1 text-xs text-slate-700 pt-1">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="list-disc list-inside leading-snug">
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
            <h2 className="text-xs font-bold tracking-widest text-slate-900 uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              KEY PROJECTS
            </h2>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs">
                  <div className="font-semibold text-slate-900">{proj.title}</div>
                  <p className="text-slate-700 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
