import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Mail, Smartphone, CreditCard, Award, Shield, Save, Check, LogOut, Sparkles, CheckCircle2, Building2, Cpu, KeyRound } from 'lucide-react';
import { UserState, BankDetails } from '../types';

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
  const [bankHolderName, setBankHolderName] = useState(userState.savedBankDetails?.accountHolderName || userState.name || '');
  const [bankName, setBankName] = useState(userState.savedBankDetails?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(userState.savedBankDetails?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(userState.savedBankDetails?.ifscCode || '');
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
    const updatedBankDetails: BankDetails | undefined = (bankHolderName || accountNumber || ifscCode) ? {
      accountHolderName: bankHolderName.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
    } : undefined;

    onUpdateProfile({
      email,
      phone,
      savedUpiId: upiId,
      savedBankDetails: updatedBankDetails,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const avatarLetter = (userState.name || email || 'U').charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-28 text-slate-100">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-profile-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white py-1.5 px-3 rounded-xl hover:bg-slate-800 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 bg-slate-900 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30 text-xs font-bold">
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>Operator Profile</span>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 py-1.5 px-2 rounded-xl hover:bg-rose-500/10 transition-all cursor-pointer min-h-[44px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* Titanium VIP Operator Identity Pass */}
      <div 
        onClick={handleSecretAdminTap}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700 p-5 shadow-2xl cursor-pointer select-none"
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            {avatarLetter}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white truncate">{userState.name || 'Data Operator'}</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-bold text-cyan-300">
                {userState.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{userState.email}</p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {userState.id}</p>
          </div>
        </div>

        <div className="relative z-10 mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Node Balance</span>
            <span className="font-mono font-bold text-cyan-400 text-sm">₹{userState.balance.toFixed(2)}</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Sold Bandwidth</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{userState.totalSoldMB.toFixed(2)} MB</span>
          </div>
        </div>
      </div>

      {/* Account Settings & Bank Details Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Saved Payout Channels</span>
          </h3>
          {isSaved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              Saved!
            </span>
          )}
        </div>

        {/* UPI ID Setting */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Default UPI ID (VPA)
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="e.g. 7543355356@oksbi"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-hidden focus:border-cyan-400"
          />
        </div>

        {/* Bank Account Details */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bank Account Holder Name
            </label>
            <input
              type="text"
              value={bankHolderName}
              onChange={(e) => setBankHolderName(e.target.value)}
              placeholder="Name on bank passbook"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. State Bank of India"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs tracking-wider focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                placeholder="SBIN0001234"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs uppercase tracking-wider focus:outline-hidden focus:border-emerald-400"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 mt-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Account & Payout Details</span>
        </button>
      </form>

      {/* Admin Gateway Access Button */}
      {onOpenAdmin && (
        <div className="pt-1">
          <button
            onClick={onOpenAdmin}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Master System Administration</span>
          </button>
        </div>
      )}

    </div>
  );
};
