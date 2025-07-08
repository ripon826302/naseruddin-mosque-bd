
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  color?: string;
  isCurrency?: boolean;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className = "",
  color = "blue",
  isCurrency = false,
  subtitle
}) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      green: "text-green-600",
      red: "text-red-600", 
      blue: "text-blue-600",
      orange: "text-orange-600",
      purple: "text-purple-600",
      indigo: "text-indigo-600"
    };
    return colorMap[color] || "text-blue-600";
  };

  const formatValue = (val: string | number) => {
    if (isCurrency && typeof val === 'number') {
      return `৳${val.toLocaleString('bn-BD')}`;
    }
    return val;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${getColorClasses(color)}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{formatValue(value)}</div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className="text-xs text-gray-500 mt-1">
            <span className={trend.value >= 0 ? "text-green-600" : "text-red-600"}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
            {" "}
            {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
