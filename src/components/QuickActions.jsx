import React from 'react';
import { 
  ClipboardList, 
  SearchCheck, 
  CalendarClock, 
  FileCheck2, 
  BellRing,
  ArrowUpRight
} from 'lucide-react';
import { QUICK_ACTIONS } from '../data/mockData';

export default function QuickActions({ 
  onOpenApply, 
  onOpenVerify, 
  onOpenTrack, 
  onOpenCertModal, 
  onScrollToExpiry 
}) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'ClipboardList': return <ClipboardList className="w-5 h-5" />;
      case 'SearchCheck': return <SearchCheck className="w-5 h-5" />;
      case 'CalendarClock': return <CalendarClock className="w-5 h-5" />;
      case 'FileCheck2': return <FileCheck2 className="w-5 h-5" />;
      case 'BellRing': return <BellRing className="w-5 h-5" />;
      default: return <ClipboardList className="w-5 h-5" />;
    }
  };

  const handleAction = (id) => {
    switch (id) {
      case 'apply': onOpenApply(); break;
      case 'verify': onOpenVerify(); break;
      case 'track': onOpenTrack(); break;
      case 'certificates': onOpenCertModal(); break;
      case 'renewal': onScrollToExpiry(); break;
      default: break;
    }
  };

  const getAccentColor = (color) => {
    switch (color) {
      case 'blue': return 'group-hover:border-sky-400 group-hover:bg-sky-50/40 text-[#0a3a60]';
      case 'emerald': return 'group-hover:border-emerald-400 group-hover:bg-emerald-50/40 text-emerald-800';
      case 'amber': return 'group-hover:border-amber-400 group-hover:bg-amber-50/40 text-amber-800';
      case 'indigo': return 'group-hover:border-indigo-400 group-hover:bg-indigo-50/40 text-indigo-800';
      case 'rose': return 'group-hover:border-rose-400 group-hover:bg-rose-50/40 text-rose-800';
      default: return 'group-hover:border-sky-400 group-hover:bg-sky-50/40 text-[#0a3a60]';
    }
  };

  return (
    <section className="relative -mt-6 sm:-mt-10 lg:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/90 p-4 sm:p-6 lg:p-7 backdrop-blur-md">
        
        {/* Section Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 sm:mb-6 pb-3.5 border-b border-slate-100 text-left">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#0a3a60] tracking-tight">
              Citizen & Trader Quick Services
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Direct access to vital Legal Metrology transactions and self-service portals
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 sm:px-3 py-1 rounded-full border border-sky-200/70 self-start sm:self-auto shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
            <span>Self-Service Gateway</span>
          </span>
        </div>

        {/* 5 Quick Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className={`group relative flex flex-col justify-between text-left p-3.5 sm:p-4 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-200/80 transition-all duration-200 hover:shadow-md cursor-pointer h-full transform hover:-translate-y-0.5 ${getAccentColor(action.color)}`}
            >
              <div>
                {/* Icon & Badge Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0a3a60] text-white flex items-center justify-center group-hover:bg-[#0284c7] group-hover:scale-105 transition-all duration-200 shadow-2xs shrink-0">
                    {getIcon(action.icon)}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 group-hover:border-slate-300 shadow-2xs">
                    {action.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0a3a60] transition-colors mb-1 flex items-center justify-between">
                  <span>{action.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-sky-600 transition-opacity shrink-0" />
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                  {action.desc}
                </p>
              </div>

              {/* Action Trigger Link */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] sm:text-[11px] font-bold text-[#0a3a60] group-hover:text-sky-700 flex items-center gap-1">
                <span>Access Service</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
