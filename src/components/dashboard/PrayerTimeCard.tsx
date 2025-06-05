
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
      clockColor: 'text-purple-700'
    },
    {
      name: 'Dhuhr',
      time: settings.prayerTimes.dhuhr,
      nameArabic: 'الظهر',
      nameBangla: 'যোহর',
      gradient: 'from-yellow-500 to-orange-500',
      clockColor: 'text-orange-700'
    },
    {
      name: 'Asr',
      time: settings.prayerTimes.asr,
      nameArabic: 'العصر',
      nameBangla: 'আসর',
      gradient: 'from-green-500 to-emerald-500',
      clockColor: 'text-green-700'
    },
    {
      name: 'Maghrib',
      time: settings.prayerTimes.maghrib,
      nameArabic: 'المغرب',
      nameBangla: 'মাগরিব',
      gradient: 'from-red-500 to-pink-500',
      clockColor: 'text-red-700'
    },
    {
      name: 'Isha',
      time: settings.prayerTimes.isha,
      nameArabic: 'العشاء',
      nameBangla: 'এশা',
      gradient: 'from-blue-500 to-indigo-500',
      clockColor: 'text-blue-700'
    }
  ];

  const getNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayerMinutes = prayerTimes.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      return { ...prayer, minutes: hours * 60 + minutes };
    });
    
    for (const prayer of prayerMinutes) {
      if (prayer.minutes > currentTime) {
        return prayer;
      }
    }
    
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

  const ClockFace: React.FC<{ prayer: any, isNext: boolean }> = ({ prayer, isNext }) => {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    const minuteAngle = minutes * 6;

    return (
      <div className={`relative w-32 h-32 ${isNext ? 'scale-110' : ''} transition-all duration-300`}>
        {/* Clock Circle */}
        <div className={`w-full h-full rounded-full border-4 ${isNext ? 'border-green-500 shadow-lg shadow-green-200' : 'border-gray-300'} bg-white relative`}>
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-4 bg-gray-600"
              style={{
                top: '4px',
                left: '50%',
                transformOrigin: '50% 60px',
                transform: `translateX(-50%) rotate(${i * 30}deg)`
              }}
            />
          ))}
          
          {/* Hour hand */}
          <div
            className="absolute w-1 h-8 bg-gray-800 rounded-full"
            style={{
              top: '32px',
              left: '50%',
              transformOrigin: '50% 32px',
              transform: `translateX(-50%) rotate(${hourAngle}deg)`
            }}
          />
          
          {/* Minute hand */}
          <div
            className="absolute w-0.5 h-12 bg-gray-600 rounded-full"
            style={{
              top: '16px',
              left: '50%',
              transformOrigin: '50% 48px',
              transform: `translateX(-50%) rotate(${minuteAngle}deg)`
            }}
          />
          
          {/* Center dot */}
          <div className="absolute w-2 h-2 bg-gray-800 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Prayer name and time below clock */}
        <div className="text-center mt-2">
          <div className={`font-bold text-lg ${prayer.clockColor}`}>{prayer.nameBangla}</div>
          <div className="text-2xl font-arabic text-gray-700">{prayer.nameArabic}</div>
          <div className={`font-bold ${isNext ? 'text-green-600 text-lg' : 'text-gray-600'}`}>
            {formatTime(prayer.time)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mosque-card p-6">
      {/* Header with Islamic pattern border */}
      <div className="relative mb-8">
        <div className="border-2 border-yellow-500 border-dashed p-4 bg-gradient-to-r from-green-800 to-emerald-800 text-white rounded-lg">
          <h2 className="text-3xl font-bold text-center text-yellow-300 mb-2">নামাজের সময়সূচি</h2>
          <p className="text-center text-yellow-200">{settings.name}</p>
        </div>
      </div>
      
      {/* Prayer time clocks grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {prayerTimes.map((prayer, index) => (
          <div key={index} className="flex flex-col items-center">
            <ClockFace 
              prayer={prayer} 
              isNext={nextPrayer?.name === prayer.name}
            />
            {nextPrayer?.name === prayer.name && (
              <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                পরবর্তী নামাজ
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Next prayer indicator */}
      {nextPrayer && (
        <div className="mt-8 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-200 shadow-lg">
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
