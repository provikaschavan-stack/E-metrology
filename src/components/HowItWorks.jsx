import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  FileText, 
  Calendar, 
  ClipboardCheck, 
  CheckCircle2, 
  Award, 
  QrCode, 
  Activity,
  ArrowDown,
  Clock,
  Check,
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Users
} from 'lucide-react';
import { WORKFLOW_STEPS } from '../data/mockData';

export default function HowItWorks() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play stepper for SIH presentations
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStepIndex((prev) => (prev + 1) % WORKFLOW_STEPS.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getStepIcon = (iconName) => {
    switch (iconName) {
      case 'UserPlus': return <UserPlus className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'Calendar': return <Calendar className="w-5 h-5" />;
      case 'ClipboardCheck': return <ClipboardCheck className="w-5 h-5" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'QrCode': return <QrCode className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      default: return <Check className="w-5 h-5" />;
    }
  };

  const stepDetails = [
    {
      actor: "Trader / Instrument Owner",
      actorRole: "Commercial Applicant",
      sla: "5 Minutes",
      documents: "GSTIN, Aadhaar, Trade License, Instrument Make & Model details",
      outcome: "Unique Trader ID & Instrument Profile in National Central Metrology Registry",
      badge: "Initial Onboarding"
    },
    {
      actor: "Applicant (Self-Service)",
      actorRole: "Statutory Filing",
      sla: "Instant Submission",
      documents: "Manufacturer Test Report, Previous Verification Certificate (if re-verification)",
      outcome: "Statutory Reference ID (APP-2026-XXXX) & Online Fee Payment Receipt",
      badge: "Application Filing"
    },
    {
      actor: "System Engine & LMO Admin",
      actorRole: "Automated Routing",
      sla: "< 24 Hours",
      documents: "Automated Inspector Geographic Proximity Match & Route Scheduling",
      outcome: "Confirmed On-Site Inspection Appointment with LMO / GATC Details",
      badge: "Smart Dispatch"
    },
    {
      actor: "Legal Metrology Officer (LMO)",
      actorRole: "Field Enforcement",
      sla: "Scheduled Slot",
      documents: "OIML F1/F2 Standard Working Weights, Geo-tagged Stamp Photographs",
      outcome: "Mobile-recorded Error Tolerance Report & Physical Lead/Wire Security Seal",
      badge: "Physical Verification"
    },
    {
      actor: "Assistant Controller of Legal Metrology",
      actorRole: "Statutory Authority",
      sla: "Same Day",
      documents: "Digital Checklist, Error Tolerance Curve & Security Seal Serial Validation",
      outcome: "Statutory Verification Clearance & Digital Signature Authorization",
      badge: "Official Approval"
    },
    {
      actor: "E-Metrology Cryptographic Engine",
      actorRole: "Automated System",
      sla: "Instant Generation",
      documents: "Cryptographically Signed PDF with Unique 2D QR Code & Checksum",
      outcome: "Downloadable Certificate & Digital Instrument Passport (DIP) Updated",
      badge: "Tamper-Proof Issuance"
    },
    {
      actor: "Consumers, Public & Enforcement Teams",
      actorRole: "Public Validation",
      sla: "Instant (Real-Time)",
      documents: "QR Code Scan or Certificate Number Search",
      outcome: "Real-time Verification Status, Seal Serial & Calibration Validity Displayed",
      badge: "Public Trust"
    },
    {
      actor: "Automated Background Service",
      actorRole: "Continuous Service",
      sla: "T-30, T-15, T-7 Days",
      documents: "Automated SMS / WhatsApp alerts and compliance telemetry",
      outcome: "Proactive Renewal Scheduling & 100% Legal Metrology Compliance",
      badge: "Lifecycle Monitoring"
    }
  ];

  const currentDetail = stepDetails[activeStepIndex];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider mb-2.5 border border-sky-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Standard Operating Workflow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
              How It Works: End-to-End Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              A synchronized 8-stage digital pipeline connecting citizens, traders, field inspectors, and state controllers.
            </p>
          </div>

          {/* Presentation Auto-Play Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isPlaying 
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Auto Presentation' : 'Auto Step-Through'}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Visual Pipeline Desktop / Stepper Mobile */}
        <div className="relative mb-10">
          
          {/* Progress Connecting Line Desktop */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sky-600 via-[#0a3a60] to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${((activeStepIndex) / (WORKFLOW_STEPS.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-2.5 relative z-10">
            {WORKFLOW_STEPS.map((stepItem, index) => {
              const isActive = activeStepIndex === index;
              const isPast = index < activeStepIndex;
              return (
                <div key={stepItem.step} className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      setActiveStepIndex(index);
                      setIsPlaying(false);
                    }}
                    className={`w-full flex flex-col items-center p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center relative group ${
                      isActive 
                        ? 'bg-[#0a3a60] text-white shadow-xl shadow-[#0a3a60]/25 scale-105 ring-2 ring-sky-400' 
                        : isPast 
                          ? 'bg-white hover:bg-sky-50 text-slate-800 border border-emerald-300 shadow-2xs' 
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {/* Active Pulse Pill */}
                    {isActive && (
                      <span className="absolute -top-1.5 px-2 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-black rounded-full uppercase tracking-tight shadow-xs animate-bounce">
                        Active
                      </span>
                    )}

                    {/* Step number badge & Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 font-bold transition-all ${
                      isActive 
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-110' 
                        : isPast
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-50 text-[#0a3a60] border border-slate-300/70'
                    }`}>
                      {isPast ? <Check className="w-5 h-5 stroke-[2.5]" /> : getStepIcon(stepItem.icon)}
                    </div>

                    <span className={`text-[10px] font-black tracking-wider uppercase mb-0.5 ${
                      isActive ? 'text-amber-300' : isPast ? 'text-emerald-700 font-bold' : 'text-slate-500'
                    }`}>
                      Step {stepItem.step}
                    </span>

                    <span className="text-xs sm:text-[13px] font-bold truncate max-w-full">
                      {stepItem.title}
                    </span>
                  </button>

                  {/* Mobile downward arrow between steps */}
                  {index < WORKFLOW_STEPS.length - 1 && (
                    <div className="lg:hidden my-1 text-slate-300">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Interactive Showcase Card */}
        <div className="bg-gradient-to-br from-[#072036] via-[#0a3a60] to-[#082a47] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-400/30 relative overflow-hidden text-left">
          
          {/* Subtle Background Circuit Graphics */}
          <div className="absolute right-0 bottom-0 w-80 h-80 opacity-5 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" fill="none" />
              <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          {/* Top Banner Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-700/80 relative z-10">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shrink-0 shadow-lg shadow-amber-400/20">
                {WORKFLOW_STEPS[activeStepIndex].step}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-sky-300 uppercase tracking-widest">
                    Stage {activeStepIndex + 1} of 8
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-900 text-sky-200 border border-sky-700 font-medium">
                    {currentDetail.badge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  {WORKFLOW_STEPS[activeStepIndex].title} — {WORKFLOW_STEPS[activeStepIndex].desc}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-slate-950/80 text-sky-200 px-3.5 py-2 rounded-xl border border-sky-600/50 flex items-center gap-2 shadow-2xs">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Statutory SLA: <strong className="text-white">{currentDetail.sla}</strong></span>
              </span>
            </div>

          </div>

          {/* 3 Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 pt-6 text-xs relative z-10">
            
            <div className="bg-slate-900/70 p-4.5 rounded-2xl border border-slate-700/70 shadow-sm">
              <div className="flex items-center gap-2 text-sky-300 font-bold uppercase tracking-wider mb-1.5 text-[11px]">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Responsible Stakeholder</span>
              </div>
              <div className="text-sm font-bold text-white">
                {currentDetail.actor}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Role: {currentDetail.actorRole}
              </div>
            </div>

            <div className="bg-slate-900/70 p-4.5 rounded-2xl border border-slate-700/70 shadow-sm">
              <div className="flex items-center gap-2 text-sky-300 font-bold uppercase tracking-wider mb-1.5 text-[11px]">
                <FileCheck className="w-4 h-4 text-sky-400" />
                <span>Required Artifacts & Inputs</span>
              </div>
              <div className="text-slate-200 leading-relaxed font-normal">
                {currentDetail.documents}
              </div>
            </div>

            <div className="bg-slate-900/70 p-4.5 rounded-2xl border border-slate-700/70 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider mb-1.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Deliverable</span>
              </div>
              <div className="text-slate-200 leading-relaxed font-normal">
                {currentDetail.outcome}
              </div>
            </div>

          </div>

          {/* Bottom Interactive Navigation Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/60 text-xs relative z-10">
            <button
              onClick={() => {
                setActiveStepIndex(prev => Math.max(0, prev - 1));
                setIsPlaying(false);
              }}
              disabled={activeStepIndex === 0}
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeStepIndex === 0 
                  ? 'text-slate-500 bg-slate-800/40 cursor-not-allowed' 
                  : 'text-white bg-slate-800 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              ← Previous Stage
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              {WORKFLOW_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeStepIndex === i ? 'w-6 bg-amber-400' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                setActiveStepIndex(prev => Math.min(WORKFLOW_STEPS.length - 1, prev + 1));
                setIsPlaying(false);
              }}
              disabled={activeStepIndex === WORKFLOW_STEPS.length - 1}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeStepIndex === WORKFLOW_STEPS.length - 1 
                  ? 'text-slate-500 bg-slate-800/40 cursor-not-allowed' 
                  : 'text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20'
              }`}
            >
              Next Stage →
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
