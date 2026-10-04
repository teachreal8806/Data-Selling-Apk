import React, { useState, useEffect } from 'react';
import { 
  Play, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ExternalLink, 
  Gift, 
  Timer, 
  Zap, 
  Award,
  ShieldCheck
} from 'lucide-react';
import { AdItem } from '../types';

export const SPONSORED_ADS: AdItem[] = [
  {
    id: 'ad_phonepe',
    title: 'PhonePe UPI & Instant Loans',
    sponsor: 'PhonePe India • Google Certified Ad',
    category: 'Fintech & Payments',
    rewardAmount: 5.00,
    durationSeconds: 10,
    tagline: 'Get Instant Zero-Interest Credit & Super Cashback on Every QR Scan!',
    badge: 'HIGH REWARD ₹5.00',
    gradient: 'from-red-600 via-rose-600 to-amber-600',
    iconName: 'CreditCard',
  },
  {
    id: 'ad_dream11',
    title: 'Dream11 Official T20 Arena',
    sponsor: 'Dream Sports • Sponsored Campaign',
    category: 'Gaming & Sports',
    rewardAmount: 6.50,
    durationSeconds: 12,
    tagline: 'Build Your Dream Cricket Squad & Win Up To ₹1 Crore Daily Guaranteed!',
    badge: 'SUPER BONUS ₹6.50',
    gradient: 'from-amber-600 via-red-600 to-rose-700',
    iconName: 'Trophy',
  },
  {
    id: 'ad_tata_neu',
    title: 'Tata Neu • Tata Super Rewards',
    sponsor: 'Tata Digital • Verified Partner',
    category: 'Shopping & Travel',
    rewardAmount: 5.00,
    durationSeconds: 10,
    tagline: 'Earn 5% NeuCoins on Flights, Hotels, Electronics and Croma Deals.',
    badge: 'TRENDING ₹5.00',
    gradient: 'from-rose-600 via-amber-600 to-yellow-600',
    iconName: 'Sparkles',
  },
  {
    id: 'ad_zepto',
    title: 'Zepto 10-Minute Grocery Delivery',
    sponsor: 'Kiranakart • Flash Offer',
    category: 'Quick Commerce',
    rewardAmount: 5.00,
    durationSeconds: 8,
    tagline: 'Get Fresh Groceries, Dairy & Snacks Delivered in 10 Minutes with Free Delivery.',
    badge: 'QUICK AD ₹5.00',
    gradient: 'from-amber-500 via-orange-600 to-rose-600',
    iconName: 'Gift',
  },
  {
    id: 'ad_jio_cinema',
    title: 'JioHotstar Premium Streaming',
    sponsor: 'Reliance Jio Digital Media',
    category: 'Entertainment',
    rewardAmount: 7.00,
    durationSeconds: 12,
    tagline: 'Stream Live Cricket, Movies, and Exclusive Web Series in 4K Dolby Atmos.',
    badge: 'MEGA PAYOUT ₹7.00',
    gradient: 'from-pink-600 via-purple-600 to-indigo-700',
    iconName: 'Zap',
  },
];

interface WatchAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned: (amount: number, ad: AdItem) => void;
  selectedAd?: AdItem | null;
}

export const WatchAdsModal: React.FC<WatchAdsModalProps> = ({
  isOpen,
  onClose,
  onRewardEarned,
  selectedAd,
}) => {
  const currentAd = selectedAd || SPONSORED_ADS[0];
  const [timeLeft, setTimeLeft] = useState(currentAd.durationSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(currentAd.durationSeconds);
      setIsCompleted(false);
      setHasClaimed(false);
      return;
    }

    setTimeLeft(currentAd.durationSeconds);
    setIsCompleted(false);
    setHasClaimed(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, currentAd]);

  if (!isOpen) return null;

  const progress = Math.min(100, Math.round(((currentAd.durationSeconds - timeLeft) / currentAd.durationSeconds) * 100));

  const handleClaimReward = () => {
    if (hasClaimed) return;
    setHasClaimed(true);
    onRewardEarned(currentAd.rewardAmount, currentAd);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Top Video Header Bar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sponsored Ad
            </span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-[130px]">
              {currentAd.sponsor}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {isCompleted ? (
              <button 
                onClick={onClose} 
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full border border-white/20 text-[11px] font-mono font-bold text-amber-300">
                <Timer className="w-3 h-3 animate-spin" />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Video Simulation Canvas / Interactive Ad Stage */}
        <div className={`relative h-56 bg-gradient-to-br ${currentAd.gradient} flex flex-col items-center justify-center p-6 text-white text-center overflow-hidden`}>
          {/* Animated Sheen / Particle Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute top-2 right-2 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Reward Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-black tracking-wide text-amber-200 shadow-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{currentAd.badge}</span>
          </div>

          {/* Ad Title & Dynamic Content */}
          <h3 className="text-xl font-black text-white tracking-tight drop-shadow-md">
            {currentAd.title}
          </h3>
          <p className="text-xs text-white/90 mt-2 line-clamp-2 max-w-xs drop-shadow-sm font-medium">
            {currentAd.tagline}
          </p>

          {/* Action Simulation Button */}
          <div className="mt-4 flex items-center gap-2">
            <a 
              href="https://play.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="px-4 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-black shadow-lg hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <span>Install Offer</span>
              <ExternalLink className="w-3 h-3 text-slate-600" />
            </a>
          </div>

          {/* Progress Bar at bottom of video */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <div 
              className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Payout & Claim Section */}
        <div className="p-5 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Google AdMob Partner Verified</span>
            </div>
            <span className="font-mono font-bold text-red-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
              +₹{currentAd.rewardAmount.toFixed(2)} Cash
            </span>
          </div>

          {isCompleted ? (
            <button
              onClick={handleClaimReward}
              disabled={hasClaimed}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all min-h-[48px] ${
                hasClaimed
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-red-500/25 border border-yellow-300'
              }`}
            >
              {hasClaimed ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>₹{currentAd.rewardAmount.toFixed(2)} Credited to Balance!</span>
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 text-yellow-300 animate-bounce" />
                  <span>Claim ₹{currentAd.rewardAmount.toFixed(2)} Cash Reward Now</span>
                </>
              )}
            </button>
          ) : (
            <div className="w-full py-3 px-4 rounded-2xl bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 border border-amber-300">
              <Timer className="w-4 h-4 text-red-600 animate-pulse" />
              <span>Watch full ad to claim ₹{currentAd.rewardAmount.toFixed(2)} ({timeLeft}s left)</span>
            </div>
          )}

          <p className="text-[10px] text-center text-slate-600">
            Ad reward is credited instantly to your available wallet balance for UPI withdrawal.
          </p>
        </div>

      </div>
    </div>
  );
};
