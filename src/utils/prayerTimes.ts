
export interface PrayerTime {
  name: string;
  time: string;
  nameArabic: string;
  nameBangla: string;
}

export const defaultPrayerTimes = {
  fajr: '05:00',
  dhuhr: '12:00',
  asr: '15:30',
  maghrib: '18:00',
  isha: '19:30',
  jumma: '13:00'
};

export const prayerNames = {
  fajr: { arabic: 'فجر', bangla: 'ফজর' },
  dhuhr: { arabic: 'ظهر', bangla: 'যোহর' },
  asr: { arabic: 'عصر', bangla: 'আসর' },
  maghrib: { arabic: 'مغرب', bangla: 'মাগরিব' },
  isha: { arabic: 'عشاء', bangla: 'এশা' },
  jumma: { arabic: 'جمعة', bangla: 'জুমআ' }
};

export const formatPrayerTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const getCurrentPrayer = (prayerTimes: any): string => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'ফজর', time: prayerTimes.fajr },
    { name: 'যোহর', time: prayerTimes.dhuhr },
    { name: 'আসর', time: prayerTimes.asr },
    { name: 'মাগরিব', time: prayerTimes.maghrib },
    { name: 'এশা', time: prayerTimes.isha }
  ];
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':');
    const prayerTime = parseInt(hours) * 60 + parseInt(minutes);
    
    if (currentTime < prayerTime) {
      return prayer.name;
    }
  }
  
  return 'ফজর'; // Next day's Fajr
};
