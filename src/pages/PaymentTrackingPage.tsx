
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Search, Calendar, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import BackButton from '@/components/ui/BackButton';
import { PageWithBackProps } from '@/types/pageProps';
import { formatCurrency } from '@/utils/dates';

const PaymentTrackingPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  const { donors, income } = useMosqueStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [statusFilter, setStatusFilter] = useState('all');

  // Generate payment tracking data
  const generatePaymentTracking = () => {
    const currentDate = new Date();
    const trackingData = donors.map(donor => {
      // Check if donor has paid for the selected month
      const monthlyPayment = income.find(payment => 
        payment.donorId === donor.id && 
        payment.date.startsWith(selectedMonth) &&
        payment.source === 'Monthly Donation'
      );

      const isPaid = !!monthlyPayment;
      const paymentDate = monthlyPayment?.date;
      const amount = monthlyPayment?.amount || donor.monthlyAmount;

      // Calculate due days
      const monthStart = new Date(selectedMonth + '-01');
      const daysSinceMonthStart = Math.floor((currentDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...donor,
        isPaid,
        paymentDate,
        amount,
        daysOverdue: isPaid ? 0 : Math.max(0, daysSinceMonthStart - 7), // Grace period of 7 days
        status: isPaid ? 'paid' : (daysSinceMonthStart > 7 ? 'overdue' : 'pending')
      };
    });

    return trackingData;
  };

  const paymentData = generatePaymentTracking();

  // Filter data based on search and status
  const filteredData = paymentData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalDonors = paymentData.length;
  const paidDonors = paymentData.filter(d => d.isPaid).length;
  const overdueDonors = paymentData.filter(d => d.status === 'overdue').length;
  const pendingDonors = paymentData.filter(d => d.status === 'pending').length;
  const totalCollected = paymentData.filter(d => d.isPaid).reduce((sum, d) => sum + d.amount, 0);
  const totalExpected = paymentData.reduce((sum, d) => sum + d.monthlyAmount, 0);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 border-green-400/50';
      case 'overdue': return 'bg-red-500/20 border-red-400/50';
      case 'pending': return 'bg-yellow-500/20 border-yellow-400/50';
      default: return 'bg-gray-500/20 border-gray-400/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'overdue': return <XCircle className="h-5 w-5 text-red-400" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {onBack && <BackButton onBack={onBack} />}
        
        <div className="flex items-center space-x-3 mb-8">
          <CreditCard className="text-pink-400" size={32} />
          <h1 className="text-3xl font-bold text-white">পেমেন্ট ট্র্যাকিং</h1>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="মাস নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {months.map((month) => (
                    <SelectItem key={month.value} value={`${new Date().getFullYear()}-${month.value}`}>
                      {month.label} {new Date().getFullYear()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="স্ট্যাটাস ফিল্টার" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">সকল স্ট্যাটাস</SelectItem>
                  <SelectItem value="paid">পরিশোধিত</SelectItem>
                  <SelectItem value="pending">অপেক্ষমাণ</SelectItem>
                  <SelectItem value="overdue">বকেয়া</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search size={16} className="mr-2" />
                খুঁজুন
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">মোট দাতা</p>
                  <p className="text-2xl font-bold">{totalDonors}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">পরিশোধিত</p>
                  <p className="text-2xl font-bold">{paidDonors}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">অপেক্ষমাণ</p>
                  <p className="text-2xl font-bold">{pendingDonors}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600 to-rose-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">বকেয়া</p>
                  <p className="text-2xl font-bold">{overdueDonors}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">সংগ্রহীত</p>
                  <p className="text-lg font-bold">{formatCurrency(totalCollected)}</p>
                  <p className="text-xs text-purple-200">/{formatCurrency(totalExpected)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Tracking List */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {new Date(selectedMonth).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })} মাসের পেমেন্ট ট্র্যাকিং
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((donor) => (
                <div key={donor.id} className={`p-4 rounded-lg border-2 ${getStatusColor(donor.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(donor.status)}
                      <div>
                        <h3 className="text-white font-semibold">{donor.name}</h3>
                        <p className="text-gray-400 text-sm">{donor.phone}</p>
                        <p className="text-gray-500 text-xs">{donor.address}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-white font-semibold">{formatCurrency(donor.monthlyAmount)}</p>
                      <p className={`text-sm ${
                        donor.status === 'paid' 
                          ? 'text-green-400' 
                          : donor.status === 'overdue' 
                          ? 'text-red-400' 
                          : 'text-yellow-400'
                      }`}>
                        {donor.status === 'paid' 
                          ? `পরিশোধিত (${new Date(donor.paymentDate!).toLocaleDateString('bn-BD')})` 
                          : donor.status === 'overdue'
                          ? `${donor.daysOverdue} দিন বকেয়া`
                          : 'অপেক্ষমাণ'
                        }
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          donor.status === 'paid' 
                            ? 'bg-green-500 text-white' 
                            : donor.status === 'overdue'
                            ? 'bg-red-500 text-white'
                            : 'bg-yellow-500 text-white'
                        }`}>
                          {donor.status === 'paid' ? 'পরিশোধিত' : donor.status === 'overdue' ? 'বকেয়া' : 'অপেক্ষমাণ'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredData.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">কোনো ডেটা পাওয়া যায়নি</h3>
                  <p className="text-gray-500">নির্বাচিত ফিল্টার অনুযায়ী কোনো পেমেন্ট তথ্য নেই।</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Collection Summary */}
        <Card className="bg-gray-900/50 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">সংগ্রহের সারসংক্ষেপ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">প্রত্যাশিত আয়</p>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalExpected)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm">সংগ্রহীত আয়</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(totalCollected)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm">অবশিষ্ট</p>
                <p className="text-2xl font-bold text-orange-400">{formatCurrency(totalExpected - totalCollected)}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0}%` }}
                />
              </div>
              <p className="text-center text-gray-400 mt-2">
                {totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0}% সংগ্রহ সম্পন্ন
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentTrackingPage;
