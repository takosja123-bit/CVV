import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { DefaultAvatar, SkillItemRow, SkillMeter, getLanguageLevel } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateD: React.FC<TemplateProps> = ({ data, primaryColor = '#475569' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;
  const st = (s: string) => uppercaseHeaders ? s.toUpperCase() : s;

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui grid grid-cols-12">
      {/* Left Slate-Blue Sidebar (Col D) */}
      <div style={{ backgroundColor: primaryColor }} className="col-span-5 text-white p-7 space-y-5">
        <div className="text-center space-y-2.5">
          <h1 className="text-xl font-black uppercase tracking-wider text-white">{personal.fullName || 'John Doe'}</h1>
          <div className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
            {personal.jobTitle || 'Software Engineer'}
          </div>
          <div className="flex justify-center pt-1">
            <DefaultAvatar photoUrl={personal.photoUrl} fullName={personal.fullName} sizeClass="w-24 h-24" />
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-2 pt-2 border-t border-white/20">
          <h2 className={headerClass("text-xs font-bold tracking-wider text-slate-100 flex items-center gap-1.5")}>
            {showIcons && <User className="w-3.5 h-3.5" />} {st('Details')}
          </h2>
          <div className="space-y-1.5 text-[10px] text-slate-200">
            {personal.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-slate-300 shrink-0" />
                <span className="truncate">{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-300 shrink-0" />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.address && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                <span>{personal.address}</span>
              </div>
            )}
            {personal.github && (
              <div className="flex items-center gap-1.5">
                <Github className="w-3 h-3 text-slate-300 shrink-0" />
                <span className="underline">{personal.github}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin className="w-3 h-3 text-slate-300 shrink-0" />
                <span className="underline">{personal.linkedin}</span>
              </div>
            )}
            {personal.website && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-slate-300 shrink-0" />
                <span className="underline">{personal.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* PROFILE */}
        {personal.summary && (
          <div className="space-y-1.5 pt-2 border-t border-white/20">
            <h2 className={headerClass("text-xs font-bold tracking-wider text-slate-100 flex items-center gap-1.5")}>
              {showIcons && <User className="w-3.5 h-3.5" />} {st('Profile')}
            </h2>
            <p className="text-[10px] text-slate-200 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* SKILLS */}
        {skills && skills.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/20">
            <h2 className={headerClass("text-xs font-bold tracking-wider text-slate-100 flex items-center gap-1.5")}>
              {showIcons && <Award className="w-3.5 h-3.5" />} {st('Skills')}
            </h2>
            <div className={data.skillStyle === 'tags' ? 'flex flex-wrap gap-1.5' : 'space-y-2'}>
              {skills.map((item, idx) => (
                <SkillItemRow
                  key={idx}
                  item={item}
                  style={data.skillStyle || 'bars'}
                  isDark={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        {languages && languages.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/20">
            <h2 className={headerClass("text-xs font-bold tracking-wider text-slate-100 flex items-center gap-1.5")}>
              {showIcons && <Globe className="w-3.5 h-3.5" />} {st('Languages')}
            </h2>
            <div className="space-y-2">
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <div key={idx} className="space-y-0.5">
                    <div className="text-[10px] font-medium text-slate-200">{name}</div>
                    <SkillMeter
                      level={level}
                      style={data.skillStyle || 'bars'}
                      isDark={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REFERENCES */}
        {references && references.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-white/20">
            <h2 className={headerClass("text-xs font-bold tracking-wider text-slate-100 flex items-center gap-1.5")}>
              {showIcons && <Users className="w-3.5 h-3.5" />} {st('References')}
            </h2>
            <div className="space-y-2 text-[9.5px] text-slate-200">
              {references.map((ref) => (
                <div key={ref.id}>
                  <div className="font-bold text-white">{ref.name}</div>
                  <div>{ref.title} • {ref.company}</div>
                  {ref.phone && <div>Phone: {ref.phone}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content Column (7 cols) */}
      <div className="col-span-7 p-7 space-y-6">
        {/* WORK EXPERIENCE */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
              {showIcons && <Briefcase className="w-4 h-4" />}
              <h2 className={headerClass("font-extrabold text-xs tracking-wider")}>{st('Work Experience')}</h2>
            </div>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{exp.jobTitle}</span>
                      <div className="text-[10px] font-semibold text-slate-700">{exp.company} {exp.location ? `• ${exp.location}` : ''}</div>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets && (
                    <ul className="list-disc ml-4 text-[10px] text-slate-600 space-y-1 pt-0.5">
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
            <div className="flex items-center gap-2 pb-1 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
              {showIcons && <GraduationCap className="w-4 h-4" />}
              <h2 className={headerClass("font-extrabold text-xs tracking-wider")}>{st('Education')}</h2>
            </div>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-xs text-slate-900">{edu.institution}</span>
                    <span className="text-[9.5px] font-semibold text-slate-500">{edu.endDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-700 font-medium">{edu.degree}</div>
                  {edu.details && <p className="text-[9.5px] text-slate-600 italic">{edu.details}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {achievements && achievements.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
              {showIcons && <Award className="w-4 h-4" />}
              <h2 className={headerClass("font-extrabold text-xs tracking-wider")}>{st('Achievements')}</h2>
            </div>
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900">{ach.title}</div>
                  <div className="text-[9px] text-slate-500 italic">{ach.date}</div>
                  <p className="text-[10px] text-slate-600 leading-snug">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
