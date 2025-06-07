
import React from 'react';
import { Clock, Sunrise, Sun, Sunset, Moon, Star, Calendar } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const PrayerTimeCard: React.FC = () => {
  const { settings } = useMosqueStore();
  
  const today = new Date();
  const isJummah = today.getDay() === 5; // Friday is 5
  
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

  // Add Jumma prayer if it's Friday
  if (isJummah && settings.prayerTimes.jumma) {
    prayerTimes.splice(1, 0, {
      name: 'জুমআ',
      nameArabic: 'الجمعة',
      time: settings.prayerTimes.jumma,
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30'
    });
  }

  return (
    <div className="bg-black/60 backdrop-blur-lg border-2 border-indigo-400/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-lg animate-pulse" />
          <div className="relative bg-indigo-500/20 p-3 rounded-full border border-indigo-400/30">
            <Clock className="h-6 w-6 text-indigo-300" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-indigo-300 digital-font" style={{filter: 'drop-shadow(0 0 10px indigo)'}}>
            নামাজের সময়সূচি
          </h3>
          {isJummah && (
            <div className="flex items-center space-x-2 mt-1">
              <Calendar className="h-4 w-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">আজ জুমআবার</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {prayerTimes.map((prayer, index) => {
          const IconComponent = prayer.icon;
          return (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${prayer.color} opacity-10 rounded-xl blur-lg group-hover:opacity-20 transition-all duration-300`} />
              <div className={`relative ${prayer.bgColor} backdrop-blur-lg border ${prayer.borderColor} rounded-xl p-4 hover:border-opacity-50 transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${prayer.color} opacity-30 rounded-full blur-lg`} />
                      <div className={`relative ${prayer.bgColor} p-2 rounded-full border ${prayer.borderColor}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg">{prayer.name}</div>
                      <div className="text-gray-300 text-sm">{prayer.nameArabic}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-xl digital-font" style={{filter: 'drop-shadow(0 0 5px currentColor)'}}>
                      {prayer.time}
                    </div>
                    {prayer.name === 'জুমআ' && (
                      <div className="text-green-300 text-xs">শুক্রবার বিশেষ</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/20">
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-cyan-300 animate-pulse" />
          <span className="text-cyan-300 text-sm">নামাজ আদায়ের জন্য প্রস্তুত থাকুন</span>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimeCard;
