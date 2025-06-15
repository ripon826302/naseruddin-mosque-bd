
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './button';

interface BackButtonProps {
  onBack: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack, label = 'পিছনে' }) => {
  return (
    <Button
      onClick={onBack}
      variant="outline"
      className="mb-4 text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-green-600 hover:border-green-300"
    >
      <ArrowLeft size={16} className="mr-2" />
      {label}
    </Button>
  );
};

export default BackButton;
