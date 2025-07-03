
import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import { AlertTriangle, Bell, Info } from 'lucide-react';

const MarqueeNotices: React.FC = () => {
  const { notices } = useMosqueStore();
  
  // শুধুমাত্র মারকুই নোটিশগুলো ফিল্টার করুন
  const marqueeNotices = notices.filter(notice => notice.isMarquee);

  if (marqueeNotices.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return AlertTriangle;
      case 'warning':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'text-red-300 bg-red-900/30 border-red-600/50';
      case 'warning':
        return 'text-yellow-300 bg-yellow-900/30 border-yellow-600/50';
      default:
        return 'text-blue-300 bg-blue-900/30 border-blue-600/50';
    }
  };

  // Show all notices in parallel (one after another horizontally)
  return (
    <div className="mb-8 overflow-hidden">
      <div className="flex space-x-4 animate-marquee">
        {marqueeNotices.map((notice, index) => {
          const IconComponent = getIcon(notice.type);
          const colorClass = getTypeColor(notice.type);
          
          return (
            <div
              key={notice.id}
              className={`flex-shrink-0 backdrop-blur-lg border rounded-xl p-4 ${colorClass} min-w-[300px]`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-full border ${colorClass}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div 
                    className="whitespace-nowrap"
                    style={{
                      fontSize: `${notice.marqueeSettings?.fontSize || 16}px`,
                      color: notice.marqueeSettings?.textColor || 'inherit'
                    }}
                  >
                    <span className="font-bold">{notice.title}</span>
                    <span className="mx-2">•</span>
                    <span>{notice.message}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarqueeNotices;
