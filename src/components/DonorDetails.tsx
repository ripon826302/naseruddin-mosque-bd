
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, Phone, MapPin, Banknote } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { Donor } from '@/types/mosque';
import { formatCurrency } from '@/utils/dates';

interface DonorDetailsProps {
  donor: Donor;
  onClose: () => void;
}

const DonorDetails: React.FC<DonorDetailsProps> = ({ donor, onClose }) => {
  const { getMissingMonths, getDonorPaidMonths, income, settings } = useMosqueStore();
  
  const missingMonths = getMissingMonths(donor.id);
  const paidMonths = getDonorPaidMonths(donor.id);
  const donorPayments = income.filter(i => i.donorId === donor.id);
  
  const totalPaid = donorPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalDue = missingMonths.length * donor.monthlyAmount;

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>দাতার বিস্তারিত তথ্য - ${donor.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .mosque-header { 
              text-align: center; 
              margin-bottom: 30px; 
              border: 3px solid #16a34a; 
              padding: 20px; 
              background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
              border-radius: 10px;
            }
            .mosque-name { 
              font-size: 28px; 
              font-weight: bold; 
              color: #166534; 
              margin-bottom: 8px;
            }
            .mosque-address { 
              font-size: 16px; 
              color: #15803d; 
              margin-bottom: 15px;
            }
            .print-date { 
              font-size: 14px; 
              color: #374151; 
            }
            .donor-info { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #16a34a; 
              padding-bottom: 20px; 
            }
            .donor-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: #1f2937; 
              margin-bottom: 10px;
            }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            .missing { color: #d32f2f; }
            .paid { color: #2e7d32; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="mosque-header">
            <div class="mosque-name">${settings.name}</div>
            <div class="mosque-address">${settings.address}</div>
            <div class="print-date">প্রিন্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}</div>
          </div>
          
          <div class="donor-info">
            <div class="donor-name">দাতার বিস্তারিত তথ্য</div>
            <div style="font-size: 20px; color: #1f2937;">${donor.name}</div>
          </div>
          
          <div class="info-grid">
            <div>
              <div class="info-item">
                <span class="label">নাম:</span> ${donor.name}
              </div>
              <div class="info-item">
                <span class="label">ফোন:</span> ${donor.phone}
              </div>
              <div class="info-item">
                <span class="label">ঠিকানা:</span> ${donor.address}
              </div>
            </div>
            <div>
              <div class="info-item">
                <span class="label">মাসিক অনুদান:</span> ${formatCurrency(donor.monthlyAmount)}
              </div>
              <div class="info-item">
                <span class="label">দান শুরুর তারিখ:</span> ${new Date(donor.startDate).toLocaleDateString('bn-BD')}
              </div>
              <div class="info-item">
                <span class="label">অবস্থা:</span> ${donor.status === 'Active' ? 'সক্রিয়' : donor.status === 'Inactive' ? 'নিষ্ক্রিয়' : 'খেলাপি'}
              </div>
            </div>
          </div>

          <div class="summary">
            <h3>আর্থিক সারসংক্ষেপ</h3>
            <div class="info-item paid">
              <span class="label">মোট পরিশোধিত:</span> ${formatCurrency(totalPaid)}
            </div>
            <div class="info-item missing">
              <span class="label">মোট বকেয়া:</span> ${formatCurrency(totalDue)}
            </div>
            <div class="info-item">
              <span class="label">পরিশোধিত মাস:</span> ${paidMonths.length} টি
            </div>
            <div class="info-item">
              <span class="label">বকেয়া মাস:</span> ${missingMonths.length} টি
            </div>
          </div>

          ${donorPayments.length > 0 ? `
            <h3>পেমেন্টের ইতিহাস</h3>
            <table>
              <thead>
                <tr>
                  <th>তারিখ</th>
                  <th>মাস</th>
                  <th>পরিমাণ</th>
                  <th>রসিদ নম্বর</th>
                </tr>
              </thead>
              <tbody>
                ${donorPayments.map(payment => `
                  <tr>
                    <td>${new Date(payment.date).toLocaleDateString('bn-BD')}</td>
                    <td>${payment.month || 'N/A'}</td>
                    <td>${formatCurrency(payment.amount)}</td>
                    <td>${payment.receiptNumber}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${missingMonths.length > 0 ? `
            <h3 class="missing">বকেয়া মাসসমূহ</h3>
            <table>
              <thead>
                <tr>
                  <th>মাস</th>
                  <th>পরিমাণ</th>
                </tr>
              </thead>
              <tbody>
                ${missingMonths.map(month => `
                  <tr>
                    <td>${month}</td>
                    <td>${formatCurrency(donor.monthlyAmount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-blue-800">দাতার বিস্তারিত তথ্য</DialogTitle>
            <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700">
              <Download size={16} className="mr-2" />
              প্রিন্ট করুন
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">{donor.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-500" />
                <span>{donor.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-500" />
                <span>{donor.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-500" />
                <span>শুরুর তারিখ: {new Date(donor.startDate).toLocaleDateString('bn-BD')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Banknote size={16} className="text-gray-500" />
                <span>মাসিক: {formatCurrency(donor.monthlyAmount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
                <div className="text-sm text-gray-600">মোট পরিশোধিত</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDue)}</div>
                <div className="text-sm text-gray-600">মোট বকেয়া</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{paidMonths.length}</div>
                <div className="text-sm text-gray-600">পরিশোধিত মাস</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{missingMonths.length}</div>
                <div className="text-sm text-gray-600">বকেয়া মাস</div>
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          {donorPayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">পেমেন্টের ইতিহাস</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>তারিখ</TableHead>
                      <TableHead>মাস</TableHead>
                      <TableHead>পরিমাণ</TableHead>
                      <TableHead>রসিদ নম্বর</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donorPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.date).toLocaleDateString('bn-BD')}</TableCell>
                        <TableCell>{payment.month || 'N/A'}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>{payment.receiptNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {missingMonths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">বকেয়া মাসসমূহ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {missingMonths.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-red-800">{month}</span>
                      <Badge className="bg-red-600 text-white">
                        {formatCurrency(donor.monthlyAmount)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonorDetails;
