
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Save, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { mockStaffData } from '@/data/mockData';

const AttendanceManagement = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Get students enrolled in the selected subject
  const getEnrolledStudents = (subjectId: string) => {
    // Mock enrollment data - in real app, this would come from the database
    const enrollments: Record<string, string[]> = {
      '1': ['1', '2', '4'], // Data Structures: Raahul, Priya, Sneha
      '2': ['1', '3', '4'], // Database Management: Raahul, Arjun, Sneha  
      '3': ['2', '3', '4']  // Web Development: Priya, Arjun, Sneha
    };
    
    const enrolledStudentIds = enrollments[subjectId] || [];
    return mockStaffData.students.filter(student => enrolledStudentIds.includes(student.id));
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    // Reset attendance data when subject changes
    setAttendanceData({});
  };

  const handleAttendanceToggle = (studentId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const markAllPresent = () => {
    const enrolledStudents = getEnrolledStudents(selectedSubject);
    const allPresentData: Record<string, boolean> = {};
    enrolledStudents.forEach(student => {
      allPresentData[student.id] = true;
    });
    setAttendanceData(allPresentData);
    toast({
      title: "All Students Marked Present",
      description: "All enrolled students have been marked as present"
    });
  };

  const markAllAbsent = () => {
    const enrolledStudents = getEnrolledStudents(selectedSubject);
    const allAbsentData: Record<string, boolean> = {};
    enrolledStudents.forEach(student => {
      allAbsentData[student.id] = false;
    });
    setAttendanceData(allAbsentData);
    toast({
      title: "All Students Marked Absent",
      description: "All enrolled students have been marked as absent"
    });
  };

  const handleSaveAttendance = async () => {
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject first",
        variant: "destructive"
      });
      return;
    }

    const enrolledStudents = getEnrolledStudents(selectedSubject);
    const unmarkedStudents = enrolledStudents.filter(student => 
      attendanceData[student.id] === undefined
    );

    if (unmarkedStudents.length > 0) {
      toast({
        title: "Incomplete Attendance",
        description: `Please mark attendance for all students. ${unmarkedStudents.length} students unmarked.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const presentCount = Object.values(attendanceData).filter(present => present).length;
    const totalCount = enrolledStudents.length;
    const subjectName = mockStaffData.subjects.find(s => s.id === selectedSubject)?.name;

    toast({
      title: "Attendance Saved Successfully",
      description: `${subjectName} - ${selectedDate}: ${presentCount}/${totalCount} students present`
    });

    setIsLoading(false);
  };

  const enrolledStudents = selectedSubject ? getEnrolledStudents(selectedSubject) : [];
  const presentCount = Object.values(attendanceData).filter(present => present).length;
  const absentCount = Object.values(attendanceData).filter(present => present === false).length;
  const unmarkedCount = enrolledStudents.length - (presentCount + absentCount);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
          <p className="text-gray-600">Record student attendance for your classes</p>
        </div>

        {/* Selection Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Class Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={selectedSubject} onValueChange={handleSubjectSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
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
                <Label>Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label>Enrolled Students</Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-2xl font-bold text-gray-800">{enrolledStudents.length}</span>
                  <p className="text-sm text-gray-600">Total students</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        {selectedSubject && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-800">{presentCount}</div>
                  <div className="text-sm text-green-600">Present</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-800">{absentCount}</div>
                  <div className="text-sm text-red-600">Absent</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-800">{unmarkedCount}</div>
                  <div className="text-sm text-yellow-600">Unmarked</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-800">
                    {enrolledStudents.length > 0 ? Math.round((presentCount / enrolledStudents.length) * 100) : 0}%
                  </div>
                  <div className="text-sm text-blue-600">Present Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance Marking */}
        {selectedSubject && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Student Attendance</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={markAllPresent}>
                    Mark All Present
                  </Button>
                  <Button variant="outline" size="sm" onClick={markAllAbsent}>
                    Mark All Absent
                  </Button>
                  <Button size="sm" onClick={handleSaveAttendance} disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Attendance
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrolledStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.regNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        CGPA: {student.cgpa}
                      </Badge>
                      
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`present-${student.id}`}
                            checked={attendanceData[student.id] === true}
                            onCheckedChange={() => setAttendanceData(prev => ({ ...prev, [student.id]: true }))}
                          />
                          <Label htmlFor={`present-${student.id}`} className="text-green-600 font-medium">
                            Present
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`absent-${student.id}`}
                            checked={attendanceData[student.id] === false}
                            onCheckedChange={() => setAttendanceData(prev => ({ ...prev, [student.id]: false }))}
                          />
                          <Label htmlFor={`absent-${student.id}`} className="text-red-600 font-medium">
                            Absent
                          </Label>
                        </div>
                      </div>

                      {attendanceData[student.id] !== undefined && (
                        <CheckCircle className={`h-5 w-5 ${attendanceData[student.id] ? 'text-green-500' : 'text-red-500'}`} />
                      )}
                    </div>
                  </div>
                ))}

                {enrolledStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No students enrolled in this subject</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guidelines */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Attendance Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Attendance should be marked within 24 hours of the class</li>
              <li>• Students need minimum 75% attendance to be eligible for exams</li>
              <li>• Late arrivals (more than 15 minutes) should be marked as absent</li>
              <li>• Use "Mark All Present" for full attendance days to save time</li>
              <li>• Attendance records cannot be modified after 48 hours without approval</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AttendanceManagement;
