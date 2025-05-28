
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquare, Send, Star, User, BookOpen, History } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { mockStaffData } from '@/data/mockData';

interface FeedbackEntry {
  id: string;
  studentId: string;
  subject: string;
  comment: string;
  rating: string;
  date: string;
}

const GiveFeedback = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock previous feedback data
  const [previousFeedback] = useState<FeedbackEntry[]>([
    {
      id: '1',
      studentId: '1',
      subject: 'Data Structures',
      comment: 'Excellent problem-solving skills. Keep up the good work in algorithm implementation.',
      rating: 'Excellent',
      date: '2024-01-15'
    },
    {
      id: '2',
      studentId: '2',
      subject: 'Database Management',
      comment: 'Good understanding of database concepts. Needs improvement in query optimization.',
      rating: 'Good',
      date: '2024-01-12'
    }
  ]);

  const ratingOptions = [
    { value: 'outstanding', label: 'Outstanding', description: 'Exceptional performance' },
    { value: 'excellent', label: 'Excellent', description: 'Above expectations' },
    { value: 'good', label: 'Good', description: 'Meets expectations' },
    { value: 'average', label: 'Average', description: 'Below expectations' },
    { value: 'poor', label: 'Needs Improvement', description: 'Requires significant improvement' }
  ];

  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'outstanding': return 'bg-green-100 text-green-800 border-green-200';
      case 'excellent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'good': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStudentSubjects = (studentId: string) => {
    // Mock enrollment data
    const enrollments: Record<string, string[]> = {
      '1': ['1', '2', '3'], // Raahul
      '2': ['1', '2', '3'], // Priya
      '3': ['1', '2', '3'], // Arjun
      '4': ['1', '2', '3']  // Sneha
    };
    
    const subjectIds = enrollments[studentId] || [];
    return mockStaffData.subjects.filter(subject => subjectIds.includes(subject.id));
  };

  const handleSubmitFeedback = async () => {
    if (!selectedStudent || !selectedSubject || !comment.trim() || !rating) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all fields before submitting feedback",
        variant: "destructive"
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Comment Too Short",
        description: "Please provide a more detailed comment (at least 10 characters)",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const student = mockStaffData.students.find(s => s.id === selectedStudent);
    const subject = mockStaffData.subjects.find(s => s.id === selectedSubject);

    toast({
      title: "Feedback Submitted Successfully",
      description: `Feedback for ${student?.name} in ${subject?.name} has been recorded and will be visible to the student`
    });

    // Reset form
    setSelectedStudent('');
    setSelectedSubject('');
    setComment('');
    setRating('');
    setIsSubmitting(false);
  };

  const selectedStudentData = mockStaffData.students.find(s => s.id === selectedStudent);
  const availableSubjects = selectedStudent ? getStudentSubjects(selectedStudent) : [];
  
  // Filter previous feedback for selected student
  const studentFeedback = selectedStudent 
    ? previousFeedback.filter(f => f.studentId === selectedStudent)
    : [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 p-3 rounded-full">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Give Feedback</h1>
          <p className="text-gray-600">Provide valuable feedback to help students improve their performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Student Selection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Student</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose student to give feedback" />
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

                  {selectedStudentData && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Student Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">Name:</span>
                          <p className="text-blue-800">{selectedStudentData.name}</p>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Registration:</span>
                          <p className="text-blue-800">{selectedStudentData.regNumber}</p>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">CGPA:</span>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>Subject & Rating</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select 
                      value={selectedSubject} 
                      onValueChange={setSelectedSubject}
                      disabled={!selectedStudent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedStudent ? "Select subject" : "Select student first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Overall Rating</span>
                    </Label>
                    <RadioGroup value={rating} onValueChange={setRating}>
                      {ratingOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-sm text-gray-500">{option.description}</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span>Feedback Comment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Detailed Feedback</Label>
                    <Textarea
                      placeholder="Provide detailed feedback about the student's performance, areas of strength, and suggestions for improvement..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-32"
                      maxLength={500}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Be constructive and specific in your feedback</span>
                      <span>{comment.length}/500</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmitFeedback} 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting Feedback...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Previous Feedback */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-orange-600" />
                  <span>Previous Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStudent ? (
                  studentFeedback.length > 0 ? (
                    <div className="space-y-4">
                      {studentFeedback.map((feedback) => (
                        <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{feedback.subject}</span>
                            <Badge className={getRatingColor(feedback.rating)} variant="outline">
                              {feedback.rating}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
                          <p className="text-xs text-gray-500">{new Date(feedback.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm text-gray-500">No previous feedback for this student</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-6">
                    <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">Select a student to view previous feedback</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Guidelines */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Feedback Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• Be specific and constructive in your comments</li>
                  <li>• Highlight both strengths and areas for improvement</li>
                  <li>• Provide actionable suggestions</li>
                  <li>• Use professional and encouraging language</li>
                  <li>• Focus on academic performance and behavior</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GiveFeedback;
