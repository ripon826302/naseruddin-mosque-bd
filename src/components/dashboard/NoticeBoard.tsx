
import React from 'react';
import { Bell, AlertTriangle, Calendar } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const NoticeBoard: React.FC = () => {
  const { donors, expenses } = useMosqueStore();
  
  const defaulterDonors = donors.filter(donor => donor.status === 'Defaulter');
  const pendingSalary = expenses.find(expense => 
    expense.type === 'Imam Salary' && 
    expense.date === new Date().toISOString().split('T')[0]
  );

  const notices = [
    ...defaulterDonors.map(donor => ({
      type: 'warning' as const,
      message: `${donor.name} - মাসিক চাঁদা বকেয়া`,
      icon: AlertTriangle
    })),
    ...(pendingSalary ? [{
      type: 'info' as const,
      message: 'ইমাম সাহেবের বেতন পরিশোধ করুন',
      icon: Calendar
    }] : []),
    {
      type: 'info' as const,
      message: 'আগামী শুক্রবার - বিশেষ দোয়া মাহফিল',
      icon: Calendar
    }
  ];

  return (
    <div className="mosque-card p-6">
      <div className="flex items-center mb-4">
        <Bell className="text-green-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">নোটিশ বোর্ড</h3>
      </div>
      
      {notices.length > 0 ? (
        <div className="space-y-3">
          {notices.map((notice, index) => {
            const Icon = notice.icon;
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-xl ${
                  notice.type === 'warning'
                    ? 'bg-orange-50 border border-orange-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <Icon
                  size={18}
                  className={
                    notice.type === 'warning' ? 'text-orange-600 mt-0.5' : 'text-blue-600 mt-0.5'
                  }
                />
                <p className={`text-sm font-medium ${
                  notice.type === 'warning' ? 'text-orange-800' : 'text-blue-800'
                }`}>
                  {notice.message}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">কোন নতুন নোটিশ নেই</p>
      )}
    </div>
  );
};

export default NoticeBoard;
