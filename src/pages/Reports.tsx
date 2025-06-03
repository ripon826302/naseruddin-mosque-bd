
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Printer, Calendar } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { formatCurrency } from '@/utils/dates';

const Reports: React.FC = () => {
  const { income, expenses, donors, settings } = useMosqueStore();
  const [filters, setFilters] = useState({
    type: 'all', // all, income, expense
    startDate: '',
    endDate: '',
    category: ''
  });

  const getFilteredData = () => {
    let incomeData = [...income];
    let expenseData = [...expenses];

    // Filter by date range
    if (filters.startDate) {
      incomeData = incomeData.filter(item => item.date >= filters.startDate);
      expenseData = expenseData.filter(item => item.date >= filters.startDate);
    }
    if (filters.endDate) {
      incomeData = incomeData.filter(item => item.date <= filters.endDate);
      expenseData = expenseData.filter(item => item.date <= filters.endDate);
    }

    // Filter by category
    if (filters.category) {
      if (filters.category === 'Monthly Donation' || filters.category === 'One-time Donation') {
        incomeData = incomeData.filter(item => item.source === filters.category);
        expenseData = []; // Clear expense data if filtering by income category
      } else {
        expenseData = expenseData.filter(item => item.type === filters.category);
        incomeData = []; // Clear income data if filtering by expense category
      }
    }

    return { incomeData, expenseData };
  };

  const { incomeData, expenseData } = getFilteredData();
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;

  const resetFilters = () => {
    setFilters({
      type: 'all',
      startDate: '',
      endDate: '',
      category: ''
    });
  };

  const generatePrintableReport = () => {
    const dateRange = filters.startDate || filters.endDate 
      ? `${filters.startDate ? new Date(filters.startDate).toLocaleDateString('bn-BD') : 'শুরু'} থেকে ${filters.endDate ? new Date(filters.endDate).toLocaleDateString('bn-BD') : 'শেষ'}`
      : 'সব তারিখ';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>আয়-ব্যয় রিপোর্ট - ${settings.name}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #2d5a2d;
              padding-bottom: 20px;
            }
            .mosque-name {
              font-size: 24px;
              font-weight: bold;
              color: #2d5a2d;
              margin-bottom: 5px;
            }
            .mosque-address {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .report-title {
              font-size: 20px;
              font-weight: bold;
              margin: 15px 0;
            }
            .report-meta {
              font-size: 12px;
              color: #888;
            }
            .summary-section {
              margin: 30px 0;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #dee2e6;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              text-align: center;
            }
            .summary-item {
              padding: 15px;
              background: white;
              border-radius: 6px;
              border: 1px solid #e9ecef;
            }
            .summary-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            .summary-amount {
              font-size: 18px;
              font-weight: bold;
            }
            .income-amount { color: #198754; }
            .expense-amount { color: #dc3545; }
            .balance-amount { color: #0d6efd; }
            .balance-negative { color: #fd7e14; }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin: 30px 0 15px 0;
              color: #2d5a2d;
              border-bottom: 1px solid #2d5a2d;
              padding-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #dee2e6;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa;
              font-weight: bold;
              color: #495057;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .amount-cell {
              text-align: right;
              font-weight: 600;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              font-size: 11px;
              color: #666;
              text-align: center;
            }
            .filter-info {
              background: #e7f3ff;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              font-size: 13px;
              border: 1px solid #b3d9ff;
            }
            .no-data {
              text-align: center;
              padding: 40px;
              color: #666;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="mosque-name">${settings.name}</div>
            <div class="mosque-address">${settings.address}</div>
            ${settings.phone ? `<div class="mosque-address">ফোন: ${settings.phone}</div>` : ''}
            <div class="report-title">আয়-ব্যয় রিপোর্ট</div>
            <div class="report-meta">
              প্রতিবেদন তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')} | 
              সময়: ${new Date().toLocaleTimeString('bn-BD')}
            </div>
          </div>

          <div class="filter-info">
            <strong>ফিল্টার তথ্য:</strong><br>
            সময়কাল: ${dateRange}<br>
            ধরন: ${filters.type === 'all' ? 'সব' : filters.type === 'income' ? 'আয়' : 'ব্যয়'}<br>
            ক্যাটেগরি: ${filters.category || 'সব'}
          </div>

          <div class="summary-section">
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">মোট আয়</div>
                <div class="summary-amount income-amount">${formatCurrency(totalIncome)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">মোট ব্যয়</div>
                <div class="summary-amount expense-amount">${formatCurrency(totalExpense)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">ব্যালেন্স</div>
                <div class="summary-amount ${balance >= 0 ? 'balance-amount' : 'balance-negative'}">${formatCurrency(Math.abs(balance))}</div>
              </div>
            </div>
          </div>

          ${(filters.type === 'all' || filters.type === 'income') && incomeData.length > 0 ? `
            <div class="section-title">আয়ের বিস্তারিত</div>
            <table>
              <thead>
                <tr>
                  <th>তারিখ</th>
                  <th>উৎস</th>
                  <th>দাতা</th>
                  <th>পরিমাণ (টাকা)</th>
                </tr>
              </thead>
              <tbody>
                ${incomeData.map(item => `
                  <tr>
                    <td>${new Date(item.date).toLocaleDateString('bn-BD')}</td>
                    <td>${item.source}</td>
                    <td>${item.donorId ? donors.find(d => d.id === item.donorId)?.name || 'অজানা' : '-'}</td>
                    <td class="amount-cell">${formatCurrency(item.amount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${(filters.type === 'all' || filters.type === 'expense') && expenseData.length > 0 ? `
            <div class="section-title">ব্যয়ের বিস্তারিত</div>
            <table>
              <thead>
                <tr>
                  <th>তারিখ</th>
                  <th>ধরন</th>
                  <th>বিবরণ</th>
                  <th>পরিমাণ (টাকা)</th>
                </tr>
              </thead>
              <tbody>
                ${expenseData.map(item => `
                  <tr>
                    <td>${new Date(item.date).toLocaleDateString('bn-BD')}</td>
                    <td>${item.type}</td>
                    <td>${item.description || '-'}</td>
                    <td class="amount-cell">${formatCurrency(item.amount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${incomeData.length === 0 && expenseData.length === 0 ? `
            <div class="no-data">
              নির্বাচিত ফিল্টারে কোন ডেটা পাওয়া যায়নি।
            </div>
          ` : ''}

          <div class="footer">
            <p>এই প্রতিবেদন ${settings.name} এর ব্যবস্থাপনা সিস্টেম দ্বারা স্বয়ংক্রিয়ভাবে তৈরি করা হয়েছে।</p>
            <p>যেকোনো প্রশ্নের জন্য যোগাযোগ করুন: ${settings.phone || 'N/A'}</p>
          </div>
        </body>
      </html>
    `;
  };

  const printReport = () => {
    try {
      console.log('Starting print process...');
      console.log('Filtered data:', { incomeData, expenseData, totalIncome, totalExpense });
      
      const htmlContent = generatePrintableReport();
      const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
      
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load before printing
        printWindow.onload = () => {
          console.log('Print window loaded');
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
          }, 100);
        };
        
        // Fallback for browsers that don't support onload
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 1000);
      } else {
        alert('পপ-আপ ব্লক করা হয়েছে। দয়া করে পপ-আপ অনুমতি দিন এবং আবার চেষ্টা করুন।');
      }
    } catch (error) {
      console.error('Print error:', error);
      alert('প্রিন্ট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    }
  };

  const downloadReport = () => {
    try {
      const htmlContent = generatePrintableReport();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mosque-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="text-blue-600" size={32} />
        <h1 className="text-2xl lg:text-3xl font-bold text-blue-800">রিপোর্ট ও প্রিন্ট</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            ফিল্টার অপশন
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type">ধরন</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="ধরন নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব</SelectItem>
                  <SelectItem value="income">শুধু আয়</SelectItem>
                  <SelectItem value="expense">শুধু ব্যয়</SelectItem>
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
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">শেষ তারিখ</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full"
              />
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
                  <SelectItem value="Maintenance">রক্ষণাবেক্ষণ</SelectItem>
                  <SelectItem value="Utility Bills">ইউটিলিটি বিল</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={resetFilters} 
              variant="outline" 
              size="sm"
            >
              ফিল্টার রিসেট করুন
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">মোট আয়</p>
              <p className="text-xl lg:text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">মোট ব্যয়</p>
              <p className="text-xl lg:text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">ব্যালেন্স</p>
              <p className={`text-xl lg:text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>উৎস</TableHead>
                    <TableHead>পরিমাণ</TableHead>
                    <TableHead>দাতা</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString('bn-BD')}</TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell className="font-semibold text-green-600">{formatCurrency(item.amount)}</TableCell>
                      <TableCell>{item.donorId ? donors.find(d => d.id === item.donorId)?.name || 'অজানা' : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {(filters.type === 'all' || filters.type === 'expense') && expenseData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-800">ব্যয়ের বিবরণ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>ধরন</TableHead>
                    <TableHead>পরিমাণ</TableHead>
                    <TableHead>বিবরণ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString('bn-BD')}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="font-semibold text-red-600">{formatCurrency(item.amount)}</TableCell>
                      <TableCell>{item.description || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button onClick={downloadReport} variant="outline" className="flex items-center space-x-2">
          <Download size={16} />
          <span>ডাউনলোড করুন</span>
        </Button>
        <Button onClick={printReport} className="flex items-center space-x-2">
          <Printer size={16} />
          <span>প্রিন্ট করুন</span>
        </Button>
      </div>

      {/* No Data Message */}
      {incomeData.length === 0 && expenseData.length === 0 && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">নির্বাচিত ফিল্টারে কোন ডেটা পাওয়া যায়নি।</p>
              <p className="text-sm mt-2">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
