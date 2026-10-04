import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus, Shield, Eye, EyeOff, CheckCircle2, AlertCircle, Wifi } from 'lucide-react';
import { UserAccount, AuthLog } from '../types';
import { formatDateTime } from '../utils';
import { ADMIN_MASTER_PASSWORD, ADMIN_MASTER_ID } from './AdminLogin';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount, log: AuthLog, isNewSignup?: boolean) => void;
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

  // Sync mode if initialMode changes
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // ADMIN MODE LOGIN
    if (mode === 'ADMIN') {
      const cleanAdminId = adminId.trim().toLowerCase();
      const cleanAdminPass = adminPassword.trim();

      const validAdminIds = ['admin', 'deepakadmin', 'deepak_admin', 'master_admin', 'techreal8806@gmail.com'];
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
        setErrorMessage('Invalid credentials. Access denied.');
        return;
      }
    }

    const cleanInput = email.trim().toLowerCase();

    // Check if user is logging in with Admin credentials directly in standard Login tab
    const validAdminIds = ['admin', 'deepakadmin', 'deepak_admin', 'master_admin', 'techreal8806@gmail.com'];
    if (mode === 'LOGIN' && (validAdminIds.includes(cleanInput) || password.trim() === ADMIN_MASTER_PASSWORD)) {
      if (password.trim() === ADMIN_MASTER_PASSWORD) {
        sessionStorage.setItem('datasell_admin_session', 'true');
        if (onAdminAuthSuccess) {
          onAdminAuthSuccess();
        }
        onClose();
        return;
      } else if (validAdminIds.includes(cleanInput)) {
        setErrorMessage('Invalid Master Password.');
        return;
      }
    }

    if (!cleanInput || (!cleanInput.includes('@') && mode === 'SIGNUP')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    // SIGNUP
    if (mode === 'SIGNUP') {
      const userExists = existingUsers.some(
        (u) => u.email.toLowerCase() === cleanInput || (phone && u.phone === phone.trim())
      );

      if (userExists) {
        setErrorMessage('An account with this email already exists. Please log in.');
        return;
      }

      const newUser: UserAccount = {
        id: 'usr_' + Date.now().toString(),
        email: cleanInput,
        name: name.trim() || cleanInput.split('@')[0],
        phone: phone.trim() || '+91 98000 00000',
        password,
        status: 'ACTIVE',
        balance: 0,
        totalSoldMB: 0,
        tier: 'BRONZE',
        savedUpiId: '',
        selectedPaymentMethod: 'PhonePe',
        signupTime: formatDateTime(new Date()),
        lastLoginTime: formatDateTime(new Date()),
        ipAddress: '103.' + Math.floor(Math.random() * 200) + '.' + Math.floor(Math.random() * 255) + '.1',
        device: navigator.userAgent.includes('Mobile') ? 'Mobile Android/iOS' : 'Desktop Node',
      };

      const log: AuthLog = {
        id: 'log_' + Date.now().toString(),
        userId: newUser.id,
        userEmail: cleanInput,
        userName: newUser.name,
        userPhone: newUser.phone,
        type: 'SIGNUP',
        timestamp: formatDateTime(new Date()),
        device: newUser.device,
        ipAddress: newUser.ipAddress,
        status: 'SUCCESS',
      };

      onAuthSuccess(newUser, log, true);
      onClose();
      return;
    }

    // LOGIN
    if (mode === 'LOGIN') {
      const matchedUser = existingUsers.find(
        (u) => u.email.toLowerCase() === cleanInput || u.phone === cleanInput
      );

      if (!matchedUser) {
        // Create an automatic demo active user if first time
        const autoUser: UserAccount = {
          id: 'usr_' + Date.now().toString(),
          email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@datasell.in`,
          name: cleanInput.split('@')[0],
          phone: '+91 98000 00000',
          password,
          status: 'ACTIVE',
          balance: 0,
          totalSoldMB: 0,
          tier: 'BRONZE',
          savedUpiId: '',
          selectedPaymentMethod: 'PhonePe',
          signupTime: formatDateTime(new Date()),
          lastLoginTime: formatDateTime(new Date()),
          ipAddress: '103.45.12.89',
          device: 'Bandwidth Node Client',
        };

        const log: AuthLog = {
          id: 'log_' + Date.now().toString(),
          userId: autoUser.id,
          userEmail: autoUser.email,
          userName: autoUser.name,
          userPhone: autoUser.phone,
          type: 'LOGIN',
          timestamp: formatDateTime(new Date()),
          device: autoUser.device,
          ipAddress: autoUser.ipAddress,
          status: 'SUCCESS',
        };

        onAuthSuccess(autoUser, log, true);
        onClose();
        return;
      }

      if (matchedUser.status === 'BLOCKED') {
        setErrorMessage('Your account has been temporarily restricted by admin. Contact support.');
        return;
      }

      if (matchedUser.password && matchedUser.password !== password) {
        setErrorMessage('Incorrect password. Please try again.');
        return;
      }

      const log: AuthLog = {
        id: 'log_' + Date.now().toString(),
        userId: matchedUser.id,
        userEmail: matchedUser.email,
        userName: matchedUser.name,
        userPhone: matchedUser.phone,
        type: 'LOGIN',
        timestamp: formatDateTime(new Date()),
        device: 'Bandwidth Node Client',
        ipAddress: '103.45.12.89',
        status: 'SUCCESS',
      };

      onAuthSuccess(matchedUser, log, false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-800">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xs">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                Data<span className="text-indigo-600">Sell</span>
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {mode === 'ADMIN' ? (
                'System Admin Gateway'
              ) : mode === 'LOGIN' ? (
                'Welcome Back! Sign In'
              ) : (
                'Create Bandwidth Account'
              )}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {mode === 'ADMIN'
                ? 'Authorized access control'
                : mode === 'LOGIN'
                ? 'Sign in to access your bandwidth node & payouts'
                : 'Free instant sign up • Start with ₹0 balance'}
            </p>
          </div>
          {canClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex border-b-2 border-amber-200 bg-amber-50/50 text-xs font-bold">
          <button
            onClick={() => {
              setMode('LOGIN');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-all cursor-pointer min-h-[44px] ${
              mode === 'LOGIN'
                ? 'text-red-700 border-b-2 border-red-600 bg-white shadow-xs font-black'
                : 'text-slate-600 hover:text-red-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('SIGNUP');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-all cursor-pointer min-h-[44px] ${
              mode === 'SIGNUP'
                ? 'text-red-700 border-b-2 border-red-600 bg-white shadow-xs font-black'
                : 'text-slate-600 hover:text-red-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'ADMIN' ? (
            /* ADMIN MODE FORM */
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin ID
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="Enter ID"
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-slate-900 bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Admin Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-slate-900 bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Verify Admin Credentials</span>
              </button>
            </>
          ) : (
            /* USER LOGIN / SIGNUP FORM */
            <>
              {mode === 'SIGNUP' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-10 pr-3 py-2.5 text-xs text-slate-900 bg-transparent focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98XXXXXXXX"
                        className="w-full pl-10 pr-3 py-2.5 text-xs text-slate-900 bg-transparent focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-slate-900 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-slate-900 bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-auth-submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[46px] flex items-center justify-center gap-2 border border-yellow-300"
              >
                {mode === 'LOGIN' ? (
                  <>
                    <LogIn className="w-4 h-4 text-yellow-300" />
                    <span>Sign In to Bandwidth Node</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-yellow-300" />
                    <span>Create Free Account & Start</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-500">
                  {mode === 'LOGIN' ? "Don't have an account? " : 'Already registered? '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                      setErrorMessage(null);
                    }}
                    className="text-red-600 hover:text-red-700 font-bold underline cursor-pointer"
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
