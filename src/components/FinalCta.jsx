import React from 'react';
import { ClipboardCheck, Search, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FinalCta({ onOpenApply, onOpenVerify }) {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-[#072036] via-[#0a3a60] to-[#082a47] text-white relative overflow-hidden border-t border-sky-950/80">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="cta-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide text-amber-300 mb-6 shadow-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Smart India Hackathon 2026 • PS ID: 26036</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          Ready to Simplify Verification?
        </h2>

        <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto mb-8 leading-relaxed">
          Apply online, track verification, access digital certificates and verify instruments through one unified platform.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenApply}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-400/20 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
          >
            <ClipboardCheck className="w-5 h-5 text-slate-950" />
            <span>Apply for Verification</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={onOpenVerify}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 hover:border-white/40 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm"
          >
            <Search className="w-5 h-5 text-sky-300" />
            <span>Verify Certificate</span>
          </button>
        </div>

      </div>
    </section>
  );
}
