
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useStaffData = () => {
  const { user } = useAuth();

  const { data: students } = useQuery({
    queryKey: ['all-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching students:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: user?.role === 'staff',
  });

  const { data: subjects } = useQuery({
    queryKey: ['all-subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching subjects:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: user?.role === 'staff',
  });

  const { data: studentsWithStats } = useQuery({
    queryKey: ['students-with-stats', students?.length],
    queryFn: async () => {
      if (!students || students.length === 0) return [];
      
      const studentsWithData = await Promise.all(
        students.map(async (student) => {
          // Get marks for CGPA calculation
          const { data: marks } = await supabase
            .from('marks')
            .select('marks')
            .eq('student_id', student.id);
          
          // Get attendance for percentage calculation
          const { data: attendance } = await supabase
            .from('attendance')
            .select('status')
            .eq('student_id', student.id);
          
          const totalMarks = marks?.reduce((sum, mark) => sum + (mark.marks || 0), 0) || 0;
          const averageMarks = marks?.length ? totalMarks / marks.length : 0;
          const cgpa = (averageMarks / 10).toFixed(1);
          
          const totalClasses = attendance?.length || 0;
          const attendedClasses = attendance?.filter(a => a.status === 'present').length || 0;
          const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
          
          return {
            ...student,
            cgpa: parseFloat(cgpa),
            attendance: attendancePercentage
          };
        })
      );
      
      return studentsWithData;
    },
    enabled: !!students && students.length > 0 && user?.role === 'staff',
  });

  return {
    students: studentsWithStats || [],
    subjects: subjects || [],
    subjectsHandled: subjects?.length || 0
  };
};
