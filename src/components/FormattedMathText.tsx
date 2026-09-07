import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface FormattedMathTextProps {
  text: string;
  className?: string;
}

export const FormattedMathText: React.FC<FormattedMathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  const renderContent = () => {
    // Regex matching \(...\) or \[...\] or \frac{...}{...} or \log(...) expressions
    const mathRegex = /(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\\frac\{[^}]+\}\{[^}]+\}(?:\s*=\s*\d+)?|\\log\([^)]+\)(?:\s*[-+*/]\s*\\log\([^)]+\))*(?:\s*=\s*[^.\n,]+)?|\\Rightarrow|\\cdot|\\neq|\\approx)/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    const containsMath = text.includes('\\(') || text.includes('\\[') || text.includes('\\frac') || text.includes('\\log') || text.includes('\\Rightarrow') || text.includes('\\cdot');

    if (containsMath) {
      while ((match = mathRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(<span key={`t_${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>);
        }

        let mathStr = match[0].trim();
        // Unwrap \(...\) or \[...\]
        if (mathStr.startsWith('\\(') && mathStr.endsWith('\\)')) {
          mathStr = mathStr.substring(2, mathStr.length - 2).trim();
        } else if (mathStr.startsWith('\\[') && mathStr.endsWith('\\]')) {
          mathStr = mathStr.substring(2, mathStr.length - 2).trim();
        }

        try {
          const html = katex.renderToString(mathStr, {
            displayMode: false,
            throwOnError: false,
          });
          parts.push(
            <span
              key={`m_${match.index}`}
              className="katex-inline-math"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          parts.push(<span key={`err_${match.index}`}>{mathStr}</span>);
        }

        lastIndex = mathRegex.lastIndex;
      }

      if (lastIndex < text.length) {
        parts.push(<span key={`t_end`}>{text.substring(lastIndex)}</span>);
      }

      return parts;
    }

    return text;
  };

  return <span className={`math-text-container ${className}`}>{renderContent()}</span>;
};
