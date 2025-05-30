import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import { ChatProvider } from "./contexts/ChatContext";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          {" "}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/learning-room" element={<LearningRoomPage />} />
            <Route
              path="/learning-session/:id"
              element={<LearningSessionPage />}
            />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/my-classes" element={<MyClassesPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route
              path="/teacher-dashboard"
              element={<TeacherDashboardPage />}
            />
            <Route path="/course-detail" element={<CourseDetailPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/course-success" element={<CourseSuccess />} />{" "}
            <Route path="/inside-class" element={<InsideClass />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/courses" element={<CourseListPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
