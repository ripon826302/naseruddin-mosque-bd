
import React, { useState, useEffect } from 'react';
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
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useMosqueStore();

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
        return <Dashboard currentPage={currentPage} onPageChange={setCurrentPage} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />;
      case 'committee':
        return <CommitteeMembers onBack={handleBackToDashboard} />;
      case 'income':
        return <IncomeManagement onBack={handleBackToDashboard} />;
      case 'expense':
        return <ExpenseManagement onBack={handleBackToDashboard} />;
      case 'donors':
        return <DonorManagement onBack={handleBackToDashboard} />;
      case 'imams':
        return <ImamManagement onBack={handleBackToDashboard} />;
      case 'reports':
        return <Reports onBack={handleBackToDashboard} />;
      case 'advanced-reports':
        return <AdvancedReports onBack={handleBackToDashboard} />;
      case 'payment-tracking':
        return <PaymentTracking onBack={handleBackToDashboard} />;
      case 'notices':
        return <NoticeBoard onBack={handleBackToDashboard} />;
      case 'settings':
        return <Settings onBack={handleBackToDashboard} />;
      case 'login':
        return <Login onLogin={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard currentPage={currentPage} onPageChange={setCurrentPage} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />;
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
