# Environment Variables Configuration Guide

## Tổng quan
File này chứa hướng dẫn cấu hình các biến môi trường cho ứng dụng E-learning. Tất cả các biến môi trường được lưu trong file `.env` và có template mẫu trong `.env.example`.

## Cách sử dụng

1. **Sao chép file template:**
   ```bash
   cp .env.example .env
   ```

2. **Cập nhật các giá trị trong file `.env`**

3. **Khởi động lại ứng dụng để áp dụng thay đổi**

## Danh sách biến môi trường

### 🌐 API Configuration
| Biến | Mô tả | Ví dụ | Bắt buộc |
|------|--------|-------|----------|
| `VITE_API_BASE_URL` | URL API cho môi trường development | `http://localhost:3212` | ✅ |
| `VITE_API_BASE_URL_PRODUCTION` | URL API cho môi trường production | `http://192.168.0.101:3212` | ✅ |

### 🔐 Authentication
| Biến | Mô tả | Ví dụ | Bắt buộc |
|------|--------|-------|----------|
| `VITE_JWT_SECRET` | Secret key để mã hóa JWT token | `your-super-secret-key-123` | ✅ |
| `VITE_AUTH_TOKEN_EXPIRY` | Thời gian hết hạn token | `24h`, `7d`, `30d` | ❌ |

### 🗄️ Database
| Biến | Mô tả | Ví dụ | Bắt buộc |
|------|--------|-------|----------|
| `VITE_DATABASE_URL` | Connection string database | `postgresql://user:pass@localhost:5432/db` | 🔧 |
| `VITE_REDIS_URL` | Redis connection string | `redis://localhost:6379` | ❌ |

### 🔗 External APIs
| Biến | Mô tả | Ví dụ | Bắt buộc |
|------|--------|-------|----------|
| `VITE_YOUTUBE_API_KEY` | API key của YouTube | `AIzaSyDxxxxxxxxxxxxxxxxxxxxx` | ❌ |
| `VITE_GOOGLE_DRIVE_API_KEY` | API key của Google Drive | `AIzaSyDxxxxxxxxxxxxxxxxxxxxx` | ❌ |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789-abc.googleusercontent.com` | ❌ |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics Tracking ID | `GA_MEASUREMENT_ID` | ❌ |
| `VITE_FACEBOOK_PIXEL_ID` | Facebook Pixel ID | `1234567890123456` | ❌ |

### 📁 File Upload
| Biến | Mô tả | Ví dụ | Bắt buộc |
|------|--------|-------|----------|
| `VITE_MAX_FILE_SIZE` | Kích thước file tối đa | `50MB`, `100MB` | ❌ |
| `VITE_ALLOWED_FILE_TYPES` | Các định dạng file được phép | `jpg,png,pdf,mp4` | ❌ |

### 💳 Payment
| Biến | Mô tả | Ví dụ | Bắt buộc |
|------|--------|-------|----------|
| `VITE_PAYMENT_GATEWAY_URL` | URL của payment gateway | `https://api.payment.com` | ❌ |
| `VITE_PAYMENT_API_KEY` | API key của payment service | `pk_test_xxxxxxxxxx` | ❌ |
| `VITE_PAYMENT_WEBHOOK_SECRET` | Secret key cho webhook | `whsec_xxxxxxxxxx` | ❌ |

### 📧 Email Configuration
| Biến | Mô tả | Ví dụ | Bắt buộc |
|------|--------|-------|----------|
| `VITE_SMTP_HOST` | SMTP server host | `smtp.gmail.com` | ❌ |
| `VITE_SMTP_PORT` | SMTP server port | `587` | ❌ |
| `VITE_SMTP_USER` | SMTP username | `your-email@gmail.com` | ❌ |
| `VITE_SMTP_PASS` | SMTP password/app password | `your-app-password` | ❌ |
| `VITE_EMAIL_FROM` | Địa chỉ email gửi | `noreply@yourdomain.com` | ❌ |

### 💬 Chat/Socket
| Biến | Mô tả | Ví dụ | Bắt buộc |
|------|--------|-------|----------|
| `VITE_SOCKET_URL` | Socket.IO server URL | `http://localhost:3212` | ❌ |
| `VITE_SOCKET_PATH` | Socket.IO path | `/socket.io` | ❌ |

