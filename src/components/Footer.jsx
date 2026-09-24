import React from 'react';
import { Scale, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer({ onOpenHelp }) {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#051728] text-slate-400 text-xs border-t border-slate-800 text-left">
      
      {/* Top Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Scale className="w-6 h-6 text-sky-100" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  E-Metrology
                </span>
                <p className="text-[11px] text-slate-400">
                  National Legal Metrology Verification System
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Digital platform for weighing and measuring instrument verification. Empowering transparent consumer transactions and unified statutory compliance across India.
            </p>

            <div className="pt-1 text-[11px] text-slate-400 font-mono">
              Designed for Smart India Hackathon (SIH 2026) • Problem Statement ID: 26036
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }} className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('#about'); }} className="hover:text-white transition-colors">
                  About Platform
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('#services'); }} className="hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('#how-it-works'); }} className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Assistance & Policy
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }} className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <button onClick={onOpenHelp} className="hover:text-white transition-colors cursor-pointer text-left">
                  Help Desk
                </button>
              </li>
              <li>
                <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('#faq'); }} className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }} className="hover:text-white transition-colors">
                  Accessibility Statement
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / SIH Node Info */}
          <div className="space-y-3" id="contact">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Helpdesk & Secretariat
            </div>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Krishi Bhawan / Shastri Bhawan, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Toll-Free: 1800-11-4000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>support-emetrology@gov.in (Demo)</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-black/50 py-4 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
                © 2026 E-Metrology — SIH Prototype | Ministry of Consumer Affairs, Food & Public Distribution
          </div>
          <div className="font-mono text-amber-400 font-bold">
            Problem Statement ID: 26036
          </div>
        </div>
      </div>

    </footer>
  );
}
