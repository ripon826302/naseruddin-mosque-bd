
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Eye, Trash2, Edit } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';

const NoticeBoard: React.FC = () => {
  const { notices, addNotice, updateNotice, deleteNotice, user } = useMosqueStore();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'urgent'
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateNotice(editingId, formData);
      toast({ title: "সফল!", description: "নোটিশ আপডেট করা হয়েছে।" });
      setEditingId(null);
    } else {
      addNotice(formData);
      toast({ title: "সফল!", description: "নতুন নোটিশ যোগ করা হয়েছে।" });
    }
    
    setFormData({
      title: '',
      message: '',
      type: 'info'
    });
  };

  const handleEdit = (notice: any) => {
    setFormData({
      title: notice.title,
      message: notice.message,
      type: notice.type
    });
    setEditingId(notice.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই নোটিশ মুছে ফেলতে চান?')) {
      deleteNotice(id);
      toast({ title: "সফল!", description: "নোটিশ মুছে ফেলা হয়েছে।" });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      message: '',
      type: 'info'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Bell className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-blue-800">নোটিশ বোর্ড</h1>
      </div>

      <Tabs defaultValue="view" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view" className="flex items-center space-x-2">
            <Eye size={16} />
            <span>নোটিশ দেখুন</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="flex items-center space-x-2">
              <Plus size={16} />
              <span>নোটিশ যোগ করুন</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">সকল নোটিশ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notices.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">কোন নোটিশ পাওয়া যায়নি।</p>
                ) : (
                  notices.map((notice) => (
                    <div key={notice.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      notice.type === 'urgent' ? 'border-red-300 bg-red-50' :
                      notice.type === 'warning' ? 'border-orange-300 bg-orange-50' :
                      'border-blue-300 bg-blue-50'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-800 text-lg">{notice.title}</h3>
                          <p className="text-gray-600">{notice.message}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>📅 তারিখ: {new Date(notice.date).toLocaleDateString('bn-BD')}</p>
                            <p>🏷️ ধরন: {notice.type === 'urgent' ? 'জরুরি' : notice.type === 'warning' ? 'সতর্কতা' : 'সাধারণ'}</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(notice)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              <Edit size={16} className="mr-1" />
                              সম্পাদনা
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(notice.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} className="mr-1" />
                              মুছুন
                            </Button>
                          </div>
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
                <CardTitle className="text-blue-800">
                  {editingId ? 'নোটিশ সম্পাদনা করুন' : 'নতুন নোটিশ যোগ করুন'}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                      placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">নোটিশের ধরন</Label>
                    <Select value={formData.type} onValueChange={(value: 'info' | 'warning' | 'urgent') => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="নোটিশের ধরন নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">সাধারণ তথ্য</SelectItem>
                        <SelectItem value="warning">সতর্কতা</SelectItem>
                        <SelectItem value="urgent">জরুরি</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingId ? 'আপডেট করুন' : 'নোটিশ যোগ করুন'}
                    </Button>
                    {editingId && (
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

export default NoticeBoard;
