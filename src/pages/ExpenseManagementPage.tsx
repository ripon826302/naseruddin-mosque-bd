
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';

interface ExpenseManagementPageProps {
  onBack?: () => void;
}

const ExpenseManagementPage: React.FC<ExpenseManagementPageProps> = ({ onBack }) => {
  const { expenses, addExpense, updateExpense, deleteExpense, imams, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: 'Imam Salary' as 'Imam Salary' | 'Imam Bonus' | 'Electricity Bill' | 'Others',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    month: '',
    imamId: ''
  });

  const isAdmin = user?.role === 'admin';

  const expenseTypes = [
    { value: 'Imam Salary', label: 'ইমামের বেতন' },
    { value: 'Imam Bonus', label: 'ইমামের বোনাস' },
    { value: 'Electricity Bill', label: 'বিদ্যুৎ বিল' },
    { value: 'Others', label: 'অন্যান্য' }
  ];

  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExpense) {
      updateExpense(editingExpense.id, {
        ...formData,
        amount: parseInt(formData.amount),
        category: formData.type
      });
      toast({ title: "সফল!", description: "ব্যয়ের তথ্য আপডেট হয়েছে।" });
      setEditingExpense(null);
    } else {
      addExpense({
        ...formData,
        amount: parseInt(formData.amount),
        category: formData.type
      });
      toast({ title: "সফল!", description: "নতুন ব্যয় যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      type: 'Imam Salary',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      month: '',
      imamId: ''
    });
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setFormData({
      type: expense.type,
      amount: expense.amount.toString(),
      date: expense.date,
      description: expense.description || '',
      month: expense.month || '',
      imamId: expense.imamId || ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি এই ব্যয়ের রেকর্ড মুছে দিতে চান?')) {
      deleteExpense(id);
      toast({ title: "সফল!", description: "ব্যয়ের রেকর্ড মুছে দেওয়া হয়েছে।" });
    }
  };

  const getImamName = (imamId: string) => {
    const imam = imams.find(i => i.id === imamId);
    return imam ? imam.name : 'অজানা ইমাম';
  };

  const getTypeBangla = (type: string) => {
    const typeMap = {
      'Imam Salary': 'ইমামের বেতন',
      'Imam Bonus': 'ইমামের বোনাস',
      'Electricity Bill': 'বিদ্যুৎ বিল',
      'Others': 'অন্যান্য'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {onBack && <BackButton onBack={onBack} />}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrendingUp className="text-red-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-red-800">ব্যয় ব্যবস্থাপনা</h1>
            <p className="text-red-600">মোট ব্যয়: ৳{totalExpenses.toLocaleString('bn-BD')}</p>
          </div>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus size={16} className="mr-2" />
                নতুন ব্যয় যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>নতুন ব্যয় যোগ করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">ব্যয়ের ধরন</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="ব্যয়ের ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseTypes.map((type) => (
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
                
                {(formData.type === 'Imam Salary' || formData.type === 'Imam Bonus') && (
                  <>
                    <div>
                      <Label htmlFor="imam">ইমাম</Label>
                      <Select value={formData.imamId} onValueChange={(value) => setFormData({...formData, imamId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="ইমাম নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {imams.map((imam) => (
                            <SelectItem key={imam.id} value={imam.id}>
                              {imam.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.type === 'Imam Salary' && (
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
                    )}
                  </>
                )}
                
                <div>
                  <Label htmlFor="description">বিবরণ</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="ব্যয়ের বিবরণ লিখুন"
                    rows={3}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  ব্যয় যোগ করুন
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <TrendingUp className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">কোন ব্যয়ের রেকর্ড পাওয়া যায়নি।</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-red-800">
                    {getTypeBangla(expense.type)}
                  </CardTitle>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit size={16} className="text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-red-600">
                  ৳{expense.amount.toLocaleString('bn-BD')}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(expense.date).toLocaleDateString('bn-BD')}</span>
                </div>
                {expense.imamId && (
                  <div className="text-sm text-gray-600">
                    <strong>ইমাম:</strong> {getImamName(expense.imamId)}
                  </div>
                )}
                {expense.month && (
                  <div className="text-sm text-gray-600">
                    <strong>মাস:</strong> {expense.month}
                  </div>
                )}
                {expense.description && (
                  <div className="text-sm text-gray-600">
                    <strong>বিবরণ:</strong> {expense.description}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingExpense && (
        <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>ব্যয় সম্পাদনা</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-type">ব্যয়ের ধরন</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map((type) => (
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
              
              <div>
                <Label htmlFor="edit-description">বিবরণ</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                  আপডেট করুন
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
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
  );
};

export default ExpenseManagementPage;
