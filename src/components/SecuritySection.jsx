import React from 'react';
import { 
  Lock, 
  Users, 
  ShieldCheck, 
  ClipboardList, 
  Cloud, 
  Info,
  KeyRound
} from 'lucide-react';

export default function SecuritySection() {
  const securityFeatures = [
    {
      title: "JWT Authentication",
      desc: "Stateless JSON Web Tokens with encrypted session cookies and multi-factor OTP verification for all official logins.",
      icon: KeyRound,
      color: "text-sky-700",
      bg: "bg-sky-50 border-sky-100"
    },
    {
      title: "Role-Based Access (RBAC)",
      desc: "Granular permission boundaries separating Traders, LMOs, GATC Test Engineers, and State Controllers.",
      icon: Users,
      color: "text-purple-700",
      bg: "bg-purple-50 border-purple-100"
    },
    {
      title: "Secure Encrypted APIs",
      desc: "RESTful architecture secured with HTTPS/TLS 1.3, rate-limiting, IP-whitelisting for test centres, and request signing.",
      icon: ShieldCheck,
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-100"
    },
    {
      title: "Immutable Audit Trail",
      desc: "Every verification, seal replacement, and tolerance observation is recorded with timestamp and cryptographic hashes.",
      icon: ClipboardList,
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-100"
    },
    {
      title: "Secure Document Storage",
      desc: "Encrypted object storage with digital signatures, watermarks, and verification checksums for every issued certificate.",
      icon: Cloud,
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-100"
    }
  ];

  return (
    <section id="security" className="py-16 lg:py-20 bg-slate-50/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 border border-slate-300/80 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-slate-700" />
            <span>Architecture & Trust Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            Secure by Design
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            Engineered with modern defense-in-depth principles to protect data integrity, prevent fraud, and guarantee certificate authenticity.
          </p>
        </div>

        {/* 5 Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 mb-8 text-left">
          {securityFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl border ${feat.bg} ${feat.color} flex items-center justify-center mb-4 shadow-2xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* SIH Capability Disclaimer Notice */}
        <div className="max-w-3xl mx-auto text-center bg-sky-50/90 border border-sky-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-center justify-center gap-2 shadow-2xs">
          <Info className="w-4 h-4 text-sky-700 shrink-0" />
          <span>
            *The security modules listed above represent planned architectural capabilities designed for the SIH 26036 prototype submission.
          </span>
        </div>

      </div>
    </section>
  );
}
