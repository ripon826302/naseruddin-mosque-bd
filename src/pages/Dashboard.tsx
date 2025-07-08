
import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import { useRealtime } from '@/hooks/useRealtime';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import StatCard from '@/components/dashboard/StatCard';
import ScrollingNoticeBoard from '@/components/dashboard/ScrollingNoticeBoard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MarqueeNotices from '@/components/dashboard/MarqueeNotices';
import { Users, DollarSign, TrendingUp, Building, UserCheck, AlertTriangle, Menu, MapPin, Gift } from 'lucide-react';
import { getBengaliDate, getBengaliBanglaDate, getArabicHijriDate, formatCurrency } from '@/utils/dates';

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
    settings,
    user
  } = useMosqueStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const activeDonors = donors.filter(d => d.status === 'Active').length;
  const extraExpense = balance < 0 ? Math.abs(balance) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Enhanced Page Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 shadow-xl border-b-4 border-green-800 px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 text-white hover:text-green-200 hover:bg-green-600 rounded-xl transition-all duration-200 shadow-lg"
              onClick={() => {
                const event = new CustomEvent('toggleNav');
                window.dispatchEvent(event);
              }}
            >
              <Menu size={24} />
            </button>

            {/* Centered Mosque Info */}
            <div className="flex-1 flex justify-center">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {settings.name || 'বায়তুল আমান জামে মসজিদ'}
                </h1>
                <div className="flex items-center justify-center space-x-3 text-green-100 text-lg mb-2">
                  <MapPin size={20} />
                  <span>{settings.address || 'ঢাকা, বাংলাদেশ'}</span>
                </div>
                <div className="text-green-200 text-sm">
                  {user?.name ? `স্বাগতম, ${user.name}` : 'স্বাগতম'}
                </div>
              </div>
            </div>

            {/* Date Card on Right */}
            <div className="hidden lg:block">
              <div className="bg-white/15 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-lg">
                <p className="text-sm font-semibold text-green-200 mb-2 text-center">আজকের তারিখ</p>
                <div className="text-sm text-white space-y-1">
                  <p className="font-medium">{getBengaliDate()}</p>
                  <p className="text-green-100">{getBengaliBanglaDate()}</p>
                  <p className="text-green-100">{getArabicHijriDate()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Date Card */}
          <div className="lg:hidden mt-6 pt-6 border-t border-green-500/30">
            <div className="flex justify-center">
              <div className="bg-white/15 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-lg">
                <p className="text-sm font-semibold text-green-200 mb-2 text-center">আজকের তারিখ</p>
                <div className="text-sm text-white space-y-1 text-center">
                  <p className="font-medium">{getBengaliDate()}</p>
                  <p className="text-green-100">{getBengaliBanglaDate()}</p>
                  <p className="text-green-100">{getArabicHijriDate()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Marquee Notices */}
          <div className="mb-8">
            <MarqueeNotices />
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-8">
            <StatCard
              title="মোট আয়"
              value={formatCurrency(totalIncome)}
              icon={DollarSign}
              color="green"
              subtitle="সর্বমোট"
              className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow"
            />
            <StatCard
              title="মোট ব্যয়"
              value={formatCurrency(totalExpenses)}
              icon={TrendingUp}
              color="red"
              subtitle="সর্বমোট"
              className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-shadow"
            />
            <StatCard
              title="বর্তমান ব্যালেন্স"
              value={formatCurrency(balance)}
              icon={Building}
              color={balance >= 0 ? "blue" : "red"}
              subtitle={balance >= 0 ? "উদ্বৃত্ত" : "ঘাটতি"}
              className={`${balance >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-red-500 to-red-600'} text-white shadow-lg hover:shadow-xl transition-shadow`}
            />
            {extraExpense > 0 && (
              <StatCard
                title="অতিরিক্ত ব্যয়"
                value={formatCurrency(extraExpense)}
                icon={AlertTriangle}
                color="orange"
                subtitle="ঘাটতি"
                className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-shadow"
              />
            )}
            <StatCard
              title="সক্রিয় দাতা"
              value={activeDonors.toString()}
              icon={Gift}
              color="purple"
              subtitle={`মোট ${donors.length} জন`}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow"
            />
            <StatCard
              title="কমিটি সদস্য"
              value={committee.length.toString()}
              icon={UserCheck}
              color="indigo"
              subtitle="সক্রিয় সদস্য"
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6 lg:space-y-8">
              {/* Prayer Times */}
              <PrayerTimeCard />
              
              {/* Recent Activity */}
              <RecentActivity />

              {/* Quick Action Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => onPageChange('donors')}
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-purple-100 hover:border-purple-300 group"
                >
                  <Gift className="mx-auto mb-3 text-purple-600 group-hover:text-purple-700" size={32} />
                  <h3 className="font-semibold text-purple-800 group-hover:text-purple-900">দাতা ব্যবস্থাপনা</h3>
                  <p className="text-sm text-purple-600 mt-1">{donors.length} জন দাতা</p>
                </button>

                <button
                  onClick={() => onPageChange('income')}
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-green-100 hover:border-green-300 group"
                >
                  <DollarSign className="mx-auto mb-3 text-green-600 group-hover:text-green-700" size={32} />
                  <h3 className="font-semibold text-green-800 group-hover:text-green-900">আয় ব্যবস্থাপনা</h3>
                  <p className="text-sm text-green-600 mt-1">{formatCurrency(totalIncome)}</p>
                </button>

                <button
                  onClick={() => onPageChange('expense')}
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-red-100 hover:border-red-300 group"
                >
                  <TrendingUp className="mx-auto mb-3 text-red-600 group-hover:text-red-700" size={32} />
                  <h3 className="font-semibold text-red-800 group-hover:text-red-900">ব্যয় ব্যবস্থাপনা</h3>
                  <p className="text-sm text-red-600 mt-1">{formatCurrency(totalExpenses)}</p>
                </button>

                <button
                  onClick={() => onPageChange('committee')}
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-100 hover:border-blue-300 group"
                >
                  <Users className="mx-auto mb-3 text-blue-600 group-hover:text-blue-700" size={32} />
                  <h3 className="font-semibold text-blue-800 group-hover:text-blue-900">কমিটি সদস্য</h3>
                  <p className="text-sm text-blue-600 mt-1">{committee.length} জন সদস্য</p>
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6 lg:space-y-8">
              {/* Notice Board */}
              <ScrollingNoticeBoard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
