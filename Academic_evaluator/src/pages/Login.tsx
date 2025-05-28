
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [loginAttempting, setLoginAttempting] = useState(false);
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      console.log('User already logged in, redirecting to dashboard...');
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    console.log('Attempting login with:', email);
    setLoginAttempting(true);
    
    const success = await login(email, password);
    setLoginAttempting(false);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to dashboard..."
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please check your email and password, or try setting up demo users first.",
        variant: "destructive"
      });
    }
  };

  const setupDemoUsers = async () => {
    setSetupLoading(true);
    try {
      console.log('Setting up demo users...');
      const response = await fetch('https://wzritetufpfxgbgvevnj.supabase.co/functions/v1/setup-demo-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6cml0ZXR1ZnBmeGdiZ3Zldm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDc3MDEsImV4cCI6MjA2MzcyMzcwMX0.ZvDmhDpxeCr8pvtwmZVx2UZ2zJ9L8pLFZkkAJmFa68M`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Demo Users Created",
          description: "Demo users have been set up successfully. You can now login with the provided credentials.",
        });
        console.log('Demo users created:', data);
      } else {
        const errorData = await response.json();
        console.error('Setup error:', errorData);
        throw new Error(errorData.error || 'Failed to create demo users');
      }
    } catch (error) {
      console.error('Error setting up demo users:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to set up demo users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSetupLoading(false);
    }
  };

  const fillStaffCredentials = () => {
    setEmail('admin@gmail.com');
    setPassword('Admin@123');
  };

  const fillStudentCredentials = () => {
    setEmail('raahul.kumar@university.edu');
    setPassword('Changeme@123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Portal</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading || loginAttempting}
              >
                {isLoading || loginAttempting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Setup Section */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">First time? Set up demo users:</p>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={setupDemoUsers}
                disabled={setupLoading}
                className="w-full text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
              >
                {setupLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                    <span>Setting up demo users...</span>
                  </div>
                ) : (
                  'Setup Demo Users'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Quick login:</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillStaffCredentials}
                  className="text-xs"
                >
                  Staff Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillStudentCredentials}
                  className="text-xs"
                >
                  Student Login
                </Button>
              </div>
            </div>

            {/* Information Card */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Demo Credentials:</p>
                  <p>• Staff: admin@gmail.com / Admin@123</p>
                  <p>• Students: Use student emails / Changeme@123</p>
                  <p>• Click "Setup Demo Users" first to create accounts</p>
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
