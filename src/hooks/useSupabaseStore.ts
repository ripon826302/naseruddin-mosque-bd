
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';

export const useSupabaseStore = () => {
  const store = useMosqueStore();

  useEffect(() => {
    if (!supabase) return;

    // Load initial data from Supabase
    const loadData = async () => {
      try {
        console.log('Loading data from Supabase...');

        // Load donors
        const { data: donors, error: donorsError } = await supabase
          .from('donors')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (donorsError) {
          console.error('Donors fetch error:', donorsError);
        } else if (donors && donors.length > 0) {
          console.log(`Loaded ${donors.length} donors`);
          store.clearDonors();
          donors.forEach(donor => {
            store.addDonor({
              id: donor.id,
              name: donor.name,
              phone: donor.phone,
              address: donor.address,
              monthlyAmount: donor.monthly_amount,
              status: donor.status as any,
              joinDate: donor.start_date,
              startDate: donor.start_date,
              payments: [],
              paymentHistory: []
            });
          });
        }

        // Load income
        const { data: income, error: incomeError } = await supabase
          .from('income')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (incomeError) {
          console.error('Income fetch error:', incomeError);
        } else if (income && income.length > 0) {
          console.log(`Loaded ${income.length} income records`);
          store.clearIncome();
          income.forEach(inc => {
            store.addIncome({
              id: inc.id,
              source: inc.source,
              amount: inc.amount,
              date: inc.date,
              category: inc.source as any,
              description: '',
              donorId: inc.donor_id || undefined,
              month: inc.month || undefined,
              receiptNumber: inc.receipt_number
            });
          });
        }

        // Load expenses
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (expensesError) {
          console.error('Expenses fetch error:', expensesError);
        } else if (expenses && expenses.length > 0) {
          console.log(`Loaded ${expenses.length} expense records`);
          store.clearExpenses();
          expenses.forEach(exp => {
            store.addExpense({
              id: exp.id,
              category: exp.type,
              amount: exp.amount,
              date: exp.date,
              description: exp.description || '',
              type: exp.type as any,
              month: exp.month || undefined,
              imamId: exp.imam_id || undefined
            });
          });
        }

        // Load committee
        const { data: committee, error: committeeError } = await supabase
          .from('committee')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (committeeError) {
          console.error('Committee fetch error:', committeeError);
        } else if (committee && committee.length > 0) {
          console.log(`Loaded ${committee.length} committee members`);
          store.clearCommittee();
          committee.forEach(member => {
            store.addCommitteeMember({
              id: member.id,
              name: member.name,
              role: member.role,
              phone: member.phone,
              email: member.email || undefined,
              joinDate: member.join_date
            });
          });
        }

        // Load notices
        const { data: notices, error: noticesError } = await supabase
          .from('notices')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (noticesError) {
          console.error('Notices fetch error:', noticesError);
        } else if (notices && notices.length > 0) {
          console.log(`Loaded ${notices.length} notices`);
          store.clearNotices();
          notices.forEach(notice => {
            store.addNotice({
              id: notice.id,
              title: notice.title,
              message: notice.message,
              type: notice.type as any,
              date: notice.date
            });
          });
        }

        console.log('Data loading completed successfully');

      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        toast({
          title: "ডাটা লোড করতে সমস্যা",
          description: "ডাটাবেজ থেকে তথ্য লোড করতে সমস্যা হয়েছে।",
          variant: "destructive",
        });
      }
    };

    // Listen for data refresh events
    const handleDataRefresh = () => {
      loadData();
    };

    window.addEventListener('dataRefresh', handleDataRefresh);
    
    // Load data immediately
    loadData();

    return () => {
      window.removeEventListener('dataRefresh', handleDataRefresh);
    };
  }, []);
};
