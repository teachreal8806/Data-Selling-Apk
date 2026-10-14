import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Key, UserCheck, AlertCircle, Sparkles, Terminal } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ADMIN_MASTER_PASSWORD = '8809961587';
export const ADMIN_MASTER_ID = 'admin';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [adminId, setAdminId] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPass = password.trim();

    // Check password exactly matching 8809961587
    if (cleanPass === ADMIN_MASTER_PASSWORD) {
      sessionStorage.setItem('datasell_admin_session', 'true');
      onSuccess();
    } else {
      setError('Invalid Admin Master Password. Access Denied.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-br from-amber-500/15 via-red-600/10 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-red-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#121624] to-[#0A0D15] border border-amber-500/30 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-6 relative z-10 backdrop-blur-xl">
        {/* Subtle Top Golden Accent Line */}
        <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Brand Crest & Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-red-600 p-[1px] shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-[#0D101A] rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest text-amber-300 mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Executive Command Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              DataSell Master Admin
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Restricted executive gateway for telecom data streaming engine, user databases, and payout approvals.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Admin Identity
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Admin ID"
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#090C14] border border-slate-700/80 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 font-mono font-bold transition-all"
              />
              <UserCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/80" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Master Security Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer transition-colors"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Master Password"
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#090C14] border border-slate-700/80 text-xs text-amber-300 placeholder:text-slate-600 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 font-mono font-bold transition-all"
              />
              <Key className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/80" />
            </div>
          </div>

          <button
            type="submit"
            id="btn-admin-login-submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-xl shadow-red-900/30 transition-all active:scale-[0.98] cursor-pointer min-h-[48px] flex items-center justify-center gap-2 border border-amber-400/50 uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4 text-amber-200" />
            <span>Authenticate Executive Access</span>
          </button>
        </form>

        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User App</span>
          </button>

          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-slate-600" />
            <span>Node v3.2-prod</span>
          </span>
        </div>
      </div>
    </div>
  );
};
