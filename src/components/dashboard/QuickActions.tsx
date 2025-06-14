
import React from 'react';
import { Plus, Users, DollarSign, Calendar, Bell, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onPageChange: (page: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onPageChange }) => {
  const actions = [
    {
      title: 'নতুন দাতা যোগ',
      description: 'নতুন দাতা যোগ করুন',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      page: 'donors'
    },
    {
      title: 'আয় রেকর্ড',
      description: 'নতুন আয় যোগ করুন',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      page: 'income'
    },
    {
      title: 'নতুন ইভেন্ট',
      description: 'ইভেন্ট তৈরি করুন',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      page: 'events'
    },
    {
      title: 'নোটিশ দিন',
      description: 'গুরুত্বপূর্ণ নোটিশ',
      icon: Bell,
      color: 'from-orange-500 to-orange-600',
      page: 'notices'
    },
    {
      title: 'পেমেন্ট চেক',
      description: 'পেমেন্ট স্ট্যাটাস',
      icon: CreditCard,
      color: 'from-indigo-500 to-indigo-600',
      page: 'payment-tracking'
    }
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Plus className="h-6 w-6 mr-2 text-blue-400" />
          দ্রুত কাজ
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            
            return (
              <Button
                key={index}
                onClick={() => onPageChange(action.page)}
                className={`bg-gradient-to-r ${action.color} hover:scale-105 transform transition-all duration-300 text-white p-4 rounded-xl shadow-lg justify-start h-auto`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-white/80 text-sm">{action.description}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
