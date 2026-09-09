import { CVData, TemplateConfig, ResumeItem, CoverLetterItem, JobItem, PublicJob, AdminSubmission, ADMIN_EMAIL } from '../types';

export const INITIAL_CV_DATA: CVData = {
  personal: {
    fullName: 'John Doe',
    jobTitle: 'Software Engineer',
    gender: 'Male',
    birthDate: '01/01/1999',
    email: 'myemail@gmail.com',
    phone: '+855 123456789',
    address: 'Phnom Penh, Cambodia',
    github: 'MyGitHub',
    linkedin: 'MyLinkedIn',
    website: 'mywebsite.com',
    summary:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  },
  experiences: [
    {
      id: 'exp-1',
      jobTitle: 'Job Title 2',
      company: 'Company B',
      location: 'Phnom Penh, Cambodia',
      startDate: 'Jan 2023',
      endDate: 'Present',
      current: true,
      bullets: [
        'Senior Level | Full Time — Spearheaded scalable microservices and responsive web platforms.',
        'Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type.',
        'Led architecture design for high-traffic front-end applications with 99.9% uptime.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Job Title 1',
      company: 'Company A',
      location: 'Phnom Penh, Cambodia',
      startDate: 'Jan 2020',
      endDate: 'Dec 2023',
      current: false,
      bullets: [
        'Junior Level | Full Time — Developed component libraries and core APIs.',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        'Collaborated with UX/UI design team to implement responsive interfaces.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University Name',
      degree: 'Software Engineering | Bachelor Degree',
      location: 'Phnom Penh, Cambodia',
      startDate: 'Jan 2020',
      endDate: 'Dec 2024',
      details:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Graduated with Honors in Computer Science.',
    },
    {
      id: 'edu-2',
      institution: 'School Name',
      degree: 'English Language | Certificate',
      location: 'Phnom Penh, Cambodia',
      startDate: 'Jan 2024',
      endDate: 'Present',
      details: 'Advanced Professional English Communication and Technical Writing.',
    },
  ],
  skills: [
    { name: 'VueJS', level: 5 },
    { name: 'NuxtJS', level: 4 },
    { name: 'PWA', level: 4 },
    { name: 'JavaScript', level: 5 },
    { name: 'HTML/CSS', level: 5 },
    { name: 'React', level: 4 },
    { name: 'Node.js', level: 4 },
    { name: 'TypeScript', level: 4 },
  ],
  languages: [
    { name: 'Khmer', level: 5 },
    { name: 'English', level: 4 },
    { name: 'Japanese', level: 3 },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Hackathon Award-2020',
      date: '23 April 2020',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Winner of the Best Innovation Award for automated cloud solutions.',
    },
    {
      id: 'ach-2',
      title: 'Hackathon Award-2022',
      date: '15 August 2022',
      description:
        'First Runner-up in National Developer Challenge. Developed high-throughput web application serving 100k+ active concurrent users.',
    },
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Jane Doe',
      title: 'Job Position',
      company: 'Virtual Company',
      email: 'jane.doe@virtual.com',
      phone: '+855 12345678',
    },
    {
      id: 'ref-2',
      name: 'Jane Doe',
      title: 'Job Position',
      company: 'Virtual Company',
      email: 'jane.doe@virtual.com',
      phone: '+855 12345678',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Enterprise Web Portal',
      role: 'Lead Front-End Engineer',
      link: 'github.com/johndoe/web-portal',
      description:
        'Built full-stack real-time collaboration dashboard using Vue 3 and TypeScript with 40% performance gain.',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Certified Professional Developer',
      issuer: 'AWS',
      date: '2023',
    },
  ],
  style: {
    sidebarSections: ['personal', 'skills', 'languages', 'references'],
    groupByInstitution: false,
    showLogos: true,
    showIcons: true,
    uppercaseHeaders: true,
  },
};

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'template-ats-classic',
    columnKey: 'ATS-1',
    name: 'Harvard ATS Standard',
    badge: '100% ATS Safe',
    planTier: 'Free Plan',
    badgeType: 'clean',
    description:
      'Pure single-column linear format matching the gold standard Harvard & Big Tech ATS parsing specifications. 0% parsing failure risk.',
    primaryColor: '#111827',
    accentColor: '#374151',
    previewThumbnail: 'ats-classic-thumb',
    isAtsCompliant: true,
  },
  {
    id: 'template-ats-modern',
    columnKey: 'ATS-2',
    name: 'Modern Sans ATS',
    badge: 'ATS Recommended',
    planTier: 'Free Plan',
    badgeType: 'popular',
    description:
      'Clean modern sans-serif typography with streamlined section headers and left-aligned single-column structure.',
    primaryColor: '#0f172a',
    accentColor: '#2563eb',
    previewThumbnail: 'ats-modern-thumb',
    isAtsCompliant: true,
  },
  {
    id: 'template-ats-executive',
    columnKey: 'ATS-3',
    name: 'Executive ATS Formal',
    badge: 'ATS Executive',
    planTier: 'Free Plan',
    badgeType: 'impact',
    description:
      'Distinguished formal serif ATS layout designed for senior managers, directors, and executives with high text density.',
    primaryColor: '#1e293b',
    accentColor: '#475569',
    previewThumbnail: 'ats-exec-thumb',
    isAtsCompliant: true,
  },
  {
    id: 'template-b',
    columnKey: 'B',
    name: 'Classic Navy Banner',
    badge: 'Popular',
    planTier: 'Free Plan',
    badgeType: 'popular',
    description:
      'Dark blue full-width header with circular avatar, icon contact bar, dot-rated skills & languages, and dual-column timeline.',
    primaryColor: '#1e3a5f',
    accentColor: '#3b82f6',
    previewThumbnail: 'b-thumb',
  },
  {
    id: 'template-c',
    columnKey: 'C',
    name: 'Vintage Stone Frame',
    badge: 'Artistic',
    planTier: 'Basic Plan',
    badgeType: 'premium',
    description:
      'Distinguished textured stone border frame with right-aligned avatar, clean typography and structured section hierarchy.',
    primaryColor: '#3a352f',
    accentColor: '#8c7b6c',
    previewThumbnail: 'c-thumb',
  },
  {
    id: 'template-d',
    columnKey: 'D',
    name: 'Slate Split Sidebar',
    badge: 'Clean Split',
    planTier: 'Free Plan',
    badgeType: 'clean',
    description:
      'Solid slate-blue left sidebar with white text, profile photo, level sliders, and structured right-side timeline brackets.',
    primaryColor: '#475569',
    accentColor: '#64748b',
    previewThumbnail: 'd-thumb',
  },
  {
    id: 'template-e',
    columnKey: 'E',
    name: 'Burgundy Hexagon',
    badge: 'Executive',
    planTier: 'Basic Plan',
    badgeType: 'impact',
    description:
      'Prominent wine-red header banner with signature hexagonal avatar emblem and crisp red icon dot indicators.',
    primaryColor: '#881337',
    accentColor: '#be123c',
    previewThumbnail: 'e-thumb',
  },
  {
    id: 'template-f',
    columnKey: 'F',
    name: 'Emerald Gold Timeline',
    badge: 'High Contrast',
    planTier: 'Basic Plan',
    badgeType: 'popular',
    description:
      'Deep forest green right panel with striking gold timeline nodes and clean white left sidebar with green badges.',
    primaryColor: '#064e3b',
    accentColor: '#eab308',
    previewThumbnail: 'f-thumb',
  },
  {
    id: 'template-g',
    columnKey: 'G',
    name: 'Golden Minimalist',
    badge: 'Warm Accent',
    planTier: 'Pro Plan',
    badgeType: 'trending',
    description:
      'Warm amber/gold accents with centered top avatar, progress bars, and balanced multi-column layout.',
    primaryColor: '#d97706',
    accentColor: '#f59e0b',
    previewThumbnail: 'g-thumb',
  },
  {
    id: 'template-h',
    columnKey: 'H',
    name: 'Nature Forest Sidebar',
    badge: 'Scenic',
    planTier: 'Pro Plan',
    badgeType: 'premium',
    description:
      'Scenic forestry tree background sidebar with crisp overlay text, paired with a bright, clean content section.',
    primaryColor: '#1b4332',
    accentColor: '#2d6a4f',
    previewThumbnail: 'h-thumb',
  },
  {
    id: 'template-i',
    columnKey: 'I',
    name: 'Cyan Double Border',
    badge: 'Modern Frame',
    planTier: 'Basic Plan',
    badgeType: 'clean',
    description:
      'Double turquoise cyan outer border with centered header and organized grid boxes for competencies.',
    primaryColor: '#0891b2',
    accentColor: '#06b6d4',
    previewThumbnail: 'i-thumb',
  },
  {
    id: 'template-j',
    columnKey: 'J',
    name: 'Rose Blossom Header',
    badge: 'Vibrant',
    planTier: 'Free Plan',
    badgeType: 'impact',
    description:
      'Vibrant rose-pink bulleted section headers (• Profile •) with side-by-side contact grid and modern typography.',
    primaryColor: '#e11d48',
    accentColor: '#f43f5e',
    previewThumbnail: 'j-thumb',
  },
  {
    id: 'template-k',
    columnKey: 'K',
    name: 'Royal Blue Timeline',
    badge: 'Structured',
    planTier: 'Basic Plan',
    badgeType: 'popular',
    description:
      'Royal blue continuous timeline with connected node bullets, boxed contact cards, and sleek level meters.',
    primaryColor: '#1d4ed8',
    accentColor: '#2563eb',
    previewThumbnail: 'k-thumb',
  },
  {
    id: 'template-l',
    columnKey: 'L',
    name: 'Coral & Navy Split',
    badge: 'Two-Tone',
    planTier: 'Basic Plan',
    badgeType: 'trending',
    description:
      'Coral peach top banner combined with a dark navy sidebar featuring orange progress bars and clean white body.',
    primaryColor: '#f97316',
    accentColor: '#0f172a',
    previewThumbnail: 'l-thumb',
  },
  {
    id: 'template-m',
    columnKey: 'M',
    name: 'Ocean Teal Modern',
    badge: 'Developer Choice',
    planTier: 'Pro Plan',
    badgeType: 'premium',
    description:
      'Vibrant ocean teal sidebar with cyan level meters, centered top avatar, and elegant white right column.',
    primaryColor: '#0284c7',
    accentColor: '#0ea5e9',
    previewThumbnail: 'm-thumb',
  },
];

