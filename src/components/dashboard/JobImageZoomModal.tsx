import React, { useState, useEffect } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  Building,
  Image as ImageIcon,
} from 'lucide-react';

interface JobImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null;
  jobTitle?: string;
  companyName?: string;
}

export const JobImageZoomModal: React.FC<JobImageZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  jobTitle = 'Recruitment Poster',
  companyName = 'Hiring Company',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullWindow, setIsFullWindow] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
    }
  }, [isOpen, imageUrl]);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoomLevel((prev) => Math.min(prev + 0.25, 3));
      if (e.key === '-' || e.key === '_') setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
      if (e.key === '0') setZoomLevel(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${companyName.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}_poster.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 shadow-2xl shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h3 className="text-sm font-bold text-white truncate flex items-center gap-2">
              <span>{jobTitle}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 border border-slate-700">
                Full Poster View
              </span>
            </h3>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
              <Building className="w-3 h-3 text-slate-500" />
              <span>{companyName}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Out */}
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom % */}
          <span className="text-xs font-mono text-slate-300 w-12 text-center font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>

          {/* Zoom In */}
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 3))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            title="Reset Zoom (0)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit</span>
          </button>

          <div className="w-px h-5 bg-slate-800 mx-1" />

          {/* Download Image */}
          <button
            onClick={handleDownload}
            className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Download Poster File"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer ml-1"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Zoom Canvas Zone */}
      <div className="w-full flex-1 overflow-auto flex items-center justify-center p-4 my-2">
        <div
          className="transition-transform duration-150 ease-out origin-center flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={imageUrl}
            alt={`${jobTitle} poster`}
            className="max-h-[78vh] max-w-[85vw] object-contain rounded-xl shadow-2xl border border-slate-800/80 bg-slate-900"
          />
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800/80 px-4 py-1.5 rounded-full shrink-0 flex items-center gap-4">
        <span>Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white text-[10px]">+</kbd> or <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white text-[10px]">-</kbd> to zoom</span>
        <span>•</span>
        <span>Scroll to pan</span>
        <span>•</span>
        <span>Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white text-[10px]">Esc</kbd> to exit</span>
      </div>
    </div>
  );
};
