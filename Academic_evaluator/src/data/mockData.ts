
export const mockStudentData = {
  cgpa: 8.5,
  attendancePercentage: 87,
  totalSubjects: 6,
  subjects: [
    {
      id: '1',
      name: 'Data Structures',
      code: 'CS201',
      internal: 85,
      external: 78,
      total: 163,
      grade: 'A'
    },
    {
      id: '2',
      name: 'Database Management',
      code: 'CS202',
      internal: 88,
      external: 82,
      total: 170,
      grade: 'A+'
    },
    {
      id: '3',
      name: 'Operating Systems',
      code: 'CS203',
      internal: 82,
      external: 75,
      total: 157,
      grade: 'A'
    },
    {
      id: '4',
      name: 'Computer Networks',
      code: 'CS204',
      internal: 90,
      external: 85,
      total: 175,
      grade: 'A+'
    },
    {
      id: '5',
      name: 'Software Engineering',
      code: 'CS205',
      internal: 87,
      external: 80,
      total: 167,
      grade: 'A+'
    },
    {
      id: '6',
      name: 'Web Development',
      code: 'CS206',
      internal: 92,
      external: 88,
      total: 180,
      grade: 'O'
    }
  ],
  attendance: [
    {
      subject: 'Data Structures',
      totalClasses: 45,
      attendedClasses: 40,
      percentage: 89
    },
    {
      subject: 'Database Management',
      totalClasses: 42,
      attendedClasses: 38,
      percentage: 90
    },
    {
      subject: 'Operating Systems',
      totalClasses: 40,
      attendedClasses: 34,
      percentage: 85
    },
    {
      subject: 'Computer Networks',
      totalClasses: 38,
      attendedClasses: 32,
      percentage: 84
    },
    {
      subject: 'Software Engineering',
      totalClasses: 36,
      attendedClasses: 31,
      percentage: 86
    },
    {
      subject: 'Web Development',
      totalClasses: 44,
      attendedClasses: 40,
      percentage: 91
    }
  ],
  feedback: [
    {
      id: '1',
      subject: 'Data Structures',
      staff: 'Dr. Pittu Sharma',
      comment: 'Excellent problem-solving skills. Keep up the good work in algorithm implementation.',
      date: '2024-01-15',
      rating: 'Excellent'
    },
    {
      id: '2',
      subject: 'Database Management',
      staff: 'Prof. Sarah Wilson',
      comment: 'Good understanding of database concepts. Needs improvement in query optimization.',
      date: '2024-01-12',
      rating: 'Good'
    },
    {
      id: '3',
      subject: 'Web Development',
      staff: 'Mr. Alex Johnson',
      comment: 'Outstanding creativity in project work. Well-structured code and clean design.',
      date: '2024-01-10',
      rating: 'Outstanding'
    }
  ]
};

export const mockStaffData = {
  totalStudents: 120,
  subjectsHandled: 3,
  students: [
    {
      id: '1',
      name: 'Raahul Kumar',
      regNumber: 'ST2021001',
      department: 'Computer Science',
      email: 'raahul@university.edu',
      cgpa: 8.5,
      attendance: 87
    },
    {
      id: '2',
      name: 'Priya Sharma',
      regNumber: 'ST2021002',
      department: 'Computer Science',
      email: 'priya@university.edu',
      cgpa: 9.1,
      attendance: 92
    },
    {
      id: '3',
      name: 'Arjun Patel',
      regNumber: 'ST2021003',
      department: 'Computer Science',
      email: 'arjun@university.edu',
      cgpa: 7.8,
      attendance: 85
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      regNumber: 'ST2021004',
      department: 'Computer Science',
      email: 'sneha@university.edu',
      cgpa: 8.9,
      attendance: 90
    }
  ],
  subjects: [
    { id: '1', name: 'Data Structures', code: 'CS201' },
    { id: '2', name: 'Database Management', code: 'CS202' },
    { id: '3', name: 'Web Development', code: 'CS206' }
  ]
};
