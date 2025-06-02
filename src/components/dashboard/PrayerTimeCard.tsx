
import React from 'react';
import { Clock } from 'lucide-react';
import { getPrayerTimes, getNextPrayer } from '@/utils/prayerTimes';

const PrayerTimeCard: React.FC = () => {
  const prayerTimes = getPrayerTimes();
  const nextPrayer = getNextPrayer();

  return (
    <div className="mosque-card p-6">
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
                <p className="font-medium text-gray-800">{prayer.name}</p>
                <p className="text-sm text-gray-600">{prayer.nameBangla}</p>
              </div>
              <div className="text-xl text-green-600 font-arabic">
                {prayer.nameArabic}
              </div>
            </div>
            <div className={`font-bold ${
              nextPrayer?.name === prayer.name ? 'text-green-700' : 'text-gray-700'
            }`}>
              {prayer.time}
            </div>
          </div>
        ))}
      </div>
      
      {nextPrayer && (
        <div className="mt-4 p-3 bg-green-100 rounded-xl border border-green-200">
          <p className="text-sm text-green-700 text-center">
            পরবর্তী নামাজ: <span className="font-bold">{nextPrayer.nameBangla}</span> - {nextPrayer.time}
          </p>
        </div>
      )}
    </div>
  );
};

export default PrayerTimeCard;
