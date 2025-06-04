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
            <div className="text-red-600 text-lg mb-4">
              Có lỗi xảy ra khi tải khóa học
            </div>
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
    <div className="min-h-screen bg-white text-white font-sans">
      <main className="max-w-7xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-extrabold mb-12 tracking-wide drop-shadow-lg select-none text-red-500">
          Khóa học tương lai
        </h1>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
              relative px-7 py-2 rounded-full font-semibold transition-all duration-500 
              cursor-pointer 
              ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white shadow-[0_0_20px_#dc2626] scale-110"
                  : "bg-transparent border border-red-600 text-red-300 hover:text-white hover:border-red-500"
              }
              hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-red-400/60
            `}
            >
              {cat.name}
              {activeCategory === cat.id && (
                <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 via-red-400 to-red-500 blur opacity-70 animate-pulse"></span>
              )}
            </button>
          ))}
        </div>

        {/* Classes list */}
        <div className="space-y-12">
          {filteredClasses.map((classItem) => {
            const isExpanded = expandedClasses.has(classItem.id);

            return (
              <section
                key={classItem.id}
                className="backdrop-blur-lg bg-white/10 border border-red-700 rounded-3xl shadow-lg overflow-hidden"
              >
                {/* Class header */}
                <header
                  onClick={() => toggleClassExpansion(classItem.id)}
                  className="flex items-center justify-between cursor-pointer select-none p-8 hover:bg-white/20 transition-colors duration-800"
                  aria-expanded={isExpanded}
                >
                  <div>
                    <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-md text-red-400">
                      {classItem.name}
                    </h2>
                    {classItem.description && (
                      <p className="mt-2 max-w-3xl text-lg text-red-200 line-clamp-2 tracking-wide">
                        {classItem.description}
                      </p>
                    )}
                    <p className="mt-4 text-sm font-semibold text-red-400">
                      {classItem.courses?.length || 0} khóa học
                    </p>
                  </div>
                  <button
                    aria-label={isExpanded ? "Thu gọn lớp" : "Mở rộng lớp"}
                    className={`w-14 h-14 rounded-full border border-red-500 flex items-center justify-center
                    text-red-400 hover:text-white hover:bg-red-600 transition-transform duration-300
                    ${isExpanded ? "rotate-180" : ""}
                  `}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-8 h-8"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </header>

                {/* Courses grid */}
                {isExpanded && (
                  <div className="p-8 bg-gradient-to-br from-red-900/70 via-red-800/70 to-red-700/70 rounded-b-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {classItem.courses?.map((course) => {
                        const isEnrolled = enrollmentStatus[course.id] || false;
                        const isEnrolling = enrollingCourses.has(course.id);

                        return (
                          <article
                            key={course.id}
                            className="relative flex flex-col bg-white/10 rounded-2xl shadow-lg backdrop-blur-md border border-red-700 overflow-hidden cursor-pointer
                            transition-transform duration-400 hover:scale-[1.05] hover:shadow-[0_0_40px_#b91c1c] hover:border-red-600"
                            tabIndex={0}
                          >
                            <Link
                              to={`/courses/${course.id}`}
                              className="block h-56 overflow-hidden rounded-t-2xl"
                            >
                              <img
                                src={
                                  course.thumbnail ||
                                  "https://images.unsplash.com/photo-1522134939204-9b9957145632?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0"
                                }
                                alt={course.title}
                                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110 hover:brightness-110"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1522134939204-9b9957145632?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0";
                                }}
                              />
                              <div
                                className="absolute inset-0 rounded-t-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500
                              bg-gradient-to-tr from-red-600 via-red-500 to-red-600 blur-[30px]"
                              />
                            </Link>

                            <div className="flex flex-col flex-grow p-6 space-y-3">
                              <Link
                                to={`/courses/${course.id}`}
                                className="hover:text-red-400"
                              >
                                <h3 className="text-2xl font-extrabold leading-snug line-clamp-2">
                                  {course.title}
                                </h3>
                              </Link>

                              <p className="text-red-200 text-base line-clamp-3 tracking-wide">
                                {course.description}
                              </p>

                              <div className="flex items-center justify-between text-sm text-red-300 font-medium">
                                <span className="capitalize bg-red-700/50 rounded-full px-3 py-1">
                                  {course.level}
                                </span>
                                {course.duration && (
                                  <span>{course.duration}</span>
                                )}
                                {course.price && (
                                  <span className="text-red-400 font-semibold">
                                    {course.price.toLocaleString()} VND
                                  </span>
                                )}
                              </div>

                              {course.instructor && (
                                <div className="text-red-300 text-sm">
                                  Giảng viên:{" "}
                                  <span className="font-semibold">
                                    {course.instructor.name}
                                  </span>
                                </div>
                              )}

                              {/* Enrollment Button */}
                              {isAuthenticated ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleEnrollment(course.id, isEnrolled);
                                  }}
                                  disabled={isEnrolling}
                                  className={`
                                  relative w-full py-3 rounded-xl font-bold text-lg tracking-wide text-white 
                                  overflow-hidden
                                  transition-colors duration-500
                                  ${
                                    isEnrolled
                                      ? "bg-red-700 hover:bg-red-600"
                                      : "bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:brightness-110"
                                  }
                                  ${
                                    isEnrolling
                                      ? "cursor-wait opacity-70"
                                      : "cursor-pointer"
                                  }
                                `}
                                >
                                  <span className="absolute inset-0 rounded-xl bg-white opacity-10 animate-pulse"></span>
                                  <span className="relative z-10">
                                    {isEnrolling
                                      ? "Đang xử lý..."
                                      : isEnrolled
                                      ? "Hủy ghi danh"
                                      : "Đăng ký ngay"}
                                  </span>
                                </button>
                              ) : (
                                <Link
                                  to="/auth"
                                  className="block w-full text-center py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:brightness-110"
                                >
                                  Đăng nhập để đăng ký
                                </Link>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    {(!classItem.courses || classItem.courses.length === 0) && (
                      <p className="text-center text-red-300 py-16 text-xl font-semibold">
                        Không có khóa học nào trong lớp này
                      </p>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* No courses found fallback */}
        {filteredClasses.length === 0 && (
          <p className="text-center text-red-300 text-lg mt-24">
            Không tìm thấy lớp học phù hợp.
          </p>
        )}
      </main>
    </div>
  );
};

export default CourseListPage;
