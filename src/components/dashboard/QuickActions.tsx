
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  UserPlus, 
  DollarSign, 
  FileText,
  Users,
  Calendar,
  Bell,
  Settings
} from 'lucide-react';

interface QuickActionsProps {
  onPageChange: (page: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onPageChange }) => {
  const actions = [
    {
      title: "নতুন দাতা যোগ করুন",
      icon: UserPlus,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => onPageChange('donors')
    },
    {
      title: "আয় রেকর্ড করুন",
      icon: DollarSign,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => onPageChange('income')
    },
    {
      title: "ব্যয় যোগ করুন",
      icon: PlusCircle,
      color: "bg-red-500 hover:bg-red-600",
      onClick: () => onPageChange('expense')
    },
    {
      title: "রিপোর্ট দেখুন",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => onPageChange('reports')
    },
    {
      title: "কমিটি সদস্য",
      icon: Users,
      color: "bg-indigo-500 hover:bg-indigo-600",
      onClick: () => onPageChange('committee')
    },
    {
      title: "ইভেন্ট ম্যানেজমেন্ট",
      icon: Calendar,
      color: "bg-yellow-500 hover:bg-yellow-600",
      onClick: () => onPageChange('events')
    },
    {
      title: "নোটিশ বোর্ড",
      icon: Bell,
      color: "bg-orange-500 hover:bg-orange-600",
      onClick: () => onPageChange('notices')
    },
    {
      title: "সেটিংস",
      icon: Settings,
      color: "bg-gray-500 hover:bg-gray-600",
      onClick: () => onPageChange('settings')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          দ্রুত কাজ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className={`h-20 flex flex-col items-center justify-center space-y-2 text-white border-0 ${action.color} transition-all duration-200 hover:scale-105`}
                onClick={action.onClick}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs text-center leading-tight">{action.title}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
