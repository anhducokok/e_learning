// API Configuration using environment variables
const getApiBaseUrl = (): string => {
  let baseUrl = '';
  // In production build, always use VITE_API_BASE_URL_PRODUCTION if available
  if (import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL_PRODUCTION) {
    baseUrl = import.meta.env.VITE_API_BASE_URL_PRODUCTION.replace(/\/$/, '');
  } else if (import.meta.env.VITE_API_BASE_URL) {
    // In development, use VITE_API_BASE_URL
    baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  } else {
    // Fallback to dynamic hostname detection (last resort)
    const hostname = window.location.hostname;
    const productionUrl = "https://api.nihaoeducation.io.vn"; // Default production URL
    const developmentUrl = "http://localhost:3212";
    baseUrl = hostname === "localhost" || hostname === "127.0.0.1"
      ? developmentUrl
      : productionUrl;
  }
  // Log the base URL for debugging
  // eslint-disable-next-line no-console
  return baseUrl;
};

export const API_BASE_URL = getApiBaseUrl();
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
  },

  // Classes endpoints
  CLASSES: {
    BASE: "/api/classes",
    BY_ID: (id: string) => `/api/classes/${id}`,
    COURSES: (id: string) => `/classes/${id}/courses`,
  },

  USERS: {
    BASE: "/api/users",
    BY_ID: (id: string) => `/api/users/${id}`,
    PROFILE: "/api/users/profile",
    UPDATE_PROFILE: "/api/users/profile", 
    ENROLLED_IN_MY_COURSES: "/api/users/enrolled-in-my-courses",
    // Admin endpoints for user management
    ADMIN_ALL: "/api/users/admin/all",
    ADMIN_TEACHERS: "/api/users/admin/teachers",
    ADMIN_STUDENTS: "/api/users/admin/students",
    CHANGE_ROLE: (id: string) => `/api/users/admin/${id}/role`,
    UPDATE_INFO: (id: string) => `/api/users/${id}`,
    ADD_TEACHER: "/api/users/admin/add-teacher",
    // Enrollment management endpoints
    ADMIN_USER_ENROLLMENTS: (userId: string) => `/api/users/admin/${userId}/enrollments`,
    ADMIN_UPDATE_ENROLLMENT_DATE: (userId: string, courseId: string) => `/api/users/admin/${userId}/enrollments/${courseId}/date`,
  },

  // Courses endpoints
  COURSES: {
    BASE: "/api/courses",
    BY_ID: (id: string) => `/api/courses/${id}`,
    MY_COURSES: "/api/courses/my-courses",
    ENROLLED: "/api/courses/enrolled",
    // Teacher-specific endpoints
    BY_TEACHER: (teacherId: string) => `/api/courses/teacher/${teacherId}`,
    TEACHER_STATISTICS: (teacherId: string) => `/api/courses/teacher/${teacherId}/statistics`,
    MY_STATISTICS: "/api/courses/my-statistics",
    // Admin endpoints
    CREATE_WITH_TEACHER: "/api/courses/admin/create-with-teacher",
    ASSIGN_TEACHER: (courseId: string) => `/api/courses/${courseId}/assign-teacher`,
    // Thumbnail endpoints (URL-based)
    UPDATE_THUMBNAIL: (courseId: string) => `/api/courses/${courseId}/thumbnail`,
    DELETE_THUMBNAIL: (courseId: string) => `/api/courses/${courseId}/thumbnail`,
  },
  // Lessons endpoints
  LESSONS: {
    BASE: "/api/lessons",
    BY_COURSE: (courseId: string) => `/api/lessons/course/${courseId}`,
    BY_ID: (id: string) => `/api/lessons/${id}`,
    REORDER: (courseId: string) => `/api/lessons/course/${courseId}/reorder`,
  },
  // Quizzes endpoints
  QUIZZES: {
    BASE: "/quizzes",
    BY_COURSE: (courseId: string) => `/api/quizzes/course/${courseId}`,
    BY_LESSON: (lessonId: string) => `/api/quizzes/lesson/${lessonId}`,
    BY_ID: (id: string) => `/api/quizzes/${id}`,
    SUBMIT: (id: string) => `/api/quizzes/${id}/submit`,
    SUBMIT_FINAL: (id: string) => `/api/quizzes/${id}/submit-final`,
    START: (id: string) => `/api/quizzes/${id}/start`,
    SAVE_DRAFT: (id: string) => `/api/quizzes/${id}/save-draft`,
    GET_DRAFT: (id: string) => `/api/quizzes/${id}/draft`,
    SUBMISSION: (id: string) => `/api/quizzes/${id}/submission`,
    STATISTICS: (id: string) => `/api/quizzes/${id}/statistics`,
    MY_SUBMISSIONS: "/api/quizzes/my-submissions",
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

  // Payment endpoints
  PAYMENTS: {
    PENDING: "/api/checkout/pending",
    // If you have an endpoint for all payments, update the path accordingly
    ALL: "/api/checkout",
    APPROVE: (requestId: string) => `/api/checkout/${requestId}/approve`,
    REJECT: (requestId: string) => `/api/checkout/${requestId}/reject`,
  },
};