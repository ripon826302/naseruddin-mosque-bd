
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Edit, Trash2, Plus, Phone, Mail } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import { Committee } from '@/types/mosque';

const CommitteeMembers: React.FC = () => {
  const { committee, addCommitteeMember, updateCommitteeMember, deleteCommitteeMember, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Committee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const roles = [
    'President', 'Secretary', 'Treasurer', 'Vice President', 
    'Member', 'Imam', 'Muezzin', 'Advisor'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMember) {
      updateCommitteeMember(editingMember.id, formData);
      toast({ title: "সফল!", description: "কমিটির সদস্যের তথ্য আপডেট হয়েছে।" });
      setEditingMember(null);
    } else {
      addCommitteeMember(formData);
      toast({ title: "সফল!", description: "নতুন কমিটির সদস্য যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (member: Committee) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      phone: member.phone,
      email: member.email || '',
      joinDate: member.joinDate
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই সদস্যকে মুছে দিতে চান?')) {
      deleteCommitteeMember(id);
      toast({ title: "সফল!", description: "কমিটির সদস্য মুছে দেওয়া হয়েছে।" });
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="text-green-600" size={32} />
          <h1 className="text-3xl font-bold text-green-800">কমিটির সদস্যবৃন্দ</h1>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus size={16} className="mr-2" />
                নতুন সদস্য যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>নতুন কমিটির সদস্য যোগ করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">নাম</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="সদস্যের নাম লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">পদবী</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="পদবী নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="phone">ফোন নম্বর</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="ফোন নম্বর লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">ইমেইল (ঐচ্ছিক)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="ইমেইল ঠিকানা লিখুন"
                  />
                </div>
                
                <div>
                  <Label htmlFor="joinDate">যোগদানের তারিখ</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  সদস্য যোগ করুন
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committee.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-green-800">{member.name}</CardTitle>
                {isAdmin && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit size={16} className="text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-green-600 font-medium">{member.role}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} />
                <span>{member.phone}</span>
              </div>
              {member.email && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail size={16} />
                  <span>{member.email}</span>
                </div>
              )}
              <p className="text-sm text-gray-500">
                যোগদান: {new Date(member.joinDate).toLocaleDateString('bn-BD')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>সদস্যের তথ্য সম্পাদনা</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">নাম</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-role">পদবী</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="পদবী নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-phone">ফোন নম্বর</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-email">ইমেইল</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-joinDate">যোগদানের তারিখ</Label>
                <Input
                  id="edit-joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  আপডেট করুন
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEditingMember(null)}
                >
                  বাতিল
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CommitteeMembers;
