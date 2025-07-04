
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMosqueStore } from '@/store/mosqueStore';
import { ArrowLeft, Calendar, Printer, Filter } from 'lucide-react';
import { formatCurrency, getBengaliDate } from '@/utils/dates';
import PageHeader from '@/components/common/PageHeader';

interface DetailedReportsProps {
  onBack: () => void;
}

const DetailedReports: React.FC<DetailedReportsProps> = ({ onBack }) => {
  const { 
    donors, 
    income, 
    expenses, 
    committee,
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    settings 
  } = useMosqueStore();

  const [selectedReport, setSelectedReport] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const years = ['২০২৪', '২০২৫', '২০২৬'];

  const handlePrintReport = (reportType: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let reportContent = '';
    let reportTitle = '';

    switch (reportType) {
      case 'monthly-income':
        reportTitle = 'মাসিক আয় রিপোর্ট';
        const monthlyIncome = income.filter(i => 
          selectedMonth ? i.month === selectedMonth : true
        );
        reportContent = generateIncomeReport(monthlyIncome);
        break;
      case 'monthly-expense':
        reportTitle = 'মাসিক ব্যয় রিপোর্ট';
        const monthlyExpense = expenses.filter(e => 
          selectedMonth ? e.month === selectedMonth : true
        );
        reportContent = generateExpenseReport(monthlyExpense);
        break;
      case 'donor-wise':
        reportTitle = 'দাতা ভিত্তিক রিপোর্ট';
        reportContent = generateDonorReport();
        break;
      case 'committee':
        reportTitle = 'কমিটি রিপোর্ট';
        reportContent = generateCommitteeReport();
        break;
      default:
        reportTitle = 'সম্পূর্ণ রিপোর্ট';
        reportContent = generateCompleteReport();
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; }
          .mosque-info { margin-bottom: 10px; }
          .report-title { margin: 20px 0; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .summary { margin: 20px 0; padding: 15px; border: 2px solid #000; background-color: #f9f9f9; }
          .text-right { text-align: right; }
          .total-row { font-weight: bold; background-color: #e5e5e5; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="mosque-info">
            <h1>${settings.name}</h1>
            <p>${settings.address}</p>
            <p>ফোন: ${settings.phone} | ইমেইল: ${settings.email}</p>
          </div>
          <h2 class="report-title">${reportTitle}</h2>
          <p>তারিখ: ${getBengaliDate()}</p>
        </div>
        ${reportContent}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const generateIncomeReport = (incomeData: any[]) => {
    const total = incomeData.reduce((sum, item) => sum + item.amount, 0);
    
    return `
      <div class="summary">
        <h3>আয়ের সারসংক্ষেপ</h3>
        <p><strong>মোট আয়:</strong> ${formatCurrency(total)}</p>
        <p><strong>এন্ট্রি সংখ্যা:</strong> ${incomeData.length}</p>
        ${selectedMonth ? `<p><strong>মাস:</strong> ${selectedMonth}</p>` : ''}
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ক্রমিক</th>
            <th>তারিখ</th>
            <th>উৎস</th>
            <th>পরিমাণ</th>
            <th>রশিদ নং</th>
            <th>মাস</th>
          </tr>
        </thead>
        <tbody>
          ${incomeData.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${new Date(item.date).toLocaleDateString('bn-BD')}</td>
              <td>${item.source}</td>
              <td class="text-right">${formatCurrency(item.amount)}</td>
              <td>${item.receiptNumber}</td>
              <td>${item.month || 'N/A'}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="3">মোট</td>
            <td class="text-right">${formatCurrency(total)}</td>
            <td colspan="2"></td>
          </tr>
        </tbody>
      </table>
    `;
  };

  const generateExpenseReport = (expenseData: any[]) => {
    const total = expenseData.reduce((sum, item) => sum + item.amount, 0);
    
    return `
      <div class="summary">
        <h3>ব্যয়ের সারসংক্ষেপ</h3>
        <p><strong>মোট ব্যয়:</strong> ${formatCurrency(total)}</p>
        <p><strong>এন্ট্রি সংখ্যা:</strong> ${expenseData.length}</p>
        ${selectedMonth ? `<p><strong>মাস:</strong> ${selectedMonth}</p>` : ''}
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ক্রমিক</th>
            <th>তারিখ</th>
            <th>ধরন</th>
            <th>পরিমাণ</th>
            <th>বিবরণ</th>
            <th>মাস</th>
          </tr>
        </thead>
        <tbody>
          ${expenseData.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${new Date(item.date).toLocaleDateString('bn-BD')}</td>
              <td>${item.type}</td>
              <td class="text-right">${formatCurrency(item.amount)}</td>
              <td>${item.description || 'N/A'}</td>
              <td>${item.month || 'N/A'}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="3">মোট</td>
            <td class="text-right">${formatCurrency(total)}</td>
            <td colspan="2"></td>
          </tr>
        </tbody>
      </table>
    `;
  };

  const generateDonorReport = () => {
    return `
      <div class="summary">
        <h3>দাতাদের সারসংক্ষেপ</h3>
        <p><strong>মোট দাতা:</strong> ${donors.length} জন</p>
        <p><strong>সক্রিয় দাতা:</strong> ${donors.filter(d => d.status === 'Active').length} জন</p>
        <p><strong>নিষ্ক্রিয় দাতা:</strong> ${donors.filter(d => d.status === 'Inactive').length} জন</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ক্রমিক</th>
            <th>নাম</th>
            <th>ফোন</th>
            <th>ঠিকানা</th>
            <th>মাসিক চাঁদা</th>
            <th>অবস্থা</th>
            <th>যোগদানের তারিখ</th>
          </tr>
        </thead>
        <tbody>
          ${donors.map((donor, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${donor.name}</td>
              <td>${donor.phone}</td>
              <td>${donor.address}</td>
              <td class="text-right">${formatCurrency(donor.monthlyAmount)}</td>
              <td>${donor.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</td>
              <td>${new Date(donor.startDate).toLocaleDateString('bn-BD')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const generateCommitteeReport = () => {
    return `
      <div class="summary">
        <h3>কমিটির সারসংক্ষেপ</h3>
        <p><strong>মোট সদস্য:</strong> ${committee.length} জন</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ক্রমিক</th>
            <th>নাম</th>
            <th>পদবি</th>
            <th>ফোন</th>
            <th>ইমেইল</th>
            <th>যোগদানের তারিখ</th>
          </tr>
        </thead>
        <tbody>
          ${committee.map((member, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${member.name}</td>
              <td>${member.role}</td>
              <td>${member.phone}</td>
              <td>${member.email || 'N/A'}</td>
              <td>${new Date(member.joinDate).toLocaleDateString('bn-BD')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const generateCompleteReport = () => {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    const balance = getBalance();
    
    return `
      <div class="summary">
        <h3>আর্থিক সারসংক্ষেপ</h3>
        <p><strong>মোট আয়:</strong> ${formatCurrency(totalIncome)}</p>
        <p><strong>মোট ব্যয়:</strong> ${formatCurrency(totalExpenses)}</p>
        <p><strong>বর্তমান ব্যালেন্স:</strong> ${formatCurrency(balance)}</p>
      </div>
      
      ${generateIncomeReport(income)}
      <br><br>
      ${generateExpenseReport(expenses)}
      <br><br>
      ${generateDonorReport()}
      <br><br>
      ${generateCommitteeReport()}
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="বিস্তারিত রিপোর্ট" onBack={onBack} />
        
        {/* Filter Section */}
        <Card className="mb-6 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="mr-2" />
              রিপোর্ট ফিল্টার
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="রিপোর্টের ধরন নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="complete">সম্পূর্ণ রিপোর্ট</SelectItem>
                <SelectItem value="monthly-income">মাসিক আয় রিপোর্ট</SelectItem>
                <SelectItem value="monthly-expense">মাসিক ব্যয় রিপোর্ট</SelectItem>
                <SelectItem value="donor-wise">দাতা ভিত্তিক রিপোর্ট</SelectItem>
                <SelectItem value="committee">কমিটি রিপোর্ট</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="মাস নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="">সকল মাস</SelectItem>
                {months.map((month, index) => (
                  <SelectItem key={index} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="বছর নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="">সকল বছর</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">সম্পূর্ণ রিপোর্ট</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">সকল আয়-ব্যয় ও অন্যান্য তথ্যের সম্পূর্ণ রিপোর্ট</p>
              <Button 
                onClick={() => handlePrintReport('complete')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Printer className="mr-2" size={16} />
                সম্পূর্ণ রিপোর্ট প্রিন্ট করুন
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">মাসিক আয় রিপোর্ট</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">নির্দিষ্ট মাসের আয়ের বিস্তারিত রিপোর্ট</p>
              <Button 
                onClick={() => handlePrintReport('monthly-income')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Printer className="mr-2" size={16} />
                আয়ের রিপোর্ট প্রিন্ট করুন
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">মাসিক ব্যয় রিপোর্ট</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">নির্দিষ্ট মাসের ব্যয়ের বিস্তারিত রিপোর্ট</p>
              <Button 
                onClick={() => handlePrintReport('monthly-expense')}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Printer className="mr-2" size={16} />
                ব্যয়ের রিপোর্ট প্রিন্ট করুন
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">দাতা ভিত্তিক রিপোর্ট</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">সকল দাতার তথ্য ও দানের বিবরণ</p>
              <Button 
                onClick={() => handlePrintReport('donor-wise')}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Printer className="mr-2" size={16} />
                দাতাদের রিপোর্ট প্রিন্ট করুন
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">কমিটি রিপোর্ট</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">কমিটির সদস্যদের তথ্য ও দায়িত্ব</p>
              <Button 
                onClick={() => handlePrintReport('committee')}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                <Printer className="mr-2" size={16} />
                কমিটির রিপোর্ট প্রিন্ট করুন
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">কাস্টম রিপোর্ট</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">ফিল্টার অনুযায়ী কাস্টম রিপোর্ট তৈরি করুন</p>
              <Button 
                onClick={() => handlePrintReport(selectedReport || 'complete')}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={!selectedReport}
              >
                <Printer className="mr-2" size={16} />
                কাস্টম রিপোর্ট প্রিন্ট করুন
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{formatCurrency(getTotalIncome())}</div>
              <div className="text-gray-400">মোট আয়</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{formatCurrency(getTotalExpenses())}</div>
              <div className="text-gray-400">মোট ব্যয়</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {formatCurrency(getBalance())}
              </div>
              <div className="text-gray-400">বর্তমান ব্যালেন্স</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{donors.length}</div>
              <div className="text-gray-400">মোট দাতা</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailedReports;
