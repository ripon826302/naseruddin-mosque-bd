
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';

interface NoticeBoardPageProps {
  onBack?: () => void;
}

const NoticeBoardPage: React.FC<NoticeBoardPageProps> = ({ onBack }) => {
  const { notices, addNotice, updateNotice, deleteNotice, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'General' as 'General' | 'Prayer' | 'Event' | 'Important' | 'Urgent'
  });

  const isAdmin = user?.role === 'admin';

  const noticeTypes = [
    { value: 'General', label: 'সাধারণ' },
    { value: 'Prayer', label: 'নামাজ' },
    { value: 'Event', label: 'অনুষ্ঠান' },
    { value: 'Important', label: 'গুরুত্বপূর্ণ' },
    { value: 'Urgent', label: 'জরুরি' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNotice) {
      updateNotice(editingNotice.id, formData);
      toast({ title: "সফল!", description: "নোটিশ আপডেট হয়েছে।" });
      setEditingNotice(null);
    } else {
      addNotice(formData);
      toast({ title: "সফল!", description: "নতুন নোটিশ যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      title: '',
      message: '',
      type: 'General'
    });
  };

  const handleEdit = (notice: any) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      message: notice.message,
      type: notice.type
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি এই নোটিশটি মুছে দিতে চান?')) {
      deleteNotice(id);
      toast({ title: "সফল!", description: "নোটিশ মুছে দেওয়া হয়েছে।" });
    }
  };

  const getTypeBangla = (type: string) => {
    const typeMap = {
      'General': 'সাধারণ',
      'Prayer': 'নামাজ',
      'Event': 'অনুষ্ঠান',
      'Important': 'গুরুত্বপূর্ণ',
      'Urgent': 'জরুরি'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Prayer': 'bg-green-100 text-green-800',
      'Event': 'bg-purple-100 text-purple-800',
      'Important': 'bg-orange-100 text-orange-800',
      'Urgent': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {onBack && <BackButton onBack={onBack} />}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-blue-800">নোটিশ বোর্ড</h1>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-2" />
                নতুন নোটিশ যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>নতুন নোটিশ যোগ করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">নোটিশের শিরোনাম</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="নোটিশের শিরোনাম লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">নোটিশের বিবরণ</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="নোটিশের বিবরণ লিখুন"
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">নোটিশের ধরন</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="নোটিশের ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {noticeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  নোটিশ যোগ করুন
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Bell className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">কোন নোটিশ পাওয়া যায়নি।</p>
          </div>
        ) : (
          notices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-blue-800">{notice.title}</CardTitle>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(notice)}
                      >
                        <Edit size={16} className="text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notice.id)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
                <Badge className={getTypeColor(notice.type)}>
                  {getTypeBangla(notice.type)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-700">{notice.message}</p>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Calendar size={16} />
                  <span>{new Date(notice.date).toLocaleDateString('bn-BD')}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingNotice && (
        <Dialog open={!!editingNotice} onOpenChange={() => setEditingNotice(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>নোটিশ সম্পাদনা</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">নোটিশের শিরোনাম</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-message">নোটিশের বিবরণ</Label>
                <Textarea
                  id="edit-message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-type">নোটিশের ধরন</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {noticeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  আপডেট করুন
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEditingNotice(null)}
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

export default NoticeBoardPage;
