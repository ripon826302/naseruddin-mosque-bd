
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';

interface EventManagementProps {
  onBack?: () => void;
}

const EventManagement: React.FC<EventManagementProps> = ({ onBack }) => {
  const { events, addEvent, updateEvent, deleteEvent, user } = useMosqueStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: 'Event' as 'Prayer' | 'Event' | 'Program' | 'Religious' | 'Educational' | 'Social' | 'Fundraising',
    location: '',
    description: ''
  });

  const eventTypes: Array<'Prayer' | 'Event' | 'Program' | 'Religious' | 'Educational' | 'Social' | 'Fundraising'> = [
    'Prayer', 'Event', 'Program', 'Religious', 'Educational', 'Social', 'Fundraising'
  ];

  const eventTypesBangla = {
    Prayer: 'নামাজ',
    Event: 'অনুষ্ঠান',
    Program: 'প্রোগ্রাম',
    Religious: 'ধর্মীয়',
    Educational: 'শিক্ষামূলক',
    Social: 'সামাজিক',
    Fundraising: 'তহবিল সংগ্রহ'
  };

  const isAdmin = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
      toast({ title: "সফল!", description: "ইভেন্ট আপডেট হয়েছে।" });
      setEditingEvent(null);
    } else {
      addEvent(formData);
      toast({ title: "সফল!", description: "নতুন ইভেন্ট যোগ করা হয়েছে।" });
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      title: '',
      date: '',
      time: '',
      type: 'Event',
      location: '',
      description: ''
    });
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      location: event.location,
      description: event.description
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি এই ইভেন্টটি মুছে দিতে চান?')) {
      deleteEvent(id);
      toast({ title: "সফল!", description: "ইভেন্ট মুছে দেওয়া হয়েছে।" });
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      Prayer: 'bg-green-100 text-green-800',
      Event: 'bg-blue-100 text-blue-800',
      Program: 'bg-purple-100 text-purple-800',
      Religious: 'bg-orange-100 text-orange-800',
      Educational: 'bg-indigo-100 text-indigo-800',
      Social: 'bg-pink-100 text-pink-800',
      Fundraising: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {onBack && <BackButton onBack={onBack} />}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="text-purple-600" size={32} />
          <h1 className="text-3xl font-bold text-purple-800">ইভেন্ট ব্যবস্থাপনা</h1>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus size={16} className="mr-2" />
                নতুন ইভেন্ট যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>নতুন ইভেন্ট যোগ করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">ইভেন্টের নাম</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="ইভেন্টের নাম লিখুন"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">তারিখ</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time">সময়</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="type">ধরন</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="ইভেন্টের ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {eventTypesBangla[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location">স্থান</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="ইভেন্টের স্থান লিখুন"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">বিবরণ</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="ইভেন্টের বিবরণ লিখুন"
                    rows={3}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  ইভেন্ট যোগ করুন
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">কোন ইভেন্ট পাওয়া যায়নি।</p>
          </div>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-purple-800">{event.title}</CardTitle>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit size={16} className="text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
                <Badge className={getEventTypeColor(event.type)}>
                  {eventTypesBangla[event.type as keyof typeof eventTypesBangla]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(event.date).toLocaleDateString('bn-BD')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={16} />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingEvent && (
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>ইভেন্ট সম্পাদনা</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">ইভেন্টের নাম</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">তারিখ</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-time">সময়</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-type">ধরন</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {eventTypesBangla[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-location">স্থান</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">বিবরণ</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  আপডেট করুন
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEditingEvent(null)}
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

export default EventManagement;
