import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS_DATA } from '../data/mockData';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(prev => prev === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-16 lg:py-20 bg-slate-50/80 border-b border-slate-200 scroll-mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3 border border-sky-200 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-sky-700" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            Clear Answers for Citizens & Businesses
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            Everything you need to know about digital verification, statutory timelines, and instrument certification.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5 text-left">
          {FAQS_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-white rounded-2xl border transition-all duration-200 ${
                  isOpen 
                    ? 'border-sky-300 shadow-md ring-1 ring-sky-200/50' 
                    : 'border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer rounded-2xl"
                >
                  <span className={`font-bold text-sm sm:text-base ${isOpen ? 'text-[#0a3a60]' : 'text-slate-900'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#0a3a60] text-white rotate-180 shadow-xs' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
