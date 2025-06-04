import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Course, Class } from "../../types/api";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../config/api";

// Debug version of CourseListPage with direct fetch calls
const CourseListPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [classes, setClasses] = useState<Class[]>([]);
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, boolean>>({});
  const [enrollingCourses, setEnrollingCourses] = useState<Set<string>>(new Set());
  const { isAuthenticated } = useAuth();
  
  // Log configuration
  useEffect(() => {
    console.log('CourseListPage mounted');
    console.log('API_BASE_URL:', API_BASE_URL);
  }, []);

  useEffect(() => {
    const fetchClassesWithCourses = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching classes...');
        const classesResponse = await fetch(`${API_BASE_URL}/classes`);
        
        if (!classesResponse.ok) {
          throw new Error(`Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`);
        }
        
        const classesData = await classesResponse.json();
        console.log('Classes response:', classesData);
        
        if (!classesData.data || !Array.isArray(classesData.data)) {
          throw new Error('Invalid classes data format');
        }
        
        const classesWithoutCourses = classesData.data;
        console.log('Classes without courses:', classesWithoutCourses);
        
        // Fetch courses for each class
        const classesWithCourses = await Promise.all(
          classesWithoutCourses.map(async (classItem: Class) => {
            try {
              console.log(`Fetching courses for class ${classItem.id}...`);
              const coursesResponse = await fetch(`${API_BASE_URL}/classes/${classItem.id}/courses`);
              
              if (!coursesResponse.ok) {
                throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
              }
              
              const coursesData = await coursesResponse.json();
              console.log(`Courses for class ${classItem.id}:`, coursesData);
              
              const courses = coursesData.data || [];
              return { ...classItem, courses };
            } catch (err) {
              console.error(`Failed to fetch courses for class ${classItem.id}:`, err);
              return { ...classItem, courses: [] };
            }
          })
        );
        
        console.log('Classes with courses:', classesWithCourses);
        setClasses(classesWithCourses);

        // If user is authenticated, fetch enrollment status for all courses
        if (isAuthenticated) {
          const statusMap: Record<string, boolean> = {};
          
          for (const classItem of classesWithCourses) {
            for (const course of classItem.courses || []) {
              try {
                const statusResponse = await fetch(`${API_BASE_URL}/courses/${course.id}/enrollment-status`, {
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
                console.error(`Failed to get enrollment status for course ${course.id}:`, err);
                statusMap[course.id] = false;
              }
            }
          }
          
          setEnrollmentStatus(statusMap);
        }
      } catch (err: any) {
        console.error('Error in fetchClassesWithCourses:', err);
        setError(err.message || 'Failed to fetch classes and courses');
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesWithCourses();
  }, [isAuthenticated]);

  const categories = [
    { id: "ALL", name: "Tất cả" },
    { id: "BEGINNER", name: "Căn bản" },
    { id: "INTERMEDIATE", name: "Trung cấp" },
    { id: "ADVANCED", name: "Nâng cao" },
  ];

  // Filter courses within classes based on category
  const getFilteredClasses = () => {
    return classes.map(classItem => ({
      ...classItem,
      courses: activeCategory === "all"
        ? (classItem.courses || [])
        : (classItem.courses || []).filter((course: Course) => course.level === activeCategory)
    })).filter(classItem => (classItem.courses?.length || 0) > 0);
  };

  const toggleClassExpansion = (classId: string) => {
    setExpandedClasses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

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
      console.error('Enrollment error:', err);
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

  const filteredClasses = getFilteredClasses();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
        </div>
        
        <div className="space-y-6 mb-6">
          {filteredClasses.map((classItem) => {
            const isExpanded = expandedClasses.has(classItem.id);
            
            return (
              <div key={classItem.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Class Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                  onClick={() => toggleClassExpansion(classItem.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{classItem.name}</h2>
                      {classItem.description && (
                        <p className="text-gray-600 text-sm">{classItem.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {classItem.courses?.length || 0} khóa học
                      </p>
                    </div>
                    <div className="ml-4">
                      <svg
                        className={`w-6 h-6 text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Courses Grid - Expandable */}
                {isExpanded && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {classItem.courses?.map((course: Course) => {
                        const isEnrolled = enrollmentStatus[course.id] || false;
                        const isEnrolling = enrollingCourses.has(course.id);
                        
                        return (
                          <div
                            key={course.id}
                            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                          >
                            <Link to={`/courses/${course.id}`} className="block">
                              <div className="h-36">
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
                                <h3 className="text-md font-semibold mb-2 text-gray-800 line-clamp-2 hover:text-red-600 transition-colors">
                                  {course.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-grow">
                                {course.description}
                              </p>
                              
                              <div className="text-xs text-gray-500 flex justify-between items-center mb-2">
                                <span className="px-2 py-1 bg-gray-100 rounded-full capitalize">
                                  {course.level}
                                </span>
                                {Array.isArray(course.tags) && course.tags.length > 0 && (
                                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                                    {course.tags[0]}
                                  </span>
                                )}
                              </div>
                              
                              {/* Enrollment Button */}
                              {isAuthenticated && (
                                <div className="mt-auto">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleEnrollment(course.id, isEnrolled);
                                    }}
                                    disabled={isEnrolling}
                                    className={`w-full py-2 px-3 rounded-md font-medium text-xs transition-colors ${
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
                                <div className="mt-auto">
                                  <Link
                                    to="/auth"
                                    className="block w-full py-2 px-3 rounded-md font-medium text-xs text-center bg-red-600 text-white hover:bg-red-700 transition-colors"
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
                    
                    {(!classItem.courses || classItem.courses.length === 0) && (
                      <div className="text-center text-gray-500 py-8">
                        Không có khóa học nào trong lớp này
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {filteredClasses.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <div className="text-lg mb-2">Không tìm thấy khóa học nào</div>
            <div className="text-sm">Thử thay đổi bộ lọc hoặc quay lại sau</div>
            <div className="mt-4 p-4 bg-gray-100 rounded-md text-left">
              <h3 className="font-bold">DEBUG INFO</h3>
              <p>API URL: {API_BASE_URL}</p>
              <p>Classes count: {classes.length}</p>
              <p>Total courses: {classes.reduce((total, cls) => total + (cls.courses?.length || 0), 0)}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseListPage;
