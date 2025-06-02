
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Building, Clock, Bell, Trash2 } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { settings, updateSettings, notices, addNotice, deleteNotice, user } = useMosqueStore();
  const [mosqueData, setMosqueData] = useState(settings);
  const [noticeData, setNoticeData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'urgent'
  });

  const isAdmin = user?.role === 'admin';

  const handleMosqueUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(mosqueData);
    toast({ title: "সফল!", description: "মসজিদের তথ্য আপডেট করা হয়েছে।" });
  };

  const handlePrayerTimeUpdate = (prayer: string, time: string) => {
    const newPrayerTimes = { ...mosqueData.prayerTimes, [prayer]: time };
    setMosqueData({ ...mosqueData, prayerTimes: newPrayerTimes });
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotice({
      ...noticeData,
      date: new Date().toISOString().split('T')[0]
    });
    toast({ title: "সফল!", description: "নোটিশ যোগ করা হয়েছে।" });
    setNoticeData({ title: '', message: '', type: 'info' });
  };

  const handleDeleteNotice = (id: string) => {
    if (window.confirm('আপনি কি এই নোটিশ মুছে ফেলতে চান?')) {
      deleteNotice(id);
      toast({ title: "সফল!", description: "নোটিশ মুছে ফেলা হয়েছে।" });
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-600">সেটিং</h2>
          <p className="text-gray-500 mt-2">এই পেজ দেখার জন্য অ্যাডমিন অ্যাক্সেস প্রয়োজন।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="text-gray-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">সেটিং</h1>
      </div>

      <Tabs defaultValue="mosque" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mosque" className="flex items-center space-x-2">
            <Building size={16} />
            <span>মসজিদের তথ্য</span>
          </TabsTrigger>
          <TabsTrigger value="prayer" className="flex items-center space-x-2">
            <Clock size={16} />
            <span>নামাজের সময়</span>
          </TabsTrigger>
          <TabsTrigger value="notices" className="flex items-center space-x-2">
            <Bell size={16} />
            <span>নোটিশ</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mosque">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">মসজিদের মূল তথ্য</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMosqueUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="name">মসজিদের নাম</Label>
                  <Input
                    id="name"
                    value={mosqueData.name}
                    onChange={(e) => setMosqueData({...mosqueData, name: e.target.value})}
                    placeholder="মসজিদের নাম লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">ঠিকানা</Label>
                  <Input
                    id="address"
                    value={mosqueData.address}
                    onChange={(e) => setMosqueData({...mosqueData, address: e.target.value})}
                    placeholder="মসজিদের ঠিকানা লিখুন"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">যোগাযোগ নম্বর</Label>
                    <Input
                      id="phone"
                      value={mosqueData.phone}
                      onChange={(e) => setMosqueData({...mosqueData, phone: e.target.value})}
                      placeholder="ফোন নম্বর লিখুন"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">ইমেইল</Label>
                    <Input
                      id="email"
                      type="email"
                      value={mosqueData.email}
                      onChange={(e) => setMosqueData({...mosqueData, email: e.target.value})}
                      placeholder="ইমেইল ঠিকানা লিখুন"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  আপডেট করুন
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prayer">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">নামাজের সময় সেট করুন</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fajr">ফজর</Label>
                    <Input
                      id="fajr"
                      type="time"
                      value={mosqueData.prayerTimes.fajr}
                      onChange={(e) => handlePrayerTimeUpdate('fajr', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dhuhr">যোহর</Label>
                    <Input
                      id="dhuhr"
                      type="time"
                      value={mosqueData.prayerTimes.dhuhr}
                      onChange={(e) => handlePrayerTimeUpdate('dhuhr', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="asr">আসর</Label>
                    <Input
                      id="asr"
                      type="time"
                      value={mosqueData.prayerTimes.asr}
                      onChange={(e) => handlePrayerTimeUpdate('asr', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maghrib">মাগরিব</Label>
                    <Input
                      id="maghrib"
                      type="time"
                      value={mosqueData.prayerTimes.maghrib}
                      onChange={(e) => handlePrayerTimeUpdate('maghrib', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="isha">এশা</Label>
                    <Input
                      id="isha"
                      type="time"
                      value={mosqueData.prayerTimes.isha}
                      onChange={(e) => handlePrayerTimeUpdate('isha', e.target.value)}
                    />
                  </div>
                </div>
                
                <Button onClick={() => updateSettings(mosqueData)} className="w-full">
                  নামাজের সময় আপডেট করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notices">
          <div className="space-y-6">
            {/* Add Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">নতুন নোটিশ যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNoticeSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">নোটিশের শিরোনাম</Label>
                    <Input
                      id="title"
                      value={noticeData.title}
                      onChange={(e) => setNoticeData({...noticeData, title: e.target.value})}
                      placeholder="নোটিশের শিরোনাম লিখুন"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">নোটিশের বিবরণ</Label>
                    <Textarea
                      id="message"
                      value={noticeData.message}
                      onChange={(e) => setNoticeData({...noticeData, message: e.target.value})}
                      placeholder="নোটিশের বিস্তারিত লিখুন"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">নোটিশের ধরন</Label>
                    <Select value={noticeData.type} onValueChange={(value: any) => setNoticeData({...noticeData, type: value})}>
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
                  
                  <Button type="submit" className="w-full">
                    নোটিশ যোগ করুন
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notice List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">বর্তমান নোটিশ সমূহ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notices.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">কোন নোটিশ পাওয়া যায়নি।</p>
                  ) : (
                    notices.map((notice) => (
                      <div key={notice.id} className={`border rounded-lg p-4 ${
                        notice.type === 'urgent' ? 'border-red-300 bg-red-50' :
                        notice.type === 'warning' ? 'border-orange-300 bg-orange-50' :
                        'border-blue-300 bg-blue-50'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{notice.title}</h3>
                            <p className="text-gray-600">{notice.message}</p>
                            <p className="text-sm text-gray-500">
                              তারিখ: {new Date(notice.date).toLocaleDateString('bn-BD')}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteNotice(notice.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} className="mr-1" />
                            মুছুন
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
