import React from 'react';
import { 
  Layers, 
  FileSignature, 
  RefreshCw, 
  Clock, 
  Smartphone, 
  FileBadge2, 
  QrCode, 
  Bell, 
  History, 
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { SERVICES_LIST } from '../data/mockData';

export default function Services({ onOpenApply, onOpenVerify, onOpenTrack, onOpenCertModal }) {
  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'FileSignature': return <FileSignature className="w-5 h-5" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5" />;
      case 'Clock': return <Clock className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'FileBadge2': return <FileBadge2 className="w-5 h-5" />;
      case 'QrCode': return <QrCode className="w-5 h-5" />;
      case 'Bell': return <Bell className="w-5 h-5" />;
      case 'History': return <History className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  const handleCardClick = (title) => {
    if (title.includes('Application') || title.includes('Registration') || title.includes('Re-Verification')) {
      onOpenApply();
    } else if (title.includes('QR') || title.includes('Verify')) {
      onOpenVerify();
    } else if (title.includes('Scheduling') || title.includes('History')) {
      onOpenTrack();
    } else if (title.includes('Certificates')) {
      onOpenCertModal();
    } else {
      const el = document.querySelector('#passport');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-16 lg:py-20 bg-slate-50/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3 border border-sky-200 shadow-2xs">
            <span>Comprehensive Legal Metrology Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            Services & Functional Modules
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            Integrated digital capabilities addressing every statutory requirement under the Legal Metrology (General) Rules.
          </p>
        </div>

        {/* 10 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 text-left">
          {SERVICES_LIST.map((service, _index) => (
            <div
              key={service.title}
              onClick={() => handleCardClick(service.title)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col justify-between group cursor-pointer transform hover:-translate-y-0.5"
            >
              <div>
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-[#0a3a60] group-hover:bg-[#0a3a60] group-hover:text-white flex items-center justify-center mb-3.5 transition-colors shadow-2xs">
                  {getServiceIcon(service.icon)}
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0a3a60] transition-colors mb-1.5">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              {/* Action link */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-[#0a3a60]">
                <span>Launch Service</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
