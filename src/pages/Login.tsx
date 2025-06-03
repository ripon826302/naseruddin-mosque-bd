
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useMosqueStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(username, password);
    
    if (success) {
      toast({
        title: "সফল!",
        description: "আপনি সফলভাবে লগইন করেছেন।",
      });
      onLogin();
    } else {
      toast({
        title: "ত্রুটি!",
        description: "ভুল ইউজারনেম বা পাসওয়ার্ড।",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🕌</span>
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">বায়তুল আমান মসজিদ</h1>
          <p className="text-green-600">ব্যবস্থাপনা সিস্টেম</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">এডমিন লগইন</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-gray-700">ইউজারনেম</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1"
                placeholder="আপনার ইউজারনেম লিখুন"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
