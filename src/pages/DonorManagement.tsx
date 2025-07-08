
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Phone, MapPin, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/dates';
import DonorDetails from '@/components/DonorDetails';

const DonorManagement: React.FC = () => {
  const { donors, addDonor, updateDonor, deleteDonor, user, getMissingMonths } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<any>(null);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    monthlyAmount: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Defaulter',
    startDate: ''
  });

  const isAdmin = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const donorData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      monthlyAmount: Number(formData.monthlyAmount),
      status: formData.status,
      startDate: formData.startDate,
      joinDate: formData.startDate, // Use startDate as joinDate
      payments: [],
      paymentHistory: []
    };
    
    if (editingDonor) {
      updateDonor(editingDonor.id, donorData);
      toast({ title: "সফল!", description: "দাতার তথ্য আপডেট হয়েছে।" });
      setEditingDonor(null);
    } else {
      addDonor(donorData);
      toast({ title: "সফল!", description: "নতুন দাতা যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      name: '',
      phone: '',
      address: '',
      monthlyAmount: '',
      status: 'Active',
      startDate: ''
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
      startDate: donor.startDate
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই দাতাকে মুছে দিতে চান?')) {
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
      case 'Defaulter': return 'খেলাপি';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-blue-800">দাতা ব্যবস্থাপনা</h1>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-2" />
                নতুন দাতা যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                  <Label htmlFor="monthlyAmount">মাসিক অনুদান (টাকা)</Label>
                  <Input
                    id="monthlyAmount"
                    type="number"
                    value={formData.monthlyAmount}
                    onChange={(e) => setFormData({...formData, monthlyAmount: e.target.value})}
                    placeholder="মাসিক অনুদানের পরিমাণ"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="startDate">দান শুরুর তারিখ</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">অবস্থা</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="অবস্থা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">সক্রিয়</SelectItem>
                      <SelectItem value="Inactive">নিষ্ক্রিয়</SelectItem>
                      <SelectItem value="Defaulter">খেলাপি</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  দাতা যোগ করুন
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.map((donor) => {
          const missingMonths = getMissingMonths(donor.id);
          const hasMissingPayments = missingMonths.length > 0;
          
          return (
            <Card key={donor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-blue-800">{donor.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDonor(donor)}
                      title="বিস্তারিত দেখুন"
                    >
                      <Eye size={16} className="text-green-600" />
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(donor)}
                        >
                          <Edit size={16} className="text-blue-600" />
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
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(donor.status)}>
                    {getStatusBangla(donor.status)}
                  </Badge>
                  {hasMissingPayments && (
                    <Badge className="bg-red-100 text-red-800">
                      {missingMonths.length} মাস বাকী
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone size={16} />
                  <span>{donor.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={16} />
                  <span className="text-sm">{donor.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">শুরু: {new Date(donor.startDate || donor.joinDate).toLocaleDateString('bn-BD')}</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    মাসিক অনুদান: {formatCurrency(donor.monthlyAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      {editingDonor && (
        <Dialog open={!!editingDonor} onOpenChange={() => setEditingDonor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>দাতার তথ্য সম্পাদনা</DialogTitle>
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
                <Label htmlFor="edit-monthlyAmount">মাসিক অনুদান</Label>
                <Input
                  id="edit-monthlyAmount"
                  type="number"
                  value={formData.monthlyAmount}
                  onChange={(e) => setFormData({...formData, monthlyAmount: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-startDate">দান শুরুর তারিখ</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-status">অবস্থা</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">সক্রিয়</SelectItem>
                    <SelectItem value="Inactive">নিষ্ক্রিয়</SelectItem>
                    <SelectItem value="Defaulter">খেলাপি</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
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

      {/* Donor Details Dialog */}
      {selectedDonor && (
        <DonorDetails
          donor={selectedDonor}
          isOpen={!!selectedDonor}
          onClose={() => setSelectedDonor(null)}
        />
      )}
    </div>
  );
};

export default DonorManagement;
