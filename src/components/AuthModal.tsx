import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus, Shield, Eye, EyeOff, AlertCircle, Wifi, Loader2, Sparkles, Zap } from 'lucide-react';
import { UserAccount, AuthLog } from '../types';
import { getDeviceSignature } from '../utils';
import { ADMIN_MASTER_PASSWORD, ADMIN_MASTER_ID } from './AdminLogin';
import { api } from '../api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (
    user: UserAccount, 
    log: AuthLog, 
    isNewSignup?: boolean,
    serverWithdrawals?: any[],
    serverDeposits?: any[]
  ) => void;
  onAdminAuthSuccess?: () => void;
  existingUsers: UserAccount[];
  initialMode?: 'LOGIN' | 'SIGNUP' | 'ADMIN';
  isFirstTime?: boolean;
  canClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onAdminAuthSuccess,
  existingUsers,
  initialMode = 'LOGIN',
  isFirstTime = false,
  canClose = true,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'ADMIN'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState(ADMIN_MASTER_ID);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const deviceSignature = getDeviceSignature();

    try {
      const res = await api.login({
        email: loginEmail.trim().toLowerCase(),
        password: loginPass.trim(),
        device: deviceSignature,
      });

      setIsSubmitting(false);

      if (res && res.error) {
        setErrorMessage(res.error);
        return;
      }

      if (res && res.user) {
        if (res.user.status === 'BLOCKED') {
          setErrorMessage('Your mobile node has been restricted by administrator. Contact Support.');
          return;
        }

        onAuthSuccess(
          res.user, 
          (res as any).log || (res as any).authLog, 
          false,
          (res as any).withdrawals,
          (res as any).deposits
        );
        onClose();
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Unable to connect to central node. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // ADMIN MODE LOGIN
    if (mode === 'ADMIN') {
      const cleanAdminId = adminId.trim().toLowerCase();
      const cleanAdminPass = adminPassword.trim();

      const validAdminIds = ['admin', 'deepakadmin', 'deepak_admin', 'master_admin'];
      const isValidAdminId = validAdminIds.includes(cleanAdminId) || cleanAdminId.length > 0;

      if (!isValidAdminId) {
        setErrorMessage('Please enter a valid Admin ID.');
        return;
      }

      if (cleanAdminPass === ADMIN_MASTER_PASSWORD) {
        sessionStorage.setItem('datasell_admin_session', 'true');
        if (onAdminAuthSuccess) {
          onAdminAuthSuccess();
        }
        onClose();
        return;
      } else {
        setErrorMessage('Invalid master admin credentials. Access denied.');
        return;
      }
    }

    const cleanInput = email.trim().toLowerCase();

    // Check if user is trying to login as admin directly
    if (mode === 'LOGIN') {
      const explicitAdminUsernames = ['admin', 'deepakadmin', 'master_admin'];
      if (explicitAdminUsernames.includes(cleanInput)) {
        if (password.trim() === ADMIN_MASTER_PASSWORD) {
          sessionStorage.setItem('datasell_admin_session', 'true');
          if (onAdminAuthSuccess) {
            onAdminAuthSuccess();
          }
          onClose();
          return;
        } else {
          setErrorMessage('Invalid Master Admin Password.');
          return;
        }
      }
    }

    if (!cleanInput) {
      setErrorMessage('कृपया अपना 10-अंकों का मोबाइल नंबर या ईमेल आईडी दर्ज करें।');
      return;
    }

    // SIGNUP
    if (mode === 'SIGNUP') {
      setIsSubmitting(true);
      const deviceSignature = getDeviceSignature();
      const signupEmail = cleanInput.includes('@') ? cleanInput : `${cleanInput.replace(/\D/g, '') || cleanInput}@datasell.in`;
      
      try {
        const res = await api.signup({
          email: signupEmail,
          password: password.trim() || '1234',
          name: name.trim() || signupEmail.split('@')[0],
          phone: phone.trim() || (cleanInput.replace(/\D/g, '').length === 10 ? `+91 ${cleanInput.replace(/\D/g, '')}` : '+91 98000 00000'),
          device: deviceSignature,
        });
        setIsSubmitting(false);

        if (res && res.error) {
          setErrorMessage(res.error);
          return;
        }

        if (res && res.user) {
          onAuthSuccess(
            res.user, 
            (res as any).log || (res as any).authLog, 
            res.isNew !== false,
            (res as any).withdrawals,
            (res as any).deposits
          );
          onClose();
        }
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage('Unable to register mobile account. Please try again.');
      }
      return;
    }

    // LOGIN
    if (mode === 'LOGIN') {
      executeLogin(cleanInput, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-100">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
                <Wifi className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                Data<span className="text-cyan-400">Sell</span>
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              {mode === 'ADMIN' ? (
                'Master Admin Gateway'
              ) : mode === 'LOGIN' ? (
                'Cross-Mobile Universal Login'
              ) : (
                'Create Bandwidth Node'
              )}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {mode === 'ADMIN'
                ? 'Authorized system control'
                : mode === 'LOGIN'
                ? 'Sign in from any phone using Mobile Number or Email'
                : 'Instant account setup • Zero paperwork'}
            </p>
          </div>
          {canClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-bold">
          <button
            onClick={() => {
              setMode('LOGIN');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-all cursor-pointer min-h-[44px] ${
              mode === 'LOGIN'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In (लॉगिन)
          </button>
          <button
            onClick={() => {
              setMode('SIGNUP');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-all cursor-pointer min-h-[44px] ${
              mode === 'SIGNUP'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up (नया खाता)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'ADMIN' ? (
            /* ADMIN MODE FORM */
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Admin Master ID
                </label>
                <div className="relative rounded-xl border border-slate-800 bg-slate-950 focus-within:border-cyan-400">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="Enter ID"
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-white bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Master Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative rounded-xl border border-slate-800 bg-slate-950 focus-within:border-cyan-400">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter Master Password"
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-white bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Verify Admin Credentials</span>
              </button>
            </>
          ) : (
            /* USER LOGIN / SIGNUP FORM */
            <>
              {mode === 'SIGNUP' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name (नाम)
                  </label>
                  <div className="relative rounded-xl border border-slate-800 bg-slate-950 focus-within:border-cyan-400">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-3 py-2.5 text-xs text-white bg-transparent focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    {mode === 'LOGIN' ? 'Mobile Number or Email (मोबाइल नंबर या ईमेल)' : 'Mobile Number or Email'}
                  </label>
                  <span className="text-[10px] text-cyan-400 font-semibold">10-Digit Mobile / Email</span>
                </div>
                <div className="relative rounded-xl border border-slate-800 bg-slate-950 focus-within:border-cyan-400">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={mode === 'LOGIN' ? "Enter 10-digit Mobile or Email (e.g. 7543355356)" : "Enter 10-digit Mobile Number"}
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-white bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
                {mode === 'LOGIN' && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    📱 Kisi bhi phone se 10-digit number enter karke turant login karein.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    PIN / Password
                  </label>
                </div>
                <div className="relative rounded-xl border border-slate-800 bg-slate-950 focus-within:border-cyan-400">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password / PIN"
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-white bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-auth-submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] cursor-pointer min-h-[46px] flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Connecting Central Cloud...</span>
                  </>
                ) : mode === 'LOGIN' ? (
                  <>
                    <LogIn className="w-4 h-4 text-slate-950" />
                    <span>Sign In to Bandwidth Node</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-slate-950" />
                    <span>Create Free Account & Start</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400">
                  {mode === 'LOGIN' ? "Don't have an account? " : 'Already registered? '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                      setErrorMessage(null);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                  >
                    {mode === 'LOGIN' ? 'Sign Up Free' : 'Sign In'}
                  </button>
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
