import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Donor {
  id: string;
  name: string;
  phone: string;
  address: string;
  monthlyAmount: number;
  status: 'Active' | 'Inactive' | 'Pending';
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
}

interface Settings {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface MosqueStore {
  donors: Donor[];
  income: Income[];
  expenses: Expense[];
  committee: CommitteeMember[];
  notices: Notice[];
  settings: Settings;
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
  addDonor: (donor: Donor) => void;
  updateDonor: (id: string, updates: Partial<Donor>) => void;
  deleteDonor: (id: string) => void;
  clearDonors: () => void;
  addIncome: (income: Income) => void;
  updateIncome: (id: string, updates: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  clearIncome: () => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void;
  addCommitteeMember: (member: CommitteeMember) => void;
  updateCommitteeMember: (id: string, updates: Partial<CommitteeMember>) => void;
  deleteCommitteeMember: (id: string) => void;
  clearCommittee: () => void;
  addNotice: (notice: Notice) => void;
  updateNotice: (id: string, updates: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  clearNotices: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
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
      settings: {
        name: 'মসজিদ কমিটি',
        address: 'example ঠিকানা',
        phone: '017XXXXXXXXX',
        email: 'example@gmail.com',
      },
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Donors
      addDonor: (donor) => set((state) => ({
        donors: [...state.donors, { ...donor, id: donor.id || generateId() }],
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
        income: [...state.income, { ...income, id: income.id || generateId() }],
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
        expenses: [...state.expenses, { ...expense, id: expense.id || generateId() }],
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
        committee: [...state.committee, { ...member, id: member.id || generateId() }],
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
        notices: [...state.notices, { ...notice, id: notice.id || generateId(), date: notice.date || new Date().toISOString().split('T')[0] }],
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

      // Settings
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates },
      })),
      getTotalIncome: () => {
        return get().income.reduce((sum, inc) => sum + inc.amount, 0);
      },
      getTotalExpenses: () => {
        return get().expenses.reduce((sum, exp) => sum + exp.amount, 0);
      },
      getBalance: () => {
        return get().getTotalIncome() - get().getTotalExpenses();
      },
    }),
    {
      name: 'mosque-storage',
      version: 1,
    }
  )
);

export { useMosqueStore };
