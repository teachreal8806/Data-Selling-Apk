import React from 'react';
import { 
  Play, 
  Sparkles, 
  Zap, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Tv
} from 'lucide-react';
import { AdItem } from '../types';
import { SPONSORED_ADS } from './WatchAdsModal';

interface AdsSectionProps {
  onWatchAd: (ad: AdItem) => void;
  adsWatchedToday?: number;
  dailyLimit?: number;
  hasPaidAdsActivation?: boolean;
  isAdsPending?: boolean;
  adsUtr?: string;
  onOpenUnlockAds: () => void;
}

export const AdsSection: React.FC<AdsSectionProps> = ({
  onWatchAd,
  adsWatchedToday = 0,
  dailyLimit = 10,
  hasPaidAdsActivation = false,
  isAdsPending = false,
  adsUtr,
  onOpenUnlockAds,
}) => {
  const featuredAd = SPONSORED_ADS[0];

  return (
    <div className="space-y-3 pt-1">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xs">
            <Tv className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Watch & Earn Cash Ads
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-300 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
          <span>{hasPaidAdsActivation ? `${adsWatchedToday}/${dailyLimit}` : isAdsPending ? '⏳ PENDING' : '₹199 LOCKED'}</span>
          <span className="text-[10px] text-slate-500">Status</span>
        </div>
      </div>

      {/* If ₹199 NOT paid: Show Locked Gate in Cyber Obsidian & Indigo */}
      {!hasPaidAdsActivation ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 text-white shadow-xl border border-indigo-500/30">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30 shadow-xs">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAdsPending ? '⏳ APPROVAL PENDING' : '₹199 ACTIVATION REQUIRED'}</span>
              </div>

              <span className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs px-2.5 py-0.5 rounded-lg font-mono">
                {isAdsPending ? 'Admin Review' : 'Guaranteed Instant'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {isAdsPending ? '₹199 Verification Submitted' : 'Watch Ads & Earn ₹50-₹100 Daily Cash'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                {isAdsPending
                  ? `Aapka ₹199 UTR (${adsUtr || 'Submitted'}) admin panel me verify ho raha hai. Approval ke baad ads chalne lagenge.`
                  : 'Watch ads feature unlock karne ke liye ₹199 ka one-time verification payment karein aur 12-digit UTR submit karein.'}
              </p>
            </div>

            <button
              onClick={onOpenUnlockAds}
              id="btn-unlock-ads-199"
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                isAdsPending
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white border-cyan-400/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>
                {isAdsPending
                  ? `⏳ Verification Pending (Check / Re-enter UTR)`
                  : 'Unlock Watch Ads Now (Pay ₹199 & Enter UTR)'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* If ₹199 IS paid: Show Unlocked High-CPM Video Ad Card in Obsidian & Emerald */
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-emerald-500/40 p-4 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>UNLOCKED • LIFETIME ACCESS</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                Watch 10-Sec Ad & Earn ₹5.00
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Sponsor reward credited directly to your wallet balance.
              </p>
            </div>

            <div className="shrink-0 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Reward</span>
              <span className="text-base font-bold text-emerald-400 font-mono">+₹5.00</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10 mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant wallet credit</span>
            </div>

            <button
              onClick={() => onWatchAd(featuredAd)}
              id="btn-watch-primary-ad"
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>Watch Video Ad</span>
            </button>
          </div>
        </div>
      )}

      {/* Secondary Quick Ad Options Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {SPONSORED_ADS.slice(1, 3).map((ad) => (
          <button
            key={ad.id}
            onClick={() => {
              if (!hasPaidAdsActivation) {
                onOpenUnlockAds();
              } else {
                onWatchAd(ad);
              }
            }}
            className="text-left bg-slate-900 hover:bg-slate-800/90 border border-slate-800 rounded-2xl p-3 shadow-xs active:scale-98 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded-md">
                  {ad.category.split('&')[0]}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +₹{ad.rewardAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                {ad.title}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {hasPaidAdsActivation ? `${ad.durationSeconds}s sponsor ad` : '🔒 ₹199 to unlock'}
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-cyan-400">
              <span className="flex items-center gap-1">
                {hasPaidAdsActivation ? (
                  <>
                    <Play className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                    <span>Watch</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-400">Unlock</span>
                  </>
                )}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
