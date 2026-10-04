import { 
  UserAccount, 
  WithdrawalRecord, 
  DepositRecord, 
  AuthLog, 
  TopEarner, 
  SystemConfig, 
  DepositGatewayConfig, 
  SupportConfig, 
  SupportTicket 
} from './types';

export const api = {
  // Sync current user state & fetch latest system configurations
  async syncUser(email: string) {
    try {
      const res = await fetch(`/api/user/sync?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API syncUser offline, fallback to local', e);
    }
    return null;
  },

  // Auth: Signup on any mobile
  async signup(data: {
    email: string;
    password?: string;
    name?: string;
    phone?: string;
    device?: string;
  }) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API signup offline', e);
    }
    return null;
  },

  // Auth: Login on any mobile
  async login(data: { email: string; password?: string; device?: string }) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API login offline', e);
    }
    return null;
  },

  // Stream bandwidth sell packet
  async streamPacket(data: { email: string; mb: number; amount: number }) {
    try {
      const res = await fetch('/api/packets/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API streamPacket offline', e);
    }
    return null;
  },

  // Claim sponsored video ad reward
  async claimAdReward(data: { email: string; rewardAmount: number; adId: string; adTitle: string }) {
    try {
      const res = await fetch('/api/ads/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API claimAdReward offline', e);
    }
    return null;
  },

  // Submit withdrawal from any mobile
  async requestWithdrawal(data: {
    userId?: string;
    userEmail: string;
    amount: number;
    method: string;
    upiId: string;
    orderNumber?: string;
  }) {
    try {
      const res = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API requestWithdrawal offline', e);
    }
    return null;
  },

  // Submit deposit
  async submitDeposit(data: {
    userId?: string;
    userEmail: string;
    amount: number;
    type?: string;
    note?: string;
    utrNumber?: string;
    method?: string;
  }) {
    try {
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API submitDeposit offline', e);
    }
    return null;
  },

  // ADMIN: Get all data across all mobile devices
  async getAdminAllData() {
    try {
      const res = await fetch('/api/admin/all-data');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API getAdminAllData offline', e);
    }
    return null;
  },

  // ADMIN: Approve or reject withdrawal
  async updateWithdrawal(data: {
    id: string;
    status: 'SUCCESSFUL' | 'REJECTED' | 'PENDING';
    bankReference?: string;
    rejectionReason?: string;
  }) {
    try {
      const res = await fetch('/api/admin/update-withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateWithdrawal offline', e);
    }
    return null;
  },

  // ADMIN: Approve or reject deposit
  async updateDeposit(data: { id: string; status: 'COMPLETED' | 'REJECTED' }) {
    try {
      const res = await fetch('/api/admin/update-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateDeposit offline', e);
    }
    return null;
  },

  // ADMIN: Update user
  async updateUser(data: Partial<UserAccount> & { id: string }) {
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateUser offline', e);
    }
    return null;
  },

  // ADMIN: Credit user balance
  async creditUser(data: { userId: string; amount: number; type?: string; note?: string }) {
    try {
      const res = await fetch('/api/admin/credit-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API creditUser offline', e);
    }
    return null;
  },

  // ADMIN: Delete user
  async deleteUser(userId: string) {
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API deleteUser offline', e);
    }
    return null;
  },

  // ADMIN: Update system settings (speed, rates, banner)
  async updateSystemConfig(data: {
    systemConfig?: Partial<SystemConfig>;
    depositConfig?: Partial<DepositGatewayConfig>;
    supportConfig?: Partial<SupportConfig>;
  }) {
    try {
      const res = await fetch('/api/admin/system-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateSystemConfig offline', e);
    }
    return null;
  },

  // ADMIN: Update top earners
  async updateTopEarners(topEarners: TopEarner[]) {
    try {
      const res = await fetch('/api/admin/top-earners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topEarners }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateTopEarners offline', e);
    }
    return null;
  },

  // ADMIN: Clear logs
  async clearLogs() {
    try {
      const res = await fetch('/api/admin/clear-logs', {
        method: 'POST',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API clearLogs offline', e);
    }
    return null;
  },
};
