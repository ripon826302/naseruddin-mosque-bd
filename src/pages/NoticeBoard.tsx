
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Eye, Trash2, Edit, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 rounded-full opacity-20 animate-spin blur-2xl"></div>
            </div>
            
            <div className="relative z-10 flex items-center justify-center space-x-4">
              <Bell className="text-cyan-400 w-12 h-12 animate-bounce" />
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 animate-pulse digital-font"
                style={{ filter: 'drop-shadow(0 0 20px cyan)' }}>
                নোটিশ বোর্ড
              </h1>
              <Sparkles className="text-purple-400 w-8 h-8 animate-bounce" />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl" />
          
          <Tabs defaultValue="view" className="relative space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-lg blur-lg" />
              <TabsList className="relative grid w-full grid-cols-2 bg-black/60 backdrop-blur-lg border-2 border-cyan-400/30">
                <TabsTrigger value="view" className="flex items-center space-x-2 text-cyan-300 data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-300">
                  <Eye size={16} />
                  <span>নোটিশ দেখুন</span>
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="add" className="flex items-center space-x-2 text-purple-300 data-[state=active]:bg-purple-400/20 data-[state=active]:text-purple-300">
                    <Plus size={16} />
                    <span>নোটিশ যোগ করুন</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="view" className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl blur-lg" />
                <Card className="relative bg-black/60 backdrop-blur-lg border-2 border-cyan-400/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 text-2xl digital-font flex items-center space-x-2">
                      <Bell className="w-6 h-6" />
                      <span>সকল নোটিশ</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notices.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-cyan-300/60 text-lg">কোন নোটিশ পাওয়া যায়নি।</div>
                        </div>
                      ) : (
                        notices.map((notice) => (
                          <div key={notice.id} className={`relative rounded-2xl p-6 backdrop-blur-lg border-2 transition-all duration-500 hover:scale-[1.02] ${
                            notice.type === 'urgent' ? 'border-red-400/40 bg-red-900/20 shadow-red-500/30' :
                            notice.type === 'warning' ? 'border-orange-400/40 bg-orange-900/20 shadow-orange-500/30' :
                            'border-blue-400/40 bg-blue-900/20 shadow-blue-500/30'
                          } shadow-2xl`}>
                            <div className="flex justify-between items-start">
                              <div className="space-y-3">
                                <h3 className="font-bold text-xl text-cyan-300 digital-font">{notice.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{notice.message}</p>
                                <div className="text-sm text-gray-400 space-y-1">
                                  <p className="flex items-center space-x-2">
                                    <span>📅</span>
                                    <span>তারিখ: {new Date(notice.date).toLocaleDateString('bn-BD')}</span>
                                  </p>
                                  <p className="flex items-center space-x-2">
                                    <span>🏷️</span>
                                    <span>ধরন: {notice.type === 'urgent' ? 'জরুরি' : notice.type === 'warning' ? 'সতর্কতা' : 'সাধারণ'}</span>
                                  </p>
                                </div>
                              </div>
                              {isAdmin && (
                                <div className="flex space-x-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(notice)}
                                    className="bg-blue-500/20 border-blue-400/40 text-blue-300 hover:bg-blue-400/30 backdrop-blur-lg"
                                  >
                                    <Edit size={16} className="mr-1" />
                                    সম্পাদনা
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(notice.id)}
                                    className="bg-red-500/20 border-red-400/40 text-red-300 hover:bg-red-400/30 backdrop-blur-lg"
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
              </div>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="add">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-lg" />
                  <Card className="relative bg-black/60 backdrop-blur-lg border-2 border-purple-400/30 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-purple-400 text-2xl digital-font">
                        {editingId ? 'নোটিশ সম্পাদনা করুন' : 'নতুন নোটিশ যোগ করুন'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="title" className="text-cyan-300 font-medium">নোটিশের শিরোনাম</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="নোটিশের শিরোনাম লিখুন"
                            required
                            className="mt-2 bg-black/40 border-cyan-400/30 text-cyan-100 placeholder-gray-500 focus:border-cyan-400"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="message" className="text-cyan-300 font-medium">নোটিশের বিবরণ</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন"
                            required
                            className="mt-2 bg-black/40 border-cyan-400/30 text-cyan-100 placeholder-gray-500 focus:border-cyan-400 min-h-24"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="type" className="text-cyan-300 font-medium">নোটিশের ধরন</Label>
                          <Select value={formData.type} onValueChange={(value: 'info' | 'warning' | 'urgent') => setFormData({...formData, type: value})}>
                            <SelectTrigger className="mt-2 bg-black/40 border-cyan-400/30 text-cyan-100">
                              <SelectValue placeholder="নোটিশের ধরন নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 border-cyan-400/30">
                              <SelectItem value="info" className="text-cyan-100">সাধারণ তথ্য</SelectItem>
                              <SelectItem value="warning" className="text-orange-300">সতর্কতা</SelectItem>
                              <SelectItem value="urgent" className="text-red-300">জরুরি</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex space-x-3 pt-4">
                          <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium">
                            {editingId ? 'আপডেট করুন' : 'নোটিশ যোগ করুন'}
                          </Button>
                          {editingId && (
                            <Button type="button" variant="outline" onClick={cancelEdit}
                              className="bg-gray-500/20 border-gray-400/40 text-gray-300 hover:bg-gray-400/30">
                              বাতিল
                            </Button>
                          )}
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
