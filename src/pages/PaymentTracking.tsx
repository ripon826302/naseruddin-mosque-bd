
import React, { useState } from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import { CreditCard, Search, Filter, Calendar, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/dates';

const PaymentTracking: React.FC = () => {
  const { donors, income, getMissingMonths } = useMosqueStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getPaymentStatus = (donorId: string) => {
    const paidThisMonth = income.some(
      i => i.donorId === donorId && 
      i.source === 'Monthly Donation' && 
      i.month === currentMonth
    );
    
    const missingMonths = getMissingMonths(donorId);
    
    if (paidThisMonth) return 'paid';
    if (missingMonths.length > 2) return 'overdue';
    return 'pending';
  };

  const filteredDonors = donors
    .filter(donor => 
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.phone.includes(searchTerm)
    )
    .filter(donor => {
      if (statusFilter === 'all') return true;
      return getPaymentStatus(donor.id) === statusFilter;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <div className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="h-3 w-3" />
            <span>পরিশোধিত</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
            <AlertTriangle className="h-3 w-3" />
            <span>অপেক্ষমান</span>
          </div>
        );
      case 'overdue':
        return (
          <div className="flex items-center space-x-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
            <XCircle className="h-3 w-3" />
            <span>বকেয়া</span>
          </div>
        );
      default:
        return null;
    }
  };

  const sendReminder = (donor: any) => {
    // In a real app, this would send SMS/email
    alert(`${donor.name} কে পেমেন্টের রিমাইন্ডার পাঠানো হয়েছে!`);
  };

  const markAsPaid = (donor: any) => {
    // In a real app, this would add a payment record
    alert(`${donor.name} এর পেমেন্ট পরিশোধিত হিসেবে চিহ্নিত করা হয়েছে!`);
  };

  const stats = {
    total: donors.length,
    paid: donors.filter(d => getPaymentStatus(d.id) === 'paid').length,
    pending: donors.filter(d => getPaymentStatus(d.id) === 'pending').length,
    overdue: donors.filter(d => getPaymentStatus(d.id) === 'overdue').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">পেমেন্ট ট্র্যাকিং</h1>
            <p className="text-gray-400">মাসিক চাঁদা পেমেন্টের বিস্তারিত তথ্য</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">মোট দাতা</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">পরিশোধিত</p>
                  <p className="text-2xl font-bold">{stats.paid}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">অপেক্ষমান</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">বকেয়া</p>
                  <p className="text-2xl font-bold">{stats.overdue}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Search className="h-4 w-4 inline mr-2" />
                  দাতা খুঁজুন
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="নাম বা ফোন নম্বর..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Filter className="h-4 w-4 inline mr-2" />
                  স্ট্যাটাস ফিল্টার
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">সব স্ট্যাটাস</option>
                  <option value="paid">পরিশোধিত</option>
                  <option value="pending">অপেক্ষমান</option>
                  <option value="overdue">বকেয়া</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  মাস নির্বাচন
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment List */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">পেমেন্ট তালিকা - {currentMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDonors.map((donor) => {
                const status = getPaymentStatus(donor.id);
                const missingMonths = getMissingMonths(donor.id);
                
                return (
                  <div
                    key={donor.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="text-white font-semibold text-lg">{donor.name}</h3>
                            <p className="text-gray-400">{donor.phone}</p>
                            <p className="text-gray-500 text-sm">{donor.address}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-gray-400 text-xs">মাসিক পরিমাণ</p>
                            <p className="text-white font-bold">{formatCurrency(donor.monthlyAmount)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-xs">বকেয়া মাস</p>
                            <p className="text-red-400 font-bold">{missingMonths.length}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-xs">মোট বকেয়া</p>
                            <p className="text-red-400 font-bold">
                              {formatCurrency(missingMonths.length * donor.monthlyAmount)}
                            </p>
                          </div>
                        </div>

                        {missingMonths.length > 0 && (
                          <div className="mt-3">
                            <p className="text-gray-400 text-xs mb-1">বকেয়া মাসগুলো:</p>
                            <div className="flex flex-wrap gap-1">
                              {missingMonths.slice(0, 3).map((month, index) => (
                                <span key={index} className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                                  {month}
                                </span>
                              ))}
                              {missingMonths.length > 3 && (
                                <span className="text-gray-500 text-xs">
                                  +{missingMonths.length - 3} আরো...
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(status)}
                        
                        <div className="flex space-x-2">
                          {status !== 'paid' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => sendReminder(donor)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                              >
                                রিমাইন্ডার
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => markAsPaid(donor)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                              >
                                পরিশোধিত
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary by Month */}
        <Card className="bg-gray-900/50 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">মাসিক পেমেন্ট সারসংক্ষেপ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['January', 'February', 'March', 'April'].map((month, index) => {
                const monthlyPayments = income.filter(i => 
                  i.source === 'Monthly Donation' && 
                  i.month?.includes(month)
                );
                const totalAmount = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
                const paymentCount = monthlyPayments.length;
                
                return (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">{month} 2024</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">পেমেন্ট সংখ্যা</span>
                        <span className="text-white">{paymentCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">মোট পরিমাণ</span>
                        <span className="text-green-400 font-bold">{formatCurrency(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">সংগ্রহের হার</span>
                        <span className="text-blue-400">
                          {donors.length > 0 ? Math.round((paymentCount / donors.length) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentTracking;
