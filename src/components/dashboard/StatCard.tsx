
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
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgClasses[color]} border backdrop-blur-sm`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend !== undefined && (
          <div className={`text-xs px-2 py-1 rounded-full ${trend >= 0 ? 'bg-white/20' : 'bg-red-500/30'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold mb-1">
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
