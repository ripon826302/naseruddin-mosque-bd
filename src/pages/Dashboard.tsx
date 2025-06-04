
import React from 'react';
import { DollarSign, CreditCard, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import NoticeBoard from '@/components/dashboard/NoticeBoard';
import { useMosqueStore } from '@/store/mosqueStore';
import { getBengaliDate, getEnglishDate, getArabicDate } from '@/utils/dates';

const Dashboard: React.FC = () => {
  const { getTotalIncome, getTotalExpenses, getBalance, settings, donors } = useMosqueStore();
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const totalDonors = donors.length;

  return (
    <div className="min-h-screen islamic-pattern">
      <div className="p-6 space-y-8">
        {/* Enhanced Header with glassmorphism effect */}
        <div className="text-center space-y-4 mb-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-green-200 opacity-20 w-32 h-32 floating-animation" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4 relative z-10 slide-up">
              {settings.name}
            </h1>
          </div>
          <div className="glass-effect rounded-2xl p-4 mx-auto max-w-2xl slide-up" style={{animationDelay: '0.2s'}}>
            <p className="text-gray-700 font-medium text-lg">{settings.address}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-8 text-sm">
            <div className="glass-effect rounded-full px-6 py-3 slide-up" style={{animationDelay: '0.3s'}}>
              <span className="text-green-700 font-semibold">🇧🇩 {getBengaliDate()}</span>
            </div>
            <div className="glass-effect rounded-full px-6 py-3 slide-up" style={{animationDelay: '0.4s'}}>
              <span className="text-green-700 font-semibold">🇺🇸 {getEnglishDate()}</span>
            </div>
            <div className="glass-effect rounded-full px-6 py-3 slide-up" style={{animationDelay: '0.5s'}}>
              <span className="text-green-700 font-semibold">🕌 {getArabicDate()}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="slide-up" style={{animationDelay: '0.6s'}}>
            <StatCard
              title="মোট আয়"
              value={totalIncome}
              icon={DollarSign}
              color="green"
              isCurrency
            />
          </div>
          <div className="slide-up" style={{animationDelay: '0.7s'}}>
            <StatCard
              title="মোট খরচ"
              value={totalExpenses}
              icon={CreditCard}
              color="red"
              isCurrency
            />
          </div>
          <div className="slide-up" style={{animationDelay: '0.8s'}}>
            <StatCard
              title={balance >= 0 ? "অবশিষ্ট টাকা" : "অতিরিক্ত খরচ"}
              value={Math.abs(balance)}
              icon={balance >= 0 ? TrendingUp : TrendingDown}
              color={balance >= 0 ? "blue" : "orange"}
              isCurrency
            />
          </div>
          <div className="slide-up" style={{animationDelay: '0.9s'}}>
            <StatCard
              title="মোট দাতা"
              value={totalDonors.toString()}
              icon={DollarSign}
              color="green"
            />
          </div>
        </div>

        {/* Enhanced Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="slide-up" style={{animationDelay: '1.0s'}}>
            <PrayerTimeCard />
          </div>
          <div className="slide-up" style={{animationDelay: '1.1s'}}>
            <NoticeBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
