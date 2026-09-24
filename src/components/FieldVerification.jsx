import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Camera, 
  FileText, 
  CheckCircle2, 
  MapPin, 
  Scale, 
  Battery, 
  Wifi, 
  Signal, 
  X,
  Crosshair,
  RefreshCw,
} from 'lucide-react';
import { applicationsAPI, verificationsAPI, authAPI } from '../api/client';

export default function FieldVerification() {
  const [assignedApps, setAssignedApps] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('APP-2026-0002');
  const [verificationResult, setVerificationResult] = useState('PASS');
  
  const [checklist, setChecklist] = useState({
    identification: true,
    condition: true,
    accuracy: true,
    seal: true,
    documents: true
  });

  const [evidenceCount, setEvidenceCount] = useState(2);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80');
  const [observations, setObservations] = useState([
    "Tested with 10kg & 20kg F2 standard weights. Zero point stability verified within OIML Class III limits.",
    "Physical lead seal #GOV-SEAL-88912 affixed securely."
  ]);
  const [newObsText, setNewObsText] = useState("");
  const [showObsModal, setShowObsModal] = useState(false);
  const [showCamModal, setShowCamModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [error, setError] = useState('');

  const isLoggedIn = authAPI.isLoggedIn();
  const currentUser = authAPI.getCurrentUser();

  const loadApplications = async () => {
    if (!isLoggedIn) return;
    try {
      const apps = await applicationsAPI.getAll();
      if (apps && apps.length > 0) {
        setAssignedApps(apps);
        // Find an active scheduled or field verification app, or first
        const active = apps.find(a => ['SCHEDULED', 'FIELD_VERIFICATION'].includes(a.status)) || apps[0];
        if (active && !selectedAppId) {
          setSelectedAppId(active.application_number);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadApplications();
  }, [isLoggedIn, currentUser?.role]);

  const toggleCheck = (key) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAddObservation = (e) => {
    e.preventDefault();
    if (!newObsText.trim()) return;
    setObservations(prev => [...prev, newObsText.trim()]);
    setNewObsText("");
    setShowObsModal(false);
  };

  const handleCaptureEvidence = () => {
    setShowCamModal(true);
  };

  const handleSnapPhoto = () => {
    setEvidenceCount(prev => prev + 1);
    setPhotoUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80');
    setShowCamModal(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        application_number: selectedAppId,
        inspection_date: new Date().toISOString().split('T')[0],
        instrument_condition: checklist.condition ? 'PASS - Intact housing, level bubble centered' : 'FAIL - Housing damage',
        accuracy_result: checklist.accuracy ? 'PASS - Error ±0.02g within statutory MPE limits' : 'FAIL - Error exceeds MPE limits',
        seal_condition: checklist.seal ? 'PASS - Lead seal #GOV-SEAL-88912 affixed' : 'FAIL - Tampered or missing seal',
        document_result: checklist.documents ? 'PASS - Verification book & Model approval checked' : 'FAIL - Incomplete documents',
        observations: observations.join(' | '),
        latitude: 18.5204,
        longitude: 73.8567,
        photo_url: photoUrl,
        result: verificationResult
      };

      const res = await verificationsAPI.create(payload);

      setSubmissionSuccess({
        recordId: res.id,
        appNumber: selectedAppId,
        result: res.result || verificationResult,
        status: res.application_status || 'UNDER_REVIEW',
        message: `Field verification #${res.id} submitted! Application status transitioned to UNDER_REVIEW.`
      });

      // Reload applications to reflect new status
      loadApplications();

      setTimeout(() => {
        setSubmissionSuccess(null);
      }, 7000);
    } catch (err) {
      setError(err.message || 'Failed to submit field verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const currentApp = assignedApps.find(a => a.application_number === selectedAppId) || {
    application_number: selectedAppId || 'APP-2026-0002',
    instrument_type: 'Fuel Dispensing Pump (Nozzle 1-4)',
    instrument_code: 'INS-2026-00084',
    instrument_location: 'NH-48, Khed Shivapur, Maharashtra',
    applicant_name: 'Bharat Retailers (Trader)',
    status: 'FIELD_VERIFICATION'
  };

  return (
    <section id="field-verification" className="py-16 lg:py-24 bg-slate-50/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3 border border-sky-200 shadow-2xs">
            <Smartphone className="w-4 h-4 text-sky-700" />
            <span>Field Verification Module · POST /api/verifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
            Field Verification Interface
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            Empowering Legal Metrology Officers (LMO) and Calibration Labs to record 5-point inspection checklists, GPS-stamped evidence, observations, and advance verification stage to <strong>UNDER_REVIEW</strong>.
          </p>
        </div>

        {/* Central Display: Realistic Mobile Phone Shell */}
        <div className="max-w-sm mx-auto relative">
          
          {/* Mobile Outer Bezel with OLED Curved Border */}
          <div className="bg-slate-950 rounded-[48px] p-4 shadow-2xl border-4 border-slate-700 ring-10 ring-slate-900/10 relative">
            
            {/* Phone Screen Container */}
            <div className="bg-white rounded-[38px] overflow-hidden border border-slate-200 text-slate-800 flex flex-col h-[700px]">
              
              {/* Phone Top Status Bar */}
              <div className="bg-[#0a3a60] text-white px-5 pt-3 pb-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold">09:41 AM</span>
                {/* Phone Notch / Island */}
                <div className="w-22 h-4.5 bg-slate-950 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* App Bar with GPS Lock */}
              <div className="bg-[#0a3a60] text-white px-4 pb-3 flex items-center justify-between border-b border-sky-800/60 text-left">
                <div>
                  <div className="text-[10px] text-sky-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>LMO Mobile Companion</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <h3 className="text-xs font-bold text-white truncate max-w-[170px]">
                    {currentApp.application_number}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-sky-950 text-sky-200 border border-sky-700 text-[9px] font-mono font-bold">
                  GPS ±1.2m
                </span>
              </div>

              {/* Scrollable Inspection Content */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-left text-xs">

                {/* Application Selector */}
                {assignedApps.length > 0 && (
                  <div className="bg-slate-100 p-2 rounded-xl border border-slate-300">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Assigned Inspection Target
                    </label>
                    <select
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                    >
                      {assignedApps.map(a => (
                        <option key={a.id || a.application_number} value={a.application_number}>
                          {a.application_number} — {a.instrument_type || 'Scale'} ({a.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Target Instrument Card */}
                <div className="bg-gradient-to-br from-sky-50 to-sky-100/60 p-3 rounded-xl border border-sky-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#0a3a60] text-xs truncate">
                      {currentApp.instrument_type || 'Electronic Weighing Scale'}
                    </span>
                    <span className="text-[9px] font-mono bg-sky-950 text-sky-200 px-1.5 py-0.5 rounded font-bold shrink-0">
                      {currentApp.instrument_code || currentApp.instrument_id_ref || 'INS-XXXX'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700 text-[11px]">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="truncate"><strong>{currentApp.instrument_location || 'Pune Market Yard'}</strong></span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Trader: {currentApp.applicant_name || 'Bharat Retailers'} · Status: <span className="font-bold text-sky-800">{currentApp.status}</span>
                  </div>
                </div>

                {/* Verification Checklist with Counter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      5-Point Inspection Checklist
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                      {checkedCount}/5 PASS
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { key: 'identification', label: '1. Identification & Plate Markings', desc: 'Model approval stamp & serial # verified' },
                      { key: 'condition', label: '2. Physical Housing & Bubble Level', desc: 'Level indicator centered, zero error checked' },
                      { key: 'accuracy', label: '3. Calibration & Accuracy Error', desc: 'Observed variance within statutory MPE limits' },
                      { key: 'seal', label: '4. Lead & Wire Seal Integrity', desc: 'Official tamper-evident seal #GOV-SEAL affixed' },
                      { key: 'documents', label: '5. Verification Book & Documents', desc: 'Verification log and user ledger counter-signed' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => toggleCheck(item.key)}
                        className={`w-full p-2 rounded-xl border text-left transition-colors cursor-pointer ${
                          checklist[item.key]
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs flex items-center gap-1.5">
                            <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[9px] font-black ${
                              checklist[item.key] ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                            }`}>
                              {checklist[item.key] ? '✓' : ''}
                            </span>
                            {item.label}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${checklist[item.key] ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-500'}`}>
                            {checklist[item.key] ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 pl-5 mt-0.5">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verification Result Selector */}
                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-600">Verification Result:</span>
                    <div className="flex gap-1">
                      {['PASS', 'FAIL', 'PENDING'].map(res => (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setVerificationResult(res)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            verificationResult === res
                              ? res === 'PASS' ? 'bg-emerald-600 text-white' : res === 'FAIL' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Evidence & Observations summary */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Evidence Attached:</span>
                    <strong className="text-[#0a3a60]">{evidenceCount} Photos (GPS Lock)</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Officer Observations:</span>
                    <strong className="text-[#0a3a60]">{observations.length} Notes Recorded</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-200">
                    GPS: 18.5204° N, 73.8567° E (Pune)
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-2 bg-rose-100 border border-rose-300 text-rose-900 rounded-xl text-[11px]">
                    {error}
                  </div>
                )}

                {/* Submission Success Receipt */}
                {submissionSuccess && (
                  <div className="bg-emerald-100 border border-emerald-400 text-emerald-900 p-3 rounded-2xl text-center animate-in fade-in shadow-sm space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 mx-auto" />
                    <div className="font-black text-xs">Verification Record #{submissionSuccess.recordId} Created!</div>
                    <div className="text-[10px] text-emerald-800">
                      Result: <strong>{submissionSuccess.result}</strong> · Status: <strong>{submissionSuccess.status}</strong>
                    </div>
                    <div className="text-[10px] text-emerald-700">Application transitioned to <strong>UNDER_REVIEW</strong>.</div>
                  </div>
                )}

              </div>

              {/* Bottom Fixed Action Buttons inside Phone */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2 shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCaptureEvidence}
                    className="py-2 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-sky-600" />
                    <span>Evidence Photo</span>
                  </button>

                  <button
                    onClick={() => setShowObsModal(true)}
                    className="py-2 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>Add Observation</span>
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer bg-[#0a3a60] hover:bg-[#07253d] text-white disabled:bg-slate-400"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{isSubmitting ? 'Recording Verification…' : 'Submit Verification (POST /api/verifications)'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Interactive Observation Modal */}
          {showObsModal && (
            <div className="absolute inset-0 bg-slate-950/70 rounded-[48px] flex items-center justify-center p-6 z-30">
              <div className="bg-white rounded-2xl p-4 w-full shadow-2xl space-y-3 text-left">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Add Field Observation</h4>
                  <button onClick={() => setShowObsModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows="3"
                  value={newObsText}
                  onChange={(e) => setNewObsText(e.target.value)}
                  placeholder="Record observed error, standard weights applied, or seal status..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-sky-500 focus:outline-none"
                ></textarea>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowObsModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddObservation}
                    className="px-3 py-1.5 text-xs bg-[#0a3a60] text-white font-bold rounded-lg cursor-pointer hover:bg-[#07253d]"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Camera Capture Modal Simulator */}
          {showCamModal && (
            <div className="absolute inset-0 bg-slate-950/80 rounded-[48px] flex items-center justify-center p-6 z-30">
              <div className="bg-slate-900 text-white rounded-2xl p-4 w-full shadow-2xl space-y-3 text-center border border-slate-700">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-sky-300">Geo-Tagged Camera Feed</span>
                  <button onClick={() => setShowCamModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-40 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 p-2 relative overflow-hidden">
                  <Scale className="w-12 h-12 text-slate-700" />
                  <Crosshair className="w-8 h-8 text-sky-400/60 absolute animate-pulse" />
                  <div className="absolute bottom-2 left-2 text-[9px] font-mono text-emerald-400 bg-black/70 px-2 py-0.5 rounded">
                    GPS: 18.5204° N, 73.8567° E (Pune)
                  </div>
                </div>

                <button
                  onClick={handleSnapPhoto}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture & Stamp Evidence Photo</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
