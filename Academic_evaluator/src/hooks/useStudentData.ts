
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useStudentData = () => {
  const { user } = useAuth();

  const { data: studentRecord } = useQuery({
    queryKey: ['student-record', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching student record:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id && user?.role === 'student',
  });

  const { data: subjects } = useQuery({
    queryKey: ['student-subjects', studentRecord?.id],
    queryFn: async () => {
      if (!studentRecord?.id) return [];
      
      const { data, error } = await supabase
        .from('student_subjects')
        .select(`
          subject_id,
          subjects (
            id,
            code,
            name
          )
        `)
        .eq('student_id', studentRecord.id);
      
      if (error) {
        console.error('Error fetching subjects:', error);
        return [];
      }
      
      return data?.map(item => item.subjects).filter(Boolean) || [];
    },
    enabled: !!studentRecord?.id,
  });

  const { data: marks } = useQuery({
    queryKey: ['student-marks', studentRecord?.id],
    queryFn: async () => {
      if (!studentRecord?.id) return [];
      
      const { data, error } = await supabase
        .from('marks')
        .select(`
          *,
          subjects (
            id,
            code,
            name
          )
        `)
        .eq('student_id', studentRecord.id);
      
      if (error) {
        console.error('Error fetching marks:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!studentRecord?.id,
  });

  const { data: attendance } = useQuery({
    queryKey: ['student-attendance', studentRecord?.id],
    queryFn: async () => {
      if (!studentRecord?.id) return [];
      
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          subjects (
            id,
            code,
            name
          )
        `)
        .eq('student_id', studentRecord.id);
      
      if (error) {
        console.error('Error fetching attendance:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!studentRecord?.id,
  });

  // Calculate attendance percentages
  const attendanceStats = subjects?.map(subject => {
    const subjectAttendance = attendance?.filter(a => a.subject_id === subject.id) || [];
    const totalClasses = subjectAttendance.length;
    const attendedClasses = subjectAttendance.filter(a => a.status === 'present').length;
    const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
    
    return {
      subject: subject.name,
      totalClasses,
      attendedClasses,
      percentage
    };
  }) || [];

  // Calculate marks with grades
  const marksWithGrades = subjects?.map(subject => {
    const subjectMarks = marks?.filter(m => m.subject_id === subject.id) || [];
    const internal = subjectMarks.find(m => m.exam_type === 'internal')?.marks || 0;
    const external = subjectMarks.find(m => m.exam_type === 'external')?.marks || 0;
    const total = internal + external;
    
    let grade = 'F';
    if (total >= 180) grade = 'O';
    else if (total >= 160) grade = 'A+';
    else if (total >= 140) grade = 'A';
    else if (total >= 120) grade = 'B+';
    else if (total >= 100) grade = 'B';
    
    return {
      id: subject.id,
      name: subject.name,
      code: subject.code,
      internal,
      external,
      total,
      grade
    };
  }) || [];

  const totalMarks = marksWithGrades.reduce((sum, subject) => sum + subject.total, 0);
  const averagePercentage = marksWithGrades.length > 0 ? (totalMarks / (marksWithGrades.length * 200)) * 100 : 0;
  const cgpa = (averagePercentage / 10).toFixed(1);

  const overallAttendance = attendanceStats.length > 0 
    ? Math.round(attendanceStats.reduce((sum, stat) => sum + stat.percentage, 0) / attendanceStats.length)
    : 0;

  return {
    studentRecord,
    subjects: subjects || [],
    marksWithGrades,
    attendanceStats,
    totalMarks,
    cgpa: parseFloat(cgpa),
    overallAttendance,
    totalSubjects: subjects?.length || 0
  };
};
