import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { DefaultAvatar, SkillItemRow, SkillMeter, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateK: React.FC<TemplateProps> = ({ data, primaryColor = '#1d4ed8' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui grid grid-cols-12">
      {/* Left Column (5 cols): Blue Boxed Modules matching Column K */}
      <div className="col-span-5 p-6 border-r border-slate-200 space-y-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <DefaultAvatar photoUrl={personal.photoUrl} fullName={personal.fullName} sizeClass="w-24 h-24" borderColor="border-blue-600" />
          </div>
          <h1 className="text-xl font-black text-blue-900 uppercase tracking-wide">{personal.fullName || 'John Doe'}</h1>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            {personal.jobTitle || 'SOFTWARE ENGINEER'}
          </div>
        </div>

        {/* ABOUT ME box */}
        {personal.summary && (
          <div className="border border-blue-200 rounded overflow-hidden">
            <div className={headerClass("bg-blue-600 text-white font-bold text-xs px-3 py-1 tracking-wider")}>
              {st('About Me')}
            </div>
            <div className="p-2.5 bg-blue-50/30 text-[10px] text-slate-600 leading-relaxed text-justify">
              {personal.summary}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {skills && skills.length > 0 && (
          <div className="border border-blue-200 rounded overflow-hidden">
            <div className={headerClass("bg-blue-600 text-white font-bold text-xs  px-3 py-1 tracking-wider")}>
              {st('Skills')}
            </div>
            <div className={data.skillStyle === 'tags' ? 'p-2.5 bg-blue-50/30 flex flex-wrap gap-1.5' : 'p-2.5 bg-blue-50/30 space-y-2'}>
              {skills.map((item, idx) => (
                <SkillItemRow
                  key={idx}
                  item={item}
                  style={data.skillStyle || 'bars'}
                  primaryColor="#1d4ed8"
                />
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        {languages && languages.length > 0 && (
          <div className="border border-blue-200 rounded overflow-hidden">
            <div className={headerClass("bg-blue-600 text-white font-bold text-xs  px-3 py-1 tracking-wider")}>
              {st('Languages')}
            </div>
            <div className="p-2.5 bg-blue-50/30 space-y-2">
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <div key={idx} className="space-y-0.5">
                    <div className="text-[10px] font-medium text-slate-700">{name}</div>
                    <SkillMeter
                      level={level}
                      style={data.skillStyle || 'bars'}
                      activeColor="#1d4ed8"
                      inactiveColor="#dbeafe"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTACT ME box matching Column K */}
        <div className="border border-blue-200 rounded overflow-hidden">
          <div className={headerClass("bg-blue-600 text-white font-bold text-xs px-3 py-1 tracking-wider")}>
            {st('Contact Me')}
          </div>
          <div className="p-2.5 bg-blue-50/30 space-y-1.5 text-[10px] text-slate-600">
            {personal.gender && <div className="flex items-center gap-1.5"><User className="w-3 h-3 text-blue-600" /><span>{personal.gender}</span></div>}
            {personal.birthDate && <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-blue-600" /><span>{personal.birthDate}</span></div>}
            {personal.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-blue-600" /><span className="truncate">{personal.email}</span></div>}
            {personal.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-blue-600" /><span>{personal.phone}</span></div>}
            {personal.address && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-blue-600" /><span>{personal.address}</span></div>}
            {personal.github && <div className="flex items-center gap-1.5"><Github className="w-3 h-3 text-blue-600" /><span>{personal.github}</span></div>}
            {personal.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 text-blue-600" /><span>{personal.linkedin}</span></div>}
            {personal.website && <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-blue-600" /><span>{personal.website}</span></div>}
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        {achievements && achievements.length > 0 && (
          <div className="border border-blue-200 rounded overflow-hidden">
            <div className={headerClass("bg-blue-600 text-white font-bold text-xs  px-3 py-1 tracking-wider")}>
              {st('Achievements')}
            </div>
            <div className="p-2.5 bg-blue-50/30 space-y-2 text-[9.5px]">
              {achievements.map((ach) => (
                <div key={ach.id}>
                  <div className="font-bold text-blue-900">{ach.title}</div>
                  <p className="text-slate-600">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (7 cols): Blue Connected Vertical Timeline Track */}
      <div className="col-span-7 p-7 space-y-7">
        {/* WORK EXPERIENCE */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-4">
            <div className="border border-blue-600 rounded">
              <div className={headerClass("bg-blue-600 text-white font-bold text-xs  px-4 py-1.5 tracking-wider")}>
                {st('Work Experience')}
              </div>
            </div>

            {/* Continuous Blue Line with Blue Nodes */}
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-600">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative space-y-1">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="text-[10px] font-bold text-blue-700">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{exp.jobTitle}</div>
                    <div className="text-[10px] text-slate-600 font-medium">{exp.company} • {exp.location}</div>
                  </div>
                  {exp.bullets && (
                    <ul className="list-disc ml-3.5 text-[9.5px] text-slate-600 space-y-0.5 pt-0.5">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <div className="space-y-4">
            <div className="border border-blue-600 rounded">
              <div className={headerClass("bg-blue-600 text-white font-bold text-xs  px-4 py-1.5 tracking-wider")}>
                {st('Education')}
              </div>
            </div>

            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-600">
              {education.map((edu) => (
                <div key={edu.id} className="relative space-y-0.5">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="text-[10px] font-bold text-blue-700">{edu.endDate}</div>
                  <div className="font-bold text-xs text-slate-900">{edu.institution}</div>
                  <div className="text-[10px] text-slate-600">{edu.degree}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REFERENCES */}
        {references && references.length > 0 && (
          <div className="space-y-3">
            <div className="border border-blue-600 rounded">
              <div className={headerClass("bg-blue-600 text-white font-bold text-xs  px-4 py-1.5 tracking-wider")}>
                {st('References')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[9.5px]">
              {references.map((ref) => (
                <div key={ref.id} className="p-2.5 bg-blue-50/40 rounded border border-blue-100">
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="text-slate-600">{ref.title} • {ref.company}</div>
                  <div className="text-slate-500">{ref.phone}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
