import React from 'react';
import { 
  LayoutGrid, 
  User, 
  CreditCard, 
  History, 
  Send, 
  FileText, 
  HelpCircle, 
  LogOut,
  X,
  Trophy,
  Shield,
  QrCode,
  Wifi,
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
  telegramLink = 'https://t.me/datasell_official',
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
    { id: 'dashboard' as AppView, label: 'Dashboard & Selling', icon: LayoutGrid },
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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-xs bg-white border-r border-slate-200 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200 text-slate-800">
        {/* User Identity Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-br from-indigo-50/60 via-slate-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div 
              onClick={handleDrawerSecretTap}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Data<span className="text-indigo-600">Sell</span></h3>
                <span className="text-[10px] text-slate-500 font-medium">Bandwidth Exchange</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3 cursor-pointer hover:border-indigo-300 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {avatarLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{userEmail || 'Active User'}</p>
              <span className="text-[10px] text-emerald-600 font-bold">● Active Node</span>
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
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Official Telegram Link */}
          <div className="pt-3 border-t border-slate-200 mt-2">
            <a
              href={telegramLink}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 transition-all min-h-[44px]"
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span>Official Telegram Channel</span>
            </a>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            id="btn-drawer-logout"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-extrabold cursor-pointer transition-all shadow-xs min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Lock App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
