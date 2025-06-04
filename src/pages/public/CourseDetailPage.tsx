import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { courseService } from "../../services";
import type { Course } from "../../types/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const course = await courseService.getCourseById(id);
        setCourse(course);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">

        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A82828]"></div>
        </main>
  
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">

        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">{error}</p>
            <Link
              to="/courses"
              className="bg-[#A82828] text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Quay lại danh sách khóa học
            </Link>
          </div>
        </main>

      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">

        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">Khóa học không tồn tại.</p>
            <Link
              to="/courses"
              className="bg-[#A82828] text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Quay lại danh sách khóa học
            </Link>
          </div>
        </main>

      </div>
    );
  }

  // Format level display
  const getLevelDisplay = (level: string) => {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
      case 'exam': return 'Luyện thi';
      case 'communication': return 'Giao tiếp';
      default: return level;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">


      <main className="flex-grow max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left content */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            <p className="text-gray-700 text-lg mb-4">{course.description}</p>            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <p><strong>Giảng viên:</strong> {course.instructor?.name || 'Chưa có thông tin'}</p>
              <p><strong>Cấp độ:</strong> {getLevelDisplay(course.level)}</p>
              <p><strong>Giá:</strong> {course.price?.toLocaleString('vi-VN') || 'Liên hệ'} VNĐ</p>
              {course.rating && (
                <p><strong>Đánh giá:</strong> {course.rating} ⭐</p>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Nội dung khóa học</h2>
              {/* <p className="text-gray-700 leading-relaxed">
                {course.content}
              </p> */}
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Mục tiêu khóa học</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Nắm vững kiến thức cơ bản về {course.title.toLowerCase()}</li>
                <li>• Phát triển kỹ năng thực hành thông qua bài tập</li>
                <li>• Chuẩn bị tốt cho các kỳ thi và ứng dụng thực tế</li>
                <li>• Tự tin giao tiếp và sử dụng trong công việc</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <img
              src={course.image || "/images/default-course.jpg"}
              alt={course.title}
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => {
                e.currentTarget.src = "/images/default-course.jpg";
              }}
            />
            
            <div className="mb-4">
              <div className="text-2xl font-bold text-[#A82828] mb-2">
                {course.price?.toLocaleString('vi-VN') || 'Liên hệ'} VNĐ
              </div>
              <div className="text-sm text-gray-600">
                Cấp độ: {getLevelDisplay(course.level)}
              </div>
              {course.rating && (
                <div className="text-sm text-gray-600">
                  Đánh giá: {course.rating} ⭐
                </div>
              )}
            </div>

            <Link
              to="/course-success"
              className="block text-center w-full bg-[#A82828] text-white px-4 py-3 rounded-md font-semibold hover:bg-red-700 transition mb-3"
            >
              Đăng ký khóa học            </Link>
            <Link
              to="/courses"
              className="block text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-md text-gray-800 font-semibold transition"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </main>


    </div>
  );
};

export default CourseDetailPage;
