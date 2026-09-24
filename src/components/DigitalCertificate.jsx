import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  Search,
  Scale,
  Check,
  FileCode,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { authAPI, certificatesAPI } from '../api/client';
import { SAMPLE_CERTIFICATES } from '../data/mockData';

export default function DigitalCertificate({ onOpenVerify, onSelectSampleCert }) {
  const [selectedCertKey, setSelectedCertKey] = useState("LM-CERT-2026-00001");
  const [liveCerts, setLiveCerts] = useState([]);
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showRawCrypto, setShowRawCrypto] = useState(false);

  // Load all certificates list from backend
  useEffect(() => {
    async function loadCertList() {
      if (!authAPI.isLoggedIn()) return;
      try {
        const list = await certificatesAPI.getAll();
        if (list && list.length > 0) {
          setLiveCerts(list);
        }
      } catch {
        // Use fallback presets
      }
    }
    loadCertList();
  }, []);

  // Fetch certificate details when selectedCertKey changes
  useEffect(() => {
    async function fetchCert() {
      if (!selectedCertKey) return;
      setLoading(true);
      try {
        const cert = await certificatesAPI.getByNumber(selectedCertKey);
        setCertData({
          certNo: cert.certificate_number || selectedCertKey,
          instrumentId: cert.instrument_code || cert.instrument_id || 'INS-XXXX',
          instrumentName: cert.instrument_type || 'Electronic Weighing Scale (Class III)',
          category: 'Statutory Metrology Device',
          ownerName: cert.issued_to_name || cert.owner_name || 'Bharat Retailers (Trader)',
          location: cert.instrument_location || cert.location || 'Pune, Maharashtra',
          manufacturer: cert.manufacturer || 'Standard Precision India',
          model: cert.model || 'DIGI-SCALE 50KG v2',
          serialNo: cert.serial_number || 'SN-458921',
          verificationDate: cert.issued_date || cert.verification_date || '2026-08-26',
          validUntil: cert.valid_until || '2027-08-26',
          status: cert.status || 'VALID',
          officer: cert.officer_name || cert.issued_by || 'Rajesh Sharma (LMO Officer)',
          sealNumber: cert.qr_token || 'GOV-SEAL-VERIFIED',
          standardsUsed: 'Class F2 Working Standards (20kg Proof)',
          qrUrl: cert.qr_url || `http://localhost:5173/verify/${cert.certificate_number || selectedCertKey}`
        });
      } catch {
        // Fallback to sample mock data
        const fallback = SAMPLE_CERTIFICATES[selectedCertKey] || SAMPLE_CERTIFICATES["LM-CERT-2026-00001"];
        setCertData({
          ...fallback,
          qrUrl: `http://localhost:5173/verify/${selectedCertKey}`
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCert();
  }, [selectedCertKey]);

  const activeCert = certData || SAMPLE_CERTIFICATES["LM-CERT-2026-00001"];

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const presetList = liveCerts.length > 0
    ? liveCerts.map(c => ({ key: c.certificate_number, status: c.status }))
    : Object.keys(SAMPLE_CERTIFICATES).map(k => ({ key: k, status: SAMPLE_CERTIFICATES[k].status }));

  return (
    <section id="certificate-preview" className="py-16 lg:py-24 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3 border border-sky-200 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-sky-700" />
            <span>Official Government Document Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            Digital Verification Certificate
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5">
            Tamper-proof, cryptographically signed statutory verification certificate issued under Rule 11 of Legal Metrology (General) Rules, 2011.
          </p>
        </div>

        {/* Certificate Selector Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-bold text-slate-500 mr-1.5">Preset Scenarios:</span>
          {presetList.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedCertKey(item.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${selectedCertKey === item.key
                  ? 'bg-[#0a3a60] text-white shadow-sm ring-2 ring-sky-400'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-300'
                }`}
            >
              {item.key} ({item.status})
            </button>
          ))}
          {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600 ml-1" />}
        </div>

        {/* Realistic High-Security Official Certificate Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl cert-security-border p-6 sm:p-10 relative overflow-hidden text-left">

          {/* Subtle Security Guilloche Pattern & Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
            <Scale className="w-[450px] h-[450px] text-[#0a3a60]" />
          </div>

          {/* Micro-print Security Border simulation */}
          <div className="absolute inset-2 border border-slate-200/60 pointer-events-none rounded-xl"></div>

          {/* Holographic Security Strip on Right Edge */}
          <div className="absolute top-0 right-10 bottom-0 w-2.5 bg-gradient-to-b from-amber-300 via-sky-300 to-emerald-300 opacity-60 pointer-events-none hidden md:block"></div>

          {/* Certificate Header Banner */}
          <div className="text-center border-b-2 border-slate-200 pb-6 relative z-10">

            {/* National Metrology Emblem Emblem */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a3a60] to-[#034d7d] text-white flex items-center justify-center font-bold text-xl shadow-md border border-amber-300/40">
                ⚖️
              </div>
            </div>

            <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              Government of India • Ministry of Consumer Affairs, Food & Public Distribution
            </div>
            <div className="text-xs font-bold text-sky-900 uppercase tracking-wider mt-0.5">
              Department of Legal Metrology (Weights & Measures)
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0a3a60] tracking-tight uppercase mt-1">
              Digital Verification Certificate
            </h3>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              Issued under Rule 11 of the Legal Metrology (General) Rules, 2011
            </div>

            {/* Status Stamp Badge */}
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm border-2 shadow-xs ${activeCert.status === 'VALID' ? 'bg-emerald-50 text-emerald-800 border-emerald-400/80' :
                activeCert.status === 'EXPIRING_SOON' ? 'bg-amber-50 text-amber-800 border-amber-400/80' :
                  activeCert.status === 'EXPIRED' ? 'bg-rose-50 text-rose-800 border-rose-400/80' :
                    'bg-slate-100 text-slate-800 border-slate-300'
              }`}>
              {activeCert.status === 'VALID' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {activeCert.status === 'EXPIRING_SOON' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {activeCert.status === 'EXPIRED' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>
                STATUS: {
                  activeCert.status === 'VALID' ? '✓ VALID & CERTIFIED' :
                    activeCert.status === 'EXPIRING_SOON' ? '⚠️ EXPIRING SOON (<30 DAYS)' :
                      activeCert.status === 'EXPIRED' ? '🔴 EXPIRED — ACTION REQUIRED' :
                        'INVALID'
                }
              </span>
            </div>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-8 py-6 border-b border-slate-200 text-xs sm:text-[13px] relative z-10">

            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Certificate No:</span>
                <span className="font-mono font-black text-[#0a3a60]">{activeCert.certNo}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Instrument ID:</span>
                <span className="font-mono font-black text-slate-900">{activeCert.instrumentId}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Instrument Class:</span>
                <span className="font-bold text-slate-900">{activeCert.instrumentName}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Manufacturer & Model:</span>
                <span className="font-medium text-slate-800">{activeCert.manufacturer} • {activeCert.model}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Serial Number:</span>
                <span className="font-mono font-bold text-slate-800">{activeCert.serialNo}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Registered Owner:</span>
                <span className="font-bold text-slate-800 text-right">{activeCert.ownerName}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Verification Date:</span>
                <span className="font-bold text-slate-800">{activeCert.verificationDate}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Valid Until:</span>
                <span className={`font-black ${activeCert.status === 'VALID' ? 'text-emerald-700' :
                    activeCert.status === 'EXPIRING_SOON' ? 'text-amber-700' :
                      'text-rose-700'
                  }`}>
                  {activeCert.validUntil}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Physical Seal Serial:</span>
                <span className="font-mono font-bold text-sky-800">{activeCert.sealNumber}</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[11px]">Verifying Officer:</span>
                <span className="font-bold text-slate-800">{activeCert.officer}</span>
              </div>
            </div>

          </div>

          {/* QR Code & Authority Stamp Row */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">

            {/* QR Box with Scan Trigger */}
            <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full sm:w-auto shadow-2xs">
              <a
                href={`#qr-verification`}
                onClick={() => {
                  if (onSelectSampleCert) onSelectSampleCert(activeCert.certNo);
                  onOpenVerify();
                }}
                className="w-20 h-20 bg-white p-1.5 rounded-xl border border-slate-300 flex items-center justify-center shadow-xs shrink-0 hover:border-sky-500 transition-colors group cursor-pointer"
                title={`Scan QR code to verify at: ${activeCert.qrUrl}`}
              >
                <svg className="w-full h-full text-slate-900 group-hover:text-[#0a3a60] transition-colors" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="11" y="11" width="16" height="16" rx="1" />
                  <rect x="67" y="5" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="73" y="11" width="16" height="16" rx="1" />
                  <rect x="5" y="67" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="11" y="73" width="16" height="16" rx="1" />
                  <circle cx="48" cy="18" r="4" />
                  <circle cx="52" cy="38" r="4" />
                  <circle cx="48" cy="62" r="4" />
                  <circle cx="20" cy="48" r="4" />
                  <circle cx="78" cy="48" r="4" />
                  <circle cx="72" cy="78" r="4" />
                  <circle cx="85" cy="85" r="4" />
                </svg>
              </a>
              <div className="text-left">
                <div className="text-xs font-bold text-[#0a3a60]">Cryptographic 2D QR Code</div>
                <div className="text-[11px] text-slate-500 font-mono break-all">{activeCert.qrUrl}</div>
                <div className="text-[10px] font-mono text-emerald-700 font-bold mt-1">
                  SHA-256: 7f83b165...e9b2
                </div>
              </div>
            </div>

            {/* Official Digital Seal & Stamp */}
            <div className="text-center sm:text-right">
              <div className="inline-block p-4 rounded-2xl border-2 border-dashed border-[#0a3a60]/60 bg-sky-50/70 text-center shadow-xs">
                <div className="text-[10px] uppercase tracking-wider font-black text-[#0a3a60]">
                  Digitally Stamped & Sealed
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  Controller of Legal Metrology
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  State Enforcement Authority (Maharashtra)
                </div>
              </div>
            </div>

          </div>

          {/* Raw Cryptographic Metadata Inspector */}
          {showRawCrypto && (
            <div className="mt-4 p-3.5 bg-slate-900 text-sky-200 rounded-xl font-mono text-[10px] space-y-1 relative z-10 animate-in fade-in">
              <div><strong>Signature Algorithm:</strong> RSASSA-PKCS1-v1_5 (2048 bit)</div>
              <div><strong>Issuer ID:</strong> GOV-IN-LM-MH-PUNE-ZONE4</div>
              <div><strong>Digest Checksum:</strong> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
              <div><strong>Statutory Schedule:</strong> Class III NAWI - OIML R76 Compliance</div>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  if (onSelectSampleCert) {
                    onSelectSampleCert(certData.certNo);
                  }
                  onOpenVerify();
                }}
                className="px-4 py-2.5 bg-[#0a3a60] hover:bg-[#07253d] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-sky-300" />
                <span>Verify Certificate Online</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Downloaded! (Demo PDF)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>Download PDF Certificate</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowRawCrypto(!showRawCrypto)}
                className="px-3 py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0a3a60] font-bold text-xs rounded-xl border border-sky-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{showRawCrypto ? 'Hide Crypto' : 'Inspect Signatures'}</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500 italic">
              *Valid only with intact physical hologram seal & digital QR match.
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
