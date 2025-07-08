
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMosqueStore } from '@/store/mosqueStore';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, User } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, settings } = useMosqueStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple login logic
    if ((username === 'admin' && password === 'admin123') || 
        (username === 'viewer' && password === 'viewer123')) {
      const user = {
        id: '1',
        username,
        role: username as 'admin' | 'viewer',
        name: username === 'admin' ? 'এডমিন ইউজার' : 'ভিউয়ার ইউজার'
      };
      
      login(user);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-5xl">🕌</span>
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            {settings.name || 'বায়তুল আমান জামে মসজিদ'}
          </h1>
          <p className="text-green-600 text-lg">ব্যবস্থাপনা সিস্টেম</p>
          <div className="text-sm text-gray-600 mt-2">
            {settings.address || 'ঢাকা, বাংলাদেশ'}
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <LogIn size={24} className="text-green-600" />
              এডমিন লগইন
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-gray-700 font-medium">ইউজারনেম</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                    placeholder="আপনার ইউজারনেম লিখুন"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">পাসওয়ার্ড</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl pr-12"
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    লগইন হচ্ছে...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn size={20} />
                    লগইন করুন
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">ডেমো অ্যাকাউন্ট:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-xs font-semibold text-green-800">এডমিন</p>
                  <p className="text-xs text-green-600">admin / admin123</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-xs font-semibold text-blue-800">ভিউয়ার</p>
                  <p className="text-xs text-blue-600">viewer / viewer123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
