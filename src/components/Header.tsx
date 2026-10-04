import React from 'react';
import { Menu, RefreshCw, Trophy, User, Wifi, Flame } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  isSelling: boolean;
  onReset: () => void;
  onOpenLeaderboard: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth: () => void;
  userEmail: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMenu, 
  isSelling, 
  onReset,
  onOpenLeaderboard,
  onOpenAuth,
  userEmail,
}) => {
  const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-3 border-b-2 border-amber-300 shadow-xs">
      {/* Left: Menu Toggle + Brand */}
      <div className="flex items-center gap-2.5">
        <button
          id="btn-open-sidebar"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="p-2 rounded-xl text-slate-700 hover:text-red-600 hover:bg-amber-100/60 active:scale-95 transition-all border border-amber-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
        >
          <Menu className="w-5 h-5 text-red-600" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/25 border border-yellow-300">
            <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-slate-900 tracking-tight">
                Data<span className="text-red-600">Sell</span>
              </span>
              {isSelling && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-red-700 border border-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                  LIVE
                </span>
              )}
            </div>
            <span className="text-[10px] text-amber-800 font-bold">5G Ultra Network</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Top 10 High Earners button */}
        <button
          id="btn-header-leaderboard"
          onClick={onOpenLeaderboard}
          title="Top 1 to 10 High Earners"
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 text-red-950 border border-amber-400 text-xs font-black transition-all active:scale-95 cursor-pointer shadow-xs min-h-[44px]"
        >
          <Trophy className="w-3.5 h-3.5 text-red-600 fill-yellow-400 shrink-0" />
          <span className="text-[11px] font-black tracking-tight">Top 10</span>
        </button>

        {/* User Account / Profile */}
        <button
          id="btn-header-auth"
          onClick={onOpenAuth}
          title="User Account & Security"
          className="w-10 h-10 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-slate-700 transition-all flex items-center justify-center font-bold text-xs active:scale-95 cursor-pointer min-h-[44px] min-w-[44px] shadow-xs"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-yellow-200 text-xs font-black shadow-xs border border-yellow-300/40">
            {avatarLetter}
          </span>
        </button>

        {/* Quick Reset to 0 start */}
        <button
          id="btn-quick-reset"
          onClick={onReset}
          title="Reset to 0"
          className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-amber-100/50 border border-amber-200 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
