import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { courseService, lessonService, quizService } from "../../services";
import type { Course } from "../../types/api";
import DashboardHeader from "../../components/DashboardHeader";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";
import TeacherLayout from "../../components/teacher/TeacherLayout";

interface CourseWithDetails extends Course {
  lessonsCount?: number;
  quizzesCount?: number;
}

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseWithDetails | null>(
    null
  );

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const coursesPerPage = 6;
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "BEGINNER" as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    duration: "",
    image: "",
    price: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const allCourses = await courseService.getAllCourses();

      const coursesWithDetails = await Promise.all(
        allCourses.map(async (course) => {
          try {
            const [lessons, quizzes] = await Promise.all([
              lessonService.getLessonsByCourse(course.id),
              quizService.getQuizzesByCourse(course.id),
            ]);
            return {
              ...course,
              lessonsCount: lessons.length,
              quizzesCount: quizzes.length,
            };
          } catch (error) {
            return {
              ...course,
              lessonsCount: 0,
              quizzesCount: 0,
            };
          }
        })
      );

      setCourses(coursesWithDetails);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      await courseService.createCourse(formData);
      setShowCreateForm(false);
      resetForm();
      fetchCourses();
    } catch (err: any) {
      setError(err.message || "Không thể tạo khóa học");
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      await courseService.updateCourse(editingCourse.id, formData);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật khóa học");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) return;

    try {
      await courseService.deleteCourse(courseId);
      fetchCourses();
    } catch (err: any) {
      setError(err.message || "Không thể xóa khóa học");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      level: "BEGINNER",
      duration: "",
      image: "",
      price: 0,
    });
  };

  const openEditForm = (course: CourseWithDetails) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration || "",
      image: course.image || "",
      price: course.price || 0,
    });
    setShowCreateForm(true);
  };

  const teacherNotifications = [
    {
      id: "1",
      title: "Quản lý khóa học",
      message: "Chào mừng đến với trang quản lý khóa học",
      time: "Bây giờ",
      type: "info" as const,
      read: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <TeacherLayout logoImage={logoImage} activePath="/teacher/courses">
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 flex flex-col">
          <DashboardHeader
            title="Quản lý khóa học"
            notifications={teacherNotifications}
          />

          <div className="flex-1 p-8">
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Tiêu đề và ô tìm kiếm */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Khóa học của tôi
              </h1>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingCourse(null);
                    resetForm();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Tạo khóa học mới
                </button>
              </div>
            </div>

            {/* Form tạo/sửa khóa học */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <h2 className="text-xl font-bold mb-4">
                    {editingCourse ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên khóa học
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                        placeholder="Nhập tên khóa học"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                        placeholder="Nhập mô tả khóa học"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cấp độ
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            level: e.target.value as any,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                      >
                        <option value="BEGINNER">Người mới bắt đầu</option>
                        <option value="INTERMEDIATE">Trung cấp</option>
                        <option value="ADVANCED">Nâng cao</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời lượng
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                        placeholder="Ví dụ: 8 tuần, 40 giờ"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá (VNĐ)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingCourse(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={
                        editingCourse ? handleUpdateCourse : handleCreateCourse
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      {editingCourse ? "Cập nhật" : "Tạo mới"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Danh sách khóa học */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-r from-red-500 to-purple-600 flex items-center justify-center">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpenIcon className="h-16 w-16 text-white" />
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                        {course.level}
                      </span>
                      <span>{course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <BookOpenIcon className="h-4 w-4" />
                          {course.lessonsCount || 0} bài học
                        </span>
                        <span className="flex items-center gap-1">
                          <QuestionMarkCircleIcon className="h-4 w-4" />
                          {course.quizzesCount || 0} quiz
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-red-600">
                        {course.price
                          ? `${course.price.toLocaleString()} VNĐ`
                          : "Miễn phí"}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            window.open(
                              `/learning-session/${course.id}`,
                              "_blank"
                            )
                          }
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                          title="Xem trước"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditForm(course)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Xóa"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        to={`/teacher/courses/${course.id}/manage`}
                        className="w-full bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 block"
                      >
                        Quản lý nội dung
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hiển thị khi không có khóa học */}
            {filteredCourses.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery
                    ? "Không tìm thấy khóa học"
                    : "Chưa có khóa học nào"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery
                    ? "Không có khóa học nào khớp với tìm kiếm của bạn"
                    : "Bắt đầu tạo khóa học đầu tiên của bạn"}
                </p>
                <button
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingCourse(null);
                    resetForm();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Tạo khóa học mới
                </button>
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
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
          </div>
        </main>
      </div>
    </TeacherLayout>
  );
};

export default CourseManagementPage;
