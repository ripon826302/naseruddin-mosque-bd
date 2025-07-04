
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMosqueStore } from '@/store/mosqueStore';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

const RecentActivity = () => {
  const { income, expenses } = useMosqueStore();

  // Get recent activities (last 10 items)
  const recentIncome = [...income]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())  
    .slice(0, 5);

  // Combine and sort all activities
  const allActivities = [
    ...recentIncome.map(item => ({
      ...item,
      type: 'income' as const,
      title: item.source || item.category,
      description: `আয়: ৳${item.amount.toLocaleString()}`
    })),
    ...recentExpenses.map(item => ({
      ...item,
      type: 'expense' as const,
      title: item.category || item.type,
      description: `ব্যয়: ৳${item.amount.toLocaleString()}`
    }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          সাম্প্রতিক কার্যক্রম
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">কোন সাম্প্রতিক কার্যক্রম নেই</p>
          ) : (
            allActivities.map((activity, index) => (
              <div key={`${activity.type}-${activity.id || index}`} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {activity.type === 'income' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.date).toLocaleDateString('bn-BD')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
