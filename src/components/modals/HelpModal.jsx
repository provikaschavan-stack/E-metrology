import React, { useState } from 'react';
import { X, HelpCircle, Phone, Mail, Send, CheckCircle } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setQuery('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0a3a60] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-500/30 flex items-center justify-center text-sky-200 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="truncate text-left">
              <h3 className="text-sm sm:text-base font-bold truncate">Legal Metrology Helpdesk</h3>
              <p className="text-[11px] sm:text-xs text-sky-200 truncate">Citizen & Trader Support Centre</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 text-xs text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-bold text-slate-900 text-xs truncate">Toll-Free Helpline</div>
                <div className="text-slate-500 font-mono text-[11px] truncate">1800-11-4000</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-bold text-slate-900 text-xs truncate">Email Desk</div>
                <div className="text-slate-500 text-[11px] truncate">helpdesk-lm@gov.in</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Submit Quick Query / Grievance (Demo)
              </label>
              <textarea
                rows="3"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your issue regarding verification scheduling, certificate download, or seal stamping..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              ></textarea>
            </div>

            {ticketSubmitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Ticket #TKT-2026-4401 logged! Executive will respond.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0a3a60] hover:bg-[#07253d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4 text-sky-300" />
              <span>Submit Query</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
