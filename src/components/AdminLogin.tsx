import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Key, UserCheck, AlertCircle } from 'lucide-react';

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
      setError('Invalid Admin Password. Please enter the correct master password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-slate-50 to-red-50 text-slate-800 flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="w-full max-w-md bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-600/10 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Lock Icon in Red & Gold */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 text-white border border-yellow-300">
            <Lock className="w-7 h-7 text-yellow-300" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Master Admin Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-xs">
            Restricted administrative gateway for DataSell system controls, user databases, and payout verification.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Admin ID / Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Admin ID"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border-2 border-amber-200 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 font-mono font-bold"
              />
              <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Admin Master Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-bold cursor-pointer"
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
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border-2 border-amber-200 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 font-mono font-bold"
              />
              <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            id="btn-admin-login-submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg transition-all active:scale-[0.98] cursor-pointer min-h-[46px] flex items-center justify-center gap-2 border border-yellow-300"
          >
            <ShieldCheck className="w-4 h-4 text-yellow-300" />
            <span>Authenticate Master Access</span>
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
