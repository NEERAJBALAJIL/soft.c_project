
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User, Save, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { mockStaffData } from '@/data/mockData';

const AssignSubjects = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableSubjects = [
    ...mockStaffData.subjects,
    { id: '4', name: 'Operating Systems', code: 'CS203' },
    { id: '5', name: 'Computer Networks', code: 'CS204' },
    { id: '6', name: 'Software Engineering', code: 'CS205' },
    { id: '7', name: 'Machine Learning', code: 'CS301' },
    { id: '8', name: 'Artificial Intelligence', code: 'CS302' }
  ];

  // Mock current assignments for demonstration
  const getCurrentAssignments = (studentId: string) => {
    if (studentId === '1') return ['1', '2', '6']; // Raahul's current subjects
    if (studentId === '2') return ['1', '3', '4']; // Priya's current subjects
    if (studentId === '3') return ['2', '5', '6']; // Arjun's current subjects
    if (studentId === '4') return ['1', '4', '5']; // Sneha's current subjects
    return [];
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    // Load current assignments for the selected student
    const currentAssignments = getCurrentAssignments(studentId);
    setAssignedSubjects(currentAssignments);
  };

  const handleSubjectToggle = (subjectId: string) => {
    setAssignedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSaveAssignments = async () => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student first",
        variant: "destructive"
      });
      return;
    }

    if (assignedSubjects.length === 0) {
      toast({
        title: "Error",
        description: "Please assign at least one subject",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const student = mockStaffData.students.find(s => s.id === selectedStudent);
    const assignedSubjectNames = assignedSubjects.map(id => 
      availableSubjects.find(subject => subject.id === id)?.name
    ).join(', ');

    toast({
      title: "Assignments Updated",
      description: `Successfully updated subject assignments for ${student?.name}. Assigned subjects: ${assignedSubjectNames}`
    });

    setIsLoading(false);
  };

  const resetAssignments = () => {
    if (selectedStudent) {
      const currentAssignments = getCurrentAssignments(selectedStudent);
      setAssignedSubjects(currentAssignments);
      toast({
        title: "Reset Complete",
        description: "Subject assignments have been reset to current state"
      });
    }
  };

  const selectedStudentData = mockStaffData.students.find(s => s.id === selectedStudent);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Subjects</h1>
          <p className="text-gray-600">Manage student subject assignments and enrollments</p>
        </div>

        {/* Student Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Select Student</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Choose Student</Label>
                  <Select value={selectedStudent} onValueChange={handleStudentSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student to manage subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStaffData.students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.regNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedStudentData && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Name:</span>
                      <p className="text-blue-800">{selectedStudentData.name}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Registration:</span>
                      <p className="text-blue-800">{selectedStudentData.regNumber}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Department:</span>
                      <p className="text-blue-800">{selectedStudentData.department}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Current CGPA:</span>
                      <p className="text-blue-800">{selectedStudentData.cgpa}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Attendance:</span>
                      <p className="text-blue-800">{selectedStudentData.attendance}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subject Assignment */}
        {selectedStudent && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>Subject Assignment</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={resetAssignments}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleSaveAssignments} disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Assignments
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current Assignment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Currently Assigned Subjects ({assignedSubjects.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {assignedSubjects.length > 0 ? (
                      assignedSubjects.map(subjectId => {
                        const subject = availableSubjects.find(s => s.id === subjectId);
                        return (
                          <Badge key={subjectId} variant="secondary" className="bg-blue-100 text-blue-800">
                            {subject?.name} ({subject?.code})
                          </Badge>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 italic">No subjects assigned</p>
                    )}
                  </div>
                </div>

                {/* Available Subjects */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Available Subjects</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableSubjects.map((subject) => (
                      <div 
                        key={subject.id} 
                        className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                          assignedSubjects.includes(subject.id)
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Checkbox
                          id={`subject-${subject.id}`}
                          checked={assignedSubjects.includes(subject.id)}
                          onCheckedChange={() => handleSubjectToggle(subject.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`subject-${subject.id}`} className="font-medium cursor-pointer">
                            {subject.name}
                          </Label>
                          <p className="text-sm text-gray-600">{subject.code}</p>
                        </div>
                        {assignedSubjects.includes(subject.id) && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Assigned
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guidelines */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Assignment Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• Students should be assigned 4-6 subjects per semester for optimal workload</li>
              <li>• Ensure prerequisite subjects are completed before assigning advanced courses</li>
              <li>• Subject changes after the first two weeks of semester require department approval</li>
              <li>• Students will be automatically enrolled in labs associated with theory subjects</li>
              <li>• Assignment changes will be reflected in the student portal immediately</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AssignSubjects;
