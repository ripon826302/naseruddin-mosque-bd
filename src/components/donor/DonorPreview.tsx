
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, X, User, Phone, MapPin, DollarSign } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { formatCurrency } from '@/utils/dates';

interface DonorPreviewProps {
  donorId: string;
  onClose: () => void;
}

const DonorPreview: React.FC<DonorPreviewProps> = ({ donorId, onClose }) => {
  const { donors, income, settings } = useMosqueStore();
  
  const donor = donors.find(d => d.id === donorId);
  const donorIncome = income.filter(i => i.donorId === donorId);
  
  if (!donor) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md m-4">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">দাতার তথ্য পাওয়া যায়নি</p>
            <Button onClick={onClose} className="mt-4">বন্ধ করুন</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalDonated = donorIncome.reduce((sum, item) => sum + item.amount, 0);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>দাতার বিবরণ - ${donor.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .donor-info { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .summary { margin: 20px 0; padding: 15px; border: 2px solid #000; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${settings.name}</h1>
          <p>${settings.address}</p>
          <h2>দাতার বিবরণ</h2>
          <p>তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
        </div>

        <div class="donor-info">
          <h3>দাতার তথ্য</h3>
          <p><strong>নাম:</strong> ${donor.name}</p>
          <p><strong>ফোন:</strong> ${donor.phone}</p>
          <p><strong>ঠিকানা:</strong> ${donor.address}</p>
          <p><strong>মাসিক চাঁদা:</strong> ${formatCurrency(donor.monthlyAmount)}</p>
          <p><strong>অবস্থা:</strong> ${donor.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</p>
        </div>

        <div class="summary">
          <p><strong>মোট দান:</strong> ${formatCurrency(totalDonated)}</p>
          <p><strong>দানের সংখ্যা:</strong> ${donorIncome.length}</p>
        </div>

        <h3>দানের বিবরণ</h3>
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
            ${donorIncome.map(item => `
              <tr>
                <td>${new Date(item.date).toLocaleDateString('bn-BD')}</td>
                <td>${item.source}</td>
                <td>${formatCurrency(item.amount)}</td>
                <td>${item.receiptNumber}</td>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-green-700">দাতার বিবরণ</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              প্রিন্ট করুন
            </Button>
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Donor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span className="font-medium">নাম:</span>
                <span>{donor.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-green-600" />
                <span className="font-medium">ফোন:</span>
                <span>{donor.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span className="font-medium">ঠিকানা:</span>
                <span>{donor.address}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <span className="font-medium">মাসিক চাঁদা:</span>
                <span className="text-green-600 font-semibold">{formatCurrency(donor.monthlyAmount)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">অবস্থা:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  donor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {donor.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">সারসংক্ষেপ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">মোট দান</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalDonated)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">দানের সংখ্যা</p>
                <p className="text-xl font-bold text-blue-600">{donorIncome.length}</p>
              </div>
            </div>
          </div>

          {/* Donations Table */}
          <div>
            <h3 className="font-semibold text-lg mb-3">দানের বিবরণ</h3>
            {donorIncome.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">তারিখ</th>
                      <th className="border border-gray-300 p-2 text-left">উৎস</th>
                      <th className="border border-gray-300 p-2 text-left">পরিমাণ</th>
                      <th className="border border-gray-300 p-2 text-left">রশিদ নং</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donorIncome.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-2">
                          {new Date(item.date).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="border border-gray-300 p-2">{item.source}</td>
                        <td className="border border-gray-300 p-2 text-green-600 font-semibold">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="border border-gray-300 p-2">{item.receiptNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">কোন দানের তথ্য পাওয়া যায়নি</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorPreview;
