import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Building2, 
  UserCheck, 
  FlaskConical, 
  ShieldAlert, 
  KeyRound, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  User,
  ShieldCheck
} from 'lucide-react';
import { authAPI } from '../../api/client';

const ROLE_PRESETS = {
  'BUSINESS / INSTRUMENT OWNER': { email: 'trader@bharatretail.in', role: 'BUSINESS' },
  'LMO': { email: 'officer.sharma@lmo.gov.in', role: 'LMO' },
  'GATC': { email: 'lab.head@gatc-pune.gov.in', role: 'GATC' },
  'ADMIN': { email: 'controller.hq@doca.gov.in', role: 'ADMIN' }
};

export default function LoginModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login', 
  defaultRole = 'BUSINESS / INSTRUMENT OWNER', 
  onLoginSuccess 
}) {
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'register'
  
  // Login State
  const [activeRole, setActiveRole] = useState(defaultRole);
  const [identifier, setIdentifier] = useState(ROLE_PRESETS[defaultRole]?.email || '');
  const [password, setPassword] = useState('Password@123');

  // Register State
  const [regRole, setRegRole] = useState('BUSINESS');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setActiveRole(defaultRole);
      setIdentifier(ROLE_PRESETS[defaultRole]?.email || '');
      setError('');
      setSuccess(false);
    }
  }, [isOpen, initialMode, defaultRole]);

  if (!isOpen) return null;

  const loginRoles = [
    { id: 'BUSINESS / INSTRUMENT OWNER', label: 'Business / Trader', icon: Building2 },
    { id: 'LMO', label: 'Legal Metrology Officer', icon: UserCheck },
    { id: 'GATC', label: 'GATC Test Centre', icon: FlaskConical },
    { id: 'ADMIN', label: 'State / Central Admin', icon: ShieldAlert }
  ];

  const registerRoles = [
    { id: 'BUSINESS', label: 'Business / Trader', desc: 'Instrument owner registering scales & devices', icon: Building2 },
    { id: 'LMO', label: 'Legal Metrology Officer', desc: 'State enforcement & field verification inspector', icon: UserCheck },
    { id: 'GATC', label: 'GATC Test Lab Head', desc: 'Government authorized test & calibration lab', icon: FlaskConical }
  ];

  const handleRoleChange = (roleId) => {
    setActiveRole(roleId);
    setIdentifier(ROLE_PRESETS[roleId]?.email || '');
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await authAPI.login(identifier.trim(), password);
      setSuccessMsg(`Welcome back, ${result.user.name}!`);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onLoginSuccess) onLoginSuccess(result.user);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.register({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        role: regRole,
        phone: regPhone.trim() || null
      });

      setSuccessMsg(`Account created for ${result.user.name} (${result.user.role})!`);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onLoginSuccess) onLoginSuccess(result.user);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative max-h-[94vh] flex flex-col">

        {/* Modal Header */}
        <div className="bg-[#0a3a60] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-500/30 flex items-center justify-center text-sky-200 shrink-0">
              {authMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div className="truncate text-left">
              <h3 className="text-sm sm:text-base font-bold truncate">
                {authMode === 'login' ? 'E-Metrology Official Login' : 'Register New User or Officer'}
              </h3>
              <p className="text-[11px] sm:text-xs text-sky-200 truncate">
                {authMode === 'login' ? 'Access your statutory verification dashboard' : 'Create an official portal account (Trader / LMO / GATC)'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tab Bar */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 p-1 shrink-0">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white text-[#0a3a60] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login to Account</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-white text-[#0a3a60] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Register (User / Officer)</span>
          </button>
        </div>

        {/* ─── TAB 1: LOGIN ─────────────────────────────────────────────────── */}
        {authMode === 'login' && (
          <div className="overflow-y-auto flex-1">
            {/* Role Selector */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">
                Select Your Role (Quick Login)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {loginRoles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = activeRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id)}
                      className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0a3a60] text-white border-[#0a3a60] shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleLoginSubmit} className="p-4 sm:p-6 space-y-3.5 text-xs text-left">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-center font-bold flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{successMsg || 'Authentication Successful!'}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0a3a60] hover:bg-[#07253d] disabled:bg-slate-400 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-sky-300" />
                  <span>{loading ? 'Authenticating…' : 'Authenticate & Continue'}</span>
                </button>
              </div>

              <div className="text-center pt-2 text-slate-500 text-[11px]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); }}
                  className="text-sky-700 font-bold hover:underline cursor-pointer"
                >
                  Register as User or Officer &rarr;
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TAB 2: REGISTER (USER & OFFICER) ────────────────────────────── */}
        {authMode === 'register' && (
          <div className="overflow-y-auto flex-1">
            <form onSubmit={handleRegisterSubmit} className="p-4 sm:p-6 space-y-3.5 text-xs text-left">
              
              {/* Role Selection */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5 text-[11px]">
                  Register As:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {registerRoles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = regRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRegRole(r.id)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#0a3a60] text-white border-[#0a3a60] shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-0.5">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-200' : 'text-slate-500'}`} />
                          <span className="truncate">{r.label}</span>
                        </div>
                        <span className={`text-[10px] leading-tight ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                          {r.id === 'BUSINESS' ? 'Trader / Business' : r.id === 'LMO' ? 'State Officer' : 'Testing Lab'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name / Organization */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  {regRole === 'BUSINESS' ? 'Business / Trader Name' : regRole === 'LMO' ? 'Officer Full Name & Designation' : 'Calibration Lab Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={regRole === 'BUSINESS' ? 'e.g. Mahavir Supermarket Pvt Ltd' : regRole === 'LMO' ? 'e.g. Inspector Amit Deshmukh' : 'e.g. Maharashtra Precision Calibration Lab'}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  {regRole === 'BUSINESS' ? 'Business Email Address' : 'Official Government / Lab Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={regRole === 'BUSINESS' ? 'owner@business.in' : regRole === 'LMO' ? 'officer.deshmukh@lmo.gov.in' : 'lab.director@gatc-pune.gov.in'}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Mobile / Department Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Passwords Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-center font-bold flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{successMsg || 'Account Registered Successfully!'}</span>
                </div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:bg-slate-400 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>{loading ? 'Creating Account…' : `Register as ${regRole === 'BUSINESS' ? 'Trader / User' : regRole === 'LMO' ? 'Legal Metrology Officer' : 'GATC Test Lab'}`}</span>
                </button>
              </div>

              <div className="text-center pt-1 text-slate-500 text-[11px]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); }}
                  className="text-sky-700 font-bold hover:underline cursor-pointer"
                >
                  Log in here &rarr;
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
