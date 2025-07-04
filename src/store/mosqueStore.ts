
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Donor {
  id: string;
  name: string;
  phone: string;
  address: string;
  monthlyAmount: number;
  status: 'Active' | 'Inactive' | 'Defaulter';
  joinDate: string;
  startDate: string;
  payments: any[];
  paymentHistory: any[];
}

interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  donorId?: string;
  month?: string;
  receiptNumber: string;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  type: string;
  month?: string;
  imamId?: string;
}

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  joinDate: string;
}

interface Notice {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  isMarquee?: boolean;
  marqueeSettings?: {
    fontSize?: number;
    textColor?: string;
  };
}

interface Imam {
  id: string;
  name: string;
  phone: string;
  address: string;
  monthlySalary: number;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'Prayer' | 'Event' | 'Program' | 'Religious' | 'Educational' | 'Social' | 'Fundraising';
  location: string;
}

interface Settings {
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
    jumma: string;
  };
  ramadanTimes?: {
    sehri: string;
    iftar: string;
  };
}

interface MosqueStore {
  donors: Donor[];
  income: Income[];
  expenses: Expense[];
  committee: CommitteeMember[];
  notices: Notice[];
  imams: Imam[];
  events: Event[];
  settings: Settings;
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
  addDonor: (donor: Omit<Donor, 'id'>) => void;
  updateDonor: (id: string, updates: Partial<Donor>) => void;
  deleteDonor: (id: string) => void;
  clearDonors: () => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, updates: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  clearIncome: () => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void;
  addCommitteeMember: (member: Omit<CommitteeMember, 'id'>) => void;
  updateCommitteeMember: (id: string, updates: Partial<CommitteeMember>) => void;
  deleteCommitteeMember: (id: string) => void;
  clearCommittee: () => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  updateNotice: (id: string, updates: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  clearNotices: () => void;
  addImam: (imam: Omit<Imam, 'id'>) => void;
  updateImam: (id: string, updates: Partial<Imam>) => void;
  deleteImam: (id: string) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getMissingMonths: (donorId: string) => string[];
  getDonorPaidMonths: (donorId: string) => string[];
  getDefaulters: () => Donor[];
  getTotalDueAmount: () => number;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const useMosqueStore = create<MosqueStore>()(
  persist(
    (set, get) => ({
      donors: [],
      income: [],
      expenses: [],
      committee: [],
      notices: [],
      imams: [],
      events: [],
      settings: {
        name: 'মসজিদ কমিটি',
        address: 'example ঠিকানা',
        phone: '017XXXXXXXXX',
        email: 'example@gmail.com',
        prayerTimes: {
          fajr: '05:00',
          dhuhr: '12:00',
          asr: '15:30',
          maghrib: '18:00',
          isha: '19:30',
          jumma: '13:00'
        },
        ramadanTimes: {
          sehri: '04:30',
          iftar: '18:30'
        }
      },
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Donors
      addDonor: (donor) => set((state) => ({
        donors: [...state.donors, { ...donor, id: generateId() }],
      })),
      updateDonor: (id, updates) => set((state) => ({
        donors: state.donors.map(donor => 
          donor.id === id ? { ...donor, ...updates } : donor
        ),
      })),
      deleteDonor: (id) => set((state) => ({
        donors: state.donors.filter(donor => donor.id !== id),
      })),
      clearDonors: () => set({ donors: [] }),

      // Income
      addIncome: (income) => set((state) => ({
        income: [...state.income, { ...income, id: generateId() }],
      })),
      updateIncome: (id, updates) => set((state) => ({
        income: state.income.map(inc => 
          inc.id === id ? { ...inc, ...updates } : inc
        ),
      })),
      deleteIncome: (id) => set((state) => ({
        income: state.income.filter(inc => inc.id !== id),
      })),
      clearIncome: () => set({ income: [] }),

      // Expenses
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: generateId() }],
      })),
      updateExpense: (id, updates) => set((state) => ({
        expenses: state.expenses.map(exp => 
          exp.id === id ? { ...exp, ...updates } : exp
        ),
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(exp => exp.id !== id),
      })),
      clearExpenses: () => set({ expenses: [] }),

      // Committee
      addCommitteeMember: (member) => set((state) => ({
        committee: [...state.committee, { ...member, id: generateId() }],
      })),
      updateCommitteeMember: (id, updates) => set((state) => ({
        committee: state.committee.map(member => 
          member.id === id ? { ...member, ...updates } : member
        ),
      })),
      deleteCommitteeMember: (id) => set((state) => ({
        committee: state.committee.filter(member => member.id !== id),
      })),
      clearCommittee: () => set({ committee: [] }),

      // Notices
      addNotice: (notice) => set((state) => ({
        notices: [...state.notices, { 
          ...notice, 
          id: generateId(), 
          date: new Date().toISOString().split('T')[0] 
        }],
      })),
      updateNotice: (id, updates) => set((state) => ({
        notices: state.notices.map(notice => 
          notice.id === id ? { ...notice, ...updates } : notice
        ),
      })),
      deleteNotice: (id) => set((state) => ({
        notices: state.notices.filter(notice => notice.id !== id),
      })),
      clearNotices: () => set({ notices: [] }),

      // Imams
      addImam: (imam) => set((state) => ({
        imams: [...state.imams, { ...imam, id: generateId() }],
      })),
      updateImam: (id, updates) => set((state) => ({
        imams: state.imams.map(imam => 
          imam.id === id ? { ...imam, ...updates } : imam
        ),
      })),
      deleteImam: (id) => set((state) => ({
        imams: state.imams.filter(imam => imam.id !== id),
      })),

      // Events
      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: generateId() }],
      })),
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map(event => 
          event.id === id ? { ...event, ...updates } : event
        ),
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(event => event.id !== id),
      })),

      // Settings
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates },
      })),

      // Calculations
      getTotalIncome: () => {
        return get().income.reduce((sum, inc) => sum + inc.amount, 0);
      },
      getTotalExpenses: () => {
        return get().expenses.reduce((sum, exp) => sum + exp.amount, 0);
      },
      getBalance: () => {
        return get().getTotalIncome() - get().getTotalExpenses();
      },

      // Donor-related calculations
      getMissingMonths: (donorId: string) => {
        const donor = get().donors.find(d => d.id === donorId);
        if (!donor) return [];
        
        const paidMonths = get().income
          .filter(inc => inc.donorId === donorId && inc.month)
          .map(inc => inc.month);
        
        const months = [
          'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
          'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
        ];
        
        return months.filter(month => !paidMonths.includes(month));
      },

      getDonorPaidMonths: (donorId: string) => {
        return get().income
          .filter(inc => inc.donorId === donorId && inc.month)
          .map(inc => inc.month || '');
      },

      getDefaulters: () => {
        return get().donors.filter(donor => {
          const missingMonths = get().getMissingMonths(donor.id);
          return missingMonths.length > 0 || donor.status === 'Defaulter';
        });
      },

      getTotalDueAmount: () => {
        const defaulters = get().getDefaulters();
        return defaulters.reduce((total, donor) => {
          const missingMonths = get().getMissingMonths(donor.id);
          return total + (missingMonths.length * donor.monthlyAmount);
        }, 0);
      },

      changePassword: (oldPassword: string, newPassword: string) => {
        // Simple password change logic - should be properly implemented
        return true;
      },
    }),
    {
      name: 'mosque-storage',
      version: 1,
    }
  )
);

export { useMosqueStore };
