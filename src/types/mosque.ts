
export interface Committee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  joinDate: string;
}

export interface Donor {
  id: string;
  name: string;
  phone: string;
  address: string;
  monthlyAmount: number;
  status: 'Active' | 'Inactive' | 'Defaulter';
  paymentHistory: PaymentRecord[];
  startDate: string;
}

export interface PaymentRecord {
  id: string;
  donorId: string;
  amount: number;
  date: string;
  month: string;
  type: 'Monthly Donation' | 'One-time Donation' | 'Donation Box' | 'Others';
  receiptNumber?: string;
}

export interface Income {
  id: string;
  date: string;
  source: 'Monthly Donation' | 'One-time Donation' | 'Donation Box' | 'Others';
  amount: number;
  donorId?: string;
  month?: string;
  description?: string;
  receiptNumber: string;
}

export interface Expense {
  id: string;
  date: string;
  type: 'Imam Salary' | 'Electricity Bill' | 'Others';
  amount: number;
  month?: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'Prayer' | 'Event' | 'Program';
  location: string;
}

export interface PrayerTime {
  name: string;
  time: string;
  nameArabic: string;
  nameBangla: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'viewer';
  name: string;
}
