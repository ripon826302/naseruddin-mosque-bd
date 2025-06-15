
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Moon, Sun } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const PrayerTimeCard: React.FC = () => {
  const { settings } = useMosqueStore();
  
  const prayerTimes = [
    { name: 'ফজর', time: settings.prayerTimes.fajr, nameArabic: 'فجر', nameBangla: 'ফজর' },
    { name: 'যোহর', time: settings.prayerTimes.dhuhr, nameArabic: 'ظهر', nameBangla: 'যোহর' },
    { name: 'আসর', time: settings.prayerTimes.asr, nameArabic: 'عصر', nameBangla: 'আসর' },
    { name: 'মাগরিব', time: settings.prayerTimes.maghrib, nameArabic: 'مغرب', nameBangla: 'মাগরিব' },
    { name: 'এশা', time: settings.prayerTimes.isha, nameArabic: 'عشاء', nameBangla: 'এশা' },
    { name: 'জুমআ', time: settings.prayerTimes.jumma, nameArabic: 'جمعة', nameBangla: 'জুমআ' }
  ];

  // Check if it's Ramadan (you can implement proper Ramadan date logic here)
  const isRamadan = false; // This should be calculated based on actual Ramadan dates

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <Clock className="text-green-600" size={24} />
          <span>নামাজের সময়সূচি</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {prayerTimes.map((prayer, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center border border-green-100 hover:shadow-md transition-shadow"
            >
              <div className="text-green-700 font-semibold text-sm lg:text-base mb-1">
                {prayer.nameBangla}
              </div>
              <div className="text-xs text-green-600 mb-1">{prayer.nameArabic}</div>
              <div className="text-green-900 font-bold text-sm lg:text-lg">
                {prayer.time}
              </div>
            </div>
          ))}
        </div>
        
        {/* Ramadan Times */}
        {isRamadan && settings.ramadanTimes && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <h4 className="text-green-800 font-semibold mb-3 flex items-center space-x-2">
              <Moon className="text-orange-500" size={18} />
              <span>রমজানের সময়সূচি</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                <div className="text-orange-700 font-semibold text-sm mb-1">সেহরি</div>
                <div className="text-orange-900 font-bold text-lg">{settings.ramadanTimes.sehri}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                <div className="text-orange-700 font-semibold text-sm mb-1">ইফতার</div>
                <div className="text-orange-900 font-bold text-lg">{settings.ramadanTimes.iftar}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrayerTimeCard;
