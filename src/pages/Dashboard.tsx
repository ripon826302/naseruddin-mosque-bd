
import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import StatCard from '@/components/dashboard/StatCard';
import ScrollingNoticeBoard from '@/components/dashboard/ScrollingNoticeBoard';
import DueAmountsCard from '@/components/dashboard/DueAmountsCard';
import { Users, DollarSign, TrendingUp, Building, UserCheck, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    donors,
    committee,
    getDefaulters,
    getTotalDueAmount
  } = useMosqueStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const activeDonors = donors.filter(d => d.status === 'Active').length;
  const defaultersCount = getDefaulters().length;
  const totalDue = getTotalDueAmount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {settings.name}
          </h1>
          <p className="text-gray-400">{settings.address}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="মোট আয়"
            value={totalIncome}
            icon={DollarSign}
            color="green"
            isCurrency
            trend={12}
            subtitle="এই মাসে"
          />
          <StatCard
            title="মোট খরচ"
            value={totalExpenses}
            icon={TrendingUp}
            color="red"
            isCurrency
            trend={-5}
            subtitle="এই মাসে"
          />
          <StatCard
            title="ব্যালেন্স"
            value={balance}
            icon={Building}
            color={balance >= 0 ? "blue" : "red"}
            isCurrency
            subtitle="বর্তমান"
          />
          <StatCard
            title="সক্রিয় দাতা"
            value={activeDonors}
            icon={Users}
            color="indigo"
            subtitle={`মোট ${donors.length} জন`}
          />
          <StatCard
            title="কমিটি সদস্য"
            value={committee.length}
            icon={UserCheck}
            color="purple"
            subtitle="সক্রিয় সদস্য"
          />
          <StatCard
            title="বকেয়া পরিমাণ"
            value={totalDue}
            icon={AlertTriangle}
            color="orange"
            isCurrency
            subtitle={`${defaultersCount} জন দেনাদার`}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Prayer Times */}
          <div className="lg:col-span-6">
            <PrayerTimeCard />
          </div>

          {/* Notice Board */}
          <div className="lg:col-span-3">
            <ScrollingNoticeBoard />
          </div>

          {/* Due Amounts */}
          <div className="lg:col-span-3">
            <DueAmountsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
