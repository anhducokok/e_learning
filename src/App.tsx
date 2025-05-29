import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import LearningRoomPage from './pages/LearningRoomPage';
import BlogPage from './pages/BlogPage';
import MyClassesPage from './pages/MyClassesPage';
<<<<<<< Updated upstream
=======
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';
>>>>>>> Stashed changes
import LearningSessionPage from './pages/LearningSessionPage';
import CourseDetailPage from './pages/CourseDetailPage';
import './index.css';
import NotFoundPage from "./pages/404Page";
import CourseSuccess from "./pages/CourseSuccessPage";
import InsideClass from "./pages/InsideClassPage";
import ForgotPassword from "./pages/ForgotPasswordPage";
import CourseListPage from './pages/CourseListPage';

function App() {
  return (
    <AuthProvider>
      <Router>        <Routes>
          <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/learning-room" element={<LearningRoomPage />} />
        <Route path="/learning-session/:id" element={<LearningSessionPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/my-classes" element={<MyClassesPage />} />
<<<<<<< Updated upstream
=======
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
>>>>>>> Stashed changes
        <Route path="/course-detail" element={<CourseDetailPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/course-success" element={<CourseSuccess />} />        <Route path="/inside-class" element={<InsideClass />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/courses" element={<CourseListPage />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;