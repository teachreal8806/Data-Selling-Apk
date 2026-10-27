import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  CreditCard, 
  ShieldCheck, 
  ShieldAlert,
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
  // First withdrawal min is ₹250, second onwards is ₹500
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

  const popularBanks = [
    { name: 'State Bank of India', ifscPrefix: 'SBIN' },
    { name: 'Punjab National Bank', ifscPrefix: 'PUNB' },
    { name: 'HDFC Bank', ifscPrefix: 'HDFC' },
    { name: 'ICICI Bank', ifscPrefix: 'ICIC' },
    { name: 'Axis Bank', ifscPrefix: 'UTIB' },
    { name: 'Bank of Baroda', ifscPrefix: 'BARB' },
  ];

  const handleSelectBankChip = (b: { name: string; ifscPrefix: string }) => {
    setBankName(b.name);
    if (!ifscCode || ifscCode.length < 4) {
      setIfscCode(b.ifscPrefix + '0001234');
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < minWithdrawal) {
      setErrorMessage(`Minimum withdrawal amount is ₹${minWithdrawal}.`);
      return;
    }

    if (numAmount > userState.balance) {
      setErrorMessage(`Insufficient balance. You currently have ₹${userState.balance.toFixed(2)}.`);
      return;
    }

    // Check ₹99 security gate
    if (!userState.hasPaidWithdrawalFee) {
      onOpenWithdrawalFeeModal();
      return;
    }

    if (payoutChannel === 'UPI') {
      const cleanUpi = upiId.trim();
      if (!cleanUpi || !cleanUpi.includes('@') || cleanUpi.length < 5) {
        setErrorMessage('Please enter a valid UPI ID (e.g. 98XXXXXXXX@paytm or name@oksbi).');
        return;
      }

      const success = onSubmitWithdrawal(numAmount, cleanUpi, selectedUpiApp);
      if (success) {
        setShowSuccessModal(true);
      }
    } else {
      // Bank validation
      if (!accountHolderName.trim()) {
        setErrorMessage('Please enter Account Holder Name.');
        return;
      }
      if (!bankName.trim()) {
        setErrorMessage('Please enter Bank Name.');
        return;
      }
      const cleanAcc = accountNumber.trim().replace(/\s/g, '');
      const cleanConfirm = confirmAccountNumber.trim().replace(/\s/g, '');
      if (cleanAcc.length < 9 || cleanAcc.length > 18) {
        setErrorMessage('Bank Account Number must be between 9 and 18 digits.');
        return;
      }
      if (cleanAcc !== cleanConfirm) {
        setErrorMessage('Bank Account Number and Confirm Account Number do not match!');
        return;
      }
      const cleanIfsc = ifscCode.trim().toUpperCase().replace(/\s/g, '');
      if (cleanIfsc.length !== 11) {
        setErrorMessage('IFSC Code must be exactly 11 characters (e.g. SBIN0001234).');
        return;
      }

      const bankDetails: BankDetails = {
        accountHolderName: accountHolderName.trim(),
        bankName: bankName.trim(),
        accountNumber: cleanAcc,
        ifscCode: cleanIfsc,
      };

      const success = onSubmitWithdrawal(numAmount, '', 'BANK', bankDetails);
      if (success) {
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-28 text-slate-100">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-withdraw-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white py-1.5 px-3 rounded-xl hover:bg-slate-800 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 bg-slate-900 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30 text-xs font-bold">
          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
          <span>Payout Center</span>
        </div>

        <button
          onClick={onGoToHistory}
          className="text-xs font-semibold text-slate-400 hover:text-cyan-400 flex items-center gap-1 py-1.5 px-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer min-h-[44px]"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      {/* Available Balance Payout Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Withdrawable Balance</span>
          <span className="font-mono text-cyan-400 font-bold bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            {userState.hasPaidWithdrawalFee ? 'Ready for IMPS' : '₹99 Gate Locked'}
          </span>
        </div>

        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-cyan-400">₹</span>
          <span className="text-4xl font-black text-white font-mono tabular-nums">
            {userState.balance.toFixed(2)}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Min. Payout: <strong className="text-white font-mono">₹{minWithdrawal}</strong> ({isFirstWithdrawal ? '1st Payout' : 'Regular'})</span>
          <span>Settlement: <strong className="text-emerald-400 font-mono">Instant IMPS</strong></span>
        </div>
      </div>

      {/* Dual Channel Switcher: UPI vs Bank Account */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setPayoutChannel('UPI');
            setErrorMessage(null);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative min-h-[72px] ${
            payoutChannel === 'UPI'
              ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70'
          }`}
        >
          {payoutChannel === 'UPI' && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-cyan-400" />
          )}
          <Smartphone className={`w-5 h-5 mb-1.5 ${payoutChannel === 'UPI' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <p className="text-xs font-bold text-white">UPI Transfer</p>
          <p className="text-[10px] text-slate-400">PhonePe, GPay, Paytm</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setPayoutChannel('BANK');
            setErrorMessage(null);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative min-h-[72px] ${
            payoutChannel === 'BANK'
              ? 'bg-slate-900 border-emerald-400 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70'
          }`}
        >
          {payoutChannel === 'BANK' && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400" />
          )}
          <Building2 className={`w-5 h-5 mb-1.5 ${payoutChannel === 'BANK' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <p className="text-xs font-bold text-white">Direct Bank</p>
          <p className="text-[10px] text-slate-400">Account No. + IFSC</p>
        </button>
      </div>

      {/* Main Withdrawal Form */}
      <form onSubmit={handleWithdraw} className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
        
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Amount Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Withdrawal Amount (₹)
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {quickAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer min-h-[40px] border ${
                  amount === val.toString()
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                ₹{val}
              </button>
            ))}
          </div>

          <input
            type="number"
            required
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrorMessage(null);
            }}
            placeholder={`Min ₹${minWithdrawal}`}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-hidden focus:border-cyan-400"
          />
        </div>

        {/* Payout Channel Fields: UPI vs Direct Bank Transfer */}
        {payoutChannel === 'UPI' ? (
          /* UPI TRANSFER SECTION */
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select UPI App
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['PhonePe', 'GPay', 'UPI'] as const).map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedUpiApp(app)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[40px] border ${
                      selectedUpiApp === app
                        ? 'bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-xs'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {app === 'GPay' ? 'Google Pay' : app}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Enter UPI ID (VPA)
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">e.g. mobile@oksbi</span>
              </div>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="7543355356@oksbi or username@paytm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-hidden focus:border-cyan-400"
              />

              {/* Quick Handle Suffix Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {['@oksbi', '@ybl', '@paytm', '@ibl', '@axl'].map((suffix) => (
                  <button
                    key={suffix}
                    type="button"
                    onClick={() => handleQuickUpiSuffix(suffix)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {suffix}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* DIRECT BANK TRANSFER SECTION */
          <div className="space-y-3 pt-2 border-t border-slate-800">
            {/* Quick Bank Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Popular Banks (Tap to Auto-fill)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {popularBanks.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => handleSelectBankChip(b)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all cursor-pointer border truncate ${
                      bankName === b.name
                        ? 'bg-slate-800 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {b.name.replace(' Bank', '')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                required
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Name as per Passbook"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. State Bank of India"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter 9 to 18-digit Account Number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs tracking-wider focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Bank Account Number
              </label>
              <input
                type="text"
                required
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value)}
                placeholder="Re-enter Account Number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs tracking-wider focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  IFSC Code (11 Characters)
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">e.g. SBIN0001234</span>
              </div>
              <input
                type="text"
                required
                maxLength={11}
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                placeholder="SBIN0001234"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs uppercase tracking-widest focus:outline-hidden focus:border-emerald-400"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          id="btn-confirm-payout"
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer min-h-[46px] flex items-center justify-center gap-2 mt-4"
        >
          <CreditCard className="w-4 h-4" />
          <span>Confirm {payoutChannel === 'BANK' ? 'Bank' : 'UPI'} Payout (₹{amount})</span>
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Withdrawal Queued!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Your ₹{amount} withdrawal request has been submitted to the banking gateway. Funds will be credited to your {payoutChannel === 'BANK' ? 'Bank Account' : 'UPI address'} shortly.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Amount:</span>
                <span className="font-mono font-bold text-white">₹{amount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Channel:</span>
                <span className="font-semibold text-slate-200">{payoutChannel === 'BANK' ? 'Bank Transfer (IMPS)' : 'UPI'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-cyan-400 font-bold">QUEUED FOR SETTLEMENT</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                onGoToHistory();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer min-h-[44px]"
            >
              View Withdrawal Status
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
