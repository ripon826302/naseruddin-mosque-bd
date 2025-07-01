
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, children }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-gray-700"
          >
            <ArrowLeft size={20} className="mr-2" />
            ফিরে যান
          </Button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default PageHeader;