export const COLOR_PALETTES = [
  { name: 'Navy Blue', color: '#1e3a5f' },
  { name: 'Slate Gray', color: '#475569' },
  { name: 'Burgundy Wine', color: '#881337' },
  { name: 'Emerald Forest', color: '#064e3b' },
  { name: 'Golden Amber', color: '#d97706' },
  { name: 'Cyan Teal', color: '#0891b2' },
  { name: 'Rose Blossom', color: '#e11d48' },
  { name: 'Royal Blue', color: '#1d4ed8' },
  { name: 'Dark Navy', color: '#0f172a' },
];

export function sanitizeCVData(raw: any): CVData {
  if (!raw || typeof raw !== 'object') {
    return INITIAL_CV_DATA;
  }
  return {
    personal: {
      fullName: raw.personal?.fullName || '',
      jobTitle: raw.personal?.jobTitle || '',
      gender: raw.personal?.gender || '',
      birthDate: raw.personal?.birthDate || '',
      email: raw.personal?.email || '',
      phone: raw.personal?.phone || '',
      address: raw.personal?.address || '',
      github: raw.personal?.github || '',
      linkedin: raw.personal?.linkedin || '',
      website: raw.personal?.website || '',
      summary: raw.personal?.summary || '',
      photoUrl: raw.personal?.photoUrl || '',
    },
    experiences: Array.isArray(raw.experiences)
      ? raw.experiences.map((e: any, idx: number) => ({
          id: e?.id || `exp-${idx}-${Date.now()}`,
          jobTitle: e?.jobTitle || '',
          company: e?.company || '',
          location: e?.location || '',
          startDate: e?.startDate || '',
          endDate: e?.endDate || '',
          current: Boolean(e?.current),
          bullets: Array.isArray(e?.bullets) ? e.bullets.filter(Boolean) : [],
        }))
      : [],
    education: Array.isArray(raw.education)
      ? raw.education.map((edu: any, idx: number) => ({
          id: edu?.id || `edu-${idx}-${Date.now()}`,
          institution: edu?.institution || '',
          degree: edu?.degree || '',
          location: edu?.location || '',
          startDate: edu?.startDate || '',
          endDate: edu?.endDate || '',
          details: edu?.details || '',
        }))
      : [],
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    languages: Array.isArray(raw.languages) ? raw.languages : [],
    projects: Array.isArray(raw.projects)
      ? raw.projects.map((p: any, idx: number) => ({
          id: p?.id || `proj-${idx}-${Date.now()}`,
          title: p?.title || '',
          role: p?.role || '',
          link: p?.link || '',
          description: p?.description || '',
        }))
      : [],
    certifications: Array.isArray(raw.certifications)
      ? raw.certifications.map((c: any, idx: number) => ({
          id: c?.id || `cert-${idx}-${Date.now()}`,
          name: c?.name || '',
          issuer: c?.issuer || '',
          date: c?.date || '',
        }))
      : [],
    achievements: Array.isArray(raw.achievements)
      ? raw.achievements.map((a: any, idx: number) => ({
          id: a?.id || `ach-${idx}-${Date.now()}`,
          title: a?.title || '',
          description: a?.description || '',
          date: a?.date || '',
        }))
      : [],
    references: Array.isArray(raw.references)
      ? raw.references.map((r: any, idx: number) => ({
          id: r?.id || `ref-${idx}-${Date.now()}`,
          name: r?.name || '',
          title: r?.title || '',
          company: r?.company || '',
          phone: r?.phone || '',
          email: r?.email || '',
        }))
      : [],
    style: {
      sidebarSections: Array.isArray(raw?.style?.sidebarSections)
        ? raw.style.sidebarSections
        : ['personal', 'skills', 'languages', 'references'],
      groupByInstitution: Boolean(raw?.style?.groupByInstitution),
      showLogos: raw?.style?.showLogos !== false,
      showIcons: raw?.style?.showIcons !== false,
      uppercaseHeaders: raw?.style?.uppercaseHeaders !== false,
    },
  };
}

