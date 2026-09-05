import React from 'react';
import { Menu, RefreshCw, Trophy, Shield, User } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-3 sm:px-4 py-2.5 border-b border-slate-100 shadow-xs">
      <div className="flex items-center gap-2">
        <button
          id="btn-open-sidebar"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>DataSell</span>
            {isSelling && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Top 10 Leaderboard quick button */}
        <button
          id="btn-header-leaderboard"
          onClick={onOpenLeaderboard}
          title="Top 1 to 10 High Earners"
          className="flex items-center gap-1 py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 text-xs font-bold transition-all active:scale-95"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span className="hidden sm:inline">Top 10</span>
        </button>

        {/* Login/User Switch */}
        <button
          id="btn-header-auth"
          onClick={onOpenAuth}
          title="Login or Switch User"
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all text-xs flex items-center gap-1"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Reset button */}
        <button
          id="btn-quick-reset"
          onClick={onReset}
          title="Reset to 0 start"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all text-xs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

