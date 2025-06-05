import React, { useState, useEffect } from 'react';
import { Clock, Video, Users } from 'lucide-react';
import { courseService } from '../services/courseService';
import type { Course } from '../types/api';
import img from '../images/course.jpg'
import { useNavigate } from 'react-router-dom';
const CourseListSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCourses = await courseService.getAllCourses();
        setCourses(fetchedCourses);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Lỗi: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Các lớp học đang sẵn sàng</h2>
          <div className="flex items-center gap-3">
            <select className="border px-4 py-2 rounded-md text-sm">
              <option>Số lượng</option>
              <option>Thời lượng</option>
              <option>Phổ biến</option>
            </select>
            <button    onClick={() => navigate('/auth')} className="bg-yellow-400 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-500">
              Xem thêm
            </button>
          </div>
        </div>

        <hr className="mb-10 border-gray-200" />        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">Không có khóa học nào được tìm thấy.</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <img
                  src={course.image || course.thumbnail || img}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = img;
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{course.description}</p>
                  
                  {/* Level badge */}
                  <div className="mb-3">                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      course.level === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                      course.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                      course.level === 'ADVANCED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {course.level === 'BEGINNER' ? 'Căn bản' :
                       course.level === 'INTERMEDIATE' ? 'Trung cấp' :
                       course.level === 'ADVANCED' ? 'Nâng cao' :
                       course.level}
                    </span>
                  </div>

                  <div className="flex flex-wrap text-sm text-gray-700 gap-x-4 gap-y-2">
                    {course.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                    )}
                    {course.lessons && (
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {course.lessons.length} Bài học
                      </div>
                    )}
                    {course.enrollmentCount && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.enrollmentCount.toLocaleString()} Học viên
                      </div>
                    )}
                  </div>

                  {/* Instructor information */}
                  {course.instructor && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Giảng viên: <span className="font-medium">{course.instructor.name}</span>
                      </p>
                    </div>
                  )}

                  {/* Price */}
                  {course.price !== undefined && (
                    <div className="mt-3">
                      <p className="text-lg font-bold text-yellow-600">
                        {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()} VNĐ`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseListSection;
