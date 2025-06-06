import { lessonService } from './services/lessonService';
import { courseService } from './services/courseService';

// Quick test to verify API client returns proper data format
async function testApiFix() {
  try {
    console.log('Testing API client fix...');
    
    // Test getting courses first
    const courses = await courseService.getAllCourses();
    console.log('Courses response type:', typeof courses);
    console.log('Is courses an array?', Array.isArray(courses));
    console.log('Courses data:', courses);
    
    if (courses.length > 0) {
      const courseId = courses[0].id;
      console.log(`Testing lessons for course ${courseId}...`);
      
      // Test getting lessons
      const lessons = await lessonService.getLessonsByCourse(courseId);
      console.log('Lessons response type:', typeof lessons);
      console.log('Is lessons an array?', Array.isArray(lessons));
      console.log('Lessons data:', lessons);
      
      // Test if sort method exists
      if (Array.isArray(lessons)) {
        console.log('✅ Lessons is an array, sort method should work!');
        const sorted = lessons.sort((a, b) => a.order - b.order);
        console.log('Sorted lessons:', sorted);
      } else {
        console.log('❌ Lessons is not an array, this will cause the sort error');
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Export for manual testing
(window as any).testApiFix = testApiFix;

export { testApiFix };
