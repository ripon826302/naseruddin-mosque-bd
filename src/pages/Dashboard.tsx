
import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import StatCard from '@/components/dashboard/StatCard';
import ScrollingNoticeBoard from '@/components/dashboard/ScrollingNoticeBoard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MarqueeNotices from '@/components/dashboard/MarqueeNotices';
import { Users, DollarSign, TrendingUp, Building, UserCheck, AlertTriangle, Menu, MapPin } from 'lucide-react';
import { getBengaliDate, getEnglishDate, getArabicDate } from '@/utils/dates';

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange = () => {} }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            onClick={() => {
              const event = new CustomEvent('toggleNav');
              window.dispatchEvent(event);
            }}
          >
            <Menu size={24} />
          </button>

          {/* Mosque Info */}
          <div className="flex-1 lg:flex-none">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{settings.name}</h1>
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <MapPin size={14} />
                  <span>{settings.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Information - Single Line */}
          <div className="hidden lg:block">
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {getBengaliDate()} • {getEnglishDate()} • {getArabicDate()}
              </p>
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
