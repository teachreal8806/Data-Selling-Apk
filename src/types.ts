export interface DataPacket {
  id: string;
  time: string;
  mb: number;
  amount: number;
}

export interface WithdrawalRecord {
  id: string;
  userId?: string;
  userEmail?: string;
  orderNumber: string;
  amount: number;
  type: 'UPI' | 'PhonePe' | 'GPay';
  upiId: string;
  time: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'REJECTED';
  rejectionReason?: string;
  bankReference?: string;
  adminNotes?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  balance: number;
  totalSoldMB: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  status: 'ACTIVE' | 'BLOCKED';
  savedUpiId: string;
  selectedPaymentMethod: 'PhonePe' | 'GPay' | 'UPI';
  signupTime: string;
  lastLoginTime: string;
  ipAddress: string;
  device: string;
  // Per-user deposit requirement before withdrawal
  requireDepositBeforeWithdrawal?: boolean;
  requiredDepositAmount?: number;
  hasCompletedRequiredDeposit?: boolean;
  withdrawalDepositNotice?: string;
  hasPaidAdsActivation?: boolean; // ₹199 payment required before watching ads
  adsActivationUtr?: string;
  adsActivationPending?: boolean;
  hasPaidWithdrawalFee?: boolean; // ₹99 payment required before withdrawal
  withdrawalFeeUtr?: string;
  withdrawalFeePending?: boolean;
  hasPaidSpeedTurbo?: boolean; // ₹99 payment required for fast data selling
  speedTurboUtr?: string;
  speedTurboPending?: boolean;
  withdrawalCount?: number; // count of completed/initiated withdrawals (1st = min 250, 2nd+ = min 500)
}

export interface AuthLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  type: 'SIGNUP' | 'LOGIN';
  timestamp: string;
  ipAddress: string;
  device: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface TopEarner {
  id: string;
  rank: number;
  name: string;
  city: string;
  totalEarned: number;
  mbSold: number;
  verified: boolean;
}

export interface DepositRecord {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  type: 'ADMIN_CREDIT' | 'UPI_DEPOSIT' | 'PROMO_BONUS';
  note: string;
  time: string;
  status: 'COMPLETED' | 'PENDING' | 'REJECTED';
  utrNumber?: string;
  method?: 'PhonePe' | 'GPay' | 'Paytm' | 'BHIM' | 'UPI' | 'Manual';
}

export interface SupportTicket {
  id: string;
  userEmail: string;
  userName?: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'NEW' | 'RESOLVED';
}

export interface SupportConfig {
  whatsappNumber: string;
  email: string;
  telegramLink: string;
  telegramHandle: string;
  notice: string;
}

export interface DepositGatewayConfig {
  upiId: string;
  payeeName: string;
  qrImageUrl?: string;
  minDeposit: number;
  allowDirectDeposit: boolean;
  instructions: string;
}

export interface SystemConfig {
  sellingSpeedMs: number; // e.g. 4500 (slow)
  mbPerPacketMin: number; // e.g. 0.15
  mbPerPacketMax: number; // e.g. 0.45
  ratePerMb: number; // e.g. 1.00
  broadcastNotice?: string;
  adRewardAmount: number; // e.g. 5.00
  dailyAdLimit: number; // e.g. 10
}

export interface AdItem {
  id: string;
  title: string;
  sponsor: string;
  category: string;
  rewardAmount: number;
  durationSeconds: number;
  tagline: string;
  badge: string;
  gradient: string;
  iconName: string;
}

export type AppView = 
  | 'dashboard'
  | 'profile'
  | 'withdraw'
  | 'deposit'
  | 'history'
  | 'leaderboard'
  | 'admin'
  | 'terms'
  | 'support';

export interface UserState {
  id?: string;
  email: string;
  name: string;
  phone: string;
  balance: number;
  totalSoldMB: number;
  isSelling: boolean;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  savedUpiId: string;
  selectedPaymentMethod: 'PhonePe' | 'GPay' | 'UPI';
  status?: 'ACTIVE' | 'BLOCKED';
  // Per-user deposit requirement before withdrawal
  requireDepositBeforeWithdrawal?: boolean;
  requiredDepositAmount?: number;
  hasCompletedRequiredDeposit?: boolean;
  withdrawalDepositNotice?: string;
  hasPaidAdsActivation?: boolean;
  adsActivationUtr?: string;
  adsActivationPending?: boolean;
  hasPaidWithdrawalFee?: boolean;
  withdrawalFeeUtr?: string;
  withdrawalFeePending?: boolean;
  hasPaidSpeedTurbo?: boolean;
  speedTurboUtr?: string;
  speedTurboPending?: boolean;
  withdrawalCount?: number;
  password?: string;
}

