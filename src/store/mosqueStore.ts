import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notice {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  date: string;
  isMarquee?: boolean;
  marqueeSettings?: {
    speed: number;
    fontSize: number;
    textColor: string;
  };
}

interface Donor {
  id: string;
  name: string;
  phone: string;
  address: string;
  monthlyAmount: number;
  status: 'Active' | 'Inactive';
  joinDate: string;
  payments: Payment[];
}

interface Payment {
  id: string;
  donorId: string;
  amount: number;
  month: string;
  year: number;
  date: string;
  method: 'Cash' | 'Bank Transfer' | 'Mobile Banking';
  status: 'Paid' | 'Pending' | 'Overdue';
}

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  joinDate: string;
}

interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  category: 'Donation' | 'Monthly Subscription' | 'Event' | 'Other';
  description?: string;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  type: 'Utility' | 'Maintenance' | 'Imam Salary' | 'Event' | 'Other';
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
  description: string;
  date: string;
  time: string;
  type: 'Religious' | 'Educational' | 'Social' | 'Fundraising';
  organizer: string;
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';
}

interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  prayerTime: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Jumma';
  present: boolean;
  notes?: string;
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
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

interface MosqueStore {
  // State
  settings: Settings;
  donors: Donor[];
  committee: CommitteeMember[];
  income: Income[];
  expenses: Expense[];
  notices: Notice[];
  imams: Imam[];
  events: Event[];
  attendance: AttendanceRecord[];
  user: User | null;

  // Actions
  updateSettings: (settings: Partial<Settings>) => void;
  addDonor: (donor: Omit<Donor, 'id'>) => void;
  updateDonor: (id: string, donor: Partial<Donor>) => void;
  deleteDonor: (id: string) => void;
  addCommitteeMember: (member: Omit<CommitteeMember, 'id'>) => void;
  updateCommitteeMember: (id: string, member: Partial<CommitteeMember>) => void;
  deleteCommitteeMember: (id: string) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  addImam: (imam: Omit<Imam, 'id'>) => void;
  updateImam: (id: string, imam: Partial<Imam>) => void;
  deleteImam: (id: string) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (id: string, record: Partial<AttendanceRecord>) => void;
  deleteAttendance: (id: string) => void;
  setUser: (user: User | null) => void;
  
  // Computed values
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getDefaulters: () => Donor[];
  getMissingMonths: (donorId: string) => string[];
  getTotalDueAmount: () => number;
}

const initialState = {
  settings: {
    name: 'আল-আমিন জামে মসজিদ',
    address: 'ঢাকা, বাংলাদেশ',
    phone: '+880 1XXX-XXXXXX',
    email: 'info@alaminmosque.org',
    prayerTimes: {
      fajr: '05:30',
      dhuhr: '12:15',
      asr: '16:30',
      maghrib: '17:45',
      isha: '19:00'
    }
  },
  donors: [],
  committee: [],
  income: [],
  expenses: [],
  notices: [
    {
      id: '1',
      title: 'জুমার নামাজের সময় পরিবর্তন',
      message: 'আগামী সপ্তাহ থেকে জুমার নামাজের সময় দুপুর ১:০০ টায় অনুষ্ঠিত হবে।',
      type: 'info' as const,
      date: new Date().toISOString(),
      isMarquee: true,
      marqueeSettings: {
        speed: 15,
        fontSize: 18,
        textColor: '#ffffff'
      }
    }
  ],
  imams: [],
  events: [],
  attendance: [],
  user: { id: '1', name: 'অ্যাডমিন', email: 'admin@mosque.org', role: 'admin' }
};

