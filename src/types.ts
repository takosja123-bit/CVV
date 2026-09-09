export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  gender?: string;
  birthDate?: string;
  github?: string;
  linkedin?: string;
  summary: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location?: string;
  startDate?: string;
  endDate: string;
  details?: string;
}

export interface SkillItem {
  name: string;
  level: number; // 1 to 5
}

export interface LanguageItem {
  name: string;
  level: number; // 1 to 5
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface Project {
  id: string;
  title: string;
  role?: string;
  link?: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export type SkillDisplayStyle =
  | 'segmented'   // Segmented modern pill bars (■ ■ ■ ■ □)
  | 'bars'        // Sleek horizontal progress bar with rounded cap
  | 'badges'      // Modern tags with proficiency level (e.g. Expert, Advanced)
  | 'stars'       // Refined star ratings
  | 'percentage'  // Numerical percentage with mini-bar
  | 'dots'        // Refined micro-dots
  | 'tags';       // Clean minimalist chips without score

export interface CVStyleOptions {
  sidebarSections?: string[]; // Section keys rendered in the sidebar column: 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'projects' | 'certifications' | 'achievements' | 'references'
  sectionInSidebar?: Record<string, boolean>; // Map of sectionKey -> boolean
  groupByInstitution?: boolean; // Groups multiple experiences or education entries under one company / school name
  groupByEmployer?: boolean; // Alias for groupByInstitution for employers
  showLogos?: boolean; // Displays small company/institution logo image/badge next to each entry
  showIcons?: boolean; // Toggles icon next to section titles
  showSectionIcons?: boolean; // Alias for showIcons
  uppercaseHeaders?: boolean; // Toggles section titles between uppercase and standard case
}

export interface CVData {
  personal: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: (string | SkillItem)[];
  languages: LanguageItem[];
  achievements: Achievement[];
  references: Reference[];
  projects: Project[];
  certifications: Certification[];
  skillStyle?: SkillDisplayStyle;
  style?: CVStyleOptions;
}

export type TemplateId =
  | 'template-ats-classic' // 100% ATS Single Column Harvard
  | 'template-ats-modern'  // 100% ATS Modern Sans-Serif
  | 'template-ats-executive' // 100% ATS Executive Formal
  | 'template-b' // Classic Navy Banner (Col B)
  | 'template-c' // Vintage Frame (Col C)
  | 'template-d' // Slate Split Sidebar (Col D)
  | 'template-e' // Burgundy Hexagon (Col E)
  | 'template-f' // Emerald Gold Timeline (Col F)
  | 'template-g' // Golden Minimalist (Col G)
  | 'template-h' // Nature Forest Sidebar (Col H)
  | 'template-i' // Cyan Double Border (Col I)
  | 'template-j' // Rose Blossom Header (Col J)
  | 'template-k' // Royal Blue Timeline (Col K)
  | 'template-l' // Coral Navy Split (Col L)
  | 'template-m' // Ocean Teal Pro (Col M)
  | 'template-black-badge' // Sam Hill Archetype
  | 'template-teal-grid'   // Peter Madison Archetype
  | 'template-sage-sidebar'// Joanna Brown Archetype
  // Legacy aliases for backward compatibility
  | 'classic'
  | 'modern'
  | 'teal'
  | 'red'
  | 'executive'
  | 'minimalist';

export type PlanTier = 'Free Plan' | 'Basic Plan' | 'Pro Plan' | 'Premium Plan';

export interface TemplateConfig {
  id: TemplateId;
  columnKey: string;
  name: string;
  badge: string;
  planTier: PlanTier;
  badgeType: 'popular' | 'trending' | 'clean' | 'impact' | 'premium' | 'simple';
  description: string;
  primaryColor: string;
  accentColor: string;
  previewThumbnail: string;
  isAtsCompliant?: boolean;
}

export type ActivePage = 'dashboard' | 'landing' | 'builder';
export type SidebarSection = 'dashboard' | 'resumes' | 'cover-letters' | 'jobs' | 'applications' | 'admin';

export const ADMIN_EMAIL = 'taktempest168@gmail.com';

export interface PublicJob {
  id: string;
  title: string;
  company: string;
  location: string;
  workType: 'Remote' | 'Onsite' | 'Hybrid';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: string;
  description: string;
  requirements: string[];
  applyUrl: string; // The website that posted needing employees
  tags: string[];
  postedBy: string; // Admin or company
  postedAt: string;
  status: 'active' | 'closed';
  featured?: boolean;
  imageUrl?: string; // Job recruitment banner/poster image from PC or URL
}

export interface CandidateApplication {
  fullName: string;
  gmail: string;
  phone: string;
  cvFileName: string;
  cvFileType: 'pdf' | 'docx' | 'other';
  cvFileSize?: string;
  cvFileData?: string; // data URL / base64
  telegramHandle: string;
  notes?: string;
  publicJobId?: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
}

export interface AdminSubmission {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: 'pro_upgrade' | 'premium_upgrade' | 'job_posting' | 'application';
  title: string;
  details: string;
  data?: any;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  telegramSent?: boolean;
  telegramSentAt?: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  autoForwardApproved: boolean;
}

export interface UserAccountProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  planTier: PlanTier;
  avatarUrl?: string;
  createdAt?: string;
  // Browser device IDs seen for this account, recorded on each successful login.
  // Used by admins to block the device(s) a troll account has signed in from.
  deviceIds?: string[];
  fingerprints?: string[];
}

export interface BlockedDevice {
  id: string; // Firestore doc id, same as deviceId or fingerprint value
  type: 'deviceId' | 'fingerprint';
  reason?: string;
  blockedByEmail?: string;
  relatedUserEmail?: string;
  createdAt: string;
}

export interface ResumeItem {
  id: string;
  userId?: string;
  title: string;
  templateId: TemplateId;
  primaryColor?: string;
  createdAt: string;
  updatedAt: string;
  data: CVData;
}

export interface CoverLetterItem {
  id: string;
  userId?: string;
  title: string;
  recipientName: string;
  companyName: string;
  jobTitle: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
}

export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';

export interface JobItem {
  id: string;
  userId?: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  status: JobStatus;
  appliedDate?: string;
  notes?: string;
  jobUrl?: string;
  resumeUsedId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Candidate Application info
  candidateName?: string;
  candidateGmail?: string;
  candidatePhone?: string;
  candidateTelegram?: string;
  candidateCvName?: string;
  candidateCvData?: string;
  candidateCvType?: 'pdf' | 'docx' | 'other';
  candidateCvSize?: string;
  imageUrl?: string;
}

export type BuilderTab =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'achievements'
  | 'references'
  | 'projects';