export const INITIAL_RESUMES: ResumeItem[] = [
  {
    id: 'resume-sample-1',
    title: 'Senior Software Engineer Resume',
    templateId: 'template-ats-classic',
    primaryColor: '#111827',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    data: INITIAL_CV_DATA,
  },
  {
    id: 'resume-sample-2',
    title: 'Lead Frontend Architect Resume',
    templateId: 'template-b',
    primaryColor: '#1e3a5f',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    data: {
      ...INITIAL_CV_DATA,
      personal: {
        ...INITIAL_CV_DATA.personal,
        jobTitle: 'Lead Frontend Architect',
      },
    },
  },
];

export function createDefaultResumeForUser(userId?: string, name?: string, email?: string): ResumeItem {
  return {
    id: `resume-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: userId || undefined,
    title: name ? `${name}'s Resume` : 'My Resume',
    templateId: 'template-ats-classic',
    primaryColor: '#111827',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      ...INITIAL_CV_DATA,
      personal: {
        ...INITIAL_CV_DATA.personal,
        fullName: name || 'Your Name',
        email: email || 'your.email@example.com',
        jobTitle: 'Professional Title',
      },
    },
  };
}

export const INITIAL_COVER_LETTERS: CoverLetterItem[] = [
  {
    id: 'cl-1',
    title: 'Senior Frontend Developer - TechCorp',
    recipientName: 'Hiring Team',
    companyName: 'TechCorp Solutions',
    jobTitle: 'Senior Frontend Developer',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    senderName: 'John Doe',
    senderEmail: 'myemail@gmail.com',
    senderPhone: '+855 123456789',
    senderAddress: 'Phnom Penh, Cambodia',
    body: `Dear Hiring Team,\n\nI am writing to express my strong interest in the Senior Frontend Developer position at TechCorp Solutions. With over 6 years of experience architecting high-performance web applications and design systems in React and TypeScript, I am confident in my ability to make an immediate impact on your product engineering team.\n\nThroughout my career, I have spearheaded modern frontend workflows, improved page load performance by 45%, and mentored cross-functional engineering squads. TechCorp's mission to build human-centered software deeply resonates with me, and I would love the opportunity to contribute.\n\nThank you for considering my application. I look forward to the possibility of discussing how my experience aligns with your team's goals.\n\nSincerely,\nJohn Doe`,
  },
];

