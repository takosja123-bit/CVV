import React from 'react';
import { CVData, TemplateId } from '../../types';
import { sanitizeCVData } from '../../utils/sanitizeData';
import { TemplateB } from './TemplateB';
import { TemplateC } from './TemplateC';
import { TemplateD } from './TemplateD';
import { TemplateE } from './TemplateE';
import { TemplateF } from './TemplateF';
import { TemplateG } from './TemplateG';
import { TemplateH } from './TemplateH';
import { TemplateI } from './TemplateI';
import { TemplateJ } from './TemplateJ';
import { TemplateK } from './TemplateK';
import { TemplateL } from './TemplateL';
import { TemplateM } from './TemplateM';
import { TemplateBlackBadge } from './TemplateBlackBadge';
import { TemplateTealGrid } from './TemplateTealGrid';
import { TemplateSageSidebar } from './TemplateSageSidebar';
import { TemplateATSClassic } from './TemplateATSClassic';
import { TemplateATSModern } from './TemplateATSModern';
import { TemplateATSExecutive } from './TemplateATSExecutive';
import { TemplateN } from './TemplateN';
import { TemplateO } from './TemplateO';
import { TemplateP } from './TemplateP';
import { TemplateQ } from './TemplateQ';
import { TemplateR } from './TemplateR';
import { TemplateS } from './TemplateS';
import { TemplateT } from './TemplateT';

interface TemplateDispatcherProps {
  templateId: TemplateId;
  data: CVData;
  primaryColor?: string;
}

export const TemplateDispatcher: React.FC<TemplateDispatcherProps> = ({
  templateId,
  data,
  primaryColor,
}) => {
  const safeData = sanitizeCVData(data);

  switch (templateId) {
    case 'template-ats-classic':
      return <TemplateATSClassic data={safeData} primaryColor={primaryColor || '#111827'} />;

    case 'template-ats-modern':
      return <TemplateATSModern data={safeData} primaryColor={primaryColor || '#0f172a'} />;

    case 'template-ats-executive':
      return <TemplateATSExecutive data={safeData} primaryColor={primaryColor || '#1e293b'} />;

    case 'template-b':
    case 'classic':
      return <TemplateB data={safeData} primaryColor={primaryColor || '#1e3a5f'} />;

    case 'template-c':
      return <TemplateC data={safeData} primaryColor={primaryColor || '#3a352f'} />;

    case 'template-d':
    case 'modern':
      return <TemplateD data={safeData} primaryColor={primaryColor || '#475569'} />;

    case 'template-e':
    case 'red':
      return <TemplateE data={safeData} primaryColor={primaryColor || '#881337'} />;

    case 'template-f':
      return <TemplateF data={safeData} primaryColor={primaryColor || '#064e3b'} />;

    case 'template-g':
    case 'minimalist':
      return <TemplateG data={safeData} primaryColor={primaryColor || '#d97706'} />;

    case 'template-h':
      return <TemplateH data={safeData} primaryColor={primaryColor || '#1b4332'} />;

    case 'template-i':
      return <TemplateI data={safeData} primaryColor={primaryColor || '#0891b2'} />;

    case 'template-j':
      return <TemplateJ data={safeData} primaryColor={primaryColor || '#e11d48'} />;

    case 'template-k':
      return <TemplateK data={safeData} primaryColor={primaryColor || '#1d4ed8'} />;

    case 'template-l':
      return <TemplateL data={safeData} primaryColor={primaryColor || '#f97316'} />;

    case 'template-m':
    case 'teal':
    case 'executive':
      return <TemplateM data={safeData} primaryColor={primaryColor || '#0284c7'} />;

    case 'template-black-badge':
      return <TemplateBlackBadge data={safeData} primaryColor={primaryColor || '#000000'} />;

    case 'template-teal-grid':
      return <TemplateTealGrid data={safeData} primaryColor={primaryColor || '#3b8478'} />;

    case 'template-sage-sidebar':
      return <TemplateSageSidebar data={safeData} primaryColor={primaryColor || '#67917f'} />;

    case 'template-n':
      return <TemplateN data={safeData} primaryColor={primaryColor || '#334155'} />;

    case 'template-o':
      return <TemplateO data={safeData} primaryColor={primaryColor || '#4338ca'} />;

    case 'template-p':
      return <TemplateP data={safeData} primaryColor={primaryColor || '#1f2937'} />;

    case 'template-q':
      return <TemplateQ data={safeData} primaryColor={primaryColor || '#78350f'} />;

    case 'template-r':
      return <TemplateR data={safeData} primaryColor={primaryColor || '#be123c'} />;

    case 'template-s':
      return <TemplateS data={safeData} primaryColor={primaryColor || '#0ea5e9'} />;

    case 'template-t':
      return <TemplateT data={safeData} primaryColor={primaryColor || '#0f766e'} />;

    default:
      return <TemplateB data={safeData} primaryColor={primaryColor || '#1e3a5f'} />;
  }
};
