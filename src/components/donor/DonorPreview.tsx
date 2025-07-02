
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, X } from 'lucide-react';
import { formatCurrency } from '@/utils/dates';

interface Donor {
  id: string;
  name: string;
  phone: string;
  address: string;
  monthlyAmount: number;
  status: string;
  startDate: string;
  payments: Array<{
    id: string;
    amount: number;
    date: string;
    month: string;
    year: number;
    status: string;
  }>;
}

interface DonorPreviewProps {
  donor: Donor | null;
  isOpen: boolean;
  onClose: () => void;
}

const DonorPreview: React.FC<DonorPreviewProps> = ({ donor, isOpen, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!donor) return null;

  const totalDonated = donor.payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white text-black print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle className="flex items-center justify-between">
            দাতার বিবরণ
            <div className="flex space-x-2">
              <Button onClick={handlePrint} size="sm">
                <Printer size={16} className="mr-2" />
                প্রিন্ট করুন
              </Button>
              <Button variant="ghost" onClick={onClose} size="sm">
                <X size={16} />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 print:text-black">
          {/* Header for Print */}
          <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold">দাতার বিবরণ</h1>
            <p className="text-lg">আল-আমিন জামে মসজিদ</p>
          </div>

          {/* Donor Information */}
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg print:border-black">
            <div>
              <h3 className="font-semibold text-lg mb-2">দাতার তথ্য</h3>
              <p><strong>নাম:</strong> {donor.name}</p>
              <p><strong>ফোন:</strong> {donor.phone}</p>
              <p><strong>ঠিকানা:</strong> {donor.address}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">দানের তথ্য</h3>
              <p><strong>মাসিক চাঁদা:</strong> {formatCurrency(donor.monthlyAmount)}</p>
              <p><strong>মোট দান:</strong> {formatCurrency(totalDonated)}</p>
              <p><strong>যোগদানের তারিখ:</strong> {new Date(donor.startDate).toLocaleDateString('bn-BD')}</p>
              <p><strong>অবস্থা:</strong> {donor.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</p>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h3 className="font-semibold text-lg mb-4">দানের ইতিহাস</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 print:border-black">
                <thead>
                  <tr className="bg-gray-100 print:bg-gray-200">
                    <th className="border border-gray-300 print:border-black p-2 text-left">তারিখ</th>
                    <th className="border border-gray-300 print:border-black p-2 text-left">মাস</th>
                    <th className="border border-gray-300 print:border-black p-2 text-right">পরিমাণ</th>
                    <th className="border border-gray-300 print:border-black p-2 text-left">অবস্থা</th>
                  </tr>
                </thead>
                <tbody>
                  {donor.payments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="border border-gray-300 print:border-black p-4 text-center">
                        কোন দানের রেকর্ড নেই
                      </td>
                    </tr>
                  ) : (
                    donor.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="border border-gray-300 print:border-black p-2">
                          {new Date(payment.date).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="border border-gray-300 print:border-black p-2">
                          {payment.month}
                        </td>
                        <td className="border border-gray-300 print:border-black p-2 text-right">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="border border-gray-300 print:border-black p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'Paid' 
                              ? 'bg-green-100 text-green-800 print:bg-transparent print:border print:border-green-800' 
                              : 'bg-red-100 text-red-800 print:bg-transparent print:border print:border-red-800'
                          }`}>
                            {payment.status === 'Paid' ? 'পরিশোধিত' : 'বকেয়া'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 print:bg-gray-100 font-semibold">
                    <td colSpan={2} className="border border-gray-300 print:border-black p-2">
                      মোট
                    </td>
                    <td className="border border-gray-300 print:border-black p-2 text-right">
                      {formatCurrency(totalDonated)}
                    </td>
                    <td className="border border-gray-300 print:border-black p-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Print Footer */}
          <div className="hidden print:block text-center mt-8 pt-4 border-t border-black">
            <p>প্রিন্ট তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonorPreview;
