
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserCheck, Plus, Edit, Trash2, Phone, MapPin, Users, DollarSign } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';
import { PageWithBackProps } from '@/types/pageProps';
import { formatCurrency } from '@/utils/dates';

const ImamManagementPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  const { imams, addImam, updateImam, deleteImam, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingImam, setEditingImam] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    monthlySalary: '',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const imamData = {
      ...formData,
      monthlySalary: parseInt(formData.monthlySalary)
    };

    if (editingImam) {
      updateImam(editingImam.id, imamData);
      toast({ title: "সফল!", description: "ইমামের তথ্য আপডেট হয়েছে।" });
      setEditingImam(null);
    } else {
      addImam(imamData);
      toast({ title: "সফল!", description: "নতুন ইমাম যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      name: '',
      phone: '',
      address: '',
      monthlySalary: '',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (imam: any) => {
    setEditingImam(imam);
    setFormData({
      name: imam.name,
      phone: imam.phone,
      address: imam.address,
      monthlySalary: imam.monthlySalary.toString(),
      status: imam.status,
      joinDate: imam.joinDate
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ইমামকে মুছে দিতে চান?')) {
      deleteImam(id);
      toast({ title: "সফল!", description: "ইমাম মুছে দেওয়া হয়েছে।" });
    }
  };

  const activeImams = imams.filter(i => i.status === 'Active');
  const totalMonthlySalary = activeImams.reduce((sum, imam) => sum + imam.monthlySalary, 0);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {onBack && <BackButton onBack={onBack} />}
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <UserCheck className="text-orange-400" size={32} />
            <h1 className="text-3xl font-bold text-white">ইমাম ব্যবস্থাপনা</h1>
          </div>
          
          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus size={16} className="mr-2" />
                  নতুন ইমাম যোগ করুন
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>নতুন ইমাম যোগ করুন</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">নাম</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="ইমামের নাম লিখুন"
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
                    <Label htmlFor="monthlySalary">মাসিক বেতন (টাকা)</Label>
                    <Input
                      id="monthlySalary"
                      type="number"
                      value={formData.monthlySalary}
                      onChange={(e) => setFormData({...formData, monthlySalary: e.target.value})}
                      placeholder="মাসিক বেতনের পরিমাণ"
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
                    <Label htmlFor="joinDate">যোগদানের তারিখ</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                    ইমাম যোগ করুন
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">মোট ইমাম</p>
                  <p className="text-2xl font-bold">{imams.length}</p>
                </div>
                <Users className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">সক্রিয় ইমাম</p>
                  <p className="text-2xl font-bold">{activeImams.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">মাসিক বেতন</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalMonthlySalary)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">নিষ্ক্রিয় ইমাম</p>
                  <p className="text-2xl font-bold">{imams.length - activeImams.length}</p>
                </div>
                <Users className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Imams List */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">ইমামদের তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imams.map((imam) => (
                <div key={imam.id} className={`p-4 rounded-lg border-2 ${
                  imam.status === 'Active' 
                    ? 'bg-green-500/20 border-green-400/50' 
                    : 'bg-gray-800/50 border-gray-600/50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">{imam.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      imam.status === 'Active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {imam.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Phone size={16} />
                      <span>{imam.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin size={16} />
                      <span>{imam.address}</span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      যোগদান: {new Date(imam.joinDate).toLocaleDateString('bn-BD')}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">মাসিক বেতন</p>
                      <p className="text-green-400 font-bold text-lg">{formatCurrency(imam.monthlySalary)}</p>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(imam)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(imam.id)}
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
        {editingImam && (
          <Dialog open={!!editingImam} onOpenChange={() => setEditingImam(null)}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>ইমামের তথ্য সম্পাদনা</DialogTitle>
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
                  <Label htmlFor="edit-monthlySalary">মাসিক বেতন (টাকা)</Label>
                  <Input
                    id="edit-monthlySalary"
                    type="number"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({...formData, monthlySalary: e.target.value})}
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
                  <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                    আপডেট করুন
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300"
                    onClick={() => setEditingImam(null)}
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

export default ImamManagementPage;
