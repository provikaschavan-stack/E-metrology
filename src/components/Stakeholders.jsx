import React from 'react';
import { 
  Building2, 
  UserCheck, 
  FlaskConical, 
  ShieldAlert, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function Stakeholders({ onSelectRoleLogin }) {
  const stakeholders = [
    {
      role: "BUSINESS / INSTRUMENT OWNER",
      sub: "Traders, Retailers, Petrol Pumps & Manufacturers",
      icon: Building2,
      badge: "Commercial User",
      color: "border-sky-200 bg-sky-50/70 text-sky-950",
      accent: "bg-sky-700",
      features: [
        "Register instruments with GSTIN & model specs",
        "Apply online for initial or periodic verification",
        "Track applications in real-time with SLA timer",
        "Download legally valid tamper-evident certificates",
        "Receive automated SMS/WhatsApp expiry alerts"
      ]
    },
    {
      role: "LMO (LEGAL METROLOGY OFFICER)",
      sub: "State Enforcement & Field Verification Officers",
      icon: UserCheck,
      badge: "Enforcement Officer",
      color: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
      accent: "bg-emerald-700",
      features: [
        "View assigned inspection routes on mobile app",
        "Conduct on-site field verification using standard weights",
        "Record observation tolerances & physical seal numbers",
        "Approve or reject verification with instant digital stamping"
      ]
    },
    {
      role: "GATC",
      sub: "Government Approved Test Centres & Calibration Labs",
      icon: FlaskConical,
      badge: "Authorized Lab",
      color: "border-amber-200 bg-amber-50/70 text-amber-950",
      accent: "bg-amber-600",
      features: [
        "Manage assigned verification batches and bench tests",
        "Record high-precision test results & calibration curves",
        "Upload photographic evidence of standard masses used",
        "Submit verification reports to Assistant Controller"
      ]
    },
    {
      role: "ADMIN & CONTROLLER",
      sub: "Department of Consumer Affairs & State Controllers",
      icon: ShieldAlert,
      badge: "Apex Administration",
      color: "border-purple-200 bg-purple-50/70 text-purple-950",
      accent: "bg-purple-700",
      features: [
        "Monitor nationwide applications & pendency metrics",
        "Dynamically assign officers and manage workload balancing",
        "Manage end-to-end statutory verification workflow",
        "Comprehensive analytics, revenue collection & compliance reports"
      ]
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3 border border-sky-200 shadow-2xs">
            <span>Role-Based Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            Designed for Every Stakeholder
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            Tailored interfaces, access controls, and workflows engineered for maximum operational efficiency.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {stakeholders.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-lg hover:border-sky-300 transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className={`p-5 border-b ${s.color}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${s.accent} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 border border-slate-300/50 shadow-2xs">
                        {s.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                      {s.role}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {s.sub}
                    </p>
                  </div>

                  {/* Checklist Features */}
                  <div className="p-5 space-y-3">
                    {s.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Login Direct Link */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => onSelectRoleLogin && onSelectRoleLogin(s.role)}
                    className="w-full py-2.5 px-3 text-xs font-bold text-[#0a3a60] hover:text-white bg-white hover:bg-[#0a3a60] border border-slate-200 hover:border-[#0a3a60] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Login as {s.role.split(' ')[0]}</span>
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
