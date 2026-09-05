import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  ThumbsUp, 
  Clock, 
  Database, 
  ArrowRight, 
  Square, 
  Play, 
  Sparkles,
  TrendingUp,
  CreditCard,
  Trophy,
  Shield,
  Medal,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { DataPacket, UserState, TopEarner } from '../types';

interface DashboardViewProps {
  userState: UserState;
  onToggleSelling: () => void;
  packets: DataPacket[];
  onOpenWithdraw: () => void;
  onOpenDeposit?: () => void;
  onInstantSellBatch: (mb: number, amount: number) => void;
  topEarners?: TopEarner[];
  onOpenLeaderboard: () => void;
  onOpenAdmin?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userState,
  onToggleSelling,
  packets,
  onOpenWithdraw,
  onOpenDeposit,
  onInstantSellBatch,
  topEarners = [],
  onOpenLeaderboard,
}) => {
  const topThree = topEarners.slice(0, 3);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4">
      {/* Blue Main Card */}
      <div 
        id="balance-card"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1877f2] to-[#1565c0] text-white p-6 shadow-lg shadow-blue-500/20 text-center transition-all"
      >
        {/* Subtle background glow pattern */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

        {/* Tier Badge */}
        <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold tracking-widest uppercase mb-3 text-white shadow-xs">
          {userState.tier}
        </div>

        {/* Main Balance with pulsing live dot */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {userState.isSelling && (
            <span 
              className="w-3 h-3 rounded-full bg-white animate-ping"
              title="Selling Active"
            />
          )}
          <span className="text-4xl font-extrabold tracking-tight">
            ₹{userState.balance.toFixed(2)}
          </span>
        </div>

        {/* Total Sold Subtitle */}
        <p className="text-xs font-medium text-blue-100/90 tracking-wide">
          Total Sold: {userState.totalSoldMB.toFixed(2)}MB
        </p>

        {/* Quick Action Pills: Deposit & Withdraw */}
        <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-center gap-2">
          {onOpenDeposit && (
            <button
              id="btn-card-quick-deposit"
              onClick={onOpenDeposit}
              className="text-xs font-semibold text-white/95 hover:text-white flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/30 hover:bg-emerald-500/40 transition-all active:scale-95 cursor-pointer border border-emerald-400/30"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Deposit (QR Scanner)</span>
            </button>
          )}

          <button
            id="btn-card-quick-withdraw"
            onClick={onOpenWithdraw}
            className="text-xs font-semibold text-white/95 hover:text-white flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/15 hover:bg-white/25 transition-all active:scale-95 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Withdraw</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mandatory Verification Deposit Alert on Dashboard if Enforced */}
      {userState.requireDepositBeforeWithdrawal && !userState.hasCompletedRequiredDeposit && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-2 text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-left">
              <p className="text-[11px] font-bold">Verification Deposit Required</p>
              <p className="text-[10px] text-amber-800">
                Deposit ₹{userState.requiredDepositAmount || 200} to unlock bank payouts.
              </p>
            </div>
          </div>
          {onOpenDeposit && (
            <button
              onClick={onOpenDeposit}
              className="py-1 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] whitespace-nowrap shadow-2xs"
            >
              Deposit Now
            </button>
          )}
        </div>
      )}

      {/* Trust Badges Row */}
      <div className="grid grid-cols-3 gap-2 py-1">
        <div className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-white border border-slate-100 shadow-2xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-[11px] font-medium whitespace-nowrap">100% Secure</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-white border border-slate-100 shadow-2xs text-slate-600">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-[11px] font-medium whitespace-nowrap">Fast Payout</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-white border border-slate-100 shadow-2xs text-slate-600">
          <ThumbsUp className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-[11px] font-medium whitespace-nowrap">Trusted</span>
        </div>
      </div>

      {/* Main Action Button */}
      <div>
        <button
          id="btn-toggle-sell"
          onClick={onToggleSelling}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-base shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
            userState.isSelling
              ? 'bg-blue-600 text-white hover:bg-blue-700 ring-4 ring-blue-200/50 shadow-blue-500/25'
              : 'bg-[#1877f2] text-white hover:bg-[#166fe5] shadow-blue-500/25 hover:shadow-lg'
          }`}
        >
          {userState.isSelling ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Selling</span>
            </>
          ) : (
            <>
              <span>Sell 500MB</span>
              <ArrowRight className="w-4 h-4" />
              <span>₹500</span>
            </>
          )}
        </button>

        {/* Helpful description & fast action options */}
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${userState.isSelling ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            {userState.isSelling ? 'Sharing bandwidth live...' : 'Tap above to start selling'}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onInstantSellBatch(50, 50)}
              className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium cursor-pointer"
              title="Quickly add 50MB"
            >
              +50MB
            </button>
            <button
              onClick={() => onInstantSellBatch(500, 500)}
              className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium cursor-pointer"
              title="Sell full 500MB"
            >
              +500MB
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Status Card when Selling */}
      {userState.isSelling && (
        <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/60 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <p className="text-xs font-semibold text-blue-900">Background Data Sharing Active</p>
              <p className="text-[11px] text-blue-700">Generating live micro-packets every 2s</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-800 bg-white px-2 py-1 rounded-md border border-blue-200 shadow-2xs">
            ~₹1.00 / MB
          </span>
        </div>
      )}

      {/* TOP 1 TO 10 HIGH EARNERS PREVIEW CARD */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 rounded-2xl border border-amber-200/80 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Trophy className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Top 1 to 10 High Earners</h3>
              <p className="text-[10px] text-slate-500">Live network earnings leaderboard</p>
            </div>
          </div>

          <button
            onClick={onOpenLeaderboard}
            id="btn-view-all-top-10"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 bg-amber-100/80 hover:bg-amber-200/80 py-1 px-2.5 rounded-lg transition-all cursor-pointer"
          >
            <span>View All Top 10</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Top 3 Quick Preview */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {topThree.map((earner) => (
              <div 
                key={earner.id}
                className="bg-white/80 backdrop-blur-2xs rounded-xl p-2 border border-amber-100 text-center shadow-2xs"
              >
                <div className="text-sm">
                  {earner.rank === 1 ? '🥇' : earner.rank === 2 ? '🥈' : '🥉'}
                </div>
                <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{earner.name.split(' ')[0]}</p>
                <p className="text-[11px] font-extrabold text-emerald-600">₹{earner.totalEarned.toLocaleString()}</p>
                <span className="text-[9px] text-slate-400 block font-mono">{earner.mbSold}MB</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-slate-900">History</h2>
          <span className="text-xs text-slate-400 font-medium">
            {packets.length} transactions
          </span>
        </div>

        {packets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-2xs">
            <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No data sold yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Click <span className="font-semibold text-blue-600">"Sell 500MB ➔ ₹500"</span> to start sharing unused data and watch packets appear here in real time!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {packets.map((packet) => (
              <div
                key={packet.id}
                className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Left: Clock Icon + Time */}
                <div className="flex items-center gap-2 min-w-[110px]">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-600">
                    {packet.time}
                  </span>
                </div>

                {/* Middle: Database Icon + MB */}
                <div className="flex items-center gap-2 font-medium text-slate-700 text-xs">
                  <Database className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{packet.mb.toFixed(2)} MB</span>
                </div>

                {/* Right: Rupee Amount */}
                <div className="text-right min-w-[65px]">
                  <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                    <span>₹</span>
                    <span>{packet.amount.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

