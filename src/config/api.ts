export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
    // Courses endpoints
  COURSES: {
    BASE: '/courses',
    BY_ID: (id: string) => `/courses/${id}`,
    MY_COURSES: '/courses/my-courses',
    ENROLLED: '/courses/enrolled',
  },
  
  // Lessons endpoints
  LESSONS: {
    BASE: '/lessons',
    BY_COURSE: (courseId: string) => `/lessons/course/${courseId}`,
    BY_ID: (id: string) => `/lessons/${id}`,
  },
  
  // Quizzes endpoints
  QUIZZES: {
    BASE: '/quizzes',
    BY_COURSE: (courseId: string) => `/quizzes/course/${courseId}`,
    BY_LESSON: (lessonId: string) => `/quizzes/lesson/${lessonId}`,
    SUBMIT: (id: string) => `/quizzes/${id}/submit`,
  },
};
