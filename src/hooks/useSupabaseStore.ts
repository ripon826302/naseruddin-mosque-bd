import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMosqueStore } from '@/store/mosqueStore';

export const useSupabaseStore = () => {
  const store = useMosqueStore();

  useEffect(() => {
    if (!supabase) return;

    // Load initial data from Supabase
    const loadData = async () => {
      try {
        // Load donors
        const { data: donors } = await supabase.from('donors').select('*');
        if (donors) {
          donors.forEach(donor => {
            store.addDonor({
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
        const { data: income } = await supabase.from('income').select('*');
        if (income) {
          income.forEach(inc => {
            store.addIncome({
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
        const { data: expenses } = await supabase.from('expenses').select('*');
        if (expenses) {
          expenses.forEach(exp => {
            store.addExpense({
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
        const { data: committee } = await supabase.from('committee').select('*');
        if (committee) {
          committee.forEach(member => {
            store.addCommitteeMember({
              name: member.name,
              role: member.role,
              phone: member.phone,
              email: member.email || undefined,
              joinDate: member.join_date
            });
          });
        }

        // Load notices
        const { data: notices } = await supabase.from('notices').select('*');
        if (notices) {
          notices.forEach(notice => {
            store.addNotice({
              title: notice.title,
              message: notice.message,
              type: notice.type as any
            });
          });
        }

      } catch (error) {
        console.error('Error loading data from Supabase:', error);
      }
    };

    loadData();

    // Set up realtime listeners
    const donorsChannel = supabase
      .channel('donors-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'donors'
      }, (payload) => {
        console.log('Donors realtime update:', payload);
        // Reload data on changes
        loadData();
      })
      .subscribe();

    const incomeChannel = supabase
      .channel('income-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'income'
      }, (payload) => {
        console.log('Income realtime update:', payload);
        loadData();
      })
      .subscribe();

    const expensesChannel = supabase
      .channel('expenses-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses'
      }, (payload) => {
        console.log('Expenses realtime update:', payload);
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(donorsChannel);
      supabase.removeChannel(incomeChannel);
      supabase.removeChannel(expensesChannel);
    };
  }, []);
};