import React from 'react';
import { CVData, TemplateId } from '../../types';
import { TEMPLATES } from '../../data/initialData';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  X,
  FileText,
  User,
  Layout,
  Briefcase,
} from 'lucide-react';

interface ATSCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  templateId?: TemplateId;
  selectedTemplate?: TemplateId;
  onSwitchTemplate?: (templateId: TemplateId) => void;
  onSwitchToAtsTemplate?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export interface ATSCheckItem {
  id: string;
  category: 'contact' | 'layout' | 'headers' | 'content';
  title: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  recommendation?: string;
  actionText?: string;
  onAction?: () => void;
}

export const ATSCheckModal: React.FC<ATSCheckModalProps> = ({
  isOpen,
  onClose,
  cvData,
  templateId,
  selectedTemplate,
  onSwitchTemplate,
  onSwitchToAtsTemplate,
  onNavigateToTab,
}) => {
  if (!isOpen) return null;

  const activeTemplateId = templateId || selectedTemplate || 'template-ats-classic';
  const currentTemplate = TEMPLATES.find((t) => t.id === activeTemplateId);
  const isAtsTemplate = currentTemplate?.isAtsCompliant || false;

  const handleSwitchToAts = (targetId: TemplateId = 'template-ats-classic') => {
    if (typeof onSwitchTemplate === 'function') {
      onSwitchTemplate(targetId);
    } else if (typeof onSwitchToAtsTemplate === 'function') {
      onSwitchToAtsTemplate();
    }
  };

  const checks: ATSCheckItem[] = [];

  // 1. Contact Information Checks
  if (cvData.personal.email && cvData.personal.email.includes('@')) {
    checks.push({
      id: 'contact-email',
      category: 'contact',
      title: 'Email Address Present',
      status: 'pass',
      description: `Valid email detected (${cvData.personal.email}).`,
    });
  } else {
    checks.push({
      id: 'contact-email',
      category: 'contact',
      title: 'Missing or Invalid Email',
      status: 'fail',
      description: 'ATS parsers require a valid email to route candidate notifications.',
      recommendation: 'Add your professional email address.',
      actionText: 'Add Email',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('personal');
        onClose();
      },
    });
  }

  if (cvData.personal.phone && cvData.personal.phone.trim().length >= 7) {
    checks.push({
      id: 'contact-phone',
      category: 'contact',
      title: 'Phone Number Present',
      status: 'pass',
      description: `Contact phone detected (${cvData.personal.phone}).`,
    });
  } else {
    checks.push({
      id: 'contact-phone',
      category: 'contact',
      title: 'Missing Phone Number',
      status: 'warning',
      description: 'Recruiters and automated screeners frequently filter by phone availability.',
      recommendation: 'Include a mobile or direct phone number with country/area code.',
      actionText: 'Add Phone',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('personal');
        onClose();
      },
    });
  }

  if (cvData.personal.address && cvData.personal.address.trim().length > 2) {
    checks.push({
      id: 'contact-address',
      category: 'contact',
      title: 'Location / City Included',
      status: 'pass',
      description: `Location detected (${cvData.personal.address}).`,
    });
  } else {
    checks.push({
      id: 'contact-address',
      category: 'contact',
      title: 'Missing Location / City',
      status: 'warning',
      description: 'ATS systems use location data to filter candidates by radius or time zone.',
      recommendation: 'Add City, State/Country (e.g. San Francisco, CA or London, UK).',
      actionText: 'Add Location',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('personal');
        onClose();
      },
    });
  }

  if (cvData.personal.linkedin && cvData.personal.linkedin.trim().length > 3) {
    checks.push({
      id: 'contact-linkedin',
      category: 'contact',
      title: 'LinkedIn Profile Linked',
      status: 'pass',
      description: 'Professional social presence increases ATS relevance score.',
    });
  } else {
    checks.push({
      id: 'contact-linkedin',
      category: 'contact',
      title: 'LinkedIn Profile Missing',
      status: 'warning',
      description: 'Over 85% of tech and corporate recruiters verify candidates via LinkedIn.',
      recommendation: 'Add your custom LinkedIn username or URL.',
      actionText: 'Add LinkedIn',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('personal');
        onClose();
      },
    });
  }

  // 2. Template & Layout Checks
  if (isAtsTemplate) {
    checks.push({
      id: 'layout-template',
      category: 'layout',
      title: 'Single-Column ATS Layout',
      status: 'pass',
      description: 'Active template uses a strict linear flow with standard semantic headings and zero parsing barriers.',
    });
  } else {
    checks.push({
      id: 'layout-template',
      category: 'layout',
      title: 'Multi-Column / Graphical Template Detected',
      status: 'warning',
      description: `The current template ("${currentTemplate?.name || 'Selected'}") uses dual-column or styled sidebars. Some legacy corporate ATS parsers (e.g. older Taleo versions) may read multi-column text out of order.`,
      recommendation: 'Switch to a 100% single-column ATS template for corporate online job applications.',
      actionText: 'Switch to Harvard ATS Template',
      onAction: () => {
        handleSwitchToAts('template-ats-classic');
      },
    });
  }

  if (cvData.personal.photoUrl && !isAtsTemplate) {
    checks.push({
      id: 'layout-photo',
      category: 'layout',
      title: 'Photo / Avatar Included',
      status: 'warning',
      description: 'US, UK, and Canadian ATS systems recommend omitting profile photos to prevent parsing errors and comply with anti-bias hiring regulations.',
      recommendation: 'ATS single-column templates automatically suppress photos for compliance.',
    });
  } else {
    checks.push({
      id: 'layout-photo',
      category: 'layout',
      title: 'No Photo Distractions in ATS Stream',
      status: 'pass',
      description: 'Document adheres to text-first parsing standards.',
    });
  }

  // 3. Section Headers & Structure
  const hasExperience = cvData.experiences && cvData.experiences.length > 0;
  const hasEducation = cvData.education && cvData.education.length > 0;
  const hasSkills = cvData.skills && cvData.skills.length > 0;
  const hasSummary = Boolean(cvData.personal.summary && cvData.personal.summary.trim().length > 20);

  if (hasExperience) {
    checks.push({
      id: 'headers-exp',
      category: 'headers',
      title: 'Standard "Work Experience" Section Found',
      status: 'pass',
      description: `${cvData.experiences.length} professional positions documented with clear chronological dates.`,
    });
  } else {
    checks.push({
      id: 'headers-exp',
      category: 'headers',
      title: 'No Work Experience Added',
      status: 'fail',
      description: 'Experience is the most weighted section in ATS candidate ranking algorithms.',
      recommendation: 'Add at least one relevant work or internship experience.',
      actionText: 'Add Experience',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('experience');
        onClose();
      },
    });
  }

  if (hasEducation) {
    checks.push({
      id: 'headers-edu',
      category: 'headers',
      title: 'Standard "Education" Section Found',
      status: 'pass',
      description: `${cvData.education.length} educational degree(s) identified.`,
    });
  } else {
    checks.push({
      id: 'headers-edu',
      category: 'headers',
      title: 'Missing Education Details',
      status: 'warning',
      description: 'Many corporate job filters require degree verification checks.',
      recommendation: 'Add your university, college, or highest level certificate.',
      actionText: 'Add Education',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('education');
        onClose();
      },
    });
  }

  if (hasSkills && cvData.skills.length >= 4) {
    checks.push({
      id: 'headers-skills',
      category: 'headers',
      title: 'Dedicated Skills Section (Adequate Density)',
      status: 'pass',
      description: `${cvData.skills.length} core technical/functional skills listed for keyword indexing.`,
    });
  } else {
    checks.push({
      id: 'headers-skills',
      category: 'headers',
      title: 'Low Skills Keyword Count',
      status: 'warning',
      description: 'ATS ranking algorithms score resumes heavily on exact skill matches.',
      recommendation: 'List at least 6-10 specific industry tools, languages, and competencies.',
      actionText: 'Add More Skills',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('skills');
        onClose();
      },
    });
  }

  if (hasSummary) {
    checks.push({
      id: 'headers-summary',
      category: 'headers',
      title: 'Professional Summary Found',
      status: 'pass',
      description: 'Provides an opening keyword summary for recruiter indexing.',
    });
  } else {
    checks.push({
      id: 'headers-summary',
      category: 'headers',
      title: 'Missing Professional Summary',
      status: 'warning',
      description: 'A 2-3 sentence executive overview establishes candidate title and domain expertise.',
      recommendation: 'Add a concise summary highlighting your core strengths.',
      actionText: 'Add Summary',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('personal');
        onClose();
      },
    });
  }

  // 4. Content Quality: Metrics & Action Verbs
  let totalBullets = 0;
  let bulletsWithMetrics = 0;
  let bulletsWithActionVerbs = 0;
  const actionVerbRegex = /\b(led|spearheaded|orchestrated|engineered|architected|accelerated|increased|decreased|optimized|delivered|pioneered|built|developed|managed|achieved|generated|transformed|streamlined)\b/i;
  const metricRegex = /\b(\d+(\.\d+)?%|\$\d+[\d,]*|\d+\+?(\s?(x|million|k|users|clients|projects|increase|growth|reduction|throughput)))\b/i;

  cvData.experiences.forEach((exp) => {
    (exp.bullets || []).forEach((b) => {
      totalBullets++;
      if (metricRegex.test(b)) bulletsWithMetrics++;
      if (actionVerbRegex.test(b)) bulletsWithActionVerbs++;
    });
  });

  if (totalBullets > 0 && bulletsWithMetrics >= Math.max(1, Math.floor(totalBullets * 0.3))) {
    checks.push({
      id: 'content-metrics',
      category: 'content',
      title: 'Strong Quantifiable Results (% / $ / numbers)',
      status: 'pass',
      description: `${bulletsWithMetrics} bullet(s) contain measurable impact and numbers.`,
    });
  } else {
    checks.push({
      id: 'content-metrics',
      category: 'content',
      title: 'Few Quantified Achievements',
      status: 'warning',
      description: 'Resumes with measurable metrics (% efficiency gains, $ revenue, team size) rank 40% higher with recruiters.',
      recommendation: 'Add specific percentages, dollar figures, or metric numbers to your experience bullets.',
      actionText: 'Enhance Experience',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('experience');
        onClose();
      },
    });
  }

  if (totalBullets > 0 && bulletsWithActionVerbs >= Math.max(1, Math.floor(totalBullets * 0.5))) {
    checks.push({
      id: 'content-verbs',
      category: 'content',
      title: 'Active High-Impact Action Verbs',
      status: 'pass',
      description: `${bulletsWithActionVerbs} bullet(s) start with strong action verbs.`,
    });
  } else {
    checks.push({
      id: 'content-verbs',
      category: 'content',
      title: 'Passive Phrasing in Experience Bullets',
      status: 'warning',
      description: 'Avoid passive phrases like "Responsible for" or "Assisted with". Use strong action verbs (Spearheaded, Engineered, Accelerated).',
      recommendation: 'Start each bullet with an active past-tense verb.',
      actionText: 'Review Bullets',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('experience');
        onClose();
      },
    });
  }

  // Calculate ATS Score (0 - 100)
  const passCount = checks.filter((c) => c.status === 'pass').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;

  const totalScore = Math.max(
    10,
    Math.min(100, Math.round((passCount * 10 + warningCount * 5) / (checks.length * 10) * 100))
  );

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'High ATS Pass Rate', color: 'bg-emerald-100 text-emerald-800' };
    if (score >= 65) return { label: 'Moderate - Needs Tweaks', color: 'bg-amber-100 text-amber-800' };
    return { label: 'Action Required', color: 'bg-rose-100 text-rose-800' };
  };

  const scoreBadge = getScoreBadge(totalScore);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">ATS Compatibility Scanner</h3>
              <p className="text-xs text-slate-400">
                Applicant Tracking System audit across Workday, Taleo, Greenhouse & Lever
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Overview Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl border text-center font-bold text-2xl ${getScoreColor(totalScore)}`}>
              {totalScore}
              <span className="text-xs font-normal text-slate-500 block">/ 100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreBadge.color}`}>
                  {scoreBadge.label}
                </span>
                <span className="text-xs text-slate-500">
                  {passCount} passed · {warningCount} warnings · {failCount} critical
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {isAtsTemplate
                  ? 'Active layout is 100% single-column ATS compliant.'
                  : 'Currently on a styled template. Switch to Harvard ATS for 100% parsing safety.'}
              </p>
            </div>
          </div>

          {!isAtsTemplate && (
            <button
              onClick={() => handleSwitchToAts('template-ats-classic')}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Use ATS Template</span>
            </button>
          )}
        </div>

        {/* Audit Checklist Items */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {checks.map((check) => (
            <div
              key={check.id}
              className={`p-3.5 rounded-xl border transition-all ${
                check.status === 'pass'
                  ? 'bg-white border-slate-200'
                  : check.status === 'warning'
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-rose-50/50 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {check.status === 'pass' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : check.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{check.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{check.description}</p>
                    {check.recommendation && (
                      <p className="text-[11px] text-amber-800 mt-1 font-medium bg-amber-100/60 px-2 py-0.5 rounded inline-block">
                        💡 {check.recommendation}
                      </p>
                    )}
                  </div>
                </div>

                {check.actionText && check.onAction && (
                  <button
                    onClick={check.onAction}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>{check.actionText}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Compliant with standard ATS parsing engines (Workday, Greenhouse, Taleo).
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
