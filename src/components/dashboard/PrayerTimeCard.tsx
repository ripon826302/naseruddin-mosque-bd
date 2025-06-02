
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
      nameBangla: 'ফজর'
    },
    {
      name: 'Dhuhr',
      time: settings.prayerTimes.dhuhr,
      nameArabic: 'الظهر',
      nameBangla: 'যোহর'
    },
    {
      name: 'Asr',
      time: settings.prayerTimes.asr,
      nameArabic: 'العصر',
      nameBangla: 'আসর'
    },
    {
      name: 'Maghrib',
      time: settings.prayerTimes.maghrib,
      nameArabic: 'المغرب',
      nameBangla: 'মাগরিব'
    },
    {
      name: 'Isha',
      time: settings.prayerTimes.isha,
      nameArabic: 'العشاء',
      nameBangla: 'এশা'
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
    <div className="mosque-card p-4 lg:p-6">
      <div className="flex items-center mb-4">
        <Clock className="text-green-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">নামাজের সময়</h3>
      </div>
      
      <div className="space-y-3">
        {prayerTimes.map((prayer, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-3 rounded-xl transition-all ${
              nextPrayer?.name === prayer.name
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-medium text-gray-800 text-sm lg:text-base">{prayer.name}</p>
                <p className="text-xs lg:text-sm text-gray-600">{prayer.nameBangla}</p>
              </div>
              <div className="text-lg lg:text-xl text-green-600 font-arabic">
                {prayer.nameArabic}
              </div>
            </div>
            <div className={`font-bold text-sm lg:text-base ${
              nextPrayer?.name === prayer.name ? 'text-green-700' : 'text-gray-700'
            }`}>
              {formatTime(prayer.time)}
            </div>
          </div>
        ))}
      </div>
      
      {nextPrayer && (
        <div className="mt-4 p-3 bg-green-100 rounded-xl border border-green-200">
          <p className="text-xs lg:text-sm text-green-700 text-center">
            পরবর্তী নামাজ: <span className="font-bold">{nextPrayer.nameBangla}</span> - {formatTime(nextPrayer.time)}
          </p>
        </div>
      )}
    </div>
  );
};

export default PrayerTimeCard;
