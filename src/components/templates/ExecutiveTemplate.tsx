import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { SkillItemRow } from './TemplateHelpers';

interface TemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, primaryColor = '#4c1d95' }) => {
  const { personal, experiences, education, skills, projects, certifications } = data;

  return (
    <div className="bg-[#FAF9F6] text-slate-800 w-full min-h-full font-sans-ui flex flex-col shadow-sm rounded-sm overflow-hidden border border-slate-200">
      {/* Header Container with Centered Executive Luxury */}
      <div className="px-10 pt-10 pb-6 text-center border-b border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto space-y-2">
          {personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={personal.fullName}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 shadow-md border-2"
              style={{ borderColor: primaryColor }}
            />
          )}
          <h1 className="text-3xl font-serif-title font-semibold tracking-wide text-slate-900">
            {personal.fullName || 'Your Name'}
          </h1>
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-500" style={{ color: primaryColor }}>
            {personal.jobTitle || 'Senior Executive'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-100 mt-3">
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {personal.phone}
              </span>
            )}
            {personal.address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {personal.address}
              </span>
            )}
            {personal.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                {personal.website}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Executive Body */}
      <div className="p-10 space-y-6 flex-1 bg-white">
        {/* Executive Summary */}
        {personal.summary && (
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200" style={{ color: primaryColor }}>
              EXECUTIVE PROFILE
            </h2>
            <p className="text-xs leading-relaxed text-slate-700 font-serif-body italic">
              "{personal.summary}"
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-900 pb-1 mb-3 border-b border-slate-200" style={{ color: primaryColor }}>
              CAREER HISTORY & LEADERSHIP
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{exp.jobTitle}</span>
                      <span className="text-slate-600 block font-medium">{exp.company}</span>
                    </div>
                    <span className="text-slate-500 text-[11px] font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets && (
                    <ul className="space-y-1 text-xs text-slate-700 pl-3">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="list-disc list-outside leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Col Bottom Row */}
        <div className="grid grid-cols-2 gap-8 pt-2">
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest uppercase text-slate-900 pb-1 mb-3 border-b border-slate-200" style={{ color: primaryColor }}>
                EDUCATION & CREDENTIALS
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-slate-900">{edu.institution}</p>
                    <p className="text-slate-700">{edu.degree}</p>
                    <p className="text-[11px] text-slate-500">{edu.endDate || edu.startDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest uppercase text-slate-900 pb-1 mb-3 border-b border-slate-200" style={{ color: primaryColor }}>
                CORE COMPETENCIES
              </h2>
              <div className={data.skillStyle === 'tags' || data.skillStyle === 'badges' ? 'flex flex-wrap gap-1.5' : 'space-y-2'}>
                {skills.map((skill, index) => (
                  <SkillItemRow
                    key={index}
                    item={skill}
                    style={data.skillStyle || 'badges'}
                    primaryColor={primaryColor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
