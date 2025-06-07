
import React from 'react';
import { Bell, Megaphone } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const ScrollingNoticeBoard: React.FC = () => {
  const { notices } = useMosqueStore();

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <Megaphone className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <Bell className="h-4 w-4 text-yellow-400" />;
      default:
        return <Bell className="h-4 w-4 text-blue-400" />;
    }
  };

  if (notices.length === 0) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-blue-300" />
          <span className="text-gray-300">কোন নোটিশ নেই</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4 mb-6 overflow-hidden">
      <div className="flex items-center space-x-3 mb-3">
        <Bell className="h-5 w-5 text-blue-300" />
        <h3 className="text-lg font-bold text-blue-300">নোটিশ বোর্ড</h3>
      </div>
      
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee space-x-8 whitespace-nowrap">
          {notices.concat(notices).map((notice, index) => (
            <div key={`${notice.id}-${index}`} className="flex items-center space-x-2 min-w-max">
              {getNoticeIcon(notice.type)}
              <span className="text-white font-medium">{notice.title}</span>
              <span className="text-gray-300">-</span>
              <span className="text-gray-300">{notice.message}</span>
              <span className="text-gray-500 text-sm">({notice.date})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingNoticeBoard;
