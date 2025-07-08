
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, MapPin, DollarSign } from 'lucide-react';
import { Donor } from '@/types/mosque';

interface DonorPreviewProps {
  donor: Donor;
}

const DonorPreview: React.FC<DonorPreviewProps> = ({ donor }) => {
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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            {donor.name}
          </CardTitle>
          <Badge className={getStatusColor(donor.status)}>
            {donor.status === 'Active' ? 'সক্রিয়' : 
             donor.status === 'Inactive' ? 'নিষ্ক্রিয়' : 'বকেয়াদার'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          <span className="text-sm">{donor.phone}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{donor.address}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">মাসিক: ৳{donor.monthlyAmount}</span>
        </div>
        <div className="text-xs text-gray-500 pt-2 border-t">
          যোগদানের তারিখ: {new Date(donor.startDate).toLocaleDateString('bn-BD')}
        </div>
      </CardContent>
    </Card>
  );
};

export default DonorPreview;
