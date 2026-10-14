import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Wallet, 
  ArrowDownToLine, 
  Trophy, 
  ShieldCheck, 
  Search, 
  Edit3, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Smartphone, 
  Globe, 
  Clock, 
  DollarSign, 
  Check, 
  Copy, 
  Sparkles,
  Lock,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Send,
  LifeBuoy,
  QrCode,
  ExternalLink,
  LogOut,
  MessageSquare,
  AlertCircle,
  Settings,
  Zap,
  TrendingUp,
  CreditCard,
  Tv,
  CheckCircle,
  HelpCircle,
  Shield,
  Filter
} from 'lucide-react';
import { 
  UserAccount, 
  WithdrawalRecord, 
  TopEarner, 
  AuthLog, 
  DepositRecord,
  SupportConfig,
  SupportTicket,
  DepositGatewayConfig,
  SystemConfig
} from '../types';
import { formatDateTime } from '../utils';
import { AdminLogin } from './AdminLogin';
import { api } from '../api';

interface AdminPanelProps {
  onBackToUserView: () => void;
  users: UserAccount[];
  onUpdateUsers: (users: UserAccount[]) => void;
  withdrawals: WithdrawalRecord[];
  onUpdateWithdrawals: (records: WithdrawalRecord[]) => void;
  topEarners: TopEarner[];
  onUpdateTopEarners: (earners: TopEarner[]) => void;
  authLogs: AuthLog[];
  onClearLogs?: () => void;
  deposits: DepositRecord[];
  onAddDeposit: (record: DepositRecord) => void;
  onUpdateDeposits?: (deposits: DepositRecord[]) => void;
  supportConfig?: SupportConfig;
  onUpdateSupportConfig?: (config: SupportConfig) => void;
  supportTickets?: SupportTicket[];
  onUpdateTickets?: (tickets: SupportTicket[]) => void;
  depositConfig?: DepositGatewayConfig;
  onUpdateDepositConfig?: (config: DepositGatewayConfig) => void;
  systemConfig?: SystemConfig;
  onUpdateSystemConfig?: (config: SystemConfig) => void;
}

type AdminTab = 'users' | 'deposits' | 'withdrawals' | 'leaderboard' | 'logs' | 'support' | 'settings';

const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  sellingSpeedMs: 4500, // Slow, realistic bandwidth streaming as requested
  mbPerPacketMin: 0.15,
  mbPerPacketMax: 0.45,
  ratePerMb: 1.00,
  broadcastNotice: '',
  adRewardAmount: 5.00,
  dailyAdLimit: 10,
};

const DEFAULT_SUPPORT_CONFIG: SupportConfig = {
  whatsappNumber: '+91 9823537634',
  email: 'techreal8806@gmail.com',
  telegramLink: '',
  telegramHandle: '',
  notice: '24/7 Priority desk for withdrawals, verification deposits, and bandwidth support.',
};

