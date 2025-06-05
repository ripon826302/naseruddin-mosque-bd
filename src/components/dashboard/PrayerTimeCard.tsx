
import React from 'react';
import { Clock } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const PrayerTimeCard: React.FC = () => {
  const { settings } = useMosqueStore();
  
  const prayerTimes = [
    {
      name: 'Fajr',
      time: settings.prayerTimes.fajr,
      nameArabic: 'الفجر',
      nameBangla: 'ফজর',
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200'
    },
    {
      name: 'Dhuhr',
      time: settings.prayerTimes.dhuhr,
      nameArabic: 'الظهر',
      nameBangla: 'যোহর',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    },
    {
      name: 'Asr',
      time: settings.prayerTimes.asr,
      nameArabic: 'العصر',
      nameBangla: 'আসর',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Maghrib',
      time: settings.prayerTimes.maghrib,
      nameArabic: 'المغرب',
      nameBangla: 'মাগরিব',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200'
    },
    {
      name: 'Isha',
      time: settings.prayerTimes.isha,
      nameArabic: 'العشاء',
      nameBangla: 'এশা',
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200'
    }
  ];

  const getNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Convert prayer times to minutes for comparison
    const prayerMinutes = prayerTimes.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      return { ...prayer, minutes: hours * 60 + minutes };
    });
    
    // Find next prayer
    for (const prayer of prayerMinutes) {
      if (prayer.minutes > currentTime) {
        return prayer;
      }
    }
    
    // If no prayer found today, return Fajr of next day
    return prayerTimes[0];
  };

  const nextPrayer = getNextPrayer();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="mosque-card p-6 bg-gradient-to-br from-white via-green-50 to-emerald-50">
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white mr-3">
          <Clock size={24} />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">নামাজের সময়</h3>
      </div>
      
      <div className="space-y-4">
        {prayerTimes.map((prayer, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl border-2 ${prayer.borderColor} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              nextPrayer?.name === prayer.name
                ? 'ring-2 ring-green-400 ring-opacity-50 shadow-lg scale-[1.02]'
                : ''
            }`}
          >
            <div className={`bg-gradient-to-r ${prayer.bgGradient} p-4`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${prayer.gradient} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">{prayer.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-gray-800 text-lg">{prayer.name}</p>
                      <span className="text-2xl font-arabic text-gray-700">{prayer.nameArabic}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{prayer.nameBangla}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    nextPrayer?.name === prayer.name 
                      ? 'text-green-700 animate-pulse' 
                      : 'text-gray-700'
                  }`}>
                    {formatTime(prayer.time)}
                  </div>
                  {nextPrayer?.name === prayer.name && (
                    <div className="text-xs text-green-600 font-medium">পরবর্তী নামাজ</div>
                  )}
                </div>
              </div>
            </div>
            
            {nextPrayer?.name === prayer.name && (
              <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {nextPrayer && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-200 shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-700 text-center font-bold">
              পরবর্তী নামাজ: <span className="text-green-800">{nextPrayer.nameBangla}</span> - {formatTime(nextPrayer.time)}
            </p>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerTimeCard;
