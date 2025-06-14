
import React from 'react';
import { Bell, AlertCircle, Info } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const ScrollingNoticeBoard: React.FC = () => {
  const { notices } = useMosqueStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-300 bg-yellow-500/20 border-yellow-400/30';
      case 'info':
        return 'text-blue-300 bg-blue-500/20 border-blue-400/30';
      default:
        return 'text-green-300 bg-green-500/20 border-green-400/30';
    }
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-500/20 p-3 rounded-full border border-purple-400/30">
          <Bell className="h-6 w-6 text-purple-300" />
        </div>
        <h3 className="text-xl font-bold text-purple-300">
          নোটিশ বোর্ড
        </h3>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {notices.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            কোন নোটিশ নেই
          </div>
        ) : (
          notices.map((notice, index) => {
            const IconComponent = getIcon(notice.type);
            const colorClass = getTypeColor(notice.type);
            
            return (
              <div 
                key={notice.id} 
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full border ${colorClass}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm mb-1 truncate">
                      {notice.title}
                    </h4>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {notice.message}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(notice.date).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ScrollingNoticeBoard;
