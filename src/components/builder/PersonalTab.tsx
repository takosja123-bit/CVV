import React, { useRef, useState } from 'react';
import { PersonalInfo, CVStyleOptions } from '../../types';
import { Upload, X, Sparkles, User, Mail, Phone, MapPin, Globe, Calendar, Github, Linkedin, Contact } from 'lucide-react';
import { RichTextEditor } from '../common/RichTextEditor';
import { LayoutOptionsPopover } from './LayoutOptionsPopover';

interface PersonalTabProps {
  personal: PersonalInfo;
  style?: CVStyleOptions;
  onChange: (updated: PersonalInfo) => void;
  onChangeStyle?: (newStyle: CVStyleOptions) => void;
  onAIPolishSummary?: () => void;
  activePopover?: string | null;
  onTogglePopover?: (section: string) => void;
  onClosePopover?: () => void;
}

export const PersonalTab: React.FC<PersonalTabProps> = ({
  personal,
  style,
  onChange,
  onChangeStyle,
  onAIPolishSummary,
  activePopover: externalActivePopover,
  onTogglePopover: externalTogglePopover,
  onClosePopover: externalClosePopover,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFieldChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...personal,
      [field]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            ...personal,
            photoUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onChange({
      ...personal,
      photoUrl: '',
    });
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
  ];

  return (
    <div className="space-y-5">
      {/* Section Header with 3-Dot Layout Options Popover */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div
          onMouseEnter={() => openPopover('personal')}
          onClick={() => togglePopover('personal')}
          className="cursor-pointer group select-none"
          title="Hover or click for Layout Options"
        >
          <label className="text-[11px] font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1.5 group-hover:text-purple-700 transition-colors cursor-pointer">
            <Contact className="w-3.5 h-3.5 text-indigo-600 group-hover:text-purple-600 transition-colors" />
            <span>Personal Details & Header</span>
          </label>
          <p className="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors">
            Contact information, title headline, and profile summary
          </p>
        </div>
        <LayoutOptionsPopover
          sectionKey="personal"
          sectionTitle="Personal Details"
          style={style}
          onChangeStyle={onChangeStyle}
          isOpen={activePopover === 'personal'}
          onToggle={() => togglePopover('personal')}
          onOpen={() => openPopover('personal')}
          onClose={closePopover}
        />
      </div>

      {/* Profile Photo Area */}
      <div>
        <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">
          PROFILE PHOTO
        </label>
        <div className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          {personal.photoUrl ? (
            <div className="relative group shrink-0">
              <img
                src={personal.photoUrl}
                alt="Profile preview"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border border-slate-300 shadow-xs"
              />
              <button
                onClick={removePhoto}
                title="Remove photo"
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:border-slate-400 hover:text-slate-700 cursor-pointer shrink-0 transition-colors"
            >
              <User className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-2xs hover:bg-slate-50 cursor-pointer inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload photo
              </button>
              {personal.photoUrl && (
                <button
                  onClick={removePhoto}
                  className="text-xs text-slate-500 hover:text-red-600 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Click or drag & drop · JPG, PNG, WEBP
            </p>

            {/* Quick avatar presets */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400">Sample:</span>
              {sampleAvatars.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preset ${i}`}
                  referrerPolicy="no-referrer"
                  onClick={() => onChange({ ...personal, photoUrl: url })}
                  className="w-5 h-5 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-indigo-500 opacity-70 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Full Name & Job Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            FULL NAME
          </label>
          <input
            type="text"
            value={personal.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            JOB TITLE / HEADLINE
          </label>
          <input
            type="text"
            value={personal.jobTitle}
            onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
            placeholder="e.g. Software Engineer"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Gender & Date of Birth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            GENDER
          </label>
          <input
            type="text"
            value={personal.gender || ''}
            onChange={(e) => handleFieldChange('gender', e.target.value)}
            placeholder="e.g. Male / Female / Non-binary"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            DATE OF BIRTH
          </label>
          <input
            type="text"
            value={personal.birthDate || ''}
            onChange={(e) => handleFieldChange('birthDate', e.target.value)}
            placeholder="e.g. 05-02-1996"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>
      </div>

      {/* 2-Col: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            value={personal.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="johndoe@email.com"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            PHONE NUMBER
          </label>
          <input
            type="tel"
            value={personal.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="096-789-987"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Address & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            ADDRESS / LOCATION
          </label>
          <input
            type="text"
            value={personal.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            placeholder="Phnom Penh, Cambodia"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            PORTFOLIO / WEBSITE
          </label>
          <input
            type="text"
            value={personal.website}
            onChange={(e) => handleFieldChange('website', e.target.value)}
            placeholder="www.portfolio.dev"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>
      </div>

      {/* GitHub & LinkedIn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            GITHUB
          </label>
          <input
            type="text"
            value={personal.github || ''}
            onChange={(e) => handleFieldChange('github', e.target.value)}
            placeholder="github.com/username"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            LINKEDIN
          </label>
          <input
            type="text"
            value={personal.linkedin || ''}
            onChange={(e) => handleFieldChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/username"
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Summary / Profile */}
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            PROFESSIONAL SUMMARY
          </label>
          {onAIPolishSummary && (
            <button
              type="button"
              onClick={onAIPolishSummary}
              className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            >
              <Sparkles className="w-3 h-3 text-purple-600" />
              AI Polish Summary
            </button>
          )}
        </div>
        <RichTextEditor
          value={personal.summary}
          onChange={(newVal) => handleFieldChange('summary', newVal)}
          placeholder="Brief 2-4 sentence summary highlighting your background, years of experience, and signature strengths..."
          rows={4}
          maxRecommendedLength={500}
          enableActionVerbs={true}
          helperText="Keep summary concise (approx. 40-70 words). Use bold formatting for key metrics or titles."
        />
      </div>
    </div>
  );
};
