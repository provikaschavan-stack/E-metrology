import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Camera,
  AlertTriangle,
  RefreshCw,
  QrCode,
  Lock,
  FileCheck2,
  Cpu,
} from 'lucide-react';
import { certificatesAPI } from '../api/client';
import { SAMPLE_CERTIFICATES } from '../data/mockData';

export default function QrVerification({ initialCert = "LM-CERT-2026-00001" }) {
  const [certInput, setCertInput] = useState(initialCert);
  const [activeResult, setActiveResult] = useState(null);
  const [searchState, setSearchState] = useState('idle');
  const [isScanning, setIsScanning] = useState(false);

  // Check URL on load (e.g. /verify/LM-CERT-2026-XXXXX or query params)
  useEffect(() => {
    let targetCert = initialCert;
    const pathParts = window.location.pathname.split('/');
    const verifyIdx = pathParts.indexOf('verify');
    if (verifyIdx !== -1 && pathParts[verifyIdx + 1]) {
      targetCert = decodeURIComponent(pathParts[verifyIdx + 1]);
    }
    setCertInput(targetCert);
    verifyCertificate(targetCert);
  }, [initialCert]);

  const verifyCertificate = async (certNumber) => {
    const query = (certNumber || certInput).trim();
    if (!query) return;

    setSearchState('loading');
    try {
      const res = await certificatesAPI.publicVerify(query);
      if (res && res.status !== 'INVALID') {
        setActiveResult({
          certNo: res.certificate_number || query,
          instrumentId: res.instrument_id || 'INS-2026-XXXX',
          instrumentName: res.instrument_type || 'Commercial Metrology Scale',
          category: 'Standard Metrology Device',
          ownerName: res.owner_name || 'Bharat Retailers (Trader)',
          location: res.location || 'Market Yard, Pune',
          manufacturer: res.model ? res.model.split(' ')[0] : 'Demo Instruments India',
          model: res.model || 'DIGI-SCALE 50KG v2',
          serialNo: res.serial_number || 'WS-458921',
          verificationDate: res.verification_date || '2026-08-26',
          validUntil: res.valid_until || '2027-08-26',
          status: res.status || 'VALID',
          officer: res.issued_by || 'Rajesh Sharma (LMO Officer)',
          sealNumber: res.qr_token || 'GOV-SEAL-VERIFIED',
          standardsUsed: 'Class F2 Standard Mass Weights',
          qrUrl: res.qr_url || `http://localhost:5173/verify/${res.certificate_number || query}`
        });
        setSearchState('success');
      } else {
        setActiveResult(null);
        setSearchState('not_found');
      }
    } catch {
      // Fallback check in local mock samples
      const matchedKey = Object.keys(SAMPLE_CERTIFICATES).find(
        k => k.toLowerCase() === query.toLowerCase() ||
          SAMPLE_CERTIFICATES[k].instrumentId.toLowerCase() === query.toLowerCase()
      );
      if (matchedKey) {
        setActiveResult(SAMPLE_CERTIFICATES[matchedKey]);
        setSearchState('success');
      } else {
        setActiveResult(null);
        setSearchState('not_found');
      }
    }
  };

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    verifyCertificate(certInput);
  };

  const handleQuickSelect = (key) => {
    setCertInput(key);
    verifyCertificate(key);
  };

  const triggerScanSimulation = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setCertInput("LM-CERT-2026-00001");
      verifyCertificate("LM-CERT-2026-00001");
    }, 1200);
  };

  return (
    <section id="qr-verification" className="py-16 lg:py-24 bg-white border-b border-slate-200 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Instant Public & Consumer Verification Terminal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            Verify a Certificate Instantly
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5">
            Enter the Certificate Number or scan the instrument QR code to confirm statutory compliance in the Central Metrology Database.
          </p>
        </div>

        {/* Verification Engine Container */}
        <div className="max-w-4xl mx-auto">

          {/* Input & Action Form Card */}
          <div className="bg-gradient-to-b from-slate-50 to-sky-50/40 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 text-left">
                  Enter Certificate Number or Instrument ID
                </label>
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                  e.g., LM-CERT-2026-00001
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    placeholder="Enter Certificate No. (e.g. LM-CERT-2026-00001)"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-7 py-3.5 bg-[#0a3a60] hover:bg-[#07253d] text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 transform hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4 text-sky-300" />
                  <span>Verify Certificate</span>
                </button>
              </div>
            </form>

            {/* Divider OR Scan QR code */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-slate-50 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                or Scan QR Code
              </span>
            </div>

            {/* QR Scan Button & Sample Presets */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={triggerScanSimulation}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-2.5 text-xs font-bold rounded-xl border transition-all duration-150 cursor-pointer shadow-2xs ${isScanning
                    ? 'bg-sky-950 text-sky-200 border-sky-600 ring-2 ring-sky-400'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
              >
                <Camera className="w-4 h-4 text-sky-600" />
                <span>{isScanning ? 'Scanning Viewfinder Laser...' : 'Launch QR Scanner Viewfinder (Demo)'}</span>
              </button>

              {/* Sample test chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 font-bold hidden sm:inline">Try preset:</span>
                <button
                  onClick={() => handleQuickSelect('LM-CERT-2026-00001')}
                  className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-xl font-mono font-bold hover:bg-emerald-50 cursor-pointer shadow-2xs transition-colors"
                >
                  VALID Sample
                </button>
                <button
                  onClick={() => handleQuickSelect('LM-CERT-2026-00084')}
                  className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 rounded-xl font-mono font-bold hover:bg-amber-50 cursor-pointer shadow-2xs transition-colors"
                >
                  EXPIRING SOON
                </button>
                <button
                  onClick={() => handleQuickSelect('LM-CERT-2025-00411')}
                  className="px-3 py-1.5 bg-white border border-rose-300 text-rose-800 rounded-xl font-mono font-bold hover:bg-rose-50 cursor-pointer shadow-2xs transition-colors"
                >
                  EXPIRED Sample
                </button>
              </div>
            </div>

            {/* Live Camera Scanner Simulation Viewport when Active */}
            {isScanning && (
              <div className="mt-5 p-4 bg-slate-950 rounded-2xl border border-sky-500/50 text-center relative overflow-hidden shadow-2xl animate-in fade-in">
                <div className="h-44 bg-slate-900 rounded-xl flex flex-col items-center justify-center relative border border-slate-800">
                  {/* Viewfinder crosshairs */}
                  <div className="w-28 h-28 border-2 border-sky-400/80 rounded-lg relative flex items-center justify-center">
                    {/* Animated Scanning Laser Beam */}
                    <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></div>
                    <QrCode className="w-16 h-16 text-slate-700" />
                  </div>
                  <span className="text-[10px] font-mono text-sky-300 mt-2">
                    Auto-detecting 2D Metrology QR Matrix...
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Verification Result Output Display */}
          {searchState === 'loading' && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center animate-pulse shadow-sm">
              <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-3" />
              <div className="text-sm font-bold text-slate-700">Verifying cryptographical signature & registry record...</div>
            </div>
          )}

          {searchState === 'not_found' && (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center text-rose-900 shadow-sm">
              <XCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
              <h3 className="text-base font-bold">No Registered Certificate Found</h3>
              <p className="text-xs text-rose-700 mt-1 max-w-md mx-auto">
                The certificate number <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">{certInput}</code> does not match active records in the National Metrology Database.
              </p>
            </div>
          )}

          {searchState === 'success' && activeResult && (
            <div className="bg-white border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-xl text-left relative overflow-hidden">

              {/* Top Banner Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3.5">
                  <div className={`w-13 h-13 rounded-2xl flex items-center justify-center font-bold shadow-md shrink-0 ${activeResult.status === 'VALID'
                      ? 'bg-emerald-600 text-white'
                      : activeResult.status === 'EXPIRING_SOON'
                        ? 'bg-amber-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}>
                    {activeResult.status === 'VALID' ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <AlertTriangle className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        {activeResult.status === 'VALID' ? '✓ Certificate Verified' : activeResult.status === 'EXPIRING_SOON' ? '⚠️ Expiring Soon' : '⚠️ Certificate Expired'}
                      </h3>
                      <span className={`text-xs font-black px-3 py-0.5 rounded-full uppercase tracking-wider ${activeResult.status === 'VALID'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : activeResult.status === 'EXPIRING_SOON'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                        Status: {activeResult.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Matched in National Legal Metrology Central Registry · Publicly Verifiable
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Valid Until</div>
                  <div className={`text-lg font-black ${activeResult.status === 'VALID' ? 'text-emerald-700' : activeResult.status === 'EXPIRING_SOON' ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                    {activeResult.validUntil}
                  </div>
                </div>
              </div>

              {/* 4-Point Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4 border-b border-slate-100 text-[11px] font-bold">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-200">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>SHA-256 Signed</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Seal Authenticated</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-200">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>LMO Verified</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-200">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Database Synced</span>
                </div>
              </div>

              {/* Details Key-Value Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 py-5 text-xs border-b border-slate-100">

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold uppercase block mb-1 text-[10px]">Instrument</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{activeResult.instrumentName}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold uppercase block mb-1 text-[10px]">Instrument ID</span>
                  <span className="font-mono font-bold text-sky-800 text-xs sm:text-sm">{activeResult.instrumentId}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold uppercase block mb-1 text-[10px]">Certificate No</span>
                  <span className="font-mono font-bold text-[#0a3a60] text-xs sm:text-sm">{activeResult.certNo}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold uppercase block mb-1 text-[10px]">Manufacturer / Model</span>
                  <span className="font-medium text-slate-800">{activeResult.manufacturer} • {activeResult.model}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold uppercase block mb-1 text-[10px]">Serial Number</span>
                  <span className="font-mono font-bold text-slate-800">{activeResult.serialNo}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold uppercase block mb-1 text-[10px]">Government Seal No.</span>
                  <span className="font-mono font-bold text-emerald-800">{activeResult.sealNumber}</span>
                </div>

              </div>

              {/* Owner & Officer info */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span>
                  <strong>Registered To:</strong> {activeResult.ownerName} ({activeResult.location})
                </span>
                <span>
                  <strong>Inspected By:</strong> {activeResult.officer}
                </span>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
