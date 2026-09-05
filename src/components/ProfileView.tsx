import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Mail, Smartphone, CreditCard, Award, Shield, Save, Check, Lock } from 'lucide-react';
import { UserState } from '../types';

interface ProfileViewProps {
  userState: UserState;
  onBack: () => void;
  onUpdateProfile: (updated: Partial<UserState>) => void;
  onOpenAdmin?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userState,
  onBack,
  onUpdateProfile,
  onOpenAdmin,
}) => {
  const [email, setEmail] = useState(userState.email);
  const [phone, setPhone] = useState(userState.phone);
  const [upiId, setUpiId] = useState(userState.savedUpiId);
  const [isSaved, setIsSaved] = useState(false);

  // Hidden 10-tap trigger for Master Admin Panel (silent)
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretAdminTap = () => {
    setTapCount((prev) => {
      const next = prev + 1;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

      // Reset count after 3.5 seconds of inactivity
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

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-profile-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <h2 
          onClick={handleSecretAdminTap}
          className="text-sm font-bold text-slate-900 cursor-pointer select-none"
          title="User Profile"
        >
          User Profile
        </h2>
        <div className="w-12" />
      </div>

      {/* Account Tier Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div 
            id="profile-avatar-secret-trigger"
            onClick={handleSecretAdminTap}
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white border border-white/30 cursor-pointer active:scale-90 transition-transform select-none shadow-xs"
            title="Profile"
          >
            {email.charAt(0).toUpperCase()}
          </div>
          <div 
            onClick={handleSecretAdminTap}
            className="cursor-pointer select-none active:opacity-85 transition-opacity"
          >
            <p className="text-sm font-bold truncate max-w-[220px]">{email}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider">
                {userState.tier} MEMBER
              </span>
              <span className="text-[11px] text-blue-100 font-medium">Verified User</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-[10px] text-blue-100 uppercase tracking-wider">Total Bandwidth Sold</p>
            <p className="text-sm font-bold text-white mt-0.5">{userState.totalSoldMB.toFixed(2)} MB</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-[10px] text-blue-100 uppercase tracking-wider">Available Balance</p>
            <p className="text-sm font-bold text-white mt-0.5">₹{userState.balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Payment & Contact Details</h3>

        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile details saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Registered Email
            </label>
            <div className="relative rounded-xl border border-slate-200 bg-slate-50">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-transparent focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Mobile Number
            </label>
            <div className="relative rounded-xl border border-slate-200 bg-slate-50">
              <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9823537634"
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-transparent focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Default UPI ID (for Quick Payouts)
            </label>
            <div className="relative rounded-xl border border-slate-200 bg-slate-50">
              <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="techreal8806@oksbi"
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-transparent focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-save-profile"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
};
