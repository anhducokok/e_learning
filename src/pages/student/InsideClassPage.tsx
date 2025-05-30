import React, { useState, useEffect } from 'react';
import { MessageCircle, FileText } from 'lucide-react'; 
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import chinaGirl from '../../images/china_girl.jpg';
import { courseService, lessonService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { Course, Lesson } from '../../types/api';

type Post = {
  id: string;
  author: string;
  avatar?: string; 
  type: 'assignment' | 'lecture' | 'lesson';
  date: string;
  content?: string;
  title?: string;
};

const InsideClassPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !user) return;
      
      try {
        setLoading(true);
        const [courseData, lessonsData] = await Promise.all([
          courseService.getCourseById(courseId),
          lessonService.getLessonsByCourse(courseId)
        ]);
        
        setCourse(courseData);
        setLessons(lessonsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]);

  // Convert lessons to posts format
  const posts: Post[] = lessons.map((lesson, index) => ({
    id: lesson.id,
    author: course?.instructor?.name || 'Instructor',
    type: 'lesson',
    date: lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString('vi-VN') : `${index + 1} ngày trước`,
    content: lesson.content ? lesson.content.substring(0, 100) + '...' : 'Nội dung bài học',
    title: lesson.title
  }));

  if (loading) {
    return (
      <div className="bg-white min-h-screen font-sans">

        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-white min-h-screen font-sans">

        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error || 'Course not found'}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="bg-[#A82828] flex justify-between items-center p-6 rounded-b-xl shadow">
        <div>
          <h1 className="text-2xl text-white font-bold">{course.title}</h1>
          <p className="text-sm text-white">Giáo Viên: {course.instructor?.name || 'Chưa có thông tin'}</p>
          <p className="text-sm text-white opacity-80">Trình độ: {course.level}</p>
        </div>
        <img src={chinaGirl} alt="student" className="h-24" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-12 gap-4 p-6">
        {/* Sidebar */}        <div className="col-span-12 md:col-span-3">
          <div className="bg-gray-100 p-4 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-2">Thông tin khóa học</h2>
            <p className="text-sm mb-2"><strong>Tổng số bài học:</strong> {lessons.length}</p>
            <p className="text-sm mb-2"><strong>Giá:</strong> {course.price ? `${course.price.toLocaleString('vi-VN')} VND` : 'Miễn phí'}</p>
            <p className="text-sm mb-2"><strong>Đánh giá:</strong> {course.rating ? `${course.rating}/5` : 'Chưa có đánh giá'}</p>
            <p className="text-sm"><strong>Mô tả:</strong> {course.description}</p>
          </div>
        </div>

        {/* Posts */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-4">          {/* Ask box */}
          <div className="bg-white border rounded-xl shadow p-4 flex items-center gap-2">
            <MessageCircle className="text-gray-500" />
            <span className="text-gray-600">Hỏi đáp về những vấn đề thắc mắc trong khóa học</span>
          </div>

          {/* List of posts/lessons */}
          {posts.length === 0 ? (
            <div className="bg-white border rounded-xl shadow p-8 text-center">
              <p className="text-gray-500">Chưa có bài học nào trong khóa học này</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white border rounded-xl shadow p-4 flex gap-3 items-start">
                {/* Avatar or icon */}
                <div className="bg-[#A82828] rounded-full w-10 h-10 flex items-center justify-center">
                  <FileText className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="font-semibold">
                    {post.author} đã đăng một {post.type === 'assignment' ? 'bài tập' : post.type === 'lecture' ? 'bài giảng' : 'bài học'}
                  </p>
                  {post.title && <p className="font-medium mt-1">{post.title}</p>}
                  <p className="text-sm text-gray-500">{post.date}</p>
                  {post.content && <p className="text-sm mt-1">{post.content}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default InsideClassPage;
