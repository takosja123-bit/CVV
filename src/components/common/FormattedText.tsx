import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Renders text supporting basic Markdown-style rich text:
 * **bold**, *italic*, __bold__, and `code/metric`.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split lines if multiline text
  const lines = text.split('\n');

  return (
    <span className={className}>
      {lines.map((line, lineIndex) => {
        // Regex to match **bold** or *italic*
        const parts: React.ReactNode[] = [];
        let remaining = line;
        let keyCounter = 0;

        // Pattern for **bold**, *italic*, __bold__
        const regex = /(\*\*([^*]+)\*\*|__([^_]+)__|(\*([^*]+)\*)|_([^_]+)_)/;

        while (remaining.length > 0) {
          const match = remaining.match(regex);
          if (!match) {
            parts.push(remaining);
            break;
          }

          const matchIndex = match.index || 0;
          if (matchIndex > 0) {
            parts.push(remaining.substring(0, matchIndex));
          }

          const fullMatch = match[0];
          if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
            parts.push(
              <strong key={keyCounter++} className="font-bold text-inherit">
                {match[2]}
              </strong>
            );
          } else if (fullMatch.startsWith('__') && fullMatch.endsWith('__')) {
            parts.push(
              <strong key={keyCounter++} className="font-bold text-inherit">
                {match[3]}
              </strong>
            );
          } else if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
            parts.push(
              <em key={keyCounter++} className="italic text-inherit">
                {match[5]}
              </em>
            );
          } else if (fullMatch.startsWith('_') && fullMatch.endsWith('_')) {
            parts.push(
              <em key={keyCounter++} className="italic text-inherit">
                {match[6]}
              </em>
            );
          } else {
            parts.push(fullMatch);
          }

          remaining = remaining.substring(matchIndex + fullMatch.length);
        }

        return (
          <React.Fragment key={lineIndex}>
            {parts}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
};
