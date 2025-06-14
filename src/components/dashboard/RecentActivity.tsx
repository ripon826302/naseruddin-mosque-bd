
import React from 'react';
import { Activity, DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMosqueStore } from '@/store/mosqueStore';
import { formatCurrency } from '@/utils/dates';

const RecentActivity: React.FC = () => {
  const { income, expenses, donors, events } = useMosqueStore();

  // Combine and sort recent activities
  const recentActivities = [
    ...income.slice(-3).map(item => ({
      id: item.id,
      type: 'income',
      title: `আয়: ${item.source}`,
      amount: item.amount,
      date: item.date,
      icon: DollarSign,
      color: 'text-green-400'
    })),
    ...expenses.slice(-3).map(item => ({
      id: item.id,
      type: 'expense',
      title: `খরচ: ${item.type}`,
      amount: item.amount,
      date: item.date,
      icon: TrendingUp,
      color: 'text-red-400'
    })),
    ...donors.slice(-2).map(donor => ({
      id: donor.id,
      type: 'donor',
      title: `নতুন দাতা: ${donor.name}`,
      amount: donor.monthlyAmount,
      date: donor.startDate,
      icon: Users,
      color: 'text-blue-400'
    })),
    ...events.slice(-2).map(event => ({
      id: event.id,
      type: 'event',
      title: `ইভেন্ট: ${event.title}`,
      amount: 0,
      date: event.date,
      icon: Calendar,
      color: 'text-purple-400'
    }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="h-6 w-6 mr-2 text-green-400" />
          সাম্প্রতিক কার্যক্রম
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              কোন সাম্প্রতিক কার্যক্রম নেই
            </div>
          ) : (
            recentActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              
              return (
                <div 
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`p-2 rounded-full bg-gray-700/50 ${activity.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {activity.title}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(activity.date).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  {activity.amount > 0 && (
                    <div className={`text-right ${activity.color}`}>
                      <p className="font-semibold text-sm">
                        {activity.type === 'expense' ? '-' : '+'}
                        {formatCurrency(activity.amount)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
