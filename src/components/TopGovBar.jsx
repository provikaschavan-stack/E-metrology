import React, { useState } from 'react';
import { Globe, HelpCircle } from 'lucide-react';

export default function TopGovBar({ onOpenHelp }) {
  const [lang, setLang] = useState('en');
  const [fontSizeOffset, setFontSizeOffset] = useState(0);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const adjustFont = (delta) => {
    if (delta === 0) {
      setFontSizeOffset(0);
      document.documentElement.style.fontSize = '16px';
    } else {
      const next = Math.max(-2, Math.min(4, fontSizeOffset + delta));
      setFontSizeOffset(next);
      document.documentElement.style.fontSize = `${16 + next}px`;
    }
  };

  return (
    <div className="relative bg-[#072036] text-slate-200 border-b border-sky-950/60 text-xs py-1.5 px-3 sm:px-6 lg:px-8 z-40">
      {/* Indian Tricolor Top Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] flex">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-[#ffffff]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 pt-0.5">
        
        {/* Left Side Government Title */}
        {false && (
        <div className="flex items-center gap-2 max-w-full">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-[10px] sm:text-[11px] shrink-0">
            <span className="text-xs">🇮🇳</span>
            <span className="font-semibold text-slate-100 tracking-normal truncate">
              {lang === 'en' ? 'Government Digital Legal Metrology Service' : 'सरकारी डिजिटल विधिक मापविज्ञान सेवा'}
            </span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-sky-950/90 text-sky-300 border border-sky-700/50 px-2 py-0.5 rounded-md font-mono shrink-0">
            <span>SIH-2026</span>
            <span className="text-sky-500">•</span>
            <span>PS ID: 26036</span>
          </span>
        </div>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-slate-300 text-[10px] sm:text-[11px]">
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition-all cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold">{lang === 'en' ? 'English' : 'English'}</span>
            <span className="text-slate-600">/</span>
            <span className={lang === 'hi' ? 'text-amber-300 font-bold' : 'text-slate-300'}>हिन्दी</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Accessibility Font Size Controls */}
          <div className="flex items-center gap-0.5 bg-slate-900/90 px-1 py-0.5 rounded border border-slate-700/80">
            <span className="text-[10px] text-slate-400 px-1 hidden sm:inline font-medium">Text:</span>
            <button
              onClick={() => adjustFont(-1)}
              className="px-1 py-0.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-[10px] font-bold cursor-pointer"
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => adjustFont(0)}
              className="px-1 py-0.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-[10px] font-medium cursor-pointer"
              title="Default Font Size"
            >
              A
            </button>
            <button
              onClick={() => adjustFont(1)}
              className="px-1 py-0.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-[10px] font-bold cursor-pointer"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Help button */}
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-900/40 hover:bg-sky-900 text-sky-200 hover:text-white transition-all cursor-pointer border border-sky-700/40"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold">Helpdesk</span>
          </button>
        </div>

      </div>
    </div>
  );
}
