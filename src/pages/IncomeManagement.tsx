
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Plus, Printer, Eye, Trash2 } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/dates';

const IncomeManagement: React.FC = () => {
  const { income, donors, addIncome, deleteIncome, user } = useMosqueStore();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    source: '',
    amount: '',
    donorId: '',
    month: '',
    description: '',
    receiptNumber: ''
  });

  const isAdmin = user?.role === 'admin';
  const sources = ['Monthly Donation', 'One-time Donation', 'Donation Box', 'Others'];
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RCP-${year}${month}${day}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const receiptNumber = formData.receiptNumber || generateReceiptNumber();
    
    const incomeData = {
      ...formData,
      amount: Number(formData.amount),
      receiptNumber,
      source: formData.source as any
    };
    
    addIncome(incomeData);
    toast({ 
      title: "সফল!", 
      description: `আয় যোগ করা হয়েছে। রসিদ নম্বর: ${receiptNumber}` 
    });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      source: '',
      amount: '',
      donorId: '',
      month: '',
      description: '',
      receiptNumber: ''
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই আয়ের তথ্য মুছে ফেলতে চান?')) {
      deleteIncome(id);
      toast({ title: "সফল!", description: "আয়ের তথ্য মুছে ফেলা হয়েছে।" });
    }
  };

  const printReceipt = (incomeItem: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Money Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .receipt { max-width: 400px; margin: 0 auto; border: 2px solid #16a34a; }
              .header { background: #16a34a; color: white; padding: 15px; text-align: center; }
              .content { padding: 20px; }
              .row { display: flex; justify-content: space-between; margin: 10px 0; }
              .total { font-weight: bold; font-size: 18px; border-top: 2px solid #16a34a; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h2>🕌 উত্তর জুরকাঠী নছের উদ্দিন জামে মসজিদ</h2>
                <p>Money Receipt</p>
              </div>
              <div class="content">
                <div class="row"><span>Receipt No:</span><span>${incomeItem.receiptNumber}</span></div>
                <div class="row"><span>Date:</span><span>${new Date(incomeItem.date).toLocaleDateString('bn-BD')}</span></div>
                <div class="row"><span>Source:</span><span>${incomeItem.source}</span></div>
                ${incomeItem.donorId ? `<div class="row"><span>Donor:</span><span>${donors.find(d => d.id === incomeItem.donorId)?.name || 'Unknown'}</span></div>` : ''}
                ${incomeItem.month ? `<div class="row"><span>Month:</span><span>${incomeItem.month}</span></div>` : ''}
                ${incomeItem.description ? `<div class="row"><span>Description:</span><span>${incomeItem.description}</span></div>` : ''}
                <div class="row total"><span>Amount:</span><span>${formatCurrency(incomeItem.amount)}</span></div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <DollarSign className="text-green-600" size={32} />
        <h1 className="text-3xl font-bold text-green-800">আয় ব্যবস্থাপনা</h1>
      </div>

      <Tabs defaultValue="view" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view" className="flex items-center space-x-2">
            <Eye size={16} />
            <span>মোট আয় দেখুন</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="flex items-center space-x-2">
              <Plus size={16} />
              <span>আয় যোগ করুন</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">আয়ের তালিকা</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {income.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">কোন আয়ের তথ্য পাওয়া যায়নি।</p>
                ) : (
                  income.map((incomeItem) => (
                    <div key={incomeItem.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold text-green-800">{formatCurrency(incomeItem.amount)}</span>
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{incomeItem.source}</span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>তারিখ: {new Date(incomeItem.date).toLocaleDateString('bn-BD')}</p>
                            <p>রসিদ নম্বর: {incomeItem.receiptNumber}</p>
                            {incomeItem.donorId && (
                              <p>দাতা: {donors.find(d => d.id === incomeItem.donorId)?.name || 'Unknown'}</p>
                            )}
                            {incomeItem.month && <p>মাস: {incomeItem.month}</p>}
                            {incomeItem.description && <p>বিবরণ: {incomeItem.description}</p>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => printReceipt(incomeItem)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <Printer size={16} className="mr-1" />
                            প্রিন্ট
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(incomeItem.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} className="mr-1" />
                              মুছুন
                            </Button>
                          )}
                        </div>
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
                <CardTitle className="text-green-800">নতুন আয় যোগ করুন</CardTitle>
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
                    <Label htmlFor="source">আয়ের উৎস</Label>
                    <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="আয়ের উৎস নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                              <SelectItem key={donor.id} value={donor.id}>{donor.name}</SelectItem>
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
                              <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label htmlFor="description">বিবরণ (ঐচ্ছিক)</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="অতিরিক্ত বিবরণ লিখুন"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="receiptNumber">রসিদ নম্বর (ঐচ্ছিক)</Label>
                    <Input
                      id="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                      placeholder="স্বয়ংক্রিয়ভাবে তৈরি হবে"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    আয় যোগ করুন
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

export default IncomeManagement;
