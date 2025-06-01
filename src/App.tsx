import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/public/HomePage";
import AuthPage from "./pages/public/AuthPage";
import LearningRoomPage from "./pages/student/LearningRoomPage";
import BlogPage from "./pages/public/BlogPage";
import MyClassesPage from "./pages/student/MyClassesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import LearningSessionPage from "./pages/student/LearningSessionPage";
import CourseDetailPage from "./pages/public/CourseDetailPage";
import "./index.css";
import NotFoundPage from "./pages/public/404Page";
import CourseSuccess from "./pages/student/CourseSuccessPage";
import InsideClass from "./pages/student/InsideClassPage";
import ForgotPassword from "./pages/public/ForgotPasswordPage";
import CourseListPage from "./pages/public/CourseListPage";
import ProfilePage from "./pages/public/ProfilePage";
import TestPage from "./pages/public/TestPage";
import { ChatProvider } from "./contexts/ChatContext";
import MainLayout from "./components/MainLayout";
import SchedulePage from "./pages/public/SchedulePage";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <Routes>
            {/* Admin Routes - No Layout */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Teacher Routes - No Layout */}
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboardPage />
                </ProtectedRoute>
              }
            />
            
            {/* Public and Student Routes - With Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="home" element={<HomePage />} />
              <Route path="auth" element={<AuthPage />} />
            
              {/* Student Routes */}
              <Route 
                path="learning-room" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <LearningRoomPage />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="learning-session/:id"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <LearningSessionPage />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="my-classes" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <MyClassesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="course-success" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <CourseSuccess />
                  </ProtectedRoute>
                } 
              />              <Route 
                path="inside-class" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <InsideClass />
                  </ProtectedRoute>
                } 
              />
                {/* Public Routes */}
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="course-detail" element={<CourseDetailPage />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="courses" element={<CourseListPage />} />
              <Route path="test" element={<TestPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="404" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