export const useMosqueStore = create<MosqueStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings }
        })),

      addDonor: (donor) =>
        set((state) => ({
          donors: [...state.donors, { ...donor, id: Date.now().toString() }]
        })),

      updateDonor: (id, donor) =>
        set((state) => ({
          donors: state.donors.map((d) => d.id === id ? { ...d, ...donor } : d)
        })),

      deleteDonor: (id) =>
        set((state) => ({
          donors: state.donors.filter((d) => d.id !== id)
        })),

      addCommitteeMember: (member) =>
        set((state) => ({
          committee: [...state.committee, { ...member, id: Date.now().toString() }]
        })),

      updateCommitteeMember: (id, member) =>
        set((state) => ({
          committee: state.committee.map((m) => m.id === id ? { ...m, ...member } : m)
        })),

      deleteCommitteeMember: (id) =>
        set((state) => ({
          committee: state.committee.filter((m) => m.id !== id)
        })),

      addIncome: (income) =>
        set((state) => ({
          income: [...state.income, { ...income, id: Date.now().toString() }]
        })),

      updateIncome: (id, income) =>
        set((state) => ({
          income: state.income.map((i) => i.id === id ? { ...i, ...income } : i)
        })),

      deleteIncome: (id) =>
        set((state) => ({
          income: state.income.filter((i) => i.id !== id)
        })),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: Date.now().toString() }]
        })),

      updateExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) => e.id === id ? { ...e, ...expense } : e)
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id)
        })),

      addNotice: (notice) =>
        set((state) => ({
          notices: [...state.notices, { 
            ...notice, 
            id: Date.now().toString(), 
            date: new Date().toISOString() 
          }]
        })),

      updateNotice: (id, notice) =>
        set((state) => ({
          notices: state.notices.map((n) => n.id === id ? { ...n, ...notice } : n)
        })),

      deleteNotice: (id) =>
        set((state) => ({
          notices: state.notices.filter((n) => n.id !== id)
        })),

      addImam: (imam) =>
        set((state) => ({
          imams: [...state.imams, { ...imam, id: Date.now().toString() }]
        })),

      updateImam: (id, imam) =>
        set((state) => ({
          imams: state.imams.map((i) => i.id === id ? { ...i, ...imam } : i)
        })),

      deleteImam: (id) =>
        set((state) => ({
          imams: state.imams.filter((i) => i.id !== id)
        })),

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: Date.now().toString() }]
        })),

      updateEvent: (id, event) =>
        set((state) => ({
          events: state.events.map((e) => e.id === id ? { ...e, ...event } : e)
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id)
        })),

      addAttendance: (record) =>
        set((state) => ({
          attendance: [...state.attendance, { ...record, id: Date.now().toString() }]
        })),

      updateAttendance: (id, record) =>
        set((state) => ({
          attendance: state.attendance.map((a) => a.id === id ? { ...a, ...record } : a)
        })),

      deleteAttendance: (id) =>
        set((state) => ({
          attendance: state.attendance.filter((a) => a.id !== id)
        })),

      setUser: (user) => set({ user }),

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

      getDefaulters: () => {
        const { donors } = get();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        return donors.filter(donor => {
          const hasCurrentMonthPayment = donor.payments.some(payment => 
            payment.month === currentMonth.toString() && 
            payment.year === currentYear &&
            payment.status === 'Paid'
          );
          return !hasCurrentMonthPayment && donor.status === 'Active';
        });
      },

      getMissingMonths: (donorId: string) => {
        const { donors } = get();
        const donor = donors.find(d => d.id === donorId);
        if (!donor) return [];

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
        const missingMonths: string[] = [];
        const monthNames = [
          'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
          'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
        ];

        for (let month = 0; month <= currentMonth; month++) {
          const hasPayment = donor.payments.some(payment => 
            payment.month === month.toString() && 
            payment.year === currentYear &&
            payment.status === 'Paid'
          );
          
          if (!hasPayment) {
            missingMonths.push(monthNames[month]);
          }
        }

        return missingMonths;
      },

      getTotalDueAmount: () => {
        const { getDefaulters } = get();
        const defaulters = getDefaulters();
        
        return defaulters.reduce((total, donor) => {
          const { getMissingMonths } = get();
          const missingMonths = getMissingMonths(donor.id);
          return total + (missingMonths.length * donor.monthlyAmount);
        }, 0);
      }
    }),
    {
      name: 'mosque-storage'
    }
  )
);
