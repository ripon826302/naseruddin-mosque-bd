
import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const PrayerTimeCard: React.FC = () => {
  const { settings } = useMosqueStore();
  
  const prayerTimes = [
    {
      name: 'Fajr',
      time: settings.prayerTimes.fajr,
      nameArabic: 'الفجر',
      nameBangla: 'ফজর',
      neonColor: 'shadow-purple-500/50 border-purple-400 text-purple-300',
      glowColor: 'shadow-purple-500/80'
    },
    {
      name: 'Dhuhr',
      time: settings.prayerTimes.dhuhr,
      nameArabic: 'الظهر',
      nameBangla: 'যোহর',
      neonColor: 'shadow-yellow-500/50 border-yellow-400 text-yellow-300',
      glowColor: 'shadow-yellow-500/80'
    },
    {
      name: 'Asr',
      time: settings.prayerTimes.asr,
      nameArabic: 'العصر',
      nameBangla: 'আসর',
      neonColor: 'shadow-green-500/50 border-green-400 text-green-300',
      glowColor: 'shadow-green-500/80'
    },
    {
      name: 'Maghrib',
      time: settings.prayerTimes.maghrib,
      nameArabic: 'المغرب',
      nameBangla: 'মাগরিব',
      neonColor: 'shadow-red-500/50 border-red-400 text-red-300',
      glowColor: 'shadow-red-500/80'
    },
    {
      name: 'Isha',
      time: settings.prayerTimes.isha,
      nameArabic: 'العشاء',
      nameBangla: 'এশা',
      neonColor: 'shadow-blue-500/50 border-blue-400 text-blue-300',
      glowColor: 'shadow-blue-500/80'
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
    return { hour: displayHour.toString().padStart(2, '0'), minutes, ampm };
  };

  const LEDTimeDisplay: React.FC<{ prayer: any, isNext: boolean }> = ({ prayer, isNext }) => {
    const { hour, minutes, ampm } = formatTime(prayer.time);
    const color = isNext ? 'text-cyan-400' : prayer.neonColor.split(' ')[2];
    
    return (
      <div className={`flex flex-col items-center p-6 rounded-2xl bg-black/90 border-2 backdrop-blur-lg
        ${isNext ? 'border-cyan-400 shadow-cyan-400/50' : prayer.neonColor}
        shadow-2xl transition-all duration-500 hover:scale-105 ${isNext ? 'animate-pulse' : ''}`}>
        
        {/* Prayer name in neon style */}
        <div className={`text-center mb-4 ${isNext ? 'text-cyan-400' : color}`}>
          <div className="text-2xl font-bold mb-1 filter drop-shadow-lg digital-font"
            style={{ filter: `drop-shadow(0 0 10px currentColor)` }}>
            {prayer.nameBangla}
          </div>
          <div className="text-lg font-arabic opacity-80">{prayer.nameArabic}</div>
        </div>
        
        {/* Digital time display */}
        <div className="flex items-center space-x-2 mb-3">
          <div className={`text-5xl font-mono font-bold ${isNext ? 'text-cyan-400' : color} tracking-wider digital-font`}
            style={{ filter: 'drop-shadow(0 0 15px currentColor)' }}>
            {hour}:{minutes}
          </div>
        </div>
        
        {/* AM/PM indicator */}
        <div className={`text-lg font-bold ${isNext ? 'text-cyan-400' : color} opacity-80 digital-font`}>
          {ampm}
        </div>
        
        {/* Next prayer indicator */}
        {isNext && (
          <div className="mt-3 px-4 py-2 bg-cyan-400/20 border border-cyan-400/40 rounded-full">
            <span className="text-cyan-300 text-sm font-medium">পরবর্তী নামাজ</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Neon background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-green-900/20 rounded-2xl" />
      
      <div className="relative mosque-card bg-black/60 border-2 border-cyan-400/30 backdrop-blur-lg">
        {/* Animated header with sparkles */}
        <div className="relative mb-8 p-6 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-green-900/50 rounded-lg border border-cyan-400/30">
          <div className="absolute top-2 right-2">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute top-2 left-2">
            <Clock className="w-6 h-6 text-cyan-400 animate-bounce" />
          </div>
          
          <h2 className="text-3xl font-bold text-center text-cyan-400 mb-2 filter drop-shadow-lg digital-font"
            style={{ filter: 'drop-shadow(0 0 15px cyan)' }}>
            নামাজের সময়সূচি
          </h2>
          <p className="text-center text-cyan-300/80">{settings.name}</p>
          
          {/* Animated border effect */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500 animate-pulse" />
        </div>
        
        {/* LED prayer time displays */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {prayerTimes.map((prayer, index) => (
            <LEDTimeDisplay 
              key={index} 
              prayer={prayer} 
              isNext={nextPrayer?.name === prayer.name}
            />
          ))}
        </div>
        
        {/* Next prayer highlight banner */}
        {nextPrayer && (
          <div className="relative p-6 bg-gradient-to-r from-cyan-900/30 via-blue-900/30 to-purple-900/30 
            rounded-2xl border-2 border-cyan-400/40 backdrop-blur-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-2xl animate-pulse" />
            <div className="relative flex items-center justify-center space-x-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              <p className="text-cyan-300 text-center font-bold text-lg filter drop-shadow-lg">
                পরবর্তী নামাজ: <span className="text-cyan-400">{nextPrayer.nameBangla}</span> - {formatTime(nextPrayer.time).hour}:{formatTime(nextPrayer.time).minutes} {formatTime(nextPrayer.time).ampm}
              </p>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimeCard;
