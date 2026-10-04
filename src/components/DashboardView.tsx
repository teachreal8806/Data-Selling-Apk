import React from 'react';
import { 
  Zap, 
  Database, 
  ArrowRight, 
  Square, 
  Play, 
  Sparkles, 
  TrendingUp, 
  CreditCard, 
  Trophy, 
  QrCode, 
  AlertCircle, 
  Activity, 
  Wifi, 
  CheckCircle2,
  Lock,
  Flame,
  ShieldAlert,
  Rocket
} from 'lucide-react';
import { DataPacket, UserState, TopEarner, AdItem } from '../types';
import { AdsSection } from './AdsSection';

interface DashboardViewProps {
  userState: UserState;
  onToggleSelling: () => void;
  packets: DataPacket[];
  onOpenWithdraw: () => void;
  onOpenDeposit?: () => void;
  topEarners?: TopEarner[];
  onOpenLeaderboard: () => void;
  onOpenAdmin?: () => void;
  onWatchAd: (ad: AdItem) => void;
  adsWatchedToday?: number;
  dailyAdLimit?: number;
  onOpenUnlockAds: () => void;
  onOpenWithdrawalFeeModal: () => void;
  onOpenSpeedTurboModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userState,
  onToggleSelling,
  packets,
  onOpenWithdraw,
  onOpenDeposit,
  topEarners = [],
  onOpenLeaderboard,
  onWatchAd,
  adsWatchedToday = 0,
  dailyAdLimit = 10,
  onOpenUnlockAds,
  onOpenWithdrawalFeeModal,
  onOpenSpeedTurboModal,
}) => {
  const topThree = topEarners.slice(0, 3);
  const telecomProviders = ['Jio 5G Plus', 'Airtel 5G Plus', 'Vi GIGAnet', 'Starlink India', 'BSNL Fiber'];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 text-slate-800">
      
      {/* 1. Ultra Premium Red & Yellow Master Balance Card */}
      <div 
        id="balance-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 p-6 text-white shadow-2xl shadow-red-600/30 transition-all border-2 border-yellow-300"
      >
        {/* Golden & Red Sheen Glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-red-900/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-200/20 via-transparent to-black/20 pointer-events-none" />

        {/* Card Header: Tier Badge & Network Status */}
        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-yellow-200/40 text-[11px] font-black uppercase tracking-wider text-yellow-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
            <span>{userState.tier} VIP ELITE</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/95 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-yellow-300/30">
            <span className={`w-2.5 h-2.5 rounded-full ${userState.isSelling ? 'bg-yellow-300 animate-ping' : 'bg-slate-300'}`} />
            <span className="font-bold text-[11px]">
              {userState.isSelling ? 'Live Streaming' : 'Network Standby'}
            </span>
          </div>
        </div>

        {/* Main Wallet Balance in Gold & White */}
        <div className="relative z-10 text-center py-2">
          <p className="text-xs uppercase font-extrabold text-yellow-100 tracking-widest mb-1 drop-shadow-xs">
            Available Wallet Balance
          </p>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-3xl font-extrabold text-yellow-300">₹</span>
            <span className="text-5xl font-black text-white tracking-tight font-mono tabular-nums drop-shadow-md">
              {userState.balance.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-yellow-100 mt-2 font-bold flex items-center justify-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-yellow-300" />
            <span>Total Bandwidth Sold:</span>
            <span className="text-white font-mono font-black">{userState.totalSoldMB.toFixed(2)} MB</span>
          </p>
        </div>

        {/* Quick Action Buttons: Deposit & Withdraw */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/25 grid grid-cols-2 gap-3">
          {onOpenDeposit && (
            <button
              id="btn-card-quick-deposit"
              onClick={onOpenDeposit}
              className="py-2.5 px-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-yellow-200/50 text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm min-h-[44px]"
            >
              <QrCode className="w-4 h-4 text-yellow-300" />
              <span>Deposit (QR)</span>
            </button>
          )}

          <button
            id="btn-card-quick-withdraw"
            onClick={onOpenWithdraw}
            className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 hover:from-yellow-200 hover:to-amber-200 text-red-950 text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-lg min-h-[44px] border border-yellow-200"
          >
            <CreditCard className="w-4 h-4 text-red-900" />
            <span>Withdraw Cash</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-900" />
          </button>
        </div>
      </div>

      {/* ₹99 Withdrawal Verification Notice Banner if not yet verified */}
      {!userState.hasPaidWithdrawalFee && (
        <div className="bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border-2 border-amber-400/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-amber-950 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <div className="text-left">
              <p className="text-xs font-black text-red-950">₹99 Payout Security Gate</p>
              <p className="text-[11px] text-amber-900 leading-tight">
                Bank payout server unlock karne ke liye ₹99 fee transfer karein.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWithdrawalFeeModal}
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs whitespace-nowrap shadow-sm cursor-pointer active:scale-95 transition-all"
          >
            Pay ₹99
          </button>
        </div>
      )}

      {/* 2. Primary Monetization CTA: Red & Yellow Theme (50mb, 500mb, 1gb buttons REMOVED as requested) */}
      <div className="space-y-2">
        <button
          id="btn-toggle-sell"
          onClick={onToggleSelling}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer shadow-xl min-h-[54px] border-2 ${
            userState.isSelling
              ? 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white shadow-red-700/30 border-red-500'
              : 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-red-600/25 border-yellow-300'
          }`}
        >
          {userState.isSelling ? (
            <>
              {/* Equalizer Wave Bars in Golden Yellow */}
              <div className="flex items-center gap-1 h-5">
                <span className="w-1 bg-yellow-300 rounded-full animate-eq-1" />
                <span className="w-1 bg-yellow-300 rounded-full animate-eq-2" />
                <span className="w-1 bg-yellow-300 rounded-full animate-eq-3" />
                <span className="w-1 bg-yellow-300 rounded-full animate-eq-4" />
              </div>
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Bandwidth Monetization</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-yellow-300 text-yellow-300" />
              <span>Sell 500MB Data</span>
              <span className="text-yellow-200">➔</span>
              <span className="px-3 py-1 rounded-xl bg-yellow-300 text-red-950 font-mono font-black shadow-xs">
                Earn ₹500
              </span>
            </>
          )}
        </button>

        {/* Live Streaming State Indicator */}
        <div className="flex items-center justify-between text-xs px-2 text-slate-500 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${userState.isSelling ? 'bg-amber-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold text-slate-700">
              {userState.isSelling
                ? userState.hasPaidSpeedTurbo
                  ? '⚡ 5G Turbo Super Fast Streaming Active!'
                  : 'Streaming data packets (Standard Mode)...'
                : 'Bandwidth Ready • Tap to Monetize'}
            </span>
          </div>

          <span className="text-[10px] font-mono font-extrabold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
            ₹1.00 / MB
          </span>
        </div>
      </div>

      {/* 3. Fast Data Selling 5G Turbo Speed Booster ("data selling speed me selling karne ke liye bhi 99 ka payment ka option add kijiye sir") */}
      <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-red-50 p-3.5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
              <Rocket className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xs font-black text-red-950">5G Turbo Speed Mode (10x Fast)</h3>
              <p className="text-[10px] text-amber-900">High-speed data packet transfer booster</p>
            </div>
          </div>

          {userState.hasPaidSpeedTurbo ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>ACTIVE</span>
            </span>
          ) : (
            <button
              onClick={onOpenSpeedTurboModal}
              id="btn-activate-turbo-speed"
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer border border-yellow-300"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Unlock ₹99</span>
            </button>
          )}
        </div>

        {userState.hasPaidSpeedTurbo ? (
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-400/40 text-[11px] font-bold text-emerald-900 flex items-center justify-between">
            <span>⚡ 5G Turbo Pipeline: 800ms Stream • 2.5MB / Packet</span>
            <span className="font-mono text-[10px] text-emerald-700">10X BOOST</span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-600 leading-tight">
            Data selling ko super-fast speed me bechne aur turant earnings stream karne ke liye <strong className="text-red-700 font-bold">₹99 Turbo Speed</strong> payment karein.
          </p>
        )}
      </div>

      {/* 4. Sponsored Ads & Rewarded Video Zone (Requires ₹199 Payment to unlock) */}
      <AdsSection 
        onWatchAd={onWatchAd} 
        adsWatchedToday={adsWatchedToday} 
        dailyLimit={dailyAdLimit}
        hasPaidAdsActivation={userState.hasPaidAdsActivation}
        onOpenUnlockAds={onOpenUnlockAds}
      />

      {/* 5. Live Telemetry 2-Column Bento Grid in Red & Yellow Theme */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-gradient-to-br from-white via-amber-50/40 to-white rounded-2xl p-3.5 space-y-1 border border-amber-300 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900">Network Rate</span>
            <TrendingUp className="w-3.5 h-3.5 text-red-600" />
          </div>
          <p className="text-base font-black text-red-600 font-mono">
            ₹1.00 <span className="text-xs text-slate-500 font-normal">/ MB</span>
          </p>
          <p className="text-[10px] text-amber-800 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Guaranteed credit
          </p>
        </div>

        <div className="bg-gradient-to-br from-white via-amber-50/40 to-white rounded-2xl p-3.5 space-y-1 border border-amber-300 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900">Node Latency</span>
            <Activity className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-base font-black text-slate-900 font-mono">
            {userState.hasPaidSpeedTurbo ? '4 ms' : '12 ms'} <span className="text-xs text-emerald-600 font-bold">Ultra Low</span>
          </p>
          <p className="text-[10px] text-slate-500 font-medium">Global 5G Route</p>
        </div>
      </div>

      {/* 6. Top 1 to 10 High Earners Showcase Card in Gold & Red Podium */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-100/70 via-white to-amber-50 border-2 border-amber-400/80 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Trophy className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xs font-black text-red-950 tracking-tight">Top 1 to 10 High Earners</h3>
              <p className="text-[10px] text-amber-900">Verified automated payouts</p>
            </div>
          </div>

          <button
            onClick={onOpenLeaderboard}
            id="btn-view-all-top-10"
            className="text-xs font-black text-red-950 hover:text-red-900 flex items-center gap-1 bg-amber-200/80 hover:bg-amber-300 border border-amber-400 py-1.5 px-3 rounded-xl transition-all cursor-pointer min-h-[44px]"
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
                className="bg-white rounded-2xl p-2.5 border-2 border-amber-300/80 text-center shadow-xs hover:border-amber-500 transition-all"
              >
                <div className="text-base">
                  {earner.rank === 1 ? '🥇' : earner.rank === 2 ? '🥈' : '🥉'}
                </div>
                <p className="text-xs font-bold text-slate-800 truncate mt-1">{earner.name.split(' ')[0]}</p>
                <p className="text-xs font-black text-red-600 font-mono">₹{earner.totalEarned.toLocaleString()}</p>
                <span className="text-[9px] text-amber-800 font-bold block font-mono mt-0.5">{earner.mbSold}MB</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Live Bandwidth Micro-Packet History */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-600" />
            <h2 className="text-sm font-bold text-red-950 tracking-tight">Recent Data Payouts</h2>
          </div>
          <span className="text-xs text-amber-900 font-mono font-bold">
            {packets.length} packets
          </span>
        </div>

        {packets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-amber-200 shadow-xs">
            <Database className="w-10 h-10 text-amber-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No Data Transferred Yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Tap <span className="font-semibold text-red-600">"Sell 500MB Data ➔ Earn ₹500"</span> above to stream packets and earn instant cash!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {packets.map((packet, idx) => {
              const provider = telecomProviders[idx % telecomProviders.length];

              return (
                <div
                  key={packet.id}
                  className="flex items-center justify-between p-3 bg-white border border-amber-200/90 rounded-2xl shadow-xs hover:border-amber-400 transition-all animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {/* Left: Provider Icon + Name */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{provider}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{packet.time}</span>
                    </div>
                  </div>

                  {/* Middle: MB */}
                  <div className="text-center font-mono text-xs font-bold text-slate-600">
                    <span>{packet.mb.toFixed(2)} MB</span>
                  </div>

                  {/* Right: Rupee Amount */}
                  <div className="text-right">
                    <span className="text-xs font-black text-red-600 font-mono flex items-center justify-end gap-0.5">
                      <span>+₹</span>
                      <span>{packet.amount.toFixed(2)}</span>
                    </span>
                    <span className="text-[9px] text-emerald-700 block uppercase font-extrabold">Credited</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
