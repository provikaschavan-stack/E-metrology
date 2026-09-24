import React from 'react';
import { FolderGit2, Zap, ShieldCheck, Check } from 'lucide-react';

export default function AboutPlatform({ onOpenApply: _onOpenApply, onOpenVerify: _onOpenVerify }) {
  const lifecycleSteps = [
    "Application",
    "Scheduling",
    "Field Verification",
    "Approval",
    "Certificate",
    "QR Verification",
    "Expiry Monitoring"
  ];

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-slate-50/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 text-sky-900 text-xs font-bold uppercase tracking-wider mb-2.5 border border-sky-200/60 shadow-2xs">
            <span>About E-Metrology Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            One Platform for the Complete Verification Lifecycle
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-2.5 leading-relaxed">
            Eliminating physical paper bottlenecks and manual inspection delays through a comprehensive, transparent, end-to-end digital governance architecture.
          </p>
        </div>

        {/* Lifecycle Flow Horizontal Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-sm mb-10 sm:mb-12">
          <div className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5 text-center sm:text-left">
            Unified End-to-End Digitization Pipeline
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5 items-center">
            {lifecycleSteps.map((step, idx) => (
              <div 
                key={step}
                className="flex items-center gap-2 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 p-2 sm:p-2.5 rounded-xl justify-center text-center shadow-2xs transition-colors"
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0a3a60] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 text-left">
          
          {/* Card 1: Digital Records */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-4 sm:mb-5 shadow-2xs">
                <FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0a3a60] mb-2">
                📂 Digital Records
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Unified centralized repository containing complete historical logs, manufacturer specs, calibration history, and physical seal serials for every commercial instrument in the country.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-3.5">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unique Digital Instrument Passport (DIP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Permanent immutable audit trail</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Paperless archival & instant retrieval</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Faster Processing */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4 sm:mb-5 shadow-2xs">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0a3a60] mb-2">
                ⚡ Faster Processing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Automated scheduling algorithms match field officers with nearby traders, cutting turnaround time from weeks to standard 48-hour service windows with transparent status tracking.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-3.5">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Smart LMO & GATC inspector assignment</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time mobile field inspection sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant digital fee payment gateways</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Trusted Certification */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4 sm:mb-5 shadow-2xs">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0a3a60] mb-2">
                🔐 Trusted Certification
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Tamper-evident digital certificates equipped with 2D QR codes protect consumers against manipulated weights, fake inspection seals, and non-standard measurement devices.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-3.5">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cryptographically signed QR verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero counterfeit certificate risk</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct public consumer validation</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
