
import React, { useEffect } from 'react';
import { DollarSign, CreditCard, TrendingUp, TrendingDown, Sparkles, Users, Calendar, BarChart3 } from 'lucide-react';
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

  // Setup Supabase sync on component mount
  useEffect(() => {
    loadFromSupabase();
    setupRealtimeSubscription();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>
      
      <div className="relative p-6 space-y-8">
        {/* Enhanced Futuristic Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="relative">
            {/* Glowing background orb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 rounded-full opacity-20 animate-spin blur-2xl"></div>
            </div>
            
            {/* Main title with neon effect */}
            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 animate-pulse"
                style={{ filter: 'drop-shadow(0 0 20px cyan)' }}>
                {settings.name}
              </h1>
              
              {/* Sparkle effects around title */}
              <div className="absolute -top-4 left-1/4">
                <Sparkles className="text-cyan-400 w-8 h-8 animate-bounce" />
              </div>
              <div className="absolute -top-2 right-1/4">
                <Sparkles className="text-purple-400 w-6 h-6 animate-bounce" style={{animationDelay: '0.5s'}} />
              </div>
              <div className="absolute -bottom-4 left-1/3">
                <Sparkles className="text-green-400 w-7 h-7 animate-bounce" style={{animationDelay: '1s'}} />
              </div>
            </div>
          </div>
          
          {/* Futuristic address card */}
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-green-500/20 rounded-2xl blur-lg animate-pulse" />
            <div className="relative bg-black/60 backdrop-blur-lg border-2 border-cyan-400/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-center mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-ping" />
                <p className="text-cyan-300 font-medium text-lg">{settings.address}</p>
                <div className="w-2 h-2 bg-green-400 rounded-full ml-3 animate-ping" />
              </div>
              
              {/* Animated status indicators */}
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="text-cyan-300 text-sm">সক্রিয়</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                  <span className="text-green-300 text-sm">অনলাইন</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                  <span className="text-purple-300 text-sm">সুরক্ষিত</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced date displays with neon borders */}
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-all duration-300" />
              <div className="relative bg-black/70 backdrop-blur-lg border-2 border-green-400/40 rounded-full px-8 py-4 shadow-2xl hover:border-green-400/60 transition-all duration-300">
                <span className="text-green-300 font-bold text-lg">🇧🇩 {getBengaliDate()}</span>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-all duration-300" />
              <div className="relative bg-black/70 backdrop-blur-lg border-2 border-blue-400/40 rounded-full px-8 py-4 shadow-2xl hover:border-blue-400/60 transition-all duration-300">
                <span className="text-blue-300 font-bold text-lg">🇺🇸 {getEnglishDate()}</span>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-all duration-300" />
              <div className="relative bg-black/70 backdrop-blur-lg border-2 border-purple-400/40 rounded-full px-8 py-4 shadow-2xl hover:border-purple-400/60 transition-all duration-300">
                <span className="text-purple-300 font-bold text-lg">🕌 {getArabicDate()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Futuristic Stats Grid with holographic effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
            <div className="relative bg-black/60 backdrop-blur-lg border-2 border-green-400/30 rounded-2xl p-1 shadow-2xl hover:border-green-400/50 transition-all duration-300">
              <StatCard
                title="মোট আয়"
                value={totalIncome}
                icon={DollarSign}
                color="green"
                isCurrency
              />
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
            <div className="relative bg-black/60 backdrop-blur-lg border-2 border-red-400/30 rounded-2xl p-1 shadow-2xl hover:border-red-400/50 transition-all duration-300">
              <StatCard
                title="মোট খরচ"
                value={totalExpenses}
                icon={CreditCard}
                color="red"
                isCurrency
              />
            </div>
          </div>
          
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${balance >= 0 ? 'from-blue-500/20 to-indigo-500/20' : 'from-orange-500/20 to-red-500/20'} rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300`} />
            <div className={`relative bg-black/60 backdrop-blur-lg border-2 ${balance >= 0 ? 'border-blue-400/30 hover:border-blue-400/50' : 'border-orange-400/30 hover:border-orange-400/50'} rounded-2xl p-1 shadow-2xl transition-all duration-300`}>
              <StatCard
                title={balance >= 0 ? "অবশিষ্ট টাকা" : "অতিরিক্ত খরচ"}
                value={Math.abs(balance)}
                icon={balance >= 0 ? TrendingUp : TrendingDown}
                color={balance >= 0 ? "blue" : "orange"}
                isCurrency
              />
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
            <div className="relative bg-black/60 backdrop-blur-lg border-2 border-purple-400/30 rounded-2xl p-1 shadow-2xl hover:border-purple-400/50 transition-all duration-300">
              <StatCard
                title="মোট দাতা"
                value={totalDonors.toString()}
                icon={Users}
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl" />
            <div className="relative">
              <PrayerTimeCard />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-black/60 backdrop-blur-lg border-2 border-emerald-400/30 rounded-2xl">
              <NoticeBoard />
            </div>
          </div>
        </div>

        {/* Floating Action Indicators with neon effect */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
          <div className="group relative">
            <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg group-hover:bg-cyan-400/50 transition-all duration-300" />
            <div className="relative w-4 h-4 bg-cyan-400 rounded-full animate-bounce shadow-lg" style={{ filter: 'drop-shadow(0 0 8px cyan)' }} />
          </div>
          <div className="group relative">
            <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-lg group-hover:bg-purple-400/50 transition-all duration-300" />
            <div className="relative w-4 h-4 bg-purple-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.2s', filter: 'drop-shadow(0 0 8px purple)'}} />
          </div>
          <div className="group relative">
            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-lg group-hover:bg-green-400/50 transition-all duration-300" />
            <div className="relative w-4 h-4 bg-green-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.4s', filter: 'drop-shadow(0 0 8px green)'}} />
          </div>
        </div>

        {/* Performance metrics floating panel */}
        <div className="fixed top-6 right-6 z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-lg group-hover:opacity-80 transition-all duration-300" />
            <div className="relative bg-black/70 backdrop-blur-lg border border-cyan-400/30 rounded-lg p-3 shadow-xl">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 text-xs font-medium">সিস্টেম সক্রিয়</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
