export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3212').replace(/\/$/, '');

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  
  // Classes endpoints
  CLASSES: {
    BASE: '/classes',
    BY_ID: (id: string) => `/classes/${id}`,
    COURSES: (id: string) => `/classes/${id}/courses`,
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
    BY_ID: (id: string) => `/quizzes/${id}`,
    SUBMIT: (id: string) => `/quizzes/${id}/submit`,
    SUBMIT_FINAL: (id: string) => `/quizzes/${id}/submit-final`,
    START: (id: string) => `/quizzes/${id}/start`,
    SAVE_DRAFT: (id: string) => `/quizzes/${id}/save-draft`,
    GET_DRAFT: (id: string) => `/quizzes/${id}/draft`,
    SUBMISSION: (id: string) => `/quizzes/${id}/submission`,
    STATISTICS: (id: string) => `/quizzes/${id}/statistics`,
    MY_SUBMISSIONS: '/quizzes/my-submissions',
  },

  // Schedule endpoints
  SCHEDULE: {
    BASE: '/schedule',
    WEEKLY: '/schedule/weekly',
    TODAY: '/schedule/today',
    UPCOMING: '/schedule/upcoming',
    ACTIVE: '/schedule/active',
  },
};
