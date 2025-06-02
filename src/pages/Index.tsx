
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import CommitteeMembers from '@/pages/CommitteeMembers';
import IncomeManagement from '@/pages/IncomeManagement';
import ExpenseManagement from '@/pages/ExpenseManagement';
import DonorManagement from '@/pages/DonorManagement';
import { useMosqueStore } from '@/store/mosqueStore';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { isAuthenticated } = useMosqueStore();

  if (!isAuthenticated) {
    return <Login onLogin={() => setCurrentPage('dashboard')} />;
  }

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
      case 'reports':
        return <div className="p-6"><h1 className="text-2xl font-bold">Reports - Coming Soon</h1></div>;
      case 'events':
        return <div className="p-6"><h1 className="text-2xl font-bold">Events - Coming Soon</h1></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden h-16"></div> {/* Mobile header spacer */}
        {renderPage()}
      </div>
    </div>
  );
};

export default Index;