### 🔒 Security
| Biến | Mô tả | Ví dụ | Bắt buộc |
|------|--------|-------|----------|
| `VITE_CORS_ORIGIN` | CORS allowed origins | `http://localhost:5173` | ❌ |
| `VITE_SESSION_SECRET` | Session secret key | `session-secret-key-123` | ❌ |

### 🚀 Feature Flags
| Biến | Mô tả | Giá trị | Bắt buộc |
|------|--------|---------|----------|
| `VITE_ENABLE_CHAT` | Bật/tắt tính năng chat | `true/false` | ❌ |
| `VITE_ENABLE_PAYMENTS` | Bật/tắt tính năng thanh toán | `true/false` | ❌ |
| `VITE_ENABLE_ANALYTICS` | Bật/tắt analytics | `true/false` | ❌ |
| `VITE_ENABLE_SOCIAL_LOGIN` | Bật/tắt đăng nhập social | `true/false` | ❌ |

### 🔧 Development
| Biến | Mô tả | Giá trị | Bắt buộc |
|------|--------|---------|----------|
| `VITE_DEBUG_MODE` | Chế độ debug | `true/false` | ❌ |
| `VITE_LOG_LEVEL` | Mức độ log | `debug/info/warn/error` | ❌ |
| `VITE_MOCK_DATA` | Sử dụng dữ liệu giả | `true/false` | ❌ |

## Ký hiệu
- ✅ **Bắt buộc**: Biến này cần phải được cấu hình
- ❌ **Tùy chọn**: Biến này có thể bỏ trống, sẽ sử dụng giá trị mặc định
- 🔧 **Backend**: Biến này chỉ dành cho tham khảo backend

## Lưu ý quan trọng

1. **Bảo mật**: 
   - Không bao giờ commit file `.env` vào Git
   - File `.env` đã được thêm vào `.gitignore`
   - Chỉ commit file `.env.example`

2. **Prefix VITE_**:
   - Chỉ các biến có prefix `VITE_` mới được expose ra frontend
   - Các biến khác chỉ dành cho backend

3. **Khởi động lại**:
   - Sau khi thay đổi biến môi trường, cần khởi động lại dev server

4. **Production**:
   - Cấu hình biến môi trường trên server production
   - Sử dụng file `.env.production` nếu cần

## Hướng dẫn thiết lập từng bước

### 1. API Backend
```env
VITE_API_BASE_URL=http://localhost:3212
VITE_API_BASE_URL_PRODUCTION=http://your-server-ip:3212
```

### 2. Authentication
```env
VITE_JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex
VITE_AUTH_TOKEN_EXPIRY=24h
```

### 3. Google APIs (cho video YouTube và Google Drive)
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Bật YouTube Data API v3 và Google Drive API
4. Tạo API key và Client ID
```env
VITE_YOUTUBE_API_KEY=AIzaSyD_your_youtube_api_key_here
VITE_GOOGLE_DRIVE_API_KEY=AIzaSyD_your_drive_api_key_here
VITE_GOOGLE_CLIENT_ID=123456789-abcdef.googleusercontent.com
```

### 4. Email (cho thông báo)
```env
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASS=your-16-character-app-password
VITE_EMAIL_FROM=noreply@yourdomain.com
```

### 5. Payment Gateway (nếu có)
```env
VITE_PAYMENT_GATEWAY_URL=https://api.stripe.com
VITE_PAYMENT_API_KEY=pk_test_your_stripe_key_here
VITE_PAYMENT_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Troubleshooting

### Lỗi thường gặp:

1. **API không kết nối được**:
   - Kiểm tra `VITE_API_BASE_URL` có đúng không
   - Đảm bảo backend server đang chạy

2. **Video YouTube không hiển thị**:
   - Kiểm tra `VITE_YOUTUBE_API_KEY`
   - Đảm bảo API key có quyền truy cập YouTube Data API

3. **Upload file không hoạt động**:
   - Kiểm tra `VITE_MAX_FILE_SIZE` và `VITE_ALLOWED_FILE_TYPES`
   - Đảm bảo backend hỗ trợ upload file

4. **Chat không hoạt động**:
   - Kiểm tra `VITE_SOCKET_URL` và `VITE_ENABLE_CHAT`
   - Đảm bảo Socket.IO server đang chạy

5. **Authentication lỗi**:
   - Kiểm tra `VITE_JWT_SECRET` trên frontend và backend có khớp không
   - Đảm bảo token chưa hết hạn

## Liên hệ hỗ trợ
Nếu gặp vấn đề trong quá trình cấu hình, vui lòng liên hệ team phát triển.
