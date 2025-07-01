
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMosqueStore } from '@/store/mosqueStore';

export const useRealtime = () => {
  const store = useMosqueStore();

  useEffect(() => {
    if (!supabase) return;

    // Listen to donors table changes
    const donorsChannel = supabase
      .channel('donors-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'donors'
      }, (payload) => {
        console.log('Donors realtime update:', payload);
        // Refresh donors data when change occurs
        window.location.reload();
      })
      .subscribe();

    // Listen to income table changes
    const incomeChannel = supabase
      .channel('income-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'income'
      }, (payload) => {
        console.log('Income realtime update:', payload);
        window.location.reload();
      })
      .subscribe();

    // Listen to expenses table changes
    const expensesChannel = supabase
      .channel('expenses-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses'
      }, (payload) => {
        console.log('Expenses realtime update:', payload);
        window.location.reload();
      })
      .subscribe();

    // Listen to committee table changes
    const committeeChannel = supabase
      .channel('committee-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'committee'
      }, (payload) => {
        console.log('Committee realtime update:', payload);
        window.location.reload();
      })
      .subscribe();

    // Listen to notices table changes
    const noticesChannel = supabase
      .channel('notices-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notices'
      }, (payload) => {
        console.log('Notices realtime update:', payload);
        window.location.reload();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(donorsChannel);
      supabase.removeChannel(incomeChannel);
      supabase.removeChannel(expensesChannel);
      supabase.removeChannel(committeeChannel);
      supabase.removeChannel(noticesChannel);
    };
  }, []);
};
