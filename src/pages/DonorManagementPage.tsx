
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Gift, Plus, Phone, MapPin, Edit, Trash2, Eye } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';

interface DonorManagementPageProps {
  onBack?: () => void;
}

const DonorManagementPage: React.FC<DonorManagementPageProps> = ({ onBack }) => {
  const { donors, addDonor, updateDonor, deleteDonor, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<any>(null);
  const [viewingDonor, setViewingDonor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    monthlyAmount: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Defaulter',
    startDate: new Date().toISOString().split('T')[0],
    joinDate: new Date().toISOString().split('T')[0]
  });

  const isAdmin = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDonor) {
      updateDonor(editingDonor.id, {
        ...formData,
        monthlyAmount: parseInt(formData.monthlyAmount)
      });
      toast({ title: "সফল!", description: "দাতার তথ্য আপডেট হয়েছে।" });
      setEditingDonor(null);
    } else {
      addDonor({
        ...formData,
        monthlyAmount: parseInt(formData.monthlyAmount),
        payments: [],
        paymentHistory: []
      });
      toast({ title: "সফল!", description: "নতুন দাতা যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      name: '',
      phone: '',
      address: '',
      monthlyAmount: '',
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (donor: any) => {
    setEditingDonor(donor);
    setFormData({
      name: donor.name,
      phone: donor.phone,
      address: donor.address,
      monthlyAmount: donor.monthlyAmount.toString(),
      status: donor.status,
      startDate: donor.startDate,
      joinDate: donor.joinDate
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি এই দাতাকে মুছে দিতে চান?')) {
      deleteDonor(id);
      toast({ title: "সফল!", description: "দাতা মুছে দেওয়া হয়েছে।" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Defaulter': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBangla = (status: string) => {
    switch (status) {
      case 'Active': return 'সক্রিয়';
      case 'Inactive': return 'নিষ্ক্রিয়';
      case 'Defaulter': return 'খেলাপী';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {onBack && <BackButton onBack={onBack} />}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gift className="text-purple-600" size={32} />
          <h1 className="text-3xl font-bold text-purple-800">দাতা ব্যবস্থাপনা</h1>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus size={16} className="mr-2" />
                নতুন দাতা যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>নতুন দাতা যোগ করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">নাম</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="দাতার নাম লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">ফোন নম্বর</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="ফোন নম্বর লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">ঠিকানা</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="ঠিকানা লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="monthlyAmount">মাসিক চাঁদা</Label>
                  <Input
                    id="monthlyAmount"
                    type="number"
                    value={formData.monthlyAmount}
                    onChange={(e) => setFormData({...formData, monthlyAmount: e.target.value})}
                    placeholder="মাসিক চাঁদার পরিমাণ"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">অবস্থা</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">সক্রিয়</SelectItem>
                      <SelectItem value="Inactive">নিষ্ক্রিয়</SelectItem>
                      <SelectItem value="Defaulter">খেলাপী</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  দাতা যোগ করুন
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Gift className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">কোন দাতা পাওয়া যায়নি।</p>
          </div>
        ) : (
          donors.map((donor) => (
            <Card key={donor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-purple-800">{donor.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingDonor(donor)}
                    >
                      <Eye size={16} className="text-blue-600" />
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(donor)}
                        >
                          <Edit size={16} className="text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(donor.id)}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(donor.status)}>
                  {getStatusBangla(donor.status)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone size={16} />
                  <span>{donor.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{donor.address}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>মাসিক চাঁদা:</strong> ৳{donor.monthlyAmount}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>যোগদানের তারিখ:</strong> {new Date(donor.joinDate).toLocaleDateString('bn-BD')}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingDonor && (
        <Dialog open={!!editingDonor} onOpenChange={() => setEditingDonor(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>দাতা সম্পাদনা</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">নাম</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-phone">ফোন নম্বর</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-address">ঠিকানা</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-monthlyAmount">মাসিক চাঁদা</Label>
                <Input
                  id="edit-monthlyAmount"
                  type="number"
                  value={formData.monthlyAmount}
                  onChange={(e) => setFormData({...formData, monthlyAmount: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-status">অবস্থা</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">সক্রিয়</SelectItem>
                    <SelectItem value="Inactive">নিষ্ক্রিয়</SelectItem>
                    <SelectItem value="Defaulter">খেলাপী</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  আপডেট করুন
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEditingDonor(null)}
                >
                  বাতিল
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* View Dialog */}
      {viewingDonor && (
        <Dialog open={!!viewingDonor} onOpenChange={() => setViewingDonor(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>দাতার বিস্তারিত</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>নাম</Label>
                <p className="text-sm text-gray-600">{viewingDonor.name}</p>
              </div>
              <div>
                <Label>ফোন নম্বর</Label>
                <p className="text-sm text-gray-600">{viewingDonor.phone}</p>
              </div>
              <div>
                <Label>ঠিকানা</Label>
                <p className="text-sm text-gray-600">{viewingDonor.address}</p>
              </div>
              <div>
                <Label>মাসিক চাঁদা</Label>
                <p className="text-sm text-gray-600">৳{viewingDonor.monthlyAmount}</p>
              </div>
              <div>
                <Label>অবস্থা</Label>
                <Badge className={getStatusColor(viewingDonor.status)}>
                  {getStatusBangla(viewingDonor.status)}
                </Badge>
              </div>
              <div>
                <Label>যোগদানের তারিখ</Label>
                <p className="text-sm text-gray-600">{new Date(viewingDonor.joinDate).toLocaleDateString('bn-BD')}</p>
              </div>
            </div>
            <Button 
              onClick={() => setViewingDonor(null)}
              className="w-full"
              variant="outline"
            >
              বন্ধ করুন
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DonorManagementPage;
