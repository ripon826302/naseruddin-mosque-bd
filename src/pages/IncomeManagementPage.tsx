
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';

interface IncomeManagementPageProps {
  onBack?: () => void;
}

const IncomeManagementPage: React.FC<IncomeManagementPageProps> = ({ onBack }) => {
  const { income, addIncome, updateIncome, deleteIncome, donors, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [formData, setFormData] = useState({
    source: 'Monthly Donation' as 'Monthly Donation' | 'One-time Donation' | 'Donation Box' | 'Others',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    donorId: '',
    month: '',
    receiptNumber: '',
    description: ''
  });

  const isAdmin = user?.role === 'admin';

  const incomeTypes = [
    { value: 'Monthly Donation', label: 'মাসিক চাঁদা' },
    { value: 'One-time Donation', label: 'একবারের দান' },
    { value: 'Donation Box', label: 'দান বাক্স' },
    { value: 'Others', label: 'অন্যান্য' }
  ];

  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const receiptNumber = formData.receiptNumber || `R-${Date.now()}`;
    
    if (editingIncome) {
      updateIncome(editingIncome.id, {
        ...formData,
        amount: parseInt(formData.amount),
        category: formData.source,
        receiptNumber
      });
      toast({ title: "সফল!", description: "আয়ের তথ্য আপডেট হয়েছে।" });
      setEditingIncome(null);
    } else {
      addIncome({
        ...formData,
        amount: parseInt(formData.amount),
        category: formData.source,
        receiptNumber
      });
      toast({ title: "সফল!", description: "নতুন আয় যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      source: 'Monthly Donation',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      donorId: '',
      month: '',
      receiptNumber: '',
      description: ''
    });
  };

  const handleEdit = (incomeItem: any) => {
    setEditingIncome(incomeItem);
    setFormData({
      source: incomeItem.source,
      amount: incomeItem.amount.toString(),
      date: incomeItem.date,
      donorId: incomeItem.donorId || '',
      month: incomeItem.month || '',
      receiptNumber: incomeItem.receiptNumber,
      description: incomeItem.description || ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি এই আয়ের রেকর্ড মুছে দিতে চান?')) {
      deleteIncome(id);
      toast({ title: "সফল!", description: "আয়ের রেকর্ড মুছে দেওয়া হয়েছে।" });
    }
  };

  const getDonorName = (donorId: string) => {
    const donor = donors.find(d => d.id === donorId);
    return donor ? donor.name : 'অজানা দাতা';
  };

  const getSourceBangla = (source: string) => {
    const sourceMap = {
      'Monthly Donation': 'মাসিক চাঁদা',
      'One-time Donation': 'একবারের দান',
      'Donation Box': 'দান বাক্স',
      'Others': 'অন্যান্য'
    };
    return sourceMap[source as keyof typeof sourceMap] || source;
  };

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {onBack && <BackButton onBack={onBack} />}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="text-green-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-green-800">আয় ব্যবস্থাপনা</h1>
            <p className="text-green-600">মোট আয়: ৳{totalIncome.toLocaleString('bn-BD')}</p>
          </div>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus size={16} className="mr-2" />
                নতুন আয় যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>নতুন আয় যোগ করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="source">আয়ের ধরন</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="আয়ের ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="amount">পরিমাণ (৳)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="পরিমাণ লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">তারিখ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                
                {formData.source === 'Monthly Donation' && (
                  <>
                    <div>
                      <Label htmlFor="donor">দাতা</Label>
                      <Select value={formData.donorId} onValueChange={(value) => setFormData({...formData, donorId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="দাতা নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {donors.map((donor) => (
                            <SelectItem key={donor.id} value={donor.id}>
                              {donor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="month">মাস</Label>
                      <Select value={formData.month} onValueChange={(value) => setFormData({...formData, month: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="মাস নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div>
                  <Label htmlFor="receiptNumber">রসিদ নম্বর</Label>
                  <Input
                    id="receiptNumber"
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                    placeholder="রসিদ নম্বর (ঐচ্ছিক)"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  আয় যোগ করুন
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {income.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <DollarSign className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">কোন আয়ের রেকর্ড পাওয়া যায়নি।</p>
          </div>
        ) : (
          income.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-green-800">
                    {getSourceBangla(item.source)}
                  </CardTitle>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} className="text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ৳{item.amount.toLocaleString('bn-BD')}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(item.date).toLocaleDateString('bn-BD')}</span>
                </div>
                {item.donorId && (
                  <div className="text-sm text-gray-600">
                    <strong>দাতা:</strong> {getDonorName(item.donorId)}
                  </div>
                )}
                {item.month && (
                  <div className="text-sm text-gray-600">
                    <strong>মাস:</strong> {item.month}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <strong>রসিদ:</strong> {item.receiptNumber}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingIncome && (
        <Dialog open={!!editingIncome} onOpenChange={() => setEditingIncome(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>আয় সম্পাদনা</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-source">আয়ের ধরন</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-amount">পরিমাণ (৳)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-date">তারিখ</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  আপডেট করুন
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEditingIncome(null)}
                >
                  বাতিল
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default IncomeManagementPage;
