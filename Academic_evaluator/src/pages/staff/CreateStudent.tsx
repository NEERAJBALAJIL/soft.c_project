
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Mail, User, BookOpen, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    email: '',
    department: '',
    semester: '',
    subjects: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch subjects using React Query
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      console.log('Fetching subjects...');
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching subjects:', error);
        throw error;
      }

      console.log('Subjects loaded:', data);
      return data || [];
    },
  });

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical'
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter(id => id !== subjectId)
        : [...prev.subjects, subjectId]
    }));
  };

  const generateRegNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const regNumber = `ST${year}${random}`;
    setFormData(prev => ({ ...prev, regNumber }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.regNumber || !formData.email || !formData.department || !formData.semester) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.subjects.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please assign at least one subject",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Creating student with data:', formData);

      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: 'Changeme@123',
        user_metadata: {
          name: formData.name,
          role: 'student'
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authUser.user) {
        throw new Error('Failed to create user');
      }

      console.log('Auth user created:', authUser.user.id);

      // Create student record
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: authUser.user.id,
          reg_number: formData.regNumber,
          name: formData.name,
          email: formData.email,
          department: formData.department,
          semester: parseInt(formData.semester)
        })
        .select()
        .single();

      if (studentError) {
        throw studentError;
      }

      console.log('Student record created:', studentData);

      // Assign subjects
      const subjectAssignments = formData.subjects.map(subjectId => ({
        student_id: studentData.id,
        subject_id: subjectId
      }));

      const { error: subjectError } = await supabase
        .from('student_subjects')
        .insert(subjectAssignments);

      if (subjectError) {
        throw subjectError;
      }

      console.log('Subject assignments created');

      toast({
        title: "Student Created Successfully",
        description: `${formData.name} has been added to the system with registration number ${formData.regNumber}. Password: Changeme@123`
      });

      // Reset form
      setFormData({
        name: '',
        regNumber: '',
        email: '',
        department: '',
        semester: '',
        subjects: []
      });

    } catch (error: any) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create student. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Student</h1>
          <p className="text-gray-600">Add a new student to the academic portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Student Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter student's full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regNumber">Registration Number *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="regNumber"
                      type="text"
                      placeholder="ST2024001"
                      value={formData.regNumber}
                      onChange={(e) => handleInputChange('regNumber', e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={generateRegNumber}
                      className="whitespace-nowrap"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester *</Label>
                  <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject Assignment */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <Label className="text-lg font-semibold">Assign Subjects *</Label>
                </div>
                <p className="text-sm text-gray-600">Select the subjects this student will be enrolled in:</p>
                
                {subjectsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading subjects...</span>
                  </div>
                ) : subjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No subjects found. Please contact your administrator.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={`subject-${subject.id}`}
                          checked={formData.subjects.includes(subject.id)}
                          onCheckedChange={() => handleSubjectToggle(subject.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`subject-${subject.id}`} className="font-medium cursor-pointer">
                            {subject.name}
                          </Label>
                          <p className="text-sm text-gray-600">{subject.code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700" 
                  disabled={isSubmitting || subjectsLoading}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Student...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Create Student</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Important Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All new student accounts are created with password: <strong>Changeme@123</strong></li>
              <li>• Registration numbers should be unique for each student</li>
              <li>• Students can login immediately after account creation</li>
              <li>• Subject assignments can be modified later from the "Assign Subjects" section</li>
              <li>• Make sure to verify email addresses before creating the student record</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateStudent;
