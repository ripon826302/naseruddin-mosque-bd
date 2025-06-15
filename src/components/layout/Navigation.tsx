
import React, { useState, useEffect } from 'react';
import { X, Home, Users, DollarSign, TrendingDown, Gift, Bell, Settings, LogOut, FileText, UserCheck, CreditCard, BarChart3 } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange, isOpen, setIsOpen }) => {
  const { user, logout, settings } = useMosqueStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: Home, color: 'text-blue-600' },
    { id: 'committee', label: 'কমিটি সদস্য', icon: Users, color: 'text-green-600' },
    { id: 'income', label: 'আয় ব্যবস্থাপনা', icon: DollarSign, color: 'text-emerald-600' },
    { id: 'expense', label: 'ব্যয় ব্যবস্থাপনা', icon: TrendingDown, color: 'text-red-600' },
    { id: 'donors', label: 'দাতা ব্যবস্থাপনা', icon: Gift, color: 'text-purple-600' },
    { id: 'imams', label: 'ইমাম ব্যবস্থাপনা', icon: UserCheck, color: 'text-orange-600' },
    { id: 'reports', label: 'রিপোর্ট', icon: FileText, color: 'text-gray-600' },
    { id: 'advanced-reports', label: 'বিস্তারিত রিপোর্ট', icon: BarChart3, color: 'text-cyan-600' },
    { id: 'payment-tracking', label: 'পেমেন্ট ট্র্যাকিং', icon: CreditCard, color: 'text-pink-600' },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell, color: 'text-yellow-600' }
  ];

  const handleLogout = () => {
    logout();
    onPageChange('login');
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:relative lg:shadow-none`}>
        
        {/* Enhanced Header */}
        <div className="p-6 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-white">{settings.name || 'মসজিদ ব্যবস্থাপনা'}</h2>
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {currentTime.toLocaleDateString('bn-BD')}
              </div>
            </div>
            
            <div className="text-green-100 text-sm mb-2">
              {user?.name ? `স্বাগতম, ${user.name}` : 'স্বাগতম'}
            </div>
            
            <div className="text-xs text-green-200 bg-white/10 px-2 py-1 rounded inline-block">
              {currentTime.toLocaleTimeString('bn-BD', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-600 shadow-md'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-green-600 hover:shadow-sm'
                }`}
              >
                <Icon className={`${item.color} transition-all duration-200`} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Enhanced Settings and Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50">
          {isAdmin && (
            <button
              onClick={() => {
                onPageChange('settings');
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                currentPage === 'settings'
                  ? 'bg-green-50 text-green-700 shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
              }`}
            >
              <Settings className="text-gray-500" size={20} />
              <span className="font-medium">সেটিংস</span>
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-sm"
          >
            <LogOut size={20} />
            <span className="font-medium">লগ আউট</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
