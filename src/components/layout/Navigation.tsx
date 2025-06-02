
import React, { useState } from 'react';
import { Home, Users, DollarSign, CreditCard, FileText, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMosqueStore } from '@/store/mosqueStore';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user, settings } = useMosqueStore();

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: Home },
    { id: 'committee', label: 'কমিটি', icon: Users },
    { id: 'income', label: 'আয়', icon: DollarSign },
    { id: 'expense', label: 'খরচ', icon: CreditCard },
    { id: 'donors', label: 'দাতা', icon: Users },
    { id: 'reports', label: 'রিপোর্ট', icon: FileText },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell },
    { id: 'settings', label: 'সেটিং', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    onPageChange('login');
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-green-100 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-800">মসজিদ ব্যবস্থাপনা</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-green-700"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:shadow-none lg:border-r lg:border-green-100`}>
        
        {/* Header */}
        <div className="p-6 border-b border-green-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="text-2xl">🕌</div>
            </div>
            <h1 className="text-xl font-bold text-green-800 mb-1">{settings.name}</h1>
            <p className="text-sm text-green-600">ব্যবস্থাপনা সিস্টেম</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b border-green-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-700">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-green-600 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            // Hide admin-only items for viewers
            if (!user && ['committee', 'income', 'expense', 'donors', 'settings'].includes(item.id)) {
              return null;
            }
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        {user && (
          <div className="p-4 border-t border-green-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">লগআউট</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;
