import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  RefreshCw,
  PlusCircle,
  Search,
  UserCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  X,
  Scale,
  ExternalLink,
  Download,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { applicationsAPI, verificationsAPI, authAPI } from '../api/client';

const STATUS_CONFIG = {
  SUBMITTED: { label: 'Submitted', color: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
  ASSIGNED: { label: 'Assigned', color: 'bg-sky-100 text-sky-800 border-sky-300', dot: 'bg-sky-500' },
  SCHEDULED: { label: 'Scheduled', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', dot: 'bg-indigo-500' },
  FIELD_VERIFICATION: { label: 'Field Verification', color: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-500' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-orange-100 text-orange-800 border-orange-300', dot: 'bg-orange-500' },
  APPROVED: { label: 'Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
  REJECTED: { label: 'Rejected', color: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500' }
};

const DEMO_USERS = [
  { role: 'BUSINESS', label: 'Trader (Bharat Retail)', email: 'trader@bharatretail.in' },
  { role: 'ADMIN', label: 'Controller (Central Admin)', email: 'controller.hq@doca.gov.in' },
  { role: 'LMO', label: 'LMO Officer (Sharma)', email: 'officer.sharma@lmo.gov.in' },
  { role: 'GATC', label: 'GATC Lab Head', email: 'lab.head@gatc-pune.gov.in' }
];

export default function ApplicationsDashboard({ onOpenApply, onTrackApp, onUserChange }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Modals for workflow steps
  const [assignModalApp, setAssignModalApp] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const [scheduleModalApp, setScheduleModalApp] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduleRemarks, setScheduleRemarks] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [statusModalApp, setStatusModalApp] = useState(null);
  const [nextStatus, setNextStatus] = useState('FIELD_VERIFICATION');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  // Field Verification Record details modal
  const [viewRecord, setViewRecord] = useState(null);

  const currentUser = authAPI.getCurrentUser();
  const isLoggedIn = authAPI.isLoggedIn();

  const fetchApplications = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError('');
    try {
      const list = await applicationsAPI.getAll();
      setApplications(list || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch verification applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [isLoggedIn, currentUser?.role]);

  useEffect(() => {
    if (!isLoggedIn || !autoRefresh) return undefined;
    const refreshTimer = window.setInterval(fetchApplications, 30000);
    return () => window.clearInterval(refreshTimer);
  }, [isLoggedIn, autoRefresh, currentUser?.role]);

  // Fast role switch helper for testing complete 3-step SIH workflow
  const handleFastLogin = async (email) => {
    setLoading(true);
    try {
      const data = await authAPI.login(email, 'Password@123');
      if (onUserChange) onUserChange(data.user);
      fetchApplications();
    } catch (err) {
      setError('Fast login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open Assign Modal (ADMIN only)
  const handleOpenAssign = async (app) => {
    setAssignModalApp(app);
    setAssignRemarks('');
    try {
      const offs = await applicationsAPI.getOfficers();
      setOfficers(offs || []);
      if (offs && offs.length > 0) {
        setSelectedOfficerId(offs[0].id);
      }
    } catch {
      setError('Could not fetch officers list.');
    }
  };

  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!selectedOfficerId || !assignModalApp) return;
    setAssignLoading(true);
    try {
      const updated = await applicationsAPI.assign(assignModalApp.id, {
        assigned_to: selectedOfficerId,
        remarks: assignRemarks || 'Assigned by Controller for verification.'
      });
      setApplications(prev => prev.map(a => a.id === assignModalApp.id ? updated : a));
      setAssignModalApp(null);
    } catch (err) {
      setError(err.message || 'Failed to assign officer.');
    } finally {
      setAssignLoading(false);
    }
  };

  // Open Schedule Modal (LMO / GATC / ADMIN)
  const handleOpenSchedule = (app) => {
    setScheduleModalApp(app);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().split('T')[0]);
    setScheduleRemarks('');
  };

  const handleConfirmSchedule = async (e) => {
    e.preventDefault();
    if (!scheduledDate || !scheduleModalApp) return;
    setScheduleLoading(true);
    try {
      const updated = await applicationsAPI.schedule(scheduleModalApp.id, {
        scheduled_date: scheduledDate,
        remarks: scheduleRemarks || 'Inspection scheduled on-site.'
      });
      setApplications(prev => prev.map(a => a.id === scheduleModalApp.id ? updated : a));
      setScheduleModalApp(null);
    } catch (err) {
      setError(err.message || 'Failed to schedule inspection.');
    } finally {
      setScheduleLoading(false);
    }
  };

  // Open Status Update Modal
  const handleOpenStatusUpdate = (app) => {
    setStatusModalApp(app);
    setNextStatus(app.status === 'SCHEDULED' ? 'FIELD_VERIFICATION' : 'APPROVED');
    setStatusRemarks('');
  };

  const handleConfirmStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusModalApp) return;
    setStatusLoading(true);
    try {
      const updated = await applicationsAPI.update(statusModalApp.id, {
        status: nextStatus,
        remarks: statusRemarks || `Status updated to ${nextStatus}`
      });
      setApplications(prev => prev.map(a => a.id === statusModalApp.id ? updated : a));
      setStatusModalApp(null);
    } catch (err) {
      setError(err.message || 'Failed to update application status.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleViewVerificationRecord = async (app) => {
    setError('');
    try {
      const rec = await verificationsAPI.getByApplication(app.application_number);
      setViewRecord({ ...rec, appInfo: app });
    } catch {
      setError(`No field verification record found for ${app.application_number} yet.`);
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (filterStatus !== 'ALL' && app.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = app.application_number?.toLowerCase().includes(q);
      const matchType = app.instrument_type?.toLowerCase().includes(q);
      const matchApplicant = app.applicant_name?.toLowerCase().includes(q);
      const matchOfficer = app.assigned_to_name?.toLowerCase().includes(q);
      const matchInstrId = app.instrument_code?.toLowerCase().includes(q);
      return matchNumber || matchType || matchApplicant || matchOfficer || matchInstrId;
    }
    return true;
  });

  const activeApplications = applications.filter(app => !['APPROVED', 'REJECTED'].includes(app.status));
  const referenceTime = lastUpdated?.getTime() || 0;
  const overdueApplications = activeApplications.filter(app => {
    const createdAt = app.created_at || app.registration_date;
    if (!createdAt) return false;
    return referenceTime > 0 && Math.floor((referenceTime - new Date(createdAt).getTime()) / 86400000) >= 7;
  });
  const formatAge = (app) => {
    const createdAt = app.created_at || app.registration_date;
    if (!createdAt || referenceTime === 0) return 'Age unavailable';
    const age = Math.max(0, Math.floor((referenceTime - new Date(createdAt).getTime()) / 86400000));
    return age === 0 ? 'Received today' : `${age}d in queue`;
  };

  const exportApplications = () => {
    const headers = ['Application Number', 'Status', 'Instrument', 'Applicant', 'Assigned Officer', 'Scheduled Date', 'Created At'];
    const rows = applications.map(app => [
      app.application_number,
      app.status,
      app.instrument_type,
      app.applicant_name,
      app.assigned_to_name || 'Unassigned',
      app.scheduled_date || '',
      app.created_at || ''
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emetrology-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="applications" className="py-12 sm:py-16 lg:py-20 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2 border border-sky-500/30">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>SIH Workflow Engine · /api/applications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Verification Applications Registry
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              End-to-end statutory verification lifecycle: Trader application &rarr; Controller officer dispatch &rarr; Field inspection & verification audit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setAutoRefresh(value => !value)}
              className={`px-3.5 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${autoRefresh ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
              title="Refresh application data every 30 seconds"
            >
              <Activity className={`w-3.5 h-3.5 ${autoRefresh ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{autoRefresh ? 'Live' : 'Paused'}</span>
            </button>
            <button
              onClick={fetchApplications}
              disabled={loading}
              className="px-3.5 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportApplications}
              disabled={!applications.length}
              className="px-3.5 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Download the current application register as CSV"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export</span>
            </button>

            {['BUSINESS', 'ADMIN'].includes(currentUser?.role) && (
              <button
                onClick={onOpenApply}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Apply for Verification</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6 text-left">
          {[
            ['Total cases', applications.length, 'text-white', ClipboardList],
            ['Active queue', activeApplications.length, 'text-sky-300', Activity],
            ['Awaiting assignment', applications.filter(app => app.status === 'SUBMITTED').length, 'text-amber-300', UserCheck],
            ['SLA watchlist', overdueApplications.length, overdueApplications.length ? 'text-rose-300' : 'text-emerald-300', AlertTriangle]
          ].map(([label, value, color, Icon]) => (
            <div key={label} className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label}</span>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <strong className={`text-xl leading-none block mt-1 ${color}`}>{value}</strong>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 mb-5 text-[11px] text-slate-500">
          <span>{lastUpdated ? `Last synchronized ${lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : 'Waiting for first synchronization'}</span>
          {autoRefresh && <span className="inline-flex items-center gap-1.5 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Polling every 30 seconds</span>}
        </div>

        {/* Multi-Role Quick Switch Helper Banner */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 mb-6 text-left flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Active Role: <strong className="text-sky-300">{currentUser?.role || 'Guest (Not Logged In)'}</strong></span>
                {currentUser && <span className="text-[10px] text-slate-400">({currentUser.name})</span>}
              </div>
              <p className="text-[11px] text-slate-400">
                Switch role instantly below to test the 3-step SIH workflow:
              </p>
            </div>
          </div>

          {/* Quick Login Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {DEMO_USERS.map((u) => {
              const isCurrent = currentUser?.email === u.email;
              return (
                <button
                  key={u.role}
                  onClick={() => handleFastLogin(u.email)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${isCurrent
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/30'
                      : 'bg-slate-900/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                >
                  {u.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80 text-left">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search application no, scale, applicant…"
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['ALL', 'SUBMITTED', 'ASSIGNED', 'SCHEDULED', 'FIELD_VERIFICATION', 'UNDER_REVIEW', 'APPROVED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer border ${filterStatus === st
                    ? 'bg-sky-500 text-white border-sky-400'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-rose-900/40 border border-rose-700/60 rounded-xl text-rose-200 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-rose-300 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-sky-500" />
            <span className="text-sm font-medium">Querying verification applications from backend…</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-800 text-slate-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No verification applications match your criteria.</p>
            <p className="text-xs mt-1 text-slate-500">Submit a new application or adjust your search filter.</p>
          </div>
        )}

        {/* Applications List */}
        {!loading && filteredApplications.length > 0 && (
          <div className="space-y-3.5">
            {filteredApplications.map((app) => {
              const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.SUBMITTED;
              const canAssign = currentUser?.role === 'ADMIN' && ['SUBMITTED', 'ASSIGNED'].includes(app.status);
              const canSchedule = ['ADMIN', 'LMO', 'GATC'].includes(currentUser?.role) && ['ASSIGNED', 'SCHEDULED'].includes(app.status);
              const canFieldInspect = ['LMO', 'GATC', 'ADMIN'].includes(currentUser?.role) && ['SCHEDULED', 'FIELD_VERIFICATION'].includes(app.status);
              const canUpdateStatus = ['ADMIN', 'LMO', 'GATC'].includes(currentUser?.role) && ['SCHEDULED', 'FIELD_VERIFICATION', 'UNDER_REVIEW'].includes(app.status);
              const hasInspection = ['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(app.status);

              return (
                <div
                  key={app.id}
                  className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md text-left"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                    {/* Header line: App number, Type badge, Status badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-sm text-sky-300 bg-sky-950/80 border border-sky-700 px-2 py-0.5 rounded">
                        {app.application_number}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-200 px-2 py-0.5 rounded">
                        {app.application_type}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
                        {statusCfg.label}
                      </span>
                      {overdueApplications.some(item => item.id === app.id) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border border-rose-700 bg-rose-950/60 text-rose-300">
                          <AlertTriangle className="w-3 h-3" /> SLA watch
                        </span>
                      )}
                    </div>

                    {/* Action buttons on desktop */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* ADMIN: Assign LMO/GATC */}
                      {canAssign && (
                        <button
                          onClick={() => handleOpenAssign(app)}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          title="Assign to LMO or GATC officer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Assign Officer</span>
                        </button>
                      )}

                      {/* LMO/GATC: Schedule Inspection */}
                      {canSchedule && (
                        <button
                          onClick={() => handleOpenSchedule(app)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          title="Schedule inspection date"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Date</span>
                        </button>
                      )}

                      {/* LMO/GATC: Jump to Field Verification */}
                      {canFieldInspect && (
                        <a
                          href="#field-verification"
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          title="Conduct mobile field verification"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Field Inspect</span>
                        </a>
                      )}

                      {/* View Inspection Record */}
                      {hasInspection && (
                        <button
                          onClick={() => handleViewVerificationRecord(app)}
                          className="px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 border border-emerald-500/50 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                          title="View submitted inspection checklist and GPS coordinates"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Inspection Log</span>
                        </button>
                      )}

                      {/* LMO/GATC/ADMIN: Update Status */}
                      {canUpdateStatus && (
                        <button
                          onClick={() => handleOpenStatusUpdate(app)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          title="Advance verification stage"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Update Stage</span>
                        </button>
                      )}

                      {/* Track Button */}
                      {onTrackApp && (
                        <button
                          onClick={() => onTrackApp(app.application_number)}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
                          <span>Track Stage</span>
                        </button>
                      )}
                      <span className="text-[10px] text-slate-500 block mt-1">{formatAge(app)}</span>
                    </div>
                  </div>

                  {/* App Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 border-t border-slate-700/60 pt-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Instrument</span>
                      <strong className="text-white truncate block">{app.instrument_type || 'Electronic Weighing Scale'}</strong>
                      <span className="font-mono text-[10px] text-slate-400">{app.instrument_code || app.instrument_id_ref || 'INS-XXXX'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Applicant (Trader)</span>
                      <strong className="text-white truncate block">{app.applicant_name || 'Bharat Retailers'}</strong>
                      <span className="text-[10px] text-slate-400 truncate block">{app.applicant_email}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Assigned Officer</span>
                      {app.assigned_to_name ? (
                        <div>
                          <strong className="text-sky-300 truncate block">{app.assigned_to_name}</strong>
                          <span className="text-[10px] text-slate-400">({app.assigned_to_role || 'LMO Officer'})</span>
                        </div>
                      ) : (
                        <span className="text-amber-400 italic text-[11px]">Unassigned</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Inspection Date</span>
                      {app.scheduled_date ? (
                        <strong className="text-emerald-300 block">
                          {new Date(app.scheduled_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </strong>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Not Scheduled</span>
                      )}
                    </div>
                  </div>

                  {/* Remarks Footer */}
                  {app.remarks && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/40 text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="font-bold text-slate-300 shrink-0">Remarks:</span>
                      <span className="truncate">{app.remarks}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        {!loading && filteredApplications.length > 0 && (
          <div className="text-xs text-slate-500 mt-4 text-right">
            Showing {filteredApplications.length} verification application{filteredApplications.length !== 1 ? 's' : ''} · GET /api/applications
          </div>
        )}

      </div>

      {/* ─── MODAL 1: ADMIN ASSIGN OFFICER ─────────────────────────────────── */}
      {assignModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full border border-slate-700 shadow-2xl p-5 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">Assign Officer to Application</h3>
              </div>
              <button onClick={() => setAssignModalApp(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1">
              <div>App Number: <strong className="font-mono text-sky-300">{assignModalApp.application_number}</strong></div>
              <div>Instrument: <strong>{assignModalApp.instrument_type}</strong></div>
              <div>Applicant: <strong>{assignModalApp.applicant_name}</strong></div>
            </div>

            <form onSubmit={handleConfirmAssign} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Select LMO or GATC Officer</label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-sky-500"
                  required
                >
                  {officers.map(off => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.role} Officer) — {off.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Assignment Remarks</label>
                <textarea
                  rows="2"
                  value={assignRemarks}
                  onChange={(e) => setAssignRemarks(e.target.value)}
                  placeholder="e.g. Assigned to Pune division officer for physical scale verification."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setAssignModalApp(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer hover:bg-slate-700 text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={assignLoading} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs disabled:bg-slate-600">
                  <span>{assignLoading ? 'Assigning…' : 'Confirm Assignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: SCHEDULE INSPECTION DATE ─────────────────────────────── */}
      {scheduleModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full border border-slate-700 shadow-2xl p-5 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Schedule Inspection Date</h3>
              </div>
              <button onClick={() => setScheduleModalApp(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1">
              <div>App Number: <strong className="font-mono text-indigo-300">{scheduleModalApp.application_number}</strong></div>
              <div>Instrument: <strong>{scheduleModalApp.instrument_type}</strong></div>
            </div>

            <form onSubmit={handleConfirmSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Scheduled Inspection Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Inspection Instructions / Slot Details</label>
                <textarea
                  rows="2"
                  value={scheduleRemarks}
                  onChange={(e) => setScheduleRemarks(e.target.value)}
                  placeholder="e.g. Officer will arrive between 10:00 AM - 1:00 PM with standard 20kg proof weights."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setScheduleModalApp(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer hover:bg-slate-700 text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={scheduleLoading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs disabled:bg-slate-600">
                  <span>{scheduleLoading ? 'Scheduling…' : 'Save Inspection Schedule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: UPDATE STATUS / STAGE ────────────────────────────────── */}
      {statusModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full border border-slate-700 shadow-2xl p-5 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Update Verification Stage</h3>
              </div>
              <button onClick={() => setStatusModalApp(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1">
              <div>App Number: <strong className="font-mono text-emerald-300">{statusModalApp.application_number}</strong></div>
              <div>Current Status: <strong className="text-white">{statusModalApp.status}</strong></div>
            </div>

            <form onSubmit={handleConfirmStatusUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">New Stage Status</label>
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="FIELD_VERIFICATION">Field Verification (On-site Inspection)</option>
                  <option value="UNDER_REVIEW">Under Review (Audit & Compliance)</option>
                  <option value="APPROVED">Approved (Verification Passed)</option>
                  <option value="REJECTED">Rejected (Tolerance Exceeded)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 text-slate-300">Officer Verification Notes</label>
                <textarea
                  rows="3"
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  placeholder="e.g. Tested using Class F2 certified 10kg & 20kg standards. Maximum observed error 0.02g within legal MPE limits."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setStatusModalApp(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer hover:bg-slate-700 text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={statusLoading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs disabled:bg-slate-600">
                  <span>{statusLoading ? 'Updating…' : 'Submit Stage Update (PUT)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: VIEW FIELD VERIFICATION RECORD / AUDIT LOG ─────────────── */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full border border-slate-700 shadow-2xl p-5 text-left space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm">Field Inspection Record #{viewRecord.id}</h3>
                  <p className="text-[11px] text-slate-400">GET /api/verifications/{viewRecord.id}</p>
                </div>
              </div>
              <button onClick={() => setViewRecord(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            {/* Header info */}
            <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sky-300">{viewRecord.application_number}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${viewRecord.result === 'PASS' ? 'bg-emerald-900 text-emerald-200 border border-emerald-600' : 'bg-rose-900 text-rose-200'}`}>
                  Result: {viewRecord.result}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-700/60">
                <div>Inspector: <strong className="text-white">{viewRecord.officer_name || 'Rajesh Sharma'}</strong></div>
                <div>Date: <strong className="text-white">{viewRecord.inspection_date}</strong></div>
                <div>GPS Coordinates: <strong className="font-mono text-emerald-400">{viewRecord.latitude || '18.5204'}° N, {viewRecord.longitude || '73.8567'}° E</strong></div>
                <div>Status: <strong className="text-sky-300">UNDER_REVIEW</strong></div>
              </div>
            </div>

            {/* Checklist Results */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Recorded Inspection Checklist</h4>
              <div className="space-y-1.5">
                <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 flex justify-between items-center">
                  <span className="text-slate-400">Physical Condition:</span>
                  <strong className="text-emerald-300 text-[11px]">{viewRecord.instrument_condition || 'PASS - Intact housing'}</strong>
                </div>
                <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 flex justify-between items-center">
                  <span className="text-slate-400">Accuracy & Calibration:</span>
                  <strong className="text-emerald-300 text-[11px]">{viewRecord.accuracy_result || 'PASS - Within ±0.02g'}</strong>
                </div>
                <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 flex justify-between items-center">
                  <span className="text-slate-400">Official Lead Seal:</span>
                  <strong className="text-emerald-300 text-[11px]">{viewRecord.seal_condition || 'PASS - Intact Seal'}</strong>
                </div>
                <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 flex justify-between items-center">
                  <span className="text-slate-400">Verification Ledger:</span>
                  <strong className="text-emerald-300 text-[11px]">{viewRecord.document_result || 'PASS - Certified'}</strong>
                </div>
              </div>
            </div>

            {/* Officer Observations */}
            {viewRecord.observations && (
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1">
                <span className="font-bold text-slate-300 text-[10px] uppercase block">Officer Observations:</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">{viewRecord.observations}</p>
              </div>
            )}

            <div className="pt-2 text-right border-t border-slate-800">
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
