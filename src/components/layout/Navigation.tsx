
import React, { useState } from 'react';
import { Home, Users, DollarSign, CreditCard, FileText, Bell, Settings, LogOut, Menu, X, LogIn } from 'lucide-react';
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
  ];

  const handleLogout = () => {
    logout();
    onPageChange('dashboard');
  };

  const handleAdminLogin = () => {
    onPageChange('login');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-green-100 px-4 py-3 flex items-center justify-between z-40">
        <h1 className="text-lg font-bold text-green-800 truncate">{settings.name}</h1>
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
      <div className={`fixed left-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 z-50 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:shadow-none lg:border-r lg:border-green-100`}>
        
        {/* Header */}
        <div className="p-4 border-b border-green-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="text-2xl">🕌</div>
            </div>
            <h1 className="text-lg font-bold text-green-800 mb-1 px-2 break-words">{settings.name}</h1>
            <p className="text-sm text-green-600">ব্যবস্থাপনা সিস্টেম</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 py-3 border-b border-green-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-700">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-green-600 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}

          {/* Settings - Only for admin */}
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                onPageChange('settings');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                currentPage === 'settings'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              <Settings size={18} />
              <span className="font-medium text-sm">সেটিং</span>
            </button>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-green-100 space-y-2">
          {user?.role === 'viewer' ? (
            <button
              onClick={handleAdminLogin}
              className="w-full flex items-center space-x-3 px-3 py-3 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
            >
              <LogIn size={18} />
              <span className="font-medium text-sm">এডমিন লগইন</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">লগআউট</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
