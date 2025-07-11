
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus, Eye, Trash2 } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/dates';

const ExpenseManagement: React.FC = () => {
  const { expenses, addExpense, deleteExpense, user, imams } = useMosqueStore();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    amount: '',
    month: '',
    description: '',
    imamId: ''
  });

  const isAdmin = user?.role === 'admin';
  const expenseTypes = ['Imam Salary', 'Imam Bonus', 'Electricity Bill', 'Others'];
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData = {
      date: formData.date,
      amount: Number(formData.amount),
      type: formData.type as any,
      category: formData.type as any,
      month: formData.month,
      description: formData.description,
      imamId: formData.imamId || undefined
    };
    
    addExpense(expenseData);
    toast({ title: "সফল!", description: "খরচ যোগ করা হয়েছে।" });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: '',
      amount: '',
      month: '',
      description: '',
      imamId: ''
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই খরচের তথ্য মুছে ফেলতে চান?')) {
      deleteExpense(id);
      toast({ title: "সফল!", description: "খরচের তথ্য মুছে ফেলা হয়েছে।" });
    }
  };

  const getImamName = (imamId?: string) => {
    if (!imamId) return 'N/A';
    const imam = imams.find(i => i.id === imamId);
    return imam ? imam.name : 'N/A';
  };

  const handleTypeChange = (value: string) => {
    setFormData({...formData, type: value});
    
    // Auto-fill salary amount if Imam Salary is selected and there's an active imam
    if (value === 'Imam Salary' && imams.length > 0) {
      const activeImam = imams.find(imam => imam.status === 'Active');
      if (activeImam) {
        setFormData(prev => ({
          ...prev, 
          type: value,
          amount: activeImam.monthlySalary.toString(),
          imamId: activeImam.id
        }));
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <CreditCard className="text-red-600" size={32} />
        <h1 className="text-3xl font-bold text-red-800">খরচ ব্যবস্থাপনা</h1>
      </div>

      <Tabs defaultValue="view" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view" className="flex items-center space-x-2">
            <Eye size={16} />
            <span>মোট খরচ দেখুন</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="flex items-center space-x-2">
              <Plus size={16} />
              <span>খরচ যোগ করুন</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">খরচের তালিকা</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">কোন খরচের তথ্য পাওয়া যায়নি।</p>
                ) : (
                  expenses.map((expense) => (
                    <div key={expense.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold text-red-800">{formatCurrency(expense.amount)}</span>
                            <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">{expense.type}</span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>তারিখ: {new Date(expense.date).toLocaleDateString('bn-BD')}</p>
                            {expense.month && <p>মাস: {expense.month}</p>}
                            {expense.description && <p>বিবরণ: {expense.description}</p>}
                            {expense.imamId && <p>ইমাম: {getImamName(expense.imamId)}</p>}
                          </div>
                        </div>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} className="mr-1" />
                            মুছুন
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">নতুন খরচ যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    
                    <div>
                      <Label htmlFor="amount">পরিমাণ (টাকা)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="টাকার পরিমাণ লিখুন"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="type">খরচের ধরন</Label>
                    <Select value={formData.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="খরচের ধরন নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.type === 'Imam Salary' || formData.type === 'Imam Bonus') && (
                    <div>
                      <Label htmlFor="imamId">ইমাম নির্বাচন করুন</Label>
                      <Select value={formData.imamId} onValueChange={(value) => setFormData({...formData, imamId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="ইমাম নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {imams.filter(imam => imam.status === 'Active').map((imam) => (
                            <SelectItem key={imam.id} value={imam.id}>{imam.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {(formData.type === 'Imam Salary' || formData.type === 'Electricity Bill') && (
                    <div>
                      <Label htmlFor="month">মাস</Label>
                      <Select value={formData.month} onValueChange={(value) => setFormData({...formData, month: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="মাস নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {(formData.type === 'Others' || formData.type === 'Imam Bonus') && (
                    <div>
                      <Label htmlFor="description">বিবরণ</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="খরচের বিবরণ লিখুন"
                        required
                      />
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    খরচ যোগ করুন
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ExpenseManagement;
