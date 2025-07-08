
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Plus, Calendar, Users, Check, X } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';

interface AttendanceManagementProps {
  onBack?: () => void;
}

const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ onBack }) => {
  const { user } = useMosqueStore();
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPrayer, setSelectedPrayer] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const prayers = [
    { id: 'fajr', name: 'ফজর', time: '05:00' },
    { id: 'dhuhr', name: 'যুহর', time: '12:00' },
    { id: 'asr', name: 'আসর', time: '15:30' },
    { id: 'maghrib', name: 'মাগরিব', time: '18:00' },
    { id: 'isha', name: 'এশা', time: '19:30' },
    { id: 'jumma', name: 'জুমআ', time: '13:00' }
  ];

  const isAdmin = user?.role === 'admin';

  const handleAddAttendance = () => {
    const newRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      prayer: selectedPrayer,
      count: Math.floor(Math.random() * 150) + 50,
      timestamp: new Date().toISOString()
    };
    
    setAttendanceData([...attendanceData, newRecord]);
    toast({ title: "সফল!", description: "উপস্থিতির তথ্য যোগ করা হয়েছে।" });
    setIsAddDialogOpen(false);
  };

  const getPrayerName = (prayerId: string) => {
    const prayer = prayers.find(p => p.id === prayerId);
    return prayer ? prayer.name : prayerId;
  };

  return (
    <div className="p-6 space-y-6">
      {onBack && <BackButton onBack={onBack} />}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserCheck className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-blue-800">নামাজের উপস্থিতি</h1>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-2" />
                উপস্থিতি যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>নামাজের উপস্থিতি যোগ করুন</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">তারিখ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="prayer">নামাজ</Label>
                  <Select value={selectedPrayer} onValueChange={setSelectedPrayer}>
                    <SelectTrigger>
                      <SelectValue placeholder="নামাজ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {prayers.map((prayer) => (
                        <SelectItem key={prayer.id} value={prayer.id}>
                          {prayer.name} - {prayer.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleAddAttendance} className="w-full bg-blue-600 hover:bg-blue-700">
                  যোগ করুন
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendanceData.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <UserCheck className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">কোন উপস্থিতির তথ্য পাওয়া যায়নি।</p>
          </div>
        ) : (
          attendanceData.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-blue-800">
                    {getPrayerName(record.prayer)}
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800">
                    {record.count} জন
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(record.date).toLocaleDateString('bn-BD')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users size={16} />
                    <span>মোট উপস্থিতি: {record.count} জন</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">আজকের গড় উপস্থিতি</p>
                <p className="text-2xl font-bold">৮৫ জন</p>
              </div>
              <Users size={32} className="text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">সর্বোচ্চ উপস্থিতি</p>
                <p className="text-2xl font-bold">১৫০ জন</p>
              </div>
              <Check size={32} className="text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceManagement;