export const INITIAL_JOBS: JobItem[] = [];

export const INITIAL_PUBLIC_JOBS: PublicJob[] = [
  {
    id: 'pjob-1',
    title: 'Senior Frontend Engineer (React & TypeScript)',
    company: 'TechCorp International',
    location: 'Singapore / Remote',
    workType: 'Remote',
    employmentType: 'Full-time',
    salary: '$90,000 - $125,000 / year',
    description:
      'TechCorp is looking for a Senior Frontend Engineer to architect next-generation cloud productivity tools. You will lead UI engineering, design system scalability, and work closely with product teams.',
    requirements: [
      '5+ years experience in React, TypeScript, and modern state management',
      'Solid experience with responsive design, performance profiling, and accessibility',
      'Track record building web apps with high user engagement',
    ],
    applyUrl: 'https://careers.google.com/jobs/results/',
    tags: ['React', 'TypeScript', 'Tailwind', 'Remote'],
    postedBy: ADMIN_EMAIL,
    postedAt: '2026-08-30',
    status: 'active',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pjob-2',
    title: 'Full Stack Software Engineer (Node / Cloud)',
    company: 'NextGen Cloud Labs',
    location: 'Phnom Penh / Hybrid',
    workType: 'Hybrid',
    employmentType: 'Full-time',
    salary: '$50,000 - $75,000 / year',
    description:
      'We are expanding our core platform engineering team to build scalable microservices and real-time data pipelines for international logistics and fintech clients.',
    requirements: [
      '3+ years building full-stack applications with Node.js and modern frontend frameworks',
      'Experience with PostgreSQL, Firestore or MongoDB databases',
      'Familiarity with containerization (Docker) and CI/CD pipelines',
    ],
    applyUrl: 'https://www.linkedin.com/jobs/',
    tags: ['Full-stack', 'Node.js', 'PostgreSQL', 'Cloud'],
    postedBy: ADMIN_EMAIL,
    postedAt: '2026-08-28',
    status: 'active',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pjob-3',
    title: 'UI/UX Product Designer & Design Systems Lead',
    company: 'Verve Studio Global',
    location: 'Bangkok / Remote',
    workType: 'Remote',
    employmentType: 'Full-time',
    salary: '$65,000 - $85,000 / year',
    description:
      'Lead our design system initiative and craft intuitive user experiences across web and mobile platforms. Partner with engineering to deliver pixel-perfect digital experiences.',
    requirements: [
      '4+ years in product design and design systems architecture',
      'Proficiency in Figma, design tokens, and developer handoff',
      'Strong portfolio demonstrating high-craft UI and UX research',
    ],
    applyUrl: 'https://jobs.lever.co/',
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Remote'],
    postedBy: ADMIN_EMAIL,
    postedAt: '2026-08-26',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pjob-4',
    title: 'DevOps & Cloud Infrastructure Specialist',
    company: 'Apex Data Networks',
    location: 'Tokyo / Remote (Asia-Pacific)',
    workType: 'Remote',
    employmentType: 'Contract',
    salary: '$80,000 - $110,000 / year',
    description:
      'Maintain reliable cloud infrastructure, Kubernetes clusters, and automated deployment pipelines for enterprise data analytics products.',
    requirements: [
      'Hands-on experience with GCP or AWS and Kubernetes (GKE/EKS)',
      'Infrastructure as Code (Terraform), monitoring with Prometheus/Grafana',
      'Security compliance and high-availability operations expertise',
    ],
    applyUrl: 'https://boards.greenhouse.io/',
    tags: ['GCP', 'Kubernetes', 'Terraform', 'DevOps'],
    postedBy: ADMIN_EMAIL,
    postedAt: '2026-08-24',
    status: 'active',
  },
  {
    id: 'pjob-5',
    title: 'Junior Front-End Web Developer',
    company: 'Cambodia Digital Hub',
    location: 'Phnom Penh, Cambodia',
    workType: 'Onsite',
    employmentType: 'Full-time',
    salary: '$18,000 - $28,000 / year',
    description:
      'Great entry-level opportunity for passionate web developers to join an agile agency. You will build modern web storefronts and client portals.',
    requirements: [
      'Good knowledge of HTML, CSS, JavaScript, and React',
      'Eager to learn modern tools, Git workflows, and API integrations',
      'Degree in Computer Science or equivalent bootcamp experience',
    ],
    applyUrl: 'https://www.camhr.com/',
    tags: ['JavaScript', 'HTML/CSS', 'Junior', 'Phnom Penh'],
    postedBy: ADMIN_EMAIL,
    postedAt: '2026-08-22',
    status: 'active',
  },
];