const DEFAULT_DEPOSIT_CONFIG: DepositGatewayConfig = {
  upiId: 'techreal8806@oksbi',
  payeeName: 'DataSell Real Tech',
  minDeposit: 100,
  allowDirectDeposit: true,
  instructions: 'Scan QR with PhonePe, Google Pay, or Paytm. Enter exact UTR to credit balance.',
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToUserView,
  users,
  onUpdateUsers,
  withdrawals,
  onUpdateWithdrawals,
  topEarners,
  onUpdateTopEarners,
  authLogs,
  onClearLogs,
  deposits,
  onAddDeposit,
  onUpdateDeposits,
  supportConfig = DEFAULT_SUPPORT_CONFIG,
  onUpdateSupportConfig,
  supportTickets = [],
  onUpdateTickets,
  depositConfig = DEFAULT_DEPOSIT_CONFIG,
  onUpdateDepositConfig,
  systemConfig = DEFAULT_SYSTEM_CONFIG,
  onUpdateSystemConfig,
}) => {
  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('datasell_admin_session') === 'true';
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'blocked' | 'pending' | 'ads_paid' | 'fee_paid' | 'turbo_paid'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  
  // New/Edit Earner Modal State
  const [editingEarner, setEditingEarner] = useState<TopEarner | null>(null);

  // Deposit Form State (Manual Credit)
  const [depositUserId, setDepositUserId] = useState<string>(users[0]?.id || '');
  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [depositType, setDepositType] = useState<'ADMIN_CREDIT' | 'UPI_DEPOSIT' | 'PROMO_BONUS'>('ADMIN_CREDIT');
  const [depositNote, setDepositNote] = useState<string>('Administrative manual balance credit');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  // Editable Gateway Config Form
  const [editUpiId, setEditUpiId] = useState(depositConfig.upiId);
  const [editPayeeName, setEditPayeeName] = useState(depositConfig.payeeName);
  const [editMinDeposit, setEditMinDeposit] = useState(depositConfig.minDeposit.toString());
  const [editQrImageUrl, setEditQrImageUrl] = useState(depositConfig.qrImageUrl || '');
  const [gatewaySavedNotice, setGatewaySavedNotice] = useState(false);

  // Editable Support / Telegram Form
  const [editTelegramLink, setEditTelegramLink] = useState(supportConfig.telegramLink);
  const [editTelegramHandle, setEditTelegramHandle] = useState(supportConfig.telegramHandle);
  const [editWhatsApp, setEditWhatsApp] = useState(supportConfig.whatsappNumber);
  const [editSupportEmail, setEditSupportEmail] = useState(supportConfig.email);
  const [editSupportNotice, setEditSupportNotice] = useState(supportConfig.notice);
  const [supportSavedNotice, setSupportSavedNotice] = useState(false);

  // Editable System Speed & Rates Form
  const [editSpeedMs, setEditSpeedMs] = useState(systemConfig.sellingSpeedMs.toString());
  const [editRatePerMb, setEditRatePerMb] = useState(systemConfig.ratePerMb.toString());
  const [editAdReward, setEditAdReward] = useState(systemConfig.adRewardAmount.toString());
  const [editBroadcastNotice, setEditBroadcastNotice] = useState(systemConfig.broadcastNotice || '');
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);
  const [isSyncingLive, setIsSyncingLive] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'ads_199' | 'withdrawal_99' | 'turbo_99' | 'deposits'>('all');

  // Synchronize all data across all mobile devices
  const handleSyncLive = async () => {
    setIsSyncingLive(true);
    try {
      const data = await api.getAdminAllData();
      if (data) {
        if (data.users) onUpdateUsers(data.users);
        if (data.withdrawals) onUpdateWithdrawals(data.withdrawals);
        if (data.deposits && onUpdateDeposits) onUpdateDeposits(data.deposits);
        if (data.topEarners) onUpdateTopEarners(data.topEarners);
        if (data.systemConfig && onUpdateSystemConfig) onUpdateSystemConfig(data.systemConfig);
        if (data.depositConfig && onUpdateDepositConfig) onUpdateDepositConfig(data.depositConfig);
        if (data.supportConfig && onUpdateSupportConfig) onUpdateSupportConfig(data.supportConfig);
        if (data.supportTickets && onUpdateTickets) onUpdateTickets(data.supportTickets);
      }
    } catch (err) {
      console.error('Error syncing live data', err);
    } finally {
      setTimeout(() => setIsSyncingLive(false), 400);
    }
  };

  // Periodic auto-sync every 4s to track signups & withdrawals from all mobiles in real-time
  React.useEffect(() => {
    if (!isAdminAuthenticated) return;
    handleSyncLive();
    const interval = setInterval(handleSyncLive, 4000);
    return () => clearInterval(interval);
  }, [isAdminAuthenticated]);

  if (!isAdminAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => setIsAdminAuthenticated(true)}
        onCancel={onBackToUserView}
      />
    );
  }

  const handleAdminLogout = () => {
    sessionStorage.removeItem('datasell_admin_session');
    setIsAdminAuthenticated(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // User Management Handlers
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const cleanUser: UserAccount = {
      ...editingUser,
      balance: parseFloat(editingUser.balance as any) || 0,
      totalSoldMB: parseFloat(editingUser.totalSoldMB as any) || 0,
      withdrawalCount: parseInt(editingUser.withdrawalCount as any) || 0,
    };

    const updated = users.map((u) => 
      u.id === cleanUser.id || (u.email && cleanUser.email && u.email.toLowerCase() === cleanUser.email.toLowerCase())
        ? cleanUser 
        : u
    );
    onUpdateUsers(updated);
    await api.updateUser(cleanUser);
    setEditingUser(null);
  };

  const handleQuickAdjustBalance = async (user: UserAccount, delta: number) => {
    const newBal = Math.max(0, parseFloat((user.balance + delta).toFixed(2)));
    const updated = users.map((u) => (u.id === user.id ? { ...u, balance: newBal } : u));
    onUpdateUsers(updated);
    await api.updateUser({ id: user.id, email: user.email, balance: newBal });
  };

  const handleToggleUserStatus = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const nextStatus: 'ACTIVE' | 'BLOCKED' = target.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, status: nextStatus };
      }
      return u;
    });
    onUpdateUsers(updated);
    await api.updateUser({ id: userId, email: target.email, status: nextStatus });
  };

  const handleToggleUserDepositReq = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const nextVal = !target.requireDepositBeforeWithdrawal;
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { 
          ...u, 
          requireDepositBeforeWithdrawal: nextVal, 
          requiredDepositAmount: u.requiredDepositAmount || 200,
          hasCompletedRequiredDeposit: false,
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    await api.updateUser({ 
      id: userId, 
      email: target.email, 
      requireDepositBeforeWithdrawal: nextVal, 
      requiredDepositAmount: target.requiredDepositAmount || 200,
      hasCompletedRequiredDeposit: false 
    });
  };

  // 1-Click Feature Toggles from User Row
  const handleToggleUserFeature = async (
    user: UserAccount, 
    feature: 'ads' | 'fee' | 'turbo'
  ) => {
    let updatePayload: Partial<UserAccount> = {};
    let nextUsers = users.map((u) => {
      if (u.id === user.id) {
        if (feature === 'ads') {
          const nextVal = !u.hasPaidAdsActivation;
          updatePayload = { hasPaidAdsActivation: nextVal, adsActivationPending: false };
          return { ...u, hasPaidAdsActivation: nextVal, adsActivationPending: false };
        }
        if (feature === 'fee') {
          const nextVal = !u.hasPaidWithdrawalFee;
          updatePayload = { hasPaidWithdrawalFee: nextVal, withdrawalFeePending: false };
          return { ...u, hasPaidWithdrawalFee: nextVal, withdrawalFeePending: false };
        }
        if (feature === 'turbo') {
          const nextVal = !u.hasPaidSpeedTurbo;
          updatePayload = { hasPaidSpeedTurbo: nextVal, speedTurboPending: false };
          return { ...u, hasPaidSpeedTurbo: nextVal, speedTurboPending: false };
        }
      }
      return u;
    });

    onUpdateUsers(nextUsers);
    await api.updateUser({ id: user.id, email: user.email, ...updatePayload });
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onUpdateUsers(users.filter((u) => u.id !== userId));
      await api.deleteUser(userId);
    }
  };

  // User Deposit Approval & Rejection Handlers
  const handleApproveUserDeposit = async (deposit: DepositRecord) => {
    const isAds = deposit.amount === 199 || (deposit.note && deposit.note.toLowerCase().includes('ads'));
    const isWithdrawalFee = deposit.amount === 99 && (deposit.note && deposit.note.toLowerCase().includes('withdrawal'));
    const isSpeedTurbo = deposit.amount === 99 && (deposit.note && (deposit.note.toLowerCase().includes('speed') || deposit.note.toLowerCase().includes('turbo')));

    // 1. Credit balance or unlock appropriate feature
    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === deposit.userEmail.toLowerCase()) {
        return {
          ...u,
          balance: (!isAds && !isWithdrawalFee && !isSpeedTurbo)
            ? parseFloat((u.balance + deposit.amount).toFixed(2))
            : u.balance,
          hasPaidAdsActivation: isAds ? true : u.hasPaidAdsActivation,
          adsActivationPending: isAds ? false : u.adsActivationPending,
          adsActivationUtr: isAds ? deposit.utrNumber : u.adsActivationUtr,
          hasPaidWithdrawalFee: isWithdrawalFee ? true : u.hasPaidWithdrawalFee,
          withdrawalFeePending: isWithdrawalFee ? false : u.withdrawalFeePending,
          withdrawalFeeUtr: isWithdrawalFee ? deposit.utrNumber : u.withdrawalFeeUtr,
          hasPaidSpeedTurbo: isSpeedTurbo ? true : u.hasPaidSpeedTurbo,
          speedTurboPending: isSpeedTurbo ? false : u.speedTurboPending,
          speedTurboUtr: isSpeedTurbo ? deposit.utrNumber : u.speedTurboUtr,
          hasCompletedRequiredDeposit: true,
        };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);

    // 2. Mark deposit COMPLETED
    if (onUpdateDeposits) {
      onUpdateDeposits(
        deposits.map((d) => (d.id === deposit.id ? { ...d, status: 'COMPLETED' } : d))
      );
    }

    await api.updateDeposit({ id: deposit.id, status: 'COMPLETED' });
    const targetUser = updatedUsers.find((u) => u.email.toLowerCase() === deposit.userEmail.toLowerCase());
    if (targetUser) {
      await api.updateUser(targetUser);
    }
  };

  const handleRejectUserDeposit = async (depositId: string) => {
    const deposit = deposits.find((d) => d.id === depositId);
    if (onUpdateDeposits) {
      onUpdateDeposits(
        deposits.map((d) => (d.id === depositId ? { ...d, status: 'REJECTED' } : d))
      );
    }
    await api.updateDeposit({ id: depositId, status: 'REJECTED' });

    if (deposit) {
      const isAds = deposit.amount === 199 || (deposit.note && deposit.note.toLowerCase().includes('ads'));
      const isWithdrawalFee = deposit.amount === 99 && (deposit.note && deposit.note.toLowerCase().includes('withdrawal'));
      const isSpeedTurbo = deposit.amount === 99 && (deposit.note && (deposit.note.toLowerCase().includes('speed') || deposit.note.toLowerCase().includes('turbo')));

      const updatedUsers = users.map((u) => {
        if (u.email && deposit.userEmail && u.email.toLowerCase() === deposit.userEmail.toLowerCase()) {
          return {
            ...u,
            adsActivationPending: isAds ? false : u.adsActivationPending,
            withdrawalFeePending: isWithdrawalFee ? false : u.withdrawalFeePending,
            speedTurboPending: isSpeedTurbo ? false : u.speedTurboPending,
          };
        }
        return u;
      });
      onUpdateUsers(updatedUsers);
      const targetUser = updatedUsers.find((u) => u.email && deposit.userEmail && u.email.toLowerCase() === deposit.userEmail.toLowerCase());
      if (targetUser) {
        await api.updateUser(targetUser);
      }
    }
  };

  const handleSaveGatewayConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateDepositConfig) return;
    const minD = parseFloat(editMinDeposit) || 100;
    const newCfg: DepositGatewayConfig = {
      upiId: editUpiId.trim(),
      payeeName: editPayeeName.trim(),
      minDeposit: minD,
      allowDirectDeposit: true,
      qrImageUrl: editQrImageUrl.trim(),
      instructions: depositConfig.instructions,
    };
    onUpdateDepositConfig(newCfg);
    setGatewaySavedNotice(true);
    setTimeout(() => setGatewaySavedNotice(false), 3000);
  };

  const handleSaveSupportConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateSupportConfig) return;
    const newCfg: SupportConfig = {
      whatsappNumber: editWhatsApp.trim(),
      email: editSupportEmail.trim(),
      telegramLink: editTelegramLink.trim(),
      telegramHandle: editTelegramHandle.trim(),
      notice: editSupportNotice.trim(),
    };
    onUpdateSupportConfig(newCfg);
    setSupportSavedNotice(true);
    setTimeout(() => setSupportSavedNotice(false), 3000);
  };

  const handleResolveTicket = (ticketId: string) => {
    if (onUpdateTickets) {
      onUpdateTickets(
        supportTickets.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' } : t))
      );
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (onUpdateTickets) {
      onUpdateTickets(supportTickets.filter((t) => t.id !== ticketId));
    }
  };

  // Deposit Handler
  const handleCreateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(depositAmount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const targetUser = users.find((u) => u.id === depositUserId);
    if (!targetUser) return;

    const newDeposit: DepositRecord = {
      id: 'dep_' + Date.now(),
      userId: targetUser.id,
      userEmail: targetUser.email,
      amount: numAmount,
      type: depositType,
      note: depositNote,
      time: formatDateTime(new Date()),
      status: 'COMPLETED',
    };

    // Credit user's balance
    const updatedUsers = users.map((u) => {
      if (u.id === targetUser.id) {
        return {
          ...u,
          balance: parseFloat((u.balance + numAmount).toFixed(2)),
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    onAddDeposit(newDeposit);
    api.creditUser({
      userId: targetUser.id,
      amount: numAmount,
      type: depositType,
      note: depositNote,
    });
    setDepositSuccessMsg(`Successfully credited ₹${numAmount.toFixed(2)} to ${targetUser.email}!`);
    setTimeout(() => setDepositSuccessMsg(null), 4000);
  };

  // Withdrawal Handlers
  const handleApproveWithdrawal = async (id: string) => {
    const generatedRrn = `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const rrn = prompt('Enter Bank / UPI Settlement RRN Reference:', generatedRrn) || generatedRrn;

    onUpdateWithdrawals(
      withdrawals.map((w) => (w.id === id ? { ...w, status: 'SUCCESSFUL', bankReference: rrn } : w))
    );

    await api.updateWithdrawal({
      id,
      status: 'SUCCESSFUL',
      bankReference: rrn,
    });
  };

  const handleRejectWithdrawal = async (record: WithdrawalRecord) => {
    const reason = prompt('Enter reason for rejection (balance will be refunded to user):', 'Invalid UPI ID or Bank Server Timeout');
    if (reason === null) return;

    // Refund balance to user if matched
    if (record.userEmail) {
      onUpdateUsers(
        users.map((u) => {
          if (u.email.toLowerCase() === record.userEmail?.toLowerCase()) {
            return {
              ...u,
              balance: parseFloat((u.balance + record.amount).toFixed(2)),
            };
          }
          return u;
        })
      );
    }

    onUpdateWithdrawals(
      withdrawals.map((w) =>
        w.id === record.id
          ? { ...w, status: 'REJECTED', rejectionReason: reason }
          : w
      )
    );

    await api.updateWithdrawal({
      id: record.id,
      status: 'REJECTED',
      rejectionReason: reason,
    });
  };

  // Save Data Selling Speed, Rate, and Global Broadcast Notice
  const handleSaveSystemSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const speed = parseInt(editSpeedMs, 10) || 4500;
    const rate = parseFloat(editRatePerMb) || 1.00;
    const adReward = parseFloat(editAdReward) || 5.00;

    const newConfig: SystemConfig = {
      sellingSpeedMs: speed,
      mbPerPacketMin: speed >= 5000 ? 0.10 : 0.15,
      mbPerPacketMax: speed >= 5000 ? 0.30 : 0.45,
      ratePerMb: rate,
      broadcastNotice: editBroadcastNotice.trim(),
      adRewardAmount: adReward,
      dailyAdLimit: 10,
    };

    if (onUpdateSystemConfig) {
      onUpdateSystemConfig(newConfig);
    }

    await api.updateSystemConfig({ systemConfig: newConfig });
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // Leaderboard Control Handlers
  const handleSaveEarner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEarner) return;

    const exists = topEarners.some((te) => te.id === editingEarner.id);
    let updated: TopEarner[];
    if (exists) {
      updated = topEarners.map((te) => (te.id === editingEarner.id ? editingEarner : te));
    } else {
      updated = [...topEarners, editingEarner];
    }
    updated.sort((a, b) => a.rank - b.rank);
    onUpdateTopEarners(updated);
    setEditingEarner(null);
  };

  const handleDeleteEarner = (id: string) => {
    onUpdateTopEarners(topEarners.filter((te) => te.id !== id));
  };

  // Computed summary stats
  const totalBalanceInCirculation = users.reduce((acc, u) => acc + u.balance, 0);
  const totalMBSoldAll = users.reduce((acc, u) => acc + u.totalSoldMB, 0);
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'PENDING').length;
  const pendingDepositsCount = deposits.filter((d) => d.status === 'PENDING').length;
  const activeUsersCount = users.filter((u) => u.status === 'ACTIVE').length;

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/3 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-br from-amber-500/10 via-red-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[350px] bg-red-600/5 blur-3xl pointer-events-none" />

      {/* Top Luxury Navbar / Command Header */}
      <header className="sticky top-0 z-40 bg-[#0B0E17]/95 border-b border-amber-500/20 px-4 sm:px-6 py-3 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToUserView}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-amber-500/20 hover:to-red-500/20 text-slate-200 hover:text-amber-300 text-xs font-bold border border-slate-700/80 hover:border-amber-400/50 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>App View</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-red-600 p-[1px] shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#0A0D15] rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black tracking-wider text-white uppercase">
                  DataSell Master Command
                </h1>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  ROOT v3.2
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Central Cloud Engine • Real-time Sync Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {supportConfig.telegramLink && (
            <a
              href={supportConfig.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold transition-all shadow-xs"
              title="Open Official Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>
          )}

          <button
            onClick={handleSyncLive}
            title="Sync all connected mobiles in real-time"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-red-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-red-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin text-amber-200' : ''}`} />
            <span className="hidden sm:inline">Sync Fleet</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-800 hover:border-rose-800/60 text-xs font-semibold transition-all cursor-pointer"
            title="Lock Admin Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </header>

      {/* Ultra-Luxury Executive KPI Strip */}
      <div className="relative z-10 bg-[#0A0D15]/80 border-b border-amber-500/15 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Fleet Accounts */}
          <div className="relative overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#131724] to-[#0D101A] border border-amber-500/20 shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-amber-400/90">
                Connected Fleet
              </span>
              <Users className="w-4 h-4 text-amber-400/80" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white mt-1 tabular-nums">
              {users.length} <span className="text-xs font-normal text-slate-400">Users</span>
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <span>{activeUsersCount} active</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{users.length - activeUsersCount} blocked</span>
            </div>
          </div>

          {/* Card 2: Balances in Circulation */}
          <div className="relative overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#131724] to-[#0D101A] border border-amber-500/20 shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-emerald-400/90">
                Circulating Balance
              </span>
              <Wallet className="w-4 h-4 text-emerald-400/80" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-1 font-mono tabular-nums">
              ₹{totalBalanceInCirculation.toFixed(2)}
            </p>
            <div className="mt-1 text-[11px] text-slate-400 font-medium truncate">
              Across all user app wallets
            </div>
          </div>

          {/* Card 3: Pending Payouts & UTRs */}
          <div className="relative overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#131724] to-[#0D101A] border border-amber-500/20 shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-amber-400/90">
                Action Required
              </span>
              <CreditCard className="w-4 h-4 text-amber-400/80" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-300 mt-1 tabular-nums flex items-center gap-2">
              <span>{pendingWithdrawalsCount + pendingDepositsCount}</span>
              {(pendingWithdrawalsCount > 0 || pendingDepositsCount > 0) && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  NEEDS REVIEW
                </span>
              )}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>{pendingWithdrawalsCount} Payouts</span>
              <span className="text-slate-600">·</span>
              <span>{pendingDepositsCount} UTR Approvals</span>
            </div>
          </div>

          {/* Card 4: Bandwidth Sold */}
          <div className="relative overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#131724] to-[#0D101A] border border-amber-500/20 shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-rose-400/90">
                Bandwidth Streamed
              </span>
              <Activity className="w-4 h-4 text-rose-400/80" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white mt-1 font-mono tabular-nums">
              {totalMBSoldAll >= 1000 ? `${(totalMBSoldAll / 1024).toFixed(2)} GB` : `${totalMBSoldAll.toFixed(1)} MB`}
            </p>
            <div className="mt-1 text-[11px] text-slate-400 font-medium">
              Rate: ₹{systemConfig.ratePerMb.toFixed(2)} / 1 MB
            </div>
          </div>
        </div>
      </div>

      {/* Modern Executive Navigation Tabs Bar */}
      <div className="sticky top-[57px] z-30 bg-[#090C14]/90 border-b border-amber-500/20 px-4 sm:px-6 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Users Control</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono text-amber-200 border border-amber-500/30">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('deposits')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'deposits'
                ? 'bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span>Payment & UTR Desk</span>
            {pendingDepositsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-amber-500/30 text-[10px] font-bold text-amber-300 border border-amber-400/50 animate-pulse">
                {pendingDepositsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-amber-400" />
            <span>Withdrawals Desk</span>
            {pendingWithdrawalsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-rose-500/30 text-[10px] font-bold text-rose-300 border border-rose-400/50 animate-pulse">
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Earners Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Audit & Login Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'support'
                ? 'bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
            <span>Support Desk</span>
            {supportTickets.filter((t) => t.status === 'NEW').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/30 text-[10px] font-bold text-emerald-300 border border-emerald-400/50">
                {supportTickets.filter((t) => t.status === 'NEW').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Speed & Master Config</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-5">
        {/* ==================== TAB 1: USERS CONTROL ==================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-gradient-to-b from-[#121624] to-[#0A0D15] p-4 rounded-2xl border border-amber-500/20 shadow-lg">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/70" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone number, or UPI ID..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B12] border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all font-medium"
                />
              </div>

              {/* Quick Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setUserFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    userFilter === 'all'
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  onClick={() => setUserFilter('active')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    userFilter === 'active'
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Active ({users.filter((u) => u.status === 'ACTIVE').length})
                </button>
                <button
                  onClick={() => setUserFilter('blocked')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    userFilter === 'blocked'
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Blocked ({users.filter((u) => u.status === 'BLOCKED').length})
                </button>
                <button
                  onClick={() => setUserFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    userFilter === 'pending'
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                      : 'bg-slate-900 text-amber-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Pending UTRs ({users.filter((u) => u.adsActivationPending || u.withdrawalFeePending || u.speedTurboPending).length})
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#101422] to-[#0A0D15] shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#090C14] text-slate-400 font-bold tracking-wider uppercase text-[10px]">
                    <th className="p-3.5">User Identity & Contact</th>
                    <th className="p-3.5">Wallet Balance (₹)</th>
                    <th className="p-3.5">Bandwidth Sold</th>
                    <th className="p-3.5">Feature Unlocks (1-Click)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Deposit Gate</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {users
                    .filter((u) => {
                      const matchSearch =
                        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.phone.includes(searchQuery) ||
                        (u.savedUpiId && u.savedUpiId.toLowerCase().includes(searchQuery.toLowerCase()));

                      if (!matchSearch) return false;
                      if (userFilter === 'active') return u.status === 'ACTIVE';
                      if (userFilter === 'blocked') return u.status === 'BLOCKED';
                      if (userFilter === 'pending') return u.adsActivationPending || u.withdrawalFeePending || u.speedTurboPending;
                      if (userFilter === 'ads_paid') return u.hasPaidAdsActivation;
                      if (userFilter === 'fee_paid') return u.hasPaidWithdrawalFee;
                      if (userFilter === 'turbo_paid') return u.hasPaidSpeedTurbo;
                      return true;
                    })
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-900/60 transition-colors">
                        {/* User Identity */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-red-600 p-[1px] shrink-0">
                              <div className="w-full h-full bg-[#0D101A] rounded-xl flex items-center justify-center font-bold text-amber-300 text-xs">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white truncate">{user.name}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                  {user.tier || 'BRONZE'}
                                </span>
                              </div>
                              <div className="text-slate-400 font-mono text-[11px] truncate">{user.email}</div>
                              <div className="text-slate-500 text-[10px]">{user.phone}</div>
                              {user.savedUpiId && (
                                <div className="text-amber-400/90 font-mono text-[10px] flex items-center gap-1 mt-0.5">
                                  <span>UPI: {user.savedUpiId}</span>
                                  <button
                                    onClick={() => handleCopy(user.savedUpiId)}
                                    title="Copy UPI"
                                    className="text-slate-500 hover:text-white"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Balance with Quick Adjusters */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span className="font-extrabold text-base text-emerald-400 font-mono tabular-nums block">
                              ₹{user.balance.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickAdjustBalance(user, 100)}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
                                title="Quick add ₹100"
                              >
                                +₹100
                              </button>
                              <button
                                onClick={() => handleQuickAdjustBalance(user, 500)}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
                                title="Quick add ₹500"
                              >
                                +₹500
                              </button>
                              <button
                                onClick={() => handleQuickAdjustBalance(user, -100)}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer"
                                title="Deduct ₹100"
                              >
                                -₹100
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Bandwidth Sold */}
                        <td className="p-3.5 font-mono text-slate-300 tabular-nums">
                          <div className="font-bold">{user.totalSoldMB.toFixed(2)} MB</div>
                          <span className="text-[10px] text-slate-500 font-sans">
                            {user.withdrawalCount || 0} Payouts Done
                          </span>
                        </td>

                        {/* 1-Click Feature Unlocks */}
                        <td className="p-3.5">
                          <div className="flex flex-col gap-1 text-[10px]">
                            {/* Ads ₹199 */}
                            <button
                              onClick={() => handleToggleUserFeature(user, 'ads')}
                              className={`px-2 py-0.5 rounded-md font-bold text-left flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                                user.hasPaidAdsActivation
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : user.adsActivationPending
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                              }`}
                              title="Click to toggle Ads ₹199 activation"
                            >
                              <span>Ads ₹199:</span>
                              <span className="font-mono">
                                {user.hasPaidAdsActivation ? 'PAID ✓' : user.adsActivationPending ? 'PENDING' : 'LOCKED'}
                              </span>
                            </button>

                            {/* Withdrawal Fee ₹99 */}
                            <button
                              onClick={() => handleToggleUserFeature(user, 'fee')}
                              className={`px-2 py-0.5 rounded-md font-bold text-left flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                                user.hasPaidWithdrawalFee
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : user.withdrawalFeePending
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                              }`}
                              title="Click to toggle Withdrawal Fee ₹99 status"
                            >
                              <span>Fee ₹99:</span>
                              <span className="font-mono">
                                {user.hasPaidWithdrawalFee ? 'PAID ✓' : user.withdrawalFeePending ? 'PENDING' : 'LOCKED'}
                              </span>
                            </button>

                            {/* Turbo Speed ₹99 */}
                            <button
                              onClick={() => handleToggleUserFeature(user, 'turbo')}
                              className={`px-2 py-0.5 rounded-md font-bold text-left flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                                user.hasPaidSpeedTurbo
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : user.speedTurboPending
                                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 animate-pulse'
                                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                              }`}
                              title="Click to toggle 5G Turbo Boost status"
                            >
                              <span>Turbo 5G:</span>
                              <span className="font-mono">
                                {user.hasPaidSpeedTurbo ? 'ACTIVE ⚡' : user.speedTurboPending ? 'PENDING' : 'OFF'}
                              </span>
                            </button>
                          </div>
                        </td>

                        {/* Account Status Toggle */}
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                              user.status === 'ACTIVE'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                                : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                            }`}
                          >
                            {user.status || 'ACTIVE'}
                          </button>
                        </td>

                        {/* Deposit Before Withdrawal Gate */}
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleUserDepositReq(user.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all text-left flex flex-col gap-0.5 cursor-pointer border ${
                              user.requireDepositBeforeWithdrawal
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                            title="Click to toggle mandatory deposit requirement"
                          >
                            <span className="font-semibold">
                              {user.requireDepositBeforeWithdrawal ? `₹${user.requiredDepositAmount || 200} Req` : 'Free / Direct'}
                            </span>
                            {user.requireDepositBeforeWithdrawal && (
                              <span className={`text-[9px] font-bold ${user.hasCompletedRequiredDeposit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {user.hasCompletedRequiredDeposit ? 'UNLOCKED' : 'LOCKED'}
                              </span>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingUser(user)}
                              title="Edit Full Profile & Passwords"
                              className="p-2 rounded-xl bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDepositUserId(user.id);
                                setActiveTab('deposits');
                              }}
                              title="Credit Money to Wallet"
                              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete Account"
                              className="p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PAYMENT & UTR DESK ==================== */}
        {activeTab === 'deposits' && (
          <div className="space-y-5">
            {/* Top Gateway Settings Card */}
            <div className="bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 sm:p-6 rounded-3xl border border-amber-500/20 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>UPI ID & QR Scanner Gateway Control</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure the exact UPI ID and Scanner QR code that users scan when making ₹199 / ₹99 activations in the app.
                  </p>
                </div>
                {gatewaySavedNotice && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
                    ✓ Gateway Saved & Live!
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveGatewayConfig} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Admin Official UPI ID <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editUpiId}
                      onChange={(e) => setEditUpiId(e.target.value)}
                      placeholder="techreal8806@oksbi"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-amber-300 font-mono font-bold focus:outline-hidden focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Users will copy or scan this exact UPI ID.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Payee Business / Account Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editPayeeName}
                      onChange={(e) => setEditPayeeName(e.target.value)}
                      placeholder="DataSell Real Tech"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Shown on user's PhonePe/GPay checkout screen.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Minimum Deposit Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editMinDeposit}
                      onChange={(e) => setEditMinDeposit(e.target.value)}
                      placeholder="100"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#080B12] border border-slate-700 text-xs font-bold text-emerald-400 font-mono focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Custom QR Code Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={editQrImageUrl}
                      onChange={(e) => setEditQrImageUrl(e.target.value)}
                      placeholder="https://.../my_upi_qr.png"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Leave blank to auto-generate vector UPI QR.
                    </span>
                  </div>

                  <div className="sm:col-span-2 pt-1">
                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-amber-400/40 uppercase tracking-wider"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save & Apply UPI Scanner Gateway</span>
                    </button>
                  </div>
                </div>

                {/* Gateway Scanner Live Preview */}
                <div className="lg:col-span-1 bg-[#080B12] p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                  <div className="p-2.5 bg-white rounded-xl shadow-md mb-2">
                    {editQrImageUrl ? (
                      <img
                        src={editQrImageUrl}
                        alt="UPI QR Scanner"
                        className="w-24 h-24 object-contain rounded"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          `upi://pay?pa=${editUpiId}&pn=${encodeURIComponent(editPayeeName)}&cu=INR`
                        )}`}
                        alt="Live UPI QR Scanner"
                        className="w-24 h-24 object-contain rounded"
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white truncate max-w-full">
                    {editPayeeName || 'DataSell Real'}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 truncate max-w-full mt-0.5 font-bold">
                    {editUpiId || 'techreal8806@oksbi'}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1">Live user scanner preview</span>
                </div>
              </form>
            </div>

            {/* User Submitted Deposits & Feature Verification Desk */}
            <div className="bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 sm:p-6 rounded-3xl border border-amber-500/20 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Payment Verification & UTR Approvals</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verify UTR submissions for Ads (₹199), Withdrawal Fee (₹99), 5G Turbo Boost (₹99), or Wallet credits.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1 bg-[#080B12] p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'all'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({deposits.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('pending')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'pending'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-amber-400 hover:text-white'
                    }`}
                  >
                    Pending ({pendingDepositsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('ads_199')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'ads_199'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ads ₹199
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('withdrawal_99')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'withdrawal_99'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Fee ₹99
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('turbo_99')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'turbo_99'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Turbo ₹99
                  </button>
                </div>
              </div>

              {/* Deposit List Cards */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {deposits
                  .filter((dep) => {
                    const isAds = dep.amount === 199 || (dep.note && dep.note.toLowerCase().includes('ads'));
                    const isWithdrawal = dep.amount === 99 && (dep.note && dep.note.toLowerCase().includes('withdrawal'));
                    const isTurbo = dep.amount === 99 && (dep.note && (dep.note.toLowerCase().includes('speed') || dep.note.toLowerCase().includes('turbo')));

                    if (paymentFilter === 'pending') return dep.status === 'PENDING';
                    if (paymentFilter === 'ads_199') return isAds;
                    if (paymentFilter === 'withdrawal_99') return isWithdrawal;
                    if (paymentFilter === 'turbo_99') return isTurbo;
                    if (paymentFilter === 'deposits') return !isAds && !isWithdrawal && !isTurbo;
                    return true;
                  })
                  .length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No payment submissions match this filter.
                  </div>
                ) : (
                  deposits
                    .filter((dep) => {
                      const isAds = dep.amount === 199 || (dep.note && dep.note.toLowerCase().includes('ads'));
                      const isWithdrawal = dep.amount === 99 && (dep.note && dep.note.toLowerCase().includes('withdrawal'));
                      const isTurbo = dep.amount === 99 && (dep.note && (dep.note.toLowerCase().includes('speed') || dep.note.toLowerCase().includes('turbo')));

                      if (paymentFilter === 'pending') return dep.status === 'PENDING';
                      if (paymentFilter === 'ads_199') return isAds;
                      if (paymentFilter === 'withdrawal_99') return isWithdrawal;
                      if (paymentFilter === 'turbo_99') return isTurbo;
                      if (paymentFilter === 'deposits') return !isAds && !isWithdrawal && !isTurbo;
                      return true;
                    })
                    .map((dep) => {
                      const isAds = dep.amount === 199 || (dep.note && dep.note.toLowerCase().includes('ads'));
                      const isWithdrawal = dep.amount === 99 && (dep.note && dep.note.toLowerCase().includes('withdrawal'));
                      const isTurbo = dep.amount === 99 && (dep.note && (dep.note.toLowerCase().includes('speed') || dep.note.toLowerCase().includes('turbo')));

                      let purposeBadge = 'WALLET DEPOSIT';
                      let badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
                      if (isAds) {
                        purposeBadge = 'ADS ACTIVATION ₹199';
                        badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';
                      } else if (isWithdrawal) {
                        purposeBadge = 'WITHDRAWAL FEE ₹99';
                        badgeColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
                      } else if (isTurbo) {
                        purposeBadge = '5G TURBO SPEED ₹99';
                        badgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
                      }

                      return (
                        <div
                          key={dep.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            dep.status === 'PENDING'
                              ? 'bg-gradient-to-r from-amber-500/10 via-[#0E121F] to-[#0A0D15] border-amber-400/50 shadow-md'
                              : 'bg-[#080B12] border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-2 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-white text-xs">{dep.userEmail}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${badgeColor}`}>
                                {purposeBadge}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  dep.status === 'COMPLETED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : dep.status === 'PENDING'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {dep.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                              {dep.utrNumber && (
                                <div className="flex items-center gap-1.5 font-mono text-amber-300 font-black bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 rounded-lg">
                                  <span>UTR: {dep.utrNumber}</span>
                                  <button
                                    onClick={() => handleCopy(dep.utrNumber!)}
                                    title="Copy UTR Number"
                                    className="text-amber-400 hover:text-white"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              <span className="text-slate-400 truncate max-w-sm">{dep.note}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{dep.time}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            <span className="text-lg font-black text-amber-400 font-mono tabular-nums">
                              ₹{dep.amount.toFixed(2)}
                            </span>

                            {dep.status === 'PENDING' && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleRejectUserDeposit(dep.id)}
                                  className="py-1.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleApproveUserDeposit(dep)}
                                  className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-black transition-all shadow-md cursor-pointer flex items-center gap-1 border border-amber-400/50 uppercase tracking-wider"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve & Unlock</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* Bottom Grid: Manual Credit Tool */}
            <div className="bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 sm:p-6 rounded-3xl border border-amber-500/20 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Direct Manual Wallet Credit Tool</span>
              </div>
              <p className="text-xs text-slate-400">
                Directly inject real rupees into any user's balance with instant server and mobile APK synchronization.
              </p>

              {depositSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-bold">{depositSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateDeposit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target User</label>
                  <select
                    value={depositUserId}
                    onChange={(e) => setDepositUserId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400 font-medium"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email}) - ₹{u.balance.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Credit Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#080B12] border border-slate-700 text-sm font-black text-emerald-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Credit Type</label>
                  <select
                    value={depositType}
                    onChange={(e) => setDepositType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="ADMIN_CREDIT">Administrative Top-up</option>
                    <option value="UPI_DEPOSIT">Verified UPI Deposit</option>
                    <option value="PROMO_BONUS">Promotional Bonus</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Execute Credit</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: WITHDRAWALS CONTROL ==================== */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 rounded-3xl border border-amber-500/20 shadow-lg">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  Payout Requests & Settlement Desk
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Process real user UPI payouts, copy destination UPI IDs, or reject with automatic wallet balance refund.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                {pendingWithdrawalsCount} PENDING
              </span>
            </div>

            <div className="space-y-3">
              {withdrawals.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No withdrawal requests found.
                </div>
              ) : (
                withdrawals.map((record) => (
                  <div
                    key={record.id}
                    className="bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 rounded-2xl border border-amber-500/20 shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Order:</span>
                        <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          {record.orderNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(record.orderNumber)}
                          className="text-slate-400 hover:text-white"
                          title="Copy Order Number"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-md tracking-wider uppercase ${
                          record.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            : record.status === 'SUCCESSFUL'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Payout Amount</span>
                        <span className="text-lg font-black text-white font-mono tabular-nums">
                          ₹{record.amount.toFixed(2)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">User Email</span>
                        <span className="font-semibold text-slate-200 truncate block">
                          {record.userEmail || 'User'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Destination UPI ID</span>
                        <div className="flex items-center gap-1.5 font-mono text-amber-300 font-bold">
                          <span>{record.upiId}</span>
                          <button
                            onClick={() => handleCopy(record.upiId)}
                            className="text-amber-400 hover:text-white"
                            title="Copy UPI ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Request Time</span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          {record.time}
                        </span>
                      </div>
                    </div>

                    {record.bankReference && (
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono">
                        Bank RRN: {record.bankReference}
                      </div>
                    )}

                    {record.rejectionReason && (
                      <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                        Reason: {record.rejectionReason}
                      </div>
                    )}

                    {/* Pending Action Buttons */}
                    {record.status === 'PENDING' && (
                      <div className="pt-2.5 border-t border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRejectWithdrawal(record)}
                          className="py-1.5 px-3 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 font-bold text-xs transition-all cursor-pointer"
                        >
                          Reject & Refund
                        </button>

                        <button
                          onClick={() => handleApproveWithdrawal(record.id)}
                          className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 border border-amber-400/50 uppercase tracking-wider cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Settle Payout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: TOP 1 TO 10 EARNERS ==================== */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 rounded-3xl border border-amber-500/20 shadow-lg">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Public Leaderboard (Top 10 Earners)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure real or promotional top sellers shown on the public mobile leaderboard.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingEarner({
                    id: 'te_' + Date.now(),
                    rank: topEarners.length + 1,
                    name: 'New Top Earner',
                    city: 'New Delhi',
                    totalEarned: 5000.00,
                    mbSold: 5000.00,
                    verified: true,
                  })
                }
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md border border-amber-400/40 uppercase tracking-wider cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Earner</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#101422] to-[#0A0D15] shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#090C14] text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3.5 w-16">Rank</th>
                    <th className="p-3.5">User Name</th>
                    <th className="p-3.5">City / State</th>
                    <th className="p-3.5">Total Earned (₹)</th>
                    <th className="p-3.5">Data Sold (MB)</th>
                    <th className="p-3.5">Badge</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {topEarners
                    .sort((a, b) => a.rank - b.rank)
                    .map((earner) => (
                      <tr key={earner.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                              earner.rank === 1
                                ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-500/30'
                                : earner.rank === 2
                                ? 'bg-slate-300 text-slate-900'
                                : earner.rank === 3
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            #{earner.rank}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-white">{earner.name}</td>
                        <td className="p-3.5 text-slate-300">{earner.city}</td>
                        <td className="p-3.5 font-mono font-black text-emerald-400 tabular-nums">
                          ₹{earner.totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3.5 font-mono text-slate-300 tabular-nums">
                          {earner.mbSold.toLocaleString()} MB
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              earner.verified
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {earner.verified ? 'VERIFIED ✓' : 'STANDARD'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingEarner(earner)}
                              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                              title="Edit earner"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEarner(earner.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer"
                              title="Delete earner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: AUDIT & AUTH LOGS ==================== */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 rounded-3xl border border-amber-500/20 shadow-lg">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Login & Registration Audit Trail</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete telemetry of user access: Name, Email, IP Address, Device type, and Network status.
                </p>
              </div>

              {onClearLogs && (
                <button
                  onClick={onClearLogs}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#101422] to-[#0A0D15] shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#090C14] text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Event</th>
                    <th className="p-3.5">User Identity</th>
                    <th className="p-3.5">IP Address</th>
                    <th className="p-3.5">Device Platform</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {authLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3.5 font-mono text-slate-400 text-[11px] tabular-nums">
                        {log.timestamp}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            log.type === 'SIGNUP'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{log.userName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{log.userEmail}</div>
                        <div className="text-slate-500 text-[10px]">{log.userPhone}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-blue-400" />
                          <span>{log.ipAddress}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.device}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: SUPPORT & COMMUNITY DESK ==================== */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Telegram Community */}
              <div className="bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 rounded-3xl border border-amber-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Telegram Channel & Group</h3>
                      <p className="text-xs text-slate-400">Configure public community link</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Telegram URL</label>
                    <input
                      type="text"
                      value={editTelegramLink}
                      onChange={(e) => setEditTelegramLink(e.target.value)}
                      placeholder="https://t.me/datasell_official"
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Telegram Display Handle</label>
                    <input
                      type="text"
                      value={editTelegramHandle}
                      onChange={(e) => setEditTelegramHandle(e.target.value)}
                      placeholder="@datasell_official"
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Support Desk */}
              <div className="bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 rounded-3xl border border-amber-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Helpdesk Channels</h3>
                      <p className="text-xs text-slate-400">Direct WhatsApp and email channels</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={editWhatsApp}
                        onChange={(e) => setEditWhatsApp(e.target.value)}
                        placeholder="+91 9823537634"
                        className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={editSupportEmail}
                        onChange={(e) => setEditSupportEmail(e.target.value)}
                        placeholder="techreal8806@gmail.com"
                        className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Support Notice</label>
                    <input
                      type="text"
                      value={editSupportNotice}
                      onChange={(e) => setEditSupportNotice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-b from-[#121624] to-[#0A0D15] p-4 rounded-2xl border border-amber-500/20">
              <span className="text-xs text-slate-400 font-medium">
                {supportSavedNotice ? '✓ Support and Telegram settings applied across all mobiles!' : 'Click save to update support channels.'}
              </span>
              <button
                type="button"
                onClick={handleSaveSupportConfig}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-md transition-all uppercase tracking-wider cursor-pointer"
              >
                Save Support Settings
              </button>
            </div>

            {/* Tickets */}
            <div className="bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 rounded-3xl border border-amber-500/20 shadow-xl space-y-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Customer Support Inquiries ({supportTickets.length})</span>
              </h3>
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
                {supportTickets.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No open support tickets.
                  </div>
                ) : (
                  supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-3.5 bg-[#080B12] border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{ticket.userEmail}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ticket.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300 animate-pulse'}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs">{ticket.message}</p>
                      <div className="flex justify-end gap-2 pt-1 border-t border-slate-800">
                        {ticket.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleResolveTicket(ticket.id)}
                            className="py-1 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold"
                          >
                            Mark Resolved
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: SPEED & MASTER CONTROLS ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gradient-to-b from-[#121624] to-[#0A0D15] p-5 rounded-3xl border border-amber-500/20 shadow-lg">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Bandwidth Streaming Speed & Global Central Controls</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set data selling speed, payout rate per MB, ad rewards, and instant global mobile broadcast announcements.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSyncLive}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin' : ''}`} />
                <span>Sync Mobiles</span>
              </button>
            </div>

            {settingsSavedNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings applied successfully! All connected mobiles updated instantly.</span>
              </div>
            )}

            <form onSubmit={handleSaveSystemSettings} className="bg-gradient-to-b from-[#121624] to-[#0A0D15] p-6 rounded-3xl border border-amber-500/20 shadow-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Selling Speed */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>Data Selling Streaming Speed</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Controls the pace at which packets stream and wallet earnings tick up.
                  </p>
                  <select
                    value={editSpeedMs}
                    onChange={(e) => setEditSpeedMs(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white font-bold focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="6000">Very Slow (6.0 seconds per packet) - Maximum Stability</option>
                    <option value="4500">Slow & Steady (4.5 seconds per packet) - [Recommended]</option>
                    <option value="3000">Moderate (3.0 seconds per packet)</option>
                    <option value="1800">Fast (1.8 seconds per packet)</option>
                  </select>
                </div>

                {/* Network Rate per MB */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Rupee Rate per 1 MB Sold (₹)</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Payout credited per MB transferred (e.g. ₹1.00 = 500MB earns ₹500).
                  </p>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editRatePerMb}
                    onChange={(e) => setEditRatePerMb(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-emerald-400 font-bold font-mono"
                  />
                </div>

                {/* Ad Reward */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sponsored Video Ad Cash Reward (₹)</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Direct cash bonus credited when user watches a video ad in the app.
                  </p>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editAdReward}
                    onChange={(e) => setEditAdReward(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-amber-300 font-bold font-mono"
                  />
                </div>

                {/* Broadcast Notice */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                    <span>Global Mobile Broadcast Announcement Banner</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Pushes a live headline announcement to all user dashboards.
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. Instant automated ₹500 UPI withdrawals live now! Watch ads to boost earnings."
                    value={editBroadcastNotice}
                    onChange={(e) => setEditBroadcastNotice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-black shadow-lg transition-all cursor-pointer flex items-center gap-2 border border-amber-400/40 uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Push Master Controls</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ==================== MODAL 1: EDIT USER MODAL ==================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-gradient-to-b from-[#131726] to-[#0A0D15] border border-amber-500/30 text-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-red-600 p-[1px]">
                  <div className="w-full h-full bg-[#0D101A] rounded-xl flex items-center justify-center font-bold text-amber-300 text-xs">
                    <Edit3 className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Edit User Profile: {editingUser.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{editingUser.email}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Phone Number</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Password (View & Edit)</label>
                  <input
                    type="text"
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Balance Adjuster with Quick Buttons */}
              <div className="p-3.5 rounded-2xl bg-[#080B12] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold">Wallet Balance (₹)</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, balance: Math.max(0, editingUser.balance - 100) })}
                      className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 cursor-pointer font-bold"
                    >
                      -₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, balance: editingUser.balance + 100 })}
                      className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 cursor-pointer font-bold"
                    >
                      +₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, balance: editingUser.balance + 500 })}
                      className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 cursor-pointer font-bold"
                    >
                      +₹500
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="any"
                  required
                  value={editingUser.balance}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, balance: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-black text-amber-300 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Bandwidth Sold (MB)</label>
                  <input
                    type="number"
                    step="any"
                    value={editingUser.totalSoldMB}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, totalSoldMB: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Withdrawals Count</label>
                  <select
                    value={(editingUser.withdrawalCount || 0) === 0 ? '0' : '1'}
                    onChange={(e) => setEditingUser({ ...editingUser, withdrawalCount: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-amber-300 font-bold"
                  >
                    <option value="0">0 (1st Payout • Min ₹250)</option>
                    <option value="1">1+ (2nd+ Payout • Min ₹500)</option>
                  </select>
                </div>
              </div>

              {/* Feature Activations */}
              <div className="p-3.5 rounded-2xl bg-[#080B12] border border-slate-800 space-y-2.5">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                  Feature Activations & UTRs
                </span>

                {/* Ads Unlock */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <div>
                    <span className="text-white font-bold block">₹199 Video Ads Monetization</span>
                    <span className="text-[10px] text-slate-400">Allows watching ads and earning</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingUser.hasPaidAdsActivation || false}
                    onChange={(e) => setEditingUser({ ...editingUser, hasPaidAdsActivation: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 cursor-pointer"
                  />
                </div>
                {editingUser.hasPaidAdsActivation && (
                  <input
                    type="text"
                    value={editingUser.adsActivationUtr || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, adsActivationUtr: e.target.value })}
                    placeholder="Ads Activation 12-digit UTR"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                )}

                {/* Withdrawal Fee */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-white font-bold block">₹99 Withdrawal Verification Fee</span>
                    <span className="text-[10px] text-slate-400">Unlocks bank payout capability</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingUser.hasPaidWithdrawalFee || false}
                    onChange={(e) => setEditingUser({ ...editingUser, hasPaidWithdrawalFee: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 cursor-pointer"
                  />
                </div>
                {editingUser.hasPaidWithdrawalFee && (
                  <input
                    type="text"
                    value={editingUser.withdrawalFeeUtr || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, withdrawalFeeUtr: e.target.value })}
                    placeholder="Withdrawal Fee 12-digit UTR"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                )}

                {/* Turbo Speed */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-white font-bold block">₹99 5G Turbo Speed Selling</span>
                    <span className="text-[10px] text-slate-400">10x streaming speed boost</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingUser.hasPaidSpeedTurbo || false}
                    onChange={(e) => setEditingUser({ ...editingUser, hasPaidSpeedTurbo: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 cursor-pointer"
                  />
                </div>
                {editingUser.hasPaidSpeedTurbo && (
                  <input
                    type="text"
                    value={editingUser.speedTurboUtr || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, speedTurboUtr: e.target.value })}
                    placeholder="Turbo Speed 12-digit UTR"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Account Tier</label>
                  <select
                    value={editingUser.tier}
                    onChange={(e) => setEditingUser({ ...editingUser, tier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white"
                  >
                    <option value="BRONZE">BRONZE</option>
                    <option value="SILVER">SILVER</option>
                    <option value="GOLD">GOLD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Account Status</label>
                  <select
                    value={editingUser.status || 'ACTIVE'}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Default UPI ID</label>
                <input
                  type="text"
                  value={editingUser.savedUpiId}
                  onChange={(e) => setEditingUser({ ...editingUser, savedUpiId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black shadow-lg transition-all border border-amber-400/40 uppercase tracking-wider cursor-pointer"
                >
                  Save User Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: EDIT EARNER MODAL ==================== */}
      {editingEarner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-gradient-to-b from-[#131726] to-[#0A0D15] border border-amber-500/30 text-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Configure Leaderboard Earner #{editingEarner.rank}</span>
              </h3>
              <button
                onClick={() => setEditingEarner(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEarner} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Rank (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={editingEarner.rank}
                    onChange={(e) =>
                      setEditingEarner({ ...editingEarner, rank: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1 font-bold">Earner Name</label>
                  <input
                    type="text"
                    required
                    value={editingEarner.name}
                    onChange={(e) => setEditingEarner({ ...editingEarner, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">City / Region</label>
                <input
                  type="text"
                  required
                  value={editingEarner.city}
                  onChange={(e) => setEditingEarner({ ...editingEarner, city: e.target.value })}
                  placeholder="e.g. Mumbai, Delhi NCR"
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Total Earned (₹)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editingEarner.totalEarned}
                    onChange={(e) =>
                      setEditingEarner({
                        ...editingEarner,
                        totalEarned: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 font-bold text-emerald-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Data Sold (MB)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editingEarner.mbSold}
                    onChange={(e) =>
                      setEditingEarner({
                        ...editingEarner,
                        mbSold: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-slate-700 font-mono text-amber-300"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-1 font-semibold">
                  <input
                    type="checkbox"
                    checked={editingEarner.verified}
                    onChange={(e) =>
                      setEditingEarner({ ...editingEarner, verified: e.target.checked })
                    }
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>Show Verified Network Seller Blue Badge</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEarner(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black shadow-md cursor-pointer uppercase tracking-wider"
                >
                  Update Earner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
