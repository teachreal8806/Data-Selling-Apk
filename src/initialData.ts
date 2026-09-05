import { TopEarner, UserAccount, AuthLog, DepositRecord, WithdrawalRecord } from './types';

export const INITIAL_TOP_EARNERS: TopEarner[] = [
  { id: 'te_1', rank: 1, name: 'Rajesh Kumar', city: 'Mumbai', totalEarned: 14580.00, mbSold: 14580.00, verified: true },
  { id: 'te_2', rank: 2, name: 'Aman Sharma', city: 'Delhi NCR', totalEarned: 11920.00, mbSold: 11920.00, verified: true },
  { id: 'te_3', rank: 3, name: 'Priya Patel', city: 'Ahmedabad', totalEarned: 9840.50, mbSold: 9840.50, verified: true },
  { id: 'te_4', rank: 4, name: 'Rahul Verma', city: 'Lucknow', totalEarned: 8650.00, mbSold: 8650.00, verified: true },
  { id: 'te_5', rank: 5, name: 'Vikram Singh', city: 'Jaipur', totalEarned: 7490.00, mbSold: 7490.00, verified: true },
  { id: 'te_6', rank: 6, name: 'Sneha Reddy', city: 'Hyderabad', totalEarned: 6540.00, mbSold: 6540.00, verified: true },
  { id: 'te_7', rank: 7, name: 'Mohammad Arshad', city: 'Patna', totalEarned: 5820.00, mbSold: 5820.00, verified: true },
  { id: 'te_8', rank: 8, name: 'Rohit Yadav', city: 'Indore', totalEarned: 4980.00, mbSold: 4980.00, verified: true },
  { id: 'te_9', rank: 9, name: 'Anjali Gupta', city: 'Kolkata', totalEarned: 4250.00, mbSold: 4250.00, verified: true },
  { id: 'te_10', rank: 10, name: 'Deepak Joshi', city: 'Pune', totalEarned: 3610.00, mbSold: 3610.00, verified: true },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_main',
    name: 'Tech Real',
    email: 'techreal8806@gmail.com',
    phone: '+91 9823537634',
    password: 'password123',
    balance: 0.00,
    totalSoldMB: 0.00,
    tier: 'BRONZE',
    status: 'ACTIVE',
    savedUpiId: 'techreal8806@oksbi',
    selectedPaymentMethod: 'PhonePe',
    signupTime: '04/09/2026, 09:15:00 am',
    lastLoginTime: '04/09/2026, 10:05:00 am',
    ipAddress: '103.21.244.18 (Jio 5G)',
    device: 'Android 14 • Chrome Mobile',
  },
  {
    id: 'usr_1',
    name: 'Mansi Sharma',
    email: 'mansisss1430@gmail.com',
    phone: '+91 9876543210',
    password: 'password123',
    balance: 194.09,
    totalSoldMB: 441.99,
    tier: 'BRONZE',
    status: 'ACTIVE',
    savedUpiId: 'mansisss1430@oksbi',
    selectedPaymentMethod: 'PhonePe',
    signupTime: '13/08/2025, 02:00:00 pm',
    lastLoginTime: '15/08/2025, 06:15:00 pm',
    ipAddress: '49.36.120.45 (Airtel 5G)',
    device: 'Vivo V29 • Chrome Mobile',
  },
  {
    id: 'usr_2',
    name: 'Suresh Raina',
    email: 'suresh.raina@gmail.com',
    phone: '+91 9811223344',
    password: 'password123',
    balance: 1250.00,
    totalSoldMB: 1850.20,
    tier: 'SILVER',
    status: 'ACTIVE',
    savedUpiId: 'suresh@paytm',
    selectedPaymentMethod: 'GPay',
    signupTime: '10/08/2025, 11:30:00 am',
    lastLoginTime: '15/08/2025, 04:20:00 pm',
    ipAddress: '157.34.89.12 (Vi India)',
    device: 'Samsung Galaxy S23 • OneUI',
  },
  {
    id: 'usr_3',
    name: 'Pooja Verma',
    email: 'pooja.verma88@yahoo.com',
    phone: '+91 9723456789',
    password: 'password123',
    balance: 50.00,
    totalSoldMB: 95.50,
    tier: 'BRONZE',
    status: 'ACTIVE',
    savedUpiId: 'pooja@ibl',
    selectedPaymentMethod: 'UPI',
    signupTime: '14/08/2025, 08:45:00 pm',
    lastLoginTime: '15/08/2025, 01:10:00 pm',
    ipAddress: '103.88.23.66 (ACT Fibernet)',
    device: 'Windows 11 • Edge',
  }
];