export const INITIAL_SUBMISSIONS: AdminSubmission[] = [
  {
    id: 'sub-demo-1',
    userId: 'user-demo-99',
    userEmail: 'charlie.candidate@gmail.com',
    userName: 'Charlie Candidate',
    type: 'pro_upgrade',
    title: 'Request Pro Plan Access',
    details: 'Completed career milestone, requesting Pro Plan tier to unlock ATS Harvard and Executive templates for job applications.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'sub-demo-2',
    userId: 'user-demo-88',
    userEmail: 'dev.sarah@gmail.com',
    userName: 'Sarah Jenkins',
    type: 'job_posting',
    title: 'Employer Job Listing: Mobile Flutter Lead',
    details: 'Our startup is hiring a Flutter Lead in Phnom Penh ($3k/mo). Link: https://company.example.com/careers/flutter',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    data: {
      company: 'Fintech Spark',
      title: 'Mobile Flutter Lead',
      salary: '$36,000 - $45,000',
      applyUrl: 'https://company.example.com/careers/flutter',
    },
  },
];

export function sanitizeResumeList(rawList: any, fallbackToDefault: boolean = false): ResumeItem[] {
  if (!Array.isArray(rawList)) {
    return fallbackToDefault ? INITIAL_RESUMES : [];
  }
  if (rawList.length === 0 && fallbackToDefault) {
    return INITIAL_RESUMES;
  }
  return rawList.map((item, idx) => ({
    id: item?.id || `resume-${idx}-${Date.now()}`,
    userId: item?.userId || undefined,
    title: item?.title || `Resume ${idx + 1}`,
    templateId: item?.templateId || 'template-b',
    primaryColor: item?.primaryColor || '#1e3a5f',
    createdAt: item?.createdAt || new Date().toISOString(),
    updatedAt: item?.updatedAt || new Date().toISOString(),
    data: sanitizeCVData(item?.data),
  }));
}

