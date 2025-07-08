
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Phone, MapPin, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { Donor } from '@/types/mosque';
import { useMosqueStore } from '@/store/mosqueStore';

interface DonorDetailsProps {
  donor: Donor | null;
  isOpen: boolean;
  onClose: () => void;
}

const DonorDetails: React.FC<DonorDetailsProps> = ({ donor, isOpen, onClose }) => {
  const { getMissingMonths, getDonorPaidMonths } = useMosqueStore();

  if (!donor) return null;

  const missingMonths = getMissingMonths(donor.id);
  const paidMonths = getDonorPaidMonths(donor.id);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'Defaulter':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-6 w-6 text-blue-600" />
            <span>{donor.name}</span>
            <Badge className={getStatusColor(donor.status)}>
              {donor.status === 'Active' ? 'সক্রিয়' : 
               donor.status === 'Inactive' ? 'নিষ্ক্রিয়' : 'বকেয়াদার'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">ফোন নম্বর</p>
                <p className="font-medium">{donor.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">মাসিক চাঁদা</p>
                <p className="font-medium">৳{donor.monthlyAmount}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">ঠিকানা</p>
              <p className="font-medium">{donor.address}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">যোগদানের তারিখ</p>
              <p className="font-medium">{new Date(donor.startDate).toLocaleDateString('bn-BD')}</p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">পেমেন্ট স্ট্যাটাস</h3>
            
            {paidMonths.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">পরিশোধিত মাসগুলি:</p>
                <div className="flex flex-wrap gap-2">
                  {paidMonths.map((month, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      {month}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {missingMonths.length > 0 && (
              <div>
                <p className="text-sm text-red-600 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  বকেয়া মাসগুলি:
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingMonths.map((month, index) => (
                    <Badge key={index} className="bg-red-100 text-red-800">
                      {month}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-red-600 mt-2">
                  মোট বকেয়া: ৳{missingMonths.length * donor.monthlyAmount}
                </p>
              </div>
            )}

            {paidMonths.length === 0 && missingMonths.length === 0 && (
              <p className="text-gray-500 text-center py-4">কোন পেমেন্ট রেকর্ড নেই</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonorDetails;
