
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('Starting demo users setup...')
    
    // First, try to delete existing users by listing all users and finding by email
    console.log('Cleaning up existing demo users...')
    
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    
    if (existingUsers?.users) {
      const demoEmails = [
        'admin@gmail.com',
        'raahul.kumar@university.edu',
        'priya.sharma@university.edu',
        'amit.patel@university.edu'
      ]
      
      for (const user of existingUsers.users) {
        if (demoEmails.includes(user.email || '')) {
          console.log(`Deleting existing user: ${user.email}`)
          await supabaseAdmin.auth.admin.deleteUser(user.id)
        }
      }
    }
    
    console.log('Creating admin staff user...')
    
    // Create admin staff user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'Admin@123',
      user_metadata: {
        name: 'Dr. Pittu Sharma',
        role: 'staff'
      },
      email_confirm: true
    })

    if (adminError) {
      console.error('Admin creation error:', adminError)
      throw adminError
    }

    console.log('Admin user created successfully:', adminUser?.user?.id)

    // Create admin profile
    if (adminUser?.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: adminUser.user.id,
          name: 'Dr. Pittu Sharma',
          email: 'admin@gmail.com',
          role: 'staff'
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('Error creating admin profile:', profileError)
      } else {
        console.log('Admin profile created successfully')
      }
    }

    // Create demo student users
    const students = [
      {
        email: 'raahul.kumar@university.edu',
        name: 'Raahul Kumar',
        regNumber: 'ST2021001',
        department: 'Computer Science',
        semester: 5
      },
      {
        email: 'priya.sharma@university.edu', 
        name: 'Priya Sharma',
        regNumber: 'ST2021002',
        department: 'Computer Science',
        semester: 5
      },
      {
        email: 'amit.patel@university.edu',
        name: 'Amit Patel', 
        regNumber: 'ST2021003',
        department: 'Information Technology',
        semester: 5
      }
    ]

    console.log('Creating student users...')

    // Create subjects first
    const { data: existingSubjects } = await supabaseAdmin
      .from('subjects')
      .select('*')

    if (!existingSubjects || existingSubjects.length === 0) {
      console.log('Creating subjects...')
      const { error: subjectsError } = await supabaseAdmin
        .from('subjects')
        .insert([
          { code: 'CS101', name: 'Introduction to Computer Science' },
          { code: 'CS102', name: 'Data Structures and Algorithms' },
          { code: 'CS103', name: 'Database Management Systems' },
          { code: 'CS104', name: 'Web Development' },
          { code: 'CS105', name: 'Software Engineering' }
        ])

      if (subjectsError) {
        console.error('Error creating subjects:', subjectsError)
      } else {
        console.log('Subjects created successfully')
      }
    }

    // Get subjects for assignment
    const { data: subjects } = await supabaseAdmin
      .from('subjects')
      .select('*')
      .limit(3)

    for (const student of students) {
      console.log(`Creating student: ${student.name}`)

      // Create auth user
      const { data: studentUser, error: studentError } = await supabaseAdmin.auth.admin.createUser({
        email: student.email,
        password: 'Changeme@123',
        user_metadata: {
          name: student.name,
          role: 'student'
        },
        email_confirm: true
      })

      if (studentError) {
        console.error('Error creating student:', studentError)
        continue
      }

      console.log(`Student auth user created: ${student.name} with ID: ${studentUser?.user?.id}`)

      if (studentUser?.user) {
        // Create profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: studentUser.user.id,
            name: student.name,
            email: student.email,
            role: 'student',
            reg_number: student.regNumber,
            department: student.department
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.error('Error creating student profile:', profileError)
          continue
        }

        // Create student record
        const { data: studentRecord, error: studentRecordError } = await supabaseAdmin
          .from('students')
          .insert({
            user_id: studentUser.user.id,
            reg_number: student.regNumber,
            name: student.name,
            email: student.email,
            department: student.department,
            semester: student.semester
          })
          .select()
          .single()

        if (studentRecordError) {
          console.error('Error creating student record:', studentRecordError)
          continue
        }

        console.log('Student record created:', studentRecord)

        if (subjects && subjects.length > 0 && studentRecord) {
          console.log(`Assigning subjects to student ${studentRecord.id}`)
          
          // Assign subjects to student
          for (const subject of subjects) {
            await supabaseAdmin
              .from('student_subjects')
              .insert({
                student_id: studentRecord.id,
                subject_id: subject.id
              })
          }

          // Add some demo marks
          for (const subject of subjects) {
            await supabaseAdmin
              .from('marks')
              .insert({
                student_id: studentRecord.id,
                subject_id: subject.id,
                marks: Math.floor(Math.random() * 40) + 60,
                exam_type: 'midterm'
              })
          }

          // Add some demo attendance
          const dates = ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']
          for (const subject of subjects) {
            for (const date of dates) {
              await supabaseAdmin
                .from('attendance')
                .insert({
                  student_id: studentRecord.id,
                  subject_id: subject.id,
                  date: date,
                  status: Math.random() > 0.2 ? 'present' : 'absent'
                })
            }
          }
        }
      }
    }

    console.log('Demo setup completed successfully')

    return new Response(
      JSON.stringify({ 
        message: 'Demo users created successfully',
        credentials: {
          staff: {
            email: 'admin@gmail.com',
            password: 'Admin@123'
          },
          students: {
            password: 'Changeme@123',
            accounts: students.map(s => ({ 
              email: s.email, 
              regNumber: s.regNumber,
              name: s.name 
            }))
          }
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in setup-demo-users:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more information'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
