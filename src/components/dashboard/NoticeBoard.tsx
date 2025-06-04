
import React from 'react';
import { Bell, AlertTriangle, Calendar, Info } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const NoticeBoard: React.FC = () => {
  const { donors, expenses, notices, getMissingMonths } = useMosqueStore();
  
  // Group missing payments by donor (one notice per donor with all missing months)
  const defaulterNotices = donors
    .map(donor => {
      const missingMonths = getMissingMonths(donor.id);
      if (missingMonths.length === 0) return null;
      
      return {
        type: 'warning' as const,
        message: `${donor.name} - ${missingMonths.join(', ')} মাসের চাঁদা বকেয়া`,
        icon: AlertTriangle
      };
    })
    .filter(notice => notice !== null);

  const pendingSalary = expenses.find(expense => 
    expense.type === 'Imam Salary' && 
    expense.date === new Date().toISOString().split('T')[0]
  );

  const allNotices = [
    ...defaulterNotices,
    ...(pendingSalary ? [{
      type: 'info' as const,
      message: 'ইমাম সাহেবের বেতন পরিশোধ করুন',
      icon: Calendar
    }] : []),
    ...notices.map(notice => ({
      type: notice.type as 'info' | 'warning' | 'urgent',
      message: `${notice.title} - ${notice.message}`,
      icon: notice.type === 'urgent' ? AlertTriangle : notice.type === 'warning' ? AlertTriangle : Info
    }))
  ];

  return (
    <div className="mosque-card p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-gradient-to-r from-blue-200 to-purple-200">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full mr-3">
          <Bell className="text-white" size={20} />
        </div>
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
          নোটিশ বোর্ড
        </h3>
        <div className="ml-auto bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          {allNotices.length} টি নোটিশ
        </div>
      </div>
      
      {allNotices.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allNotices.map((notice, index) => {
            const Icon = notice.icon;
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 p-4 rounded-xl shadow-md transition-all duration-300 hover:scale-102 hover:shadow-lg border-l-4 ${
                  notice.type === 'urgent' || notice.type === 'warning'
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-400 hover:from-orange-100 hover:to-red-100'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 hover:from-blue-100 hover:to-indigo-100'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  notice.type === 'urgent' || notice.type === 'warning' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}>
                  <Icon
                    size={16}
                    className="text-white"
                  />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium leading-relaxed ${
                    notice.type === 'urgent' || notice.type === 'warning' 
                      ? 'text-orange-800' 
                      : 'text-blue-800'
                  }`}>
                    {notice.message}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-ping"></div>
                    এখনই দেখুন
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border-2 border-green-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="text-white" size={24} />
            </div>
            <p className="text-green-700 font-medium">🎉 কোন নতুন নোটিশ নেই</p>
            <p className="text-green-600 text-sm mt-1">সব কিছু ঠিকঠাক চলছে!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
