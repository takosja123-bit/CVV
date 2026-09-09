import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { DefaultAvatar, SkillItemRow, getLanguageLevel, SkillMeter } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateC: React.FC<TemplateProps> = ({ data, primaryColor = '#3a352f' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, style } = data;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const headerClass = (base: string) => uppercaseHeaders ? `${base} uppercase` : base;

  return (
    <div className="bg-[#FAF8F5] text-[#2B2723] text-[11px] leading-snug w-full min-h-full font-serif p-7 border-12 border-[#DCD6CD] shadow-inner relative">
      {/* Subtle textured inner frame */}
      <div className="border border-[#BFB7A8] p-6 bg-white shadow-xs space-y-6">
        {/* Header matching Col C: Left Info, Right Avatar */}
        <div className="flex items-start justify-between border-b-2 border-[#D5CDBD] pb-4">
          <div className="space-y-1.5 flex-1 pr-4">
            <h1 className="text-2xl font-bold tracking-wide text-[#2B2723] uppercase font-sans">
              {personal.fullName || 'John Doe'}
            </h1>
            <div className="text-xs font-semibold text-[#665D52] tracking-wider uppercase font-sans">
              {personal.jobTitle || 'Software Engineer'}
            </div>

            {/* Contact metadata */}
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[10px] text-[#635B4F] pt-1 font-sans">
              {personal.gender && <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#8A7F6E]" /> {personal.gender}</span>}
              {personal.birthDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#8A7F6E]" /> {personal.birthDate}</span>}
              {personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#8A7F6E]" /> {personal.email}</span>}
              {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#8A7F6E]" /> {personal.phone}</span>}
              {personal.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#8A7F6E]" /> {personal.address}</span>}
              {personal.github && <span className="flex items-center gap-1"><Github className="w-3 h-3 text-[#8A7F6E]" /> {personal.github}</span>}
              {personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-[#8A7F6E]" /> {personal.linkedin}</span>}
              {personal.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-[#8A7F6E]" /> {personal.website}</span>}
            </div>
          </div>

          <div className="shrink-0">
            <DefaultAvatar photoUrl={personal.photoUrl} fullName={personal.fullName} sizeClass="w-20 h-20" borderColor="border-[#D5CDBD]" />
          </div>
        </div>

        {/* Profile */}
        {personal.summary && (
          <div className="space-y-1">
            <div className={headerClass("flex items-center gap-1.5 text-[#3a352f] font-sans font-bold text-xs border-b border-[#E8E3DA] pb-0.5")}>
              {showIcons && <User className="w-3.5 h-3.5" />}
              <span>Profile</span>
            </div>
            <p className="text-[10px] text-[#4A433A] leading-relaxed text-justify">{personal.summary}</p>
          </div>
        )}

        {/* Experience & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience */}
          <div className="space-y-3">
            <div className={headerClass("flex items-center gap-1.5 text-[#3a352f] font-sans font-bold text-xs border-b border-[#E8E3DA] pb-0.5")}>
              {showIcons && <Briefcase className="w-3.5 h-3.5" />}
              <span>Work Experience</span>
            </div>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-[10px] space-y-0.5 font-sans">
                  <div className="flex justify-between font-bold text-[#2B2723]">
                    <span>{exp.jobTitle}</span>
                    <span className="text-[9px] text-[#7A7163] font-normal">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[#5C5449] font-medium">{exp.company} {exp.location ? `• ${exp.location}` : ''}</div>
                  {exp.bullets && (
                    <ul className="list-disc ml-3.5 text-[9.5px] text-[#4A433A] space-y-0.5">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <div className={headerClass("flex items-center gap-1.5 text-[#3a352f] font-sans font-bold text-xs border-b border-[#E8E3DA] pb-0.5")}>
              {showIcons && <GraduationCap className="w-3.5 h-3.5" />}
              <span>Education</span>
            </div>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-[10px] space-y-0.5 font-sans">
                  <div className="flex justify-between font-bold text-[#2B2723]">
                    <span>{edu.institution}</span>
                    <span className="text-[9px] text-[#7A7163] font-normal">{edu.endDate}</span>
                  </div>
                  <div className="text-[#5C5449]">{edu.degree}</div>
                  {edu.details && <p className="text-[9px] text-[#635B4F] italic">{edu.details}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills & Languages */}
        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-[#E8E3DA]">
          <div>
            <div className={headerClass("flex items-center gap-1.5 text-[#3a352f] font-sans font-bold text-xs mb-2")}>
              {showIcons && <Award className="w-3.5 h-3.5" />}
              <span>Skills</span>
            </div>
            <div className={data.skillStyle === 'tags' ? 'flex flex-wrap gap-1.5' : 'grid grid-cols-1 gap-2'}>
              {skills.map((item, idx) => (
                <SkillItemRow
                  key={idx}
                  item={item}
                  style={data.skillStyle || 'segmented'}
                  primaryColor="#6B5E4D"
                  textColor="#2B2723"
                />
              ))}
            </div>
          </div>

          <div>
            <div className={headerClass("flex items-center gap-1.5 text-[#3a352f] font-sans font-bold text-xs mb-2")}>
              {showIcons && <Globe className="w-3.5 h-3.5" />}
              <span>Languages</span>
            </div>
            <div className="space-y-2">
              {languages.map((lang, idx) => {
                const { name, level } = getLanguageLevel(lang);
                return (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-sans">
                    <span className="text-[#3a352f] font-medium">{name}</span>
                    <SkillMeter
                      level={level}
                      style={data.skillStyle === 'tags' ? 'segmented' : (data.skillStyle || 'segmented')}
                      activeColor="#6B5E4D"
                      inactiveColor="#E5DFD5"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements & References */}
        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-[#E8E3DA]">
          {achievements.length > 0 && (
            <div className="space-y-2">
              <div className={headerClass("font-sans font-bold text-xs text-[#3a352f]")}>Achievements</div>
              {achievements.map((ach) => (
                <div key={ach.id} className="text-[10px] font-sans">
                  <div className="font-bold text-[#2B2723]">{ach.title} <span className="text-[9px] text-[#7A7163]">({ach.date})</span></div>
                  <p className="text-[9.5px] text-[#4A433A]">{ach.description}</p>
                </div>
              ))}
            </div>
          )}

          {references.length > 0 && (
            <div className="space-y-2">
              <div className={headerClass("font-sans font-bold text-xs text-[#3a352f]")}>References</div>
              <div className="grid grid-cols-2 gap-2">
                {references.map((ref) => (
                  <div key={ref.id} className="text-[9.5px] font-sans">
                    <div className="font-bold text-[#2B2723]">{ref.name}</div>
                    <div className="text-[#635B4F]">{ref.title} • {ref.company}</div>
                    <div className="text-[9px] text-[#7A7163]">{ref.phone}</div>
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
