
import React, { useState } from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/dates';

const AdvancedReports: React.FC = () => {
  const { income, expenses, donors, committee, imams, getTotalIncome, getTotalExpenses } = useMosqueStore();
  const [reportType, setReportType] = useState<'monthly' | 'yearly' | 'donors' | 'committee'>('monthly');

  // Monthly income/expense data
  const monthlyData = React.useMemo(() => {
    const months = {};
    
    income.forEach(item => {
      const month = item.month || new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!months[month]) {
        months[month] = { month, income: 0, expense: 0 };
      }
      months[month].income += item.amount;
    });
    
    expenses.forEach(item => {
      const month = item.month || new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!months[month]) {
        months[month] = { month, income: 0, expense: 0 };
      }
      months[month].expense += item.amount;
    });
    
    return Object.values(months);
  }, [income, expenses]);

  // Donor status distribution
  const donorStatusData = [
    { name: 'সক্রিয়', value: donors.filter(d => d.status === 'Active').length, color: '#10B981' },
    { name: 'নিষ্ক্রিয়', value: donors.filter(d => d.status === 'Inactive').length, color: '#6B7280' },
    { name: 'দেনাদার', value: donors.filter(d => d.status === 'Defaulter').length, color: '#EF4444' }
  ];

  // Income source distribution
  const incomeSourceData = [
    { 
      name: 'মাসিক চাঁদা', 
      value: income.filter(i => i.source === 'Monthly Donation').reduce((sum, i) => sum + i.amount, 0),
      color: '#3B82F6'
    },
    { 
      name: 'একবারে দান', 
      value: income.filter(i => i.source === 'One-time Donation').reduce((sum, i) => sum + i.amount, 0),
      color: '#8B5CF6'
    },
    { 
      name: 'দান বাক্স', 
      value: income.filter(i => i.source === 'Donation Box').reduce((sum, i) => sum + i.amount, 0),
      color: '#10B981'
    },
    { 
      name: 'অন্যান্য', 
      value: income.filter(i => i.source === 'Others').reduce((sum, i) => sum + i.amount, 0),
      color: '#F59E0B'
    }
  ];

  // Expense type distribution
  const expenseTypeData = [
    { 
      name: 'ইমাম বেতন', 
      value: expenses.filter(e => e.type === 'Imam Salary').reduce((sum, e) => sum + e.amount, 0),
      color: '#EF4444'
    },
    { 
      name: 'বিদ্যুৎ বিল', 
      value: expenses.filter(e => e.type === 'Electricity Bill').reduce((sum, e) => sum + e.amount, 0),
      color: '#F59E0B'
    },
    { 
      name: 'অন্যান্য', 
      value: expenses.filter(e => e.type === 'Others').reduce((sum, e) => sum + e.amount, 0),
      color: '#6B7280'
    }
  ];

  const exportReport = () => {
    const reportData = {
      totalIncome: getTotalIncome(),
      totalExpenses: getTotalExpenses(),
      balance: getTotalIncome() - getTotalExpenses(),
      monthlyData,
      donorStatusData,
      incomeSourceData,
      expenseTypeData,
      donors: donors.length,
      committee: committee.length,
      imams: imams.length,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mosque-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">উন্নত রিপোর্ট</h1>
            <p className="text-gray-400">বিস্তারিত আর্থিক ও পরিসংখ্যান রিপোর্ট</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={exportReport}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg"
            >
              <Download className="h-5 w-5 mr-2" />
              রিপোর্ট ডাউনলোড
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="flex space-x-4 mb-8">
          {[
            { key: 'monthly', label: 'মাসিক রিপোর্ট', icon: Calendar },
            { key: 'yearly', label: 'বার্ষিক রিপোর্ট', icon: TrendingUp },
            { key: 'donors', label: 'দাতা রিপোর্ট', icon: Users },
            { key: 'committee', label: 'কমিটি রিপোর্ট', icon: FileText }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setReportType(key as any)}
              variant={reportType === key ? "default" : "outline"}
              className={`px-6 py-3 ${
                reportType === key 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">মোট আয়</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalIncome())}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">মোট খরচ</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalExpenses())}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">ব্যালেন্স</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalIncome() - getTotalExpenses())}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">মোট দাতা</p>
                  <p className="text-2xl font-bold">{donors.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Income vs Expense */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">মাসিক আয় বনাম খরচ</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }} 
                  />
                  <Bar dataKey="income" fill="#10B981" name="আয়" />
                  <Bar dataKey="expense" fill="#EF4444" name="খরচ" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Donor Status Distribution */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">দাতার অবস্থা</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donorStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {donorStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {donorStatusData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300 text-sm">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Income Source Distribution */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">আয়ের উৎস</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {incomeSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {incomeSourceData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300 text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense Type Distribution */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">খরচের ধরন</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseTypeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }} 
                  />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Donors */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">শীর্ষ দাতাগণ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donors
                  .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
                  .slice(0, 5)
                  .map((donor, index) => (
                    <div key={donor.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{donor.name}</p>
                        <p className="text-gray-400 text-sm">{donor.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{formatCurrency(donor.monthlyAmount)}</p>
                        <p className="text-gray-400 text-sm">মাসিক</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">সাম্প্রতিক লেনদেন</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...income, ...expenses]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">
                          {'source' in transaction ? transaction.source : transaction.type}
                        </p>
                        <p className="text-gray-400 text-sm">{new Date(transaction.date).toLocaleDateString('bn-BD')}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${'source' in transaction ? 'text-green-400' : 'text-red-400'}`}>
                          {'source' in transaction ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedReports;
