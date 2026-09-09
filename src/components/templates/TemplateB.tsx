import React from 'react';
import { CVData, Experience, Education } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, User, Briefcase, GraduationCap, Award, Users, FolderKanban } from 'lucide-react';
import {
  DefaultAvatar,
  SkillItemRow,
  getLanguageLevel,
  SkillMeter,
  formatSectionTitle,
  CompanyLogoBadge,
  groupExperiencesByEmployer,
  groupEducationByInstitution,
} from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const TemplateB: React.FC<TemplateProps> = ({ data, primaryColor = '#1e3a5f' }) => {
  const { personal, experiences, education, skills, languages, achievements, references, projects, certifications, style } = data;

  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const isUppercase = style?.uppercaseHeaders !== false;
  const showLogos = style?.showLogos !== false;
  const isGroupByEmployer = Boolean(style?.groupByEmployer || style?.groupByInstitution);
  const isGroupByInstitution = Boolean(style?.groupByInstitution || style?.groupByEmployer);
  const sidebarOverrides = style?.sectionInSidebar || {};
  const sidebarSections = style?.sidebarSections;

  // Section renderers
  const renderProfile = () => {
    if (!personal.summary) return null;
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
          {showIcons && <User className="w-4 h-4 shrink-0" />}
          <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Profile', isUppercase)}</h2>
        </div>
        <p className="text-[10px] text-slate-600 leading-relaxed text-justify">{personal.summary}</p>
      </div>
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
          {showIcons && <Award className="w-4 h-4 shrink-0" />}
          <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Skills', isUppercase)}</h2>
        </div>
        <div className={data.skillStyle === 'tags' ? 'flex flex-wrap gap-1.5 pt-1' : 'grid grid-cols-1 gap-2'}>
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
    );
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
          {showIcons && <Globe className="w-4 h-4 shrink-0" />}
          <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Languages', isUppercase)}</h2>
        </div>
        <div className="space-y-2">
          {languages.map((lang, idx) => {
            const { name, level } = getLanguageLevel(lang);
            return (
              <div key={idx} className="flex items-center justify-between text-[10px]">
                <span className="font-medium text-slate-700">{name}</span>
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
    );
  };

  const renderAchievements = () => {
    if (!achievements || achievements.length === 0) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
          {showIcons && <Award className="w-4 h-4 shrink-0" />}
          <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Achievements', isUppercase)}</h2>
        </div>
        <div className="space-y-2.5">
          {achievements.map((ach) => (
            <div key={ach.id} className="text-[10px] space-y-0.5">
              <div className="font-bold text-slate-800">{ach.title}</div>
              <div className="text-[9px] text-slate-500 italic">{ach.date}</div>
              <p className="text-slate-600 leading-snug">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (!certifications || certifications.length === 0) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
          {showIcons && <Award className="w-4 h-4 shrink-0" />}
          <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Certifications', isUppercase)}</h2>
        </div>
        <div className="space-y-2">
          {certifications.map((c) => (
            <div key={c.id} className="text-[10px] space-y-0.5">
              <div className="font-bold text-slate-800">{c.name}</div>
              <div className="text-[9px] text-slate-500">{c.issuer} {c.date ? `• ${c.date}` : ''}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
          {showIcons && <FolderKanban className="w-4 h-4 shrink-0" />}
          <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Projects', isUppercase)}</h2>
        </div>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="relative pl-3 border-l-2 border-slate-200 space-y-0.5">
              <div className="flex items-baseline justify-between text-[10.5px]">
                <span className="font-bold text-slate-900">{proj.title}</span>
                {proj.role && <span className="text-[9px] text-slate-500">{proj.role}</span>}
              </div>
              {proj.link && <div className="text-[9px] text-indigo-600 font-medium">{proj.link}</div>}
              {proj.description && <p className="text-[9.5px] text-slate-600 leading-snug">{proj.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experiences || experiences.length === 0) return null;

    if (isGroupByEmployer) {
      const grouped = groupExperiencesByEmployer(experiences);
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
            {showIcons && <Briefcase className="w-4 h-4 shrink-0" />}
            <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Work Experience', isUppercase)}</h2>
          </div>
          <div className="space-y-4">
            {grouped.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2 border-l-2 border-slate-200 pl-3">
                <div className="flex items-center gap-2">
                  {showLogos && <CompanyLogoBadge name={group.company} size="sm" />}
                  <div>
                    <h3 className="font-bold text-[11px] text-slate-900">{group.company}</h3>
                    {group.location && <span className="text-[9px] text-slate-500">{group.location}</span>}
                  </div>
                </div>
                <div className="space-y-2.5 ml-1">
                  {group.roles.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex items-baseline justify-between text-[10px]">
                        <span className="font-semibold text-slate-800">{exp.jobTitle}</span>
                        <span className="text-[9px] text-slate-500 font-medium">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc list-outside ml-3 space-y-0.5 text-[9.5px] text-slate-600">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
          {showIcons && <Briefcase className="w-4 h-4 shrink-0" />}
          <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Work Experience', isUppercase)}</h2>
        </div>
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-3 border-l-2 border-slate-200 space-y-1">
              <div className="flex items-start justify-between text-[10.5px] gap-2">
                <div className="flex items-center gap-2">
                  {showLogos && <CompanyLogoBadge name={exp.company} logoUrl={exp.logoUrl} size="sm" />}
                  <div>
                    <span className="font-bold text-slate-900">{exp.jobTitle}</span>
                    <div className="text-[10px] font-semibold text-slate-700">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 font-medium shrink-0">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-3 space-y-0.5 text-[9.5px] text-slate-600">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return null;

    if (isGroupByInstitution) {
      const grouped = groupEducationByInstitution(education);
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
            {showIcons && <GraduationCap className="w-4 h-4 shrink-0" />}
            <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Education', isUppercase)}</h2>
          </div>
          <div className="space-y-3">
            {grouped.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5 border-l-2 border-slate-200 pl-3">
                <div className="flex items-center gap-2">
                  {showLogos && <CompanyLogoBadge name={group.institution} size="sm" />}
                  <div>
                    <h3 className="font-bold text-[10.5px] text-slate-900">{group.institution}</h3>
                    {group.location && <span className="text-[9px] text-slate-500">{group.location}</span>}
                  </div>
                </div>
                <div className="space-y-1.5 ml-1">
                  {group.degrees.map((edu) => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="flex items-baseline justify-between text-[10px]">
                        <span className="font-medium text-slate-800">{edu.degree}</span>
                        <span className="text-[9px] text-slate-500 font-medium">
                          {edu.startDate ? `${edu.startDate} - ` : ''}{edu.endDate}
                        </span>
                      </div>
                      {edu.details && <p className="text-[9px] text-slate-600 italic">{edu.details}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
          {showIcons && <GraduationCap className="w-4 h-4 shrink-0" />}
          <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('Education', isUppercase)}</h2>
        </div>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="relative pl-3 border-l-2 border-slate-200 space-y-0.5">
              <div className="flex items-start justify-between text-[10.5px] gap-2">
                <div className="flex items-center gap-2">
                  {showLogos && <CompanyLogoBadge name={edu.institution} logoUrl={edu.logoUrl} size="sm" />}
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <div className="text-[10px] font-medium text-slate-700">{edu.degree}</div>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 font-medium shrink-0">
                  {edu.startDate ? `${edu.startDate} - ` : ''}{edu.endDate}
                </span>
              </div>
              {edu.details && <p className="text-[9.5px] text-slate-600 italic">{edu.details}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReferences = () => {
    if (!references || references.length === 0) return null;
    return (
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
          {showIcons && <Users className="w-4 h-4 shrink-0" />}
          <h2 className="font-bold text-xs tracking-wider">{formatSectionTitle('References', isUppercase)}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[9.5px]">
          {references.map((ref) => (
            <div key={ref.id} className="p-2 bg-slate-50 rounded border border-slate-100 space-y-0.5">
              <div className="font-bold text-slate-900">{ref.name}</div>
              <div className="text-slate-600">{ref.title} • {ref.company}</div>
              {ref.email && <div className="text-slate-500 truncate">Email: {ref.email}</div>}
              {ref.phone && <div className="text-slate-500">Phone: {ref.phone}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Determine sidebar vs main column sections based on sidebarOverrides & sidebarSections
  const isSidebar = (key: string, defaultSidebar: boolean) => {
    if (sidebarOverrides[key] !== undefined) {
      return Boolean(sidebarOverrides[key]);
    }
    if (Array.isArray(sidebarSections)) {
      return sidebarSections.includes(key);
    }
    return defaultSidebar;
  };

  const showProfileInSidebar = isSidebar('personal', true);
  const showSkillsInSidebar = isSidebar('skills', true);
  const showLanguagesInSidebar = isSidebar('languages', true);
  const showAchievementsInSidebar = isSidebar('achievements', true);
  const showCertificationsInSidebar = isSidebar('certifications', true);
  const showProjectsInSidebar = isSidebar('projects', false);
  const showExperienceInSidebar = isSidebar('experience', false);
  const showEducationInSidebar = isSidebar('education', false);
  const showReferencesInSidebar = isSidebar('references', false);

  return (
    <div className="bg-white text-slate-800 text-[11px] leading-snug w-full min-h-full font-sans-ui">
      {/* Top Navy Header */}
      <div style={{ backgroundColor: primaryColor }} className="text-white px-8 py-6 text-center relative">
        <div className="flex justify-center mb-3">
          <DefaultAvatar photoUrl={personal.photoUrl} fullName={personal.fullName} sizeClass="w-20 h-20" />
        </div>
        <h1 className="text-2xl font-bold tracking-wide text-white uppercase">{personal.fullName || 'John Doe'}</h1>
        <div className="text-xs font-medium text-slate-200 tracking-wider uppercase mt-0.5 mb-3">
          {personal.jobTitle || 'Software Engineer'}
        </div>

        {/* Contact Info Row with Icons */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] text-slate-200 border-t border-white/20 pt-2.5 max-w-2xl mx-auto">
          {personal.gender && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-slate-300" />
              <span>{personal.gender}</span>
            </div>
          )}
          {personal.birthDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-300" />
              <span>{personal.birthDate}</span>
            </div>
          )}
          {personal.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-300" />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-300" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.address && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-300" />
              <span>{personal.address}</span>
            </div>
          )}
          {personal.github && (
            <div className="flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-300" />
              <span>{personal.github}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-slate-300" />
              <span>{personal.linkedin}</span>
            </div>
          )}
          {personal.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-300" />
              <span>{personal.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Body */}
      <div className="grid grid-cols-12 p-8 gap-8">
        {/* Left Column (5 cols) */}
        <div className="col-span-5 space-y-6">
          {showProfileInSidebar && renderProfile()}
          {showSkillsInSidebar && renderSkills()}
          {showLanguagesInSidebar && renderLanguages()}
          {showAchievementsInSidebar && renderAchievements()}
          {showCertificationsInSidebar && renderCertifications()}
          {showProjectsInSidebar && renderProjects()}
          {showExperienceInSidebar && renderExperience()}
          {showEducationInSidebar && renderEducation()}
          {showReferencesInSidebar && renderReferences()}
        </div>

        {/* Right Column (7 cols) */}
        <div className="col-span-7 space-y-6">
          {!showProfileInSidebar && renderProfile()}
          {!showExperienceInSidebar && renderExperience()}
          {!showEducationInSidebar && renderEducation()}
          {!showProjectsInSidebar && renderProjects()}
          {!showSkillsInSidebar && renderSkills()}
          {!showLanguagesInSidebar && renderLanguages()}
          {!showAchievementsInSidebar && renderAchievements()}
          {!showCertificationsInSidebar && renderCertifications()}
          {!showReferencesInSidebar && renderReferences()}
        </div>
      </div>
    </div>
  );
};
