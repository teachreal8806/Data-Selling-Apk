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
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Lock Icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Master Admin Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-xs">
            Restricted administrative gateway for DataSell system controls, user databases, and deposit gateways.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Admin ID / Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Admin ID"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 font-mono"
              />
              <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Admin Master Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium cursor-pointer"
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
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 font-mono"
              />
              <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            id="btn-admin-login-submit"
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate Master Access</span>
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
