
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Committee, Donor, Income, Expense, User } from '@/types/mosque';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

interface AuthCredentials {
  username: string;
  password: string;
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
  adminCredentials: AuthCredentials;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
  
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
  getMissingMonths: (donorId: string) => string[];
  getDonorPaidMonths: (donorId: string) => string[];
  
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
  
  // Sync functions
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
  setupRealtimeSubscription: () => void;
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
    paymentHistory: [],
    startDate: '2024-01-01'
  },
  {
    id: '2',
    name: 'মোহাম্মদ হাসান',
    phone: '01812345678',
    address: 'চট্টগ্রাম',
    monthlyAmount: 3000,
    status: 'Defaulter',
    paymentHistory: [],
    startDate: '2024-02-01'
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
      updateSettings: async (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('mosque_settings').upsert({
              id: '1',
              name: get().settings.name,
              address: get().settings.address,
              phone: get().settings.phone,
              email: get().settings.email,
              prayer_times: get().settings.prayerTimes,
              updated_at: new Date().toISOString()
            });
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      
      // Notices
      notices: demoNotices,
      addNotice: async (notice) => {
        const newNotice = { 
          ...notice, 
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0]
        };
        
        set((state) => ({
          notices: [...state.notices, newNotice]
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('notices').insert({
              id: newNotice.id,
              title: newNotice.title,
              message: newNotice.message,
              date: newNotice.date,
              type: newNotice.type
            });
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      updateNotice: async (id, notice) => {
        set((state) => ({
          notices: state.notices.map(n => n.id === id ? { ...n, ...notice } : n)
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('notices').update(notice).eq('id', id);
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      deleteNotice: async (id) => {
        set((state) => ({
          notices: state.notices.filter(n => n.id !== id)
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('notices').delete().eq('id', id);
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      
      // Auth - Start as viewer
      user: { id: 'viewer', username: 'viewer', role: 'viewer', name: 'দর্শক' },
      isAuthenticated: true,
      adminCredentials: { username: 'admin', password: 'admin123' },
      login: (username: string, password: string) => {
        const { adminCredentials } = get();
        if (username === adminCredentials.username && password === adminCredentials.password) {
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
      changePassword: (newPassword: string) => set((state) => ({
        adminCredentials: { ...state.adminCredentials, password: newPassword }
      })),
      
      committee: demoCommittee,
      addCommitteeMember: async (member) => {
        const newMember = { ...member, id: Date.now().toString() };
        set((state) => ({
          committee: [...state.committee, newMember]
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('committee').insert({
              id: newMember.id,
              name: newMember.name,
              role: newMember.role,
              phone: newMember.phone,
              email: newMember.email || null,
              join_date: newMember.joinDate
            });
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      updateCommitteeMember: async (id, member) => {
        set((state) => ({
          committee: state.committee.map(m => m.id === id ? { ...m, ...member } : m)
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('committee').update({
              name: member.name,
              role: member.role,
              phone: member.phone,
              email: member.email || null,
              join_date: member.joinDate
            }).eq('id', id);
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      deleteCommitteeMember: async (id) => {
        set((state) => ({
          committee: state.committee.filter(m => m.id !== id)
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('committee').delete().eq('id', id);
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      
      donors: demoDonors,
      addDonor: async (donor) => {
        const newDonor = { ...donor, id: Date.now().toString(), paymentHistory: [] };
        set((state) => ({
          donors: [...state.donors, newDonor]
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('donors').insert({
              id: newDonor.id,
              name: newDonor.name,
              phone: newDonor.phone,
              address: newDonor.address,
              monthly_amount: newDonor.monthlyAmount,
              status: newDonor.status,
              start_date: newDonor.startDate
            });
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      updateDonor: async (id, donor) => {
        set((state) => ({
          donors: state.donors.map(d => d.id === id ? { ...d, ...donor } : d)
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('donors').update({
              name: donor.name,
              phone: donor.phone,
              address: donor.address,
              monthly_amount: donor.monthlyAmount,
              status: donor.status,
              start_date: donor.startDate
            }).eq('id', id);
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      deleteDonor: async (id) => {
        set((state) => ({
          donors: state.donors.filter(d => d.id !== id)
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('donors').delete().eq('id', id);
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
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
          .sort();
      },
      
      income: demoIncome,
      addIncome: async (income) => {
        const receiptNumber = `RCP${String(get().income.length + 1).padStart(3, '0')}`;
        const newIncome = { ...income, id: Date.now().toString(), receiptNumber };
        
        set((state) => ({
          income: [...state.income, newIncome]
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('income').insert({
              id: newIncome.id,
              date: newIncome.date,
              source: newIncome.source,
              amount: newIncome.amount,
              donor_id: newIncome.donorId || null,
              month: newIncome.month || null,
              receipt_number: newIncome.receiptNumber
            });
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      deleteIncome: async (id) => {
        set((state) => ({
          income: state.income.filter(i => i.id !== id)
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('income').delete().eq('id', id);
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      
      expenses: demoExpenses,
      addExpense: async (expense) => {
        const newExpense = { ...expense, id: Date.now().toString() };
        set((state) => ({
          expenses: [...state.expenses, newExpense]
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('expenses').insert({
              id: newExpense.id,
              date: newExpense.date,
              type: newExpense.type,
              amount: newExpense.amount,
              month: newExpense.month || null
            });
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
      },
      deleteExpense: async (id) => {
        set((state) => ({
          expenses: state.expenses.filter(e => e.id !== id)
        }));
        
        // Sync to Supabase only if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('expenses').delete().eq('id', id);
          } catch (error) {
            console.log('Supabase not configured, using local storage only');
          }
        }
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
      
      // Sync functions
      syncToSupabase: async () => {
        if (!isSupabaseConfigured() || !supabase) {
          console.log('Supabase not configured, skipping sync');
          return;
        }
        
        const state = get();
        try {
          console.log('Syncing to Supabase...');
        } catch (error) {
          console.error('Error syncing to Supabase:', error);
        }
      },
      
      loadFromSupabase: async () => {
        if (!isSupabaseConfigured() || !supabase) {
          console.log('Supabase not configured, using local data only');
          return;
        }
        
        try {
          // Load all data from Supabase
          const [donorsData, incomeData, expensesData, committeeData, noticesData] = await Promise.all([
            supabase.from('donors').select('*'),
            supabase.from('income').select('*'),
            supabase.from('expenses').select('*'),
            supabase.from('committee').select('*'),
            supabase.from('notices').select('*')
          ]);
          
          if (donorsData.data) {
            const mappedDonors = donorsData.data.map(d => ({
              id: d.id,
              name: d.name,
              phone: d.phone,
              address: d.address,
              monthlyAmount: d.monthly_amount,
              status: d.status,
              startDate: d.start_date,
              paymentHistory: []
            }));
            set({ donors: mappedDonors });
          }
          
          if (incomeData.data) {
            const mappedIncome = incomeData.data.map(i => ({
              id: i.id,
              date: i.date,
              source: i.source,
              amount: i.amount,
              donorId: i.donor_id,
              month: i.month,
              receiptNumber: i.receipt_number
            }));
            set({ income: mappedIncome });
          }
          
          if (expensesData.data) {
            const mappedExpenses = expensesData.data.map(e => ({
              id: e.id,
              date: e.date,
              type: e.type,
              amount: e.amount,
              month: e.month
            }));
            set({ expenses: mappedExpenses });
          }
          
          if (committeeData.data) {
            const mappedCommittee = committeeData.data.map(c => ({
              id: c.id,
              name: c.name,
              role: c.role,
              phone: c.phone,
              email: c.email || '',
              joinDate: c.join_date
            }));
            set({ committee: mappedCommittee });
          }
          
          if (noticesData.data) {
            set({ notices: noticesData.data });
          }
          
        } catch (error) {
          console.error('Error loading from Supabase:', error);
        }
      },
      
      setupRealtimeSubscription: () => {
        if (!isSupabaseConfigured() || !supabase) {
          console.log('Supabase not configured, skipping realtime setup');
          return;
        }
        
        // Setup realtime subscriptions for all tables
        const channels = [
          supabase.channel('donors').on('postgres_changes', { event: '*', schema: 'public', table: 'donors' }, () => {
            get().loadFromSupabase();
          }),
          supabase.channel('income').on('postgres_changes', { event: '*', schema: 'public', table: 'income' }, () => {
            get().loadFromSupabase();
          }),
          supabase.channel('expenses').on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
            get().loadFromSupabase();
          }),
          supabase.channel('committee').on('postgres_changes', { event: '*', schema: 'public', table: 'committee' }, () => {
            get().loadFromSupabase();
          }),
          supabase.channel('notices').on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
            get().loadFromSupabase();
          })
        ];
        
        channels.forEach(channel => channel.subscribe());
      }
    }),
    {
      name: 'mosque-storage'
    }
  )
);
