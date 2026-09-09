import React, { useRef } from 'react';
import { Bold, Italic, List, Percent, Sparkles, AlertCircle } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  maxRecommendedLength?: number;
  label?: string;
  helperText?: string;
  enableActionVerbs?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Type your content here...',
  rows = 4,
  maxRecommendedLength = 600,
  label,
  helperText,
  enableActionVerbs = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';

    const before = value.substring(0, start);
    const after = value.substring(end);

    const updated = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange(updated);

    // Restore selection inside formatted text
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selectedText.length
        );
      }
    }, 10);
  };

  const insertBullet = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = value.substring(0, start);
    const after = value.substring(start);

    // If starting a newline
    const prefix = before.length === 0 || before.endsWith('\n') ? '• ' : '\n• ';
    const updated = `${before}${prefix}${after}`;
    onChange(updated);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }
    }, 10);
  };

  const insertActionVerb = () => {
    const verbs = [
      'Spearheaded',
      'Orchestrated',
      'Engineered',
      'Architected',
      'Accelerated',
      'Maximized',
      'Pioneered',
      'Streamlined',
      'Delivered',
      'Revamped',
    ];
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = value.substring(0, start);
    const after = value.substring(start);

    const prefix = before.length === 0 || before.endsWith('\n') || before.endsWith(' ') ? '' : ' ';
    const updated = `${before}${prefix}${randomVerb} ${after}`;
    onChange(updated);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length + randomVerb.length + 1, start + prefix.length + randomVerb.length + 1);
      }
    }, 10);
  };

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const lineCount = value ? value.split('\n').length : 0;
  const isOverflowWarning = charCount > maxRecommendedLength;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
          <div className="flex items-center gap-2 text-[10px]">
            <span className={isOverflowWarning ? 'text-amber-600 font-bold' : 'text-slate-400'}>
              {charCount} chars · {wordCount} words
            </span>
          </div>
        </div>
      )}

      <div
        className={`rounded-lg border bg-white overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 ${
          isOverflowWarning ? 'border-amber-300' : 'border-slate-200'
        }`}
      >
        {/* Formatting Toolbar */}
        <div className="flex items-center justify-between bg-slate-50 px-2 py-1 border-b border-slate-200/80 text-xs">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => applyFormatting('**', '**')}
              title="Bold (**text**)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 hover:text-slate-950 font-bold transition-colors cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyFormatting('*', '*')}
              title="Italic (*text*)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 hover:text-slate-950 italic transition-colors cursor-pointer"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={insertBullet}
              title="Insert Bullet Point (•)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            {enableActionVerbs && (
              <button
                type="button"
                onClick={insertActionVerb}
                title="Insert Strong Action Verb (Spearheaded, Architected, etc.)"
                className="flex items-center gap-1 px-1.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-[11px] transition-colors cursor-pointer ml-1"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Action Verb</span>
              </button>
            )}
          </div>

          <div className="text-[10px] text-slate-400 select-none">
            {lineCount > 1 ? `${lineCount} lines` : ''}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-y leading-relaxed font-sans"
        />
      </div>

      {/* Overflow Warning or Helper Text */}
      {isOverflowWarning ? (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>
            <strong>Page Overflow Warning:</strong> This field ({charCount} characters) is likely to push your resume onto a second page. Consider keeping it concise.
          </span>
        </div>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
