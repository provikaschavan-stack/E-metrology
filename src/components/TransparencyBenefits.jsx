import React from 'react';
import { Users, Building, ShieldCheck, BarChart4, ArrowRight } from 'lucide-react';

export default function TransparencyBenefits({ onOpenVerify, onOpenApply }) {
  const benefits = [
    {
      group: "Citizens & Consumers",
      action: "Instant Verification",
      icon: Users,
      color: "from-sky-600 to-sky-800",
      lightBg: "bg-sky-50",
      textColor: "text-sky-900",
      description: "Verify valid commercial instruments and statutory certificates on the spot via mobile QR scan, ensuring accurate weights and zero consumer fraud at retail points.",
      link: "Verify Now",
      onClick: onOpenVerify
    },
    {
      group: "Businesses & Traders",
      action: "Effortless Compliance",
      icon: Building,
      color: "from-[#0a3a60] to-[#07253d]",
      lightBg: "bg-blue-50",
      textColor: "text-blue-900",
      description: "Track complete compliance, calibration history, and instrument passports online. Schedule verification appointments with transparent tracking and zero downtime.",
      link: "Apply Online",
      onClick: onOpenApply
    },
    {
      group: "Legal Metrology Officers",
      action: "Field Automation",
      icon: ShieldCheck,
      color: "from-emerald-600 to-emerald-800",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-900",
      description: "Manage field inspections and stamping digitally with automated route planning, standard weight checklists, offline support, and instantaneous certificate generation.",
      link: "Officer Hub",
      onClick: onOpenVerify
    },
    {
      group: "Administrators & State",
      action: "Real-time Oversight",
      icon: BarChart4,
      color: "from-purple-600 to-purple-800",
      lightBg: "bg-purple-50",
      textColor: "text-purple-900",
      description: "Monitor nationwide applications, inspection pendency, officer workload, and revenue collection through comprehensive live analytical dashboards.",
      link: "View Metrics",
      onClick: () => {
        const el = document.querySelector('#services');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200 shadow-2xs">
            <span>Ecosystem Value Proposition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            Empowering Transparent Governance
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            Delivering concrete, tangible benefits across every layer of the Indian legal metrology ecosystem.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-lg hover:border-sky-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.color} text-white flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {b.group}
                  </span>
                  
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    {b.action}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={b.onClick}
                    className="text-xs font-bold text-[#0a3a60] hover:text-sky-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{b.link}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
