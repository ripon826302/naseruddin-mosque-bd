
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Committee, Donor, Income, Expense, User, Imam, SalaryHistory } from '@/types/mosque';
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
    jumma?: string;
    suhur?: string;
    iftar?: string;
    ramadan_mode?: boolean;
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
  
  // Imam Management
  imam: Imam[];
  addImam: (imam: Omit<Imam, 'id'>) => void;
  updateImam: (id: string, imam: Partial<Imam>) => void;
  deleteImam: (id: string) => void;
  
  // Salary History
  salaryHistory: SalaryHistory[];
  addSalaryHistory: (history: Omit<SalaryHistory, 'id'>) => void;
  
  // Calculations
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  
  // Sync functions
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
  setupRealtimeSubscription: () => void;
}

// Default settings with all prayer times
const defaultSettings: MosqueSettings = {
  name: 'বায়তুল আমান জামে মসজিদ',
  address: 'ঢাকা, বাংলাদেশ',
  phone: '01712345678',
  email: 'mosque@email.com',
  prayerTimes: {
    fajr: '5:15',
    dhuhr: '12:30',
    asr: '16:15',
    maghrib: '18:45',
    isha: '20:15',
    jumma: '13:30',
    suhur: '04:30',
    iftar: '18:30',
    ramadan_mode: false
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

const demoImam: Imam[] = [
  {
    id: '1',
    name: 'মাওলানা আব্দুল করিম',
    phone: '01712345678',
    address: 'ঢাকা, বাংলাদেশ',
    monthlySalary: 15000,
    joinDate: '2024-01-01',
    status: 'Active'
  }
];

export const useMosqueStore = create<MosqueStore>()(
  persist(
    (set, get) => ({
      // Settings
      settings: defaultSettings,
      updateSettings: async (newSettings) => {
        const updatedSettings = { ...get().settings, ...newSettings };
        set({ settings: updatedSettings });
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('mosque_settings').upsert({
              id: '1',
              name: updatedSettings.name,
              address: updatedSettings.address,
              phone: updatedSettings.phone,
              email: updatedSettings.email,
              prayer_times: updatedSettings.prayerTimes,
              updated_at: new Date().toISOString()
            });
            
            if (error) throw error;
            console.log('Settings synced to Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
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
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('notices').insert({
              id: newNotice.id,
              title: newNotice.title,
              message: newNotice.message,
              date: newNotice.date,
              type: newNotice.type
            });
            
            if (error) throw error;
            console.log('Notice synced to Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      updateNotice: async (id, notice) => {
        set((state) => ({
          notices: state.notices.map(n => n.id === id ? { ...n, ...notice } : n)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('notices').update(notice).eq('id', id);
            if (error) throw error;
            console.log('Notice updated in Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      deleteNotice: async (id) => {
        set((state) => ({
          notices: state.notices.filter(n => n.id !== id)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('notices').delete().eq('id', id);
            if (error) throw error;
            console.log('Notice deleted from Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      
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
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('committee').insert({
              id: newMember.id,
              name: newMember.name,
              role: newMember.role,
              phone: newMember.phone,
              email: newMember.email || null,
              join_date: newMember.joinDate
            });
            
            if (error) throw error;
            console.log('Committee member synced to Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      updateCommitteeMember: async (id, member) => {
        set((state) => ({
          committee: state.committee.map(m => m.id === id ? { ...m, ...member } : m)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('committee').update({
              name: member.name,
              role: member.role,
              phone: member.phone,
              email: member.email || null,
              join_date: member.joinDate
            }).eq('id', id);
            
            if (error) throw error;
            console.log('Committee member updated in Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      deleteCommitteeMember: async (id) => {
        set((state) => ({
          committee: state.committee.filter(m => m.id !== id)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('committee').delete().eq('id', id);
            if (error) throw error;
            console.log('Committee member deleted from Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      
      donors: demoDonors,
      addDonor: async (donor) => {
        const newDonor = { ...donor, id: Date.now().toString(), paymentHistory: [] };
        set((state) => ({
          donors: [...state.donors, newDonor]
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('donors').insert({
              id: newDonor.id,
              name: newDonor.name,
              phone: newDonor.phone,
              address: newDonor.address,
              monthly_amount: newDonor.monthlyAmount,
              status: newDonor.status,
              start_date: newDonor.startDate
            });
            
            if (error) throw error;
            console.log('Donor synced to Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      updateDonor: async (id, donor) => {
        set((state) => ({
          donors: state.donors.map(d => d.id === id ? { ...d, ...donor } : d)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('donors').update({
              name: donor.name,
              phone: donor.phone,
              address: donor.address,
              monthly_amount: donor.monthlyAmount,
              status: donor.status,
              start_date: donor.startDate
            }).eq('id', id);
            
            if (error) throw error;
            console.log('Donor updated in Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      deleteDonor: async (id) => {
        set((state) => ({
          donors: state.donors.filter(d => d.id !== id)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('donors').delete().eq('id', id);
            if (error) throw error;
            console.log('Donor deleted from Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
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
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('income').insert({
              id: newIncome.id,
              date: newIncome.date,
              source: newIncome.source,
              amount: newIncome.amount,
              donor_id: newIncome.donorId || null,
              month: newIncome.month || null,
              receipt_number: newIncome.receiptNumber
            });
            
            if (error) throw error;
            console.log('Income synced to Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      deleteIncome: async (id) => {
        set((state) => ({
          income: state.income.filter(i => i.id !== id)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('income').delete().eq('id', id);
            if (error) throw error;
            console.log('Income deleted from Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      
      expenses: demoExpenses,
      addExpense: async (expense) => {
        const newExpense = { ...expense, id: Date.now().toString() };
        set((state) => ({
          expenses: [...state.expenses, newExpense]
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('expenses').insert({
              id: newExpense.id,
              date: newExpense.date,
              type: newExpense.type,
              amount: newExpense.amount,
              month: newExpense.month || null
            });
            
            if (error) throw error;
            console.log('Expense synced to Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      deleteExpense: async (id) => {
        set((state) => ({
          expenses: state.expenses.filter(e => e.id !== id)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (error) throw error;
            console.log('Expense deleted from Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      
      // Imam Management
      imam: demoImam,
      addImam: async (imam) => {
        const newImam = { ...imam, id: Date.now().toString() };
        set((state) => ({
          imam: [...state.imam, newImam]
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('imam').insert({
              id: newImam.id,
              name: newImam.name,
              phone: newImam.phone,
              address: newImam.address,
              monthly_salary: newImam.monthlySalary,
              join_date: newImam.joinDate,
              status: newImam.status
            });
            
            if (error) throw error;
            console.log('Imam synced to Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      updateImam: async (id, imam) => {
        set((state) => ({
          imam: state.imam.map(i => i.id === id ? { ...i, ...imam } : i)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('imam').update({
              name: imam.name,
              phone: imam.phone,
              address: imam.address,
              monthly_salary: imam.monthlySalary,
              join_date: imam.joinDate,
              status: imam.status
            }).eq('id', id);
            
            if (error) throw error;
            console.log('Imam updated in Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      deleteImam: async (id) => {
        set((state) => ({
          imam: state.imam.filter(i => i.id !== id)
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('imam').delete().eq('id', id);
            if (error) throw error;
            console.log('Imam deleted from Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
          }
        }
      },
      
      // Salary History
      salaryHistory: [],
      addSalaryHistory: async (history) => {
        const newHistory = { ...history, id: Date.now().toString() };
        set((state) => ({
          salaryHistory: [...state.salaryHistory, newHistory]
        }));
        
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('salary_history').insert({
              id: newHistory.id,
              imam_id: newHistory.imamId,
              old_salary: newHistory.oldSalary,
              new_salary: newHistory.newSalary,
              change_date: newHistory.changeDate,
              reason: newHistory.reason
            });
            
            if (error) throw error;
            console.log('Salary history synced to Supabase successfully');
          } catch (error) {
            console.log('Supabase sync failed, using local storage only:', error);
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
        
        try {
          console.log('Force syncing all data to Supabase...');
          const state = get();
          
          await Promise.all([
            supabase.from('mosque_settings').upsert({
              id: '1',
              name: state.settings.name,
              address: state.settings.address,
              phone: state.settings.phone,
              email: state.settings.email,
              prayer_times: state.settings.prayerTimes,
              updated_at: new Date().toISOString()
            }),
            supabase.from('donors').delete().neq('id', '').then(() => 
              supabase.from('donors').insert(state.donors.map(d => ({
                id: d.id,
                name: d.name,
                phone: d.phone,
                address: d.address,
                monthly_amount: d.monthlyAmount,
                status: d.status,
                start_date: d.startDate
              })))
            ),
            supabase.from('income').delete().neq('id', '').then(() => 
              supabase.from('income').insert(state.income.map(i => ({
                id: i.id,
                date: i.date,
                source: i.source,
                amount: i.amount,
                donor_id: i.donorId || null,
                month: i.month || null,
                receipt_number: i.receiptNumber
              })))
            ),
            supabase.from('expenses').delete().neq('id', '').then(() => 
              supabase.from('expenses').insert(state.expenses.map(e => ({
                id: e.id,
                date: e.date,
                type: e.type,
                amount: e.amount,
                month: e.month || null
              })))
            ),
            supabase.from('committee').delete().neq('id', '').then(() => 
              supabase.from('committee').insert(state.committee.map(c => ({
                id: c.id,
                name: c.name,
                role: c.role,
                phone: c.phone,
                email: c.email || null,
                join_date: c.joinDate
              })))
            ),
            supabase.from('notices').delete().neq('id', '').then(() => 
              supabase.from('notices').insert(state.notices)
            ),
            supabase.from('imam').delete().neq('id', '').then(() => 
              supabase.from('imam').insert(state.imam.map(i => ({
                id: i.id,
                name: i.name,
                phone: i.phone,
                address: i.address,
                monthly_salary: i.monthlySalary,
                join_date: i.joinDate,
                status: i.status
              })))
            )
          ]);
          
          console.log('All data synced to Supabase successfully');
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
          console.log('Loading data from Supabase...');
          
          const [donorsData, incomeData, expensesData, committeeData, noticesData, settingsData, imamData] = await Promise.all([
            supabase.from('donors').select('*'),
            supabase.from('income').select('*'),
            supabase.from('expenses').select('*'),
            supabase.from('committee').select('*'),
            supabase.from('notices').select('*'),
            supabase.from('mosque_settings').select('*').limit(1).single(),
            supabase.from('imam').select('*')
          ]);
          
          if (donorsData.data && donorsData.data.length > 0) {
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
          
          if (incomeData.data && incomeData.data.length > 0) {
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
          
          if (expensesData.data && expensesData.data.length > 0) {
            const mappedExpenses = expensesData.data.map(e => ({
              id: e.id,
              date: e.date,
              type: e.type,
              amount: e.amount,
              month: e.month
            }));
            set({ expenses: mappedExpenses });
          }
          
          if (committeeData.data && committeeData.data.length > 0) {
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
          
          if (noticesData.data && noticesData.data.length > 0) {
            set({ notices: noticesData.data });
          }
          
          if (settingsData.data) {
            const mappedSettings = {
              name: settingsData.data.name,
              address: settingsData.data.address,
              phone: settingsData.data.phone,
              email: settingsData.data.email,
              prayerTimes: settingsData.data.prayer_times
            };
            set({ settings: mappedSettings });
          }
          
          if (imamData.data && imamData.data.length > 0) {
            const mappedImam = imamData.data.map(i => ({
              id: i.id,
              name: i.name,
              phone: i.phone,
              address: i.address,
              monthlySalary: i.monthly_salary,
              joinDate: i.join_date,
              status: i.status
            }));
            set({ imam: mappedImam });
          }
          
          console.log('Data loaded from Supabase successfully');
          
        } catch (error) {
          console.error('Error loading from Supabase:', error);
          console.log('Using local demo data');
        }
      },
      
      setupRealtimeSubscription: () => {
        if (!isSupabaseConfigured() || !supabase) {
          console.log('Supabase not configured, skipping realtime setup');
          return;
        }
        
        try {
          const tables = ['donors', 'income', 'expenses', 'committee', 'notices', 'mosque_settings', 'imam'];
          
          tables.forEach(table => {
            supabase
              .channel(`realtime-${table}`)
              .on('postgres_changes', 
                { event: '*', schema: 'public', table }, 
                (payload) => {
                  console.log(`${table} table changed:`, payload);
                  get().loadFromSupabase();
                }
              )
              .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                  console.log(`Realtime subscription for ${table} established`);
                } else if (status === 'CHANNEL_ERROR') {
                  console.log(`Realtime subscription error for ${table}`);
                }
              });
          });
          
        } catch (error) {
          console.error('Error setting up realtime subscriptions:', error);
        }
      }
    }),
    {
      name: 'mosque-storage'
    }
  )
);
