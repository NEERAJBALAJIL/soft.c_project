
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, BookOpen, TrendingUp } from 'lucide-react';
import { useStudentData } from '@/hooks/useStudentData';
import Layout from '@/components/Layout';

const StudentMarks = () => {
  const { marksWithGrades, totalMarks, cgpa } = useStudentData();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'O': return 'bg-green-100 text-green-800 border-green-200';
      case 'A+': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'A': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'B+': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceIcon = (total: number) => {
    if (total >= 175) return <Award className="h-4 w-4 text-green-600" />;
    if (total >= 160) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    return <BookOpen className="h-4 w-4 text-gray-600" />;
  };

  const maxMarks = marksWithGrades.length * 200;
  const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(1) : '0.0';

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Overall CGPA</p>
                  <p className="text-3xl font-bold text-blue-800">{cgpa}</p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Marks</p>
                  <p className="text-3xl font-bold text-green-800">{totalMarks}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Percentage</p>
                  <p className="text-3xl font-bold text-purple-800">{percentage}%</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Subjects</p>
                  <p className="text-3xl font-bold text-orange-800">{marksWithGrades.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marks Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>Subject-wise Marks & Grades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marksWithGrades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-700">Subject</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Code</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Internal</th>
                      <th className="text-center p-4 font-semibold text-gray-700">External</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Total</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Grade</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksWithGrades.map((subject, index) => (
                      <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{subject.name}</div>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="outline" className="font-mono">
                            {subject.code}
                          </Badge>
                        </td>
                        <td className="p-4 text-center font-medium">{subject.internal}/100</td>
                        <td className="p-4 text-center font-medium">{subject.external}/100</td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-lg">{subject.total}/200</span>
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={getGradeColor(subject.grade)}>
                            {subject.grade}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          {getPerformanceIcon(subject.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No marks available yet. Complete your assessments to see results here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grade Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Scale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { grade: 'O', range: '180-200', description: 'Outstanding' },
                { grade: 'A+', range: '160-179', description: 'Excellent' },
                { grade: 'A', range: '140-159', description: 'Very Good' },
                { grade: 'B+', range: '120-139', description: 'Good' },
                { grade: 'B', range: '100-119', description: 'Average' }
              ].map((item, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <Badge className={getGradeColor(item.grade)} variant="outline">
                    {item.grade}
                  </Badge>
                  <p className="text-sm font-medium mt-2">{item.description}</p>
                  <p className="text-xs text-gray-600">{item.range}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentMarks;
