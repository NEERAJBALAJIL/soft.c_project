
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Target } from 'lucide-react';
import { mockStudentData } from '@/data/mockData';
import Layout from '@/components/Layout';

const StudentGraphs = () => {
  // Data for charts
  const marksData = mockStudentData.subjects.map(subject => ({
    subject: subject.name.split(' ').slice(0, 2).join(' '), // Shortened names
    internal: subject.internal,
    external: subject.external,
    total: subject.total,
    fullName: subject.name
  }));

  const attendanceData = mockStudentData.attendance.map(item => ({
    subject: item.subject.split(' ').slice(0, 2).join(' '),
    percentage: item.percentage,
    attended: item.attendedClasses,
    total: item.totalClasses,
    fullName: item.subject
  }));

  const gradeDistribution = mockStudentData.subjects.reduce((acc, subject) => {
    acc[subject.grade] = (acc[subject.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    name: grade,
    value: count,
    percentage: ((count / mockStudentData.subjects.length) * 100).toFixed(1)
  }));

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const performanceTrend = [
    { semester: 'Sem 1', cgpa: 7.8 },
    { semester: 'Sem 2', cgpa: 8.1 },
    { semester: 'Sem 3', cgpa: 8.3 },
    { semester: 'Sem 4', cgpa: 8.5 }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Highest Score</p>
                  <p className="text-3xl font-bold text-blue-800">180</p>
                  <p className="text-xs text-blue-600">Web Development</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Best Attendance</p>
                  <p className="text-3xl font-bold text-green-800">91%</p>
                  <p className="text-xs text-green-600">Web Development</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Average Score</p>
                  <p className="text-3xl font-bold text-purple-800">169</p>
                  <p className="text-xs text-purple-600">Across all subjects</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Grade A+/O</p>
                  <p className="text-3xl font-bold text-orange-800">4/6</p>
                  <p className="text-xs text-orange-600">Subjects</p>
                </div>
                <PieChartIcon className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subject-wise Marks Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Subject-wise Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="subject" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'internal' ? 'Internal' : name === 'external' ? 'External' : 'Total']}
                    labelFormatter={(label) => {
                      const item = marksData.find(d => d.subject === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Bar dataKey="internal" fill="#3B82F6" name="Internal" />
                  <Bar dataKey="external" fill="#10B981" name="External" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Attendance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="subject" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Attendance']}
                    labelFormatter={(label) => {
                      const item = attendanceData.find(d => d.subject === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Bar dataKey="percentage" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="h-5 w-5 text-purple-600" />
                <span>Grade Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Subjects']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CGPA Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>CGPA Progression</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[7, 10]} />
                  <Tooltip formatter={(value) => [`${value}`, 'CGPA']} />
                  <Line 
                    type="monotone" 
                    dataKey="cgpa" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Consistent high performance in Web Development</li>
                  <li>• Strong attendance across all subjects</li>
                  <li>• Excellent grades in practical subjects</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Trends</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Steady CGPA improvement over semesters</li>
                  <li>• Balanced internal and external scores</li>
                  <li>• Maintaining above 85% attendance</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Goals</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Target 9.0+ CGPA next semester</li>
                  <li>• Improve attendance in weaker subjects</li>
                  <li>• Focus on query optimization skills</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentGraphs;
