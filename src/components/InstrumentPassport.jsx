import React, { useState } from 'react';
import { 
  History, 
  Sparkles, 
  Radio
} from 'lucide-react';

export default function InstrumentPassport() {
  const [selectedYear, setSelectedYear] = useState('2026');

  const passportData = {
    instrumentId: "INS-2026-00001",
    owner: "Bharat Retailers & Logistics Ltd.",
    location: "Pune Market Yard, Maharashtra",
    manufacturer: "Demo Instruments Pvt. Ltd.",
    model: "DIGI-SCALE 50KG v2",
    serialNumber: "WS-458921",
    capacity: "50.000 kg (e = 5 g)",
    accuracyClass: "Class III (Commercial NAWI)",
    currentCertificate: "LM-CERT-2026-00001",
    currentStatus: "✓ VERIFIED",
    initialCommissioning: "14 Aug 2024",
    rfidTag: "RFID-8819-LM-IND",
    healthIndex: "99.8%",
    driftRate: "0.02 g / year (Nominal)"
  };

  const timelineHistory = [
    {
      year: "2024",
      status: "✓ Verified",
      date: "14 Aug 2024",
      type: "Initial Statutory Verification",
      officer: "S. K. Joshi (LMO-Pune)",
      cert: "LM-CERT-2024-00192",
      errorMax: "+1.2 g (Within limits)",
      seal: "GOV-SEAL-11029",
      testWeights: "5kg, 10kg, 20kg OIML Class F2 Weights",
      isDue: false
    },
    {
      year: "2025",
      status: "✓ Re-verified",
      date: "20 Aug 2025",
      type: "Annual Periodic Re-verification",
      officer: "Priya Kulkarni (LMO-Pune)",
      cert: "LM-CERT-2025-00448",
      errorMax: "-0.8 g (Within limits)",
      seal: "GOV-SEAL-44910",
      testWeights: "10kg, 20kg, 50kg Working Standards",
      isDue: false
    },
    {
      year: "2026",
      status: "✓ Verified",
      date: "26 Aug 2026",
      type: "Annual Periodic Re-verification",
      officer: "Rajesh Sharma (LMO-MH-042)",
      cert: "LM-CERT-2026-00001",
      errorMax: "+0.5 g (Optimal accuracy)",
      seal: "GOV-SEAL-88912",
      testWeights: "Full Range NAWI Stepped Weights",
      isDue: false
    },
    {
      year: "2027",
      status: "⏳ Due",
      date: "26 Aug 2027",
      type: "Mandatory Re-verification Due",
      officer: "Pending Assignment",
      cert: "Pending Renewal Application",
      errorMax: "N/A",
      seal: "Scheduled for renewal",
      testWeights: "Pending Field Inspection",
      isDue: true
    }
  ];

  const activeEvent = timelineHistory.find(t => t.year === selectedYear) || timelineHistory[2];

  return (
    <section id="passport" className="py-16 lg:py-24 bg-gradient-to-b from-[#072036] via-[#093557] to-[#072036] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Key Innovation Module</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Instrument's Digital Passport
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2.5 leading-relaxed">
            A permanent, lifetime cryptographic identity for every legal measuring device tracking complete lifecycle calibration, ownership transfers, and compliance audits.
          </p>
        </div>

        {/* Passport Showcase Container */}
        <div className="bg-slate-900/95 border border-sky-400/30 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Top Holographic Header Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8 border-b border-slate-700/80">
            
            {/* Left Passport Header Card with Chip */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-[#0a2742] to-slate-950 p-6 rounded-2xl border border-sky-500/30 text-left shadow-lg relative overflow-hidden">
              
              {/* Chip Graphic & Status */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  {/* Smart Card Chip Graphic */}
                  <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 border border-amber-600 flex items-center justify-center shadow-md relative overflow-hidden">
                    <div className="w-full h-0.5 bg-amber-700/50 my-auto"></div>
                    <div className="h-full w-0.5 bg-amber-700/50 mx-auto absolute"></div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-sky-950/80 text-sky-300 border border-sky-700 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>NFC / QR ACTIVE</span>
                  </div>
                </div>

                <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                  National Digital Instrument Passport
                </div>
                <div className="text-2xl font-black text-white font-mono tracking-tight mt-0.5">
                  {passportData.instrumentId}
                </div>
                <div className="text-xs text-sky-300 font-semibold mt-1">
                  {passportData.model} • {passportData.accuracyClass}
                </div>
              </div>

              {/* Health & Status */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Status</span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/40 inline-block mt-0.5">
                    {passportData.currentStatus}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Accuracy Health</span>
                  <span className="text-xs font-black text-amber-300 font-mono inline-block mt-0.5">
                    {passportData.healthIndex}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Passport Specs Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-left">
              
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Registered Owner</span>
                <span className="text-xs font-bold text-white block">{passportData.owner}</span>
                <span className="text-[10px] text-slate-400">{passportData.location}</span>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Manufacturer</span>
                <span className="text-xs font-bold text-white block">{passportData.manufacturer}</span>
                <span className="text-[10px] text-slate-400">Model: {passportData.model}</span>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Serial & Capacity</span>
                <span className="text-xs font-mono font-bold text-amber-300 block">{passportData.serialNumber}</span>
                <span className="text-[10px] text-slate-400">Cap: {passportData.capacity}</span>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Current Certificate</span>
                <span className="text-xs font-mono font-bold text-sky-300 block">{passportData.currentCertificate}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Active & Audited</span>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Commissioning Date</span>
                <span className="text-xs font-bold text-white block">{passportData.initialCommissioning}</span>
                <span className="text-[10px] text-slate-400">First Verification</span>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Digital Security Seal</span>
                <span className="text-xs font-mono font-bold text-emerald-400 block">TAMPER-EVIDENT</span>
                <span className="text-[10px] text-slate-400">Lead Wire & QR Verified</span>
              </div>

            </div>

          </div>

          {/* Verification Timeline (2024 -> 2025 -> 2026 -> 2027) */}
          <div className="pt-8 text-left">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <span>Lifetime Verification Timeline</span>
              </h3>
              <span className="text-xs text-slate-400">Click a year to inspect audit records</span>
            </div>

            {/* Timeline Stepper Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
              {timelineHistory.map((item) => {
                const isSelected = selectedYear === item.year;
                return (
                  <button
                    key={item.year}
                    onClick={() => setSelectedYear(item.year)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-950 border-sky-400 shadow-lg shadow-sky-950/50 ring-2 ring-sky-400'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl font-black text-white font-mono">{item.year}</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.isDue 
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{item.type}</div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Timeline Audit Log for Selected Year */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300 text-sm">{activeEvent.year} Verification Event</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">{activeEvent.date}</span>
                </div>
                <div className="text-slate-400">
                  Officer: <strong className="text-slate-200">{activeEvent.officer}</strong> | Certificate: <code className="text-sky-300 font-mono">{activeEvent.cert}</code>
                </div>
                <div className="text-slate-400">
                  Tolerance Observed: <strong className="text-emerald-400">{activeEvent.errorMax}</strong> | Standards Used: <span className="text-slate-300">{activeEvent.testWeights}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">
                  Seal: <strong className="text-amber-300 font-mono">{activeEvent.seal}</strong>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
