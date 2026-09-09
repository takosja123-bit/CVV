import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Calendar,
  User,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { SkillItem, LanguageItem, SkillDisplayStyle, Experience, Education, CVStyleOptions } from '../../types';

export interface ResolvedStyleOptions {
  showIcons: boolean;
  uppercaseHeaders: boolean;
  showLogos: boolean;
  groupByEmployer: boolean;
  groupByInstitution: boolean;
  isSidebar: (sectionKey: string, defaultInSidebar?: boolean) => boolean;
  formatTitle: (title: string) => string;
}

export const resolveStyleOptions = (
  style?: CVStyleOptions,
  defaultSidebarSections: string[] = ['personal', 'skills', 'languages', 'references']
): ResolvedStyleOptions => {
  const showIcons = style?.showIcons !== false && style?.showSectionIcons !== false;
  const uppercaseHeaders = style?.uppercaseHeaders !== false;
  const showLogos = style?.showLogos !== false;
  const groupByEmployer = Boolean(style?.groupByEmployer || style?.groupByInstitution);
  const groupByInstitution = Boolean(style?.groupByInstitution || style?.groupByEmployer);

  const sidebarSections = style?.sidebarSections ?? defaultSidebarSections;
  const sectionInSidebar = style?.sectionInSidebar || {};

  const isSidebar = (sectionKey: string, defaultInSidebar = false): boolean => {
    if (sectionInSidebar[sectionKey] !== undefined) {
      return Boolean(sectionInSidebar[sectionKey]);
    }
    if (Array.isArray(sidebarSections)) {
      return sidebarSections.includes(sectionKey);
    }
    return defaultInSidebar;
  };

  const formatTitle = (title: string): string => {
    return uppercaseHeaders ? title.toUpperCase() : title;
  };

  return {
    showIcons,
    uppercaseHeaders,
    showLogos,
    groupByEmployer,
    groupByInstitution,
    isSidebar,
    formatTitle,
  };
};

export const getSkillLevel = (item: string | SkillItem): { name: string; level: number } => {
  if (typeof item === 'string') {
    return { name: item, level: 4 };
  }
  return { name: item.name, level: typeof item.level === 'number' ? item.level : 4 };
};

export const getLanguageLevel = (item: string | LanguageItem): { name: string; level: number } => {
  if (typeof item === 'string') {
    return { name: item, level: 4 };
  }
  return { name: item.name, level: typeof item.level === 'number' ? item.level : 4 };
};

export const getProficiencyLabel = (level: number): string => {
  switch (level) {
    case 5:
      return 'Expert';
    case 4:
      return 'Advanced';
    case 3:
      return 'Proficient';
    case 2:
      return 'Intermediate';
    case 1:
    default:
      return 'Beginner';
  }
};

export const getProficiencyPercent = (level: number, max = 5): number => {
  return Math.min(100, Math.max(15, Math.round((level / max) * 100)));
};

/**
 * 1. Segmented Bar Rating (■ ■ ■ ■ □) - Modern discrete micro-capsules
 */
