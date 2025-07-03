
import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import { useRealtime } from '@/hooks/useRealtime';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import StatCard from '@/components/dashboard/StatCard';
import ScrollingNoticeBoard from '@/components/dashboard/ScrollingNoticeBoard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MarqueeNotices from '@/components/dashboard/MarqueeNotices';
import { Users, DollarSign, TrendingUp, Building, UserCheck, AlertTriangle, Menu, MapPin } from 'lucide-react';
import { getBengaliDate, getBengaliBanglaDate, getArabicHijriDate } from '@/utils/dates';

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange = () => {} }) => {
  // Enable realtime updates
  useRealtime();
  
  const { 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    donors,
    committee,
    settings
  } = useMosqueStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const activeDonors = donors.filter(d => d.status === 'Active').length;
  const extraExpense = balance < 0 ? Math.abs(balance) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative">
      {/* Enhanced Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg border-b-2 border-green-800 px-4 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:text-green-200 hover:bg-green-600 rounded-lg transition-colors"
            onClick={() => {
              const event = new CustomEvent('toggleNav');
              window.dispatchEvent(event);
            }}
          >
            <Menu size={24} />
          </button>

          {/* Mosque Info centered with Date card on right */}
          <div className="flex-1 flex items-center justify-between">
            {/* Centered Mosque Info */}
            <div className="flex-1 flex justify-center">
              <div className="text-center">
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">{settings.name}</h1>
                <div className="flex items-center justify-center space-x-2 text-green-100 text-base">
                  <MapPin size={16} />
                  <span>{settings.address}</span>
                </div>
              </div>
            </div>

            {/* Date Card on Right */}
            <div className="hidden lg:block">
              <div className="bg-green-800/30 backdrop-blur-sm border border-green-600/50 rounded-lg p-3">
                <p className="text-xs font-medium text-green-200 mb-1 text-center">আজকের তারিখ</p>
                <div className="text-xs text-white space-y-1">
                  <p>{getBengaliDate()}</p>
                  <p>{getBengaliBanglaDate()}</p>
                  <p>{getArabicHijriDate()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Date Card */}
        <div className="lg:hidden mt-4 pt-4 border-t border-green-500">
          <div className="flex justify-center">
            <div className="bg-green-800/30 backdrop-blur-sm border border-green-600/50 rounded-lg p-3">
              <p className="text-xs font-medium text-green-200 mb-1 text-center">আজকের তারিখ</p>
              <div className="text-xs text-white space-y-1 text-center">
                <p>{getBengaliDate()}</p>
                <p>{getBengaliBanglaDate()}</p>
                <p>{getArabicHijriDate()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Marquee Notices */}
          <div className="mb-6">
            <MarqueeNotices />
          </div>

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
    </div>
  );
};

// Add event listener for mobile nav toggle
if (typeof window !== 'undefined') {
  window.addEventListener('toggleNav', () => {
    // This will be handled by the parent component
  });
}

export default Dashboard;
