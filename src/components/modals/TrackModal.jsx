import React, { useState, useEffect } from 'react';
import { X, Search, CalendarClock, AlertCircle, RefreshCw, FileCheck } from 'lucide-react';
import { applicationsAPI, verificationsAPI } from '../../api/client';

const SAMPLE_APPS = [
  { id: 'APP-2026-0001', label: 'Approved (Re-verif)' },
  { id: 'APP-2026-0002', label: 'Field Verification' },
  { id: 'APP-2026-0003', label: 'Submitted (New)' },
  { id: 'APP-2026-0004', label: 'Scheduled (GATC)' }
];

export default function TrackModal({ isOpen, onClose, initialAppId = "APP-2026-0001" }) {
  const [appIdInput, setAppIdInput] = useState(initialAppId);
  const [application, setApplication] = useState(null);
  const [verificationRecord, setVerificationRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const target = initialAppId || 'APP-2026-0001';
      setAppIdInput(target);
      fetchApplication(target);
    }
  }, [isOpen, initialAppId]);

  const fetchApplication = async (appNo) => {
    if (!appNo || !appNo.trim()) return;
    setLoading(true);
    setError('');
    setVerificationRecord(null);
    try {
      const app = await applicationsAPI.track(appNo.trim());
      setApplication(app);

      // Attempt to load attached inspection record if available
      try {
        const vRec = await verificationsAPI.getByApplication(appNo.trim());
        setVerificationRecord(vRec);
      } catch {
        setVerificationRecord(null);
      }
    } catch (err) {
      setError(err.message || `Application '${appNo}' not found.`);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplication(appIdInput);
  };

  const getStageIndex = (status) => {
    switch (status) {
      case 'SUBMITTED': return 1;
      case 'ASSIGNED': return 2;
      case 'SCHEDULED': return 3;
      case 'FIELD_VERIFICATION': return 4;
      case 'UNDER_REVIEW': return 5;
      case 'APPROVED':
      case 'REJECTED': return 6;
      default: return 1;
    }
  };

  const currentStage = application ? getStageIndex(application.status) : 1;

  const STAGES = [
    { step: 1, title: 'Application Submitted', key: 'SUBMITTED', desc: 'Application received and registered in central metrology ledger.' },
    { step: 2, title: 'Officer Assigned', key: 'ASSIGNED', desc: application?.assigned_to_name ? `Assigned to: ${application.assigned_to_name} (${application.assigned_to_role || 'LMO'})` : 'Awaiting officer assignment by Controller.' },
    { step: 3, title: 'Inspection Scheduled', key: 'SCHEDULED', desc: application?.scheduled_date ? `Scheduled on: ${new Date(application.scheduled_date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}` : 'Inspection date pending scheduling.' },
    { step: 4, title: 'Field Verification', key: 'FIELD_VERIFICATION', desc: 'Officer conducting on-site physical calibration and proof testing.' },
    { step: 5, title: 'Under Metrology Review', key: 'UNDER_REVIEW', desc: 'Accuracy logs and tolerance variance under audit review.' },
    { step: 6, title: application?.status === 'REJECTED' ? 'Application Rejected' : 'Verification Approved', key: 'APPROVED', desc: application?.status === 'REJECTED' ? 'Verification rejected due to accuracy variance exceeding MPE.' : 'Approved: Instrument certified within statutory accuracy tolerance.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="bg-[#0a3a60] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-500/30 flex items-center justify-center text-sky-200 shrink-0">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div className="truncate text-left">
              <h3 className="text-sm sm:text-base font-bold truncate">Track Verification Application</h3>
              <p className="text-[11px] sm:text-xs text-sky-200 truncate">Real-Time Verification Lifecycle & Officer Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Sample Chips */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-2.5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={appIdInput}
                onChange={(e) => setAppIdInput(e.target.value)}
                placeholder="e.g. APP-2026-0001"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0a3a60] text-white font-bold text-xs rounded-xl hover:bg-[#07253d] transition-colors cursor-pointer shrink-0 disabled:bg-slate-400 flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Track</span>}
            </button>
          </form>

          {/* Quick Sample Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 font-semibold">Test Sample:</span>
            {SAMPLE_APPS.map(sample => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setAppIdInput(sample.id);
                  fetchApplication(sample.id);
                }}
                className={`px-2 py-0.5 rounded-md border font-mono transition-colors cursor-pointer ${appIdInput === sample.id
                    ? 'bg-sky-100 text-[#0a3a60] border-sky-300 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                {sample.id}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Track Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 text-xs text-left">

          {/* Loading */}
          {loading && (
            <div className="text-center py-10 text-slate-400">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-sky-600" />
              <span>Fetching live application status…</span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Application Details & Timeline */}
          {application && !loading && (
            <>
              {/* Metadata banner */}
              <div className="bg-sky-50/80 p-3.5 rounded-2xl border border-sky-200 space-y-2">
                <div className="flex flex-wrap justify-between items-center gap-1">
                  <span className="font-bold text-[#0a3a60] text-xs sm:text-sm">
                    {application.instrument_type || 'Electronic Weighing Scale'}
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${application.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      application.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-sky-100 text-sky-800'
                    }`}>
                    {application.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-sky-200/60">
                  <div>
                    App Number: <strong className="font-mono text-slate-900">{application.application_number}</strong>
                  </div>
                  <div>
                    Type: <strong className="text-slate-900">{application.application_type}</strong>
                  </div>
                  <div className="truncate">
                    Applicant: <strong className="text-slate-900">{application.applicant_name || 'Bharat Retailers'}</strong>
                  </div>
                  <div>
                    Instrument ID: <strong className="font-mono text-slate-900">{application.instrument_code || application.instrument_id_ref || 'INS-REGISTERED'}</strong>
                  </div>
                </div>

                {application.remarks && (
                  <div className="p-2 bg-white/80 rounded-lg border border-sky-100 text-[11px] text-slate-700">
                    <strong>Latest Remarks:</strong> {application.remarks}
                  </div>
                )}
              </div>

              {/* Stepper Timeline */}
              <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-3">
                {STAGES.map((st) => {
                  const isDone = currentStage > st.step || (currentStage === st.step && (application.status === 'APPROVED' || application.status === 'REJECTED'));
                  const isCurrent = currentStage === st.step && application.status !== 'APPROVED' && application.status !== 'REJECTED';

                  return (
                    <div key={st.step} className="relative group">
                      <div className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isDone
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                          : isCurrent
                            ? 'bg-sky-600 text-white ring-4 ring-sky-100 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                        {isDone ? '✓' : st.step}
                      </div>

                      <div className="pl-2">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-xs ${isCurrent ? 'text-[#0a3a60]' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                            {st.title}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] uppercase font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                              Current Stage
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Attached Field Verification Findings (if inspected) */}
              {verificationRecord && (
                <div className="bg-emerald-50/90 p-3 rounded-xl border border-emerald-300 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                      <FileCheck className="w-4 h-4 text-emerald-700" />
                      <span>On-Site Verification Findings</span>
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                      Result: {verificationRecord.result}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-emerald-900">
                    <div>Condition: <strong>{verificationRecord.instrument_condition?.split('-')[0] || 'PASS'}</strong></div>
                    <div>Accuracy: <strong>{verificationRecord.accuracy_result?.split('-')[0] || 'PASS'}</strong></div>
                    <div>Lead Seal: <strong>{verificationRecord.seal_condition?.split('-')[0] || 'PASS'}</strong></div>
                    <div>GPS Lock: <strong>{verificationRecord.latitude || '18.5204'}° N</strong></div>
                  </div>

                  {verificationRecord.observations && (
                    <div className="text-[10px] text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-200">
                      <strong>Inspector Observations:</strong> {verificationRecord.observations}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
