
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, MessageSquare, BarChart3, Award, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentData } from '@/hooks/useStudentData';
import Layout from '@/components/Layout';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cgpa, overallAttendance, totalSubjects, marksWithGrades } = useStudentData();

  const quickActions = [
    {
      title: 'View Subjects & Marks',
      description: 'Check your grades and performance',
      icon: BookOpen,
      path: '/student/marks',
      color: 'bg-blue-500'
    },
    {
      title: 'View Attendance',
      description: 'Track your class attendance',
      icon: Calendar,
      path: '/student/attendance',
      color: 'bg-green-500'
    },
    {
      title: 'View Feedback',
      description: 'Read feedback from your instructors',
      icon: MessageSquare,
      path: '/student/feedback',
      color: 'bg-purple-500'
    },
    {
      title: 'Performance Graphs',
      description: 'Analyze your academic progress',
      icon: BarChart3,
      path: '/student/graphs',
      color: 'bg-orange-500'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100 text-lg">
                Registration: {user?.regNumber} | Department: {user?.department}
              </p>
            </div>
            <div className="hidden md:block">
              <Award className="h-16 w-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Current CGPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{cgpa || '0.0'}</div>
              <p className="text-xs text-blue-600 mt-1">Out of 10.0</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Attendance</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">{overallAttendance}%</div>
              <p className="text-xs text-green-600 mt-1">Overall average</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800">{totalSubjects}</div>
              <p className="text-xs text-purple-600 mt-1">Current semester</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate(action.path)}
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-200"
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Recent Performance Highlights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Best Subject</p>
                <p className="text-lg font-bold text-green-800">
                  {marksWithGrades.length > 0 
                    ? marksWithGrades.reduce((best, current) => 
                        current.total > best.total ? current : best
                      ).name.split(' ').slice(0, 2).join(' ')
                    : 'No data'
                  }
                </p>
                <p className="text-sm text-green-600">
                  {marksWithGrades.length > 0 
                    ? `Grade: ${marksWithGrades.reduce((best, current) => 
                        current.total > best.total ? current : best
                      ).grade}`
                    : 'Complete assessments'
                  }
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Average Grade</p>
                <p className="text-lg font-bold text-blue-800">
                  {marksWithGrades.length > 0 ? 'A+' : 'N/A'}
                </p>
                <p className="text-sm text-blue-600">Across all subjects</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Attendance Status</p>
                <p className="text-lg font-bold text-purple-800">
                  {overallAttendance >= 85 ? 'Excellent' : overallAttendance >= 75 ? 'Good' : 'Needs Improvement'}
                </p>
                <p className="text-sm text-purple-600">{overallAttendance}% overall</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
