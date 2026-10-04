import React from 'react';
import { 
  LayoutGrid, 
  User, 
  CreditCard, 
  History, 
  FileText, 
  HelpCircle, 
  LogOut,
  X,
  Trophy,
  Shield,
  QrCode,
  Flame,
  Sparkles
} from 'lucide-react';
import { AppView } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  userEmail: string;
  onLogout: () => void;
  onOpenAuth: () => void;
  telegramLink?: string;
  onOpenAdmin?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  onSelectView,
  userEmail,
  onLogout,
  onOpenAuth,
  onOpenAdmin,
}) => {
  if (!isOpen) return null;

  const [drawerTapCount, setDrawerTapCount] = React.useState(0);
  const drawerTapTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleDrawerSecretTap = () => {
    setDrawerTapCount((prev) => {
      const next = prev + 1;
      if (drawerTapTimerRef.current) clearTimeout(drawerTapTimerRef.current);

      drawerTapTimerRef.current = setTimeout(() => {
        setDrawerTapCount(0);
      }, 3500);

      if (next >= 10) {
        setDrawerTapCount(0);
        if (drawerTapTimerRef.current) clearTimeout(drawerTapTimerRef.current);
        onClose();
        if (onOpenAdmin) {
          onOpenAdmin();
        }
      }

      return next;
    });
  };

  const navItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard & Monetization', icon: LayoutGrid },
    { id: 'deposit' as AppView, label: 'Deposit (QR Scanner)', icon: QrCode },
    { id: 'withdraw' as AppView, label: 'Withdraw Payout', icon: CreditCard },
    { id: 'history' as AppView, label: 'Withdrawal Statements', icon: History },
    { id: 'leaderboard' as AppView, label: 'Top 10 High Earners', icon: Trophy },
    { id: 'profile' as AppView, label: 'User Profile & Settings', icon: User },
    { id: 'support' as AppView, label: '24/7 Priority Support', icon: HelpCircle },
    { id: 'terms' as AppView, label: 'Terms & Conditions', icon: FileText },
  ];

  const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer content in Red & Gold Theme */}
      <div className="relative w-4/5 max-w-xs bg-white border-r-2 border-amber-300 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200 text-slate-800">
        {/* User Identity Header */}
        <div className="p-5 border-b-2 border-amber-200 bg-gradient-to-br from-amber-50/80 via-red-50/40 to-white">
          <div className="flex items-center justify-between mb-4">
            <div 
              onClick={handleDrawerSecretTap}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white font-black shadow-md border border-yellow-300">
                <Flame className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Data<span className="text-red-600">Sell</span></h3>
                <span className="text-[10px] text-amber-800 font-bold">5G Ultra Network</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-amber-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div 
            onClick={() => {
              onSelectView('profile');
              onClose();
            }}
            className="p-3 rounded-2xl bg-white border-2 border-amber-300 shadow-xs flex items-center gap-3 cursor-pointer hover:border-red-400 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 text-yellow-200 flex items-center justify-center font-black text-xs shadow-xs border border-yellow-300">
              {avatarLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{userEmail || 'Active User'}</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Active Node
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-amber-100 text-red-950 border border-amber-400 shadow-xs font-black'
                    : 'text-slate-700 hover:text-red-600 hover:bg-amber-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            id="btn-drawer-logout"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-extrabold cursor-pointer transition-all shadow-xs min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Lock App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