export const SegmentedRating: React.FC<{
  level: number;
  max?: number;
  activeColor?: string; // hex or tailwind
  inactiveColor?: string;
}> = ({ level, max = 5, activeColor, inactiveColor }) => {
  const isHexActive = activeColor && activeColor.startsWith('#');
  const isHexInactive = inactiveColor && inactiveColor.startsWith('#');

  return (
    <div className="flex items-center gap-1 shrink-0">
      {Array.from({ length: max }).map((_, i) => {
        const isActive = i < level;
        return (
          <span
            key={i}
            className={`w-3.5 h-1.5 rounded-xs transition-all ${
              !isHexActive && isActive ? (activeColor || 'bg-slate-800') : ''
            } ${
              !isHexInactive && !isActive ? (inactiveColor || 'bg-slate-200') : ''
            }`}
            style={{
              backgroundColor: isActive
                ? (isHexActive ? activeColor : undefined)
                : (isHexInactive ? inactiveColor : undefined),
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * 2. Continuous Sleek Progress Bar Rating
 */
export const BarRating: React.FC<{
  level: number;
  max?: number;
  fillColor?: string;
  bgColor?: string;
  heightClass?: string;
  showPercent?: boolean;
}> = ({
  level,
  max = 5,
  fillColor = '#1e293b',
  bgColor = '#e2e8f0',
  heightClass = 'h-1.5',
  showPercent = false,
}) => {
  const percent = getProficiencyPercent(level, max);
  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className={`flex-1 ${heightClass} rounded-full overflow-hidden`}
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: fillColor }}
        />
      </div>
      {showPercent && (
        <span className="text-[9px] font-bold text-slate-400 shrink-0">
          {percent}%
        </span>
      )}
    </div>
  );
};

/**
 * 3. Star Rating (5 Crisp Micro-Stars)
 */
export const StarRating: React.FC<{
  level: number;
  max?: number;
  activeColor?: string;
  inactiveColor?: string;
}> = ({ level, max = 5, activeColor = '#d97706', inactiveColor = '#e2e8f0' }) => {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {Array.from({ length: max }).map((_, i) => {
        const isActive = i < level;
        return (
          <Star
            key={i}
            className="w-2.5 h-2.5"
            fill={isActive ? activeColor : 'none'}
            stroke={isActive ? activeColor : inactiveColor}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
};

/**
 * 4. Micro-Dot Rating (Classic Refined Dots)
 */
export const DotRating: React.FC<{
  level: number;
  max?: number;
  activeColor?: string;
  inactiveColor?: string;
}> = ({ level, max = 5, activeColor = 'bg-slate-800', inactiveColor = 'bg-slate-200' }) => {
  const isHexActive = activeColor && activeColor.startsWith('#');
  const isHexInactive = inactiveColor && inactiveColor.startsWith('#');

  return (
    <div className="flex items-center gap-1 shrink-0">
      {Array.from({ length: max }).map((_, i) => {
        const isActive = i < level;
        return (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              !isHexActive && isActive ? activeColor : ''
            } ${!isHexInactive && !isActive ? inactiveColor : ''}`}
            style={{
              backgroundColor: isActive
                ? (isHexActive ? activeColor : undefined)
                : (isHexInactive ? inactiveColor : undefined),
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * 5. Modern Percentage Pill / Meter
 */
export const PercentageRating: React.FC<{
  level: number;
  max?: number;
  fillColor?: string;
  textColor?: string;
}> = ({ level, max = 5, fillColor = '#1e293b', textColor }) => {
  const percent = getProficiencyPercent(level, max);
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="w-10 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: fillColor }}
        />
      </div>
      <span
        className="text-[9px] font-bold"
        style={{ color: textColor || fillColor }}
      >
        {percent}%
      </span>
    </div>
  );
};

/**
 * Master Skill Meter Component
 * Renders the skill rating using the requested or global style
 */
export const SkillMeter: React.FC<{
  level: number;
  style?: SkillDisplayStyle;
  activeColor?: string;
  inactiveColor?: string;
  isDark?: boolean;
}> = ({
  level,
  style = 'segmented',
  activeColor,
  inactiveColor,
  isDark = false,
}) => {
  const defaultActive = isDark ? '#ffffff' : (activeColor || '#1e293b');
  const defaultInactive = isDark ? 'rgba(255,255,255,0.25)' : (inactiveColor || '#e2e8f0');

  switch (style) {
    case 'bars':
      return (
        <BarRating
          level={level}
          fillColor={defaultActive}
          bgColor={defaultInactive}
        />
      );

    case 'stars':
      return (
        <StarRating
          level={level}
          activeColor={defaultActive}
          inactiveColor={defaultInactive}
        />
      );

    case 'percentage':
      return (
        <PercentageRating
          level={level}
          fillColor={defaultActive}
          textColor={defaultActive}
        />
      );

    case 'dots':
      return (
        <DotRating
          level={level}
          activeColor={defaultActive}
          inactiveColor={defaultInactive}
        />
      );

    case 'badges':
      return (
        <span
          className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full tracking-wide ${
            isDark ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}
          style={!isDark && activeColor ? { color: activeColor, backgroundColor: `${activeColor}15` } : undefined}
        >
          {getProficiencyLabel(level)}
        </span>
      );

    case 'tags':
      return null; // Tags only render the pill chip without meter

    case 'segmented':
    default:
      return (
        <SegmentedRating
          level={level}
          activeColor={defaultActive}
          inactiveColor={defaultInactive}
        />
      );
  }
};

/**
 * Unified Skill Item Row / Chip
 * Formats a single skill cleanly depending on whether it's a row, badge, or chip
 */
export const SkillItemRow: React.FC<{
  item: string | SkillItem;
  style?: SkillDisplayStyle;
  primaryColor?: string;
  textColor?: string;
  isDark?: boolean;
  compact?: boolean;
}> = ({
  item,
  style = 'segmented',
  primaryColor,
  textColor,
  isDark = false,
  compact = false,
}) => {
  const { name, level } = getSkillLevel(item);

  // If style is 'tags', render clean minimal ATS-friendly badge
  if (style === 'tags') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
          isDark
            ? 'bg-white/10 text-white border border-white/15'
            : 'bg-slate-100/90 text-slate-800 border border-slate-200/80'
        }`}
      >
        {name}
      </span>
    );
  }

  // If style is 'badges', render name with level pill
  if (style === 'badges') {
    return (
      <div
        className={`flex items-center justify-between px-2 py-1 rounded-md text-[10px] font-medium border ${
          isDark
            ? 'bg-white/5 border-white/15 text-white'
            : 'bg-slate-50/90 border-slate-200/90 text-slate-800'
        }`}
      >
        <span className="font-semibold truncate pr-2">{name}</span>
        <span
          className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
            isDark ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}
          style={!isDark && primaryColor ? { color: primaryColor, backgroundColor: `${primaryColor}18` } : undefined}
        >
          {getProficiencyLabel(level)}
        </span>
      </div>
    );
  }

  // For bars style
  if (style === 'bars') {
    return (
      <div className="space-y-0.5 w-full">
        <div className="flex items-center justify-between text-[10px]">
          <span
            className="font-medium truncate"
            style={{ color: textColor || (isDark ? '#ffffff' : '#334155') }}
          >
            {name}
          </span>
          <span className="text-[8.5px] text-slate-400 font-medium ml-1">
            {getProficiencyLabel(level)}
          </span>
        </div>
        <BarRating
          level={level}
          fillColor={primaryColor || (isDark ? '#ffffff' : '#1e293b')}
          bgColor={isDark ? 'rgba(255,255,255,0.2)' : '#e2e8f0'}
        />
      </div>
    );
  }

  // Standard row (segmented, stars, dots, percentage)
  return (
    <div className={`flex items-center justify-between text-[10px] ${compact ? 'gap-1' : 'gap-2'}`}>
      <span
        className="font-medium truncate"
        style={{ color: textColor || (isDark ? '#f1f5f9' : '#334155') }}
      >
        {name}
      </span>
      <SkillMeter
        level={level}
        style={style}
        activeColor={primaryColor}
        isDark={isDark}
      />
    </div>
  );
};

export const DefaultAvatar: React.FC<{
  photoUrl?: string;
  fullName?: string;
  sizeClass?: string;
  shape?: 'circle' | 'square' | 'hexagon';
  borderColor?: string;
}> = ({
  photoUrl,
  fullName = 'John Doe',
  sizeClass = 'w-24 h-24',
  shape = 'circle',
  borderColor = 'border-white',
}) => {
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={fullName}
        className={`${sizeClass} ${
          shape === 'circle' ? 'rounded-full' : 'rounded-lg'
        } object-cover border-2 ${borderColor} shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${
        shape === 'circle' ? 'rounded-full' : 'rounded-lg'
      } bg-slate-300 border-2 ${borderColor} flex items-center justify-center text-slate-600 font-bold text-lg shadow-sm`}
    >
      <User className="w-1/2 h-1/2 text-slate-500" />
    </div>
  );
};

export const formatSectionTitle = (title: string, uppercase = true): string => {
  return uppercase ? title.toUpperCase() : title;
};

export const CompanyLogoBadge: React.FC<{
  name?: string;
  logoUrl?: string;
  sizeClass?: string;
  type?: 'company' | 'institution';
}> = ({ name = '', logoUrl, sizeClass = 'w-6 h-6', type = 'company' }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || (type === 'company' ? 'CO' : 'ED');

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={`${sizeClass} rounded-md object-contain bg-white border border-slate-200 shrink-0 shadow-2xs`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-md bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/80 text-slate-700 font-bold flex items-center justify-center text-[9px] shrink-0 select-none shadow-2xs tracking-tighter`}
      title={name}
    >
      {initials}
    </div>
  );
};

export interface GroupedExperience {
  company: string;
  location?: string;
  roles: Experience[];
}

export const groupExperiencesByEmployer = (experiences: Experience[]): GroupedExperience[] => {
  const map = new Map<string, GroupedExperience>();
  for (const exp of experiences) {
    const key = (exp.company || 'Other').trim().toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        company: exp.company || 'Company',
        location: exp.location,
        roles: [],
      });
    }
    const group = map.get(key)!;
    group.roles.push(exp);
    if (!group.location && exp.location) {
      group.location = exp.location;
    }
  }
  return Array.from(map.values());
};

export interface GroupedEducation {
  institution: string;
  location?: string;
  degrees: Education[];
}

export const groupEducationByInstitution = (education: Education[]): GroupedEducation[] => {
  const map = new Map<string, GroupedEducation>();
  for (const edu of education) {
    const key = (edu.institution || 'Other').trim().toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        institution: edu.institution || 'Institution',
        location: edu.location,
        degrees: [],
      });
    }
    const group = map.get(key)!;
    group.degrees.push(edu);
    if (!group.location && edu.location) {
      group.location = edu.location;
    }
  }
  return Array.from(map.values());
};

