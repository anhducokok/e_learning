/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_BASE_URL_PRODUCTION: string
  
  // Socket Configuration
  readonly VITE_SOCKET_URL: string
  readonly VITE_SOCKET_URL_PRODUCTION: string
  readonly VITE_SOCKET_PATH: string
  
  // API Endpoints
  readonly VITE_CHAT_HISTORY_ENDPOINT: string
  readonly VITE_CHECKOUT_ENDPOINT: string
  readonly VITE_HEALTH_CHECK_ENDPOINT: string
  
  // External URLs
  readonly VITE_YOUTUBE_EMBED_BASE: string
  readonly VITE_GOOGLE_DRIVE_EMBED_BASE: string
  readonly VITE_GOOGLE_DRIVE_PREVIEW_SUFFIX: string
  readonly VITE_FACEBOOK_URL: string
  
  // Default Images
  readonly VITE_DEFAULT_COURSE_IMAGE: string
  readonly VITE_DEFAULT_PROFILE_BG: string
  readonly VITE_DEFAULT_LEARNING_IMAGE: string
  readonly VITE_DEFAULT_EXAM_IMAGE: string
  readonly VITE_DEFAULT_BASIC_CHINESE_IMAGE: string
  
  // Authentication
  readonly VITE_JWT_SECRET: string
  readonly VITE_AUTH_TOKEN_EXPIRY: string
  
  // Database
  readonly VITE_DATABASE_URL: string
  readonly VITE_REDIS_URL: string
  
  // External APIs
  readonly VITE_YOUTUBE_API_KEY: string
  readonly VITE_GOOGLE_DRIVE_API_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_FACEBOOK_PIXEL_ID: string
  
  // File Upload
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  
  // Payment
  readonly VITE_PAYMENT_GATEWAY_URL: string
  readonly VITE_PAYMENT_API_KEY: string
  readonly VITE_PAYMENT_WEBHOOK_SECRET: string
  
  // Email
  readonly VITE_SMTP_HOST: string
  readonly VITE_SMTP_PORT: string
  readonly VITE_SMTP_USER: string
  readonly VITE_SMTP_PASS: string
  readonly VITE_EMAIL_FROM: string
  
  // Security
  readonly VITE_CORS_ORIGIN: string
  readonly VITE_SESSION_SECRET: string
  
  // Feature Flags
  readonly VITE_ENABLE_CHAT: string
  readonly VITE_ENABLE_PAYMENTS: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_SOCIAL_LOGIN: string
  
  // Development
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_MOCK_DATA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
