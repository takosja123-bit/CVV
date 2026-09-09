import React, { useState } from 'react';
import { Project, Certification, Achievement, Reference, CVStyleOptions } from '../../types';
import { Plus, Trash2, Award, FolderKanban, Trophy, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { RichTextEditor } from '../common/RichTextEditor';
import { LayoutOptionsPopover } from './LayoutOptionsPopover';

interface ProjectsTabProps {
  projects?: Project[];
  certifications?: Certification[];
  achievements?: Achievement[];
  references?: Reference[];
  style?: CVStyleOptions;
  onUpdateProjects: (updated: Project[]) => void;
  onUpdateCertifications: (updated: Certification[]) => void;
  onUpdateAchievements?: (updated: Achievement[]) => void;
  onUpdateReferences?: (updated: Reference[]) => void;
  onChangeStyle?: (newStyle: CVStyleOptions) => void;
  activePopover?: string | null;
  onTogglePopover?: (section: string) => void;
  onClosePopover?: () => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects = [],
  certifications = [],
  achievements = [],
  references = [],
  style,
  onUpdateProjects,
  onUpdateCertifications,
  onUpdateAchievements,
  onUpdateReferences,
  onChangeStyle,
  activePopover: externalActivePopover,
  onTogglePopover: externalTogglePopover,
  onClosePopover: externalClosePopover,
}) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeCerts = Array.isArray(certifications) ? certifications : [];
  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  const safeReferences = Array.isArray(references) ? references : [];
  const [internalPopover, setInternalPopover] = useState<string | null>(null);

  const activePopover = externalActivePopover !== undefined ? externalActivePopover : internalPopover;
  const togglePopover = (key: string) => {
    if (externalTogglePopover) {
      externalTogglePopover(key);
    } else {
      setInternalPopover((prev) => (prev === key ? null : key));
    }
  };
  const openPopover = (key: string) => {
    if (externalTogglePopover) {
      if (externalActivePopover !== key) {
        externalTogglePopover(key);
      }
    } else {
      setInternalPopover(key);
    }
  };
  const closePopover = () => {
    if (externalClosePopover) {
      externalClosePopover();
    } else {
      setInternalPopover(null);
    }
  };

  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'Project Title',
      role: 'Lead Architect / Contributor',
      link: 'github.com/my-project',
      description: 'Architected and deployed a scalable solution increasing process efficiency by 30%.',
    };
    onUpdateProjects([...safeProjects, newProj]);
  };

  const handleUpdateProject = (id: string, field: keyof Project, value: string) => {
    onUpdateProjects(
      safeProjects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleDeleteProject = (id: string) => {
    onUpdateProjects(safeProjects.filter((p) => p.id !== id));
  };

  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= safeProjects.length) return;
    const items = [...safeProjects];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onUpdateProjects(items);
  };

  const handleAddCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: 'Certification Title',
      issuer: 'Issuing Organization',
      date: '2023',
    };
    onUpdateCertifications([...safeCerts, newCert]);
  };

  const handleUpdateCert = (id: string, field: keyof Certification, value: string) => {
    onUpdateCertifications(
      safeCerts.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleDeleteCert = (id: string) => {
    onUpdateCertifications(safeCerts.filter((c) => c.id !== id));
  };

  const handleMoveCert = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= safeCerts.length) return;
    const items = [...safeCerts];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onUpdateCertifications(items);
  };

  // Achievements handlers
  const handleAddAchievement = () => {
    if (!onUpdateAchievements) return;
    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      title: 'Achievement / Award Title',
      description: 'Recognized for outstanding technical leadership and measurable delivery.',
      date: '2023',
    };
    onUpdateAchievements([...safeAchievements, newAch]);
  };

  const handleUpdateAchievement = (id: string, field: keyof Achievement, value: string) => {
    if (!onUpdateAchievements) return;
    onUpdateAchievements(
      safeAchievements.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleDeleteAchievement = (id: string) => {
    if (!onUpdateAchievements) return;
    onUpdateAchievements(safeAchievements.filter((a) => a.id !== id));
  };

  // References handlers
  const handleAddReference = () => {
    if (!onUpdateReferences) return;
    const newRef: Reference = {
      id: `ref-${Date.now()}`,
      name: 'Reference Name',
      title: 'Senior Director / Manager',
      company: 'Company Name',
      phone: '+1 (555) 000-0000',
      email: 'ref@example.com',
    };
    onUpdateReferences([...safeReferences, newRef]);
  };

  const handleUpdateReference = (id: string, field: keyof Reference, value: string) => {
    if (!onUpdateReferences) return;
    onUpdateReferences(
      safeReferences.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteReference = (id: string) => {
    if (!onUpdateReferences) return;
    onUpdateReferences(safeReferences.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* KEY PROJECTS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div
            onMouseEnter={() => openPopover('projects')}
            onClick={() => togglePopover('projects')}
            className="cursor-pointer group select-none flex items-center gap-1.5"
            title="Hover or click for Layout Options"
          >
            <FolderKanban className="w-4 h-4 text-indigo-600 group-hover:text-purple-600 transition-colors" />
            <label className="text-[11px] font-bold tracking-wider text-slate-700 uppercase group-hover:text-purple-700 transition-colors cursor-pointer">
              KEY PROJECTS ({safeProjects.length})
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddProject}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Project
            </button>
            <LayoutOptionsPopover
              sectionKey="projects"
              sectionTitle="Projects"
              style={style}
              onChangeStyle={onChangeStyle}
              isOpen={activePopover === 'projects'}
              onToggle={() => togglePopover('projects')}
              onOpen={() => openPopover('projects')}
              onClose={closePopover}
            />
          </div>
        </div>

        {safeProjects.length === 0 && (
          <div className="text-center py-5 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-xs text-slate-500">
            No projects added yet. Showcase your top open-source or commercial projects.
          </div>
        )}

        <div className="space-y-3">
          {safeProjects.map((proj, idx) => (
            <div key={proj.id} className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveProject(idx, 'up')}
                    className="p-1 hover:bg-slate-100 disabled:opacity-20 rounded text-slate-500 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === safeProjects.length - 1}
                    onClick={() => handleMoveProject(idx, 'down')}
                    className="p-1 hover:bg-slate-100 disabled:opacity-20 rounded text-slate-500 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => handleUpdateProject(proj.id, 'title', e.target.value)}
                  placeholder="Project Name / Title"
                  className="font-bold text-xs text-slate-900 border-b border-transparent focus:border-indigo-500 focus:outline-none flex-1 px-1"
                />
                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={proj.role || ''}
                  onChange={(e) => handleUpdateProject(proj.id, 'role', e.target.value)}
                  placeholder="Role (e.g. Lead Architect)"
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={proj.link || ''}
                  onChange={(e) => handleUpdateProject(proj.id, 'link', e.target.value)}
                  placeholder="Link (e.g. github.com/username/project)"
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <RichTextEditor
                value={proj.description}
                onChange={(newVal) => handleUpdateProject(proj.id, 'description', newVal)}
                placeholder="Key outcome or business value delivered (e.g. Built microservices with React & Node.js resulting in 30% latency reduction)..."
                rows={2}
                maxRecommendedLength={300}
                enableActionVerbs={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div
            onMouseEnter={() => openPopover('certifications')}
            onClick={() => togglePopover('certifications')}
            className="cursor-pointer group select-none flex items-center gap-1.5"
            title="Hover or click for Layout Options"
          >
            <Award className="w-4 h-4 text-amber-600 group-hover:text-purple-600 transition-colors" />
            <label className="text-[11px] font-bold tracking-wider text-slate-700 uppercase group-hover:text-purple-700 transition-colors cursor-pointer">
              CERTIFICATIONS & LICENSES ({safeCerts.length})
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddCert}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Cert
            </button>
            <LayoutOptionsPopover
              sectionKey="certifications"
              sectionTitle="Certifications"
              style={style}
              onChangeStyle={onChangeStyle}
              isOpen={activePopover === 'certifications'}
              onToggle={() => togglePopover('certifications')}
              onOpen={() => openPopover('certifications')}
              onClose={closePopover}
            />
          </div>
        </div>

        <div className="space-y-2">
          {safeCerts.map((cert, idx) => (
            <div key={cert.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveCert(idx, 'up')}
                    className="p-1 hover:bg-slate-100 disabled:opacity-20 rounded text-slate-500 cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === safeCerts.length - 1}
                    onClick={() => handleMoveCert(idx, 'down')}
                    className="p-1 hover:bg-slate-100 disabled:opacity-20 rounded text-slate-500 cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => handleUpdateCert(cert.id, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect / PMP"
                  className="font-bold text-xs text-slate-900 border-b border-transparent focus:border-amber-500 focus:outline-none flex-1 px-1"
                />
                <button
                  onClick={() => handleDeleteCert(cert.id)}
                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => handleUpdateCert(cert.id, 'issuer', e.target.value)}
                  placeholder="Issuer (e.g. Amazon Web Services)"
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
                />
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => handleUpdateCert(cert.id, 'date', e.target.value)}
                  placeholder="Year (e.g. 2024)"
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS & AWARDS SECTION */}
      {onUpdateAchievements && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div
              onMouseEnter={() => openPopover('achievements')}
              onClick={() => togglePopover('achievements')}
              className="cursor-pointer group select-none flex items-center gap-1.5"
              title="Hover or click for Layout Options"
            >
              <Trophy className="w-4 h-4 text-purple-600 group-hover:text-purple-700 transition-colors" />
              <label className="text-[11px] font-bold tracking-wider text-slate-700 uppercase group-hover:text-purple-700 transition-colors cursor-pointer">
                ACHIEVEMENTS & AWARDS ({safeAchievements.length})
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddAchievement}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Achievement
              </button>
              <LayoutOptionsPopover
                sectionKey="achievements"
                sectionTitle="Key Achievements"
                style={style}
                onChangeStyle={onChangeStyle}
                isOpen={activePopover === 'achievements'}
                onToggle={() => togglePopover('achievements')}
                onOpen={() => openPopover('achievements')}
                onClose={closePopover}
              />
            </div>
          </div>

          <div className="space-y-2">
            {safeAchievements.map((ach) => (
              <div key={ach.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) => handleUpdateAchievement(ach.id, 'title', e.target.value)}
                    placeholder="Achievement Title"
                    className="font-bold text-xs text-slate-900 border-b border-transparent focus:border-purple-500 focus:outline-none flex-1"
                  />
                  <button
                    onClick={() => handleDeleteAchievement(ach.id)}
                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <RichTextEditor
                  value={ach.description}
                  onChange={(newVal) => handleUpdateAchievement(ach.id, 'description', newVal)}
                  placeholder="Details regarding your honor, competition, or milestone..."
                  rows={2}
                  maxRecommendedLength={250}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REFERENCES SECTION */}
      {onUpdateReferences && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div
              onMouseEnter={() => openPopover('references')}
              onClick={() => togglePopover('references')}
              className="cursor-pointer group select-none flex items-center gap-1.5"
              title="Hover or click for Layout Options"
            >
              <Users className="w-4 h-4 text-blue-600 group-hover:text-purple-600 transition-colors" />
              <label className="text-[11px] font-bold tracking-wider text-slate-700 uppercase group-hover:text-purple-700 transition-colors cursor-pointer">
                PROFESSIONAL REFERENCES ({safeReferences.length})
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddReference}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Reference
              </button>
              <LayoutOptionsPopover
                sectionKey="references"
                sectionTitle="References"
                style={style}
                onChangeStyle={onChangeStyle}
                isOpen={activePopover === 'references'}
                onToggle={() => togglePopover('references')}
                onOpen={() => openPopover('references')}
                onClose={closePopover}
              />
            </div>
          </div>

          <div className="space-y-2">
            {safeReferences.map((ref) => (
              <div key={ref.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) => handleUpdateReference(ref.id, 'name', e.target.value)}
                    placeholder="Full Name (e.g. Sok Dara)"
                    className="font-bold text-xs text-slate-900 border-b border-transparent focus:border-blue-500 focus:outline-none flex-1"
                  />
                  <button
                    onClick={() => handleDeleteReference(ref.id)}
                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={ref.title}
                    onChange={(e) => handleUpdateReference(ref.id, 'title', e.target.value)}
                    placeholder="Title (e.g. IT Director)"
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={ref.company}
                    onChange={(e) => handleUpdateReference(ref.id, 'company', e.target.value)}
                    placeholder="Company (e.g. Tech Corp)"
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={ref.phone}
                    onChange={(e) => handleUpdateReference(ref.id, 'phone', e.target.value)}
                    placeholder="Phone (e.g. 012 345 678)"
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={ref.email || ''}
                    onChange={(e) => handleUpdateReference(ref.id, 'email', e.target.value)}
                    placeholder="Email (optional)"
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
