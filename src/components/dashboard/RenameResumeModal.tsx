import React, { useState, useEffect } from 'react';
import { X, Edit3, Check } from 'lucide-react';
import { ResumeItem } from '../../types';

interface RenameResumeModalProps {
  resume: ResumeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRename: (id: string, newTitle: string) => void;
}

export const RenameResumeModal: React.FC<RenameResumeModalProps> = ({
  resume,
  isOpen,
  onClose,
  onRename,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (resume) {
      setTitle(resume.title);
    }
  }, [resume, isOpen]);

  if (!isOpen || !resume) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onRename(resume.id, title.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Rename Resume</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resume Title
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Title</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

