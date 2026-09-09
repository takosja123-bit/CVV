import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Search,
  Edit3,
  Copy,
  Trash2,
  Download,
  FileText,
  Printer,
  Sparkles,
  ExternalLink,
  Check,
  Send,
} from 'lucide-react';
import { CoverLetterItem } from '../../types';

interface CoverLettersViewProps {
  coverLetters: CoverLetterItem[];
  onCreateNew: () => void;
  onEdit: (letter: CoverLetterItem) => void;
  onDuplicate: (letter: CoverLetterItem) => void;
  onDelete: (id: string) => void;
}

export const CoverLettersView: React.FC<CoverLettersViewProps> = ({
  coverLetters,
  onCreateNew,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewLetter, setActivePreviewLetter] = useState<CoverLetterItem | null>(null);

  const filteredLetters = coverLetters.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadDoc = (letter: CoverLetterItem) => {
    const fileName = `${letter.title.replace(/\s+/g, '_')}.doc`;
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${letter.title}</title>
      <style>
        body { font-family: 'Calibri', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; margin: 40pt; }
        .sender { margin-bottom: 20pt; }
        .recipient { margin-bottom: 20pt; }
        .date { margin-bottom: 20pt; color: #64748b; }
        .body { white-space: pre-line; }
      </style>
      </head>
      <body>
        <div class="sender">
          <strong>${letter.senderName}</strong><br/>
          ${letter.senderEmail} | ${letter.senderPhone}<br/>
          ${letter.senderAddress}
        </div>
        <div class="date">${new Date(letter.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div class="recipient">
          <strong>${letter.recipientName}</strong><br/>
          ${letter.companyName}<br/>
          Position: ${letter.jobTitle}
        </div>
        <div class="body">${letter.body}</div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Cover Letters
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create and customize targeted cover letters that match your resumes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cover letters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-44 md:w-56 transition-all"
            />
          </div>

          <button
            onClick={onCreateNew}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Cover Letter</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Create New Card */}
          <div className="flex flex-col">
            <button
              onClick={onCreateNew}
              className="w-full aspect-[1/1.414] rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group shadow-2xs active:scale-[0.99]"
            >
              <div className="text-slate-400 group-hover:text-emerald-600 transition-colors flex flex-col items-center gap-3">
                <span className="font-semibold text-sm text-slate-500 group-hover:text-emerald-600">
                  Create cover letter
                </span>
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-transform font-light" />
              </div>
            </button>
            <div className="mt-2.5 h-10 invisible" />
          </div>

          {/* Render Cover Letters */}
          {filteredLetters.map((letter) => (
            <div key={letter.id} className="flex flex-col group">
              <div
                onClick={() => onEdit(letter)}
                className="relative w-full aspect-[1/1.414] bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer overflow-hidden"
              >
                {/* Mini letter visual header */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Cover Letter
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs truncate">
                    {letter.companyName || 'Company Name'}
                  </h4>
                  <div className="text-[11px] text-emerald-700 font-medium truncate mb-3">
                    {letter.jobTitle || 'Role Position'}
                  </div>

                  <div className="text-[10px] text-slate-500 line-clamp-6 leading-relaxed font-serif">
                    {letter.body}
                  </div>
                </div>

                {/* Bottom metadata */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {letter.senderName || 'Author'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadDoc(letter);
                      }}
                      title="Download as Word Doc"
                      className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(letter);
                      }}
                      title="Duplicate"
                      className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(letter.id);
                      }}
                      title="Delete"
                      className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Title below */}
              <div className="mt-2.5">
                <h3
                  onClick={() => onEdit(letter)}
                  className="font-bold text-slate-900 text-sm tracking-tight truncate hover:text-emerald-600 cursor-pointer transition-colors"
                >
                  {letter.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edited {new Date(letter.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
