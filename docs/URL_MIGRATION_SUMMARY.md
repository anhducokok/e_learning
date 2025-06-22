# Migration Summary: Hardcoded URLs to Environment Variables

## 🎯 Mục tiêu
Di chuyển tất cả URL hardcode trong project vào file `.env` để dễ quản lý và deploy.

## ✅ Đã hoàn thành

### 1. **Cập nhật file `.env`**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3212
VITE_API_BASE_URL_PRODUCTION=https://api.nihaoeducation.io.vn

# Chat & Socket Configuration  
VITE_SOCKET_URL=http://localhost:3212
VITE_SOCKET_URL_PRODUCTION=https://api.nihaoeducation.io.vn

# API Endpoints
VITE_CHAT_HISTORY_ENDPOINT=/chat/history
VITE_CHECKOUT_ENDPOINT=/api/checkout
VITE_HEALTH_CHECK_ENDPOINT=/health

# External URLs
VITE_YOUTUBE_EMBED_BASE=https://www.youtube.com/embed/
VITE_GOOGLE_DRIVE_EMBED_BASE=https://drive.google.com/file/d/
VITE_GOOGLE_DRIVE_PREVIEW_SUFFIX=/preview

# Social Media Links
VITE_FACEBOOK_URL=https://www.facebook.com/profile.php?id=61577114962949

# Default Images & Placeholders
VITE_DEFAULT_COURSE_IMAGE=...
VITE_DEFAULT_PROFILE_BG=...
# ... và nhiều hơn
```

### 2. **Tạo file `src/config/constants.ts`**
- ✅ Centralized configuration management
- ✅ Helper functions cho URL conversion
- ✅ Type-safe constants với environment variables
- ✅ Production/Development URL detection

### 3. **Cập nhật các file sử dụng hardcoded URLs**

#### Socket.IO connections:
- ✅ `src/socket.ts`
- ✅ `src/contexts/ChatContext.tsx`  
- ✅ `src/contexts/Chat_Context.tsx`

#### API calls:
- ✅ `src/services/chatService.ts`
- ✅ `src/pages/student/CheckoutPage.tsx`
- ✅ `src/components/ChatWidgetSection.tsx`
- ✅ `src/components/ChatBox.tsx`

#### URL helpers:
- ✅ `src/pages/student/LearningSessionPage.tsx`

#### Image URLs:
- ✅ `src/pages/public/CourseListPage.tsx`

### 4. **Cập nhật TypeScript definitions**
- ✅ `src/vite-env.d.ts` - Added all new environment variables

### 5. **Cập nhật template files**
- ✅ `.env.example` - Sync with current `.env` structure

## 📋 **URLs đã được migrate:**

### API URLs:
- `http://localhost:3212` → `VITE_API_BASE_URL`
- `http://192.168.0.101:3212` → `VITE_API_BASE_URL_PRODUCTION`

### Socket URLs:
- `http://localhost:3212` → `VITE_SOCKET_URL`

### API Endpoints:
- `/chat/history` → `VITE_CHAT_HISTORY_ENDPOINT`  
- `/api/checkout` → `VITE_CHECKOUT_ENDPOINT`
- `/health` → `VITE_HEALTH_CHECK_ENDPOINT`

### External URLs:
- `https://www.youtube.com/embed/` → `VITE_YOUTUBE_EMBED_BASE`
- `https://drive.google.com/file/d/` → `VITE_GOOGLE_DRIVE_EMBED_BASE`
- `/preview` → `VITE_GOOGLE_DRIVE_PREVIEW_SUFFIX`

### Social Media:
- Facebook URL → `VITE_FACEBOOK_URL`

### Default Images:
- Course placeholder → `VITE_DEFAULT_COURSE_IMAGE`
- Profile background → `VITE_DEFAULT_PROFILE_BG`
- Learning images → `VITE_DEFAULT_LEARNING_IMAGE`
- Exam images → `VITE_DEFAULT_EXAM_IMAGE`
- Basic Chinese images → `VITE_DEFAULT_BASIC_CHINESE_IMAGE`

## 🔧 **Cách sử dụng sau khi migrate:**

### 1. Thay vì hardcode:
```typescript
// ❌ Trước
const socket = io('http://localhost:3212');

// ✅ Sau  
import { getSocketUrl } from '../config/constants';
const socket = io(getSocketUrl());
```

### 2. API calls:
```typescript
// ❌ Trước
fetch('http://localhost:3212/chat/history')

// ✅ Sau
import { getApiUrl, ENDPOINTS } from '../config/constants';
fetch(`${getApiUrl()}${ENDPOINTS.CHAT_HISTORY}`)
```

### 3. URL conversion:
```typescript
// ❌ Trước
const embedUrl = `https://www.youtube.com/embed/${videoId}`;

// ✅ Sau
import { convertYoutubeUrlToEmbed } from '../config/constants';
const embedUrl = convertYoutubeUrlToEmbed(originalUrl);
```

## 🚀 **Deployment Instructions:**

### 1. **Development:**
```bash
# File .env sử dụng localhost URLs
VITE_API_BASE_URL=http://localhost:3212
VITE_SOCKET_URL=http://localhost:3212
```

### 2. **Production:**
```bash
# Cập nhật domain thật trong .env
VITE_API_BASE_URL_PRODUCTION=https://api.yourdomain.com
VITE_SOCKET_URL_PRODUCTION=https://api.yourdomain.com

# Hoặc set environment variables trên server
export VITE_API_BASE_URL_PRODUCTION=https://api.yourdomain.com
```

### 3. **Build process sẽ tự động:**
- Detect production environment
- Sử dụng production URLs 
- Fallback to development URLs nếu cần

## 🔍 **Debug Instructions:**

### Khi gặp lỗi "Load failed":

1. **Check environment variables:**
```bash
# In browser console
console.log(import.meta.env);
```

2. **Verify API URLs:**
```javascript
// In browser console
import { getApiUrl } from './src/config/constants';
console.log('Current API URL:', getApiUrl());
```

3. **Test API connection:**
```javascript
// In browser console
fetch(getApiUrl() + '/health')
  .then(res => console.log('API Status:', res.status))
  .catch(err => console.error('API Error:', err));
```

## ⚠️ **Lưu ý quan trọng:**

1. **Thay thế URL thật:**
   - Cập nhật `VITE_API_BASE_URL_PRODUCTION` với domain thật
   - Đảm bảo backend server accessible từ internet

2. **CORS Configuration:**
   - Backend cần allow frontend domain
   - Check firewall và network settings

3. **SSL/HTTPS:**
   - Nếu frontend dùng HTTPS, backend cũng cần HTTPS
   - Hoặc config mixed content policy

4. **Environment Variables:**
   - Chỉ variables có prefix `VITE_` mới accessible ở frontend
   - Restart dev server sau khi thay đổi .env

## 🎉 **Kết quả:**
- ✅ Không còn hardcoded URLs
- ✅ Dễ deploy environments khác nhau  
- ✅ Centralized configuration management
- ✅ Type-safe environment variables
- ✅ Better maintainability
