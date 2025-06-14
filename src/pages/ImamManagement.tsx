
import React, { useState } from 'react';
import { useMosqueStore } from '@/store/mosqueStore';
import { Plus, Edit, Trash2, User, Phone, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/dates';

const ImamManagement: React.FC = () => {
  const { imams, addImam, updateImam, deleteImam } = useMosqueStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImam, setEditingImam] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    monthlySalary: 0,
    status: 'Active' as 'Active' | 'Inactive',
    joinDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingImam) {
      updateImam(editingImam.id, formData);
    } else {
      addImam(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      monthlySalary: 0,
      status: 'Active',
      joinDate: ''
    });
    setEditingImam(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (imam: any) => {
    setEditingImam(imam);
    setFormData(imam);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ইমামের তথ্য মুছে ফেলতে চান?')) {
      deleteImam(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">ইমাম ব্যবস্থাপনা</h1>
            <p className="text-gray-400">মসজিদের ইমামদের তথ্য ব্যবস্থাপনা করুন</p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            নতুন ইমাম যোগ করুন
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <User className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">সক্রিয় ইমাম</p>
                  <p className="text-white text-2xl font-bold">
                    {imams.filter(imam => imam.status === 'Active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">মোট মাসিক বেতন</p>
                  <p className="text-white text-2xl font-bold">
                    {formatCurrency(imams.reduce((total, imam) => total + imam.monthlySalary, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <User className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">মোট ইমাম</p>
                  <p className="text-white text-2xl font-bold">{imams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Imam List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imams.map((imam) => (
            <Card key={imam.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg">{imam.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(imam)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(imam.id)}
                      className="border-red-600 text-red-400 hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
                  imam.status === 'Active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {imam.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{imam.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{imam.address}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-semibold">{formatCurrency(imam.monthlySalary)} /মাস</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">যোগদান: {new Date(imam.joinDate).toLocaleDateString('bn-BD')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingImam ? 'ইমামের তথ্য সম্পাদনা' : 'নতুন ইমাম যোগ করুন'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">নাম</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">ফোন</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">ঠিকানা</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">মাসিক বেতন</label>
                  <input
                    type="number"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({...formData, monthlySalary: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">যোগদানের তারিখ</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">অবস্থা</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="Active">সক্রিয়</option>
                    <option value="Inactive">নিষ্ক্রিয়</option>
                  </select>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    বাতিল
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {editingImam ? 'আপডেট করুন' : 'যোগ করুন'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImamManagement;
