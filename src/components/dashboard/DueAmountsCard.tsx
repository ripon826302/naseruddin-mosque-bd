
import React from 'react';
import { AlertTriangle, Users, DollarSign } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { formatCurrency } from '@/utils/dates';

const DueAmountsCard: React.FC = () => {
  const { getDefaulters, getTotalDueAmount } = useMosqueStore();
  const defaulters = getDefaulters();
  const totalDue = getTotalDueAmount();

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg border border-red-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-red-500/20 p-3 rounded-full border border-red-400/30">
          <AlertTriangle className="h-6 w-6 text-red-300" />
        </div>
        <h3 className="text-xl font-bold text-red-300">
          বকেয়া দানকারী
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-red-300" />
            <span className="text-red-300 text-sm font-medium">মোট দেনাদার</span>
          </div>
          <p className="text-white text-2xl font-bold">{defaulters.length}</p>
        </div>
        
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-red-300" />
            <span className="text-red-300 text-sm font-medium">মোট বকেয়া</span>
          </div>
          <p className="text-white text-2xl font-bold">{formatCurrency(totalDue)}</p>
        </div>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-800">
        {defaulters.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            কোন বকেয়া নেই
          </div>
        ) : (
          defaulters.slice(0, 5).map((defaulter, index) => (
            <div 
              key={defaulter.id}
              className="bg-red-500/5 backdrop-blur-sm border border-red-400/20 rounded-xl p-3 hover:border-red-400/40 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-medium text-sm">{defaulter.name}</h4>
                  <p className="text-gray-400 text-xs">{defaulter.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-300 font-semibold text-sm">
                    {formatCurrency(defaulter.monthlyAmount)}
                  </p>
                  <p className="text-gray-500 text-xs">মাসিক</p>
                </div>
              </div>
            </div>
          ))
        )}
        
        {defaulters.length > 5 && (
          <div className="text-center">
            <span className="text-gray-400 text-xs">
              আরো {defaulters.length - 5} জন দেনাদার...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DueAmountsCard;
