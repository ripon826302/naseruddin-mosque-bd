
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Building, Clock, Key, Save } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';

interface SettingsProps {
  onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { settings, updateSettings, user } = useMosqueStore();
  const [formData, setFormData] = useState({
    name: settings.name || '',
    address: settings.address || '',
    phone: settings.phone || '',
    email: settings.email || '',
    prayerTimes: {
      fajr: settings.prayerTimes?.fajr || '05:00',
      dhuhr: settings.prayerTimes?.dhuhr || '12:00',
      asr: settings.prayerTimes?.asr || '15:30',
      maghrib: settings.prayerTimes?.maghrib || '18:00',
      isha: settings.prayerTimes?.isha || '19:30',
      jumma: settings.prayerTimes?.jumma || '13:00'
    },
    ramadanTimes: {
      sehri: settings.ramadanTimes?.sehri || '04:30',
      iftar: settings.ramadanTimes?.iftar || '18:30'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">আপনার এই পেজে প্রবেশের অনুমতি নেই।</p>
      </div>
    );
  }

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast({ title: "সফল!", description: "সেটিংস আপডেট হয়েছে।" });
  };

  const handlePrayerTimesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ prayerTimes: formData.prayerTimes });
    toast({ title: "সফল!", description: "নামাজের সময় আপডেট হয়েছে।" });
  };

  const handleRamadanTimesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ ramadanTimes: formData.ramadanTimes });
    toast({ title: "সফল!", description: "রমজানের সময় আপডেট হয়েছে।" });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ 
        title: "ত্রুটি!", 
        description: "নতুন পাসওয়ার্ড ও নিশ্চিত পাসওয়ার্ড মিলছে না।",
        variant: "destructive" 
      });
      return;
    }
    
    toast({ title: "সফল!", description: "পাসওয়ার্ড পরিবর্তন হয়েছে।" });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="p-6 space-y-6">
      {onBack && <BackButton onBack={onBack} />}
      
      <div className="flex items-center space-x-3">
        <SettingsIcon className="text-gray-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">সেটিংস</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Building size={16} />
            <span>সাধারণ</span>
          </TabsTrigger>
          <TabsTrigger value="prayer" className="flex items-center space-x-2">
            <Clock size={16} />
            <span>নামাজের সময়</span>
          </TabsTrigger>
          <TabsTrigger value="ramadan" className="flex items-center space-x-2">
            <Clock size={16} />
            <span>রমজান</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center space-x-2">
            <Key size={16} />
            <span>পাসওয়ার্ড</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">সাধারণ তথ্য</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">মসজিদের নাম</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="মসজিদের নাম লিখুন"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">ফোন নম্বর</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="ফোন নম্বর লিখুন"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">ঠিকানা</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="মসজিদের ঠিকানা লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="ইমেইল ঠিকানা লিখুন"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Save size={16} className="mr-2" />
                  সংরক্ষণ করুন
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prayer">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">নামাজের সময়</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePrayerTimesSubmit} className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fajr">ফজর</Label>
                    <Input
                      id="fajr"
                      type="time"
                      value={formData.prayerTimes.fajr}
                      onChange={(e) => setFormData({
                        ...formData, 
                        prayerTimes: {...formData.prayerTimes, fajr: e.target.value}
                      })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dhuhr">যুহর</Label>
                    <Input
                      id="dhuhr"
                      type="time"
                      value={formData.prayerTimes.dhuhr}
                      onChange={(e) => setFormData({
                        ...formData, 
                        prayerTimes: {...formData.prayerTimes, dhuhr: e.target.value}
                      })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="asr">আসর</Label>
                    <Input
                      id="asr"
                      type="time"
                      value={formData.prayerTimes.asr}
                      onChange={(e) => setFormData({
                        ...formData, 
                        prayerTimes: {...formData.prayerTimes, asr: e.target.value}
                      })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maghrib">মাগরিব</Label>
                    <Input
                      id="maghrib"
                      type="time"
                      value={formData.prayerTimes.maghrib}
                      onChange={(e) => setFormData({
                        ...formData, 
                        prayerTimes: {...formData.prayerTimes, maghrib: e.target.value}
                      })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="isha">এশা</Label>
                    <Input
                      id="isha"
                      type="time"
                      value={formData.prayerTimes.isha}
                      onChange={(e) => setFormData({
                        ...formData, 
                        prayerTimes: {...formData.prayerTimes, isha: e.target.value}
                      })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="jumma">জুমআ</Label>
                    <Input
                      id="jumma"
                      type="time"
                      value={formData.prayerTimes.jumma}
                      onChange={(e) => setFormData({
                        ...formData, 
                        prayerTimes: {...formData.prayerTimes, jumma: e.target.value}
                      })}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <Save size={16} className="mr-2" />
                  সংরক্ষণ করুন
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ramadan">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">রমজানের সময়</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRamadanTimesSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sehri">সেহরি</Label>
                    <Input
                      id="sehri"
                      type="time"
                      value={formData.ramadanTimes.sehri}
                      onChange={(e) => setFormData({
                        ...formData, 
                        ramadanTimes: {...formData.ramadanTimes, sehri: e.target.value}
                      })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="iftar">ইফতার</Label>
                    <Input
                      id="iftar"
                      type="time"
                      value={formData.ramadanTimes.iftar}
                      onChange={(e) => setFormData({
                        ...formData, 
                        ramadanTimes: {...formData.ramadanTimes, iftar: e.target.value}
                      })}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  <Save size={16} className="mr-2" />
                  সংরক্ষণ করুন
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">পাসওয়ার্ড পরিবর্তন</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                  <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  <Key size={16} className="mr-2" />
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
