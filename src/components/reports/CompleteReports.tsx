import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMosqueStore } from '@/store/mosqueStore';
import { FileText, Printer, Download, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/dates';
import PageHeader from '@/components/common/PageHeader';
import DetailedReports from './DetailedReports';

interface CompleteReportsProps {
  onBack?: () => void;
}

const CompleteReports: React.FC<CompleteReportsProps> = ({ onBack }) => {
  const { 
    donors, 
    committee, 
    income, 
    expenses, 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    settings 
  } = useMosqueStore();
  
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showDetailed, setShowDetailed] = useState(false);

  if (showDetailed) {
    return <DetailedReports onBack={() => setShowDetailed(false)} />;
  }

  const handlePrintAllDonors = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalDonated = donors.reduce((sum, donor) => {
      return sum + (donor.payments?.reduce((pSum, payment) => 
        payment.status === 'Paid' ? pSum + payment.amount : pSum, 0) || 0);
    }, 0);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>সকল দাতার তালিকা</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${settings.name}</h1>
          <p>${settings.address}</p>
          <h2>সকল দাতার তালিকা</h2>
          <p>তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
        </div>
        
        <div class="summary">
          <p><strong>মোট দাতা:</strong> ${donors.length} জন</p>
          <p><strong>সক্রিয় দাতা:</strong> ${donors.filter(d => d.status === 'Active').length} জন</p>
          <p><strong>মোট প্রাপ্ত দান:</strong> ${formatCurrency(totalDonated)}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>ক্রমিক</th>
              <th>নাম</th>
              <th>ফোন</th>
              <th>ঠিকানা</th>
              <th>মাসিক চাঁদা</th>
              <th>মোট দান</th>
              <th>অবস্থা</th>
            </tr>
          </thead>
          <tbody>
            ${donors.map((donor, index) => {
              const totalDonation = donor.payments?.reduce((sum, payment) => 
                payment.status === 'Paid' ? sum + payment.amount : sum, 0) || 0;
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${donor.name}</td>
                  <td>${donor.phone}</td>
                  <td>${donor.address}</td>
                  <td>${formatCurrency(donor.monthlyAmount)}</td>
                  <td>${formatCurrency(totalDonation)}</td>
                  <td>${donor.status === 'Active' ? 'সক্রিয়' : donor.status === 'Defaulter' ? 'বকেয়াদার' : 'নিষ্ক্রিয়'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintAllCommittee = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>কমিটির সদস্যদের তালিকা</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .header { text-align: center; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${settings.name}</h1>
          <p>${settings.address}</p>
          <h2>কমিটির সদস্যদের তালিকা</h2>
          <p>তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
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
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintFinancialReport = () => {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    const balance = getBalance();

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>আর্থিক রিপোর্ট</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { margin: 20px 0; padding: 15px; border: 2px solid #000; }
          .text-right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${settings.name}</h1>
          <p>${settings.address}</p>
          <h2>আর্থিক রিপোর্ট</h2>
          <p>তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
        </div>

        <div class="summary">
          <h3>সারসংক্ষেপ</h3>
          <p><strong>মোট আয়:</strong> ${formatCurrency(totalIncome)}</p>
          <p><strong>মোট ব্যয়:</strong> ${formatCurrency(totalExpenses)}</p>
          <p><strong>বর্তমান ব্যালেন্স:</strong> ${formatCurrency(balance)}</p>
        </div>

        <h3>আয়ের বিবরণ</h3>
        <table>
          <thead>
            <tr>
              <th>তারিখ</th>
              <th>উৎস</th>
              <th>পরিমাণ</th>
              <th>রশিদ নং</th>
            </tr>
          </thead>
          <tbody>
            ${income.map(item => `
              <tr>
                <td>${new Date(item.date).toLocaleDateString('bn-BD')}</td>
                <td>${item.source}</td>
                <td class="text-right">${formatCurrency(item.amount)}</td>
                <td>${item.receiptNumber}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3>ব্যয়ের বিবরণ</h3>
        <table>
          <thead>
            <tr>
              <th>তারিখ</th>
              <th>ধরন</th>
              <th>পরিমাণ</th>
              <th>বিবরণ</th>
            </tr>
          </thead>
          <tbody>
            ${expenses.map(item => `
              <tr>
                <td>${new Date(item.date).toLocaleDateString('bn-BD')}</td>
                <td>${item.type}</td>
                <td class="text-right">${formatCurrency(item.amount)}</td>
                <td>${item.description || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="সম্পূর্ণ রিপোর্ট" onBack={onBack} />
        
        {/* Detailed Report Button */}
        <div className="mb-6 text-center">
          <Button onClick={() => setShowDetailed(true)} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
            <FileText size={20} className="mr-2" />
            বিস্তারিত রিপোর্ট দেখুন
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Donors Report */}
          <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 text-blue-400" />
                দাতাদের রিপোর্ট
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p>মোট দাতা: <span className="text-white font-semibold">{donors.length} জন</span></p>
                <p>সক্রিয় দাতা: <span className="text-green-400 font-semibold">{donors.filter(d => d.status === 'Active').length} জন</span></p>
              </div>
              <Button 
                onClick={handlePrintAllDonors}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Printer className="mr-2" size={16} />
                সকল দাতার তালিকা প্রিন্ট করুন
              </Button>
            </CardContent>
          </Card>

          {/* Committee Report */}
          <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 text-purple-400" />
                কমিটির রিপোর্ট
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p>মোট সদস্য: <span className="text-white font-semibold">{committee.length} জন</span></p>
              </div>
              <Button 
                onClick={handlePrintAllCommittee}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Printer className="mr-2" size={16} />
                কমিটির তালিকা প্রিন্ট করুন
              </Button>
            </CardContent>
          </Card>

          {/* Financial Report */}
          <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="mr-2 text-green-400" />
                আর্থিক রিপোর্ট
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p>মোট আয়: <span className="text-green-400 font-semibold">{formatCurrency(getTotalIncome())}</span></p>
                <p>মোট ব্যয়: <span className="text-red-400 font-semibold">{formatCurrency(getTotalExpenses())}</span></p>
                <p>ব্যালেন্স: <span className={`font-semibold ${getBalance() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(getBalance())}
                </span></p>
              </div>
              <Button 
                onClick={handlePrintFinancialReport}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Printer className="mr-2" size={16} />
                আর্থিক রিপোর্ট প্রিন্ট করুন
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{income.length}</div>
              <div className="text-gray-400">আয়ের এন্ট্রি</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{expenses.length}</div>
              <div className="text-gray-400">ব্যয়ের এন্ট্রি</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {donors.filter(d => d.status === 'Defaulter').length}
              </div>
              <div className="text-gray-400">বকেয়াদার</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{committee.length}</div>
              <div className="text-gray-400">কমিটি সদস্য</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteReports;
