import React, { useState } from 'react';
import { ShieldCheck, Lock, FileText, X, Check, Database, Trash2, Key } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
  onClearCloudData?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onClearCloudData,
}) => {
  const [activeSection, setActiveSection] = useState<'privacy' | 'terms' | 'data'>('privacy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/30 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Trust, Privacy & Terms of Service</h3>
              <p className="text-[11px] text-slate-400">GDPR & CCPA Compliant Resume Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveSection('privacy')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeSection === 'privacy'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveSection('terms')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeSection === 'terms'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveSection('data')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeSection === 'data'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Data Control & Security
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Your Resume Data Ownership</h4>
                <p>
                  You retain 100% ownership and copyright over all content, resumes, cover letters, and contact information entered into this application. We never sell, monetize, or rent your career data to recruitment brokers or third-party advertisers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Local Storage & Cloud Encryption</h4>
                <p>
                  By default, all draft edits are stored locally in your browser's private indexed/local storage. When signed in, resumes are synchronized over SSL/TLS 256-bit encrypted channels to your dedicated Firebase Firestore instance with strict per-user security rules (`request.auth.uid == resource.data.userId`).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. AI Privacy & Processing</h4>
                <p>
                  AI enhancement requests are processed transiently to improve bullet points and professional summaries. Your resumes are not used to train global public AI models.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'terms' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Permitted Use</h4>
                <p>
                  You are granted a worldwide, non-exclusive license to export, print, and share resumes generated on this platform for personal employment applications, recruiter communications, and career advancement.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. ATS Compliance & Warranties</h4>
                <p>
                  Our ATS-compliant templates are modeled after Harvard and Stanford career center guidelines and standard enterprise ATS parsing specifications (Workday, Greenhouse, Taleo, Lever). While our tools maximize parser scoring, hiring decisions ultimately remain with employers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Termination & Account Freedom</h4>
                <p>
                  You may export all your CV data as raw JSON, Word DOCX, or PDF at any time with zero lock-in.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Current Account & Storage Status</span>
                </div>
                <p className="text-[11px] text-indigo-800">
                  {userEmail ? (
                    <>Signed in as <strong className="font-mono">{userEmail}</strong>. Cloud sync is active.</>
                  ) : (
                    <>Operating in Guest Mode with local browser storage. No cloud account required to use.</>
                  )}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-900 text-sm">Data Portability & Erasure</h4>
                <p>
                  In accordance with GDPR Article 17 (Right to Erasure), you can clear all cached resumes and purge browser storage with one click.
                </p>
                {onClearCloudData && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all local and cloud cache?')) {
                        onClearCloudData();
                        onClose();
                      }
                    }}
                    className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Purge All Local Cache
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            256-Bit SSL Encrypted Connection
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg cursor-pointer transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
