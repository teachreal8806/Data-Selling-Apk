import React from 'react';
import { Home, QrCode, CreditCard, Trophy, User } from 'lucide-react';
import { AppView } from '../types';

interface BottomNavBarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, onSelectView }) => {
  const tabs = [
    { id: 'dashboard' as AppView, label: 'Home', icon: Home },
    { id: 'deposit' as AppView, label: 'Deposit', icon: QrCode },
    { id: 'withdraw' as AppView, label: 'Withdraw', icon: CreditCard },
    { id: 'leaderboard' as AppView, label: 'Top 10', icon: Trophy },
    { id: 'profile' as AppView, label: 'Account', icon: User },
  ];

  return (
    <nav 
      aria-label="Primary mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
    >
      <div className="grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectView(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 select-none cursor-pointer relative min-h-[48px] ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 active:scale-95'
              }`}
            >
              {/* Active subtle pill behind icon */}
              {isActive && (
                <span className="absolute inset-x-2 inset-y-1 bg-indigo-50 rounded-xl border border-indigo-100/80 pointer-events-none -z-10" />
              )}

              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-indigo-600' : 'text-slate-500'
                }`}
              />
              <span
                className={`text-[10px] tracking-tight mt-1 transition-all ${
                  isActive ? 'font-bold text-indigo-600' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
