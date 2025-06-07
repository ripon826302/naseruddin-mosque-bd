
import React from 'react';
import { Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const PrayerTimeCard: React.FC = () => {
  const { settings } = useMosqueStore();
  
  const prayerTimes = [
    {
      name: 'ফজর',
      nameArabic: 'الفجر',
      time: settings.prayerTimes.fajr,
      icon: Sunrise,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-400/30'
    },
    {
      name: 'যোহর',
      nameArabic: 'الظهر',
      time: settings.prayerTimes.dhuhr,
      icon: Sun,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30'
    },
    {
      name: 'আসর',
      nameArabic: 'العصر',
      time: settings.prayerTimes.asr,
      icon: Sun,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-400/30'
    },
    {
      name: 'মাগরিব',
      nameArabic: 'المغرب',
      time: settings.prayerTimes.maghrib,
      icon: Sunset,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/30'
    },
    {
      name: 'এশা',
      nameArabic: 'العشاء',
      time: settings.prayerTimes.isha,
      icon: Moon,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30'
    }
  ];

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-500/20 p-3 rounded-full border border-blue-400/30">
          <Clock className="h-6 w-6 text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-blue-300">
          নামাজের সময়সূচি
        </h3>
      </div>
      
      <div className="space-y-3">
        {prayerTimes.map((prayer, index) => {
          const IconComponent = prayer.icon;
          return (
            <div key={index} className="relative group">
              <div className={`${prayer.bgColor} backdrop-blur-lg border ${prayer.borderColor} rounded-xl p-4 hover:border-opacity-50 transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`${prayer.bgColor} p-2 rounded-full border ${prayer.borderColor}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg">{prayer.name}</div>
                      <div className="text-gray-300 text-sm">{prayer.nameArabic}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-xl">
                      {prayer.time}
                    </div>
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

export default PrayerTimeCard;