export const INITIAL_AUTH_LOGS: AuthLog[] = [
  {
    id: 'log_1',
    userId: 'usr_main',
    userEmail: 'techreal8806@gmail.com',
    userName: 'Tech Real',
    userPhone: '+91 9823537634',
    type: 'LOGIN',
    timestamp: '04/09/2026, 10:05:00 am',
    ipAddress: '103.21.244.18 (Jio 5G)',
    device: 'Android 14 • Chrome 126',
    status: 'SUCCESS'
  },
  {
    id: 'log_2',
    userId: 'usr_main',
    userEmail: 'techreal8806@gmail.com',
    userName: 'Tech Real',
    userPhone: '+91 9823537634',
    type: 'SIGNUP',
    timestamp: '04/09/2026, 09:15:00 am',
    ipAddress: '103.21.244.18 (Jio 5G)',
    device: 'Android 14 • Chrome 126',
    status: 'SUCCESS'
  },
  {
    id: 'log_3',
    userId: 'usr_1',
    userEmail: 'mansisss1430@gmail.com',
    userName: 'Mansi Sharma',
    userPhone: '+91 9876543210',
    type: 'LOGIN',
    timestamp: '15/08/2025, 06:15:00 pm',
    ipAddress: '49.36.120.45 (Airtel)',
    device: 'Vivo V29 • Chrome Mobile',
    status: 'SUCCESS'
  },
  {
    id: 'log_4',
    userId: 'usr_2',
    userEmail: 'suresh.raina@gmail.com',
    userName: 'Suresh Raina',
    userPhone: '+91 9811223344',
    type: 'LOGIN',
    timestamp: '15/08/2025, 04:20:00 pm',
    ipAddress: '157.34.89.12 (Vi)',
    device: 'Samsung S23 • Android',
    status: 'SUCCESS'
  },
  {
    id: 'log_5',
    userId: 'usr_3',
    userEmail: 'pooja.verma88@yahoo.com',
    userName: 'Pooja Verma',
    userPhone: '+91 9723456789',
    type: 'SIGNUP',
    timestamp: '14/08/2025, 08:45:00 pm',
    ipAddress: '103.88.23.66 (ACT Fibernet)',
    device: 'Windows 11 • Edge',
    status: 'SUCCESS'
  }
];

export const INITIAL_DEPOSITS: DepositRecord[] = [
  {
    id: 'dep_1',
    userId: 'usr_1',
    userEmail: 'mansisss1430@gmail.com',
    amount: 500.00,
    type: 'ADMIN_CREDIT',
    note: 'Initial Signup Bandwidth Boost Bonus',
    time: '13/08/2025, 02:05:00 pm',
    status: 'COMPLETED'
  },
  {
    id: 'dep_2',
    userId: 'usr_2',
    userEmail: 'suresh.raina@gmail.com',
    amount: 1000.00,
    type: 'UPI_DEPOSIT',
    note: 'Fast Track Bandwidth Node Deposit via PhonePe',
    time: '11/08/2025, 10:14:00 am',
    status: 'COMPLETED'
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'wd_video_1',
    userId: 'usr_1',
    userEmail: 'mansisss1430@gmail.com',
    orderNumber: 'DH7MXCXN9PYO',
    amount: 500.00,
    type: 'UPI',
    upiId: 'mansisss1430@oksbi',
    time: '15/8/2025, 6:16:58 pm',
    status: 'PENDING'
  },
  {
    id: 'wd_video_2',
    userId: 'usr_1',
    userEmail: 'mansisss1430@gmail.com',
    orderNumber: 'DHLODVXNGYGL',
    amount: 500.00,
    type: 'UPI',
    upiId: 'mansisss1430@oksbi',
    time: '13/8/2025, 7:35:59 pm',
    status: 'SUCCESSFUL'
  },
  {
    id: 'wd_video_3',
    userId: 'usr_2',
    userEmail: 'suresh.raina@gmail.com',
    orderNumber: 'DH8890AFG991',
    amount: 500.00,
    type: 'PhonePe',
    upiId: 'suresh@paytm',
    time: '13/8/2025, 2:03:07 pm',
    status: 'SUCCESSFUL'
  }
];
