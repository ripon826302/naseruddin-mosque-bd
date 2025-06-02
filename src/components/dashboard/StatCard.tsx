
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/dates';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'orange' | 'red';
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, isCurrency = false }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconColorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  };

  return (
    <div className={`rounded-2xl border-2 p-6 ${colorClasses[color]} transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <p className="text-2xl font-bold">
            {isCurrency ? formatCurrency(Number(value)) : value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${iconColorClasses[color]} bg-white/50`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
