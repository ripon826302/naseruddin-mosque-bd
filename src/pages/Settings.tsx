import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Building, Clock, Bell, Trash2, Lock, Moon } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { settings, updateSettings, notices, addNotice, deleteNotice, user, changePassword } = useMosqueStore();
  const [mosqueData, setMosqueData] = useState(settings);
  const [noticeData, setNoticeData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'urgent'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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

  const handleRamadanTimeUpdate = (type: string, time: string) => {
    const newRamadanTimes = { ...mosqueData.ramadanTimes, [type]: time };
    setMosqueData({ ...mosqueData, ramadanTimes: newRamadanTimes });
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotice(noticeData);
    toast({ title: "সফল!", description: "নোটিশ যোগ করা হয়েছে।" });
    setNoticeData({ title: '', message: '', type: 'info' });
  };

  const handleDeleteNotice = (id: string) => {
    if (window.confirm('আপনি কি এই নোটিশ মুছে ফেলতে চান?')) {
      deleteNotice(id);
      toast({ title: "সফল!", description: "নোটিশ মুছে ফেলা হয়েছে।" });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ 
        title: "ত্রুটি!", 
        description: "নতুন পাসওয়ার্ড ও নিশ্চিত পাসওয়ার্ড মিলছে না।",
        variant: "destructive"
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ 
        title: "ত্রুটি!", 
        description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
        variant: "destructive"
      });
      return;
    }
    changePassword(passwordData.currentPassword, passwordData.newPassword);
    toast({ title: "সফল!", description: "পাসওয়ার্ড পরিবর্তন করা হয়েছে।" });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (!isAdmin) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-600">সেটিং</h2>
          <p className="text-gray-500 mt-2">এই পেজ দেখার জন্য অ্যাডমিন অ্যাক্সেস প্রয়োজন।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="text-gray-600" size={32} />
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">সেটিং</h1>
      </div>

      <Tabs defaultValue="mosque" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mosque" className="flex items-center space-x-2 text-xs lg:text-sm">
            <Building size={16} />
            <span className="hidden sm:inline">মসজিদের তথ্য</span>
            <span className="sm:hidden">তথ্য</span>
          </TabsTrigger>
          <TabsTrigger value="prayer" className="flex items-center space-x-2 text-xs lg:text-sm">
            <Clock size={16} />
            <span className="hidden sm:inline">নামাজের সময়</span>
            <span className="sm:hidden">নামাজ</span>
          </TabsTrigger>
          <TabsTrigger value="notices" className="flex items-center space-x-2 text-xs lg:text-sm">
            <Bell size={16} />
            <span className="hidden sm:inline">নোটিশ</span>
            <span className="sm:hidden">নোটিশ</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2 text-xs lg:text-sm">
            <Lock size={16} />
            <span className="hidden sm:inline">নিরাপত্তা</span>
            <span className="sm:hidden">নিরাপত্তা</span>
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
          <div className="space-y-6">
            {/* Regular Prayer Times */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center space-x-2">
                  <Clock size={20} />
                  <span>নামাজের সময় সেট করুন</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                    <div>
                      <Label htmlFor="jumma">জুমআ</Label>
                      <Input
                        id="jumma"
                        type="time"
                        value={mosqueData.prayerTimes.jumma}
                        onChange={(e) => handlePrayerTimeUpdate('jumma', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={() => updateSettings(mosqueData)} className="w-full">
                    নামাজের সময় আপডেট করুন
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ramadan Times */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center space-x-2">
                  <Moon size={20} className="text-orange-500" />
                  <span>রমজানের সময়সূচি</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sehri">সেহরির সময়</Label>
                      <Input
                        id="sehri"
                        type="time"
                        value={mosqueData.ramadanTimes?.sehri || '04:30'}
                        onChange={(e) => handleRamadanTimeUpdate('sehri', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="iftar">ইফতারের সময়</Label>
                      <Input
                        id="iftar"
                        type="time"
                        value={mosqueData.ramadanTimes?.iftar || '18:30'}
                        onChange={(e) => handleRamadanTimeUpdate('iftar', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={() => updateSettings(mosqueData)} className="w-full">
                    রমজানের সময়সূচি আপডেট করুন
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="space-y-2 flex-1">
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
                            className="text-red-600 border-red-600 hover:bg-red-50 self-start"
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

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">পাসওয়ার্ড পরিবর্তন করুন</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">বর্তমান পাসওয়ার্ড</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">নতুন পাসওয়ার্ড</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="নতুন পাসওয়ার্ড লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  পাসওয়ার্ড পরিবর্তন করুন
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
