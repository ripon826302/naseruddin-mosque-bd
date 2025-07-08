
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  onBack: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack, label = "ফিরে যান" }) => {
  return (
    <Button
      variant="outline"
      onClick={onBack}
      className="mb-6 flex items-center space-x-2 hover:bg-gray-50"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
};

export default BackButton;
