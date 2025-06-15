
import React from 'react';
import Reports from '@/pages/Reports';
import { PageWithBackProps } from '@/types/pageProps';

const ReportsPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  return <Reports />;
};

export default ReportsPage;
