
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Gift, Plus, Edit, Trash2, Phone, MapPin, Users, UserCheck } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';
import { PageWithBackProps } from '@/types/pageProps';
import { formatCurrency } from '@/utils/dates';

const DonorManagementPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  const { donors, addDonor, updateDonor, deleteDonor, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    monthlyAmount: '',
    status: 'Active',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const donorData = {
      ...formData,
      monthlyAmount: parseInt(formData.monthlyAmount)
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
      startDate: new Date().toISOString().split('T')[0]
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

  const activeDonors = donors.filter(d => d.status === 'Active');
  const totalMonthlyAmount = activeDonors.reduce((sum, donor) => sum + donor.monthlyAmount, 0);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {onBack && <BackButton onBack={onBack} />}
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Gift className="text-purple-400" size={32} />
            <h1 className="text-3xl font-bold text-white">দাতা ব্যবস্থাপনা</h1>
          </div>
          
          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus size={16} className="mr-2" />
                  নতুন দাতা যোগ করুন
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
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
                      className="bg-gray-800 border-gray-600 text-white"
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
                      className="bg-gray-800 border-gray-600 text-white"
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
                      className="bg-gray-800 border-gray-600 text-white"
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
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">স্ট্যাটাস</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Active">সক্রিয়</SelectItem>
                        <SelectItem value="Inactive">নিষ্ক্রিয়</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="startDate">শুরুর তারিখ</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    দাতা যোগ করুন
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">মোট দাতা</p>
                  <p className="text-2xl font-bold">{donors.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">সক্রিয় দাতা</p>
                  <p className="text-2xl font-bold">{activeDonors.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">মাসিক অনুদান</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalMonthlyAmount)}</p>
                </div>
                <Gift className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">নিষ্ক্রিয় দাতা</p>
                  <p className="text-2xl font-bold">{donors.length - activeDonors.length}</p>
                </div>
                <Users className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donors List */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">দাতাদের তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <div key={donor.id} className={`p-4 rounded-lg border-2 ${
                  donor.status === 'Active' 
                    ? 'bg-green-500/20 border-green-400/50' 
                    : 'bg-gray-800/50 border-gray-600/50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">{donor.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donor.status === 'Active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {donor.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Phone size={16} />
                      <span>{donor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin size={16} />
                      <span>{donor.address}</span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      শুরু: {new Date(donor.startDate).toLocaleDateString('bn-BD')}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">মাসিক অনুদান</p>
                      <p className="text-green-400 font-bold text-lg">{formatCurrency(donor.monthlyAmount)}</p>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(donor)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(donor.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        {editingDonor && (
          <Dialog open={!!editingDonor} onOpenChange={() => setEditingDonor(null)}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
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
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-phone">ফোন নম্বর</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-address">ঠিকানা</Label>
                  <Input
                    id="edit-address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-monthlyAmount">মাসিক অনুদান (টাকা)</Label>
                  <Input
                    id="edit-monthlyAmount"
                    type="number"
                    value={formData.monthlyAmount}
                    onChange={(e) => setFormData({...formData, monthlyAmount: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-status">স্ট্যাটাস</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Active">সক্রিয়</SelectItem>
                      <SelectItem value="Inactive">নিষ্ক্রিয়</SelectItem>
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
                    className="flex-1 border-gray-600 text-gray-300"
                    onClick={() => setEditingDonor(null)}
                  >
                    বাতিল
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default DonorManagementPage;
