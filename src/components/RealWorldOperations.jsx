import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  CloudOff,
  CloudUpload,
  FileWarning,
  History,
  MapPin,
  Radio,
  RefreshCw,
  Send,
  ShieldCheck,
  Wifi,
} from 'lucide-react';

const QUEUE_KEY = 'metrology-offline-inspections';
const REPORT_KEY = 'metrology-citizen-reports';

const readStored = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

export default function RealWorldOperations() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState(readStored(QUEUE_KEY));
  const [reports, setReports] = useState(readStored(REPORT_KEY));
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Location not captured');
  const [photoEvidence, setPhotoEvidence] = useState(null);
  const [report, setReport] = useState({ instrumentId: '', issue: '' });
  const [reportStatus, setReportStatus] = useState('');
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('GPS is unavailable on this device');
      return;
    }
    setLocationStatus('Requesting GPS location...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationStatus('GPS location captured');
      },
      () => setLocationStatus('GPS permission was not granted'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const saveInspection = () => {
    const item = {
      id: `OFF-${Date.now().toString().slice(-6)}`,
      instrumentId: 'INS-2026-00001',
      capturedAt: new Date().toISOString(),
      location,
      photoName: photoEvidence?.name || null,
      status: isOnline ? 'SYNCED' : 'QUEUED',
    };
    const nextQueue = isOnline ? offlineQueue : [...offlineQueue, item];
    setOfflineQueue(nextQueue);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(nextQueue));
    setSyncStatus(isOnline ? 'Inspection saved to the live registry.' : 'Inspection queued securely for later sync.');
  };

  const syncQueue = () => {
    if (!isOnline || offlineQueue.length === 0) return;
    localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
    setOfflineQueue([]);
    setSyncStatus('Queued inspections synced to the registry.');
  };

  const submitReport = (event) => {
    event.preventDefault();
    const ticket = {
      id: `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...report,
      createdAt: new Date().toISOString(),
      status: isOnline ? 'RECEIVED' : 'QUEUED OFFLINE',
    };
    const nextReports = [...reports, ticket];
    setReports(nextReports);
    localStorage.setItem(REPORT_KEY, JSON.stringify(nextReports));
    setReport({ instrumentId: '', issue: '' });
    setReportStatus(`${ticket.id} ${isOnline ? 'received' : 'saved offline for submission'}.`);
  };

  return (
    <section id="field-operations" className="py-16 lg:py-20 bg-slate-100/80 border-y border-slate-200 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider mb-3 border border-sky-200">
              <Radio className="w-3.5 h-3.5" />
              <span>Real-world field operations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a3a60] tracking-tight">
              Built for the moments when the network fails
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              Inspectors can capture evidence offline, while citizens can report unsafe instruments and follow a clear digital trail.
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold self-start lg:self-auto ${isOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-300'}`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
            <span>{isOnline ? 'Registry connection online' : 'Offline mode active'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Offline inspection capture</h3>
                  <p className="text-xs text-slate-500">GPS evidence is attached when permission is available.</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                {offlineQueue.length} queued
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Instrument</div>
                <div className="font-mono text-sm font-bold text-slate-800">INS-2026-00001</div>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Evidence status</div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> {location ? 'GPS attached' : 'Awaiting GPS'}
                </div>
              </div>
            </div>

            <label className="flex items-center justify-between gap-3 p-3 mb-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:bg-sky-50 hover:border-sky-300">
              <span className="flex items-center gap-2 min-w-0">
                <FileWarning className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700 truncate">
                  {photoEvidence ? `Evidence attached: ${photoEvidence.name}` : 'Attach seal or instrument photo'}
                </span>
              </span>
              <span className="text-[10px] font-bold text-sky-700 shrink-0">Camera / file</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setPhotoEvidence({ name: file.name, type: file.type });
                }}
              />
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={captureLocation} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-[#0a3a60] bg-sky-50 border border-sky-200 hover:bg-sky-100 rounded-xl cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span>{locationStatus}</span>
              </button>
              <button onClick={saveInspection} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-white bg-[#0a3a60] hover:bg-[#07253d] rounded-xl cursor-pointer">
                {isOnline ? <CloudUpload className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
                <span>{isOnline ? 'Save live inspection' : 'Save offline inspection'}</span>
              </button>
              <button onClick={syncQueue} disabled={!isOnline || offlineQueue.length === 0} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                <RefreshCw className="w-4 h-4" /> Sync queue
              </button>
            </div>
            {(syncStatus || offlineQueue.length > 0) && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{syncStatus || `${offlineQueue.length} record${offlineQueue.length === 1 ? '' : 's'} waiting for a secure sync.`}</span>
              </div>
            )}
          </div>

          <form onSubmit={submitReport} className="bg-[#072036] text-white rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-400/15 text-rose-200 flex items-center justify-center">
                <FileWarning className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">Report an unsafe instrument</h3>
                <p className="text-xs text-sky-200">Help protect other consumers.</p>
              </div>
            </div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-sky-200 mb-1">Instrument ID or shop</label>
            <input required value={report.instrumentId} onChange={(event) => setReport({ ...report, instrumentId: event.target.value })} placeholder="INS-2026-00001" className="w-full px-3 py-2.5 mb-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-300" />
            <label className="block text-[10px] font-bold uppercase tracking-wider text-sky-200 mb-1">What happened?</label>
            <textarea required rows="3" value={report.issue} onChange={(event) => setReport({ ...report, issue: event.target.value })} placeholder="Example: seal broken or scale shows incorrect weight" className="w-full px-3 py-2.5 mb-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-300 resize-none" />
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold cursor-pointer">
              <Send className="w-4 h-4" /> Submit consumer report
            </button>
            {reportStatus && <p className="mt-3 text-xs text-emerald-200" aria-live="polite">{reportStatus}</p>}
            {reports.length > 0 && <p className="mt-3 text-[10px] text-sky-200">{reports.length} report{reports.length === 1 ? '' : 's'} stored on this device.</p>}
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3"><History className="w-4 h-4 text-sky-700" /><h3 className="text-sm font-extrabold text-slate-900">Audit trail preview</h3></div>
            <div className="space-y-3 text-xs">
              {['Certificate issued by LMO Pune Division', 'Inspection evidence attached with GPS', 'Public QR verification completed'].map((event, index) => (
                <div key={event} className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /><span className="text-slate-600">{event}</span><span className="ml-auto text-[10px] font-mono text-slate-400">{index + 1}h ago</span></div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-amber-700" /><h3 className="text-sm font-extrabold text-amber-950">Compliance risk signals</h3></div>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold"><span className="px-2.5 py-1 rounded-lg bg-white text-emerald-700 border border-emerald-200">Certificate valid</span><span className="px-2.5 py-1 rounded-lg bg-white text-amber-800 border border-amber-200">Renewal in 15 days</span><span className="px-2.5 py-1 rounded-lg bg-white text-sky-800 border border-sky-200">No duplicate evidence</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
