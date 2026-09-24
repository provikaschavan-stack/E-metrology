import React, { useState, useEffect } from 'react';
import { X, ClipboardCheck, CheckCircle2, ArrowRight, AlertCircle, Wifi, Scale, Sparkles, RefreshCw } from 'lucide-react';
import { instrumentsAPI, applicationsAPI, authAPI } from '../../api/client';

export default function ApplyModal({ isOpen, onClose, onTrackApplication, onApplicationCreated }) {
  const [mode, setMode] = useState('existing'); // 'existing' | 'new'
  const [instruments, setInstruments] = useState([]);
  const [loadingInstruments, setLoadingInstruments] = useState(false);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState('');
  const [applicationType, setApplicationType] = useState('VERIFICATION');
  const [remarks, setRemarks] = useState('');

  // New instrument form state
  const [newInstrumentData, setNewInstrumentData] = useState({
    instrument_type: 'Electronic Weighing Scale (Class III)',
    manufacturer: 'Essae-Teraoka Ltd.',
    model: 'DIGI-SCALE 50KG v2',
    serial_number: 'WS-' + Math.floor(100000 + Math.random() * 900000),
    capacity: '50 kg (e=5g)',
    location: 'Shop 14, Market Yard, Gultekdi, Pune - 411037',
    registration_date: new Date().toISOString().split('T')[0],
    status: 'PENDING_VERIFICATION'
  });

  const [submittedApp, setSubmittedApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLoggedIn = authAPI.isLoggedIn();
  const currentUser = authAPI.getCurrentUser();

  // Fetch instruments whenever modal opens
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchInstruments();
    }
  }, [isOpen, isLoggedIn]);

  const fetchInstruments = async () => {
    setLoadingInstruments(true);
    try {
      const list = await instrumentsAPI.getAll();
      setInstruments(list || []);
      if (list && list.length > 0) {
        setSelectedInstrumentId(list[0].id);
      } else {
        setMode('new');
      }
    } catch {
      setMode('new');
    } finally {
      setLoadingInstruments(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError('Please log in as a BUSINESS user or ADMIN to submit a verification application.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let targetInstrumentId = selectedInstrumentId;

      // If mode is 'new', register the instrument first
      if (mode === 'new') {
        const createdInst = await instrumentsAPI.create(newInstrumentData);
        targetInstrumentId = createdInst.id;
      }

      // Submit verification application to POST /api/applications
      const app = await applicationsAPI.create({
        instrument_id: targetInstrumentId,
        application_type: applicationType,
        remarks: remarks || `Verification request submitted for ${mode === 'new' ? newInstrumentData.instrument_type : 'registered instrument'}`
      });

      setSubmittedApp(app);
      if (onApplicationCreated) {
        onApplicationCreated(app);
      }
    } catch (err) {
      setError(err.message || 'Verification application submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedApp(null);
    setError('');
    setRemarks('');
    onClose();
  };

  const selectedInstDetails = instruments.find(i => i.id === parseInt(selectedInstrumentId, 10));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">

        {/* Modal Header */}
        <div className="bg-[#0a3a60] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-500/30 flex items-center justify-center text-sky-200 shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div className="truncate text-left">
              <h3 className="text-sm sm:text-base font-bold truncate">Apply for Verification</h3>
              <p className="text-[11px] sm:text-xs text-sky-200 truncate">
                {currentUser ? `Applicant: ${currentUser.name} (${currentUser.role})` : 'Legal Metrology Statutory Application'}
              </p>
            </div>
          </div>
          <button onClick={handleReset} className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {submittedApp ? (
            <div className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900">Application Submitted!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your verification request has been registered in the national metrology database. An Administrator will assign a Legal Metrology Officer (LMO) or GATC calibration lab.
              </p>

              <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl max-w-sm mx-auto text-left space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Application No.</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {submittedApp.status}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black font-mono text-[#0a3a60]">
                  {submittedApp.application_number}
                </div>
                <div className="text-[11px] text-slate-600 border-t border-sky-200 pt-1.5 flex justify-between">
                  <span>Type: <strong>{submittedApp.application_type}</strong></span>
                  <span>Instrument: <strong>{submittedApp.instrument_code || submittedApp.instrument_id_ref || 'Registered'}</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-4">
                {onTrackApplication && (
                  <button
                    onClick={() => {
                      onTrackApplication(submittedApp.application_number);
                      handleReset();
                    }}
                    className="px-5 py-2.5 bg-[#0a3a60] hover:bg-[#07253d] text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm"
                  >
                    Track Live Application Status
                  </button>
                )}
                <button onClick={handleReset} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs text-left">

              {/* Live Connection Notice */}
              {!isLoggedIn ? (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>You are not logged in. Please log in as a <strong>BUSINESS</strong> user to submit. Application will be sent via <code className="font-mono">POST /api/applications</code>.</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Backend Connected:</strong> Applying as <strong>{currentUser?.name}</strong></span>
                  </div>
                  <span className="font-mono text-[10px] bg-emerald-200/60 text-emerald-900 px-1.5 py-0.5 rounded font-bold">{currentUser?.role}</span>
                </div>
              )}

              {/* Mode Toggle: Existing vs New Instrument */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Select Instrument Source</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('existing')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${mode === 'existing'
                      ? 'bg-[#0a3a60] text-white border-[#0a3a60] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Registered Instrument ({instruments.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('new')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${mode === 'new'
                      ? 'bg-[#0a3a60] text-white border-[#0a3a60] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>+ New Instrument</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: Existing Instrument Selector */}
              {mode === 'existing' && (
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {loadingInstruments ? (
                    <div className="py-4 text-center text-slate-400 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
                      <span>Loading registered instruments…</span>
                    </div>
                  ) : instruments.length === 0 ? (
                    <div className="py-2 text-center text-slate-500">
                      <p>No registered instruments found for your account.</p>
                      <button
                        type="button"
                        onClick={() => setMode('new')}
                        className="mt-1.5 text-xs text-sky-700 font-bold underline cursor-pointer"
                      >
                        Click here to register a new instrument & apply
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Choose Instrument</label>
                      <select
                        value={selectedInstrumentId}
                        onChange={(e) => setSelectedInstrumentId(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500"
                        required
                      >
                        {instruments.map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {inst.instrument_id} — {inst.instrument_type} (S/N: {inst.serial_number})
                          </option>
                        ))}
                      </select>

                      {selectedInstDetails && (
                        <div className="mt-2.5 p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] grid grid-cols-2 gap-2 text-slate-600">
                          <div>Manufacturer: <strong className="text-slate-800">{selectedInstDetails.manufacturer}</strong></div>
                          <div>Capacity: <strong className="text-slate-800">{selectedInstDetails.capacity}</strong></div>
                          <div className="col-span-2 truncate">Location: <strong className="text-slate-800">{selectedInstDetails.location}</strong></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mode 2: New Instrument Form */}
              {mode === 'new' && (
                <div className="space-y-3 bg-sky-50/50 p-3.5 rounded-xl border border-sky-200">
                  <div className="text-[11px] font-bold text-[#0a3a60] uppercase">Register & Apply in 1-Step</div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Instrument Category</label>
                    <select
                      value={newInstrumentData.instrument_type}
                      onChange={(e) => setNewInstrumentData({ ...newInstrumentData, instrument_type: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                    >
                      <option>Electronic Weighing Scale (Class III)</option>
                      <option>Fuel Dispensing Pump (Nozzle 1-4)</option>
                      <option>Precision Jewellery Balance (Class II)</option>
                      <option>Weighbridge Heavy Commercial (Class IV)</option>
                      <option>Volumetric Measure Container</option>
                      <option>Supermarket Counter Scale (Class III)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Manufacturer</label>
                      <input
                        type="text"
                        value={newInstrumentData.manufacturer}
                        onChange={(e) => setNewInstrumentData({ ...newInstrumentData, manufacturer: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Model Name</label>
                      <input
                        type="text"
                        value={newInstrumentData.model}
                        onChange={(e) => setNewInstrumentData({ ...newInstrumentData, model: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Serial Number</label>
                      <input
                        type="text"
                        value={newInstrumentData.serial_number}
                        onChange={(e) => setNewInstrumentData({ ...newInstrumentData, serial_number: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Max Capacity</label>
                      <input
                        type="text"
                        value={newInstrumentData.capacity}
                        onChange={(e) => setNewInstrumentData({ ...newInstrumentData, capacity: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Installation Location</label>
                    <input
                      type="text"
                      value={newInstrumentData.location}
                      onChange={(e) => setNewInstrumentData({ ...newInstrumentData, location: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Application Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Application Type</label>
                    <select
                      value={applicationType}
                      onChange={(e) => setApplicationType(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0a3a60] focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="VERIFICATION">Initial Verification (VERIFICATION)</option>
                      <option value="RE_VERIFICATION">Periodic / Annual (RE_VERIFICATION)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Statutory Verification Fee</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700">
                      ₹ 450.00 (Standard Tariff)
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Applicant Remarks / Calibration Notes</label>
                  <textarea
                    rows="2"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g., Requested for routine annual stamping; instrument located at front billing counter."
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Error display */}
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <button type="button" onClick={handleReset} className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer text-xs">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || (mode === 'existing' && !selectedInstrumentId)}
                  className="px-5 py-2.5 bg-[#0a3a60] hover:bg-[#07253d] disabled:bg-slate-400 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                >
                  <span>{loading ? 'Submitting Application…' : 'Submit Application (POST /api/applications)'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}

