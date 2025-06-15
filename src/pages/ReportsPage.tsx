
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import BackButton from '@/components/ui/BackButton';
import { PageWithBackProps } from '@/types/pageProps';
import { formatCurrency } from '@/utils/dates';

const ReportsPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  const { income, expenses, donors, committee, getTotalIncome, getTotalExpenses, getBalance } = useMosqueStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Generate months and years for selection
  const months = [
    { value: '01', label: 'জানুয়ারি' },
    { value: '02', label: 'ফেব্রুয়ারি' },
    { value: '03', label: 'মার্চ' },
    { value: '04', label: 'এপ্রিল' },
    { value: '05', label: 'মে' },
    { value: '06', label: 'জুন' },
    { value: '07', label: 'জুলাই' },
    { value: '08', label: 'আগস্ট' },
    { value: '09', label: 'সেপ্টেম্বর' },
    { value: '10', label: 'অক্টোবর' },
    { value: '11', label: 'নভেম্বর' },
    { value: '12', label: 'ডিসেম্বর' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  // Filter data by selected period
  const filteredIncome = income.filter(item => 
    selectedMonth ? item.date.startsWith(selectedMonth) : item.date.startsWith(selectedYear)
  );
  
  const filteredExpenses = expenses.filter(item => 
    selectedMonth ? item.date.startsWith(selectedMonth) : item.date.startsWith(selectedYear)
  );

  const periodIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0);
  const periodExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const periodBalance = periodIncome - periodExpenses;

  // Income by source
  const incomeBySource = filteredIncome.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  // Expenses by type
  const expensesByType = filteredExpenses.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleDownloadReport = () => {
    const reportData = {
      period: selectedMonth || selectedYear,
      summary: {
        totalIncome: periodIncome,
        totalExpenses: periodExpenses,
        balance: periodBalance
      },
      incomeBySource,
      expensesByType,
      transactions: {
        income: filteredIncome,
        expenses: filteredExpenses
      }
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mosque-report-${selectedMonth || selectedYear}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {onBack && <BackButton onBack={onBack} />}
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FileText className="text-gray-400" size={32} />
            <h1 className="text-3xl font-bold text-white">রিপোর্ট</h1>
          </div>
          
          <Button 
            onClick={handleDownloadReport}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download size={16} className="mr-2" />
            রিপোর্ট ডাউনলোড
          </Button>
        </div>

        {/* Period Selection */}
        <Card className="bg-gray-900/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">রিপোর্টের সময়কাল নির্বাচন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="মাস নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="">সকল মাস</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={`${selectedYear}-${month.value}`}>
                      {month.label} {selectedYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={(value) => {
                setSelectedYear(value);
                if (selectedMonth) {
                  setSelectedMonth(`${value}-${selectedMonth.split('-')[1]}`);
                }
              }}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="বছর নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">আয়</p>
                  <p className="text-2xl font-bold">{formatCurrency(periodIncome)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600 to-rose-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">ব্যয়</p>
                  <p className="text-2xl font-bold">{formatCurrency(periodExpenses)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-r ${periodBalance >= 0 ? 'from-blue-600 to-cyan-600' : 'from-orange-600 to-red-600'} text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">
                    {periodBalance >= 0 ? 'উদ্বৃত্ত' : 'ঘাটতি'}
                  </p>
                  <p className="text-2xl font-bold">{formatCurrency(Math.abs(periodBalance))}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">লেনদেন</p>
                  <p className="text-2xl font-bold">{filteredIncome.length + filteredExpenses.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income and Expense Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income by Source */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">উৎস অনুযায়ী আয়</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(incomeBySource).map(([source, amount]) => (
                  <div key={source} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">{source}</span>
                    <span className="text-green-400 font-semibold">{formatCurrency(amount)}</span>
                  </div>
                ))}
                {Object.keys(incomeBySource).length === 0 && (
                  <p className="text-gray-500 text-center py-4">এই সময়ে কোনো আয় নেই</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expenses by Type */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">ধরন অনুযায়ী ব্যয়</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(expensesByType).map(([type, amount]) => (
                  <div key={type} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">{type}</span>
                    <span className="text-red-400 font-semibold">{formatCurrency(amount)}</span>
                  </div>
                ))}
                {Object.keys(expensesByType).length === 0 && (
                  <p className="text-gray-500 text-center py-4">এই সময়ে কোনো ব্যয় নেই</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">সাম্প্রতিক লেনদেন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Income Transactions */}
              {filteredIncome.slice(0, 5).map((item) => (
                <div key={`income-${item.id}`} className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{item.source}</span>
                    <p className="text-gray-400 text-sm">{new Date(item.date).toLocaleDateString('bn-BD')}</p>
                  </div>
                  <span className="text-green-400 font-semibold">+{formatCurrency(item.amount)}</span>
                </div>
              ))}

              {/* Expense Transactions */}
              {filteredExpenses.slice(0, 5).map((item) => (
                <div key={`expense-${item.id}`} className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{item.type}</span>
                    <p className="text-gray-400 text-sm">{new Date(item.date).toLocaleDateString('bn-BD')}</p>
                  </div>
                  <span className="text-red-400 font-semibold">-{formatCurrency(item.amount)}</span>
                </div>
              ))}

              {filteredIncome.length === 0 && filteredExpenses.length === 0 && (
                <p className="text-gray-500 text-center py-8">এই সময়ে কোনো লেনদেন নেই</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
