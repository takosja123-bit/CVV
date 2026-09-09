import React, { useState } from 'react';
import { CVData, TemplateId, PlanTier } from '../../types';
import { TEMPLATES } from '../../data/initialData';
import { TemplateCardThumbnail } from './TemplateCardThumbnail';
import { TemplateCarousel } from './TemplateCarousel';
import { TemplateDispatcher } from '../templates/TemplateDispatcher';
import { DownloadMenu } from '../builder/DownloadMenu';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Download, FileText, Palette, Check, LayoutGrid, SlidersHorizontal } from 'lucide-react';

interface LandingPageProps {
  data: CVData;
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onCreateCV: (templateId?: TemplateId) => void;
  onGoToDashboard?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  data,
  selectedTemplate,
  onSelectTemplate,
  onCreateCV,
  onGoToDashboard,
}) => {
  const [activeTemplateId, setActiveTemplateId] = useState<TemplateId>(selectedTemplate || TEMPLATES[0].id);
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<'All' | PlanTier>('All');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const currentTemplate =
    TEMPLATES.find((t) => t.id === activeTemplateId) || TEMPLATES[0];

  const filteredTemplates =
    selectedPlanFilter === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.planTier === selectedPlanFilter);

  const getPlanBadgeColor = (plan: PlanTier) => {
    switch (plan) {
      case 'Free Plan':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Basic Plan':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Pro Plan':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#1E293B] font-sans-ui flex flex-col">
      {/* Top Navbar */}
      <header className="w-full text-white px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm" style={{ background: '#0057B8', borderBottom: '1px solid #003d82' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0057B8] font-bold shadow-sm">
            <span className="text-sm select-none leading-none">✨</span>
          </div>
          <div>
            <span className="text-sm font-semibold tracking-wide text-white flex items-center gap-1.5 font-display">
              <span>Jobify</span>
              <span style={{ color: '#7dd3fc' }} className="font-bold">CV</span>
              <span className="text-xs font-normal text-white/80 ml-1">Cambodia</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline-flex text-xs font-semibold text-white/90 hover:text-white px-2 py-2 transition-colors cursor-pointer"
          >
            How it works
          </button>

          {onGoToDashboard && (
            <button
              onClick={onGoToDashboard}
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-md border border-white/20 transition-colors cursor-pointer"
            >
              <span>JobCraft Dashboard</span>
            </button>
          )}

          <button
            onClick={() => onCreateCV(activeTemplateId)}
            className="flex items-center gap-2 bg-white hover:bg-[#eef6ff] text-[#0057B8] text-xs font-semibold px-4 py-2 rounded-md shadow-sm transition-all duration-150 cursor-pointer active:scale-98 font-display"
          >
            <span>Create CV</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-16 pb-16 px-4"
        style={{ background: 'linear-gradient(135deg, #0057B8 0%, #003d82 55%, #00AAAA 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: '#fff', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none" style={{ background: '#00AAAA', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center text-left">
          {/* Left column: copy */}
          <div>
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 bg-white/15 border border-white/20">
              <span className="text-xs font-semibold text-white tracking-wide">
                🇰🇭 Built for Cambodian Job Seekers
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-display font-extrabold tracking-tight text-white leading-[1.1] mb-5">
              Build Your<br />
              <span style={{ color: '#7dd3fc' }}>Professional CV</span><br />
              in Minutes
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg max-w-lg leading-relaxed mb-8 font-normal" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Create a standout CV tailored for Cambodia's job market. Free, fast, and designed to get you hired.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onCreateCV(activeTemplateId)}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#eef6ff] text-[#0057B8] text-base font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-98 font-display"
              >
                <span>🚀 Create My CV — Free</span>
              </button>
              <button
                onClick={() => {
                  document.getElementById('template-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white text-base font-semibold px-6 py-3.5 rounded-xl border border-white/40 transition-all duration-200 cursor-pointer active:scale-98 font-display"
              >
                <span>👁 Preview Example</span>
              </button>
            </div>
            <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>No sign-up required · 100% free · Download as PDF</p>
          </div>

          {/* Right column: CV preview card mockup */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-[300px] bg-white rounded-2xl shadow-2xl overflow-hidden rotate-1">
              <div className="px-6 py-6 text-center" style={{ background: '#0057B8' }}>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/25 flex items-center justify-center text-white font-bold text-lg mb-3">
                  SM
                </div>
                <p className="text-white font-semibold text-base font-display">Sopheak Meas</p>
                <p className="text-white/80 text-sm">Software Engineer</p>
              </div>
              <div className="px-6 py-5 space-y-5">
                <div>
                  <p className="text-[11px] font-bold tracking-wide mb-2" style={{ color: '#0057B8' }}>WORK EXPERIENCE</p>
                  <div className="h-1.5 bg-slate-200 rounded-full mb-1.5 w-full" />
                  <div className="h-1.5 bg-slate-200 rounded-full w-4/5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wide mb-2" style={{ color: '#0057B8' }}>EDUCATION</p>
                  <div className="h-1.5 bg-slate-200 rounded-full mb-1.5 w-full" />
                  <div className="h-1.5 bg-slate-200 rounded-full w-3/5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wide mb-2" style={{ color: '#0057B8' }}>SKILLS</p>
                  <div className="h-1.5 bg-slate-200 rounded-full mb-1.5 w-full" />
                  <div className="h-1.5 bg-slate-200 rounded-full w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Jobify CV Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Why Jobify CV?
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            Everything you need to land your dream job in Cambodia
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#f6f8fb] rounded-xl border border-slate-200/70 p-6">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Job-Ready Templates</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed for Cambodia's top employers — banking, NGOs, tech, and more.
            </p>
          </div>

          <div className="bg-[#f6f8fb] rounded-xl border border-slate-200/70 p-6">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Build in Minutes</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fill in your details and get a polished CV instantly. No design skills needed.
            </p>
          </div>

          <div className="bg-[#f6f8fb] rounded-xl border border-slate-200/70 p-6">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">3 Professional Layouts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Modern, Classic, and Minimal templates with 8 color schemes to match your industry.
            </p>
          </div>

          <div className="bg-[#f6f8fb] rounded-xl border border-slate-200/70 p-6">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">PDF Download</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              One-click print to PDF. Send to employers or upload to Jobify Cambodia directly.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="py-16 px-4 bg-[#f4f7fb] w-full scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            How It Works
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            3 simple steps to your perfect CV
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 mb-10">
          {/* Step 01 */}
          <div className="flex flex-col items-center text-center max-w-[220px]">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-4" style={{ background: '#0057B8' }}>
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Fill Your Info</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enter your personal details, experience, and education.
            </p>
          </div>

          <div className="hidden sm:block w-16 h-[2px] bg-slate-300 self-start mt-7" />

          {/* Step 02 */}
          <div className="flex flex-col items-center text-center max-w-[220px]">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-4" style={{ background: '#0057B8' }}>
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Choose Template</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pick a layout and color that fits your target role.
            </p>
          </div>

          <div className="hidden sm:block w-16 h-[2px] bg-slate-300 self-start mt-7" />

          {/* Step 03 */}
          <div className="flex flex-col items-center text-center max-w-[220px]">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-4" style={{ background: '#0057B8' }}>
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Download & Apply</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Export as PDF and start applying to jobs today.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onCreateCV(activeTemplateId)}
            className="inline-flex items-center gap-2 text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-98 font-display"
            style={{ background: '#0057B8' }}
          >
            <span>Start Building My CV</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Choose your template Section */}
      <section id="template-section" className="py-10 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center px-4 mb-4">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-slate-900">
            Choose your template
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Browse full-size authentic CV designs with horizontal slide navigation
          </p>
        </div>

        {/* View Switcher and Plan Filters */}
        <div className="flex items-center justify-between px-6 mb-4 flex-wrap gap-3">
          {/* Plan Tier Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'Free Plan', 'Basic Plan', 'Pro Plan'] as const).map((tab) => {
              const count = tab === 'All' ? TEMPLATES.length : TEMPLATES.filter((t) => t.planTier === tab).length;
              const isSelected = selectedPlanFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedPlanFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Carousel vs Grid View Toggle */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === 'carousel'
                  ? 'bg-[#0057B8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Full Showcase (Carousel)</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#0057B8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* Carousel Showcase matching screenshot */}
        {viewMode === 'carousel' ? (
          <div className="mb-10">
            <TemplateCarousel
              data={data}
              selectedTemplate={activeTemplateId}
              onSelectTemplate={(id) => {
                setActiveTemplateId(id);
                onSelectTemplate(id);
              }}
              onCreateCV={onCreateCV}
            />
          </div>
        ) : (
          /* Templates Gallery Grid (12 templates: Col B to Col M) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 mb-10 px-4">
            {filteredTemplates.map((tmpl) => {
              const isSelected = tmpl.id === activeTemplateId;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setActiveTemplateId(tmpl.id);
                    onSelectTemplate(tmpl.id);
                  }}
                  onDoubleClick={() => {
                    setActiveTemplateId(tmpl.id);
                    onSelectTemplate(tmpl.id);
                    onCreateCV(tmpl.id);
                  }}
                  className={`bg-white rounded-xl border text-left p-2.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-[#0057B8] ring-2 ring-[#0057B8] shadow-md scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'
                  }`}
                >
                  {/* Column Badge (e.g. Col B, Col C) */}
                  <div className="absolute top-3.5 left-3.5 z-10 bg-[#0057B8]/85 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                    Col {tmpl.columnKey}
                  </div>

                  <div className="w-full">
                    <TemplateCardThumbnail templateId={tmpl.id} />
                  </div>
                  <div className="mt-2.5 flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate">{tmpl.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />}
                    </div>

                    {/* Plan Tier Badge matching image */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border text-center ${getPlanBadgeColor(tmpl.planTier)}`}>
                      {tmpl.planTier}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Template Detail Spotlight View */}
        <div className="bg-[#f4f8fd] rounded-2xl p-6 md:p-10 border border-[#dbe8f7] shadow-sm mx-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Template Information & Actions */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#0057B8] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase">
                  Col {currentTemplate.columnKey} • {currentTemplate.badge}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getPlanBadgeColor(currentTemplate.planTier)}`}>
                  {currentTemplate.planTier}
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-display font-semibold text-slate-900">
                {currentTemplate.name}
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {currentTemplate.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2.5 pt-2 border-t border-slate-300/60">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Applicant Tracking System (ATS) optimized layout</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive ratings for Skills, Languages & Achievements</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Export ready: Word (.DOC) & Print PDF (.PDF)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onCreateCV(currentTemplate.id)}
                  className="flex-1 bg-[#0057B8] hover:bg-[#003d82] text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <DownloadMenu
                  data={data}
                  primaryColor={currentTemplate.primaryColor}
                  variant="compact"
                  label="Quick Download"
                  className="shrink-0"
                />
              </div>
            </div>

            {/* Right Column: Live Interactive CV Preview Card */}
            <div className="lg:col-span-7">
              <div className="relative group">
                <div 
                  onClick={() => onCreateCV(currentTemplate.id)}
                  className="cursor-pointer bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden transform group-hover:scale-[1.01] transition-transform duration-200 max-h-[600px] overflow-y-auto"
                >
                  <TemplateDispatcher
                    templateId={currentTemplate.id}
                    data={data}
                    primaryColor={currentTemplate.primaryColor}
                  />
                </div>

                <div 
                  onClick={() => onCreateCV(currentTemplate.id)}
                  className="absolute inset-0 bg-slate-900/5 hover:bg-slate-900/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer pointer-events-auto"
                >
                  <span className="bg-[#0057B8] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Click to Customize in CV Builder
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#e6f0fb] text-[#0057B8] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">DOC & PDF Downloads</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Save directly as editable Microsoft Word (.doc) or vector-sharp PDF for applications.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">12 Certified Templates</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Choose from Columns B through M spanning classic, timeline, sidebar, and executive styles.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#e4f7f7] text-[#007a7a] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">100% Privacy Focused</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Your data stays in your browser. Edit, draft, and print completely securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#dde3ef] py-8 text-center text-xs text-slate-500">
        <p className="text-sm font-bold" style={{ color: '#0057B8' }}>JobifyCV Cambodia</p>
        <p className="mt-2">Free CV builder for Cambodian job seekers · 🇰🇭 Made with ❤️ for Cambodia</p>
      </footer>
    </div>
  );
};
