import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Course, Class } from "../../types/api";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../config/api";

const CourseListPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [classes, setClasses] = useState<Class[]>([]);
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<
    Record<string, boolean>
  >({});
  const [enrollingCourses, setEnrollingCourses] = useState<Set<string>>(
    new Set()
  );
  const { isAuthenticated } = useAuth();

  // Log configuration
  useEffect(() => {
    console.log("CourseListPage mounted");
    console.log("API_BASE_URL:", API_BASE_URL);
  }, []);

  useEffect(() => {
    const fetchClassesWithCourses = async () => {
      try {
        setLoading(true);

        console.log("Fetching classes...");
        const classesResponse = await fetch(`${API_BASE_URL}/classes`);

        if (!classesResponse.ok) {
          throw new Error(
            `Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`
          );
        }

        const classesData = await classesResponse.json();
        console.log("Classes response:", classesData);

        if (!classesData.data || !Array.isArray(classesData.data)) {
          throw new Error("Invalid classes data format");
        }

        const classesWithoutCourses = classesData.data;
        console.log("Classes without courses:", classesWithoutCourses);

        // Fetch courses for each class
        const classesWithCourses = await Promise.all(
          classesWithoutCourses.map(async (classItem: Class) => {
            try {
              console.log(`Fetching courses for class ${classItem.id}...`);
              const coursesResponse = await fetch(
                `${API_BASE_URL}/classes/${classItem.id}/courses`
              );

              if (!coursesResponse.ok) {
                throw new Error(
                  `Failed to fetch courses: ${coursesResponse.status}`
                );
              }

              const coursesData = await coursesResponse.json();
              console.log(`Courses for class ${classItem.id}:`, coursesData);

              const courses = coursesData.data || [];
              return { ...classItem, courses };
            } catch (err) {
              console.error(
                `Failed to fetch courses for class ${classItem.id}:`,
                err
              );
              return { ...classItem, courses: [] };
            }
          })
        );
        console.log("Classes with courses:", classesWithCourses);
        setClasses(classesWithCourses);

        // Expand all classes by default
        const allClassIds = new Set(
          classesWithCourses.map((classItem) => classItem.id)
        );
        setExpandedClasses(allClassIds);

        // If user is authenticated, fetch enrollment status for all courses
        if (isAuthenticated) {
          const statusMap: Record<string, boolean> = {};

          for (const classItem of classesWithCourses) {
            for (const course of classItem.courses || []) {
              try {
                const statusResponse = await fetch(
                  `${API_BASE_URL}/courses/${course.id}/enrollment-status`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "auth_token"
                      )}`,
                    },
                  }
                );

                if (statusResponse.ok) {
                  const statusData = await statusResponse.json();
                  statusMap[course.id] = statusData.data?.isEnrolled || false;
                } else {
                  statusMap[course.id] = false;
                }
              } catch (err) {
                console.error(
                  `Failed to get enrollment status for course ${course.id}:`,
                  err
                );
                statusMap[course.id] = false;
              }
            }
          }

          setEnrollmentStatus(statusMap);
        }
      } catch (err: any) {
        console.error("Error in fetchClassesWithCourses:", err);
        setError(err.message || "Failed to fetch classes and courses");
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesWithCourses();
  }, [isAuthenticated]);

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "beginner", name: "Căn bản" },
    { id: "intermediate", name: "Trung cấp" },
    { id: "advanced", name: "Nâng cao" },
  ];

  // Filter courses within classes based on category
  const getFilteredClasses = () => {
    return classes
      .map((classItem) => ({
        ...classItem,
        courses:
          activeCategory === "all"
            ? classItem.courses || []
            : (classItem.courses || []).filter(
                (course: Course) => course.level === activeCategory
              ),
      }))
      .filter((classItem) => (classItem.courses?.length || 0) > 0);
  };

  const toggleClassExpansion = (classId: string) => {
    setExpandedClasses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

  const handleEnrollment = async (
    courseId: string,
    isCurrentlyEnrolled: boolean
  ) => {
    if (!isAuthenticated) {
      alert("Please log in to enroll in courses");
      return;
    }

    setEnrollingCourses((prev) => new Set(prev).add(courseId));

    try {
      const token = localStorage.getItem("auth_token");

      if (isCurrentlyEnrolled) {
        // Unenroll
        const response = await fetch(
          `${API_BASE_URL}/courses/${courseId}/enroll`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to unenroll: ${response.status}`);
        }

        setEnrollmentStatus((prev) => ({ ...prev, [courseId]: false }));
      } else {
        // Enroll
        const response = await fetch(
          `${API_BASE_URL}/courses/${courseId}/enroll`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to enroll: ${response.status}`);
        }

        setEnrollmentStatus((prev) => ({ ...prev, [courseId]: true }));
      }
    } catch (err: any) {
      console.error("Enrollment error:", err);
      alert(err.message || "Failed to update enrollment");
    } finally {
      setEnrollingCourses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#A82828]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <div className="text-red-600 text-lg mb-4 font-medium">
              Có lỗi xảy ra khi tải khóa học
            </div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#A82828] text-white rounded-md hover:bg-red-700 transition"
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Danh sách khóa học
        </h1>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-2 rounded-md font-medium text-sm transition
                ${
                  activeCategory === cat.id
                    ? "bg-[#A82828] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Classes List */}
        <div className="space-y-6">
          {filteredClasses.map((classItem) => {
            const isExpanded = expandedClasses.has(classItem.id);

            return (
              <section
                key={classItem.id}
                className="bg-white rounded-lg shadow-md border border-gray-200"
              >
                {/* Class Header */}
                <header
                  onClick={() => toggleClassExpansion(classItem.id)}
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 transition"
                  aria-expanded={isExpanded}
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {classItem.name}
                    </h2>
                    {classItem.description && (
                      <p className="mt-1 text-gray-600 text-sm">
                        {classItem.description}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      {classItem.courses?.length || 0} khóa học
                    </p>
                  </div>
                  <button
                    aria-label={isExpanded ? "Thu gọn lớp" : "Mở rộng lớp"}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition
                      ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </header>

                {/* Courses List */}
                {isExpanded && (
                  <div className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classItem.courses?.map((course) => {
                        const isEnrolled = enrollmentStatus[course.id] || false;
                        const isEnrolling = enrollingCourses.has(course.id);

                        return (
                          <article
                            key={course.id}
                            className="bg-white rounded-md shadow-sm border border-gray-200 p-4"
                          >
                            <Link
                              to={`/courses/${course.id}`}
                              className="block mb-3"
                            >
                              <img
                                src={
                                  course.thumbnail ||
                                  "https://via.placeholder.com/150"
                                }
                                alt={course.title}
                                className="w-full h-40 object-cover rounded-md"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/150";
                                }}
                              />
                            </Link>

                            <div className="space-y-2">
                              <Link
                                to={`/courses/${course.id}`}
                                className="hover:text-[#A82828]"
                              >
                                <h3 className="text-lg font-medium text-gray-800">
                                  {course.title}
                                </h3>
                              </Link>

                              <p className="text-gray-600 text-sm line-clamp-2">
                                {course.description}
                              </p>

                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span className="capitalize bg-gray-200 rounded px-2 py-1">
                                  {course.level}
                                </span>
                                {course.duration && (
                                  <span>{course.duration}</span>
                                )}
                                {course.price !== null &&
                                  course.price !== undefined &&
                                  course.price > 0 && (
                                    <span className="font-medium text-gray-700">
                                      {course.price.toLocaleString()} VND
                                    </span>
                                  )}
                              </div>

                              {course.instructor && (
                                <div className="text-sm text-gray-500">
                                  Giảng viên: {course.instructor.name}
                                </div>
                              )}

                              {/* Action Button */}
                              {isAuthenticated ? (
                                isEnrolled ? (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleEnrollment(course.id, isEnrolled);
                                    }}
                                    disabled={isEnrolling}
                                    className={`
                                      w-full py-2 rounded-md font-medium text-sm transition
                                      ${
                                        isEnrolling
                                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                          : "bg-red-100 text-red-600 hover:bg-red-200"
                                      }
                                    `}
                                  >
                                    {isEnrolling
                                      ? "Đang xử lý..."
                                      : "Hủy ghi danh"}
                                  </button>
                                ) : (
                                  <Link
                                    to={`/checkout/${course.id}`}
                                    className="block w-full text-center py-2 rounded-md font-medium text-sm bg-[#A82828] text-white hover:bg-red-700 transition"
                                  >
                                    Thanh toán
                                  </Link>
                                )
                              ) : (
                                <Link
                                  to="/auth"
                                  className="block w-full text-center py-2 rounded-md font-medium text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                >
                                  Đăng nhập để thanh toán
                                </Link>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    {(!classItem.courses || classItem.courses.length === 0) && (
                      <p className="text-center text-gray-500 py-4">
                        Không có khóa học nào trong lớp này
                      </p>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* No Courses Fallback */}
        {filteredClasses.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-8">
            Không tìm thấy khóa học phù hợp.
          </p>
        )}
      </main>
    </div>
  );
};

export default CourseListPage;