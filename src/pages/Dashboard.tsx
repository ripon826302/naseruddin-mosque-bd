
import React, { useEffect } from 'react';
import { DollarSign, CreditCard, TrendingUp, TrendingDown, Sparkles, Wifi, WifiOff } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import NoticeBoard from '@/components/dashboard/NoticeBoard';
import { useMosqueStore } from '@/store/mosqueStore';
import { getBengaliDate, getEnglishDate, getArabicDate } from '@/utils/dates';

const Dashboard: React.FC = () => {
  const { getTotalIncome, getTotalExpenses, getBalance, settings, donors, loadFromSupabase, setupRealtimeSubscription } = useMosqueStore();
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const totalDonors = donors.length;
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  // Setup Supabase sync on component mount
  useEffect(() => {
    loadFromSupabase();
    setupRealtimeSubscription();
    
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 via-green-50 to-yellow-50 islamic-pattern">
      <div className="p-6 space-y-8">
        {/* Online/Offline Status Banner */}
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full shadow-lg transition-all duration-500 ${
          isOnline 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
            : 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse'
        }`}>
          <div className="flex items-center space-x-2">
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span className="text-sm font-medium">
              {isOnline ? 'অনলাইন - ডাটা সিঙ্ক হচ্ছে' : 'অফলাইন মোড'}
            </span>
          </div>
        </div>

        {/* Enhanced Header with more colorful elements */}
        <div className="text-center space-y-4 mb-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-full opacity-20 floating-animation blur-xl"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-gradient w-24 h-24 floating-animation" style={{animationDelay: '1s'}} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent mb-4 relative z-10 slide-up animate-pulse">
              {settings.name}
            </h1>
          </div>
          
          <div className="card-gradient rounded-2xl p-6 mx-auto max-w-2xl slide-up border-2 border-gradient-to-r from-purple-200 to-pink-200 shadow-xl" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-center mb-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mr-2 animate-ping"></div>
              <p className="text-gray-700 font-medium text-lg">{settings.address}</p>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-8 text-sm">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200 rounded-full px-6 py-3 slide-up shadow-lg hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.3s'}}>
              <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-bold">🇧🇩 {getBengaliDate()}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-200 rounded-full px-6 py-3 slide-up shadow-lg hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.4s'}}>
              <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-bold">🇺🇸 {getEnglishDate()}</span>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 rounded-full px-6 py-3 slide-up shadow-lg hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.5s'}}>
              <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent font-bold">🕌 {getArabicDate()}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid with more colorful gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="slide-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.6s'}}>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 rounded-2xl p-1 shadow-xl">
              <StatCard
                title="মোট আয়"
                value={totalIncome}
                icon={DollarSign}
                color="green"
                isCurrency
              />
            </div>
          </div>
          <div className="slide-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.7s'}}>
            <div className="bg-gradient-to-br from-red-100 to-pink-100 border-2 border-red-200 rounded-2xl p-1 shadow-xl">
              <StatCard
                title="মোট খরচ"
                value={totalExpenses}
                icon={CreditCard}
                color="red"
                isCurrency
              />
            </div>
          </div>
          <div className="slide-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.8s'}}>
            <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-100 to-indigo-100 border-blue-200' : 'from-orange-100 to-red-100 border-orange-200'} border-2 rounded-2xl p-1 shadow-xl`}>
              <StatCard
                title={balance >= 0 ? "অবশিষ্ট টাকা" : "অতিরিক্ত খরচ"}
                value={Math.abs(balance)}
                icon={balance >= 0 ? TrendingUp : TrendingDown}
                color={balance >= 0 ? "blue" : "orange"}
                isCurrency
              />
            </div>
          </div>
          <div className="slide-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.9s'}}>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 rounded-2xl p-1 shadow-xl">
              <StatCard
                title="মোট দাতা"
                value={totalDonors.toString()}
                icon={DollarSign}
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Content Grid with colorful borders */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="slide-up" style={{animationDelay: '1.0s'}}>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 rounded-2xl p-1 shadow-xl">
              <PrayerTimeCard />
            </div>
          </div>
          <div className="slide-up" style={{animationDelay: '1.1s'}}>
            <NoticeBoard />
          </div>
        </div>

        {/* Floating Action Dots */}
        <div className="fixed bottom-6 left-6 flex flex-col space-y-2">
          <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
