import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  ClipboardCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  FileText, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import MetrologyScene from './MetrologyScene';

export default function Hero({ onOpenApply, onOpenVerify, onOpenTrack: _onOpenTrack, onSelectSampleCert }) {
  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#072036] via-[#0a3a60] to-[#082a47] text-white py-10 sm:py-16 lg:py-24 overflow-hidden border-b border-sky-950/80">
      <MetrologyScene />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Description, CTAs, Trust Labels */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-sky-500/15 border border-sky-400/30 px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide text-sky-200 backdrop-blur-md shadow-xs max-w-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="font-bold truncate">Unified Legal Metrology Portal</span>
              <span className="text-sky-400/60 hidden xs:inline">•</span>
              <span className="text-amber-300 font-mono hidden xs:inline">PS ID: 26036</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-[46px] font-black text-white tracking-tight leading-[1.2] sm:leading-[1.18]">
              Digital Verification for <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-100 to-amber-200">
                Trusted Weighing & Measuring
              </span> Instruments
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-[17px] text-slate-200/90 max-w-2xl leading-relaxed font-normal">
              Apply for verification, track inspections, access digital certificates, and verify measurement instruments through a secure and transparent digital platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenApply}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-400/35 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
              >
                <ClipboardCheck className="w-5 h-5 text-slate-950 shrink-0" />
                <span>Apply for Verification</span>
                <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
              </button>

              <button
                onClick={onOpenVerify}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 hover:border-white/40 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm"
              >
                <Search className="w-4 h-4 text-sky-300 shrink-0" />
                <span>Verify Certificate</span>
              </button>
            </div>

            {/* Trust Labels */}
            <div className="pt-5 sm:pt-6 border-t border-slate-700/70">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300 font-medium">
                <span className="inline-flex items-center gap-1.5 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Secure</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Transparent</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Digital</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <Lock className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                  <span>Accessible</span>
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Dashboard / Certificate Visual Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative mx-auto max-w-md lg:max-w-none w-full">
              
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/30 via-amber-500/20 to-sky-400/30 rounded-2xl blur-lg opacity-40"></div>

              {/* Main Card Container */}
              <div className="relative bg-slate-900/95 border border-sky-400/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl text-left w-full">
                
                {/* Header Banner */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-2xs shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-200 truncate">
                        Legal Metrology Digital Record
                      </h2>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        Dept. of Consumer Affairs
                      </p>
                    </div>
                  </div>

                  {/* Status: VERIFIED */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    VERIFIED
                  </span>
                </div>

                {/* Instrument Metadata Details */}
                <div className="space-y-2.5 text-xs">
                  
                  {/* Primary Instrument Block */}
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/70 shadow-2xs">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                      Instrument
                    </span>
                    <div className="text-white font-bold text-xs sm:text-sm flex flex-wrap items-center justify-between gap-1">
                      <span>Electronic Weighing Scale</span>
                      <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700/70 font-mono">
                        Class III
                      </span>
                    </div>
                  </div>

                  {/* ID & Certificate Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 min-w-0">
                      <span className="text-[9px] sm:text-[10px] uppercase text-slate-400 font-semibold block mb-0.5 truncate">
                        Instrument ID
                      </span>
                      <span className="font-mono text-[11px] sm:text-xs font-bold text-sky-300 truncate block">
                        INS-2026-00001
                      </span>
                    </div>

                    <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 min-w-0">
                      <span className="text-[9px] sm:text-[10px] uppercase text-slate-400 font-semibold block mb-0.5 truncate">
                        Certificate No.
                      </span>
                      <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-300 truncate block">
                        LM-CERT-2026-00001
                      </span>
                    </div>
                  </div>

                  {/* Validity & QR Box */}
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/70 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-0.5">
                        Valid Until
                      </span>
                      <span className="text-xs sm:text-sm font-black text-emerald-400 flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        26 Aug 2027
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                        Verified by: LMO Pune Division
                      </span>
                    </div>

                    {/* QR Code Graphic */}
                    <div 
                      onClick={() => onSelectSampleCert && onSelectSampleCert("LM-CERT-2026-00001")}
                      className="group cursor-pointer bg-white p-1.5 rounded-xl border border-slate-300 flex flex-col items-center justify-center hover:ring-2 hover:ring-sky-400 transition-all shadow-md shrink-0"
                      title="Click to verify this sample certificate"
                    >
                      <svg className="w-12 h-12 sm:w-14 sm:h-14 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                        <rect x="5" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="11" y="11" width="14" height="14" rx="1" />
                        <rect x="69" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="75" y="11" width="14" height="14" rx="1" />
                        <rect x="5" y="69" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="11" y="75" width="14" height="14" rx="1" />
                        <circle cx="45" cy="15" r="3" />
                        <circle cx="55" cy="22" r="3" />
                        <circle cx="45" cy="35" r="3" />
                        <circle cx="55" cy="45" r="3" />
                        <circle cx="20" cy="48" r="3" />
                        <circle cx="32" cy="55" r="3" />
                        <circle cx="70" cy="50" r="3" />
                        <circle cx="85" cy="55" r="3" />
                        <circle cx="45" cy="65" r="3" />
                        <circle cx="60" cy="72" r="3" />
                        <circle cx="78" cy="80" r="3" />
                        <circle cx="45" cy="85" r="3" />
                        <circle cx="55" cy="90" r="3" />
                      </svg>
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 mt-0.5 uppercase tracking-tight group-hover:text-sky-700">
                        Scan QR
                      </span>
                    </div>
                  </div>

                </div>

                {/* Footer Interactive Trigger */}
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span className="text-slate-400 font-mono truncate">SHA-256 Verified</span>
                  <button 
                    onClick={onOpenVerify}
                    className="text-sky-300 hover:text-sky-100 font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <span>Instant Live Validation</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
