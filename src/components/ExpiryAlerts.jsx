import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight
} from 'lucide-react';

export default function ExpiryAlerts({ onOpenApply }) {
  const alertStatusCards = [
    {
      status: "VALID",
      badgeColor: "bg-emerald-500 text-white",
      border: "border-emerald-200 bg-emerald-50/50",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      rule: "More than 30 days remaining",
      description: "Instrument operates under active statutory compliance. No immediate action required.",
      actionText: "Compliance Intact"
    },
    {
      status: "EXPIRING SOON",
      badgeColor: "bg-amber-400 text-slate-950 font-black",
      border: "border-amber-300 bg-amber-50/70 ring-2 ring-amber-400/50",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      rule: "Due within 30 days",
      description: "Automated multi-channel reminders issued. Book inspection slot to maintain uninterrupted trade.",
      actionText: "Schedule Re-verification"
    },
    {
      status: "EXPIRED",
      badgeColor: "bg-rose-600 text-white",
      border: "border-rose-200 bg-rose-50/50",
      icon: XCircle,
      iconColor: "text-rose-600",
      rule: "Re-verification required immediately",
      description: "Commercial use suspended under Sec 24 Legal Metrology Act. Instant fast-track renewal needed.",
      actionText: "Renew Immediately"
    }
  ];

  return (
    <section id="expiry-alerts" className="py-16 lg:py-20 bg-white border-b border-slate-200 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200 shadow-2xs">
            <Bell className="w-3.5 h-3.5 text-amber-700" />
            <span>Proactive Compliance Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            Never Miss a Re-Verification Date
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            Automated statutory threshold monitoring keeping businesses compliant with proactive SMS, WhatsApp, and email alerts.
          </p>
        </div>

        {/* 3 Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
          {alertStatusCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx}
                className={`p-6 rounded-2xl border ${card.border} shadow-sm flex flex-col justify-between transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${card.badgeColor} shadow-2xs`}>
                      {card.status}
                    </span>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>

                  <div className="text-sm font-bold text-slate-900 mb-1.5">
                    {card.rule}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80">
                  <button
                    onClick={onOpenApply}
                    className="w-full py-2.5 px-3 text-xs font-bold text-[#0a3a60] hover:text-white bg-white hover:bg-[#0a3a60] border border-slate-300 hover:border-[#0a3a60] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sample Real-time Notification Banner */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-l-4 border-amber-500 bg-white p-5 rounded-r-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
          
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Sample Automated Alert
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  via WhatsApp & SMS
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                "Instrument <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sky-900 border border-slate-200">INS-2026-00001</code> expires in 15 days."
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApply}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-2xs hover:shadow transition-all whitespace-nowrap cursor-pointer"
          >
            Initiate Re-verification
          </button>

        </div>

      </div>
    </section>
  );
}
