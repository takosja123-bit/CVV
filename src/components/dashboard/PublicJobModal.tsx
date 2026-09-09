import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Link as LinkIcon,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { PublicJob, ADMIN_EMAIL } from '../../types';

interface PublicJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveJob: (job: PublicJob) => void;
  initialJob?: Partial<PublicJob> | null;
  isAdmin: boolean;
  userEmail?: string;
  userName?: string;
  onUserSubmitProposal?: (proposalData: any) => void;
}

export const PublicJobModal: React.FC<PublicJobModalProps> = ({
  isOpen,
  onClose,
  onSaveJob,
  initialJob,
  isAdmin,
  userEmail,
  userName,
  onUserSubmitProposal,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Remote');
  const [workType, setWorkType] = useState<PublicJob['workType']>('Remote');
  const [employmentType, setEmploymentType] = useState<PublicJob['employmentType']>('Full-time');
  const [salary, setSalary] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'active' | 'closed'>('active');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialJob) {
      setTitle(initialJob.title || '');
      setCompany(initialJob.company || '');
      setLocation(initialJob.location || 'Remote');
      setWorkType(initialJob.workType || 'Remote');
      setEmploymentType(initialJob.employmentType || 'Full-time');
      setSalary(initialJob.salary || '');
      setApplyUrl(initialJob.applyUrl || '');
      setImageUrl(initialJob.imageUrl || '');
      setDescription(initialJob.description || '');
      setRequirementsInput(
        Array.isArray(initialJob.requirements) ? initialJob.requirements.join('\n') : ''
      );
      setTagsInput(Array.isArray(initialJob.tags) ? initialJob.tags.join(', ') : '');
      setFeatured(!!initialJob.featured);
      setStatus(initialJob.status || 'active');
    } else {
      setTitle('');
      setCompany('');
      setLocation('Remote');
      setWorkType('Remote');
      setEmploymentType('Full-time');
      setSalary('$80,000 - $110,000 / year');
      setApplyUrl('');
      setImageUrl('');
      setDescription('');
      setRequirementsInput('');
      setTagsInput('React, TypeScript, Remote');
      setFeatured(false);
      setStatus('active');
    }
    setError(null);
  }, [initialJob, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB. Please choose a smaller image file.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !applyUrl.trim()) {
      setError('Job Title, Company Name, and Application Website URL are required.');
      return;
    }

    // Ensure URL has protocol
    let formattedUrl = applyUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const requirements = requirementsInput
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (isAdmin) {
      const job: PublicJob = {
        id: initialJob?.id || `pjob-${Date.now()}`,
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        workType,
        employmentType,
        salary: salary.trim(),
        applyUrl: formattedUrl,
        imageUrl: imageUrl.trim() || undefined,
        description: description.trim(),
        requirements,
        tags,
        postedBy: userEmail || ADMIN_EMAIL,
        postedAt: initialJob?.postedAt || new Date().toISOString().split('T')[0],
        status,
        featured,
      };
      onSaveJob(job);
      onClose();
    } else {
      // Regular user suggesting a job opening -> sends to Admin Dashboard
      if (onUserSubmitProposal) {
        onUserSubmitProposal({
          title: title.trim(),
          company: company.trim(),
          location: location.trim(),
          workType,
          employmentType,
          salary: salary.trim(),
          applyUrl: formattedUrl,
          imageUrl: imageUrl.trim() || undefined,
          description: description.trim(),
          requirements,
          tags,
          submittedBy: userEmail || 'Anonymous JobCraft User',
          userName: userName || 'JobCraft Member',
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                isAdmin ? 'bg-amber-600' : 'bg-blue-600'
              }`}
            >
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isAdmin
                  ? initialJob?.id
                    ? 'Edit Job Posting'
                    : 'Post New Job (Admin)'
                  : 'Suggest Employer Job Opening'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isAdmin
                  ? 'Publish job directly to the public board for JobCraft members'
                  : 'Submit a job opening to the Admin Dashboard for verification'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isAdmin && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Admin Verification Required:</span>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Your job suggestion will be reviewed by the admin in the Admin Dashboard before being published to the live job board and alerted to Telegram.
                </p>
              </div>
            </div>
          )}

          {/* Job Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Google, Stripe, TechCorp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Application URL (Where users click to apply) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Application Website URL (Employer Link) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                required
                placeholder="https://company.com/careers/apply-here"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono text-slate-800"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              JobCraft candidates will click this direct link to view the employer's posting and apply on their website.
            </p>
          </div>

          {/* Job Poster / Image Upload (From PC or URL) */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Job Poster / Recruitment Flyer Image (Optional)</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Poster</span>
                </button>
              )}
            </div>

            {imageUrl ? (
              <div className="flex items-start gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                <img
                  src={imageUrl}
                  alt="Job poster preview"
                  className="w-20 h-20 object-cover rounded-md border border-slate-200 shadow-xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Poster Attached</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Candidates can view the poster thumbnail on the job board and open the interactive Full Zoom Zone.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                    >
                      Change File
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-3.5 text-center cursor-pointer bg-white transition-all group"
                >
                  <div className="flex items-center justify-center gap-2 text-slate-600 group-hover:text-amber-600">
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-xs">Upload Poster Image from PC</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supports PNG, JPG, WEBP banners or flyers up to 5MB
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Or Image URL</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or poster link"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-[11px] border border-slate-200 rounded-md bg-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Location & Work Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Phnom Penh, Remote, Singapore"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Mode</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Salary & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Salary Range</label>
              <input
                type="text"
                placeholder="e.g. $80,000 - $110,000 / year"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Skills & Tags (comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, GraphQL, Remote"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Overview & Description</label>
            <textarea
              rows={3}
              placeholder="Describe the role, responsibilities, and team..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Requirements list */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Key Requirements (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="5+ years React experience&#10;Proficiency with TypeScript&#10;Strong communication skills"
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none font-mono text-xs"
            />
          </div>

          {/* Admin options: Featured and Status */}
          {isAdmin && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">Pin as Featured Job</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-2 py-1 border border-slate-300 rounded-md bg-white text-xs"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="closed">Closed (Hidden)</option>
                </select>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.99] ${
                isAdmin
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-950/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-950/20'
              }`}
            >
              {isAdmin ? (initialJob?.id ? 'Update Job' : 'Publish Job') : 'Submit to Admin Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
