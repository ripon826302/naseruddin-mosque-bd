import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Committee, Donor, Income, Expense, User } from '@/types/mosque';

interface MosqueSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  prayerTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

interface Notice {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'urgent';
}

interface MosqueStore {
  // Settings
  settings: MosqueSettings;
  updateSettings: (settings: Partial<MosqueSettings>) => void;
  
  // Notices
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Committee
  committee: Committee[];
  addCommitteeMember: (member: Omit<Committee, 'id'>) => void;
  updateCommitteeMember: (id: string, member: Partial<Committee>) => void;
  deleteCommitteeMember: (id: string) => void;
  
  // Donors
  donors: Donor[];
  addDonor: (donor: Omit<Donor, 'id' | 'paymentHistory'>) => void;
  updateDonor: (id: string, donor: Partial<Donor>) => void;
  deleteDonor: (id: string) => void;
  
  // Income
  income: Income[];
  addIncome: (income: Omit<Income, 'id' | 'receiptNumber'>) => void;
  deleteIncome: (id: string) => void;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  
  // Calculations
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
}

// Default settings
const defaultSettings: MosqueSettings = {
  name: 'উত্তর জুরকাঠী নছের উদ্দিন জামে মসজিদ',
  address: 'উত্তর জুরকাঠী, নলছিটি, ঝালকাঠী',
  phone: '01712345678',
  email: 'mosque@email.com',
  prayerTimes: {
    fajr: '5:15',
    dhuhr: '12:30',
    asr: '16:15',
    maghrib: '18:45',
    isha: '20:15'
  }
};

// Demo data
const demoCommittee: Committee[] = [
  {
    id: '1',
    name: 'আব্দুল করিম',
    role: 'President',
    phone: '01712345678',
    email: 'karim@email.com',
    joinDate: '2020-01-01'
  },
  {
    id: '2',
    name: 'মোহাম্মদ রহিম',
    role: 'Secretary',
    phone: '01812345678',
    joinDate: '2020-01-01'
  }
];

const demoDonors: Donor[] = [
  {
    id: '1',
    name: 'আব্দুল্লাহ আল মামুন',
    phone: '01712345678',
    address: 'ঢাকা',
    monthlyAmount: 5000,
    status: 'Active',
    paymentHistory: []
  },
  {
    id: '2',
    name: 'মোহাম্মদ হাসান',
    phone: '01812345678',
    address: 'চট্টগ্রাম',
    monthlyAmount: 3000,
    status: 'Defaulter',
    paymentHistory: []
  }
];

const demoIncome: Income[] = [
  {
    id: '1',
    date: '2024-06-01',
    source: 'Monthly Donation',
    amount: 5000,
    donorId: '1',
    month: 'June 2024',
    receiptNumber: 'RCP001'
  }
];

const demoExpenses: Expense[] = [
  {
    id: '1',
    date: '2024-06-01',
    type: 'Imam Salary',
    amount: 15000,
    month: 'June 2024'
  }
];

const demoNotices: Notice[] = [
  {
    id: '1',
    title: 'বিশেষ দোয়া মাহফিল',
    message: 'আগামী শুক্রবার বিশেষ দোয়া মাহফিল অনুষ্ঠিত হবে',
    date: '2024-06-01',
    type: 'info'
  }
];

export const useMosqueStore = create<MosqueStore>()(
  persist(
    (set, get) => ({
      // Settings
      settings: defaultSettings,
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      // Notices
      notices: demoNotices,
      addNotice: (notice) => set((state) => ({
        notices: [...state.notices, { 
          ...notice, 
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0]
        }]
      })),
      updateNotice: (id, notice) => set((state) => ({
        notices: state.notices.map(n => n.id === id ? { ...n, ...notice } : n)
      })),
      deleteNotice: (id) => set((state) => ({
        notices: state.notices.filter(n => n.id !== id)
      })),
      
      // Auth - Auto login as viewer for general users
      user: { id: 'viewer', username: 'viewer', role: 'viewer', name: 'দর্শক' },
      isAuthenticated: true,
      login: (username: string, password: string) => {
        if (username === 'admin' && password === 'admin123') {
          const user: User = {
            id: '1',
            username,
            role: 'admin',
            name: 'এডমিন'
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ 
        user: { id: 'viewer', username: 'viewer', role: 'viewer', name: 'দর্শক' }, 
        isAuthenticated: true 
      }),
      
      committee: demoCommittee,
      addCommitteeMember: (member) => set((state) => ({
        committee: [...state.committee, { ...member, id: Date.now().toString() }]
      })),
      updateCommitteeMember: (id, member) => set((state) => ({
        committee: state.committee.map(m => m.id === id ? { ...m, ...member } : m)
      })),
      deleteCommitteeMember: (id) => set((state) => ({
        committee: state.committee.filter(m => m.id !== id)
      })),
      
      donors: demoDonors,
      addDonor: (donor) => set((state) => ({
        donors: [...state.donors, { ...donor, id: Date.now().toString(), paymentHistory: [] }]
      })),
      updateDonor: (id, donor) => set((state) => ({
        donors: state.donors.map(d => d.id === id ? { ...d, ...donor } : d)
      })),
      deleteDonor: (id) => set((state) => ({
        donors: state.donors.filter(d => d.id !== id)
      })),
      
      income: demoIncome,
      addIncome: (income) => set((state) => {
        const receiptNumber = `RCP${String(state.income.length + 1).padStart(3, '0')}`;
        return {
          income: [...state.income, { ...income, id: Date.now().toString(), receiptNumber }]
        };
      }),
      deleteIncome: (id) => set((state) => ({
        income: state.income.filter(i => i.id !== id)
      })),
      
      expenses: demoExpenses,
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: Date.now().toString() }]
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),
      
      getTotalIncome: () => {
        const { income } = get();
        return income.reduce((total, item) => total + item.amount, 0);
      },
      getTotalExpenses: () => {
        const { expenses } = get();
        return expenses.reduce((total, item) => total + item.amount, 0);
      },
      getBalance: () => {
        const { getTotalIncome, getTotalExpenses } = get();
        return getTotalIncome() - getTotalExpenses();
      }
    }),
    {
      name: 'mosque-storage'
    }
  )
);
