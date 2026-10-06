import React from 'react';
import { 
  Play, 
  Sparkles, 
  Gift, 
  Zap, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  Flame,
  ShieldCheck,
  ArrowRight
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
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
          </div>
          <h2 className="text-xs font-black uppercase tracking-wider text-red-950">
            Watch & Earn Cash Ads
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
          <span>{hasPaidAdsActivation ? `${adsWatchedToday}/${dailyLimit}` : isAdsPending ? '⏳ PENDING' : '₹199 LOCKED'}</span>
          <span className="text-[10px] text-amber-800">Status</span>
        </div>
      </div>

      {/* If ₹199 NOT paid: Show Locked Gate as requested ("ye ads vala 199 payment ke bad watch ads chale sir utr number bharne ka option add kar dijiyega sir") */}
      {!hasPaidAdsActivation ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 p-5 text-white shadow-xl shadow-red-600/20 border-2 border-yellow-400">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-yellow-300/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-red-800/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-yellow-200 border border-yellow-300/40 shadow-xs">
                <Lock className="w-3.5 h-3.5 text-yellow-300" />
                <span>{isAdsPending ? '⏳ APPROVAL PENDING' : '₹199 ACTIVATION REQUIRED'}</span>
              </div>

              <span className="bg-yellow-400 text-red-950 font-black text-xs px-2.5 py-0.5 rounded-lg font-mono shadow-xs">
                {isAdsPending ? 'Pending Admin' : '100% Guaranteed'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-white leading-tight">
                {isAdsPending ? '₹199 Verification Submitted' : 'Watch Ads & Earn ₹50-₹100 Daily Cash'}
              </h3>
              <p className="text-xs text-amber-100 mt-1 font-medium leading-relaxed">
                {isAdsPending
                  ? `Aapka ₹199 UTR (${adsUtr || 'Submitted'}) admin panel me verify ho raha hai. Admin approval ke baad ads automatically chalne lagenge.`
                  : 'Watch ads feature unlock karne ke liye ₹199 ka one-time verification payment karein aur 12-digit UTR submit karein.'}
              </p>
            </div>

            <button
              onClick={onOpenUnlockAds}
              id="btn-unlock-ads-199"
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                isAdsPending
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                  : 'bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 hover:from-yellow-200 hover:to-amber-300 text-red-950 border-yellow-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>
                {isAdsPending
                  ? `⏳ Verification Pending (Check / Re-enter UTR)`
                  : 'Unlock Watch Ads Now (Pay ₹199 & Enter UTR)'}
              </span>
              <ArrowRight className="w-4 h-4 text-red-700" />
            </button>
          </div>
        </div>
      ) : (
        /* If ₹199 IS paid: Show Unlocked High-CPM Video Ad Card in Red & Yellow */
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 p-4 text-white shadow-lg shadow-red-600/20 border-2 border-yellow-400">
          <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-300/25 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-yellow-200 border border-yellow-300/30">
                <CheckCircle2 className="w-3 h-3 text-yellow-300" />
                <span>UNLOCKED • LIFETIME ACCESS</span>
              </div>
              <h3 className="text-sm font-black text-white mt-1">
                Watch 10-Sec Ad & Earn ₹5.00
              </h3>
              <p className="text-[11px] text-amber-100 font-medium">
                Verified sponsor reward credited directly to your UPI wallet.
              </p>
            </div>

            <div className="shrink-0 bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-yellow-300/40 text-center">
              <span className="text-[10px] text-yellow-200 uppercase font-bold block">Reward</span>
              <span className="text-base font-black text-yellow-300 font-mono">+₹5.00</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10 mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-yellow-100">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Instant balance credit</span>
            </div>

            <button
              onClick={() => onWatchAd(featuredAd)}
              id="btn-watch-primary-ad"
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 hover:from-yellow-200 hover:to-amber-300 text-red-950 font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-red-950 text-red-950" />
              <span>Watch Video Ad</span>
            </button>
          </div>
        </div>
      )}

      {/* Secondary Quick Ad Options Grid in Red & Yellow Theme */}
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
            className="text-left bg-gradient-to-br from-white via-amber-50/40 to-white hover:from-amber-50 border border-amber-300 rounded-2xl p-3 shadow-xs active:scale-98 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-black uppercase text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md">
                  {ad.category.split('&')[0]}
                </span>
                <span className="text-xs font-mono font-black text-amber-600">
                  +₹{ad.rewardAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                {ad.title}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {hasPaidAdsActivation ? `${ad.durationSeconds}s quick sponsor ad` : '🔒 ₹199 to unlock'}
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-bold text-red-600">
              <span className="flex items-center gap-1">
                {hasPaidAdsActivation ? (
                  <>
                    <Play className="w-3 h-3 fill-red-600 text-red-600" />
                    <span>Watch</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span className="text-amber-700">Unlock</span>
                  </>
                )}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
