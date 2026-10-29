import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { ThemeMode } from '../types';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  pythonSyntax: string;
  isError: boolean;
  theme: ThemeMode;
  onClear: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  pythonSyntax,
  isError,
  theme,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = result || '0';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Dynamic font sizing based on length to prevent layout breakage
  const getResultFontSize = (text: string) => {
    const len = text.length;
    if (len > 18) return 'text-2xl sm:text-3xl';
    if (len > 12) return 'text-3xl sm:text-4xl';
    if (len > 8) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  return (
    <div
      className={`relative w-full rounded-2xl p-5 sm:p-6 transition-all duration-200 border shadow-inner ${
        theme === 'dark'
          ? 'bg-slate-950/70 border-slate-800/80 text-white'
          : 'bg-slate-50/90 border-slate-200 text-slate-900'
      }`}
    >
      {/* Top row: Python Expression & Live Syntax Badge */}
      <div className="flex items-center justify-between gap-2 min-h-6 text-xs mb-2">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span
            className={`font-mono text-xs truncate ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
            title={pythonSyntax || 'python: 0'}
          >
            {pythonSyntax ? `>>> ${pythonSyntax}` : '>>> pronto para calcular'}
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`shrink-0 p-1.5 rounded-md text-xs transition-colors ${
            copied
              ? 'text-emerald-500 bg-emerald-500/10'
              : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
          }`}
          title="Copiar resultado"
          aria-label="Copiar resultado para a área de transferência"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Middle row: Active UI Formula / Expression */}
      <div
        className={`h-7 overflow-x-auto text-right font-mono text-sm tracking-wide select-all scrollbar-none transition-colors ${
          theme === 'dark' ? 'text-indigo-300/80' : 'text-indigo-600/90'
        }`}
      >
        {expression || ' '}
      </div>

      {/* Main row: Value Display */}
      <div className="flex items-baseline justify-end gap-1 mt-1 overflow-x-hidden">
        <span
          className={`font-semibold font-mono tracking-tight tabular-nums select-all text-right break-all transition-all ${
            getResultFontSize(result || '0')
          } ${
            isError
              ? 'text-rose-500 font-bold'
              : theme === 'dark'
                ? 'text-white'
                : 'text-slate-900'
          }`}
        >
          {result || '0'}
        </span>
      </div>
    </div>
  );
};
