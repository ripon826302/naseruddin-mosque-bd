
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingDown, Plus, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';
import { PageWithBackProps } from '@/types/pageProps';
import { formatCurrency } from '@/utils/dates';

const ExpenseManagementPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  const { expenses, imams, addExpense, updateExpense, deleteExpense, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    imamId: '',
    month: new Date().toISOString().substring(0, 7)
  });

  const expenseTypes = [
    'Utility Bills', 'Maintenance', 'Salary', 'Construction', 'Cleaning', 
    'Security', 'Events', 'Office Supplies', 'Food & Beverages', 'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData = {
      ...formData,
      amount: parseInt(formData.amount)
    };

    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      toast({ title: "সফল!", description: "ব্যয়ের তথ্য আপডেট হয়েছে।" });
      setEditingExpense(null);
    } else {
      addExpense(expenseData);
      toast({ title: "সফল!", description: "নতুন ব্যয় যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      type: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      imamId: '',
      month: new Date().toISOString().substring(0, 7)
    });
  };

  const handleEdit = (expenseItem: any) => {
    setEditingExpense(expenseItem);
    setFormData({
      type: expenseItem.type,
      amount: expenseItem.amount.toString(),
      date: expenseItem.date,
      description: expenseItem.description || '',
      imamId: expenseItem.imamId || '',
      month: expenseItem.month || expenseItem.date.substring(0, 7)
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ব্যয়ের রেকর্ড মুছে দিতে চান?')) {
      deleteExpense(id);
      toast({ title: "সফল!", description: "ব্যয়ের রেকর্ড মুছে দেওয়া হয়েছে।" });
    }
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const currentMonthExpenses = expenses.filter(item => item.date.startsWith(new Date().toISOString().substring(0, 7))).reduce((sum, item) => sum + item.amount, 0);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {onBack && <BackButton onBack={onBack} />}
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TrendingDown className="text-red-400" size={32} />
            <h1 className="text-3xl font-bold text-white">ব্যয় ব্যবস্থাপনা</h1>
          </div>
          
          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus size={16} className="mr-2" />
                  নতুন ব্যয় যোগ করুন
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>নতুন ব্যয় যোগ করুন</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="type">ব্যয়ের ধরন</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="ব্যয়ের ধরন নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {expenseTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
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
                    <Label htmlFor="description">বিবরণ</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="ব্যয়ের বিবরণ লিখুন"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="imam">ইমাম (ঐচ্ছিক)</Label>
                    <Select value={formData.imamId} onValueChange={(value) => setFormData({...formData, imamId: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="ইমাম নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {imams.map((imam) => (
                          <SelectItem key={imam.id} value={imam.id}>{imam.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    ব্যয় যোগ করুন
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-red-600 to-rose-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">মোট ব্যয়</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">এই মাসের ব্যয়</p>
                  <p className="text-2xl font-bold">{formatCurrency(currentMonthExpenses)}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">মোট এন্ট্রি</p>
                  <p className="text-2xl font-bold">{expenses.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">ব্যয়ের তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expenseItem) => (
                <div key={expenseItem.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-white font-semibold">{expenseItem.type}</h3>
                        <p className="text-gray-400 text-sm">{expenseItem.description}</p>
                        <p className="text-gray-500 text-xs">{new Date(expenseItem.date).toLocaleDateString('bn-BD')}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-red-400 font-bold text-lg">{formatCurrency(expenseItem.amount)}</p>
                        {expenseItem.imamId && (
                          <p className="text-gray-400 text-sm">
                            {imams.find(i => i.id === expenseItem.imamId)?.name}
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
                        onClick={() => handleEdit(expenseItem)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expenseItem.id)}
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
        {editingExpense && (
          <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>ব্যয়ের তথ্য সম্পাদনা</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-type">ব্যয়ের ধরন</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="ব্যয়ের ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {expenseTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
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
                  <Label htmlFor="edit-description">বিবরণ</Label>
                  <Input
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                    আপডেট করুন
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300"
                    onClick={() => setEditingExpense(null)}
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

export default ExpenseManagementPage;
