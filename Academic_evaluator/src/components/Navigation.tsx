
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  UserPlus, 
  ClipboardCheck, 
  Users,
  Home
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const studentNavItems = [
    { 
      title: 'Dashboard', 
      path: '/student/dashboard', 
      icon: Home 
    },
    { 
      title: 'Subjects & Marks', 
      path: '/student/marks', 
      icon: BookOpen 
    },
    { 
      title: 'Attendance', 
      path: '/student/attendance', 
      icon: Calendar 
    },
    { 
      title: 'Feedback', 
      path: '/student/feedback', 
      icon: MessageSquare 
    },
    { 
      title: 'Performance', 
      path: '/student/graphs', 
      icon: BarChart3 
    }
  ];

  const staffNavItems = [
    { 
      title: 'Dashboard', 
      path: '/staff/dashboard', 
      icon: Home 
    },
    { 
      title: 'Create Student', 
      path: '/staff/create-student', 
      icon: UserPlus 
    },
    { 
      title: 'Assign Subjects', 
      path: '/staff/assign-subjects', 
      icon: BookOpen 
    },
    { 
      title: 'Attendance', 
      path: '/staff/attendance', 
      icon: Calendar 
    },
    { 
      title: 'Evaluate Marks', 
      path: '/staff/evaluate', 
      icon: ClipboardCheck 
    },
    { 
      title: 'Give Feedback', 
      path: '/staff/feedback', 
      icon: MessageSquare 
    }
  ];

  const navItems = user?.role === 'student' ? studentNavItems : staffNavItems;

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-4">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{item.title}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
