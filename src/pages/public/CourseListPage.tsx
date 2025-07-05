import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { Course, Class } from "../../types/api";
import { API_BASE_URL } from "../../config/api";

const CourseListPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [activeClassId, setActiveClassId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, boolean>>({});
  const [enrollingCourses, setEnrollingCourses] = useState<Set<string>>(new Set());
  const coursesPerPage = 12;
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchClassesWithCourses = async () => {
      try {
        setLoading(true);
        const classesResponse = await fetch(`${API_BASE_URL}/api/classes`);
        const classesData = await classesResponse.json();
        
        const classesWithCoursesPromises = (classesData.data || []).map(async (classItem: Class) => {
          try {
            const coursesResponse = await fetch(`${API_BASE_URL}/api/classes/${classItem.id}/courses`);
            const coursesData = await coursesResponse.json();
            
            const courses = coursesData.data || [];
            return { ...classItem, courses };
          } catch (err) {
            return { ...classItem, courses: [] };
          }
        });

        const classesWithCourses = await Promise.all(classesWithCoursesPromises);
        setClasses(classesWithCourses);

        // Flatten all courses from all classes
        const allCoursesFlat = classesWithCourses.reduce((acc: Course[], classItem) => {
          return acc.concat(classItem.courses || []);
        }, []);
        setAllCourses(allCoursesFlat);

        // If user is authenticated, fetch enrollment status for all courses
        if (isAuthenticated) {
          const statusMap: Record<string, boolean> = {};
          
          for (const course of allCoursesFlat) {
            try {
              const statusResponse = await fetch(`${API_BASE_URL}/api/courses/${course.id}/enrollment-status`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
              });
              
              if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                statusMap[course.id] = statusData.data?.isEnrolled || false;
              } else {
                statusMap[course.id] = false;
              }
            } catch (err) {
              statusMap[course.id] = false;
            }
          }
          
          setEnrollmentStatus(statusMap);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch classes and courses');
        setClasses([]);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesWithCourses();
  }, [isAuthenticated]);

  // Get class filter options
  const getClassFilterOptions = () => {
    const options = [
      { id: "all", name: "Tất cả", count: allCourses.length }
    ];
    
    classes.forEach(classItem => {
      if (classItem.courses && classItem.courses.length > 0) {
        options.push({
          id: classItem.id,
          name: classItem.name,
          count: classItem.courses.length
        });
      }
    });
    
    return options;
  };

  // Filter courses based on selected class
  const getFilteredCourses = () => {
    if (activeClassId === "all") {
      return allCourses;
    }
    
    const selectedClass = classes.find(cls => cls.id === activeClassId);
    return selectedClass?.courses || [];
  };

  // Pagination logic
  const filteredCourses = getFilteredCourses();
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeClassId]);

  const handleEnrollment = async (courseId: string, isCurrentlyEnrolled: boolean) => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để ghi danh khóa học');
      return;
    }

    setEnrollingCourses(prev => new Set(prev).add(courseId));
    
    try {
      const token = localStorage.getItem('auth_token');
      
      if (isCurrentlyEnrolled) {
        // Unenroll
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/enroll`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Hủy ghi danh thất bại: ${response.status}`);
        }
        
        setEnrollmentStatus(prev => ({ ...prev, [courseId]: false }));
      } else {
        // Enroll
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Ghi danh thất bại: ${response.status}`);
        }
        
        setEnrollmentStatus(prev => ({ ...prev, [courseId]: true }));
      }
    } catch (err: any) {
      alert(err.message || 'Không thể cập nhật ghi danh');
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
        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">Có lỗi xảy ra khi tải khóa học</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </main>
      </div>
    );
  }

  const classOptions = getClassFilterOptions();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tất cả khóa học</h1>

        {/* Class filter */}
        <div className="mb-8 flex flex-wrap gap-4">
          {classOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setActiveClassId(option.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeClassId === option.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.name} ({option.count})
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentCourses.map(course => {
            const isEnrolled = enrollmentStatus[course.id] || false;
            const isEnrolling = enrollingCourses.has(course.id);
            
            return (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <Link to={`/courses/${course.id}`} className="block">
                  <div className="h-48">
                    <img
                      src={course.image || course.thumbnail || '/images/default-course.jpg'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-course.jpg';
                      }}
                    />
                  </div>
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                  <Link to={`/courses/${course.id}`}>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2 hover:text-red-600 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
                    {course.description}
                  </p>
                  
                  <div className="text-sm text-gray-500 flex justify-between items-center mb-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-full capitalize">
                      {course.level}
                    </span>
                    {Array.isArray(course.tags) && course.tags.length > 0 && (
                      <span className="px-2 py-1 bg-gray-100 rounded-full">
                        {course.tags[0]}
                      </span>
                    )}
                  </div>
                  
                  {course.price !== undefined && course.price !== null && (
                    <div className="mb-4">
                      <p className="font-medium text-gray-800">
                        {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()} VNĐ`}
                      </p>
                    </div>
                  )}

                  {/* Enrollment Button */}
                  {isAuthenticated && (
                    <div className="mt-auto">
                      {isEnrolled ? (
                        <Link
                          to={`/learning-session/${course.id}`}
                          className="block w-full py-2 px-4 rounded-md font-medium text-sm text-center bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          Tiếp tục học
                        </Link>
                      ) : (
                        // Show different buttons based on course price
                        course.price && course.price > 0 ? (
                          // Paid course - redirect to checkout
                          <Link
                            to={`/checkout/${course.id}`}
                            className="block w-full py-2 px-4 rounded-md font-medium text-sm text-center bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            Thanh toán
                          </Link>
                        ) : (
                          // Free course - direct enrollment
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleEnrollment(course.id, isEnrolled);
                            }}
                            disabled={isEnrolling}
                            className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors bg-red-600 text-white hover:bg-red-700 ${isEnrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isEnrolling ? 'Đang xử lý...' : 'Ghi danh miễn phí'}
                          </button>
                        )
                      )}
                    </div>
                  )}
                      
                  {!isAuthenticated && (
                    <div className="mt-auto">
                      <Link
                        to="/auth"
                        className="block w-full py-2 px-4 rounded-md font-medium text-sm text-center bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Đăng nhập để học
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseListPage;