
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  onBack, 
  showBackButton = true,
  rightContent 
}) => {
  const handleMenuToggle = () => {
    const event = new CustomEvent('toggleNav');
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg border-b-2 border-green-800 px-4 lg:px-8 py-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:text-green-200 hover:bg-green-600 rounded-lg transition-colors"
            onClick={handleMenuToggle}
          >
            <Menu size={24} />
          </button>

          {/* Back Button */}
          {showBackButton && onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:text-green-200 hover:bg-green-600 p-2"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="hidden sm:inline">ফিরে যান</span>
            </Button>
          )}

          {/* Page Title */}
          <h1 className="text-xl lg:text-2xl font-bold text-white">{title}</h1>
        </div>

        {/* Right Content */}
        {rightContent && (
          <div className="flex items-center space-x-2">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
