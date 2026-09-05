import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus, ShieldAlert, Shield, Eye, EyeOff, Key } from 'lucide-react';
import { UserAccount, AuthLog } from '../types';
import { formatDateTime } from '../utils';
import { ADMIN_MASTER_PASSWORD, ADMIN_MASTER_ID } from './AdminLogin';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount, log: AuthLog) => void;
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
        setErrorMessage('Invalid Admin Password. Please enter the master password.');
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
        setErrorMessage('Invalid Admin Master Password. Please enter the correct password.');
        return;
      }
    }

    if (!cleanInput || (!cleanInput.includes('@') && mode === 'SIGNUP')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Capture realistic client metadata
    const userAgent = navigator.userAgent;
    let deviceName = 'Chrome • Mobile';
    if (userAgent.includes('Android')) deviceName = 'Android 14 • Chrome Mobile';
    else if (userAgent.includes('iPhone')) deviceName = 'Apple iPhone • Mobile Safari';
    else if (userAgent.includes('Windows')) deviceName = 'Windows 11 • Desktop';
    else if (userAgent.includes('Macintosh')) deviceName = 'macOS • Safari';

    // Simulate Indian telecom IP
    const randomOctet = Math.floor(Math.random() * 200) + 20;
    const simulatedIp = `103.21.${randomOctet}.45 (Jio 5G)`;

    const nowStr = formatDateTime(new Date());

    if (mode === 'LOGIN') {
      const existingUser = existingUsers.find((u) => u.email.toLowerCase() === cleanInput);

      if (!existingUser) {
        setErrorMessage('No account found with this email. Please switch to Sign Up.');
        return;
      }

      if (existingUser.status === 'BLOCKED') {
        setErrorMessage('This account has been suspended by Admin. Contact support.');
        return;
      }

      const updatedUser: UserAccount = {
        ...existingUser,
        lastLoginTime: nowStr,
        ipAddress: simulatedIp,
        device: deviceName,
      };

      const authLog: AuthLog = {
        id: 'log_' + Date.now(),
        userId: existingUser.id,
        userEmail: existingUser.email,
        userName: existingUser.name,
        userPhone: existingUser.phone,
        type: 'LOGIN',
        timestamp: nowStr,
        ipAddress: simulatedIp,
        device: deviceName,
        status: 'SUCCESS',
      };

      onAuthSuccess(updatedUser, authLog);
      onClose();
    } else {
      // SIGN UP
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!phone.trim()) {
        setErrorMessage('Please enter your mobile phone number.');
        return;
      }

      const alreadyExists = existingUsers.some((u) => u.email.toLowerCase() === cleanInput);
      if (alreadyExists) {
        setErrorMessage('An account with this email already exists. Please log in.');
        return;
      }

      const newUserId = 'usr_' + Date.now();
      const newUser: UserAccount = {
        id: newUserId,
        name: name.trim(),
        email: cleanInput,
        phone: phone.trim(),
        password: password || 'password123',
        balance: 0.00, // Starts at 0 as instructed
        totalSoldMB: 0.00,
        tier: 'BRONZE',
        status: 'ACTIVE',
        savedUpiId: cleanInput.split('@')[0] + '@oksbi',
        selectedPaymentMethod: 'PhonePe',
        signupTime: nowStr,
        lastLoginTime: nowStr,
        ipAddress: simulatedIp,
        device: deviceName,
        requireDepositBeforeWithdrawal: false,
        requiredDepositAmount: 200,
        hasCompletedRequiredDeposit: false,
      };

      const authLog: AuthLog = {
        id: 'log_' + Date.now(),
        userId: newUserId,
        userEmail: cleanInput,
        userName: name.trim(),
        userPhone: phone.trim(),
        type: 'SIGNUP',
        timestamp: nowStr,
        ipAddress: simulatedIp,
        device: deviceName,
        status: 'SUCCESS',
      };

      onAuthSuccess(newUser, authLog);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between transition-colors ${
          mode === 'ADMIN' 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700'
        }`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-1.5">
              {mode === 'ADMIN' ? (
                <>
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Master Admin Login</span>
                </>
              ) : mode === 'LOGIN' ? (
                'Welcome Back • Login'
              ) : (
                'Create New Account'
              )}
            </h3>
            <p className="text-xs text-blue-100">
              {mode === 'ADMIN'
                ? 'Enter your master Admin ID & Password to open control portal'
                : mode === 'LOGIN'
                ? 'Access your bandwidth earnings & withdrawals'
                : 'Start sharing data & earning real rupees'}
            </p>
          </div>
          {canClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 text-xs font-bold">
          <button
            onClick={() => {
              setMode('LOGIN');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'LOGIN'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('SIGNUP');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'SIGNUP'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* First time mobile welcome banner */}
        {isFirstTime && mode === 'SIGNUP' && (
          <div className="bg-blue-50/90 border-b border-blue-100 px-4 py-2.5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full inline-block mb-1">
              📱 New Mobile Device
            </span>
            <p className="text-xs text-blue-950 font-semibold">
              Please register below to start selling data with ₹0.00 initial balance.
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'ADMIN' ? (
            <>
              {/* ADMIN MODE FORM */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Admin ID / Username
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-indigo-500 focus-within:bg-white">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="Enter ID"
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-800 bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-600">
                    Admin Password
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
                <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-indigo-500 focus-within:bg-white">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-800 bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-slate-800 hover:to-indigo-800 active:scale-95 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Unlock Master Admin Panel</span>
              </button>
            </>
          ) : (
            <>
              {/* USER LOGIN / SIGNUP FORM */}
              {mode === 'SIGNUP' && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Full Name
                  </label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-800 bg-transparent focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-800 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              {mode === 'SIGNUP' && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9823537634"
                      className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-800 bg-transparent focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-500">
                    Password
                  </label>
                  {mode === 'LOGIN' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium cursor-pointer"
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
                  )}
                </div>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-800 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                {mode === 'LOGIN' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Account (0 Starting Balance)</span>
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
