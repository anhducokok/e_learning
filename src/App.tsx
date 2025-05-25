import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import LearningRoomPage from './pages/LearningRoomPage';
import BlogPage from './pages/BlogPage';
import MyClassesPage from './pages/MyClassesPage';
import DashboardPage from './pages/DashboardPage';
import LearningSessionPage from './pages/LearningSessionPage';
import CourseDetailPage from './pages/CourseDetailPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/learning-room" element={<LearningRoomPage />} />
        <Route path="/learning-session/:id" element={<LearningSessionPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/my-classes" element={<MyClassesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/course-detail" element={<CourseDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;