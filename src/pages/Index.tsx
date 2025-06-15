
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import CommitteeMembers from '@/pages/CommitteeMembers';
import IncomeManagement from '@/pages/IncomeManagement';
import ExpenseManagement from '@/pages/ExpenseManagement';
import DonorManagement from '@/pages/DonorManagement';
import Reports from '@/pages/Reports';
import NoticeBoard from '@/pages/NoticeBoard';
import Settings from '@/pages/Settings';
import ImamManagement from '@/pages/ImamManagement';
import AdvancedReports from '@/pages/AdvancedReports';
import PaymentTracking from '@/pages/PaymentTracking';
import { useMosqueStore } from '@/store/mosqueStore';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user } = useMosqueStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'committee':
        return <CommitteeMembers />;
      case 'income':
        return <IncomeManagement />;
      case 'expense':
        return <ExpenseManagement />;
      case 'donors':
        return <DonorManagement />;
      case 'imams':
        return <ImamManagement />;
      case 'reports':
        return <Reports />;
      case 'advanced-reports':
        return <AdvancedReports />;
      case 'payment-tracking':
        return <PaymentTracking />;
      case 'notices':
        return <NoticeBoard />;
      case 'settings':
        return <Settings />;
      case 'login':
        return <Login onLogin={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard />;
    }
  };

  if (currentPage === 'login') {
    return <Login onLogin={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden h-16"></div>
        <div className="min-h-screen">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default Index;
