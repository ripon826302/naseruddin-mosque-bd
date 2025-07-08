
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMosqueStore } from '@/store/mosqueStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  FileText,
  Download,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import { formatCurrency } from '@/utils/dates';

interface CompleteReportsProps {
  onBack?: () => void;
}

const CompleteReports: React.FC<CompleteReportsProps> = ({ onBack }) => {
  const { 
    donors, 
    income, 
    expenses, 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    getDefaulters,
    getTotalDueAmount
  } = useMosqueStore();

  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  // Calculate statistics
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const defaulters = getDefaulters();
  const totalDue = getTotalDueAmount();

  // Monthly data for charts
  const monthlyData = React.useMemo(() => {
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    return months.map(month => {
      const monthIncome = income.filter(inc => inc.month === month).reduce((sum, inc) => sum + inc.amount, 0);
      const monthExpenses = expenses.filter(exp => exp.month === month).reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        month,
        income: monthIncome,
        expenses: monthExpenses,
        balance: monthIncome - monthExpenses
      };
    });
  }, [income, expenses]);

  // Income source breakdown
  const incomeBySource = React.useMemo(() => {
    const sources: { [key: string]: number } = {};
    income.forEach(inc => {
      sources[inc.source] = (sources[inc.source] || 0) + inc.amount;
    });
    
    return Object.entries(sources).map(([source, amount]) => ({
      name: source,
      value: amount
    }));
  }, [income]);

  // Expense type breakdown
  const expensesByType = React.useMemo(() => {
    const types: { [key: string]: number } = {};
    expenses.forEach(exp => {
      types[exp.type] = (types[exp.type] || 0) + exp.amount;
    });
    
    return Object.entries(types).map(([type, amount]) => ({
      name: type,
      value: amount
    }));
  }, [expenses]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const donorStats = React.useMemo(() => {
    const active = donors.filter(d => d.status === 'Active').length;
    const inactive = donors.filter(d => d.status === 'Inactive').length;
    const defaulterCount = donors.filter(d => d.status === 'Defaulter').length;
    
    return { active, inactive, defaulter: defaulterCount };
  }, [donors]);

  const generateReport = () => {
    const reportData = {
      period: selectedPeriod,
      generated: new Date().toISOString(),
      summary: {
        totalIncome,
        totalExpenses,
        balance,
        totalDonors: donors.length,
        activeDonors: donorStats.active,
        defaulters: defaulters.length,
        totalDue
      },
      monthlyData,
      incomeBySource,
      expensesByType
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mosque-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {onBack && <BackButton onBack={onBack} />}
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">সম্পূর্ণ রিপোর্ট</h1>
            <p className="text-gray-600 mt-1">মসজিদ কমিটির আর্থিক বিবরণী</p>
          </div>
          <div className="flex space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="current-month">এই মাস</option>
              <option value="last-month">গত মাস</option>
              <option value="current-year">এই বছর</option>
              <option value="all-time">সব সময়</option>
            </select>
            <Button onClick={generateReport} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>রিপোর্ট ডাউনলোড</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">মোট আয়</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-100">মোট ব্যয়</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                <TrendingDown className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">ব্যালেন্স</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">বকেয়া</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(totalDue)}</div>
                <AlertTriangle className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Income vs Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>মাসিক আয় ও ব্যয়</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `৳${value}`} />
                  <Bar dataKey="income" fill="#10B981" name="আয়" />
                  <Bar dataKey="expenses" fill="#EF4444" name="ব্যয়" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income Sources */}
          <Card>
            <CardHeader>
              <CardTitle>আয়ের উৎস</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `৳${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Donor Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>দাতা পরিসংখ্যান</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{donorStats.active}</div>
                <div className="text-sm text-green-700">সক্রিয় দাতা</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{donorStats.inactive}</div>
                <div className="text-sm text-yellow-700">নিষ্ক্রিয় দাতা</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{donorStats.defaulter}</div>
                <div className="text-sm text-red-700">বকেয়াদার</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>সাম্প্রতিক আয়</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {income.slice(0, 5).map((inc, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">{inc.source}</p>
                      <p className="text-sm text-green-600">{new Date(inc.date).toLocaleDateString('bn-BD')}</p>
                    </div>
                    <div className="text-green-700 font-bold">৳{inc.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>সাম্প্রতিক ব্যয়</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.slice(0, 5).map((exp, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-800">{exp.type}</p>
                      <p className="text-sm text-red-600">{new Date(exp.date).toLocaleDateString('bn-BD')}</p>
                    </div>
                    <div className="text-red-700 font-bold">৳{exp.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteReports;
