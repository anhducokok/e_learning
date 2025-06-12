import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Course, Class } from "../../types/api";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../config/api";

const CourseListPage: React.FC = () => {
  const [activeClassId, setActiveClassId] = useState("all");
  const [classes, setClasses] = useState<Class[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, boolean>>({});
  const [enrollingCourses, setEnrollingCourses] = useState<Set<string>>(new Set());
    // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9; // 3x3 grid
  
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchClassesWithCourses = async () => {      try {
        setLoading(true);
        
        const classesResponse = await fetch(`${API_BASE_URL}/classes`);
        
        if (!classesResponse.ok) {
          throw new Error(`Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`);
        }
        
        const classesData = await classesResponse.json();
        
        if (!classesData.data || !Array.isArray(classesData.data)) {
          throw new Error('Invalid classes data format');
        }
        
        const classesWithoutCourses = classesData.data;
          // Fetch courses for each class
        const classesWithCourses = await Promise.all(
          classesWithoutCourses.map(async (classItem: Class) => {
            try {
              const coursesResponse = await fetch(`${API_BASE_URL}/classes/${classItem.id}/courses`);
              
              if (!coursesResponse.ok) {
                throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
              }
              
              const coursesData = await coursesResponse.json();
              
              const courses = coursesData.data || [];
              return { ...classItem, courses };
            } catch (err) {
              return { ...classItem, courses: [] };
            }
          })
        );

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
              const statusResponse = await fetch(`${API_BASE_URL}/courses/${course.id}/enrollment-status`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
              });
              
              if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                statusMap[course.id] = statusData.data?.isEnrolled || false;              } else {
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
      alert('Please log in to enroll in courses');
      return;
    }

    setEnrollingCourses(prev => new Set(prev).add(courseId));
    
    try {
      const token = localStorage.getItem('auth_token');
      
      if (isCurrentlyEnrolled) {
        // Unenroll
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to unenroll: ${response.status}`);
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
          throw new Error(`Failed to enroll: ${response.status}`);
        }
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
            <div className="text-gray-600">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Tải lại trang
            </button>
          </div>
        </main>
      </div>
    );
  }

  const classFilterOptions = getClassFilterOptions();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Danh sách khóa học
        </h1>

        {/* Class Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {classFilterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveClassId(option.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                activeClassId === option.id
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span>{option.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeClassId === option.id
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {currentCourses.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentCourses.map((course: Course) => {
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
                          src={course.thumbnail || '/images/default-course.jpg'}
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

                      {/* Price Display */}
                      {course.price !== undefined && course.price !== null && (
                        <div className="mb-3">
                          <p className="text-lg font-bold text-red-600">
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
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹ Trước
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  // Show first page, last page, current page, and pages around current page
                  const showPage = page === 1 || page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (!showPage && page === 2 && currentPage > 3) {
                    return <span key={page} className="text-gray-400">...</span>;
                  }
                  if (!showPage && page === totalPages - 1 && currentPage < totalPages - 2) {
                    return <span key={page} className="text-gray-400">...</span>;
                  }
                  if (!showPage) {
                    return null;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-red-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau ›
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <div className="text-lg mb-2">Không tìm thấy khóa học nào</div>
            <div className="text-sm">
              {activeClassId === "all" 
                ? "Chưa có khóa học nào được tạo" 
                : "Lớp học này chưa có khóa học nào"
              }
            </div>
          </div>
        )}

        {/* Debug Info */}
        {filteredCourses.length === 0 && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md text-left text-sm">
            <h3 className="font-bold mb-2">DEBUG INFO</h3>
            <p>API URL: {API_BASE_URL}</p>
            <p>Classes count: {classes.length}</p>
            <p>Total courses: {allCourses.length}</p>
            <p>Active class ID: {activeClassId}</p>
            <p>Filtered courses: {filteredCourses.length}</p>
            <p>Current page: {currentPage} / {totalPages}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseListPage;