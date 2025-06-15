
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Moon, Sun, Star, Sunrise, Sunset } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const PrayerTimeCard: React.FC = () => {
  const { settings } = useMosqueStore();
  
  const prayerTimes = [
    { 
      name: 'ফজর', 
      time: settings.prayerTimes.fajr, 
      nameArabic: 'فجر', 
      nameBangla: 'ফজর',
      icon: Sunrise,
      gradient: 'from-blue-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      textColor: 'text-blue-700',
      iconColor: 'text-purple-600'
    },
    { 
      name: 'যোহর', 
      time: settings.prayerTimes.dhuhr, 
      nameArabic: 'ظهر', 
      nameBangla: 'যোহর',
      icon: Sun,
      gradient: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      textColor: 'text-yellow-700',
      iconColor: 'text-orange-600'
    },
    { 
      name: 'আসর', 
      time: settings.prayerTimes.asr, 
      nameArabic: 'عصر', 
      nameBangla: 'আসর',
      icon: Sun,
      gradient: 'from-orange-400 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      textColor: 'text-orange-700',
      iconColor: 'text-red-600'
    },
    { 
      name: 'মাগরিব', 
      time: settings.prayerTimes.maghrib, 
      nameArabic: 'مغرب', 
      nameBangla: 'মাগরিব',
      icon: Sunset,
      gradient: 'from-pink-400 to-purple-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
      textColor: 'text-pink-700',
      iconColor: 'text-purple-600'
    },
    { 
      name: 'এশা', 
      time: settings.prayerTimes.isha, 
      nameArabic: 'عشاء', 
      nameBangla: 'এশা',
      icon: Moon,
      gradient: 'from-indigo-500 to-blue-700',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
      textColor: 'text-indigo-700',
      iconColor: 'text-blue-600'
    },
    { 
      name: 'জুমআ', 
      time: settings.prayerTimes.jumma, 
      nameArabic: 'جمعة', 
      nameBangla: 'জুমআ',
      icon: Star,
      gradient: 'from-emerald-400 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      textColor: 'text-emerald-700',
      iconColor: 'text-teal-600'
    }
  ];

  // Check if it's Ramadan (you can implement proper Ramadan date logic here)
  const isRamadan = false; // This should be calculated based on actual Ramadan dates

  return (
    <Card className="bg-gradient-to-br from-white via-green-50 to-emerald-50 border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-3 text-white">
          <div className="p-2 bg-white/20 rounded-full">
            <Clock className="text-white" size={28} />
          </div>
          <div>
            <span className="text-xl lg:text-2xl font-bold">নামাজের সময়সূচি</span>
            <p className="text-green-100 text-sm mt-1">আজকের নামাজের সময়</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {prayerTimes.map((prayer, index) => {
            const IconComponent = prayer.icon;
            return (
              <div
                key={index}
                className={`${prayer.bgColor} backdrop-blur-sm rounded-xl p-4 text-center border-2 border-white/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${prayer.gradient} shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                </div>
                
                <div className={`${prayer.textColor} font-bold text-lg mb-2 group-hover:scale-110 transition-transform`}>
                  {prayer.nameBangla}
                </div>
                
                <div className="text-xs text-gray-600 mb-2 font-medium">
                  {prayer.nameArabic}
                </div>
                
                <div className={`${prayer.textColor} font-bold text-xl lg:text-2xl bg-white/70 rounded-lg py-2 px-3 shadow-inner`}>
                  {prayer.time}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Ramadan Times */}
        {isRamadan && settings.ramadanTimes && (
          <div className="mt-6 pt-6 border-t-2 border-gradient-to-r from-orange-200 to-yellow-200">
            <h4 className="text-center text-orange-800 font-bold text-xl mb-4 flex items-center justify-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full">
                <Moon className="text-white" size={20} />
              </div>
              <span>রমজানের সময়সূচি</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 text-center border-2 border-orange-200 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full">
                    <Moon className="text-white" size={20} />
                  </div>
                </div>
                <div className="text-orange-700 font-bold text-lg mb-1">সেহরি শেষ</div>
                <div className="text-orange-900 font-bold text-2xl bg-white/70 rounded-lg py-2">
                  {settings.ramadanTimes.sehri}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 text-center border-2 border-orange-200 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                    <Sunset className="text-white" size={20} />
                  </div>
                </div>
                <div className="text-orange-700 font-bold text-lg mb-1">ইফতার</div>
                <div className="text-orange-900 font-bold text-2xl bg-white/70 rounded-lg py-2">
                  {settings.ramadanTimes.iftar}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrayerTimeCard;
