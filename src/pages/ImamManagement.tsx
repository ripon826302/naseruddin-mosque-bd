
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Plus, Eye, Trash2, FileText, Edit } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/dates';

const ImamManagement: React.FC = () => {
  const { imams, addImam, updateImam, deleteImam, user, expenses } = useMosqueStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    monthlySalary: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active' as 'Active' | 'Inactive'
  });
  const [editingImam, setEditingImam] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const imamData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      monthlySalary: Number(formData.monthlySalary),
      joinDate: formData.joinDate,
      status: formData.status
    };
    
    if (editingImam) {
      updateImam(editingImam, imamData);
      toast({ title: "সফল!", description: "ইমামের তথ্য আপডেট করা হয়েছে।" });
      setEditingImam(null);
    } else {
      addImam(imamData);
      toast({ title: "সফল!", description: "নতুন ইমাম যোগ করা হয়েছে।" });
    }
    
    setFormData({
      name: '',
      phone: '',
      address: '',
      monthlySalary: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
  };

  const handleEdit = (imam: any) => {
    setFormData({
      name: imam.name,
      phone: imam.phone,
      address: imam.address,
      monthlySalary: imam.monthlySalary.toString(),
      joinDate: imam.joinDate,
      status: imam.status
    });
    setEditingImam(imam.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই ইমামের তথ্য মুছে ফেলতে চান?')) {
      deleteImam(id);
      toast({ title: "সফল!", description: "ইমামের তথ্য মুছে ফেলা হয়েছে।" });
    }
  };

  const cancelEdit = () => {
    setEditingImam(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      monthlySalary: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
  };

  const getImamExpenses = (imamId: string) => {
    return expenses.filter(expense => expense.imamId === imamId);
  };

  const getImamTotalPaid = (imamId: string) => {
    return getImamExpenses(imamId).reduce((total, expense) => total + expense.amount, 0);
  };

  const handlePrintReport = (imam: any) => {
    const imamExpenses = getImamExpenses(imam.id);
    const totalPaid = getImamTotalPaid(imam.id);
    
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="text-align: center; color: #333;">ইমামের তথ্য রিপোর্ট</h2>
        <hr>
        <h3>ব্যক্তিগত তথ্য:</h3>
        <p><strong>নাম:</strong> ${imam.name}</p>
        <p><strong>ফোন:</strong> ${imam.phone}</p>
        <p><strong>ঠিকানা:</strong> ${imam.address}</p>
        <p><strong>নিয়োগের তারিখ:</strong> ${new Date(imam.joinDate).toLocaleDateString('bn-BD')}</p>
        <p><strong>মাসিক বেতন:</strong> ${formatCurrency(imam.monthlySalary)}</p>
        <p><strong>স্ট্যাটাস:</strong> ${imam.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</p>
        
        <h3>বেতন ও বোনাস তথ্য:</h3>
        <p><strong>মোট পরিশোধিত:</strong> ${formatCurrency(totalPaid)}</p>
        
        <h4>বিস্তারিত:</h4>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="padding: 8px; text-align: left;">তারিখ</th>
            <th style="padding: 8px; text-align: left;">ধরন</th>
            <th style="padding: 8px; text-align: left;">পরিমাণ</th>
            <th style="padding: 8px; text-align: left;">মাস</th>
          </tr>
          ${imamExpenses.map(expense => `
            <tr>
              <td style="padding: 8px;">${new Date(expense.date).toLocaleDateString('bn-BD')}</td>
              <td style="padding: 8px;">${expense.type}</td>
              <td style="padding: 8px;">${formatCurrency(expense.amount)}</td>
              <td style="padding: 8px;">${expense.month || 'N/A'}</td>
            </tr>
          `).join('')}
        </table>
        
        <p style="margin-top: 20px; text-align: center; font-size: 12px;">
          রিপোর্ট তৈরি: ${new Date().toLocaleDateString('bn-BD')}
        </p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <UserCheck className="text-green-600" size={32} />
        <h1 className="text-3xl font-bold text-green-800">ইমাম ব্যবস্থাপনা</h1>
      </div>

      <Tabs defaultValue="view" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view" className="flex items-center space-x-2">
            <Eye size={16} />
            <span>ইমামের তালিকা</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="flex items-center space-x-2">
              <Plus size={16} />
              <span>{editingImam ? 'ইমামের তথ্য সম্পাদনা' : 'নতুন ইমাম যোগ করুন'}</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">ইমামের তালিকা</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {imams.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">কোন ইমামের তথ্য পাওয়া যায়নি।</p>
                ) : (
                  imams.map((imam) => (
                    <div key={imam.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-4">
                            <h3 className="font-semibold text-green-800 text-lg">{imam.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              imam.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {imam.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <p>ফোন: {imam.phone}</p>
                            <p>মাসিক বেতন: {formatCurrency(imam.monthlySalary)}</p>
                            <p>ঠিকানা: {imam.address}</p>
                            <p>নিয়োগের তারিখ: {new Date(imam.joinDate).toLocaleDateString('bn-BD')}</p>
                            <p className="md:col-span-2">
                              মোট পরিশোধিত: {formatCurrency(getImamTotalPaid(imam.id))}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrintReport(imam)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <FileText size={16} className="mr-1" />
                            রিপোর্ট প্রিন্ট
                          </Button>
                          {isAdmin && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(imam)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <Edit size={16} className="mr-1" />
                                সম্পাদনা
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(imam.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} className="mr-1" />
                                মুছুন
                              </Button>
                            </>
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
                <CardTitle className="text-green-800">
                  {editingImam ? 'ইমামের তথ্য সম্পাদনা করুন' : 'নতুন ইমাম যোগ করুন'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">নাম</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="ইমামের নাম লিখুন"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">মোবাইল নম্বর</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="মোবাইল নম্বর লিখুন"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">ঠিকানা</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monthlySalary">মাসিক বেতন (টাকা)</Label>
                      <Input
                        id="monthlySalary"
                        type="number"
                        value={formData.monthlySalary}
                        onChange={(e) => setFormData({...formData, monthlySalary: e.target.value})}
                        placeholder="মাসিক বেতনের পরিমাণ"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="joinDate">নিয়োগের তারিখ</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">স্ট্যাটাস</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: 'Active' | 'Inactive') => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">সক্রিয়</SelectItem>
                        <SelectItem value="Inactive">নিষ্ক্রিয়</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                      {editingImam ? 'আপডেট করুন' : 'ইমাম যোগ করুন'}
                    </Button>
                    {editingImam && (
                      <Button type="button" variant="outline" onClick={cancelEdit}>
                        বাতিল
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ImamManagement;
