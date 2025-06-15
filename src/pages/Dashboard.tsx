
import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import StatCard from '@/components/dashboard/StatCard';
import ScrollingNoticeBoard from '@/components/dashboard/ScrollingNoticeBoard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MarqueeNotices from '@/components/dashboard/MarqueeNotices';
import { Users, DollarSign, TrendingUp, Building, UserCheck, AlertTriangle, Calendar, Globe, MapPin } from 'lucide-react';
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
    committee
  } = useMosqueStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const activeDonors = donors.filter(d => d.status === 'Active').length;
  const extraExpense = balance < 0 ? Math.abs(balance) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Mosque Info and Dates */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-800 rounded-2xl p-6 lg:p-8 shadow-2xl border border-emerald-700/50">
            {/* Mosque Information */}
            <div className="text-center mb-6">
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                {settings.name}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-emerald-200 text-lg lg:text-xl mb-4">
                <MapPin className="text-emerald-300" size={20} />
                <span>{settings.address}</span>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center space-y-2 lg:space-y-0 lg:space-x-6 text-sm lg:text-base text-emerald-100">
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>{settings.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>{settings.phone}</span>
                </div>
              </div>
            </div>

            {/* Date Information in Lines */}
            <div className="border-t border-emerald-600/50 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
                <div className="bg-emerald-700/30 backdrop-blur-sm rounded-xl p-4 border border-emerald-600/30">
                  <div className="flex items-center justify-center space-x-2 text-emerald-200 text-sm lg:text-base">
                    <span className="text-xl">🇧🇩</span>
                    <Calendar className="text-emerald-300" size={18} />
                    <span className="font-semibold">{getBengaliDate()}</span>
                  </div>
                </div>
                <div className="bg-blue-700/30 backdrop-blur-sm rounded-xl p-4 border border-blue-600/30">
                  <div className="flex items-center justify-center space-x-2 text-blue-200 text-sm lg:text-base">
                    <span className="text-xl">🇺🇸</span>
                    <Globe className="text-blue-300" size={18} />
                    <span className="font-semibold">{getEnglishDate()}</span>
                  </div>
                </div>
                <div className="bg-orange-700/30 backdrop-blur-sm rounded-xl p-4 border border-orange-600/30">
                  <div className="flex items-center justify-center space-x-2 text-orange-200 text-sm lg:text-base">
                    <span className="text-xl">🕌</span>
                    <Calendar className="text-orange-300" size={18} />
                    <span className="font-semibold">{getArabicDate()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Notices */}
        <MarqueeNotices />

        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <StatCard
            title="মোট আয়"
            value={totalIncome}
            icon={DollarSign}
            color="green"
            isCurrency
            subtitle="সর্বমোট"
          />
          <StatCard
            title="মোট ব্যয়"
            value={totalExpenses}
            icon={TrendingUp}
            color="red"
            isCurrency
            subtitle="সর্বমোট"
          />
          <StatCard
            title="বর্তমান ব্যালেন্স"
            value={balance}
            icon={Building}
            color={balance >= 0 ? "blue" : "red"}
            isCurrency
            subtitle={balance >= 0 ? "উদ্বৃত্ত" : "ঘাটতি"}
          />
          {extraExpense > 0 && (
            <StatCard
              title="অতিরিক্ত ব্যয়"
              value={extraExpense}
              icon={AlertTriangle}
              color="orange"
              isCurrency
              subtitle="ঘাটতি"
            />
          )}
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
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-4 lg:space-y-6">
            {/* Prayer Times */}
            <PrayerTimeCard />
            
            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            {/* Notice Board */}
            <ScrollingNoticeBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
