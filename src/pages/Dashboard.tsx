
import React from 'react';
import { DollarSign, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import NoticeBoard from '@/components/dashboard/NoticeBoard';
import { useMosqueStore } from '@/store/mosqueStore';
import { getBengaliDate, getEnglishDate, getArabicDate } from '@/utils/dates';

const Dashboard: React.FC = () => {
  const { getTotalIncome, getTotalExpenses, getBalance } = useMosqueStore();
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">বায়তুল আমান জামে মসজিদ</h1>
        <div className="flex flex-col md:flex-row justify-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-gray-600">
          <span>🇧🇩 {getBengaliDate()}</span>
          <span>🇺🇸 {getEnglishDate()}</span>
          <span>🕌 {getArabicDate()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="মোট আয়"
          value={totalIncome}
          icon={DollarSign}
          color="green"
          isCurrency
        />
        <StatCard
          title="মোট খরচ"
          value={totalExpenses}
          icon={CreditCard}
          color="red"
          isCurrency
        />
        <StatCard
          title={balance >= 0 ? "অবশিষ্ট টাকা" : "অতিরিক্ত খরচ"}
          value={Math.abs(balance)}
          icon={balance >= 0 ? TrendingUp : TrendingDown}
          color={balance >= 0 ? "blue" : "orange"}
          isCurrency
        />
        <StatCard
          title="মোট দাতা"
          value="12"
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrayerTimeCard />
        <NoticeBoard />
      </div>
    </div>
  );
};

export default Dashboard;
