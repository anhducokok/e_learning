// Debug CourseDetailManagePage Data Fetching
console.log('🔍 Debug CourseDetailManagePage Data Fetching...');

async function debugCourseDetailPage() {
  try {
    // Step 1: Login as teacher
    console.log('👤 Logging in as teacher...');
    const loginResponse = await fetch('http://localhost:3212/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@example.com',
        password: '11042004'
      })
    });
    
    const loginData = await loginResponse.json();
    if (!loginData.success) throw new Error('Login failed');
    
    const token = loginData.data.access_token;
    const teacherId = loginData.data.user.id;
    console.log('✅ Logged in as teacher:', teacherId);
    
    // Step 2: Get courses and find one with content
    console.log('\n📚 Finding course with lessons and quizzes...');
    const coursesResponse = await fetch('http://localhost:3212/courses', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const coursesData = await coursesResponse.json();
    const courses = coursesData.data || [];
    
    // Find course owned by this teacher that has content
    let targetCourse = null;
    for (const course of courses) {
      if (course.teacherID === teacherId) {
        // Check if this course has lessons or quizzes
        const [lessonsResp, quizzesResp] = await Promise.all([
          fetch(`http://localhost:3212/lessons/course/${course.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:3212/quizzes/course/${course.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const lessonsData = await lessonsResp.json();
        const quizzesData = await quizzesResp.json();
        
        const lessonsCount = lessonsData.data?.length || 0;
        const quizzesCount = quizzesData.data?.length || 0;
        
        console.log(`Course "${course.title}": ${lessonsCount} lessons, ${quizzesCount} quizzes`);
        
        if (lessonsCount > 0 || quizzesCount > 0) {
          targetCourse = course;
          break;
        }
      }
    }
    
    if (!targetCourse) {
      console.log('⚠️ No courses owned by teacher have content. Creating test course...');
      
      // Create a test course
      const createCourseResp = await fetch('http://localhost:3212/courses', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Course for Management',
          description: 'A test course to debug CourseDetailManagePage',
          level: 'BEGINNER',
          duration: '2 hours',
          price: 0
        })
      });
      
      const newCourseData = await createCourseResp.json();
      if (!newCourseData.success) throw new Error('Failed to create test course');
      
      targetCourse = newCourseData.data;
      console.log('✅ Created test course:', targetCourse.id);
      
      // Add a test lesson
      const createLessonResp = await fetch(`http://localhost:3212/lessons/course/${targetCourse.id}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Lesson',
          textContent: 'This is a test lesson for debugging',
          orderIndex: 1,
          videoUrl: 'https://example.com/video.mp4'
        })
      });
      
      const lessonData = await createLessonResp.json();
      console.log('✅ Created test lesson:', lessonData.success ? 'Success' : 'Failed');
    }
    
    // Step 3: Test the CourseDetailManagePage scenario
    console.log(`\n🎯 Testing CourseDetailManagePage for course: ${targetCourse.title}`);
    console.log(`Course ID: ${targetCourse.id}`);
    console.log(`URL: http://localhost:5176/teacher/courses/${targetCourse.id}`);
    
    // Simulate the exact API calls that CourseDetailManagePage makes
    console.log('\n🔍 Simulating CourseDetailManagePage API calls...');
    
    const [courseResp, lessonsResp, quizzesResp] = await Promise.all([
      fetch(`http://localhost:3212/courses/${targetCourse.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`http://localhost:3212/lessons/course/${targetCourse.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`http://localhost:3212/quizzes/course/${targetCourse.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);
    
    const courseData = await courseResp.json();
    const lessonsData = await lessonsResp.json();
    const quizzesData = await quizzesResp.json();
    
    console.log('\n📊 API RESPONSES:');
    console.log('Course:', {
      success: courseData.success,
      hasData: !!courseData.data,
      title: courseData.data?.title
    });
    console.log('Lessons:', {
      success: lessonsData.success,
      statusCode: lessonsData.statusCode,
      dataLength: lessonsData.data?.length || 0,
      isArray: Array.isArray(lessonsData.data)
    });
    console.log('Quizzes:', {
      success: quizzesData.success,
      statusCode: quizzesData.statusCode,
      dataLength: quizzesData.data?.length || 0,
      isArray: Array.isArray(quizzesData.data)
    });
    
    // Step 4: Check if the issue is with API processing
    console.log('\n🔧 Processing data like CourseDetailManagePage...');
    const processedLessons = lessonsData.data || [];
    const processedQuizzes = quizzesData.data || [];
    
    console.log('Processed lessons count:', processedLessons.length);
    console.log('Processed quizzes count:', processedQuizzes.length);
    
    if (processedLessons.length > 0) {
      console.log('First lesson sample:', {
        id: processedLessons[0].id,
        title: processedLessons[0].title,
        hasContent: !!processedLessons[0].textContent || !!processedLessons[0].content
      });
    }
    
    // Step 5: Provide URL for manual testing
    console.log('\n🔗 TEST URL FOR MANUAL VERIFICATION:');
    console.log(`http://localhost:5176/teacher/courses/${targetCourse.id}`);
    console.log('\nPlease open this URL in the browser to test CourseDetailManagePage');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

// Run the debug
debugCourseDetailPage();
