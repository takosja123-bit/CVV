import React, { useRef, useState, useEffect } from 'react';
import { CVData, TemplateId, TemplateConfig } from '../../types';
import { TEMPLATES } from '../../data/initialData';
import { TemplateDispatcher } from '../templates/TemplateDispatcher';
import { ChevronLeft, ChevronRight, Check, Sparkles, ArrowRight, Eye, UserCheck } from 'lucide-react';

// Specific sample profiles matching the screenshot archetypes
const SAMPLE_PROFILES: Record<string, Partial<CVData>> = {
  'template-b': {
    personal: {
      fullName: 'SAM HILL',
      jobTitle: 'Customer Service Rep with 98% Customer Satisfaction Rate',
      email: 'sam_hill@example.com',
      phone: '+44 76578 578332',
      address: '29 Bentley Close, WA15 16B Watford',
      summary:
        'I am a Customer Service Representative with over 2 years of experience in retail environments, including sales, tech support, and customer care. I am adept in customer care software, conflict resolution and quickly developing product knowledge, with an NVQ Level 2 qualification in Customer Service. I enjoy helping clients, customers and individuals, and solving any problems that they may have.',
    },
    experiences: [
      {
        id: 'exp-sh-1',
        jobTitle: 'Customer Service Associate',
        company: 'Hemsley Financial Services, Watford',
        startDate: 'Jan 2019',
        endDate: 'Present',
        current: true,
        bullets: [
          'Answered 80+ incoming calls per day and consistently met targets for call length and call waiting times.',
          'Delivered high-quality customer service, winning compliments from 15 customers.',
          'Received an average feedback rating of 98% on monthly customer satisfaction surveys.',
        ],
      },
      {
        id: 'exp-sh-2',
        jobTitle: 'Customer Service Agent',
        company: 'Primark, Watford',
        startDate: 'Sep 2016',
        endDate: 'Dec 2018',
        current: false,
        bullets: [
          'Resolved 95% of all allocated complaints within a 7-day timeline and won best customer service agent of the month.',
          'Sold over 200 units of luxury goods daily and generated £700 in additional revenue.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-sh-1',
        institution: 'City of Westminster College, London',
        degree: 'NVQ Certificate/Diploma in Customer Service: Level 2',
        endDate: 'Jul 2015 - Aug 2016',
        details:
          'Modules: delivering customer, understanding customers, principles of customer service, understanding employer organisations and managing personal performance and development',
      },
      {
        id: 'edu-sh-2',
        institution: "Regent's University, London, London",
        degree: 'BA (Hons) Media Communications: 2:1',
        endDate: 'Sep 2012 - Jun 2015',
      },
    ],
    skills: [
      { name: 'Interpersonal', level: 5 },
      { name: 'Accounting', level: 4 },
      { name: 'Conflict resolution', level: 5 },
      { name: 'Product knowledge', level: 4 },
    ],
  },
  'template-c': {
    personal: {
      fullName: 'Peter Madison',
      jobTitle: 'Masters-Qualified Pharmacist',
      email: 'peter_madison@example.com',
      phone: '+44 76379 896573',
      address: '10 Heyward Close, BD11 1ND Leeds',
      summary:
        'I am a qualified pharmacist, adept at administering medication and monitoring supplies. With a Master’s degree in pharmacy (MPharm), I have a strong pharmacological and medical background, as well as in-depth knowledge of GPhC standards. I also speak fluent German, which I enjoy using to communicate and work with global pharmaceutical companies.',
    },
    experiences: [
      {
        id: 'exp-pm-1',
        jobTitle: 'Pharmacist',
        company: "Taylor's Pharmacy, Leeds",
        startDate: 'Sep 2019',
        endDate: 'Present',
        current: true,
        bullets: [
          'Managing the entire inventory of medicines, ensuring the correct preparation of prescriptions.',
          'Administering flu vaccinations to retail companies.',
          'Liaising with pharmaceutical companies to upsell non-medical and supplementary products to customers: generating £100 in additional revenue.',
          'Creating and updating standard operating procedures (SOPs) and conducting regular audits.',
        ],
      },
      {
        id: 'exp-pm-2',
        jobTitle: 'Student Pharmacist',
        company: 'Boots Pharmacy, Leeds',
        startDate: 'Sep 2018',
        endDate: 'Aug 2019',
        current: false,
        bullets: [
          'Handled 50 prescriptions daily and dispensed advice on the safe and correct use of medicines.',
          'Supported 6 pharmacy staff as a locus pharmacist.',
          'Provided excellent customer service in a busy high-street pharmacy that served 200+ customers a day.',
          'Managed dispensary stock and maintained audit records, reducing wastage.',
          'Implanted a filing system that cut customer waiting times by 50%.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-pm-1',
        institution: 'University of Leeds',
        degree: 'Master of Pharmacy (MPharm): 1st Class Honours',
        endDate: '2014 - 2018',
        details: 'GPhC Certified & Registered Pharmacist (Member of Royal Pharmaceutical Society)',
      },
    ],
    achievements: [
      {
        id: 'ach-pm-1',
        title: 'Member of the Royal Pharmaceutical Society',
        date: '2018 - present',
        description: 'Active member participating in annual clinical audits and continuous professional training.',
      },
    ],
  },
  'template-d': {
    personal: {
      fullName: 'Joanna Brown',
      jobTitle: "Registered Nurse with 8 Years' Experience in Geriatric Care",
      email: 'j_brown@example.com',
      phone: '0123 456 7890',
      address: '123 Beeston Fields Drive, NG9 3DB Beeston',
      summary:
        'I am a Registered Nurse with 8 years of experience in providing care to elderly patients with complex health needs. My training and experience lies in working with patients with acute and chronic conditions and delivering emergency medical care. I am NMC registered and have an advanced nursing degree. I am now seeking a role as a senior nurse within a care home setting.',
    },
    experiences: [
      {
        id: 'exp-jb-1',
        jobTitle: 'Senior Nurse',
        company: 'Woodfield Hospital, Ipswich',
        startDate: 'Apr 2018',
        endDate: 'Present',
        current: true,
        bullets: [
          'Provided daily care for 6 elderly patients after major surgical procedures in an ICU unit by monitoring vital signs and administering medication.',
          'Collaborated with doctors to develop long-term care plans after hospital stays.',
          'Supervised 4 Certified Nursing Assistants (CNAs) working in the unit.',
        ],
      },
      {
        id: 'exp-jb-2',
        jobTitle: 'Registered Nurse',
        company: 'Ashfield Care Home, Kent',
        startDate: 'Feb 2014',
        endDate: 'Mar 2018',
        current: false,
        bullets: [
          'Worked with the unit manager to take care of 35 frail and elderly patients with complex health needs.',
          'Responsible for administering medicine safely, in accordance with the Nursing Midwifery Council guidelines.',
          'Managed the unit’s revenue and budget, including the allocation of funds for patient care, equipment, and staff supplies.',
        ],
      },
      {
        id: 'exp-jb-3',
        jobTitle: 'Healthcare Assistant',
        company: 'Chase Care Home, Suffolk',
        startDate: 'Nov 2013',
        endDate: 'Jan 2014',
        current: false,
        bullets: [
          'Responsible for the safety and well-being of elderly people with dementia and challenging behaviour.',
          'Worked with palliative care teams to help deliver end of life care to patients.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-jb-1',
        institution: 'University of London, London',
        degree: 'Adult Nursing BSc Hons: 2:1',
        endDate: 'Sep 2010 - Jul 2013',
        details:
          'Modules included: integrated approaches to complex care, principles of prescribing, acute care management and working collaboratively',
      },
    ],
    skills: [
      { name: 'ICU', level: 5 },
      { name: 'Leadership', level: 4 },
      { name: 'Empathy', level: 5 },
      { name: 'Communication', level: 5 },
      { name: 'Time management', level: 4 },
    ],
  },
};

interface TemplateCarouselProps {
  data: CVData;
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onCreateCV: (templateId?: TemplateId) => void;
}

export const TemplateCarousel: React.FC<TemplateCarouselProps> = ({
  data,
  selectedTemplate,
  onSelectTemplate,
  onCreateCV,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [useSampleData, setUseSampleData] = useState<boolean>(true);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Check scroll positions for disabling arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -480,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 480,
        behavior: 'smooth',
      });
    }
  };

  const getTemplateRenderData = (templateId: TemplateId) => {
    if (useSampleData && SAMPLE_PROFILES[templateId]) {
      return {
        ...data,
        ...SAMPLE_PROFILES[templateId],
        personal: {
          ...data.personal,
          ...SAMPLE_PROFILES[templateId]?.personal,
        },
      };
    }
    return data;
  };

  return (
    <div className="relative w-full py-6">
      {/* Top Controls Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Browse All {TEMPLATES.length} Designs
          </span>
          <span className="text-[11px] text-slate-500">• Scroll or use navigation arrows</span>
        </div>

        {/* Toggle Sample CV vs User Data */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setUseSampleData(true)}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
              useSampleData
                ? 'bg-[#1e293b] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curated Samples (Sam Hill, Peter, Joanna)
          </button>
          <button
            type="button"
            onClick={() => setUseSampleData(false)}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
              !useSampleData
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Custom CV Data
          </button>
        </div>
      </div>

      {/* Main Carousel Area with Overlaid Circular Arrow Buttons */}
      <div className="relative w-full overflow-hidden bg-[#EDEDE9] py-8 border-y border-[#E2DFD8]">
        {/* Left Arrow Button matching screenshot */}
        <button
          type="button"
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
          aria-label="Previous Templates"
          className={`absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#272a31] text-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#111317] hover:scale-105 active:scale-95 ${
            !canScrollLeft ? 'opacity-40 cursor-not-allowed' : 'opacity-95 hover:opacity-100'
          }`}
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
        </button>

        {/* Right Arrow Button matching screenshot */}
        <button
          type="button"
          onClick={handleScrollRight}
          disabled={!canScrollRight}
          aria-label="Next Templates"
          className={`absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#272a31] text-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#111317] hover:scale-105 active:scale-95 ${
            !canScrollRight ? 'opacity-40 cursor-not-allowed' : 'opacity-95 hover:opacity-100'
          }`}
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
        </button>

        {/* Scrollable Templates Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-6 md:gap-8 overflow-x-auto px-6 md:px-14 scrollbar-none snap-x snap-mandatory py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplate;
            const renderData = getTemplateRenderData(tmpl.id);

            return (
              <div
                key={tmpl.id}
                className="shrink-0 snap-center flex flex-col group"
                style={{ width: 'clamp(380px, 32vw, 490px)' }}
              >
                {/* Template Info Pill */}
                <div className="flex items-center justify-between px-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300 shadow-2xs">
                      Col {tmpl.columnKey}: {tmpl.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      {tmpl.planTier}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>

                {/* CV Document Card matching screenshot */}
                <div
                  onClick={() => {
                    onSelectTemplate(tmpl.id);
                  }}
                  className={`bg-white rounded-xs shadow-md group-hover:shadow-2xl transition-all duration-300 border overflow-hidden relative cursor-pointer flex flex-col justify-between h-[660px] md:h-[720px] ${
                    isSelected
                      ? 'ring-4 ring-indigo-600/40 border-indigo-600 scale-[1.01]'
                      : 'border-slate-300/80 hover:border-slate-400'
                  }`}
                >
                  {/* Embedded Live Template Document */}
                  <div className="w-full h-full overflow-y-auto pointer-events-auto bg-white select-text">
                    <TemplateDispatcher
                      templateId={tmpl.id}
                      data={renderData}
                      primaryColor={tmpl.primaryColor}
                    />
                  </div>

                  {/* Hover Action Overlay */}
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col justify-end p-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(tmpl.id);
                        onCreateCV(tmpl.id);
                      }}
                      className="pointer-events-auto w-full bg-[#1e293b] hover:bg-black text-white text-xs font-bold py-3 rounded-md shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
                    >
                      <span>Use & Edit Template (Col {tmpl.columnKey})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
