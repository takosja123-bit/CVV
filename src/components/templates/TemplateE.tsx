import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { SkillItemRow, SkillMeter, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateE: React.FC<TemplateProps> = ({ data, primaryColor = '#881337' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui">
      {/* Top Burgundy Banner matching Col E */}
      <div style={{ backgroundColor: primaryColor }} className="text-white px-8 py-5 flex items-center gap-6">
        {/* Hexagon Avatar Emblem */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden shadow-md"
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            {personal.photoUrl ? (
              <img src={personal.photoUrl} alt={personal.fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-500" />
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-wide text-white uppercase">{personal.fullName || 'John Doe'}</h1>
          <div className="text-xs font-semibold text-rose-200 tracking-widest uppercase mt-0.5">
            {personal.jobTitle || 'Software Engineer'}
          </div>
        </div>
      </div>

      {/* 2-Column Body */}
      <div className="grid grid-cols-12 p-8 gap-8">
        {/* Left Column (7 cols): Profile, Experience, Education, Achievements */}
        <div className="col-span-7 space-y-6">
          {/* PROFILE */}
          {personal.summary && (
            <div className="space-y-1.5">
              <h2 className={headerClass("font-extrabold text-xs tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200")}
                  style={{ color: primaryColor }}>
                {showIcons && <User className="w-3.5 h-3.5" />} {st('Profile')}
              </h2>
              <p className="text-[10px] text-slate-600 leading-relaxed text-justify">{personal.summary}</p>
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {experiences && experiences.length > 0 && (
            <div className="space-y-3">
              <h2 className={headerClass("font-extrabold text-xs tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200")}
                  style={{ color: primaryColor }}>
                {showIcons && <Briefcase className="w-3.5 h-3.5" />} {st('Work Experience')}
              </h2>
              <div className="space-y-3.5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-bold text-slate-900 text-[10.5px]">
                      <span>{exp.jobTitle}</span>
                      <span className="text-[9px] text-slate-500 font-normal">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-rose-900">{exp.company} {exp.location ? `• ${exp.location}` : ''}</div>
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
            <div className="space-y-3">
              <h2 className={headerClass("font-extrabold text-xs tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200")}
                  style={{ color: primaryColor }}>
                {showIcons && <GraduationCap className="w-3.5 h-3.5" />} {st('Education')}
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-900 text-[10.5px]">
                      <span>{edu.institution}</span>
                      <span className="text-[9px] text-slate-500 font-normal">{edu.endDate}</span>
                    </div>
                    <div className="text-[10px] text-slate-700">{edu.degree}</div>
                    {edu.details && <p className="text-[9px] text-slate-500 italic">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("font-extrabold text-xs tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200")}
                  style={{ color: primaryColor }}>
                {showIcons && <Award className="w-3.5 h-3.5" />} {st('Achievements')}
              </h2>
              <div className="space-y-2">
                {achievements.map((ach) => (
                  <div key={ach.id} className="text-[10px]">
                    <span className="font-bold text-slate-800">{ach.title}</span> <span className="text-[9px] text-slate-500">({ach.date})</span>
                    <p className="text-[9.5px] text-slate-600">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Details, Skills (dot ratings), Languages, References */}
        <div className="col-span-5 space-y-6">
          {/* DETAILS */}
          <div className="space-y-2">
            <h2 className={headerClass("font-extrabold text-xs tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200")}
                style={{ color: primaryColor }}>
              {showIcons && <User className="w-3.5 h-3.5" />} {st('Details')}
            </h2>
            <div className="space-y-1.5 text-[10px] text-slate-600">
              {personal.gender && <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center"><User className="w-3 h-3" /></div><span>{personal.gender}</span></div>}
              {personal.birthDate && <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center"><Calendar className="w-3 h-3" /></div><span>{personal.birthDate}</span></div>}
              {personal.email && <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center"><Mail className="w-3 h-3" /></div><span className="truncate">{personal.email}</span></div>}
              {personal.phone && <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center"><Phone className="w-3 h-3" /></div><span>{personal.phone}</span></div>}
              {personal.address && <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center"><MapPin className="w-3 h-3" /></div><span>{personal.address}</span></div>}
              {personal.github && <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center"><Github className="w-3 h-3" /></div><span>{personal.github}</span></div>}
              {personal.linkedin && <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center"><Linkedin className="w-3 h-3" /></div><span>{personal.linkedin}</span></div>}
              {personal.website && <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center"><Globe className="w-3 h-3" /></div><span>{personal.website}</span></div>}
            </div>
          </div>

          {/* SKILLS */}
          {skills && skills.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("font-extrabold text-xs tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200")}
                  style={{ color: primaryColor }}>
                {showIcons && <Award className="w-3.5 h-3.5" />} {st('Skills')}
              </h2>
              <div className={data.skillStyle === 'tags' ? 'flex flex-wrap gap-1.5' : 'space-y-2'}>
                {skills.map((item, idx) => (
                  <SkillItemRow
                    key={idx}
                    item={item}
                    style={data.skillStyle || 'segmented'}
                    primaryColor={primaryColor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages && languages.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("font-extrabold text-xs tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200")}
                  style={{ color: primaryColor }}>
                {showIcons && <Globe className="w-3.5 h-3.5" />} {st('Languages')}
              </h2>
              <div className="space-y-2">
                {languages.map((lang, idx) => {
                  const { name, level } = getLanguageLevel(lang);
                  return (
                    <div key={idx} className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-700 font-medium">{name}</span>
                      <SkillMeter
                        level={level}
                        style={data.skillStyle === 'tags' ? 'segmented' : (data.skillStyle || 'segmented')}
                        activeColor={primaryColor}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* REFERENCES */}
          {references && references.length > 0 && (
            <div className="space-y-2">
              <h2 className={headerClass("font-extrabold text-xs tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200")}
                  style={{ color: primaryColor }}>
                {showIcons && <Users className="w-3.5 h-3.5" />} {st('References')}
              </h2>
              <div className="space-y-2">
                {references.map((ref) => (
                  <div key={ref.id} className="p-2 bg-rose-50/50 rounded border border-rose-100 text-[9.5px]">
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

      {/* Footer watermark matching screenshot */}
      <div className="pb-6 text-center text-[9.5px] text-slate-400 font-sans tracking-wide">
        © JobifyCV
      </div>
    </div>
  );
};
