import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ShieldAlert,
  Coins,
  Building2,
  Smartphone,
  Check,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import { UserState, BankDetails } from '../types';

interface WithdrawViewProps {
  userState: UserState;
  onBack: () => void;
  onSubmitWithdrawal: (
    amount: number, 
    upiId: string, 
    method: 'PhonePe' | 'GPay' | 'UPI' | 'BANK',
    bankDetails?: BankDetails
  ) => boolean;
  onGoToHistory: () => void;
  onOpenDeposit?: () => void;
  onOpenWithdrawalFeeModal: () => void;
  withdrawalCount?: number;
}

export const WithdrawView: React.FC<WithdrawViewProps> = ({
  userState,
  onBack,
  onSubmitWithdrawal,
  onGoToHistory,
  onOpenDeposit,
  onOpenWithdrawalFeeModal,
  withdrawalCount = 0,
}) => {
  // "withdrawal 250 first bar , dusra bar 500 add kar dijiye sir"
  const isFirstWithdrawal = (userState.withdrawalCount ?? withdrawalCount) === 0;
  const minWithdrawal = isFirstWithdrawal ? 250 : 500;

  const [payoutChannel, setPayoutChannel] = useState<'UPI' | 'BANK'>(
    userState.selectedPaymentMethod === 'BANK' ? 'BANK' : 'UPI'
  );

  const [amount, setAmount] = useState<string>(minWithdrawal.toString());
  const [selectedUpiApp, setSelectedUpiApp] = useState<'PhonePe' | 'GPay' | 'UPI'>(
    userState.selectedPaymentMethod === 'BANK' ? 'PhonePe' : (userState.selectedPaymentMethod || 'PhonePe')
  );
  const [upiId, setUpiId] = useState<string>(userState.savedUpiId || '');

  // Bank Form State
  const [accountHolderName, setAccountHolderName] = useState<string>(
    userState.savedBankDetails?.accountHolderName || userState.name || ''
  );
  const [bankName, setBankName] = useState<string>(
    userState.savedBankDetails?.bankName || ''
  );
  const [accountNumber, setAccountNumber] = useState<string>(
    userState.savedBankDetails?.accountNumber || ''
  );
  const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>(
    userState.savedBankDetails?.accountNumber || ''
  );
  const [ifscCode, setIfscCode] = useState<string>(
    userState.savedBankDetails?.ifscCode || ''
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const quickAmounts = isFirstWithdrawal ? [250, 500, 1000, 2000] : [500, 1000, 1500, 2500];

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
    setErrorMessage(null);
  };

  const handleQuickUpiSuffix = (suffix: string) => {
    const currentBase = upiId.includes('@') ? upiId.split('@')[0] : upiId;
    if (currentBase) {
      setUpiId(currentBase + suffix);
    } else if (userState.phone) {
      const cleanPhone = userState.phone.replace(/\D/g, '').slice(-10);
      setUpiId(cleanPhone + suffix);
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // ₹99 Payment requirement before withdrawal
    if (!userState.hasPaidWithdrawalFee) {
      if (userState.withdrawalFeePending) {
        setErrorMessage(
          `Aapka ₹99 payment verification UTR (${userState.withdrawalFeeUtr || ''}) pending hai. Admin approval ke baad payout release hoga.`
        );
      }
      onOpenWithdrawalFeeModal();
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }

    // Minimum withdrawal rule: 1st time = 250, 2nd time = 500
    if (numAmount < minWithdrawal) {
      setErrorMessage(
        isFirstWithdrawal
          ? 'First-time withdrawal minimum limit is ₹250.00'
          : 'Second and subsequent withdrawal minimum limit is ₹500.00'
      );
      return;
    }

    if (numAmount > userState.balance) {
      setErrorMessage(`Insufficient balance! Your current balance is ₹${userState.balance.toFixed(2)}.`);
      return;
    }

    if (payoutChannel === 'UPI') {
      const cleanUpi = upiId.trim();
      if (!cleanUpi || !cleanUpi.includes('@')) {
        setErrorMessage('Please enter a valid UPI ID (e.g. mobile@ybl or username@oksbi).');
        return;
      }

      const success = onSubmitWithdrawal(numAmount, cleanUpi, selectedUpiApp);
      if (success) {
        setShowSuccessModal(true);
      }
    } else {
      // Bank Transfer Validation
      const cleanHolder = accountHolderName.trim();
      const cleanBank = bankName.trim();
      const cleanAcc = accountNumber.trim().replace(/\s+/g, '');
      const cleanConfirm = confirmAccountNumber.trim().replace(/\s+/g, '');
      const cleanIfsc = ifscCode.trim().toUpperCase();

      if (!cleanHolder || cleanHolder.length < 3) {
        setErrorMessage('Please enter valid Account Holder Name.');
        return;
      }
      if (!cleanBank || cleanBank.length < 2) {
        setErrorMessage('Please enter Bank Name (e.g. State Bank of India, HDFC).');
        return;
      }
      if (!cleanAcc || cleanAcc.length < 8) {
        setErrorMessage('Please enter valid Bank Account Number (minimum 8 digits).');
        return;
      }
      if (cleanAcc !== cleanConfirm) {
        setErrorMessage('Account numbers do not match! Please check again.');
        return;
      }
      if (!cleanIfsc || cleanIfsc.length !== 11) {
        setErrorMessage('Please enter a valid 11-character IFSC Code (e.g. SBIN0001234).');
        return;
      }

      const bankDetails: BankDetails = {
        accountHolderName: cleanHolder,
        bankName: cleanBank,
        accountNumber: cleanAcc,
        ifscCode: cleanIfsc,
      };

      const success = onSubmitWithdrawal(numAmount, '', 'BANK', bankDetails);
      if (success) {
        setShowSuccessModal(true);
      }
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    onGoToHistory();
  };

  const parsedAmount = parseFloat(amount) || 0;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 text-slate-800">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-withdraw-back"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-red-600 py-1.5 px-3 rounded-xl hover:bg-amber-100/50 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-red-600" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenDeposit && (
            <button
              onClick={onOpenDeposit}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs min-h-[44px]"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-700" />
              <span>Deposit / QR</span>
            </button>
          )}

          <button
            onClick={onGoToHistory}
            id="btn-withdraw-history"
            className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs min-h-[44px]"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Statements</span>
          </button>
        </div>
      </div>

      {/* Ultra Luxe Balance Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-5 text-white shadow-xl overflow-hidden border border-yellow-300/40">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-2 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-wider">
          <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
          <span>INSTANT PAYOUT</span>
        </div>

        <div className="text-[11px] font-medium text-amber-100 uppercase tracking-widest mb-1">
          Withdrawable Balance
        </div>
        <div className="text-3xl font-black tabular-nums tracking-tight text-white mb-2">
          ₹{userState.balance.toFixed(2)}
        </div>

        <div className="flex items-center justify-between text-xs text-white/90 pt-3 border-t border-white/20">
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-yellow-300" />
            <span>Bandwidth Sold: <strong>{userState.totalSoldMB.toFixed(2)} MB</strong></span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-extrabold text-yellow-200">
            {isFirstWithdrawal ? '1st Payout: Min ₹250' : 'Min ₹500 Payout'}
          </span>
        </div>
      </div>

      {/* Security Fee Status Banner */}
      {!userState.hasPaidWithdrawalFee && (
        <div 
          onClick={onOpenWithdrawalFeeModal}
          className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3 cursor-pointer hover:bg-amber-100/70 transition-all shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-amber-950">
                ₹99 Payout Verification Fee Required
              </h4>
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
                1-Time Only
              </span>
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
              Tap here to scan QR & enter your 12-digit UTR to unlock instant payouts to UPI or Bank Account.
            </p>
          </div>
        </div>
      )}

      {userState.hasPaidWithdrawalFee && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>₹99 Payout Security Verified • Instant Direct Settlement Enabled</span>
        </div>
      )}

      {/* Main Payout Form Card */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-md p-5 space-y-4">
        {/* Channel Selection: 2 High-Visibility Cards */}
        <div>
          <label className="block text-xs font-black text-slate-800 mb-2 uppercase tracking-wider flex items-center justify-between">
            <span>Choose Payout Method (पैसे निकालने का तरीका)</span>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
              2 Methods Available
            </span>
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Card 1: UPI */}
            <button
              type="button"
              onClick={() => {
                setPayoutChannel('UPI');
                setErrorMessage(null);
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                payoutChannel === 'UPI'
                  ? 'border-red-600 bg-gradient-to-br from-red-50 to-amber-50 shadow-md ring-2 ring-red-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  payoutChannel === 'UPI' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                {payoutChannel === 'UPI' && (
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </div>
              <span className="font-black text-xs block text-slate-900">UPI Transfer</span>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                PhonePe, GPay, Paytm, BHIM
              </span>
              <span className="inline-block mt-1.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold text-[9px]">
                Instant 5-Min
              </span>
            </button>

            {/* Card 2: Bank Account */}
            <button
              type="button"
              onClick={() => {
                setPayoutChannel('BANK');
                setErrorMessage(null);
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                payoutChannel === 'BANK'
                  ? 'border-red-600 bg-gradient-to-br from-red-50 to-amber-50 shadow-md ring-2 ring-red-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  payoutChannel === 'BANK' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                {payoutChannel === 'BANK' && (
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </div>
              <span className="font-black text-xs block text-slate-900">Bank Account</span>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                Direct IMPS / NEFT Transfer
              </span>
              <span className="inline-block mt-1.5 px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-bold text-[9px]">
                All Banks (SBI/HDFC/PNB)
              </span>
            </button>
          </div>
        </div>

        {/* Withdrawal Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Enter Amount (₹)
            </label>
            <span className="text-[11px] font-bold text-slate-500">
              Min: ₹{minWithdrawal}
            </span>
          </div>

          <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-50 focus-within:border-red-500 focus-within:bg-white transition-all overflow-hidden">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMessage(null);
              }}
              min={minWithdrawal}
              max={userState.balance}
              placeholder={minWithdrawal.toString()}
              className="w-full pl-9 pr-4 py-3 text-lg font-black text-slate-900 bg-transparent focus:outline-hidden tabular-nums"
            />
          </div>

          {/* Quick Amount Chips */}
          <div className="grid grid-cols-4 gap-1.5 mt-2.5">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuickAmount(q)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                  parsedAmount === q
                    ? 'bg-amber-100 border border-amber-400 text-red-950 font-black shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                ₹{q}
              </button>
            ))}
          </div>
        </div>

        {/* CHANNEL 1: UPI Transfer Form */}
        {payoutChannel === 'UPI' && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            {/* Preferred UPI App */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2 uppercase tracking-wider">
                Select UPI App
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'PhonePe' as const, label: 'PhonePe', color: 'border-purple-300 text-purple-900 bg-purple-50/50' },
                  { id: 'GPay' as const, label: 'Google Pay', color: 'border-blue-300 text-blue-900 bg-blue-50/50' },
                  { id: 'UPI' as const, label: 'BHIM / Paytm', color: 'border-teal-300 text-teal-900 bg-teal-50/50' }
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedUpiApp(app.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
                      selectedUpiApp === app.id
                        ? 'border-2 border-red-600 bg-amber-50 text-red-950 shadow-xs'
                        : `${app.color} opacity-80 hover:opacity-100`
                    }`}
                  >
                    <span>{app.label}</span>
                    {selectedUpiApp === app.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI ID input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 uppercase tracking-wider">
                Enter VPA / UPI ID
              </label>
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-red-500 focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 9876543210@ybl or name@oksbi"
                  className="w-full px-3.5 py-3 text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden font-mono"
                />
              </div>

              {/* Quick UPI Handles */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-[10px] font-bold">
                <span className="text-slate-400 shrink-0">Suggestions:</span>
                {['@ybl', '@oksbi', '@okhdfcbank', '@paytm', '@ibl'].map((sfx) => (
                  <button
                    key={sfx}
                    type="button"
                    onClick={() => handleQuickUpiSuffix(sfx)}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 cursor-pointer border border-slate-200"
                  >
                    {sfx}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHANNEL 2: Bank Account Form */}
        {payoutChannel === 'BANK' && (
          <div className="space-y-3.5 pt-2 border-t border-slate-100">
            {/* Quick Popular Bank Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Popular Banks (बैंक चुनें)
                </label>
                <span className="text-[10px] text-slate-500 font-bold">1-Tap Select</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { name: 'SBI', fullName: 'State Bank of India', ifscPrefix: 'SBIN' },
                  { name: 'HDFC', fullName: 'HDFC Bank', ifscPrefix: 'HDFC' },
                  { name: 'PNB', fullName: 'Punjab National Bank', ifscPrefix: 'PUNB' },
                  { name: 'ICICI', fullName: 'ICICI Bank', ifscPrefix: 'ICIC' },
                  { name: 'BOB', fullName: 'Bank of Baroda', ifscPrefix: 'BARB' },
                  { name: 'Axis', fullName: 'Axis Bank', ifscPrefix: 'UTIB' },
                  { name: 'Canara', fullName: 'Canara Bank', ifscPrefix: 'CNRB' },
                  { name: 'Kotak', fullName: 'Kotak Mahindra Bank', ifscPrefix: 'KKBK' },
                ].map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => {
                      setBankName(b.fullName);
                      if (!ifscCode || ifscCode.length < 4) {
                        setIfscCode(b.ifscPrefix);
                      }
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                      bankName.toLowerCase().includes(b.name.toLowerCase())
                        ? 'bg-amber-100 border-amber-400 text-red-950 shadow-xs ring-1 ring-amber-400'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Holder Name */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1 uppercase tracking-wider">
                Account Holder Name (खाताधारक का नाम)
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="As per bank passbook / statement"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1 uppercase tracking-wider">
                Bank Name (बैंक का नाम)
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. State Bank of India, HDFC Bank, PNB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1 uppercase tracking-wider">
                Account Number (बैंक खाता संख्या)
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 9-18 digit account number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white text-xs font-bold text-slate-900 focus:outline-hidden font-mono"
              />
            </div>

            {/* Confirm Account Number */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1 uppercase tracking-wider">
                Confirm Account Number (खाता संख्या दोबारा दर्ज करें)
              </label>
              <input
                type="password"
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Re-enter bank account number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white text-xs font-bold text-slate-900 focus:outline-hidden font-mono"
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1 uppercase tracking-wider">
                IFSC Code (11-Digit बैंक IFSC कोड)
              </label>
              <input
                type="text"
                maxLength={11}
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                placeholder="e.g. SBIN0001234 or HDFC0000123"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white text-xs font-bold text-slate-900 focus:outline-hidden font-mono uppercase"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct Bank IMPS / NEFT Settlement 24x7 Active</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Settlement Summary Breakdown */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Payout Channel:</span>
            <span className="font-bold text-slate-900">
              {payoutChannel === 'BANK' ? '🏦 Direct Bank Account (IMPS/NEFT)' : `⚡ UPI Transfer (${selectedUpiApp})`}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Requested Amount:</span>
            <span className="font-bold text-slate-900">₹{parsedAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Platform Fee / TDS:</span>
            <span className="font-bold text-emerald-600">₹0.00 (Zero Fee)</span>
          </div>
          <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
            <span>Net Payable to {payoutChannel === 'BANK' ? 'Bank' : 'UPI'}:</span>
            <span className="text-red-600">₹{parsedAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Withdrawal Button */}
        <button
          type="button"
          onClick={handleWithdraw}
          id="btn-submit-withdrawal"
          className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all active:scale-[0.98] cursor-pointer min-h-[48px] flex items-center justify-center gap-2 border border-yellow-300/30"
        >
          {payoutChannel === 'BANK' ? (
            <>
              <Building2 className="w-4 h-4 text-yellow-300" />
              <span>Confirm & Transfer ₹{parsedAmount.toFixed(2)} to Bank Account (बैंक खाते में भेजें)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Smartphone className="w-4 h-4 text-yellow-300" />
              <span>Confirm & Transfer ₹{parsedAmount.toFixed(2)} via UPI (UPI में भेजें)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400">
          ⚡ 24/7 automated gateway • Direct UPI / Bank NEFT settlement
        </p>
      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Withdrawal Queued!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your payout request of <strong>₹{parsedAmount.toFixed(2)}</strong> has been sent to our central payment engine for {payoutChannel === 'BANK' ? 'Bank Account' : 'UPI'} transfer.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Method:</span>
                <span className="font-bold text-slate-900">{payoutChannel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Target:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">
                  {payoutChannel === 'BANK' ? `${bankName} (${accountNumber.slice(-4)})` : upiId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Status:</span>
                <span className="font-bold text-amber-600">PENDING (In Queue)</span>
              </div>
            </div>

            <button
              onClick={handleSuccessOk}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              View Withdrawal Statements
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
