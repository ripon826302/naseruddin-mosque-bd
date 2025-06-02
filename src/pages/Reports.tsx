
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Printer } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { formatCurrency } from '@/utils/dates';

const Reports: React.FC = () => {
  const { income, expenses, donors } = useMosqueStore();
  const [filters, setFilters] = useState({
    type: 'all', // all, income, expense
    startDate: '',
    endDate: '',
    month: '',
    category: ''
  });

  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const getFilteredData = () => {
    let incomeData = income;
    let expenseData = expenses;

    // Filter by date range
    if (filters.startDate) {
      incomeData = incomeData.filter(item => item.date >= filters.startDate);
      expenseData = expenseData.filter(item => item.date >= filters.startDate);
    }
    if (filters.endDate) {
      incomeData = incomeData.filter(item => item.date <= filters.endDate);
      expenseData = expenseData.filter(item => item.date <= filters.endDate);
    }

    // Filter by month
    if (filters.month) {
      incomeData = incomeData.filter(item => item.month === filters.month);
      expenseData = expenseData.filter(item => item.month === filters.month);
    }

    // Filter by category
    if (filters.category) {
      incomeData = incomeData.filter(item => item.source === filters.category);
      expenseData = expenseData.filter(item => item.type === filters.category);
    }

    return { incomeData, expenseData };
  };

  const { incomeData, expenseData } = getFilteredData();
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>আয়-ব্যয় রিপোর্ট</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .summary { margin: 20px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>উত্তর জুরকাঠী নছের উদ্দিন জামে মসজিদ</h2>
              <h3>আয়-ব্যয় রিপোর্ট</h3>
              <p>তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
            </div>
            <div class="summary">
              <p><strong>মোট আয়:</strong> ${formatCurrency(totalIncome)}</p>
              <p><strong>মোট খরচ:</strong> ${formatCurrency(totalExpense)}</p>
              <p><strong>ব্যালেন্স:</strong> ${formatCurrency(balance)}</p>
            </div>
            ${incomeData.length > 0 ? `
              <h3>আয়ের বিবরণ</h3>
              <table>
                <tr><th>তারিখ</th><th>উৎস</th><th>পরিমাণ</th><th>দাতা</th></tr>
                ${incomeData.map(item => `
                  <tr>
                    <td>${new Date(item.date).toLocaleDateString('bn-BD')}</td>
                    <td>${item.source}</td>
                    <td>${formatCurrency(item.amount)}</td>
                    <td>${item.donorId ? donors.find(d => d.id === item.donorId)?.name || 'অজানা' : '-'}</td>
                  </tr>
                `).join('')}
              </table>
            ` : ''}
            ${expenseData.length > 0 ? `
              <h3>খরচের বিবরণ</h3>
              <table>
                <tr><th>তারিখ</th><th>ধরন</th><th>পরিমাণ</th><th>বিবরণ</th></tr>
                ${expenseData.map(item => `
                  <tr>
                    <td>${new Date(item.date).toLocaleDateString('bn-BD')}</td>
                    <td>${item.type}</td>
                    <td>${formatCurrency(item.amount)}</td>
                    <td>${item.description || '-'}</td>
                  </tr>
                `).join('')}
              </table>
            ` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-blue-800">রিপোর্ট ও প্রিন্ট</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ফিল্টার</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="type">ধরন</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="ধরন নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব</SelectItem>
                  <SelectItem value="income">আয়</SelectItem>
                  <SelectItem value="expense">খরচ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="startDate">শুরুর তারিখ</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">শেষ তারিখ</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="month">মাস</Label>
              <Select value={filters.month} onValueChange={(value) => setFilters({...filters, month: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="মাস নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সব মাস</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="category">ক্যাটেগরি</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সব ক্যাটেগরি</SelectItem>
                  <SelectItem value="Monthly Donation">মাসিক চাঁদা</SelectItem>
                  <SelectItem value="One-time Donation">একবারের দান</SelectItem>
                  <SelectItem value="Imam Salary">ইমাম বেতন</SelectItem>
                  <SelectItem value="Electricity Bill">বিদ্যুৎ বিল</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">মোট আয়</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">মোট খরচ</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">ব্যালেন্স</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(Math.abs(balance))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      {(filters.type === 'all' || filters.type === 'income') && incomeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">আয়ের বিবরণ</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>উৎস</TableHead>
                  <TableHead>পরিমাণ</TableHead>
                  <TableHead>দাতা</TableHead>
                  <TableHead>মাস</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.date).toLocaleDateString('bn-BD')}</TableCell>
                    <TableCell>{item.source}</TableCell>
                    <TableCell className="font-semibold text-green-600">{formatCurrency(item.amount)}</TableCell>
                    <TableCell>{item.donorId ? donors.find(d => d.id === item.donorId)?.name || 'অজানা' : '-'}</TableCell>
                    <TableCell>{item.month || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {(filters.type === 'all' || filters.type === 'expense') && expenseData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-800">খরচের বিবরণ</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>ধরন</TableHead>
                  <TableHead>পরিমাণ</TableHead>
                  <TableHead>মাস</TableHead>
                  <TableHead>বিবরণ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.date).toLocaleDateString('bn-BD')}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="font-semibold text-red-600">{formatCurrency(item.amount)}</TableCell>
                    <TableCell>{item.month || '-'}</TableCell>
                    <TableCell>{item.description || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button onClick={printReport} className="flex items-center space-x-2">
          <Printer size={16} />
          <span>প্রিন্ট করুন</span>
        </Button>
      </div>
    </div>
  );
};

export default Reports;
