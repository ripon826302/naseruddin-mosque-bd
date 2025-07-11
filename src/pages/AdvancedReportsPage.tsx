
import React from 'react';
import BackButton from '@/components/ui/BackButton';
import { PageWithBackProps } from '@/types/pageProps';

const AdvancedReportsPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  return (
    <div className="p-6 space-y-6">
      {onBack && <BackButton onBack={onBack} />}
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-green-800 mb-4">উন্নত রিপোর্ট</h1>
        <p className="text-gray-600">এই পেইজটি শীঘ্রই তৈরি হবে।</p>
      </div>
    </div>
  );
};

export default AdvancedReportsPage;
