import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { classService } from "../../services/classService";
import { courseService } from "../../services/courseService";
import { API_BASE_URL } from "../../config/api";
import { DEFAULT_IMAGES } from "../../config/constants";
import type { Class, Course } from "../../types/api";
import { useAuth } from "../../contexts/AuthContext";

const CourseListPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<
    Record<string, boolean>
  >({});
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchClassesWithCourses = async () => {
      try {
        setLoading(true);

        const classesResponse = await fetch(`${API_BASE_URL}/classes`);

        if (!classesResponse.ok) {
          throw new Error(
            `Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`
          );
        }
        const classesData = await classesResponse.json();

        if (!classesData.data || !Array.isArray(classesData.data)) {
          throw new Error("Invalid classes data format");
        }
        const classesWithoutCourses = classesData.data;

        // Fetch courses for each class
        const classesWithCourses = await Promise.all(
          classesWithoutCourses.map(async (classItem: Class) => {
            try {
              const coursesResponse = await fetch(
                `${API_BASE_URL}/classes/${classItem.id}/courses`
              );

              if (!coursesResponse.ok) {
                throw new Error(
                  `Failed to fetch courses: ${coursesResponse.status}`
                );
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
                statusMap[course.id] = false;
              }
            }
          }

          setEnrollmentStatus(statusMap);
        }
      } catch (err: any) {
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
    { id: "HSK4", name: "HSK4" },
    { id: "HSK1-3", name: "HSK1-3" },
    { id: "Tiếng Trung Giao Tiếp", name: "Tiếng Trung Giao Tiếp" },
  ];
  // Get all courses from all classes, filtered by category
  const getFilteredCourses = () => {
    const allCourses: (Course & { className: string })[] = [];

    classes.forEach((classItem) => {
      if (classItem.courses) {
        classItem.courses.forEach((course) => {
          allCourses.push({
            ...course,
            className: classItem.name, // Add class name to course for reference
          });
        });
      }
    });

    if (activeCategory === "all") {
      return allCourses;
    }
    // Filter by class name instead of course level
    return allCourses.filter((course) => {
      const className = course.className.toLowerCase();

      if (activeCategory === "HSK4") {
        return className.includes("hsk 4") || className.includes("hsk4");
      } else if (activeCategory === "HSK1-3") {
        return (
          className.includes("hsk 1") ||
          className.includes("hsk 2") ||
          className.includes("hsk 3") ||
          className.includes("hsk1-3") ||
          className.includes("hsk1") ||
          className.includes("hsk2") ||
          className.includes("hsk3")
        );
      } else if (activeCategory === "Tiếng Trung Giao Tiếp") {
        return (
          className.includes("giao tiếp") ||
          className.includes("giao tien") ||
          className.includes("conversation") ||
          className.includes("speaking") ||
          className.includes("co ban") ||
          className.includes("cơ bản")
        );
      }
      return false;
    });
  };
  if (loading) {
    return (
      <div className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 w-full">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#A82828]"></div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 w-full">
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
        </div>
      </div>
    );
  }
  const filteredCourses = getFilteredCourses();
  return (
    <div className="bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrollmentStatus[course.id] || false;

            return (
              <article
                key={course.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
              >                <Link to={`/courses/${course.id}`} className="block mb-4">
                  <img
                    src={
                      course.image ||
                      DEFAULT_IMAGES.COURSE
                    }
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-md"
                    loading="lazy"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = DEFAULT_IMAGES.COURSE;
                    }}
                  />
                </Link>

                <div className="space-y-3">
                  <Link
                    to={`/courses/${course.id}`}
                    className="hover:text-[#A82828] transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {course.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {course.className}
                    </span>
                    <span className="text-gray-600 capitalize">
                      {course.level}
                    </span>
                  </div>

                  {course.duration && (
                    <div className="text-sm text-gray-500">
                      Thời lượng: {course.duration}
                    </div>
                  )}

                  {course.price !== null &&
                    course.price !== undefined &&
                    course.price > 0 && (
                      <div className="text-lg font-semibold text-[#A82828]">
                        {course.price.toLocaleString()} VND
                      </div>
                    )}

                  {course.instructor && (
                    <div className="text-sm text-gray-500">
                      Giảng viên: {course.instructor.name}
                    </div>
                  )}
                  {/* Action Button */}
                  <div className="pt-2">
                    {isAuthenticated ? (
                      isEnrolled ? (
                        <Link
                          to={`/learning-session/${course.id}`}
                          className="block w-full text-center py-2 rounded-md font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition"
                        >
                          Tiếp tục học
                        </Link>
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
                </div>
              </article>
            );
          })}
        </div>

        {/* No Courses Fallback */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">
              Không tìm thấy khóa học phù hợp
            </p>
            <p className="text-gray-400 text-sm">
              Thử chọn danh mục khác hoặc quay lại sau
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListPage;