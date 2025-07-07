# Admin User Management API Integration

## Overview
Hoàn thành tích hợp các API endpoint cho admin để quản lý người dùng trong hệ thống e-learning.

## API Endpoints Implemented

### 1. Get All Users for Admin
- **Endpoint**: `GET /api/users/admin/all`
- **Purpose**: Lấy tất cả người dùng trong hệ thống
- **Access**: Chỉ admin
- **Service Method**: `userService.getAllUsersForAdmin()`

### 2. Get Teachers for Admin
- **Endpoint**: `GET /api/users/admin/teachers`
- **Purpose**: Lấy danh sách giáo viên
- **Access**: Chỉ admin
- **Service Method**: `userService.getTeachersForAdmin()`

### 3. Get Students for Admin
- **Endpoint**: `GET /api/users/admin/students`
- **Purpose**: Lấy danh sách sinh viên
- **Access**: Chỉ admin
- **Service Method**: `userService.getStudentsForAdmin()`

### 4. Change User Role
- **Endpoint**: `PATCH /api/users/{id}/role`
- **Purpose**: Thay đổi vai trò người dùng
- **Access**: Chỉ admin
- **Service Method**: `userService.changeUserRole(userId, newRole)`

### 5. Update User Info
- **Endpoint**: `PATCH /api/users/{id}`
- **Purpose**: Cập nhật thông tin người dùng
- **Access**: Chỉ admin
- **Service Method**: `userService.updateUserInfo(userId, data)`

### 6. Add Teacher
- **Endpoint**: `POST /api/users/admin/add-teacher`
- **Purpose**: Thêm giáo viên mới
- **Access**: Chỉ admin
- **Service Method**: `userService.addTeacher(data)`

## Response Format
Tất cả API endpoint trả về dữ liệu với format:
```json
{
  "success": true,
  "data": {
    "data": [...], // Array of users
    "message": "Success message"
  }
}
```

## Features Implemented

### ✅ Admin User Management Page
- **Path**: `/admin-dashboard/users`
- **File**: `src/pages/admin/AdminUserManagementPage.tsx`
- **Features**:
  - Hiển thị danh sách sinh viên và giáo viên riêng biệt
  - Nút reload cho cả students và teachers
  - Chức năng thay đổi role (student ↔ teacher)
  - Chỉnh sửa thông tin người dùng inline
  - Thêm giáo viên mới
  - Error handling và loading states

### ✅ Service Layer Updates
- **File**: `src/services/userService.ts`
- **Updates**:
  - Thêm các method cho admin endpoints
  - Proper error handling với try-catch
  - Consistent data extraction (`response.data?.data || response.data || response`)
  - Logging cho debugging

### ✅ API Configuration
- **File**: `src/config/api.ts`
- **Updates**:
  - Thêm tất cả admin endpoints vào `API_ENDPOINTS.USERS`
  - Standardized endpoint naming
  - Type-safe endpoint functions

### ✅ Development Tools
- **API Tester**: `src/components/admin/AdminAPITester.tsx`
  - Test component chỉ hiển thị trong development mode
  - Test tất cả admin API endpoints
  - Hiển thị kết quả và errors
- **Test Functions**: `src/test-admin-api.ts`
  - Comprehensive testing functions
  - Console logging cho debugging
  - Safe test environment (actions commented out)

## Usage Examples

### In React Components
```typescript
import { userService } from '../services/userService';

// Get all students
const students = await userService.getStudentsForAdmin();

// Get all teachers
const teachers = await userService.getTeachersForAdmin();

// Change user role
await userService.changeUserRole(userId, 'TEACHER');

// Add new teacher
await userService.addTeacher({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword'
});
```

### Direct API Calls
```typescript
import { apiClient } from '../services/apiClient';
import { API_ENDPOINTS } from '../config/api';

// Get students
const students = await apiClient.get(API_ENDPOINTS.USERS.ADMIN_STUDENTS);

// Get teachers
const teachers = await apiClient.get(API_ENDPOINTS.USERS.ADMIN_TEACHERS);
```

## Security Features
- ✅ Chỉ admin mới có thể truy cập các endpoint này
- ✅ Token-based authentication
- ✅ Role-based access control
- ✅ Input validation và sanitization

## UI/UX Features
- ✅ Loading states với spinner
- ✅ Error messages hiển thị rõ ràng
- ✅ Reload buttons cho real-time data
- ✅ Responsive design
- ✅ Inline editing cho user info
- ✅ Confirmation dialogs cho critical actions

## Statistics Included
Mỗi user response bao gồm:
- ✅ Số khóa học đã tạo (cho teachers)
- ✅ Số khóa học đã đăng ký (cho students)
- ✅ Thông tin cơ bản: id, name, email, role, createdAt
- ✅ Sắp xếp theo thời gian tạo mới nhất

## Development & Debugging
- Console logging trong tất cả service methods
- Development-only API tester component
- Proper error boundaries và fallbacks
- TypeScript type safety

## Next Steps (Optional)
- [ ] Thêm pagination cho large datasets
- [ ] Export user lists to CSV/Excel
- [ ] Advanced filtering và search
- [ ] Bulk operations (bulk role change, bulk delete)
- [ ] User activity logs
- [ ] Email notifications cho role changes
