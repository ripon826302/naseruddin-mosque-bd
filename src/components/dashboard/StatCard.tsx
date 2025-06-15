
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/dates';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'indigo';
  isCurrency?: boolean;
  trend?: number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  isCurrency = false, 
  trend,
  subtitle 
}) => {
  const colorClasses = {
    green: 'from-green-600 to-green-700 shadow-green-500/25',
    blue: 'from-blue-600 to-blue-700 shadow-blue-500/25',
    orange: 'from-orange-600 to-orange-700 shadow-orange-500/25',
    red: 'from-red-600 to-red-700 shadow-red-500/25',
    purple: 'from-purple-600 to-purple-700 shadow-purple-500/25',
    indigo: 'from-indigo-600 to-indigo-700 shadow-indigo-500/25'
  };

  const iconBgClasses = {
    green: 'bg-green-500/20 border-green-400/30',
    blue: 'bg-blue-500/20 border-blue-400/30',
    orange: 'bg-orange-500/20 border-orange-400/30',
    red: 'bg-red-500/20 border-red-400/30',
    purple: 'bg-purple-500/20 border-purple-400/30',
    indigo: 'bg-indigo-500/20 border-indigo-400/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-3 lg:p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-2 lg:mb-3">
        <div className={`p-2 lg:p-2.5 rounded-lg ${iconBgClasses[color]} border backdrop-blur-sm`}>
          <Icon size={16} className="lg:w-5 lg:h-5 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`text-xs px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-full ${trend >= 0 ? 'bg-white/20' : 'bg-red-500/30'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-white/80 text-xs lg:text-sm font-medium mb-1">{title}</p>
        <p className="text-lg lg:text-xl font-bold mb-1">
          {isCurrency ? formatCurrency(Number(value)) : value}
        </p>
        {subtitle && (
          <p className="text-white/60 text-xs">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
