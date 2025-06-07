
import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import StatCard from '@/components/dashboard/StatCard';
import NoticeBoard from '@/components/dashboard/NoticeBoard';
import ScrollingNoticeBoard from '@/components/dashboard/ScrollingNoticeBoard';
import DueAmountsCard from '@/components/dashboard/DueAmountsCard';
import { Users, DollarSign, TrendingUp, Building } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    donors,
    committee,
    imam
  } = useMosqueStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const activeDonors = donors.filter(d => d.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-400 mb-2">
            {settings.name}
          </h1>
          <p className="text-gray-400">{settings.address}</p>
        </div>

        {/* Scrolling Notice Board */}
        <ScrollingNoticeBoard />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="মোট আয়"
            value={`৳${totalIncome.toLocaleString()}`}
            icon={DollarSign}
            trend="+5.2%"
            color="green"
          />
          <StatCard
            title="মোট খরচ"
            value={`৳${totalExpenses.toLocaleString()}`}
            icon={TrendingUp}
            trend="+2.1%"
            color="red"
          />
          <StatCard
            title="ব্যালেন্স"
            value={`৳${balance.toLocaleString()}`}
            icon={Building}
            trend={balance >= 0 ? "+3.1%" : "-1.2%"}
            color={balance >= 0 ? "green" : "red"}
          />
          <StatCard
            title="সক্রিয় দাতা"
            value={activeDonors.toString()}
            icon={Users}
            trend="+1"
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prayer Times */}
          <div className="lg:col-span-2">
            <PrayerTimeCard />
          </div>

          {/* Due Amounts */}
          <div>
            <DueAmountsCard />
          </div>
        </div>

        {/* Bottom Notice Board */}
        <div className="mt-8">
          <NoticeBoard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
