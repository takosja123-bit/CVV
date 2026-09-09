import React, { useState } from 'react';
import { CVData, SkillItem } from '../../types';
import {
  Sparkles,
  Target,
  CheckCircle,
  XCircle,
  Plus,
  Copy,
  Check,
  X,
  FileText,
  Search,
} from 'lucide-react';

interface JobMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onAddSkill: (skillName: string) => void;
}

// Common tech keywords, frameworks, tools, soft skills dictionary for extraction
const KEYWORD_DICTIONARY = [
  'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Python', 'Django',
  'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET', 'Go', 'Golang', 'Rust', 'PHP', 'Laravel',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Microservices', 'Docker',
  'Kubernetes', 'AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'CI/CD', 'GitHub Actions',
  'Git', 'Terraform', 'Linux', 'Agile', 'Scrum', 'Jira', 'Figma', 'UI/UX', 'Tailwind CSS',
  'Next.js', 'Redux', 'Unit Testing', 'Jest', 'Cypress', 'Playwright', 'Security', 'Authentication',
  'OAuth', 'WebSockets', 'Data Engineering', 'Machine Learning', 'AI', 'System Design', 'Leadership',
  'Cross-functional', 'Mentorship', 'Performance Optimization', 'SEO', 'Analytics', 'Troubleshooting',
  'Project Management', 'Communication', 'Problem Solving', 'SQL', 'NoSQL', 'DevOps', 'Cloud Architecture'
];

export const JobMatcherModal: React.FC<JobMatcherModalProps> = ({
  isOpen,
  onClose,
  cvData,
  onAddSkill,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [addedSkills, setAddedSkills] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Build searchable text from CV
  const cvCorpus = [
    cvData.personal.jobTitle,
    cvData.personal.summary,
    ...cvData.experiences.flatMap((e) => [e.jobTitle, e.company, ...(e.bullets || [])]),
    ...cvData.education.flatMap((ed) => [ed.degree, ed.institution, ed.details || '']),
    ...cvData.skills.map((s) => (typeof s === 'string' ? s : s.name)),
    ...cvData.projects.flatMap((p) => [p.title, p.role || '', p.description]),
    ...cvData.certifications.map((c) => `${c.name} ${c.issuer}`),
  ]
    .join(' ')
    .toLowerCase();

  // Extract keywords from pasted job description
  const extractKeywords = (text: string) => {
    if (!text.trim()) return [];
    const textLower = text.toLowerCase();

    const matchedFromDict = KEYWORD_DICTIONARY.filter((keyword) => {
      const regex = new RegExp(`\\b${keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(textLower);
    });

    // Also look for uppercase acronyms or specialized terms (e.g. 2-5 letter words in caps like ETL, API, SDK, CRM, ERP, KPI)
    const acronyms = (text.match(/\b[A-Z]{2,6}\b/g) || []).map((w) => w.trim());
    const uniqueAcronyms = Array.from(new Set(acronyms)).filter(
      (a) => !['AND', 'THE', 'FOR', 'WITH', 'YOU', 'OUR', 'ARE'].includes(a)
    );

    const allKeywords = Array.from(new Set([...matchedFromDict, ...uniqueAcronyms]));
    return allKeywords;
  };

  const detectedJobKeywords = extractKeywords(jobDescription);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  detectedJobKeywords.forEach((kw) => {
    const isPresent = cvCorpus.includes(kw.toLowerCase());
    if (isPresent) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const totalCount = detectedJobKeywords.length;
  const matchPercentage = totalCount > 0 ? Math.round((matchedKeywords.length / totalCount) * 100) : 0;

  const handleCopy = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const handleAddKeywordToSkills = (kw: string) => {
    onAddSkill(kw);
    setAddedSkills((prev) => ({ ...prev, [kw]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/15 text-blue-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Match Job Description</h3>
              <p className="text-xs text-blue-200">
                Scan job postings, calculate keyword match score, and uncover missing requirements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input area */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center justify-between">
              <span>Paste Target Job Posting / Description</span>
              {jobDescription && (
                <button
                  onClick={() => setJobDescription('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-normal cursor-pointer"
                >
                  Clear text
                </button>
              )}
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setHasAnalyzed(true);
              }}
              placeholder="Paste the job description from LinkedIn, Indeed, or the employer career page here..."
              rows={5}
              className="w-full px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed font-sans"
            />
          </div>

          {/* Quick preset buttons if empty */}
          {!jobDescription && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
              <span className="font-semibold text-slate-700 block text-[11px] uppercase">
                Or try a sample job description:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setJobDescription(
                      'We are looking for a Senior Software Engineer with strong experience in React, TypeScript, Node.js, REST API, GraphQL, PostgreSQL, Docker, AWS, and CI/CD. The ideal candidate has excellent problem-solving skills, understands microservices and distributed systems, and practices Agile/Scrum.'
                    );
                    setHasAnalyzed(true);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-xs transition-colors cursor-pointer"
                >
                  💻 Senior Software Engineer
                </button>
                <button
                  onClick={() => {
                    setJobDescription(
                      'Seeking a Product Marketing Manager with proven record in Performance Marketing, SEO, Content Strategy, Analytics, Cross-functional Leadership, Google Cloud, Project Management, and high-impact revenue generation.'
                    );
                    setHasAnalyzed(true);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-xs transition-colors cursor-pointer"
                >
                  📈 Marketing & Product Lead
                </button>
              </div>
            </div>
          )}

          {/* Results Analysis */}
          {detectedJobKeywords.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Match Score Card */}
              <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/40 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-blue-950">
                      {matchPercentage}%
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Keyword Match Rate
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Your CV matches <strong>{matchedKeywords.length}</strong> of{' '}
                    <strong>{totalCount}</strong> required skills and keywords in this job posting.
                  </p>
                </div>
              </div>

              {/* Missing Keywords (Actionable) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>
                      Missing Keywords in Your CV ({missingKeywords.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Click + to add to your skills section
                  </span>
                </div>

                {missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingKeywords.map((kw) => (
                      <div
                        key={kw}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium"
                      >
                        <span>{kw}</span>
                        {addedSkills[kw] ? (
                          <span className="text-emerald-700 flex items-center gap-0.5 text-[10px] font-bold">
                            <Check className="w-3 h-3" /> Added
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddKeywordToSkills(kw)}
                            title="Add to your skills"
                            className="p-0.5 hover:bg-rose-200 rounded text-rose-700 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(kw)}
                          title="Copy keyword"
                          className="p-0.5 hover:bg-rose-200 rounded text-rose-600 transition-colors cursor-pointer"
                        >
                          {copiedKeyword === kw ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-medium">
                    🎉 Excellent! Your CV already covers all key skills detected in this job description.
                  </div>
                )}
              </div>

              {/* Matched Keywords */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    Matched Keywords Found in Your CV ({matchedKeywords.length})
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {matchedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Tailor your resume keywords per job to maximize ATS recruiter callbacks.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
