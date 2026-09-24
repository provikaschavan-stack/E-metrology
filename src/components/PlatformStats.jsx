import React from 'react';
import { Scale, CheckCircle2, Award, TrendingUp, Info } from 'lucide-react';

export default function PlatformStats() {
  const stats = [
    {
      value: "10,000+",
      label: "Instruments Registered",
      subtext: "Commercial scales, fuel dispensers & balances",
      icon: Scale,
      color: "text-sky-700",
      bg: "bg-sky-50 border-sky-200/80"
    },
    {
      value: "8,500+",
      label: "Verifications Completed",
      subtext: "On-site field inspections & stamping done",
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200/80"
    },
    {
      value: "6,200+",
      label: "Digital Certificates",
      subtext: "Tamper-evident QR certificates issued",
      icon: Award,
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200/80"
    },
    {
      value: "98%",
      label: "Applications Processed",
      subtext: "Within statutory service delivery SLA",
      icon: TrendingUp,
      color: "text-indigo-700",
      bg: "bg-indigo-50 border-indigo-200/80"
    }
  ];

  return (
    <section className="py-14 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Prototype Header Notice */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/90 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Prototype Demonstration Metrics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a3a60] tracking-tight">
            National Verification Impact at Scale
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            *Figures displayed below represent simulated testbed benchmarks for Smart India Hackathon 2026, not official government statistics.
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-sky-300 hover:bg-white hover:shadow-md transition-all duration-200 text-center flex flex-col items-center justify-center group"
              >
                <div className={`w-12 h-12 rounded-xl border ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-2xs`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-[#0a3a60] mt-1.5">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-snug">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
