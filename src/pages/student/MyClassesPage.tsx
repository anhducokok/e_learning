import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FiClock, FiUsers } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { courseService } from "../../services";
import type { Course } from "../../types/api";

const MyClassesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        const myCourses = await courseService.getMyCourses();
        setCourses(myCourses);
      } catch (err: any) {
        setError(err.message || "Failed to fetch your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const coursesPerPage = 2;
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format level display
  const getLevelDisplay = (level: string) => {
    switch (level) {
      case "beginner":
        return "Cơ bản";
      case "intermediate":
        return "Trung cấp";
      case "advanced":
        return "Nâng cao";
      case "exam":
        return "Luyện thi";
      case "communication":
        return "Giao tiếp";
      default:
        return level;
    }
  };

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
              Khám phá khóa học
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Khóa học của tôi
          </h1>
          <p className="text-gray-600">
            Quản lý và tiếp tục học các khóa học bạn đã đăng ký
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A82828] focus:border-transparent"
          />
        </div>

        {/* No courses message */}
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Bạn chưa đăng ký khóa học nào
            </h3>
            <p className="text-gray-600 mb-6">
              Khám phá các khóa học thú vị và bắt đầu hành trình học tập của bạn
            </p>
            <Link
              to="/courses"
              className="bg-[#A82828] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Khám phá khóa học
            </Link>
          </div>
        ) : (
          <>
            {/* Course grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={course.image || "/images/default-course.jpg"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-course.jpg";
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <FiClock className="text-[#A82828]" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers className="text-[#A82828]" />
                        <span>{course.enrollmentCount || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {getLevelDisplay(course.level)}
                      </span>
                      {course.rating && (
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          <span className="text-sm font-medium">
                            {course.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/learning-room/${course.id}`}
                        className="flex-1 bg-[#A82828] text-white text-center py-2 px-4 rounded-md font-medium hover:bg-red-700 transition"
                      >
                        Tiếp tục học
                      </Link>
                      <Link
                        to={`/courses/${course.id}`}
                        className="flex-1 bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-md font-medium hover:bg-gray-300 transition"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === i + 1
                          ? "bg-[#A82828] text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tiếp
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MyClassesPage;
