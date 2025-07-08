// Test file for admin enrollment management API endpoints
import { userService } from './services/userService';

export const testAdminEnrollmentAPI = async () => {
  console.log('🧪 Testing Admin Enrollment Management API...');
  
  try {
    // Test 1: Get all students
    console.log('👨‍🎓 Testing getStudentsForAdmin...');
    const students = await userService.getStudentsForAdmin();
    console.log('✅ Students:', students);
    
    if (students.length > 0) {
      const firstStudent = students[0];
      
      // Test 2: Get user enrollments
      console.log(`📋 Testing getUserEnrollments for student: ${firstStudent.name}...`);
      const userEnrollments = await userService.getUserEnrollments(firstStudent.id);
      console.log('✅ User enrollments:', userEnrollments);
      
      if (userEnrollments.length > 0) {
        const firstEnrollment = userEnrollments[0];
        console.log(`📅 First enrollment: Course ${firstEnrollment.courseId} at ${firstEnrollment.enrolledAt}`);
        
        // Test 3: Update enrollment date (commented out for safety)
        // console.log('🔄 Testing updateEnrollmentDate...');
        // const newDate = new Date().toISOString();
        // await userService.updateEnrollmentDate(firstStudent.id, firstEnrollment.courseId, newDate);
        // console.log('✅ Enrollment date updated successfully');
      }
    }
    
    console.log('🎉 All admin enrollment API tests completed successfully!');
    
    return {
      students,
      totalStudents: students.length,
      hasTestData: students.length > 0
    };
    
  } catch (error) {
    console.error('❌ Error testing admin enrollment API:', error);
    throw error;
  }
};

// Test specific course enrollments
export const testCourseEnrollments = async (courseId: string) => {
  console.log(`🎯 Testing Course Enrollments for course: ${courseId}...`);
  
  try {
    const enrollments = await userService.getCourseEnrollments(courseId);
    console.log('✅ Course enrollments:', enrollments);
    
    return {
      courseId,
      enrollmentCount: enrollments.length,
      enrollments
    };
    
  } catch (error) {
    console.error(`❌ Error testing course ${courseId} enrollments:`, error);
    throw error;
  }
};

// Usage examples in development
if (import.meta.env.DEV) {
  // Uncomment to run tests automatically in development
  // testAdminEnrollmentAPI().catch(console.error);
  
  // Test specific course (replace with actual course ID)
  // testCourseEnrollments('your-course-id-here').catch(console.error);
}
