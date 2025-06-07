// Frontend API Test - Teacher Course Access
console.log('🔍 Testing Teacher Course Access...');

// Function to test teacher login and course data access
async function testTeacherCourseAccess() {
  try {
    // Step 1: Login as teacher
    console.log('👤 Logging in as teacher...');
    const loginResponse = await fetch('http://localhost:3212/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'teacher@example.com',
        password: '11042004'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData);
    
    if (!loginData.success) {
      throw new Error('Login failed');
    }
    
    const token = loginData.data.access_token;
    const teacherId = loginData.data.user.id;
    console.log('🔑 Token:', token ? 'Received' : 'Missing');
    console.log('👤 Teacher ID:', teacherId);
    
    // Step 2: Get all courses
    console.log('\n📚 Fetching all courses...');
    const coursesResponse = await fetch('http://localhost:3212/courses', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const coursesData = await coursesResponse.json();
    console.log('📚 Courses response:', coursesData);
    
    if (!coursesData.success) {
      throw new Error('Failed to fetch courses');
    }
    
    const courses = coursesData.data || [];
    console.log('📚 Total courses:', courses.length);
    
    // Find courses owned by this teacher
    const ownedCourses = courses.filter(course => course.teacherID === teacherId);
    console.log('🎯 Courses owned by teacher:', ownedCourses.length);
    
    if (ownedCourses.length === 0) {
      console.log('⚠️ No courses owned by this teacher');
      return;
    }
    
    // Step 3: Test lessons and quizzes for the first owned course
    const testCourse = ownedCourses[0];
    console.log(`\n🔍 Testing course: "${testCourse.title}" (${testCourse.id})`);
    
    // Test lessons
    console.log('📖 Fetching lessons...');
    const lessonsResponse = await fetch(`http://localhost:3212/lessons/course/${testCourse.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const lessonsData = await lessonsResponse.json();
    console.log('📖 Lessons response:', lessonsData);
    console.log('📖 Lessons count:', lessonsData.data?.length || 0);
    
    // Test quizzes
    console.log('🎯 Fetching quizzes...');
    const quizzesResponse = await fetch(`http://localhost:3212/quizzes/course/${testCourse.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const quizzesData = await quizzesResponse.json();
    console.log('🎯 Quizzes response:', quizzesData);
    console.log('🎯 Quizzes count:', quizzesData.data?.length || 0);
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`Course: ${testCourse.title}`);
    console.log(`Lessons: ${lessonsData.data?.length || 0}`);
    console.log(`Quizzes: ${quizzesData.data?.length || 0}`);
    console.log(`Teacher can create lessons: ${lessonsData.success ? 'Yes' : 'No'}`);
    console.log(`Teacher can create quizzes: ${quizzesData.success ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testTeacherCourseAccess();
