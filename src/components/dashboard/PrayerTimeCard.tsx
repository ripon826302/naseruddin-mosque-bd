
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Moon, Sun, Star, Sunrise, Sunset } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const PrayerTimeCard: React.FC = () => {
  const { settings } = useMosqueStore();
  
  // Function to convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const prayerTimes = [
    { 
      name: 'ফজর', 
      time: convertTo12Hour(settings.prayerTimes.fajr), 
      nameArabic: 'فجر', 
      nameBangla: 'ফজর',
      icon: Sunrise,
      gradient: 'from-slate-700 via-blue-800 to-indigo-900',
      bgColor: 'bg-gradient-to-br from-slate-600 to-indigo-800',
      textColor: 'text-white',
      iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-900/30'
    },
    { 
      name: 'যোহর', 
      time: convertTo12Hour(settings.prayerTimes.dhuhr), 
      nameArabic: 'ظهر', 
      nameBangla: 'যোহর',
      icon: Sun,
      gradient: 'from-yellow-600 via-orange-700 to-red-800',
      bgColor: 'bg-gradient-to-br from-yellow-600 to-red-700',
      textColor: 'text-white',
      iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      shadowColor: 'shadow-orange-900/30'
    },
    { 
      name: 'আসর', 
      time: convertTo12Hour(settings.prayerTimes.asr), 
      nameArabic: 'عصر', 
      nameBangla: 'আসর',
      icon: Sun,
      gradient: 'from-orange-700 via-red-700 to-pink-800',
      bgColor: 'bg-gradient-to-br from-orange-700 to-pink-800',
      textColor: 'text-white',
      iconBg: 'bg-gradient-to-r from-orange-600 to-red-600',
      shadowColor: 'shadow-red-900/30'
    },
    { 
      name: 'মাগরিব', 
      time: convertTo12Hour(settings.prayerTimes.maghrib), 
      nameArabic: 'مغرب', 
      nameBangla: 'মাগরিব',
      icon: Sunset,
      gradient: 'from-pink-700 via-purple-700 to-indigo-800',
      bgColor: 'bg-gradient-to-br from-pink-700 to-indigo-800',
      textColor: 'text-white',
      iconBg: 'bg-gradient-to-r from-pink-600 to-purple-600',
      shadowColor: 'shadow-purple-900/30'
    },
    { 
      name: 'এশা', 
      time: convertTo12Hour(settings.prayerTimes.isha), 
      nameArabic: 'عشاء', 
      nameBangla: 'এশা',
      icon: Moon,
      gradient: 'from-purple-800 via-indigo-800 to-slate-900',
      bgColor: 'bg-gradient-to-br from-purple-800 to-slate-900',
      textColor: 'text-white',
      iconBg: 'bg-gradient-to-r from-purple-600 to-indigo-700',
      shadowColor: 'shadow-purple-900/30'
    },
    { 
      name: 'জুমআ', 
      time: convertTo12Hour(settings.prayerTimes.jumma), 
      nameArabic: 'جمعة', 
      nameBangla: 'জুমআ',
      icon: Star,
      gradient: 'from-emerald-700 via-teal-700 to-cyan-800',
      bgColor: 'bg-gradient-to-br from-emerald-700 to-cyan-800',
      textColor: 'text-white',
      iconBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      shadowColor: 'shadow-emerald-900/30'
    }
  ];

  // Check if it's Ramadan (you can implement proper Ramadan date logic here)
  const isRamadan = false; // This should be calculated based on actual Ramadan dates

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border-4 border-gray-700 shadow-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20 backdrop-blur-sm"></div>
        <CardTitle className="flex items-center justify-center space-x-4 text-white relative z-10">
          <div className="p-3 bg-white/20 rounded-full shadow-lg backdrop-blur-sm">
            <Clock className="text-white" size={32} />
          </div>
          <div className="text-center">
            <span className="text-2xl lg:text-3xl font-bold block">নামাজের সময়সূচি</span>
            <p className="text-green-100 text-sm lg:text-base mt-2 font-medium">আজকের নামাজের সময়</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 lg:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {prayerTimes.map((prayer, index) => {
            const IconComponent = prayer.icon;
            return (
              <div
                key={index}
                className={`${prayer.bgColor} backdrop-blur-sm rounded-2xl p-5 lg:p-6 text-center border-2 border-white/20 hover:border-white/40 ${prayer.shadowColor} shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${prayer.iconBg} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                  </div>
                  
                  <div className={`${prayer.textColor} font-bold text-xl lg:text-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {prayer.nameBangla}
                  </div>
                  
                  <div className="text-white/80 text-sm lg:text-base mb-3 font-medium">
                    {prayer.nameArabic}
                  </div>
                  
                  <div className={`${prayer.textColor} font-bold text-2xl lg:text-3xl bg-black/30 backdrop-blur-sm rounded-xl py-3 px-4 shadow-lg border border-white/20`}>
                    {prayer.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Ramadan Times */}
        {isRamadan && settings.ramadanTimes && (
          <div className="mt-8 pt-8 border-t-2 border-gradient-to-r from-orange-600 to-yellow-600">
            <h4 className="text-center text-white font-bold text-2xl mb-6 flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full shadow-lg">
                <Moon className="text-white" size={24} />
              </div>
              <span>রমজানের সময়সূচি</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-700 to-yellow-700 rounded-2xl p-6 text-center border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full shadow-lg">
                    <Moon className="text-white" size={24} />
                  </div>
                </div>
                <div className="text-white font-bold text-xl mb-2">সেহরি শেষ</div>
                <div className="text-white font-bold text-3xl bg-black/30 backdrop-blur-sm rounded-xl py-3 border border-white/20">
                  {convertTo12Hour(settings.ramadanTimes.sehri)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-700 to-red-700 rounded-2xl p-6 text-center border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-full shadow-lg">
                    <Sunset className="text-white" size={24} />
                  </div>
                </div>
                <div className="text-white font-bold text-xl mb-2">ইফতার</div>
                <div className="text-white font-bold text-3xl bg-black/30 backdrop-blur-sm rounded-xl py-3 border border-white/20">
                  {convertTo12Hour(settings.ramadanTimes.iftar)}
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
