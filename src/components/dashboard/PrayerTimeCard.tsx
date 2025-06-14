
import React, { useState, useEffect } from 'react';
import { Clock, Sunrise, Sun, Sunset, Moon, Calendar } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const PrayerTimeCard: React.FC = () => {
  const { settings } = useMosqueStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const prayerTimes = [
    {
      name: 'ফজর',
      nameArabic: 'الفجر',
      time: settings.prayerTimes.fajr,
      icon: Sunrise,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-400/30',
      glowColor: 'shadow-indigo-500/25'
    },
    {
      name: 'যোহর',
      nameArabic: 'الظهر',
      time: settings.prayerTimes.dhuhr,
      icon: Sun,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30',
      glowColor: 'shadow-yellow-500/25'
    },
    {
      name: 'আসর',
      nameArabic: 'العصر',
      time: settings.prayerTimes.asr,
      icon: Sun,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-400/30',
      glowColor: 'shadow-orange-500/25'
    },
    {
      name: 'মাগরিব',
      nameArabic: 'المغرب',
      time: settings.prayerTimes.maghrib,
      icon: Sunset,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/30',
      glowColor: 'shadow-red-500/25'
    },
    {
      name: 'এশা',
      nameArabic: 'العشاء',
      time: settings.prayerTimes.isha,
      icon: Moon,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30',
      glowColor: 'shadow-purple-500/25'
    }
  ];

  const getCurrentPrayer = () => {
    const currentTimeStr = currentTime.toTimeString().slice(0, 5);
    const times = [
      { name: 'ফজর', time: settings.prayerTimes.fajr },
      { name: 'যোহর', time: settings.prayerTimes.dhuhr },
      { name: 'আসর', time: settings.prayerTimes.asr },
      { name: 'মাগরিব', time: settings.prayerTimes.maghrib },
      { name: 'এশা', time: settings.prayerTimes.isha }
    ];
    
    for (let i = 0; i < times.length; i++) {
      if (currentTimeStr <= times[i].time) {
        return times[i].name;
      }
    }
    return 'ফজর'; // After Isha, next prayer is Fajr
  };

  const nextPrayer = getCurrentPrayer();

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 p-3 rounded-full border border-blue-400/30">
            <Clock className="h-6 w-6 text-blue-300" />
          </div>
          <h3 className="text-xl font-bold text-blue-300">
            নামাজের সময়সূচি
          </h3>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 text-gray-300 mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{currentTime.toLocaleDateString('bn-BD')}</span>
          </div>
          <div className="text-blue-300 text-lg font-mono">
            {currentTime.toLocaleTimeString('bn-BD', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {prayerTimes.map((prayer, index) => {
          const IconComponent = prayer.icon;
          const isNext = prayer.name === nextPrayer;
          
          return (
            <div key={index} className="relative group">
              <div className={`${prayer.bgColor} backdrop-blur-lg border ${prayer.borderColor} rounded-xl p-4 hover:border-opacity-50 transition-all duration-300 ${
                isNext ? `ring-2 ring-${prayer.color.split('-')[1]}-400/50 ${prayer.glowColor} shadow-lg` : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`${prayer.bgColor} p-2 rounded-full border ${prayer.borderColor} ${
                      isNext ? 'animate-pulse' : ''
                    }`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg flex items-center space-x-2">
                        <span>{prayer.name}</span>
                        {isNext && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            পরবর্তী
                          </span>
                        )}
                      </div>
                      <div className="text-gray-300 text-sm">{prayer.nameArabic}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-white font-bold text-xl font-mono ${
                      isNext ? 'text-green-300' : ''
                    }`}>
                      {prayer.time}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="text-center text-gray-400 text-sm">
          আজকের তারিখ: {currentTime.toLocaleDateString('bn-BD', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimeCard;
