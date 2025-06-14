import { create } from 'zustand';
import { Committee, Donor, Income, Expense, Event, User, Imam } from '@/types/mosque';

interface MosqueStore {
  // State
  user: User | null;
  committee: Committee[];
  donors: Donor[];
  income: Income[];
  expenses: Expense[];
  events: Event[];
  notices: any[];
  imams: Imam[];
  settings: {
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
  };

  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addCommitteeMember: (member: Omit<Committee, 'id'>) => void;
  updateCommitteeMember: (id: string, updates: Partial<Committee>) => void;
  deleteCommitteeMember: (id: string) => void;
  addDonor: (donor: Omit<Donor, 'id' | 'paymentHistory'>) => void;
  updateDonor: (id: string, updates: Partial<Donor>) => void;
  deleteDonor: (id: string) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, updates: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addNotice: (notice: any) => void;
  updateNotice: (id: string, updates: any) => void;
  deleteNotice: (id: string) => void;
  addImam: (imam: Omit<Imam, 'id'>) => void;
  updateImam: (id: string, updates: Partial<Imam>) => void;
  deleteImam: (id: string) => void;
  updateSettings: (settings: Partial<MosqueStore['settings']>) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getMissingMonths: (donorId: string) => string[];
  getDonorPaidMonths: (donorId: string) => string[];
  changePassword: (newPassword: string) => void;
  getDefaulters: () => Donor[];
  getTotalDueAmount: () => number;
}

