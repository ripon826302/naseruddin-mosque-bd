
import { PrayerTime } from '@/types/mosque';

export const getPrayerTimes = (): PrayerTime[] => {
  // In a real application, you would calculate these based on location and date
  // For demo purposes, using static times
  return [
    {
      name: 'Fajr',
      time: '5:15 AM',
      nameArabic: 'الفجر',
      nameBangla: 'ফজর'
    },
    {
      name: 'Dhuhr',
      time: '12:30 PM',
      nameArabic: 'الظهر',
      nameBangla: 'যোহর'
    },
    {
      name: 'Asr',
      time: '4:15 PM',
      nameArabic: 'العصر',
      nameBangla: 'আসর'
    },
    {
      name: 'Maghrib',
      time: '6:45 PM',
      nameArabic: 'المغرب',
      nameBangla: 'মাগরিব'
    },
    {
      name: 'Isha',
      time: '8:15 PM',
      nameArabic: 'العشاء',
      nameBangla: 'এশা'
    }
  ];
};

export const getNextPrayer = (): PrayerTime | null => {
  const prayerTimes = getPrayerTimes();
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Convert prayer times to minutes for comparison
  const prayerMinutes = prayerTimes.map(prayer => {
    const [time, period] = prayer.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
    return { ...prayer, minutes: hour24 * 60 + minutes };
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
