
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">পেইজ খুঁজে পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-8">
            দুঃখিত, আপনি যে পেইজটি খুঁজছেন সেটি আর নেই বা সরানো হয়েছে।
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>হোম পেইজে ফিরে যান</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>পেছনে যান</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
