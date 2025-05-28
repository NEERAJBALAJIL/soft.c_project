
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Calculator, Save, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { mockStaffData } from '@/data/mockData';

interface StudentMarks {
  studentId: string;
  internal: number | '';
  external: number | '';
  total: number;
  grade: string;
}

const EvaluateMarks = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marksData, setMarksData] = useState<Record<string, StudentMarks>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Get students enrolled in the selected subject
  const getEnrolledStudents = (subjectId: string) => {
    const enrollments: Record<string, string[]> = {
      '1': ['1', '2', '4'], // Data Structures
      '2': ['1', '3', '4'], // Database Management  
      '3': ['2', '3', '4']  // Web Development
    };
    
    const enrolledStudentIds = enrollments[subjectId] || [];
    return mockStaffData.students.filter(student => enrolledStudentIds.includes(student.id));
  };

  const calculateGrade = (total: number): string => {
    if (total >= 180) return 'O';
    if (total >= 160) return 'A+';
    if (total >= 140) return 'A';
    if (total >= 120) return 'B+';
    if (total >= 100) return 'B';
    return 'F';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'O': return 'bg-green-100 text-green-800 border-green-200';
      case 'A+': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'A': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'B+': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'B': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    // Initialize marks data for enrolled students
    const enrolledStudents = getEnrolledStudents(subjectId);
    const initialMarks: Record<string, StudentMarks> = {};
    
    enrolledStudents.forEach(student => {
      // Mock existing marks (in real app, load from database)
      const mockMarks = {
        '1': { internal: 85 as number | '', external: 78 as number | '' }, // Raahul
        '2': { internal: 88 as number | '', external: 82 as number | '' }, // Priya
        '3': { internal: 82 as number | '', external: 75 as number | '' }, // Arjun
        '4': { internal: 87 as number | '', external: 80 as number | '' }  // Sneha
      };
      
      const existing = mockMarks[student.id as keyof typeof mockMarks] || { internal: '' as number | '', external: '' as number | '' };
      const internal = existing.internal;
      const external = existing.external;
      const total = (typeof internal === 'number' && typeof external === 'number') ? internal + external : 0;
      
      initialMarks[student.id] = {
        studentId: student.id,
        internal,
        external,
        total,
        grade: total > 0 ? calculateGrade(total) : '-'
      };
    });
    
    setMarksData(initialMarks);
  };

  const handleMarksChange = (studentId: string, field: 'internal' | 'external', value: string) => {
    const numValue = value === '' ? '' : Math.min(100, Math.max(0, parseInt(value) || 0));
    
    setMarksData(prev => {
      const updated = { ...prev };
      updated[studentId] = { ...updated[studentId], [field]: numValue };
      
      // Recalculate total and grade
      const internal = typeof updated[studentId].internal === 'number' ? updated[studentId].internal : 0;
      const external = typeof updated[studentId].external === 'number' ? updated[studentId].external : 0;
      const total = internal + external;
      
      updated[studentId].total = total;
      updated[studentId].grade = total > 0 ? calculateGrade(total) : '-';
      
      return updated;
    });
  };

  const handleSaveMarks = async () => {
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject first",
        variant: "destructive"
      });
      return;
    }

    const enrolledStudents = getEnrolledStudents(selectedSubject);
    const incompleteEntries = enrolledStudents.filter(student => {
      const marks = marksData[student.id];
      return !marks || marks.internal === '' || marks.external === '';
    });

    if (incompleteEntries.length > 0) {
      toast({
        title: "Incomplete Data",
        description: `Please enter marks for all students. ${incompleteEntries.length} entries incomplete.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const subjectName = mockStaffData.subjects.find(s => s.id === selectedSubject)?.name;
    const averageTotal = Object.values(marksData).reduce((sum, marks) => sum + marks.total, 0) / enrolledStudents.length;

    toast({
      title: "Marks Saved Successfully",
      description: `${subjectName}: Marks updated for ${enrolledStudents.length} students. Class average: ${averageTotal.toFixed(1)}`
    });

    setIsLoading(false);
  };

  const enrolledStudents = selectedSubject ? getEnrolledStudents(selectedSubject) : [];
  
  // Calculate statistics
  const validMarks = Object.values(marksData).filter(marks => marks.total > 0);
  const averageTotal = validMarks.length > 0 ? validMarks.reduce((sum, marks) => sum + marks.total, 0) / validMarks.length : 0;
  const highestScore = validMarks.length > 0 ? Math.max(...validMarks.map(marks => marks.total)) : 0;
  const passCount = validMarks.filter(marks => marks.total >= 100).length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-600 p-3 rounded-full">
              <ClipboardCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Evaluate Marks</h1>
          <p className="text-gray-600">Enter and manage student examination marks</p>
        </div>

        {/* Subject Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span>Subject Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={selectedSubject} onValueChange={handleSubjectSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject to evaluate" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaffData.subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Enrolled Students</Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-2xl font-bold text-gray-800">{enrolledStudents.length}</span>
                  <p className="text-sm text-gray-600">Total students</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Evaluation Type</Label>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Internal + External</p>
                  <p className="text-xs text-blue-600">100 marks each</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {selectedSubject && validMarks.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-800">{averageTotal.toFixed(1)}</div>
                  <div className="text-sm text-blue-600">Class Average</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-800">{highestScore}</div>
                  <div className="text-sm text-green-600">Highest Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-800">{passCount}</div>
                  <div className="text-sm text-purple-600">Students Passed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-800">
                    {enrolledStudents.length > 0 ? Math.round((passCount / enrolledStudents.length) * 100) : 0}%
                  </div>
                  <div className="text-sm text-orange-600">Pass Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Marks Entry */}
        {selectedSubject && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span>Student Marks Entry</span>
                </div>
                <Button onClick={handleSaveMarks} disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save All Marks
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-700">Student</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Reg. Number</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Internal /100</th>
                      <th className="text-center p-4 font-semibold text-gray-700">External /100</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Total /200</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledStudents.map((student) => {
                      const marks = marksData[student.id] || { internal: '', external: '', total: 0, grade: '-' };
                      return (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-semibold">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-600">CGPA: {student.cgpa}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center text-gray-600">{student.regNumber}</td>
                          <td className="p-4 text-center">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={marks.internal}
                              onChange={(e) => handleMarksChange(student.id, 'internal', e.target.value)}
                              className="w-20 mx-auto text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={marks.external}
                              onChange={(e) => handleMarksChange(student.id, 'external', e.target.value)}
                              className="w-20 mx-auto text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-lg font-bold text-gray-900">
                              {marks.total}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <Badge className={getGradeColor(marks.grade)}>
                              {marks.grade}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {enrolledStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No students enrolled in this subject</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grade Scale */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Scale Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { grade: 'O', range: '180-200', description: 'Outstanding' },
                { grade: 'A+', range: '160-179', description: 'Excellent' },
                { grade: 'A', range: '140-159', description: 'Very Good' },
                { grade: 'B+', range: '120-139', description: 'Good' },
                { grade: 'B', range: '100-119', description: 'Average' },
                { grade: 'F', range: 'Below 100', description: 'Fail' }
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

        {/* Guidelines */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800">Evaluation Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-orange-700 space-y-2">
              <li>• Internal marks: Assessment, assignments, quizzes (Max: 100)</li>
              <li>• External marks: Final examination (Max: 100)</li>
              <li>• Minimum 40% required in both internal and external to pass</li>
              <li>• Marks should be entered within 48 hours of evaluation</li>
              <li>• Double-check all entries before saving - modifications require approval</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EvaluateMarks;
