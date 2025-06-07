
import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import StatCard from '@/components/dashboard/StatCard';
import NoticeBoard from '@/components/dashboard/NoticeBoard';
import { Users, DollarSign, TrendingUp, Building } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    donors,
    committee
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
          <h1 className="text-4xl font-bold text-white mb-2">
            {settings.name}
          </h1>
          <p className="text-gray-400">{settings.address}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            icon={TrendingUp}
            color="red"
            isCurrency
          />
          <StatCard
            title="ব্যালেন্স"
            value={balance}
            icon={Building}
            color={balance >= 0 ? "green" : "red"}
            isCurrency
          />
          <StatCard
            title="সক্রিয় দাতা"
            value={activeDonors}
            icon={Users}
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prayer Times */}
          <div className="lg:col-span-2">
            <PrayerTimeCard />
          </div>

          {/* Notice Board */}
          <div>
            <NoticeBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
