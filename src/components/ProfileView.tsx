import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Mail, Smartphone, CreditCard, Award, Shield, Save, Check, Lock, LogOut, Sparkles, CheckCircle2, Flame } from 'lucide-react';
import { UserState } from '../types';

interface ProfileViewProps {
  userState: UserState;
  onBack: () => void;
  onUpdateProfile: (updated: Partial<UserState>) => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userState,
  onBack,
  onUpdateProfile,
  onOpenAdmin,
  onLogout,
}) => {
  const [email, setEmail] = useState(userState.email);
  const [phone, setPhone] = useState(userState.phone);
  const [upiId, setUpiId] = useState(userState.savedUpiId);
  const [isSaved, setIsSaved] = useState(false);

  // Hidden 10-tap trigger for Master Admin Panel
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretAdminTap = () => {
    setTapCount((prev) => {
      const next = prev + 1;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

      tapTimerRef.current = setTimeout(() => {
        setTapCount(0);
      }, 3500);

      if (next >= 10) {
        setTapCount(0);
        if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
        if (onOpenAdmin) {
          onOpenAdmin();
        }
      }

      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      email,
      phone,
      savedUpiId: upiId,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const avatarLetter = email ? email.charAt(0).toUpperCase() : 'U';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 text-slate-800">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-profile-back"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-red-600 py-1.5 px-3 rounded-xl hover:bg-amber-100/50 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-red-600" />
          <span>Dashboard</span>
        </button>
        <h2 
          onClick={handleSecretAdminTap}
          className="text-sm font-extrabold text-slate-900 cursor-pointer select-none"
          title="Account Profile"
        >
          Account Profile
        </h2>
        <div className="w-12" />
      </div>

      {/* Digital VIP Pass Card in Red & Yellow Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 border-2 border-yellow-300 p-5 shadow-xl shadow-red-600/20 text-white space-y-4">
        <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3.5">
          <div 
            id="profile-avatar-secret-trigger"
            onClick={handleSecretAdminTap}
            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl text-yellow-200 border border-yellow-200/50 cursor-pointer active:scale-95 transition-transform select-none shadow-sm shrink-0"
            title="Profile"
          >
            {avatarLetter}
          </div>
          <div 
            onClick={handleSecretAdminTap}
            className="select-none cursor-pointer flex-1 min-w-0"
          >
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black truncate text-white">{email || 'User Account'}</h3>
              <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0" />
            </div>
            <p className="text-xs text-yellow-100 font-mono mt-0.5">{phone || '+91 User Connected'}</p>
          </div>
        </div>

        {/* Status Chips */}
        <div className="relative z-10 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-white/15 backdrop-blur-xs rounded-xl p-2 border border-white/20">
            <span className="text-[10px] text-yellow-100 block uppercase font-bold">Node Tier</span>
            <span className="font-black text-yellow-200">{userState.tier} VIP ELITE</span>
          </div>
          <div className="bg-white/15 backdrop-blur-xs rounded-xl p-2 border border-white/20">
            <span className="text-[10px] text-yellow-100 block uppercase font-bold">Total Bandwidth</span>
            <span className="font-black font-mono text-white">{userState.totalSoldMB.toFixed(2)} MB</span>
          </div>
        </div>
      </div>

      {/* Editable Account Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-md space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-red-950">
          Payout Account & Credentials
        </h3>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Account Email Address</label>
          <div className="relative rounded-xl border-2 border-amber-200 focus-within:border-red-500 bg-white">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden font-mono"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Registered Mobile Number</label>
          <div className="relative rounded-xl border-2 border-amber-200 focus-within:border-red-500 bg-white">
            <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 bg-transparent focus:outline-hidden"
            />
          </div>
        </div>

        {/* Default UPI ID */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Default Payout UPI ID</label>
          <div className="relative rounded-xl border-2 border-amber-200 focus-within:border-red-500 bg-white">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. yourname@oksbi"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 bg-transparent focus:outline-hidden"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border border-yellow-300 min-h-[44px]"
        >
          {isSaved ? <Check className="w-4 h-4 text-yellow-300" /> : <Save className="w-4 h-4 text-yellow-300" />}
          <span>{isSaved ? 'Settings Saved Successfully!' : 'Save Profile Changes'}</span>
        </button>
      </form>

      {/* Logout Action */}
      {onLogout && (
        <div className="bg-white rounded-3xl p-4 border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Session Security</h4>
            <p className="text-[11px] text-slate-500">Sign out of this device to protect your account</p>
          </div>
          <button
            onClick={onLogout}
            id="btn-logout-profile"
            className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
