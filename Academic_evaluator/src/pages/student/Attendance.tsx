
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useStudentData } from '@/hooks/useStudentData';
import Layout from '@/components/Layout';

const StudentAttendance = () => {
  const { attendanceStats, overallAttendance } = useStudentData();

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'bg-green-100 text-green-800 border-green-200', status: 'Excellent' };
    if (percentage >= 85) return { color: 'bg-blue-100 text-blue-800 border-blue-200', status: 'Good' };
    if (percentage >= 75) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', status: 'Average' };
    return { color: 'bg-red-100 text-red-800 border-red-200', status: 'Below Average' };
  };

  const getAttendanceIcon = (percentage: number) => {
    if (percentage >= 85) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (percentage >= 75) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const totalClasses = attendanceStats.reduce((sum, subject) => sum + subject.totalClasses, 0);
  const totalAttended = attendanceStats.reduce((sum, subject) => sum + subject.attendedClasses, 0);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Overall Attendance</p>
                  <p className="text-3xl font-bold text-blue-800">{overallAttendance}%</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Classes Attended</p>
                  <p className="text-3xl font-bold text-green-800">{totalAttended}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Classes</p>
                  <p className="text-3xl font-bold text-purple-800">{totalClasses}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Classes Missed</p>
                  <p className="text-3xl font-bold text-orange-800">{totalClasses - totalAttended}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Subject-wise Attendance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceStats.length > 0 ? (
              <div className="space-y-6">
                {attendanceStats.map((subject, index) => {
                  const status = getAttendanceStatus(subject.percentage);
                  return (
                    <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getAttendanceIcon(subject.percentage)}
                          <h3 className="text-lg font-semibold text-gray-900">{subject.subject}</h3>
                        </div>
                        <Badge className={status.color}>
                          {status.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-800">{subject.attendedClasses}</p>
                          <p className="text-sm text-blue-600">Attended</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-gray-800">{subject.totalClasses}</p>
                          <p className="text-sm text-gray-600">Total Classes</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-800">{subject.totalClasses - subject.attendedClasses}</p>
                          <p className="text-sm text-red-600">Missed</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-800">{subject.percentage}%</p>
                          <p className="text-sm text-green-600">Percentage</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Attendance Progress</span>
                          <span className="font-medium">{subject.percentage}%</span>
                        </div>
                        <Progress value={subject.percentage} className="h-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No attendance records available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Attendance Requirements</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Minimum 75% attendance required for exam eligibility</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>85%+ attendance: Excellent standing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>75-84% attendance: Good standing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Below 75%: Risk of exam debarment</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Tips to Improve</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Attend all scheduled classes regularly</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Inform faculty in advance for planned absences</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Use make-up classes when available</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Contact your advisor if attendance drops</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentAttendance;
