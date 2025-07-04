
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';

export const useSupabaseData = () => {
  const store = useMosqueStore();

  // Save donor to Supabase
  const saveDonorToSupabase = useCallback(async (donor: any) => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    try {
      const { error } = await supabase.from('donors').insert({
        id: donor.id,
        name: donor.name,
        phone: donor.phone,
        address: donor.address,
        monthly_amount: donor.monthlyAmount,
        status: donor.status,
        start_date: donor.startDate
      });
      
      if (error) {
        console.error('Donor save error:', error);
        throw error;
      }
      
      toast({
        title: "সফল!",
        description: "দাতার তথ্য সংরক্ষিত হয়েছে।",
      });
    } catch (error) {
      console.error('Donor save error:', error);
      toast({
        title: "ত্রুটি!",
        description: "দাতার তথ্য সংরক্ষণ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  }, []);

  // Save income to Supabase
  const saveIncomeToSupabase = useCallback(async (income: any) => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    try {
      const { error } = await supabase.from('income').insert({
        id: income.id,
        source: income.source,
        amount: income.amount,
        date: income.date,
        receipt_number: income.receiptNumber,
        donor_id: income.donorId,
        month: income.month
      });
      
      if (error) {
        console.error('Income save error:', error);
        throw error;
      }
      
      toast({
        title: "সফল!",
        description: "আয়ের তথ্য সংরক্ষিত হয়েছে।",
      });
    } catch (error) {
      console.error('Income save error:', error);
      toast({
        title: "ত্রুটি!",
        description: "আয়ের তথ্য সংরক্ষণ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  }, []);

  // Save expense to Supabase
  const saveExpenseToSupabase = useCallback(async (expense: any) => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    try {
      const { error } = await supabase.from('expenses').insert({
        id: expense.id,
        type: expense.type,
        amount: expense.amount,
        date: expense.date,
        description: expense.description,
        month: expense.month,
        imam_id: expense.imamId
      });
      
      if (error) {
        console.error('Expense save error:', error);
        throw error;
      }
      
      toast({
        title: "সফল!",
        description: "ব্যয়ের তথ্য সংরক্ষিত হয়েছে।",
      });
    } catch (error) {
      console.error('Expense save error:', error);
      toast({
        title: "ত্রুটি!",
        description: "ব্যয়ের তথ্য সংরক্ষণ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  }, []);

  // Save committee member to Supabase
  const saveCommitteeToSupabase = useCallback(async (member: any) => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    try {
      const { error } = await supabase.from('committee').insert({
        id: member.id,
        name: member.name,
        role: member.role,
        phone: member.phone,
        email: member.email,
        join_date: member.joinDate
      });
      
      if (error) {
        console.error('Committee save error:', error);
        throw error;
      }
      
      toast({
        title: "সফল!",
        description: "কমিটি সদস্যের তথ্য সংরক্ষিত হয়েছে।",
      });
    } catch (error) {
      console.error('Committee save error:', error);
      toast({
        title: "ত্রুটি!",
        description: "কমিটি সদস্যের তথ্য সংরক্ষণ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  }, []);

  // Save notice to Supabase
  const saveNoticeToSupabase = useCallback(async (notice: any) => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    try {
      const { error } = await supabase.from('notices').insert({
        id: notice.id,
        title: notice.title,
        message: notice.message,
        type: notice.type,
        date: notice.date
      });
      
      if (error) {
        console.error('Notice save error:', error);
        throw error;
      }
      
      toast({
        title: "সফল!",
        description: "নোটিশ সংরক্ষিত হয়েছে।",
      });
    } catch (error) {
      console.error('Notice save error:', error);
      toast({
        title: "ত্রুটি!",
        description: "নোটিশ সংরক্ষণ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  }, []);

  return {
    saveDonorToSupabase,
    saveIncomeToSupabase,
    saveExpenseToSupabase,
    saveCommitteeToSupabase,
    saveNoticeToSupabase
  };
};
