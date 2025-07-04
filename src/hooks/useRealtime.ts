
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtime = () => {
  useEffect(() => {
    if (!supabase) return;

    const channels: any[] = [];

    // Create separate channels for each table to avoid subscription conflicts
    const donorsChannel = supabase
      .channel(`donors-changes-${Date.now()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'donors'
      }, (payload) => {
        console.log('Donors realtime update:', payload);
        // Refresh data without full page reload
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dataRefresh'));
        }, 1000);
      });

    const incomeChannel = supabase
      .channel(`income-changes-${Date.now()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'income'
      }, (payload) => {
        console.log('Income realtime update:', payload);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dataRefresh'));
        }, 1000);
      });

    const expensesChannel = supabase
      .channel(`expenses-changes-${Date.now()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses'
      }, (payload) => {
        console.log('Expenses realtime update:', payload);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dataRefresh'));
        }, 1000);
      });

    const committeeChannel = supabase
      .channel(`committee-changes-${Date.now()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'committee'
      }, (payload) => {
        console.log('Committee realtime update:', payload);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dataRefresh'));
        }, 1000);
      });

    const noticesChannel = supabase
      .channel(`notices-changes-${Date.now()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notices'
      }, (payload) => {
        console.log('Notices realtime update:', payload);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dataRefresh'));
        }, 1000);
      });

    // Subscribe to all channels
    const subscribeChannels = async () => {
      try {
        await donorsChannel.subscribe();
        await incomeChannel.subscribe();
        await expensesChannel.subscribe();
        await committeeChannel.subscribe();
        await noticesChannel.subscribe();
        
        channels.push(donorsChannel, incomeChannel, expensesChannel, committeeChannel, noticesChannel);
      } catch (error) {
        console.error('Realtime subscription error:', error);
      }
    };

    subscribeChannels();

    return () => {
      channels.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Channel cleanup error:', error);
        }
      });
    };
  }, []);
};
