
import React from 'react';
import CompleteReports from '@/components/reports/CompleteReports';
import { PageWithBackProps } from '@/types/pageProps';

const ReportsPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  return <CompleteReports onBack={onBack} />;
};

export default ReportsPage;
