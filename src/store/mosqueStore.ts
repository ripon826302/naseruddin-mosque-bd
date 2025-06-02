
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Committee, Donor, Income, Expense, Event, User } from '@/types/mosque';

interface MosqueStore {
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
  
  // Events
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  // Calculations
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
}

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

export const useMosqueStore = create<MosqueStore>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (username: string, password: string) => {
        // Demo login - admin/admin123 or viewer/viewer123
        if ((username === 'admin' && password === 'admin123') || 
            (username === 'viewer' && password === 'viewer123')) {
          const user: User = {
            id: '1',
            username,
            role: username === 'admin' ? 'admin' : 'viewer',
            name: username === 'admin' ? 'Admin User' : 'Viewer User'
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      
      // Committee
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
      
      // Donors
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
      
      // Income
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
      
      // Expenses
      expenses: demoExpenses,
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: Date.now().toString() }]
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),
      
      // Events
      events: [],
      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: Date.now().toString() }]
      })),
      updateEvent: (id, event) => set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...event } : e)
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),
      
      // Calculations
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
