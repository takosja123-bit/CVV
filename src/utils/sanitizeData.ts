import { CVData, SkillDisplayStyle } from '../types';
import { INITIAL_CV_DATA } from '../data/initialData';

const VALID_SKILL_STYLES: SkillDisplayStyle[] = ['segmented', 'bars', 'badges', 'stars', 'percentage', 'dots', 'tags'];

/**
 * Sanitizes and fills any missing array or object fields in raw CV data,
 * preventing 'Cannot read properties of undefined (reading map)' errors.
 */
export function sanitizeCVData(raw: unknown): CVData {
  if (!raw || typeof raw !== 'object') {
    return JSON.parse(JSON.stringify(INITIAL_CV_DATA));
  }

  const d = raw as Record<string, any>;

  return {
    personal: {
      fullName: typeof d.personal?.fullName === 'string' ? d.personal.fullName : (INITIAL_CV_DATA.personal.fullName || ''),
      jobTitle: typeof d.personal?.jobTitle === 'string' ? d.personal.jobTitle : (INITIAL_CV_DATA.personal.jobTitle || ''),
      gender: typeof d.personal?.gender === 'string' ? d.personal.gender : (INITIAL_CV_DATA.personal.gender || ''),
      birthDate: typeof d.personal?.birthDate === 'string' ? d.personal.birthDate : (INITIAL_CV_DATA.personal.birthDate || ''),
      email: typeof d.personal?.email === 'string' ? d.personal.email : (INITIAL_CV_DATA.personal.email || ''),
      phone: typeof d.personal?.phone === 'string' ? d.personal.phone : (INITIAL_CV_DATA.personal.phone || ''),
      address: typeof d.personal?.address === 'string' ? d.personal.address : (INITIAL_CV_DATA.personal.address || ''),
      website: typeof d.personal?.website === 'string' ? d.personal.website : (INITIAL_CV_DATA.personal.website || ''),
      github: typeof d.personal?.github === 'string' ? d.personal.github : (INITIAL_CV_DATA.personal.github || ''),
      linkedin: typeof d.personal?.linkedin === 'string' ? d.personal.linkedin : (INITIAL_CV_DATA.personal.linkedin || ''),
      summary: typeof d.personal?.summary === 'string' ? d.personal.summary : (INITIAL_CV_DATA.personal.summary || ''),
      photoUrl: typeof d.personal?.photoUrl === 'string' ? d.personal.photoUrl : (INITIAL_CV_DATA.personal.photoUrl || ''),
    },
    experiences: Array.isArray(d.experiences)
      ? d.experiences.map((exp: any, idx: number) => ({
          id: exp?.id || `exp-${idx}-${Date.now()}`,
          jobTitle: exp?.jobTitle || '',
          company: exp?.company || '',
          location: exp?.location || '',
          startDate: exp?.startDate || '',
          endDate: exp?.endDate || '',
          current: Boolean(exp?.current),
          bullets: Array.isArray(exp?.bullets)
            ? exp.bullets.filter((b: any) => typeof b === 'string')
            : [],
        }))
      : JSON.parse(JSON.stringify(INITIAL_CV_DATA.experiences || [])),
    education: Array.isArray(d.education)
      ? d.education.map((edu: any, idx: number) => ({
          id: edu?.id || `edu-${idx}-${Date.now()}`,
          institution: edu?.institution || '',
          degree: edu?.degree || '',
          location: edu?.location || '',
          startDate: edu?.startDate || '',
          endDate: edu?.endDate || '',
          details: edu?.details || '',
        }))
      : JSON.parse(JSON.stringify(INITIAL_CV_DATA.education || [])),
    skills: Array.isArray(d.skills)
      ? d.skills.map((skill: any) => {
          if (typeof skill === 'string') {
            return { name: skill, level: 4 };
          }
          return {
            name: skill?.name || '',
            level: typeof skill?.level === 'number' ? skill.level : 4,
          };
        })
      : JSON.parse(JSON.stringify(INITIAL_CV_DATA.skills || [])),
    languages: Array.isArray(d.languages)
      ? d.languages.map((lang: any) => {
          if (typeof lang === 'string') {
            return { name: lang, level: 4 };
          }
          return {
            name: lang?.name || '',
            level: typeof lang?.level === 'number' ? lang.level : 4,
          };
        })
      : JSON.parse(JSON.stringify(INITIAL_CV_DATA.languages || [])),
    achievements: Array.isArray(d.achievements)
      ? d.achievements.map((ach: any, idx: number) => ({
          id: ach?.id || `ach-${idx}-${Date.now()}`,
          title: ach?.title || '',
          date: ach?.date || '',
          description: ach?.description || '',
        }))
      : JSON.parse(JSON.stringify(INITIAL_CV_DATA.achievements || [])),
    references: Array.isArray(d.references)
      ? d.references.map((ref: any, idx: number) => ({
          id: ref?.id || `ref-${idx}-${Date.now()}`,
          name: ref?.name || '',
          title: ref?.title || '',
          company: ref?.company || '',
          email: ref?.email || '',
          phone: ref?.phone || '',
        }))
      : JSON.parse(JSON.stringify(INITIAL_CV_DATA.references || [])),
    projects: Array.isArray(d.projects)
      ? d.projects.map((proj: any, idx: number) => ({
          id: proj?.id || `proj-${idx}-${Date.now()}`,
          title: proj?.title || '',
          role: proj?.role || '',
          link: proj?.link || '',
          description: proj?.description || '',
        }))
      : JSON.parse(JSON.stringify(INITIAL_CV_DATA.projects || [])),
    certifications: Array.isArray(d.certifications)
      ? d.certifications.map((cert: any, idx: number) => ({
          id: cert?.id || `cert-${idx}-${Date.now()}`,
          name: cert?.name || '',
          issuer: cert?.issuer || '',
          date: cert?.date || '',
        }))
      : JSON.parse(JSON.stringify(INITIAL_CV_DATA.certifications || [])),
    skillStyle: VALID_SKILL_STYLES.includes(d.skillStyle) ? (d.skillStyle as SkillDisplayStyle) : undefined,
    style: {
      sidebarSections: Array.isArray(d.style?.sidebarSections)
        ? d.style.sidebarSections
        : (INITIAL_CV_DATA.style?.sidebarSections || ['personal', 'skills', 'languages', 'references']),
      sectionInSidebar: (d.style?.sectionInSidebar && typeof d.style.sectionInSidebar === 'object')
        ? d.style.sectionInSidebar
        : {},
      groupByInstitution: Boolean(d.style?.groupByInstitution || d.style?.groupByEmployer),
      groupByEmployer: Boolean(d.style?.groupByEmployer || d.style?.groupByInstitution),
      showLogos: d.style?.showLogos !== false,
      showIcons: d.style?.showIcons !== false && d.style?.showSectionIcons !== false,
      showSectionIcons: d.style?.showIcons !== false && d.style?.showSectionIcons !== false,
      uppercaseHeaders: d.style?.uppercaseHeaders !== false,
    },
  };
}
