// This is a patch for the LearningSessionPage to correctly handle API responses
// This is a patch for the LearningSessionPage to correctly handle API responses
import type { Lesson, Quiz } from '../types/api';

// Helper function to process API responses that may be in {success: true, data: [...]} format
export const processApiResponse = <T>(response: any): T[] => {
  if (!response) return [];
  
  // Case 1: Response is already the array we want
  if (Array.isArray(response)) {
    return response;
  }
  
  // Case 2: Response is {success: true, data: [...]} format
  if (response.success && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Case 3: Response is in some other format but has a data property that's an array
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // If we can't find an array, return empty
  console.warn('Unexpected API response format:', response);
  return [];
};

// Helper function to process lesson data
export const processLessons = (lessonsData: any): Lesson[] => {
  const lessons = processApiResponse<Lesson>(lessonsData);
  
  // Sort lessons by orderIndex or order
  return lessons.sort((a, b) => {
    const orderA = a.orderIndex || a.order || 0;
    const orderB = b.orderIndex || b.order || 0;
    return orderA - orderB;
  });
};

// Helper function to process quiz data
export const processQuizzes = (quizzesData: any): Quiz[] => {
  return processApiResponse<Quiz>(quizzesData);
};

// Function to verify video URLs in lessons
export const checkLessonVideos = (lessons: Lesson[]): void => {
  lessons.forEach((lesson, index) => {
    console.log(`📹 Lesson ${index + 1} - "${lesson.title}":`);
    console.log(`- Video URL: ${lesson.videoUrl || 'None'}`);
    if (lesson.videoUrl) {
      try {
        const url = new URL(lesson.videoUrl);
        console.log(`- Video URL protocol: ${url.protocol}`);
        console.log(`- Video URL domain: ${url.hostname}`);
      } catch (e) {
        console.warn(`- Invalid URL format for lesson ${index + 1}`);
      }
    }
  });
};
