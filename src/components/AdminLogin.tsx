import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Key, UserCheck, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ADMIN_MASTER_PASSWORD = 'ADMINPANELDEEPAKSQW';
export const ADMIN_MASTER_ID = 'admin';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [adminId, setAdminId] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = adminId.trim();
    const cleanPass = password.trim();

    // Check password exactly matching ADMINPANELDEEPAKSQW
    if (cleanPass === ADMIN_MASTER_PASSWORD) {
      sessionStorage.setItem('datasell_admin_session', 'true');
      onSuccess();
    } else {
      setError('Invalid Admin Password. Please enter the correct master key.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Lock Icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">
            Master Admin Portal
          </h1>
          <p className="text-xs text-slate-400 max-w-xs">
            Restricted administrative gateway for DataSell system controls, user databases, and deposit gateways.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin ID / Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Admin ID"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-blue-500 font-mono"
              />
              <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Admin Master Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
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
                placeholder="••••••••••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-blue-500 font-mono tracking-wider"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
