// API Configuration using environment variables
const getApiBaseUrl = (): string => {
  // In production build, always use VITE_API_BASE_URL_PRODUCTION if available
  if (import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL_PRODUCTION) {
    return import.meta.env.VITE_API_BASE_URL_PRODUCTION.replace(/\/$/, '');
  }
  
  // In development, use VITE_API_BASE_URL
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }

  // Fallback to dynamic hostname detection (last resort)
  const hostname = window.location.hostname;
  const productionUrl = "https://api.nihaoeducation.io.vn"; // Default production URL
  const developmentUrl = "http://localhost:3212";
  
  return hostname === "localhost" || hostname === "127.0.0.1"
    ? developmentUrl
    : productionUrl;
};

export const API_BASE_URL = getApiBaseUrl();
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
  },

  // Classes endpoints
  CLASSES: {
    BASE: "/classes",
    BY_ID: (id: string) => `/classes/${id}`,
    COURSES: (id: string) => `/classes/${id}/courses`,
  },

  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Courses endpoints
  COURSES: {
    BASE: "/courses",
    BY_ID: (id: string) => `/courses/${id}`,
    MY_COURSES: "/courses/my-courses",
    ENROLLED: "/courses/enrolled",
  },

  // Lessons endpoints
  LESSONS: {
    BASE: "/lessons",
    BY_COURSE: (courseId: string) => `/lessons/course/${courseId}`,
    BY_ID: (id: string) => `/lessons/${id}`,
  },
  // Quizzes endpoints
  QUIZZES: {
    BASE: "/quizzes",
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
    MY_SUBMISSIONS: "/quizzes/my-submissions",
  },

  // Practices endpoints
  PRACTICES: {
    BASE: '/practices',
    BY_ID: (id: string) => `/practices/${id}`,
    START: (id: string) => `/practices/${id}/start`,
    SUBMIT: (id: string) => `/practices/${id}/submit`,
    ATTEMPTS: (id: string) => `/practices/${id}/attempts`,
    MY_ATTEMPTS: '/practices/my-attempts',
    STATS: '/practices/stats',
  },

  // Schedule endpoints
  SCHEDULE: {
    BASE: "/schedule",
    WEEKLY: "/schedule/weekly",
    TODAY: "/schedule/today",
    UPCOMING: "/schedule/upcoming",
    ACTIVE: "/schedule/active",
  },
};
