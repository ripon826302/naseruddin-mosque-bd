
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Eye, Trash2, Edit } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';

const Events: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, user } = useMosqueStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateEvent(editingId, formData);
      toast({ title: "সফল!", description: "ইভেন্ট আপডেট করা হয়েছে।" });
      setEditingId(null);
    } else {
      addEvent(formData);
      toast({ title: "সফল!", description: "নতুন ইভেন্ট যোগ করা হয়েছে।" });
    }
    
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: ''
    });
  };

  const handleEdit = (event: any) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location
    });
    setEditingId(event.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই ইভেন্ট মুছে ফেলতে চান?')) {
      deleteEvent(id);
      toast({ title: "সফল!", description: "ইভেন্ট মুছে ফেলা হয়েছে।" });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Calendar className="text-purple-600" size={32} />
        <h1 className="text-3xl font-bold text-purple-800">ইভেন্ট ও কার্যক্রম</h1>
      </div>

      <Tabs defaultValue="view" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view" className="flex items-center space-x-2">
            <Eye size={16} />
            <span>ইভেন্ট দেখুন</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="flex items-center space-x-2">
              <Plus size={16} />
              <span>ইভেন্ট যোগ করুন</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-800">আসন্ন ইভেন্ট সমূহ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">কোন ইভেন্ট পাওয়া যায়নি।</p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-purple-800 text-lg">{event.title}</h3>
                          <p className="text-gray-600">{event.description}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>📅 তারিখ: {new Date(event.date).toLocaleDateString('bn-BD')}</p>
                            <p>🕐 সময়: {event.time}</p>
                            <p>📍 স্থান: {event.location}</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(event)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              <Edit size={16} className="mr-1" />
                              সম্পাদনা
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(event.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} className="mr-1" />
                              মুছুন
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-800">
                  {editingId ? 'ইভেন্ট সম্পাদনা করুন' : 'নতুন ইভেন্ট যোগ করুন'}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                  
                  <div>
                    <Label htmlFor="description">বিবরণ</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="ইভেন্টের বিস্তারিত বিবরণ লিখুন"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="location">স্থান</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="ইভেন্টের স্থান লিখুন"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      {editingId ? 'আপডেট করুন' : 'ইভেন্ট যোগ করুন'}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={cancelEdit}>
                        বাতিল
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Events;
