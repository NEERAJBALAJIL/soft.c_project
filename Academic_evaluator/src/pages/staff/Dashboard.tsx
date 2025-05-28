
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Calendar, ClipboardCheck, MessageSquare, UserPlus, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStaffData } from '@/hooks/useStaffData';
import Layout from '@/components/Layout';

const StaffDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { students, subjects, subjectsHandled } = useStaffData();

  const quickActions = [
    {
      title: 'Create Student',
      description: 'Add new students to the system',
      icon: UserPlus,
      path: '/staff/create-student',
      color: 'bg-blue-500'
    },
    {
      title: 'Assign Subjects',
      description: 'Manage student subject assignments',
      icon: BookOpen,
      path: '/staff/assign-subjects',
      color: 'bg-green-500'
    },
    {
      title: 'Mark Attendance',
      description: 'Record student attendance',
      icon: Calendar,
      path: '/staff/attendance',
      color: 'bg-purple-500'
    },
    {
      title: 'Evaluate Marks',
      description: 'Enter and update student marks',
      icon: ClipboardCheck,
      path: '/staff/evaluate',
      color: 'bg-orange-500'
    },
    {
      title: 'Give Feedback',
      description: 'Provide feedback to students',
      icon: MessageSquare,
      path: '/staff/feedback',
      color: 'bg-red-500'
    }
  ];

  // Calculate some statistics
  const totalStudents = students.length;
  const averageCGPA = totalStudents > 0 
    ? (students.reduce((sum, student) => sum + student.cgpa, 0) / totalStudents).toFixed(2)
    : '0.00';
  const averageAttendance = totalStudents > 0
    ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / totalStudents)
    : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
              <p className="text-blue-100 text-lg">
                Department: {user?.department} | Staff Dashboard
              </p>
            </div>
            <div className="hidden md:block">
              <Users className="h-16 w-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{totalStudents}</div>
              <p className="text-xs text-blue-600 mt-1">Under your guidance</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Subjects Handled</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">{subjectsHandled}</div>
              <p className="text-xs text-green-600 mt-1">Active courses</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Average CGPA</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800">{averageCGPA}</div>
              <p className="text-xs text-purple-600 mt-1">Class performance</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Avg Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800">{averageAttendance}%</div>
              <p className="text-xs text-orange-600 mt-1">Overall average</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Recent Students Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Student Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Reg. Number</th>
                      <th className="text-center p-3 font-semibold text-gray-700">CGPA</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Attendance</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 4).map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium">{student.name}</td>
                        <td className="p-3 text-gray-600">{student.reg_number}</td>
                        <td className="p-3 text-center">
                          <span className={`font-bold ${student.cgpa >= 8.5 ? 'text-green-600' : student.cgpa >= 7.5 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {student.cgpa}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`font-medium ${student.attendance >= 85 ? 'text-green-600' : student.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.cgpa >= 8.0 && student.attendance >= 85 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.cgpa >= 8.0 && student.attendance >= 85 ? 'Excellent' : 'Good'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No students available. Create students to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subjects Handled */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <span>Subjects Available</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                        <p className="text-sm text-gray-600">{subject.code}</p>
                      </div>
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No subjects available. Setup will create demo subjects.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StaffDashboard;
