import React from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/dates';

interface DetailedReportsProps {
  onBack: () => void;
}

const DetailedReports: React.FC<DetailedReportsProps> = ({ onBack }) => {
  const { settings, donors, committee, income, expenses, getTotalIncome, getTotalExpenses, getBalance } = useMosqueStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:text-gray-300"
          >
            <ArrowLeft size={20} className="mr-2" />
            ব্যাক
          </Button>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            <Printer size={16} className="mr-2" />
            প্রিন্ট করুন
          </Button>
        </div>

        {/* Printable Content */}
        <div className="bg-white text-black p-8 rounded-lg print:shadow-none">
          {/* Mosque Header */}
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{settings.name}</h1>
            <p className="text-lg text-gray-600 mb-2">{settings.address}</p>
            <p className="text-sm text-gray-500">ফোন: {settings.phone} | ইমেইল: {settings.email}</p>
          </div>

          {/* Report Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">বিস্তারিত রিপোর্ট</h2>
            <p className="text-gray-600">তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
          </div>

          {/* Financial Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-center">আর্থিক সংক্ষিপ্ত বিবরণ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-700">মোট আয়</h3>
                  <p className="text-2xl font-bold text-green-800">{formatCurrency(getTotalIncome())}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-700">মোট ব্যয়</h3>
                  <p className="text-2xl font-bold text-red-800">{formatCurrency(getTotalExpenses())}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-700">ব্যালেন্স</h3>
                  <p className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                    {formatCurrency(getBalance())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donors Report */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">দাতাগণের তালিকা</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">নাম</th>
                      <th className="border border-gray-300 p-2 text-left">ঠিকানা</th>
                      <th className="border border-gray-300 p-2 text-left">ফোন</th>
                      <th className="border border-gray-300 p-2 text-right">মাসিক চাঁদা</th>
                      <th className="border border-gray-300 p-2 text-center">অবস্থা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor, index) => (
                      <tr key={donor.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border border-gray-300 p-2">{donor.name}</td>
                        <td className="border border-gray-300 p-2">{donor.address}</td>
                        <td className="border border-gray-300 p-2">{donor.phone}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(donor.monthlyAmount)}</td>
                        <td className="border border-gray-300 p-2 text-center">{donor.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Committee Report */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">কমিটির সদস্যগণ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">নাম</th>
                      <th className="border border-gray-300 p-2 text-left">পদবী</th>
                      <th className="border border-gray-300 p-2 text-left">ফোন</th>
                      <th className="border border-gray-300 p-2 text-left">ইমেইল</th>
                      <th className="border border-gray-300 p-2 text-center">যোগদানের তারিখ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {committee.map((member, index) => (
                      <tr key={member.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border border-gray-300 p-2">{member.name}</td>
                        <td className="border border-gray-300 p-2">{member.role}</td>
                        <td className="border border-gray-300 p-2">{member.phone}</td>
                        <td className="border border-gray-300 p-2">{member.email || 'N/A'}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          {new Date(member.joinDate).toLocaleDateString('bn-BD')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Income Report */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">আয়ের বিবরণ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">উৎস</th>
                      <th className="border border-gray-300 p-2 text-right">পরিমাণ</th>
                      <th className="border border-gray-300 p-2 text-center">তারিখ</th>
                      <th className="border border-gray-300 p-2 text-left">রশিদ নং</th>
                    </tr>
                  </thead>
                  <tbody>
                    {income.map((inc, index) => (
                      <tr key={inc.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border border-gray-300 p-2">{inc.source}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(inc.amount)}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          {new Date(inc.date).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="border border-gray-300 p-2">{inc.receiptNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Expense Report */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">ব্যয়ের বিবরণ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">ধরন</th>
                      <th className="border border-gray-300 p-2 text-right">পরিমাণ</th>
                      <th className="border border-gray-300 p-2 text-center">তারিখ</th>
                      <th className="border border-gray-300 p-2 text-left">বিবরণ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp, index) => (
                      <tr key={exp.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border border-gray-300 p-2">{exp.category}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(exp.amount)}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          {new Date(exp.date).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="border border-gray-300 p-2">{exp.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              এই রিপোর্ট {new Date().toLocaleDateString('bn-BD')} তারিখে তৈরি করা হয়েছে
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedReports;