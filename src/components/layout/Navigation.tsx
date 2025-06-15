
import React, { useState } from 'react';
import { Menu, X, Home, Users, DollarSign, TrendingDown, Gift, Bell, Settings, LogOut, FileText, UserCheck, CreditCard, BarChart3, MapPin, Calendar, Globe } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { getBengaliDate, getEnglishDate, getArabicDate } from '@/utils/dates';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, settings } = useMosqueStore();
  
  const isAdmin = user?.role === 'admin';

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
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

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
        
        {/* Enhanced Header with Mosque Info */}
        <div className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <h2 className="text-xl font-bold mb-2">{settings.name}</h2>
          <div className="flex items-center space-x-2 text-green-100 text-sm mb-3">
            <MapPin size={16} />
            <span>{settings.address}</span>
          </div>
          
          {/* Date Information */}
          <div className="space-y-1 text-xs text-green-100">
            <div className="flex items-center space-x-2">
              <span>🇧🇩</span>
              <span>{getBengaliDate()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🇺🇸</span>
              <span>{getEnglishDate()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🕌</span>
              <span>{getArabicDate()}</span>
            </div>
          </div>
          
          <p className="text-green-100 text-sm mt-3">
            {user?.name ? `স্বাগতম, ${user.name}` : 'স্বাগতম'}
          </p>
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentPage === item.id
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                }`}
              >
                <Icon className={item.color} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Settings and Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {isAdmin && (
            <button
              onClick={() => {
                onPageChange('settings');
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                currentPage === 'settings'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
              }`}
            >
              <Settings className="text-gray-500" size={20} />
              <span className="font-medium">সেটিংস</span>
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
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