const useStore = create<MosqueStore>((set, get) => ({
  // Initial state
  user: { id: '1', username: 'admin', role: 'admin', name: 'Admin User' },
  committee: [
    {
      id: '1',
      name: 'আব্দুল করিম',
      role: 'সভাপতি',
      phone: '01712345678',
      email: 'president@mosque.com',
      joinDate: '2023-01-01'
    },
    {
      id: '2',
      name: 'মোহাম্মদ রহিম',
      role: 'সেক্রেটারি',
      phone: '01723456789',
      email: 'secretary@mosque.com',
      joinDate: '2023-02-01'
    }
  ],
  donors: [
    {
      id: '1',
      name: 'আহমেদ আলী',
      phone: '01712345678',
      address: 'ঢাকা, বাংলাদেশ',
      monthlyAmount: 1000,
      status: 'Active',
      paymentHistory: [],
      startDate: '2024-01-01'
    },
    {
      id: '2',
      name: 'ফাতেমা খাতুন',
      phone: '01723456789',
      address: 'চট্টগ্রাম, বাংলাদেশ',
      monthlyAmount: 500,
      status: 'Defaulter',
      paymentHistory: [],
      startDate: '2024-02-01'
    },
    {
      id: '3',
      name: 'মোহাম্মদ হাসান',
      phone: '01734567890',
      address: 'সিলেট, বাংলাদেশ',
      monthlyAmount: 800,
      status: 'Defaulter',
      paymentHistory: [],
      startDate: '2024-01-15'
    }
  ],
  income: [
    {
      id: '1',
      date: '2024-01-15',
      source: 'Monthly Donation',
      amount: 50000,
      donorId: '1',
      month: 'January 2024',
      receiptNumber: 'R001'
    },
    {
      id: '2',
      date: '2024-01-20',
      source: 'Donation Box',
      amount: 5000,
      receiptNumber: 'R002'
    }
  ],
  expenses: [
    {
      id: '1',
      date: '2024-01-10',
      type: 'Electricity Bill',
      amount: 3000,
      month: 'January 2024',
      description: 'মাসিক বিদ্যুৎ বিল'
    },
    {
      id: '2',
      date: '2024-01-15',
      type: 'Imam Salary',
      amount: 15000,
      month: 'January 2024',
      description: 'ইমাম সাহেবের মাসিক বেতন'
    }
  ],
  events: [
    {
      id: '1',
      title: 'জুমার নামাজ',
      date: '2024-01-19',
      time: '13:30',
      description: 'সাপ্তাহিক জুমার নামাজ',
      type: 'Prayer',
      location: 'মূল নামাজ ঘর'
    }
  ],
  notices: [
    {
      id: '1',
      title: 'মাসিক সভা',
      message: 'আগামী শুক্রবার মাসিক কমিটি সভা অনুষ্ঠিত হবে',
      type: 'info',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'জুমার নামাজের সময় পরিবর্তন',
      message: 'আগামীকাল থেকে জুমার নামাজ দুপুর ১:০০ টায় শুরু হবে',
      type: 'warning',
      date: '2024-01-16'
    },
    {
      id: '3',
      title: 'মহররম মাসের বিশেষ আয়োজন',
      message: 'আশুরার দিন বিশেষ দোয়া ও আলোচনা অনুষ্ঠিত হবে',
      type: 'info',
      date: '2024-01-17'
    }
  ],
  imams: [
    {
      id: '1',
      name: 'মাওলানা আব্দুর রহমান',
      phone: '01712345678',
      address: 'ঢাকা, বাংলাদেশ',
      monthlySalary: 15000,
      status: 'Active',
      joinDate: '2023-01-01'
    }
  ],
  settings: {
    name: 'বায়তুল মোকাররম মসজিদ',
    address: 'ঢাকা, বাংলাদেশ',
    phone: '01712345678',
    email: 'info@mosque.com',
    prayerTimes: {
      fajr: '05:30',
      dhuhr: '12:30',
      asr: '16:00',
      maghrib: '18:00',
      isha: '19:30'
    }
  },

  // Actions
  login: (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      set({ user: { id: '1', username: 'admin', role: 'admin', name: 'Admin User' } });
      return true;
    }
    return false;
  },

  logout: () => set({ user: null }),

  addCommitteeMember: (member) => {
    const newMember = { ...member, id: Date.now().toString() };
    set((state) => ({ committee: [...state.committee, newMember] }));
  },

  updateCommitteeMember: (id, updates) => {
    set((state) => ({
      committee: state.committee.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      )
    }));
  },

  deleteCommitteeMember: (id) => {
    set((state) => ({
      committee: state.committee.filter((member) => member.id !== id)
    }));
  },

  addDonor: (donor) => {
    const newDonor = { ...donor, id: Date.now().toString(), paymentHistory: [] };
    set((state) => ({ donors: [...state.donors, newDonor] }));
  },

  updateDonor: (id, updates) => {
    set((state) => ({
      donors: state.donors.map((donor) =>
        donor.id === id ? { ...donor, ...updates } : donor
      )
    }));
  },

  deleteDonor: (id) => {
    set((state) => ({
      donors: state.donors.filter((donor) => donor.id !== id)
    }));
  },

  addIncome: (income) => {
    const newIncome = { ...income, id: Date.now().toString() };
    set((state) => ({ income: [...state.income, newIncome] }));
  },

  updateIncome: (id, updates) => {
    set((state) => ({
      income: state.income.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  },

  deleteIncome: (id) => {
    set((state) => ({
      income: state.income.filter((item) => item.id !== id)
    }));
  },

  addExpense: (expense) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    set((state) => ({ expenses: [...state.expenses, newExpense] }));
  },

  updateExpense: (id, updates) => {
    set((state) => ({
      expenses: state.expenses.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  },

  deleteExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter((item) => item.id !== id)
    }));
  },

  addEvent: (event) => {
    const newEvent = { ...event, id: Date.now().toString() };
    set((state) => ({ events: [...state.events, newEvent] }));
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      )
    }));
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id)
    }));
  },

  addNotice: (notice) => {
    const newNotice = { ...notice, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
    set((state) => ({ notices: [...state.notices, newNotice] }));
  },

  updateNotice: (id, updates) => {
    set((state) => ({
      notices: state.notices.map((notice) =>
        notice.id === id ? { ...notice, ...updates } : notice
      )
    }));
  },

  deleteNotice: (id) => {
    set((state) => ({
      notices: state.notices.filter((notice) => notice.id !== id)
    }));
  },

  addImam: (imam) => {
    const newImam = { ...imam, id: Date.now().toString() };
    set((state) => ({ imams: [...state.imams, newImam] }));
  },

  updateImam: (id, updates) => {
    set((state) => ({
      imams: state.imams.map((imam) =>
        imam.id === id ? { ...imam, ...updates } : imam
      )
    }));
  },

  deleteImam: (id) => {
    set((state) => ({
      imams: state.imams.filter((imam) => imam.id !== id)
    }));
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

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
  },

  getMissingMonths: (donorId: string) => {
    const { donors, income } = get();
    const donor = donors.find(d => d.id === donorId);
    if (!donor) return [];
    
    const startDate = new Date(donor.startDate);
    const currentDate = new Date();
    const paidMonths = income
      .filter(i => i.donorId === donorId && i.source === 'Monthly Donation')
      .map(i => i.month || '');
    
    const missingMonths: string[] = [];
    const date = new Date(startDate);
    
    while (date <= currentDate) {
      const monthYear = `${date.toLocaleDateString('en-US', { month: 'long' })} ${date.getFullYear()}`;
      if (!paidMonths.includes(monthYear)) {
        missingMonths.push(monthYear);
      }
      date.setMonth(date.getMonth() + 1);
    }
    
    return missingMonths;
  },

  getDonorPaidMonths: (donorId: string) => {
    const { income } = get();
    return income
      .filter(i => i.donorId === donorId && i.source === 'Monthly Donation')
      .map(i => i.month || '')
      .filter(month => month !== '');
  },

  changePassword: (newPassword: string) => {
    console.log('Password changed to:', newPassword);
  },

  getDefaulters: () => {
    const { donors } = get();
    return donors.filter(donor => donor.status === 'Defaulter');
  },

  getTotalDueAmount: () => {
    const { donors, getMissingMonths } = get();
    const defaulters = donors.filter(donor => donor.status === 'Defaulter');
    return defaulters.reduce((total, donor) => {
      const missingMonths = getMissingMonths(donor.id);
      return total + (missingMonths.length * donor.monthlyAmount);
    }, 0);
  }
}));

export const useMosqueStore = useStore;
