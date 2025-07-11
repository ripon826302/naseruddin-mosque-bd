import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import CommitteeMembers from '@/pages/CommitteeMembers';
import IncomeManagementPage from '@/pages/IncomeManagementPage';
import ExpenseManagementPage from '@/pages/ExpenseManagementPage';
import DonorManagementPage from '@/pages/DonorManagementPage';
import ReportsPage from '@/pages/ReportsPage';
import NoticeBoardPage from '@/pages/NoticeBoardPage';
import SettingsPage from '@/pages/SettingsPage';
import ImamManagementPage from '@/pages/ImamManagementPage';
import AdvancedReportsPage from '@/pages/AdvancedReportsPage';
import PaymentTrackingPage from '@/pages/PaymentTrackingPage';
import AttendanceManagement from '@/pages/AttendanceManagement';
import EventManagement from '@/pages/EventManagement';
import Settings from '@/pages/Settings';
import { useMosqueStore } from '@/store/mosqueStore';
import { useSupabaseStore } from '@/hooks/useSupabaseStore';
import { useRealtime } from '@/hooks/useRealtime';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, logout } = useMosqueStore();
  
  // Initialize Supabase integration and realtime updates
  useSupabaseStore();
  useRealtime();

  // Start in viewer mode by default (no login required for viewing)
  useEffect(() => {
    // Keep user as null (viewer mode) initially
    if (user && user.role) {
      // User is logged in, keep them logged in
    } else {
      // Set to viewer mode
      logout();
    }
  }, []);

  useEffect(() => {
    const handleToggleNav = () => {
      setIsNavOpen(prev => !prev);
    };

    window.addEventListener('toggleNav', handleToggleNav);
    return () => window.removeEventListener('toggleNav', handleToggleNav);
  }, []);

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'committee':
        return <CommitteeMembers onBack={handleBackToDashboard} />;
      case 'income':
        return <IncomeManagementPage onBack={handleBackToDashboard} />;
      case 'expense':
        return <ExpenseManagementPage onBack={handleBackToDashboard} />;
      case 'donors':
        return <DonorManagementPage onBack={handleBackToDashboard} />;
      case 'imams':
        return <ImamManagementPage onBack={handleBackToDashboard} />;
      case 'reports':
        return <ReportsPage onBack={handleBackToDashboard} />;
      case 'advanced-reports':
        return <AdvancedReportsPage onBack={handleBackToDashboard} />;
      case 'payment-tracking':
        return <PaymentTrackingPage onBack={handleBackToDashboard} />;
      case 'attendance':
        return <AttendanceManagement onBack={handleBackToDashboard} />;
      case 'events':
        return <EventManagement onBack={handleBackToDashboard} />;
      case 'notices':
        return <NoticeBoardPage onBack={handleBackToDashboard} />;
      case 'settings':
        return <Settings onBack={handleBackToDashboard} />;
      case 'login':
        return <Login onLogin={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  if (currentPage === 'login') {
    return <Login onLogin={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isOpen={isNavOpen}
        setIsOpen={setIsNavOpen}
      />
      <div className="flex-1 lg:ml-0">
        <div className="min-h-screen">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default Index;
