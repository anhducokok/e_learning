import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../../services";
import type { Course } from "../../types/api";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const CourseListPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, boolean>>({});
  const [enrollingCourses, setEnrollingCourses] = useState<Set<string>>(new Set());
  const { isAuthenticated } = useAuth();  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses();
        // Ensure response is an array
        const coursesArray = Array.isArray(response) ? response : [];
        setCourses(coursesArray);

        // If user is authenticated, fetch enrollment status for each course
        if (isAuthenticated && coursesArray.length > 0) {
          const statusMap: Record<string, boolean> = {};
          await Promise.all(
            coursesArray.map(async (course) => {
              try {
                const status = await courseService.checkEnrollmentStatus(course.id);
                statusMap[course.id] = status.isEnrolled;
              } catch (err) {
                // If error checking status, assume not enrolled
                statusMap[course.id] = false;
              }
            })
          );
          setEnrollmentStatus(statusMap);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch courses');
        setCourses([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated]);
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "beginner", name: "Căn bản" },
    { id: "intermediate", name: "Trung cấp" },
    { id: "advanced", name: "Nâng cao" },
  ];  const filteredCourses = Array.isArray(courses) 
    ? (activeCategory === "all"
        ? courses
        : courses.filter((c) => c.level === activeCategory))
    : [];

  const handleEnrollment = async (courseId: string, isCurrentlyEnrolled: boolean) => {
    if (!isAuthenticated) {
      alert('Please log in to enroll in courses');
      return;
    }

    setEnrollingCourses(prev => new Set(prev).add(courseId));
    
    try {
      if (isCurrentlyEnrolled) {
        await courseService.unenrollFromCourse(courseId);
        setEnrollmentStatus(prev => ({ ...prev, [courseId]: false }));
      } else {
        await courseService.enrollInCourse(courseId);
        setEnrollmentStatus(prev => ({ ...prev, [courseId]: true }));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update enrollment');
    } finally {
      setEnrollingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">Có lỗi xảy ra khi tải khóa học</div>
            <div className="text-gray-600">{error}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Danh sách khóa học
        </h1>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrollmentStatus[course.id] || false;
            const isEnrolling = enrollingCourses.has(course.id);
            
            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <Link to={`/courses/${course.id}`} className="block">
                  <div className="h-48">
                    <img
                      src={course.image || '/images/default-course.jpg'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-course.jpg';
                      }}
                    />
                  </div>
                </Link>

                <div className="p-5 flex flex-col flex-grow">
                  <Link to={`/courses/${course.id}`}>
                    <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2 hover:text-red-600 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {course.description}
                  </p>
                  <div className="text-xs text-gray-500 flex justify-between items-center mb-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-full capitalize">
                      {course.level}
                    </span>
                    {course.duration && <span>{course.duration}</span>}
                    {course.price && (
                      <span className="font-semibold text-red-600">
                        {course.price.toLocaleString()} VND
                      </span>
                    )}
                  </div>                  {course.instructor && (
                    <div className="text-xs text-gray-500 mb-2">
                      Giảng viên: {course.instructor.name}
                    </div>
                  )}
                  {course.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(course.rating))}
                        {'☆'.repeat(5 - Math.floor(course.rating))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        {course.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  
                  {/* Enrollment Button */}
                  {isAuthenticated && (
                    <div className="mt-auto pt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleEnrollment(course.id, isEnrolled);
                        }}
                        disabled={isEnrolling}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                          isEnrolled
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        } ${isEnrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isEnrolling 
                          ? 'Processing...' 
                          : isEnrolled 
                            ? 'Unenroll' 
                            : 'Enroll Now'
                        }
                      </button>
                    </div>
                  )}
                  
                  {!isAuthenticated && (
                    <div className="mt-auto pt-3">
                      <Link
                        to="/auth"
                        className="block w-full py-2 px-4 rounded-lg font-medium text-sm text-center bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Login to Enroll
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Pagination */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-1">
            <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-md">
              1
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              2
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              10
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
              Tiếp
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseListPage;
