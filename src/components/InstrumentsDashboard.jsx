import React, { useState, useEffect } from 'react';
import {
  Scale,
  RefreshCw,
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  Save
} from 'lucide-react';
import { instrumentsAPI, authAPI } from '../api/client';

const STATUS_CONFIG = {
  ACTIVE: { label: 'Active', color: 'bg-sky-100 text-sky-800 border-sky-300', icon: CheckCircle2, dot: 'bg-sky-500' },
  PENDING_VERIFICATION: { label: 'Pending Verification', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock, dot: 'bg-amber-400' },
  VERIFIED: { label: 'Verified', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2, dot: 'bg-emerald-500' },
  EXPIRED: { label: 'Expired', color: 'bg-rose-100 text-rose-800 border-rose-300', icon: XCircle, dot: 'bg-rose-500' }
};

function StatusBadge({ status: instrumentStatus }) {
  const cfg = STATUS_CONFIG[instrumentStatus] || STATUS_CONFIG.ACTIVE;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}

export default function InstrumentsDashboard({ onOpenApply }) {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const currentUser = authAPI.getCurrentUser();
  const isLoggedIn = authAPI.isLoggedIn();

  const fetchInstruments = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError('');
    try {
      const data = await instrumentsAPI.getAll();
      setInstruments(data);
    } catch (err) {
      setError(err.message || 'Failed to load instruments from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, [isLoggedIn]);

  const handleSaveEdit = async (id) => {
    setSaving(true);
    try {
      const payload = currentUser?.role === 'BUSINESS'
        ? (({ status: _status, ...businessEditData }) => businessEditData)(editData)
        : editData;
      const updated = await instrumentsAPI.update(id, payload);
      setInstruments(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instrumentsAPI.remove(id);
      setInstruments(prev => prev.filter(i => i.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  };

  if (!isLoggedIn) {
    return (
      <section className="py-12 sm:py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400 mb-3">
            <WifiOff className="w-5 h-5" />
            <span className="font-semibold text-sm">Instrument Registry Dashboard requires login</span>
          </div>
          <p className="text-xs text-slate-500">Log in as a BUSINESS, LMO, or ADMIN user to access the live instrument registry.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="instruments" className="py-12 sm:py-16 lg:py-20 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-1.5 border border-sky-200">
              <Wifi className="w-3.5 h-3.5 text-sky-600" />
              <span>Live Backend · /api/instruments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a3a60] tracking-tight">
              Instrument Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser?.role === 'BUSINESS'
                ? `Showing instruments registered to: ${currentUser.name}`
                : `Viewing all instruments — ${currentUser?.role} access level`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchInstruments}
              disabled={loading}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-sky-600 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {['BUSINESS', 'ADMIN'].includes(currentUser?.role) && (
              <button
                onClick={onOpenApply}
                className="px-3 py-2 bg-[#0a3a60] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#07253d] cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-sky-300" />
                <span>Register Instrument</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-rose-400 hover:text-rose-700"><XCircle className="w-4 h-4" /></button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-sky-500" />
            <span className="text-sm font-medium">Fetching instruments from registry…</span>
          </div>
        )}

        {/* Instruments Table */}
        {!loading && instruments.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Scale className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No instruments registered yet.</p>
            <p className="text-xs mt-1">Click "Register Instrument" to add your first weighing device.</p>
          </div>
        )}

        {!loading && instruments.length > 0 && (
          <div className="space-y-3">
            {instruments.map((inst) => {
              const isExpanded = expandedId === inst.id;
              const isEditing = editingId === inst.id;

              return (
                <div
                  key={inst.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
                >
                  {/* Instrument Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5">
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl bg-[#0a3a60]/10 text-[#0a3a60] flex items-center justify-center shrink-0">
                      <Scale className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="font-bold text-slate-900 text-sm truncate">{inst.instrument_type}</span>
                        <StatusBadge status={inst.status} />
                      </div>
                      <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span className="font-mono font-bold text-sky-700">{inst.instrument_id}</span>
                        <span>S/N: {inst.serial_number}</span>
                        {inst.owner_name && currentUser?.role !== 'BUSINESS' && (
                          <span className="text-slate-400">Owner: {inst.owner_name}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {['BUSINESS', 'ADMIN'].includes(currentUser?.role) && !isEditing && (
                        <button
                          onClick={() => { setEditingId(inst.id); setEditData({ status: inst.status, location: inst.location, capacity: inst.capacity }); setExpandedId(inst.id); }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 cursor-pointer"
                          title="Edit instrument"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {['BUSINESS', 'ADMIN'].includes(currentUser?.role) && (
                        <button
                          onClick={() => setDeleteConfirm(inst.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                          title="Delete instrument"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : inst.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirm */}
                  {deleteConfirm === inst.id && (
                    <div className="border-t border-rose-100 bg-rose-50 px-5 py-3 flex items-center justify-between text-xs">
                      <span className="text-rose-900 font-semibold">Delete <strong>{inst.instrument_id}</strong>? This cannot be undone.</span>
                      <div className="flex gap-2">
                        <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-bold cursor-pointer">Cancel</button>
                        <button onClick={() => handleDelete(inst.id)} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold cursor-pointer">Delete</button>
                      </div>
                    </div>
                  )}

                  {/* Expanded Details / Edit Form */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5 text-xs text-left">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentUser?.role === 'ADMIN' && <div>
                              <label className="block font-bold text-slate-600 uppercase mb-1">Status</label>
                              <select
                                value={editData.status}
                                onChange={(e) => setEditData(p => ({ ...p, status: e.target.value }))}
                                className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white"
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="PENDING_VERIFICATION">Pending Verification</option>
                                <option value="VERIFIED">Verified</option>
                                <option value="EXPIRED">Expired</option>
                              </select>
                            </div>}
                            <div>
                              <label className="block font-bold text-slate-600 uppercase mb-1">Capacity</label>
                              <input
                                type="text"
                                value={editData.capacity}
                                onChange={(e) => setEditData(p => ({ ...p, capacity: e.target.value }))}
                                className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-600 uppercase mb-1">Location</label>
                            <input
                              type="text"
                              value={editData.location}
                              onChange={(e) => setEditData(p => ({ ...p, location: e.target.value }))}
                              className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                            />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleSaveEdit(inst.id)}
                              disabled={saving}
                              className="px-4 py-2 bg-[#0a3a60] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-xs disabled:bg-slate-400"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{saving ? 'Saving…' : 'Save Changes'}</span>
                            </button>
                            <button onClick={() => { setEditingId(null); setEditData({}); }} className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            ['Manufacturer', inst.manufacturer],
                            ['Model', inst.model],
                            ['Serial No.', inst.serial_number],
                            ['Capacity', inst.capacity],
                            ['Location', inst.location],
                            ['Registered', inst.registration_date ? new Date(inst.registration_date).toLocaleDateString('en-IN') : 'N/A']
                          ].map(([label, val]) => (
                            <div key={label}>
                              <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">{label}</div>
                              <div className="font-semibold text-slate-800 break-words">{val || '—'}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        {!loading && instruments.length > 0 && (
          <div className="text-xs text-slate-400 mt-4 text-right">
            Showing {instruments.length} instrument{instruments.length !== 1 ? 's' : ''} · GET /api/instruments
          </div>
        )}

      </div>
    </section>
  );
}
