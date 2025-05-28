
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, GraduationCap, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('marks')) return 'Marks & Grades';
    if (path.includes('attendance')) return 'Attendance';
    if (path.includes('feedback')) return 'Feedback';
    if (path.includes('graphs')) return 'Performance Analytics';
    if (path.includes('create-student')) return 'Create Student';
    if (path.includes('assign-subjects')) return 'Assign Subjects';
    if (path.includes('evaluate')) return 'Evaluate Marks';
    return 'Academic Portal';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Academic Portal</h1>
              </div>
              <div className="hidden md:block">
                <span className="text-gray-500">|</span>
                <span className="ml-3 text-lg font-medium text-blue-600">{getPageTitle()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                {user?.role === 'student' ? (
                  <User className="h-4 w-4 text-blue-600" />
                ) : (
                  <Users className="h-4 w-4 text-blue-600" />
                )}
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full capitalize">
                  {user?.role}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
