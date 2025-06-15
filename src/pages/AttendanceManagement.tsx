
import React, { useState } from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import { Calendar, Users, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AttendanceManagement: React.FC = () => {
  const { committee, imams } = useMosqueStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPrayer, setSelectedPrayer] = useState('fajr');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const prayers = [
    { key: 'fajr', name: 'ফজর', nameArabic: 'الفجر' },
    { key: 'dhuhr', name: 'যোহর', nameArabic: 'الظهر' },
    { key: 'asr', name: 'আসর', nameArabic: 'العصر' },
    { key: 'maghrib', name: 'মাগরিব', nameArabic: 'المغرب' },
    { key: 'isha', name: 'এশা', nameArabic: 'العشاء' }
  ];

  const allMembers = [
    ...committee.map(m => ({ ...m, type: 'committee' })),
    ...imams.map(m => ({ ...m, type: 'imam' }))
  ];

  const toggleAttendance = (memberId: string) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const markAllPresent = () => {
    const newAttendance = {};
    allMembers.forEach(member => {
      newAttendance[member.id] = true;
    });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = {};
    allMembers.forEach(member => {
      newAttendance[member.id] = false;
    });
    setAttendance(newAttendance);
  };

  const saveAttendance = () => {
    // In a real app, this would save to the database
    console.log('Saving attendance:', {
      date: selectedDate,
      prayer: selectedPrayer,
      attendance
    });
    alert('উপস্থিতি সংরক্ষিত হয়েছে!');
  };

  const getMemberRole = (member: any) => {
    if (member.type === 'committee') {
      return member.role;
    } else {
      return 'ইমাম';
    }
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = allMembers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">উপস্থিতি ব্যবস্থাপনা</h1>
            <p className="text-gray-400">নামাজে উপস্থিতি রেকর্ড ও ব্যবস্থাপনা</p>
          </div>
        </div>

        {/* Date and Prayer Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                তারিখ নির্বাচন
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                নামাজ নির্বাচন
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedPrayer}
                onChange={(e) => setSelectedPrayer(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                {prayers.map((prayer) => (
                  <option key={prayer.key} value={prayer.key}>
                    {prayer.name} ({prayer.nameArabic})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">মোট সদস্য</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">উপস্থিত</p>
                  <p className="text-2xl font-bold">{presentCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">অনুপস্থিত</p>
                  <p className="text-2xl font-bold">{totalCount - presentCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">উপস্থিতির হার</p>
                  <p className="text-2xl font-bold">
                    {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Controls */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={markAllPresent}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            সবাই উপস্থিত
          </Button>
          <Button
            onClick={markAllAbsent}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
          >
            <XCircle className="h-4 w-4 mr-2" />
            সবাই অনুপস্থিত
          </Button>
          <Button
            onClick={saveAttendance}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            উপস্থিতি সংরক্ষণ
          </Button>
        </div>

        {/* Attendance List */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {prayers.find(p => p.key === selectedPrayer)?.name} নামাজের উপস্থিতি - {new Date(selectedDate).toLocaleDateString('bn-BD')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    attendance[member.id]
                      ? 'bg-green-500/20 border-green-400/50 hover:border-green-400'
                      : 'bg-gray-800/50 border-gray-600/50 hover:border-gray-500'
                  }`}
                  onClick={() => toggleAttendance(member.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{member.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {getMemberRole(member)}
                      </p>
                      <p className="text-gray-500 text-xs">{member.phone}</p>
                    </div>
                    <div className="text-right">
                      {attendance[member.id] ? (
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      ) : (
                        <XCircle className="h-8 w-8 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Attendance Summary */}
        <Card className="bg-gray-900/50 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">সাপ্তাহিক উপস্থিতির সারসংক্ষেপ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {prayers.map((prayer) => (
                <div key={prayer.key} className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">{prayer.name}</h4>
                  <div className="space-y-2">
                    {['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'].map((day, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{day}</span>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                Math.random() > 0.3 ? 'bg-green-400' : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceManagement;
