// Environment and Configuration Constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3212',
  PRODUCTION_URL: import.meta.env.VITE_API_BASE_URL_PRODUCTION || 'https://api.nihaoeducation.io.vn',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Socket Configuration
export const SOCKET_CONFIG = {
  URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3212',
  PRODUCTION_URL: import.meta.env.VITE_SOCKET_URL_PRODUCTION || 'https://api.nihaoeducation.io.vn',
  PATH: import.meta.env.VITE_SOCKET_PATH || '/socket.io',
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
  WITH_CREDENTIALS: true,
} as const;

// API Endpoints
export const ENDPOINTS = {
  CHAT_HISTORY: import.meta.env.VITE_CHAT_HISTORY_ENDPOINT || '/chat/history',
  CHECKOUT: import.meta.env.VITE_CHECKOUT_ENDPOINT || '/api/checkout',
  HEALTH_CHECK: import.meta.env.VITE_HEALTH_CHECK_ENDPOINT || '/health',
} as const;

// External URLs
export const EXTERNAL_URLS = {
  YOUTUBE_EMBED_BASE: import.meta.env.VITE_YOUTUBE_EMBED_BASE || 'https://www.youtube.com/embed/',
  GOOGLE_DRIVE_EMBED_BASE: import.meta.env.VITE_GOOGLE_DRIVE_EMBED_BASE || 'https://drive.google.com/file/d/',
  GOOGLE_DRIVE_PREVIEW_SUFFIX: import.meta.env.VITE_GOOGLE_DRIVE_PREVIEW_SUFFIX || '/preview',
  FACEBOOK: import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/profile.php?id=61577114962949',
} as const;

// Default Images
export const DEFAULT_IMAGES = {
  COURSE: import.meta.env.VITE_DEFAULT_COURSE_IMAGE || 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXJyb3J8ZW58MHx8MHx8fDA%3D',
  PROFILE_BG: import.meta.env.VITE_DEFAULT_PROFILE_BG || 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
  LEARNING: import.meta.env.VITE_DEFAULT_LEARNING_IMAGE || 'https://images.unsplash.com/photo-1695702273667-bbd3af94d45f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QnVzc2luZXNzJTIw',
  EXAM: import.meta.env.VITE_DEFAULT_EXAM_IMAGE || 'https://plus.unsplash.com/premium_photo-1661411124435-5de83a96be24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpbmVzZSUyMGV4YW18ZW58MHx8MHx8fDA%3D',
  BASIC_CHINESE: import.meta.env.VITE_DEFAULT_BASIC_CHINESE_IMAGE || 'https://plus.unsplash.com/premium_photo-1661600619578-2d9e2593bbfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFzaWMlMjBjaGluZXNlfGVufDB8fDB8fHww',
} as const;

// Helper functions
export const getSocketUrl = (): string => {
  if (import.meta.env.PROD && SOCKET_CONFIG.PRODUCTION_URL) {
    return SOCKET_CONFIG.PRODUCTION_URL;
  }
  return SOCKET_CONFIG.URL;
};

export const getApiUrl = (): string => {
  if (import.meta.env.PROD && API_CONFIG.PRODUCTION_URL) {
    return API_CONFIG.PRODUCTION_URL;
  }
  return API_CONFIG.BASE_URL;
};

// YouTube URL helper
export const convertYoutubeUrlToEmbed = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? `${EXTERNAL_URLS.YOUTUBE_EMBED_BASE}${match[1]}` : url;
};

// Google Drive URL helper
export const convertGoogleDriveUrlToEmbed = (url: string): string => {
  // Nhận diện link dạng: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const match = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (match) {
    return `${EXTERNAL_URLS.GOOGLE_DRIVE_EMBED_BASE}${match[1]}${EXTERNAL_URLS.GOOGLE_DRIVE_PREVIEW_SUFFIX}`;
  }
  // Nhận diện link dạng: https://drive.google.com/open?id=FILE_ID
  const match2 = url.match(/[?&]id=([\w-]+)/);
  if (match2) {
    return `${EXTERNAL_URLS.GOOGLE_DRIVE_EMBED_BASE}${match2[1]}${EXTERNAL_URLS.GOOGLE_DRIVE_PREVIEW_SUFFIX}`;
  }
  return url;
};
