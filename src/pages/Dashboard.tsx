import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import StatCard from '@/components/dashboard/StatCard';
import ScrollingNoticeBoard from '@/components/dashboard/ScrollingNoticeBoard';
import DueAmountsCard from '@/components/dashboard/DueAmountsCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MarqueeNotices from '@/components/dashboard/MarqueeNotices';
import { Users, DollarSign, TrendingUp, Building, UserCheck, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { getBengaliDate, getEnglishDate, getArabicDate } from '@/utils/dates';

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange = () => {} }) => {
  const { 
    settings, 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    donors,
    committee,
    imams,
    events,
    getDefaulters,
    getTotalDueAmount
  } = useMosqueStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const activeDonors = donors.filter(d => d.status === 'Active').length;
  const defaultersCount = getDefaulters().length;
  const totalDue = getTotalDueAmount();
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
  const totalImams = imams.filter(i => i.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Dates */}
        <div className="relative mb-8">
          <div className="flex justify-between items-start">
            {/* Left side - Mosque Info */}
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {settings.name}
              </h1>
              <p className="text-gray-400 text-lg">{settings.address}</p>
              <div className="mt-3 flex flex-col space-y-1 text-sm text-gray-500">
                <span>📧 {settings.email}</span>
                <span>📞 {settings.phone}</span>
              </div>
            </div>

            {/* Right side - Dates */}
            <div className="text-right bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-4 min-w-[280px]">
              <div className="space-y-2">
                <div className="text-green-300 font-semibold text-sm">
                  🇧🇩 {getBengaliDate()}
                </div>
                <div className="text-blue-300 font-semibold text-sm">
                  🇺🇸 {getEnglishDate()}
                </div>
                <div className="text-orange-300 font-semibold text-sm">
                  🕌 {getArabicDate()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Notices */}
        <MarqueeNotices />

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
          <div className="xl:col-span-2">
            <StatCard
              title="মোট আয়"
              value={totalIncome}
              icon={DollarSign}
              color="green"
              isCurrency
              trend={12}
              subtitle="এই মাসে"
            />
          </div>
          <div className="xl:col-span-2">
            <StatCard
              title="মোট খরচ"
              value={totalExpenses}
              icon={TrendingUp}
              color="red"
              isCurrency
              trend={-5}
              subtitle="এই মাসে"
            />
          </div>
          <div className="xl:col-span-2">
            <StatCard
              title="ব্যালেন্স"
              value={balance}
              icon={Building}
              color={balance >= 0 ? "blue" : "red"}
              isCurrency
              subtitle="বর্তমান"
            />
          </div>
          <div className="xl:col-span-2">
            <StatCard
              title="বকেয়া পরিমাণ"
              value={totalDue}
              icon={AlertTriangle}
              color="orange"
              isCurrency
              subtitle={`${defaultersCount} জন দেনাদার`}
            />
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            title="ইমাম সংখ্যা"
            value={totalImams}
            icon={Users}
            color="green"
            subtitle="সক্রিয় ইমাম"
          />
          <StatCard
            title="আসন্ন ইভেন্ট"
            value={upcomingEvents}
            icon={Calendar}
            color="blue"
            subtitle="পরবর্তী ৭ দিনে"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Prayer Times */}
            <PrayerTimeCard />
            
            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <QuickActions onPageChange={onPageChange} />
            
            {/* Notice Board */}
            <ScrollingNoticeBoard />
            
            {/* Due Amounts */}
            <DueAmountsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
