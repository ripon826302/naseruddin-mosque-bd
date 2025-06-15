
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Building, Clock, Users, Save } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';
import { PageWithBackProps } from '@/types/pageProps';

const SettingsPage: React.FC<PageWithBackProps> = ({ onBack }) => {
  const { settings, updateSettings, user } = useMosqueStore();
  const [mosqueData, setMosqueData] = useState({
    name: settings.name,
    address: settings.address,
    phone: settings.phone,
    email: settings.email
  });

  const [prayerTimes, setPrayerTimes] = useState({
    fajr: settings.prayerTimes.fajr,
    dhuhr: settings.prayerTimes.dhuhr,
    asr: settings.prayerTimes.asr,
    maghrib: settings.prayerTimes.maghrib,
    isha: settings.prayerTimes.isha,
    jumma: settings.prayerTimes.jumma
  });

  const [ramadanTimes, setRamadanTimes] = useState({
    sehri: settings.ramadanTimes?.sehri || '04:30',
    iftar: settings.ramadanTimes?.iftar || '18:30'
  });

  const handleSaveMosqueInfo = () => {
    updateSettings({
      name: mosqueData.name,
      address: mosqueData.address,
      phone: mosqueData.phone,
      email: mosqueData.email
    });
    toast({ title: "সফল!", description: "মসজিদের তথ্য আপডেট হয়েছে।" });
  };

  const handleSavePrayerTimes = () => {
    updateSettings({
      prayerTimes: prayerTimes
    });
    toast({ title: "সফল!", description: "নামাজের সময় আপডেট হয়েছে।" });
  };

  const handleSaveRamadanTimes = () => {
    updateSettings({
      ramadanTimes: ramadanTimes
    });
    toast({ title: "সফল!", description: "রমজানের সময় আপডেট হয়েছে।" });
  };

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {onBack && <BackButton onBack={onBack} />}
          <div className="text-center py-20">
            <Settings className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">সেটিংস</h1>
            <p className="text-gray-400">শুধুমাত্র অ্যাডমিন এই পেইজ দেখতে পারবেন।</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {onBack && <BackButton onBack={onBack} />}
        
        <div className="flex items-center space-x-3 mb-8">
          <Settings className="text-gray-400" size={32} />
          <h1 className="text-3xl font-bold text-white">সেটিংস</h1>
        </div>

        <Tabs defaultValue="mosque" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="mosque" className="data-[state=active]:bg-green-600">
              <Building className="h-4 w-4 mr-2" />
              মসজিদের তথ্য
            </TabsTrigger>
            <TabsTrigger value="prayer" className="data-[state=active]:bg-blue-600">
              <Clock className="h-4 w-4 mr-2" />
              নামাজের সময়
            </TabsTrigger>
            <TabsTrigger value="ramadan" className="data-[state=active]:bg-purple-600">
              <Clock className="h-4 w-4 mr-2" />
              রমজানের সময়
            </TabsTrigger>
          </TabsList>

          {/* Mosque Information */}
          <TabsContent value="mosque">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  মসজিদের মূল তথ্য
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="mosqueName" className="text-gray-300">মসজিদের নাম</Label>
                    <Input
                      id="mosqueName"
                      value={mosqueData.name}
                      onChange={(e) => setMosqueData({...mosqueData, name: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="মসজিদের নাম লিখুন"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mosquePhone" className="text-gray-300">ফোন নম্বর</Label>
                    <Input
                      id="mosquePhone"
                      value={mosqueData.phone}
                      onChange={(e) => setMosqueData({...mosqueData, phone: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="ফোন নম্বর লিখুন"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="mosqueAddress" className="text-gray-300">ঠিকানা</Label>
                  <Input
                    id="mosqueAddress"
                    value={mosqueData.address}
                    onChange={(e) => setMosqueData({...mosqueData, address: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="মসজিদের সম্পূর্ণ ঠিকানা লিখুন"
                  />
                </div>

                <div>
                  <Label htmlFor="mosqueEmail" className="text-gray-300">ইমেইল</Label>
                  <Input
                    id="mosqueEmail"
                    type="email"
                    value={mosqueData.email}
                    onChange={(e) => setMosqueData({...mosqueData, email: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="মসজিদের ইমেইল ঠিকানা লিখুন"
                  />
                </div>

                <Button 
                  onClick={handleSaveMosqueInfo}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  সংরক্ষণ করুন
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prayer Times */}
          <TabsContent value="prayer">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  নামাজের সময়সূচী
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="fajr" className="text-gray-300">ফজর</Label>
                    <Input
                      id="fajr"
                      type="time"
                      value={prayerTimes.fajr}
                      onChange={(e) => setPrayerTimes({...prayerTimes, fajr: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dhuhr" className="text-gray-300">যোহর</Label>
                    <Input
                      id="dhuhr"
                      type="time"
                      value={prayerTimes.dhuhr}
                      onChange={(e) => setPrayerTimes({...prayerTimes, dhuhr: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="asr" className="text-gray-300">আসর</Label>
                    <Input
                      id="asr"
                      type="time"
                      value={prayerTimes.asr}
                      onChange={(e) => setPrayerTimes({...prayerTimes, asr: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maghrib" className="text-gray-300">মাগরিব</Label>
                    <Input
                      id="maghrib"
                      type="time"
                      value={prayerTimes.maghrib}
                      onChange={(e) => setPrayerTimes({...prayerTimes, maghrib: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="isha" className="text-gray-300">এশা</Label>
                    <Input
                      id="isha"
                      type="time"
                      value={prayerTimes.isha}
                      onChange={(e) => setPrayerTimes({...prayerTimes, isha: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="jumma" className="text-gray-300">জুমা</Label>
                    <Input
                      id="jumma"
                      type="time"
                      value={prayerTimes.jumma}
                      onChange={(e) => setPrayerTimes({...prayerTimes, jumma: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSavePrayerTimes}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  সংরক্ষণ করুন
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ramadan Times */}
          <TabsContent value="ramadan">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  রমজানের সময়সূচী
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sehri" className="text-gray-300">সেহরির সময়</Label>
                    <Input
                      id="sehri"
                      type="time"
                      value={ramadanTimes.sehri}
                      onChange={(e) => setRamadanTimes({...ramadanTimes, sehri: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="iftar" className="text-gray-300">ইফতারের সময়</Label>
                    <Input
                      id="iftar"
                      type="time"
                      value={ramadanTimes.iftar}
                      onChange={(e) => setRamadanTimes({...ramadanTimes, iftar: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSaveRamadanTimes}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  সংরক্ষণ করুন
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Current Settings Overview */}
        <Card className="bg-gray-900/50 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">বর্তমান সেটিংস</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-green-400 font-semibold mb-2">মসজিদের তথ্য</h4>
                <p className="text-gray-300 text-sm">নাম: {settings.name}</p>
                <p className="text-gray-300 text-sm">ঠিকানা: {settings.address}</p>
                <p className="text-gray-300 text-sm">ফোন: {settings.phone}</p>
              </div>

              <div>
                <h4 className="text-blue-400 font-semibold mb-2">নামাজের সময়</h4>
                <p className="text-gray-300 text-sm">ফজর: {settings.prayerTimes.fajr}</p>
                <p className="text-gray-300 text-sm">যোহর: {settings.prayerTimes.dhuhr}</p>
                <p className="text-gray-300 text-sm">আসর: {settings.prayerTimes.asr}</p>
              </div>

              <div>
                <h4 className="text-purple-400 font-semibold mb-2">রমজানের সময়</h4>
                <p className="text-gray-300 text-sm">সেহরি: {settings.ramadanTimes?.sehri || 'সেট করা হয়নি'}</p>
                <p className="text-gray-300 text-sm">ইফতার: {settings.ramadanTimes?.iftar || 'সেট করা হয়নি'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
