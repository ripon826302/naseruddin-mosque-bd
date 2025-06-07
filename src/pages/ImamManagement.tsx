
import React, { useState } from 'react';
import { Plus, Edit, DollarSign, Calendar, Phone, MapPin, User } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const ImamManagement: React.FC = () => {
  const { imam, addImam, updateImam, addSalaryHistory } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [selectedImam, setSelectedImam] = useState<string>('');
  
  const [newImam, setNewImam] = useState({
    name: '',
    phone: '',
    address: '',
    monthlySalary: 0,
    joinDate: ''
  });

  const [salaryUpdate, setSalaryUpdate] = useState({
    newSalary: 0,
    reason: ''
  });

  const handleAddImam = () => {
    if (!newImam.name || !newImam.phone || !newImam.address || !newImam.joinDate) {
      toast.error('সব ক্ষেত্র পূরণ করুন');
      return;
    }

    addImam({
      name: newImam.name,
      phone: newImam.phone,
      address: newImam.address,
      monthlySalary: newImam.monthlySalary,
      joinDate: newImam.joinDate,
      status: 'Active'
    });

    setNewImam({ name: '', phone: '', address: '', monthlySalary: 0, joinDate: '' });
    setIsAddDialogOpen(false);
    toast.success('ইমাম সফলভাবে যুক্ত হয়েছে');
  };

  const handleSalaryUpdate = () => {
    const currentImam = imam.find(i => i.id === selectedImam);
    if (!currentImam || salaryUpdate.newSalary <= 0) {
      toast.error('সঠিক তথ্য দিন');
      return;
    }

    // Add to salary history
    addSalaryHistory({
      imamId: selectedImam,
      oldSalary: currentImam.monthlySalary,
      newSalary: salaryUpdate.newSalary,
      changeDate: new Date().toISOString().split('T')[0],
      reason: salaryUpdate.reason
    });

    // Update imam salary
    updateImam(selectedImam, { monthlySalary: salaryUpdate.newSalary });

    setSalaryUpdate({ newSalary: 0, reason: '' });
    setIsSalaryDialogOpen(false);
    toast.success('বেতন সফলভাবে আপডেট হয়েছে');
  };

  const calculateTenure = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const months = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0) {
      return `${years} বছর ${remainingMonths} মাস`;
    }
    return `${remainingMonths} মাস`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">ইমাম ব্যবস্থাপনা</h1>
            <p className="text-gray-400">ইমামের তথ্য ও বেতন ব্যবস্থাপনা</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                নতুন ইমাম যুক্ত করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">নতুন ইমাম যুক্ত করুন</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">নাম</Label>
                  <Input
                    value={newImam.name}
                    onChange={(e) => setNewImam({ ...newImam, name: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="ইমামের নাম লিখুন"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">ফোন নম্বর</Label>
                  <Input
                    value={newImam.phone}
                    onChange={(e) => setNewImam({ ...newImam, phone: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="ফোন নম্বর"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">ঠিকানা</Label>
                  <Input
                    value={newImam.address}
                    onChange={(e) => setNewImam({ ...newImam, address: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="ঠিকানা"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">মাসিক বেতন (টাকা)</Label>
                  <Input
                    type="number"
                    value={newImam.monthlySalary}
                    onChange={(e) => setNewImam({ ...newImam, monthlySalary: parseInt(e.target.value) || 0 })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="মাসিক বেতনের পরিমাণ"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">যোগদানের তারিখ</Label>
                  <Input
                    type="date"
                    value={newImam.joinDate}
                    onChange={(e) => setNewImam({ ...newImam, joinDate: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button onClick={handleAddImam} className="w-full bg-blue-600 hover:bg-blue-700">
                  ইমাম যুক্ত করুন
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {imam.map((imamData) => (
            <Card key={imamData.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-500/20 p-3 rounded-full">
                      <User className="h-8 w-8 text-blue-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">{imamData.name}</CardTitle>
                      <p className="text-gray-400">
                        {imamData.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </p>
                    </div>
                  </div>
                  
                  <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setSelectedImam(imamData.id)}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        বেতন আপডেট
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">বেতন আপডেট করুন</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-300">বর্তমান বেতন: ৳{imamData.monthlySalary.toLocaleString()}</Label>
                        </div>
                        <div>
                          <Label className="text-gray-300">নতুন বেতন (টাকা)</Label>
                          <Input
                            type="number"
                            value={salaryUpdate.newSalary}
                            onChange={(e) => setSalaryUpdate({ ...salaryUpdate, newSalary: parseInt(e.target.value) || 0 })}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="নতুন বেতনের পরিমাণ"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">কারণ (ঐচ্ছিক)</Label>
                          <Input
                            value={salaryUpdate.reason}
                            onChange={(e) => setSalaryUpdate({ ...salaryUpdate, reason: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="বেতন পরিবর্তনের কারণ"
                          />
                        </div>
                        <Button onClick={handleSalaryUpdate} className="w-full bg-green-600 hover:bg-green-700">
                          বেতন আপডেট করুন
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">ফোন</p>
                      <p className="text-white">{imamData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">ঠিকানা</p>
                      <p className="text-white">{imamData.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">যোগদান</p>
                      <p className="text-white">{new Date(imamData.joinDate).toLocaleDateString('bn-BD')}</p>
                      <p className="text-gray-400 text-xs">({calculateTenure(imamData.joinDate)})</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">মাসিক বেতন</p>
                      <p className="text-white font-semibold">৳{imamData.monthlySalary.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {imam.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">কোন ইমাম নেই</h3>
            <p className="text-gray-500 mb-4">প্রথম ইমাম যুক্ত করুন</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImamManagement;
