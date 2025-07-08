# 🎓 NiHao Education - Nền tảng E-Learning tiếng Trung

_Nơi khởi đầu hành trình học tiếng Trung của bạn!_ 🇨🇳✨

![last commit](https://img.shields.io/badge/last%20commit-today-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-99.3%25-blue)
![Languages](https://img.shields.io/badge/languages-4-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Status](https://img.shields.io/badge/status-active-success)

---

## 📖 Tổng quan dự án

**NiHao Education** là một nền tảng học tiếng Trung trực tuyến hiện đại, được xây dựng bằng React + TypeScript với mục tiêu mang đến trải nghiệm học tập tốt nhất cho người học tiếng Trung. Hệ thống hỗ trợ ba vai trò chính: **Admin**, **Teacher (Giáo viên)**, và **Student (Học viên)**.

## 🌟 Tính năng chính

### 👥 Hệ thống vai trò (Role-based System)

#### 🔴 **ADMIN - Quản trị viên**
- **Dashboard tổng quan**: Thống kê tổng thể về học viên, khóa học, doanh thu
- **Quản lý người dùng**: 
  - Xem danh sách tất cả users, teachers, students
  - Thay đổi vai trò người dùng (student ↔ teacher)
  - Thêm giáo viên mới
  - Chỉnh sửa thông tin người dùng
- **Quản lý khóa học và đăng ký**:
  - Xem danh sách tất cả khóa học
  - Xem chi tiết học viên đăng ký từng khóa học
  - Chỉnh sửa thời gian đăng ký của học viên
- **Quản lý thanh toán**:
  - Duyệt/từ chối yêu cầu thanh toán
  - Thống kê doanh thu bằng biểu đồ
  - Theo dõi trạng thái thanh toán

#### 🟢 **TEACHER - Giáo viên**
- **Dashboard giáo viên**: Thống kê về khóa học, học viên, bài tập
- **Quản lý khóa học**:
  - Tạo mới khóa học (tiêu đề, mô tả, cấp độ, giá cả)
  - Chỉnh sửa/xóa khóa học của mình
  - Xem trước khóa học
- **Quản lý nội dung chi tiết**:
  - **Bài học**: Tạo, sắp xếp thứ tự (drag & drop), thêm video, nội dung text
  - **Bài kiểm tra**: Tạo quiz với câu hỏi trắc nghiệm, xem thống kê kết quả
  - **Drag & Drop**: Sắp xếp lại thứ tự bài học và quiz dễ dàng
- **Quản lý học viên**:
  - Xem danh sách học viên đăng ký khóa học của mình
  - Theo dõi tiến độ học tập
  - Xem ngày đăng ký
- **Bài luyện tập**: Tạo và quản lý bài luyện tập theo kỹ năng (Nghe, Nói, Đọc, Viết)

#### 🔵 **STUDENT - Học viên**
- **Trang chủ**: Giới thiệu về nền tảng, giáo viên, khóa học nổi bật
- **Danh sách khóa học**: Duyệt và tìm kiếm khóa học
- **Chi tiết khóa học**: 
  - Xem thông tin chi tiết (giá, cấp độ, đánh giá)
  - Đăng ký/thanh toán khóa học
- **Learning Room**: 
  - Trang tổng quan các khóa học đã đăng ký
  - Thống kê tiến độ học tập
  - Luyện tập theo kỹ năng
- **Learning Session**:
  - Học chi tiết từng khóa học
  - Xem bài học với video và nội dung
  - Làm bài kiểm tra với giao diện hiện đại
  - Theo dõi tiến độ hoàn thành
  - Lịch sử kết quả bài kiểm tra
- **Checkout**: Thanh toán khóa học an toàn

## 🌐 Tính năng đa ngôn ngữ

- **Vietnamese**: Giao diện chính bằng tiếng Việt
- **Chinese Elements**: Tích hợp các yếu tố tiếng Trung trong nội dung
- **English Support**: Hỗ trợ các thuật ngữ quốc tế

## 📈 Scalability

### Performance
- **Code Splitting**: Lazy loading components
- **Optimized Images**: Image compression và caching
- **API Caching**: Intelligent caching strategy
- **Bundle Optimization**: Tree shaking và minification

### Architecture
- **Component-based**: Reusable UI components
- **Service Layer**: Organized API services
- **Type Safety**: TypeScript throughout
- **Error Boundaries**: Graceful error handling

## � Deployment & DevOps

- **Environment Management**: Development, staging, production
- **Build Optimization**: Vite build system
- **CI/CD Ready**: Automated deployment pipeline
- **Docker Support**: Containerization ready

## � Roadmap tương lai

### Tính năng đang phát triển
- [ ] Chat real-time giữa giáo viên và học viên
- [ ] Hệ thống notification push
- [ ] Mobile app (React Native)
- [ ] AI-powered learning recommendations
- [ ] Gamification system
- [ ] Video conferencing integration
- [ ] Offline learning support

### Cải tiến UX/UI
- [ ] Dark mode support
- [ ] Advanced filtering options
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Advanced analytics dashboard

## 💡 Innovation

**NiHao Education** không chỉ là một nền tảng e-learning đơn thuần, mà còn là một hệ sinh thái học tập hoàn chỉnh với:

- **Personalized Learning Path**: Lộ trình học tập cá nhân hóa
- **Interactive Content**: Nội dung tương tác phong phú
- **Community Features**: Tính năng cộng đồng học tập
- **Progress Analytics**: Phân tích tiến độ thông minh
- **Modern UX**: Trải nghiệm người dùng hiện đại

---

## �‍💻 Technical Stack Summary

```
Frontend: React + TypeScript + Tailwind CSS
State Management: React Context + Hooks
Routing: React Router Dom
UI Components: Custom + Headless UI
Charts: Chart.js + React Chart.js 2
Drag & Drop: @dnd-kit
Icons: Lucide React + Heroicons
Build Tool: Vite
Package Manager: npm
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd e_learning

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3212
```

## 📝 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── teacher/        # Teacher-specific components
│   └── quiz/           # Quiz-related components
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── teacher/        # Teacher pages
│   ├── student/        # Student pages
│   └── public/         # Public pages
├── services/           # API services
├── contexts/           # React contexts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── config/             # Configuration files
```

**NiHao Education** - *"Nơi khởi đầu hành trình học tiếng Trung của bạn!"* 🇨🇳✨

## 🔧 Built with the tools and technologies:


![JavaScript](https://img.shields.io/badge/JavaScript-yellow?logo=javascript&style=flat)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&style=flat)
![ts-node](https://img.shields.io/badge/ts--node-blueviolet?logo=ts-node&style=flat)
![Vite](https://img.shields.io/badge/Vite-purple?logo=vite&style=flat)
![ESLint](https://img.shields.io/badge/ESLint-purple?logo=eslint&style=flat)
![Axios](https://img.shields.io/badge/Axios-pink?logo=axios&style=flat)
![Socket.io](https://img.shields.io/badge/Socket-purple?logo=socket.io&style=flat)
![Chart.js](https://img.shields.io/badge/Chart.js-red?logo=chartdotjs&style=flat)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)

---

## 📝 Overview

**e_learning** is a robust developer toolkit designed to accelerate the development of dynamic, role-based educational platforms. Built with **React**, **TypeScript**, and **Vite**, it offers a modular architecture that simplifies complex workflows, from course management to real-time communication.

### Why _e_learning_?

This project enables developers to build scalable, interactive e-learning applications with ease. The core features include:

- 🌿 **Modular Architecture**: Centralized configs, environment management, and reusable components streamline development.
- 🌐 **Real-Time Communication**: Integrated WebSocket and chat systems facilitate seamless live interactions.
- 🔐 **Role-Based Access Control**: Secure routing and user management tailored for students, teachers, and admins.
- 🎯 **Educational Focus**: Specialized components and services for courses, quizzes, practices, and analytics.
- ⚡ **Fast Development**: Powered by Vite and TypeScript for rapid, reliable builds.

---

## 🚀 Getting Started

### 📋 Prerequisites

This project requires the following dependencies:

- **Programming Language**: TypeScript  
- **Package Manager**: npm

### 💾 Installation

Build **e_learning** from the source and install dependencies:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/anhducokok/e_learning

2.** Install and run The project**
   
   ```bash
  npm install
  npm run dev
