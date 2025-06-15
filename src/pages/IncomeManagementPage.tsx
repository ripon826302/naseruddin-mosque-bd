
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, Plus, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';
import { PageWithBackProps } from '@/types/pageProps';
import { formatCurrency } from '@/utils/dates';

const IncomeManagementPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  const { income, donors, addIncome, updateIncome, deleteIncome, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [formData, setFormData] = useState({
    source: '',
    category: 'Donation' as 'Donation' | 'Monthly Subscription' | 'Event' | 'Other',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    donorId: '',
    month: new Date().toISOString().substring(0, 7),
    description: ''
  });

  const sources = [
    'Monthly Donation', 'Zakat', 'Sadaqah', 'Donation Box', 'Event Fund', 
    'Construction Fund', 'Utility Fund', 'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const incomeData = {
      ...formData,
      amount: parseInt(formData.amount)
    };

    if (editingIncome) {
      updateIncome(editingIncome.id, incomeData);
      toast({ title: "সফল!", description: "আয়ের তথ্য আপডেট হয়েছে।" });
      setEditingIncome(null);
    } else {
      addIncome(incomeData);
      toast({ title: "সফল!", description: "নতুন আয় যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      source: '',
      category: 'Donation',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      receiptNumber: '',
      donorId: '',
      month: new Date().toISOString().substring(0, 7),
      description: ''
    });
  };

  const handleEdit = (incomeItem: any) => {
    setEditingIncome(incomeItem);
    setFormData({
      source: incomeItem.source,
      category: incomeItem.category || 'Donation',
      amount: incomeItem.amount.toString(),
      date: incomeItem.date,
      receiptNumber: incomeItem.receiptNumber || '',
      donorId: incomeItem.donorId || '',
      month: incomeItem.month || incomeItem.date.substring(0, 7),
      description: incomeItem.description || ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই আয়ের রেকর্ড মুছে দিতে চান?')) {
      deleteIncome(id);
      toast({ title: "সফল!", description: "আয়ের রেকর্ড মুছে দেওয়া হয়েছে।" });
    }
  };

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const currentMonthIncome = income.filter(item => item.date.startsWith(new Date().toISOString().substring(0, 7))).reduce((sum, item) => sum + item.amount, 0);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {onBack && <BackButton onBack={onBack} />}
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <DollarSign className="text-green-400" size={32} />
            <h1 className="text-3xl font-bold text-white">আয় ব্যবস্থাপনা</h1>
          </div>
          
          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus size={16} className="mr-2" />
                  নতুন আয় যোগ করুন
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>নতুন আয় যোগ করুন</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="source">আয়ের উৎস</Label>
                    <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="আয়ের উৎস নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {sources.map((source) => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">ক্যাটেগরি</Label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Donation">দান</SelectItem>
                        <SelectItem value="Monthly Subscription">মাসিক চাঁদা</SelectItem>
                        <SelectItem value="Event">ইভেন্ট</SelectItem>
                        <SelectItem value="Other">অন্যান্য</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">পরিমাণ (টাকা)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="পরিমাণ লিখুন"
                      className="bg-gray-800 border-gray-600 text-white"
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
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="receiptNumber">রসিদ নম্বর</Label>
                    <Input
                      id="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                      placeholder="রসিদ নম্বর লিখুন"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="donor">দাতা (ঐচ্ছিক)</Label>
                    <Select value={formData.donorId} onValueChange={(value) => setFormData({...formData, donorId: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="দাতা নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {donors.map((donor) => (
                          <SelectItem key={donor.id} value={donor.id}>{donor.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    আয় যোগ করুন
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">মোট আয়</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">এই মাসের আয়</p>
                  <p className="text-2xl font-bold">{formatCurrency(currentMonthIncome)}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">মোট এন্ট্রি</p>
                  <p className="text-2xl font-bold">{income.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income List */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">আয়ের তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {income.map((incomeItem) => (
                <div key={incomeItem.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-white font-semibold">{incomeItem.source}</h3>
                        <p className="text-gray-400 text-sm">রসিদ: {incomeItem.receiptNumber}</p>
                        <p className="text-gray-500 text-xs">{new Date(incomeItem.date).toLocaleDateString('bn-BD')}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-green-400 font-bold text-lg">{formatCurrency(incomeItem.amount)}</p>
                        {incomeItem.donorId && (
                          <p className="text-gray-400 text-sm">
                            {donors.find(d => d.id === incomeItem.donorId)?.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(incomeItem)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(incomeItem.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        {editingIncome && (
          <Dialog open={!!editingIncome} onOpenChange={() => setEditingIncome(null)}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>আয়ের তথ্য সম্পাদনা</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-source">আয়ের উৎস</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="আয়ের উৎস নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {sources.map((source) => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-amount">পরিমাণ (টাকা)</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
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
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-receiptNumber">রসিদ নম্বর</Label>
                  <Input
                    id="edit-receiptNumber"
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
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
                    className="flex-1 border-gray-600 text-gray-300"
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
    </div>
  );
};

export default IncomeManagementPage;
