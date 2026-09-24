import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Search, 
  LogIn, 
  UserPlus,
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  BookOpen, 
  FileCheck 
} from 'lucide-react';

export default function Navbar({ onOpenLogin, onOpenRegister, onOpenVerify, onOpenApply: _onOpenApply, onOpenTrack: _onOpenTrack }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Services', href: '#services' },
    { name: 'Field Operations', href: '#field-operations' },
    { name: 'Verification', href: '#qr-verification' },
    { name: 'Instrument Passport', href: '#passport' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 w-full ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/90 py-2 sm:py-2.5' 
        : 'bg-white border-b border-slate-200 py-2.5 sm:py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand & Logo */}
          <a 
            href="#hero" 
            onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0"
          >
            {/* National Metrology Emblem / Balance Symbol */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0a3a60] via-[#09426f] to-[#0284c7] text-white flex items-center justify-center shadow-sm ring-1 ring-sky-900/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-sky-100" />
            </div>
            
            <div className="text-left truncate">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-[#0a3a60]">
                  E-Metrology
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-tight leading-none mt-0.5 truncate hidden xs:block">
                Digital Verification. Trusted Measurements.
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 xl:px-3 py-1.5 text-[13px] font-semibold text-slate-700 hover:text-[#0a3a60] hover:bg-sky-50/70 rounded-lg transition-colors duration-150"
              >
                {link.name}
              </a>
            ))}

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                onBlur={() => setTimeout(() => setResourcesOpen(false), 250)}
                className="px-2.5 xl:px-3 py-1.5 text-[13px] font-semibold text-slate-700 hover:text-[#0a3a60] hover:bg-sky-50/70 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${resourcesOpen ? 'rotate-180 text-[#0a3a60]' : ''}`} />
              </button>

              {resourcesOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  <div className="px-3.5 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Statutory Framework & Rules
                  </div>
                  <a 
                    href="#about" 
                    onClick={() => scrollTo('#about')} 
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-sky-50 hover:text-[#0a3a60] font-medium"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span>Legal Metrology Act 2009</span>
                  </a>
                  <a 
                    href="#faq" 
                    onClick={() => scrollTo('#faq')} 
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-sky-50 hover:text-[#0a3a60] font-medium"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Standard Weight Tolerances</span>
                  </a>
                  <a 
                    href="#security" 
                    onClick={() => scrollTo('#security')} 
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-sky-50 hover:text-[#0a3a60] font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Security & Trust Model</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenVerify}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0a3a60] bg-sky-50/90 hover:bg-sky-100/90 border border-sky-200/90 hover:border-sky-300 rounded-lg transition-all duration-150 cursor-pointer shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-sky-600" />
              <span>Verify Certificate</span>
            </button>

            <button
              onClick={() => onOpenRegister ? onOpenRegister() : onOpenLogin('register')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-all duration-150 cursor-pointer shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Register</span>
            </button>

            <button
              onClick={() => onOpenLogin('login')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0a3a60] hover:bg-[#07253d] shadow-sm hover:shadow-md rounded-lg transition-all duration-150 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-200" />
              <span>Login</span>
            </button>
          </div>

          {/* Mobile Actions & Menu Hamburger */}
          <div className="flex items-center gap-1.5 lg:hidden shrink-0">
            <button
              onClick={onOpenVerify}
              className="px-2.5 py-1.5 text-xs font-bold text-[#0a3a60] bg-sky-50 border border-sky-200 rounded-lg"
            >
              Verify
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:text-[#0a3a60] hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150 text-left">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:text-[#0a3a60] rounded-lg"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVerify();
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-[#0a3a60] bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-sky-600" />
              <span>Verify Certificate</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenRegister) onOpenRegister();
                  else onOpenLogin('register');
                }}
                className="py-2.5 text-center text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Register</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin('login');
                }}
                className="py-2.5 text-center text-xs font-bold text-white bg-[#0a3a60] hover:bg-[#07253d] rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

