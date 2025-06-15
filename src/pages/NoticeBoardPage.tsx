import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Plus, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';
import { PageWithBackProps } from '@/types/pageProps';

const NoticeBoardPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  const { notices, addNotice, updateNotice, deleteNotice, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'urgent',
    date: new Date().toISOString().split('T')[0],
    isMarquee: false,
    marqueeSettings: {
      speed: 10,
      fontSize: 16,
      textColor: '#ffffff',
    }
  });

  const noticeTypes = [
    { value: 'info', label: 'সাধারণ' },
    { value: 'warning', label: 'সতর্কতা' },
    { value: 'urgent', label: 'জরুরি' }
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
      type: 'info',
      date: new Date().toISOString().split('T')[0],
      isMarquee: false,
      marqueeSettings: {
        speed: 10,
        fontSize: 16,
        textColor: '#ffffff',
      }
    });
  };

  const handleEdit = (notice: any) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      message: notice.message,
      type: notice.type,
      date: notice.date,
      isMarquee: notice.isMarquee,
      marqueeSettings: {
        speed: notice.marqueeSettings.speed,
        fontSize: notice.marqueeSettings.fontSize,
        textColor: notice.marqueeSettings.textColor,
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই নোটিশটি মুছে দিতে চান?')) {
      deleteNotice(id);
      toast({ title: "সফল!", description: "নোটিশ মুছে দেওয়া হয়েছে।" });
    }
  };

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNoticeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {onBack && <BackButton onBack={onBack} />}
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Bell className="text-yellow-400" size={32} />
            <h1 className="text-3xl font-bold text-white">নোটিশ বোর্ড</h1>
          </div>
          
          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  <Plus size={16} className="mr-2" />
                  নতুন নোটিশ যোগ করুন
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>নতুন নোটিশ যোগ করুন</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">শিরোনাম</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="নোটিশের শিরোনাম লিখুন"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">বার্তা</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="নোটিশের বিস্তারিত বার্তা লিখুন"
                      className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">ধরন</Label>
                      <Select value={formData.type} onValueChange={(value: 'info' | 'warning' | 'urgent') => setFormData({...formData, type: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue placeholder="নোটিশের ধরন নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {noticeTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  </div>
                  
                  {/* Marquee Settings */}
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600 mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="isMarquee" className="font-medium text-yellow-400">মারকুই নোটিশ বানাবেন?</Label>
                      <input
                        id="isMarquee"
                        type="checkbox"
                        checked={formData.isMarquee}
                        onChange={e => setFormData({ ...formData, isMarquee: e.target.checked })}
                        className="w-5 h-5 accent-yellow-500"
                      />
                    </div>
                    {formData.isMarquee && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        {/* Speed */}
                        <div>
                          <Label htmlFor="marquee-speed" className="text-yellow-400">স্পিড (সেকেন্ড)</Label>
                          <input
                            id="marquee-speed"
                            type="number"
                            min={3}
                            max={60}
                            value={formData.marqueeSettings.speed}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                marqueeSettings: {
                                  ...formData.marqueeSettings,
                                  speed: parseInt(e.target.value) || 10,
                                },
                              })
                            }
                            className="w-full rounded bg-gray-900 border border-yellow-600 px-2 py-1 text-yellow-100 mt-1"
                          />
                        </div>
                        {/* Font Size */}
                        <div>
                          <Label htmlFor="marquee-fontSize" className="text-yellow-400">ফন্ট সাইজ (px)</Label>
                          <input
                            id="marquee-fontSize"
                            type="number"
                            min={12}
                            max={48}
                            value={formData.marqueeSettings.fontSize}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                marqueeSettings: {
                                  ...formData.marqueeSettings,
                                  fontSize: parseInt(e.target.value) || 16,
                                },
                              })
                            }
                            className="w-full rounded bg-gray-900 border border-yellow-600 px-2 py-1 text-yellow-100 mt-1"
                          />
                        </div>
                        {/* Text Color */}
                        <div>
                          <Label htmlFor="marquee-textColor" className="text-yellow-400">লেখার রং</Label>
                          <input
                            id="marquee-textColor"
                            type="color"
                            value={formData.marqueeSettings.textColor}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                marqueeSettings: {
                                  ...formData.marqueeSettings,
                                  textColor: e.target.value,
                                },
                              })
                            }
                            className="w-full h-10 p-1 rounded border border-yellow-600 bg-gray-900 mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700">
                    নোটিশ যোগ করুন
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">মোট নোটিশ</p>
                  <p className="text-2xl font-bold">{notices.length}</p>
                </div>
                <Bell className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">সাধারণ নোটিশ</p>
                  <p className="text-2xl font-bold">{notices.filter(n => n.type === 'info').length}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">সতর্কতা নোটিশ</p>
                  <p className="text-2xl font-bold">{notices.filter(n => n.type === 'warning').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">জরুরি নোটিশ</p>
                  <p className="text-2xl font-bold">{notices.filter(n => n.type === 'urgent').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notices List */}
        <div className="space-y-6">
          {notices.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Bell className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">কোনো নোটিশ নেই</h3>
                <p className="text-gray-500">এখনো কোনো নোটিশ যোগ করা হয়নি।</p>
              </CardContent>
            </Card>
          ) : (
            notices.map((notice) => (
              <Card key={notice.id} className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getNoticeIcon(notice.type)}
                        <h3 className="text-xl font-semibold text-white">{notice.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notice.type === 'urgent' 
                            ? 'bg-red-500 text-white' 
                            : notice.type === 'warning'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {notice.type === 'urgent' ? 'জরুরি' : notice.type === 'warning' ? 'সতর্কতা' : 'সাধারণ'}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">{notice.message}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(notice.date).toLocaleDateString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(notice)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notice.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        {editingNotice && (
          <Dialog open={!!editingNotice} onOpenChange={() => setEditingNotice(null)}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>নোটিশ সম্পাদনা</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">শিরোনাম</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-message">বার্তা</Label>
                  <Textarea
                    id="edit-message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-type">ধরন</Label>
                    <Select value={formData.type} onValueChange={(value: 'info' | 'warning' | 'urgent') => setFormData({...formData, type: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="নোটিশের ধরন নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {noticeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                </div>
                
                {/* Edit Marquee Settings */}
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="edit-isMarquee" className="font-medium text-yellow-400">মারকুই নোটিশ বানাবেন?</Label>
                    <input
                      id="edit-isMarquee"
                      type="checkbox"
                      checked={formData.isMarquee}
                      onChange={e => setFormData({ ...formData, isMarquee: e.target.checked })}
                      className="w-5 h-5 accent-yellow-500"
                    />
                  </div>
                  {formData.isMarquee && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {/* Speed */}
                      <div>
                        <Label htmlFor="edit-marquee-speed" className="text-yellow-400">স্পিড (সেকেন্ড)</Label>
                        <input
                          id="edit-marquee-speed"
                          type="number"
                          min={3}
                          max={60}
                          value={formData.marqueeSettings.speed}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              marqueeSettings: {
                                ...formData.marqueeSettings,
                                speed: parseInt(e.target.value) || 10,
                              },
                            })
                          }
                          className="w-full rounded bg-gray-900 border border-yellow-600 px-2 py-1 text-yellow-100 mt-1"
                        />
                      </div>
                      {/* Font Size */}
                      <div>
                        <Label htmlFor="edit-marquee-fontSize" className="text-yellow-400">ফন্ট সাইজ (px)</Label>
                        <input
                          id="edit-marquee-fontSize"
                          type="number"
                          min={12}
                          max={48}
                          value={formData.marqueeSettings.fontSize}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              marqueeSettings: {
                                ...formData.marqueeSettings,
                                fontSize: parseInt(e.target.value) || 16,
                              },
                            })
                          }
                          className="w-full rounded bg-gray-900 border border-yellow-600 px-2 py-1 text-yellow-100 mt-1"
                        />
                      </div>
                      {/* Text Color */}
                      <div>
                        <Label htmlFor="edit-marquee-textColor" className="text-yellow-400">লেখার রং</Label>
                        <input
                          id="edit-marquee-textColor"
                          type="color"
                          value={formData.marqueeSettings.textColor}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              marqueeSettings: {
                                ...formData.marqueeSettings,
                                textColor: e.target.value,
                              },
                            })
                          }
                          className="w-full h-10 p-1 rounded border border-yellow-600 bg-gray-900 mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                    আপডেট করুন
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300"
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
    </div>
  );
};

export default NoticeBoardPage;
