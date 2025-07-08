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
import { courseService, lessonService, quizService, userService} from "../../services";
import type { Course } from "../../types/api";
import DashboardHeader from "../../components/DashboardHeader";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import { useAuth } from "../../contexts/AuthContext";

interface CourseWithDetails extends Course {
  lessonsCount?: number;
  quizzesCount?: number;
}

const CourseManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseWithDetails | null>(
    null
  );
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [studentsByCourse, setStudentsByCourse] = useState<{ [courseId: string]: any[] }>({});
  const [loadingStudents, setLoadingStudents] = useState<{ [courseId: string]: boolean }>({});
  const [errorStudents, setErrorStudents] = useState<{ [courseId: string]: string | null }>({});
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  // Pagination state for API calls
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 6;

  // Filter courses based on search query (client-side filtering)
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate filtered results (client-side pagination for search)
  const displayedCourses = searchQuery 
    ? filteredCourses.slice(
        (currentPage - 1) * coursesPerPage,
        currentPage * coursesPerPage
      )
    : courses; // When not searching, API already returns paginated results

  const displayTotalPages = searchQuery 
    ? Math.ceil(filteredCourses.length / coursesPerPage)
    : totalPages;

  console.log('🔍 [CourseManagement] Debug display logic:');
  console.log('- courses.length:', courses.length);
  console.log('- filteredCourses.length:', filteredCourses.length);
  console.log('- displayedCourses.length:', displayedCourses.length);
  console.log('- searchQuery:', searchQuery);
  console.log('- currentPage:', currentPage);
  console.log('- totalPages:', totalPages);
  console.log('- displayTotalPages:', displayTotalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (user?.id) {
      fetchCourses();
    }
  }, [currentPage, searchQuery, user?.id]);

  // Debug effect to track displayedCourses changes
  useEffect(() => {
    console.log('🎨 [CourseManagement] displayedCourses changed:', displayedCourses);
    console.log('🎨 [CourseManagement] displayedCourses.length:', displayedCourses.length);
    if (displayedCourses.length > 0) {
      console.log('🎨 [CourseManagement] First course:', displayedCourses[0]);
    }
  }, [displayedCourses]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= displayTotalPages) {
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

  // Thumbnail management state (URL-based)
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [updatingThumbnail, setUpdatingThumbnail] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [CourseManagement] Starting fetchCourses...');
      console.log('🔍 [CourseManagement] Current user:', user);
      console.log('🔍 [CourseManagement] User ID:', user?.id);
      console.log('🔍 [CourseManagement] Search query:', searchQuery);
      console.log('🔍 [CourseManagement] Current page:', currentPage);
      
      // Ensure we have the teacher's ID
      if (!user?.id) {
        console.error('❌ [CourseManagement] No user ID found');
        setError("Không thể xác định thông tin giáo viên");
        return;
      }
      
      if (searchQuery) {
        console.log('🔍 [CourseManagement] Fetching courses for search with teacher ID:', user.id);
        // When searching, fetch all courses and filter client-side
        const allCoursesResponse = await courseService.getCoursesByTeacher(user.id, 1, 100);
        console.log('📊 [CourseManagement] Search - API response:', allCoursesResponse);
        
        // Handle both array response and object response for search
        let allCourses: any[] = [];
        if (Array.isArray(allCoursesResponse)) {
          allCourses = allCoursesResponse;
        } else if (allCoursesResponse && allCoursesResponse.courses) {
          allCourses = allCoursesResponse.courses;
        }
        
        console.log('📊 [CourseManagement] Search - Extracted courses:', allCourses);
        
        const coursesWithDetails = await Promise.all(
          allCourses.map(async (course) => {
            try {
              console.log(`🔍 [CourseManagement] Fetching details for course: ${course.id}`);
              const [lessons, quizzes] = await Promise.all([
                lessonService.getLessonsByCourse(course.id),
                quizService.getQuizzesByCourse(course.id),
              ]);
              console.log(`📊 [CourseManagement] Course ${course.id} - Lessons:`, lessons.length, 'Quizzes:', quizzes.length);
              return {
                ...course,
                lessonsCount: lessons.length,
                quizzesCount: quizzes.length,
              };
            } catch (error) {
              console.error(`❌ [CourseManagement] Error fetching details for course ${course.id}:`, error);
              return {
                ...course,
                lessonsCount: 0,
                quizzesCount: 0,
              };
            }
          })
        );
         const toggleStudentList = async (courseId: string) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }

    setExpandedCourseId(courseId);
    setLoadingStudents((prev) => ({ ...prev, [courseId]: true }));
    setErrorStudents((prev) => ({ ...prev, [courseId]: null }));

    try {
      const students = await userService.getStudentsByCourse(courseId);
      setStudentsByCourse((prev) => ({ ...prev, [courseId]: students }));
    } catch (error) {
      setErrorStudents((prev) => ({
        ...prev,
        [courseId]: (error && typeof error === "object" && "message" in error)
          ? (error as { message?: string }).message || "Không thể tải danh sách học viên"
          : "Không thể tải danh sách học viên",
      }));
    } finally {
      setLoadingStudents((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const handleToggleStudents = async (courseId: string) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }
    setExpandedCourseId(courseId);
    if (!studentsByCourse[courseId]) {
      setLoadingStudents((prev) => ({ ...prev, [courseId]: true }));
      setErrorStudents((prev) => ({ ...prev, [courseId]: null }));
      try {
        const students = await userService.getStudentsByCourse(courseId);
        setStudentsByCourse((prev) => ({ ...prev, [courseId]: students }));
      } catch (err: any) {
        setErrorStudents((prev) => ({ ...prev, [courseId]: err.message || "Không thể tải danh sách học viên" }));
      } finally {
        setLoadingStudents((prev) => ({ ...prev, [courseId]: false }));
      }
    }
  };

        console.log('📊 [CourseManagement] Search - Final courses with details:', coursesWithDetails);
        setCourses(coursesWithDetails);
        setTotalPages(Math.ceil(coursesWithDetails.length / coursesPerPage));
      } else {
        console.log('🔍 [CourseManagement] Fetching paginated courses with teacher ID:', user.id);
        // When not searching, use paginated API with teacher ID
        const response = await courseService.getCoursesByTeacher(user.id, currentPage, coursesPerPage);
        console.log('📊 [CourseManagement] Paginated - Full API response:', response);
        console.log('📊 [CourseManagement] Paginated - Response type:', typeof response);
        console.log('📊 [CourseManagement] Paginated - Response keys:', Object.keys(response || {}));
        console.log('📊 [CourseManagement] Paginated - Is Array:', Array.isArray(response));
        
        // Handle both array response and object response
        let paginatedCourses: any[] = [];
        let totalCount = 0;
        
        if (Array.isArray(response)) {
          // If response is directly an array
          console.log('📊 [CourseManagement] Response is array - using direct response');
          paginatedCourses = response;
          totalCount = response.length; // For array response, we don't have total pagination info
        } else if (response && response.courses) {
          // If response is object with courses property
          console.log('📊 [CourseManagement] Response is object - using response.courses');
          paginatedCourses = response.courses;
          totalCount = response.total || 0;
        } else {
          console.log('📊 [CourseManagement] Unexpected response format');
          paginatedCourses = [];
          totalCount = 0;
        }
        
        console.log('📊 [CourseManagement] Paginated - Final extracted courses:', paginatedCourses);
        console.log('📊 [CourseManagement] Paginated - Courses count:', paginatedCourses.length);
        console.log('📊 [CourseManagement] Paginated - Total count:', totalCount);
        
        const coursesWithDetails = await Promise.all(
          paginatedCourses.map(async (course) => {
            try {
              console.log(`🔍 [CourseManagement] Fetching details for course: ${course.id}`);
              const [lessons, quizzes] = await Promise.all([
                lessonService.getLessonsByCourse(course.id),
                quizService.getQuizzesByCourse(course.id),
              ]);
              console.log(`📊 [CourseManagement] Course ${course.id} - Lessons:`, lessons.length, 'Quizzes:', quizzes.length);
              return {
                ...course,
                lessonsCount: lessons.length,
                quizzesCount: quizzes.length,
              };
            } catch (error) {
              console.error(`❌ [CourseManagement] Error fetching details for course ${course.id}:`, error);
              return {
                ...course,
                lessonsCount: 0,
                quizzesCount: 0,
              };
            }
          })
        );
        
        console.log('📊 [CourseManagement] Paginated - Final courses with details:', coursesWithDetails);
        console.log('📊 [CourseManagement] Total from API:', totalCount);
        setCourses(coursesWithDetails);
        setTotalPages(Math.ceil(totalCount / coursesPerPage));
      }
    } catch (err: any) {
      console.error('❌ [CourseManagement] Error in fetchCourses:', err);
      console.error('❌ [CourseManagement] Error message:', err.message);
      console.error('❌ [CourseManagement] Error response:', err.response);
      setError(err.message || "Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
      console.log('✅ [CourseManagement] fetchCourses completed');
    }
  };

  const handleCreateCourse = async () => {
    try {
      console.log('🔍 [CourseManagement] Creating course with data:', formData);
      console.log('🔍 [CourseManagement] Current user ID:', user?.id);
      console.log('🔍 [CourseManagement] Has thumbnail URL:', !!thumbnailUrl);
      
      if (!user?.id) {
        setError("Không thể xác định thông tin giáo viên");
        return;
      }
      
      // Create course data with thumbnail URL in image field
      const courseDataWithImage = {
        ...formData,
        image: thumbnailUrl || formData.image
      };
      
      // Pass teacher ID to courseService
      const createdCourse = await courseService.createCourse(courseDataWithImage, user.id);
      console.log('✅ [CourseManagement] Course created successfully:', createdCourse);
      
      setShowCreateForm(false);
      resetForm();
      fetchCourses();
    } catch (err: any) {
      console.error('❌ [CourseManagement] Error creating course:', err);
      setError(err.message || "Không thể tạo khóa học");
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      console.log('🔍 [CourseManagement] Updating course:', editingCourse.id);
      console.log('🔍 [CourseManagement] Update data:', formData);
      console.log('🔍 [CourseManagement] Has new thumbnail URL:', !!thumbnailUrl);
      
      // Update course data with thumbnail URL in image field  
      const courseDataWithImage = {
        ...formData,
        image: thumbnailUrl || formData.image
      };
      
      await courseService.updateCourse(editingCourse.id, courseDataWithImage);
      console.log('✅ [CourseManagement] Course updated successfully');
      
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (err: any) {
      console.error('❌ [CourseManagement] Error updating course:', err);
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
    setThumbnailUrl("");
  };

  const handleThumbnailUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(e.target.value);
  };

  const handleUpdateThumbnailUrl = async (courseId: string, url: string) => {
    if (!url.trim()) return;
    
    try {
      setUpdatingThumbnail(true);
      await courseService.updateThumbnailUrl(courseId, url);
      console.log('✅ [CourseManagement] Thumbnail URL updated successfully');
      fetchCourses(); // Refresh to show updated course
    } catch (error) {
      console.error('❌ [CourseManagement] Error updating thumbnail URL:', error);
      setError("Không thể cập nhật ảnh thumbnail");
    } finally {
      setUpdatingThumbnail(false);
    }
  };

  const handleDeleteThumbnail = async (courseId: string) => {
    try {
      await courseService.deleteThumbnail(courseId);
      console.log('✅ [CourseManagement] Thumbnail deleted successfully');
      fetchCourses(); // Refresh to show updated course
    } catch (error) {
      console.error('❌ [CourseManagement] Error deleting thumbnail:', error);
      setError("Không thể xóa ảnh thumbnail");
    }
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
    
    // Set thumbnail URL if editing existing course
    setThumbnailUrl(course.image || "");
    
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
            {/* Debug info trên UI */}
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
              <strong>Debug Info:</strong> Total courses: {courses.length} | Displayed: {displayedCourses.length} | Search: "{searchQuery}" | Page: {currentPage}/{displayTotalPages} | User ID: {user?.id}
            </div>

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
                    console.log('🔄 Manual refresh triggered');
                    fetchCourses();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Refresh
                </button>
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

                    {/* Thumbnail URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Ảnh thumbnail
                      </label>
                      <input
                        type="url"
                        value={thumbnailUrl}
                        onChange={handleThumbnailUrlChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      {thumbnailUrl && (
                        <div className="mt-2">
                          <img
                            src={thumbnailUrl}
                            alt="Thumbnail preview"
                            className="w-32 h-20 object-cover rounded border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {updatingThumbnail && (
                        <div className="mt-2 text-sm text-blue-600">
                          Đang cập nhật thumbnail...
                        </div>
                      )}
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

            {/* Debug info - remove this after fixing */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Debug Info:</strong> Total courses: {courses.length} | 
                Displayed: {displayedCourses.length} | 
                Search: "{searchQuery}" | 
                Page: {currentPage}/{totalPages} |
                User ID: {user?.id}
              </p>
            </div>

            {/* Danh sách khóa học */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCourses.map((course: CourseWithDetails) => (
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
                              `/courses/${course.id}`,
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
                      <div className="flex gap-2 mb-2">
                        <Link
                          to={`/teacher/courses/${course.id}/manage`}
                          className="flex-1 bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700"
                        >
                          Quản lý nội dung
                        </Link>
                        
                        {/* Thumbnail management buttons */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              const url = prompt('Nhập URL ảnh thumbnail:');
                              if (url?.trim()) {
                                handleUpdateThumbnailUrl(course.id, url.trim());
                              }
                            }}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            title="Cập nhật thumbnail URL"
                          >
                            📷
                          </button>
                          
                          {course.image && (
                            <button
                              onClick={() => handleDeleteThumbnail(course.id)}
                              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                              title="Xóa thumbnail"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                              {/* Nút hiển thị danh sách học viên */}
                  <button
                    onClick={async () => {
                      setSelectedCourseId(course.id);
                      setShowStudentModal(true);
                      if (!studentsByCourse[course.id]) {
                        setLoadingStudents((prev) => ({ ...prev, [course.id]: true }));
                        setErrorStudents((prev) => ({ ...prev, [course.id]: null }));
                        try {
                          const students = await userService.getStudentsByCourse(course.id);
                          setStudentsByCourse((prev) => ({ ...prev, [course.id]: students }));
                        } catch (err: any) {
                          setErrorStudents((prev) => ({ ...prev, [course.id]: err.message || "Không thể tải danh sách học viên" }));
                        } finally {
                          setLoadingStudents((prev) => ({ ...prev, [course.id]: false }));
                        }
                      }
                    }}
                    className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Xem sinh viên
                  </button>

                  {/* Modal hiển thị danh sách sinh viên */}
                  {showStudentModal && selectedCourseId === course.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
                        <button
                          onClick={() => setShowStudentModal(false)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                        >
                          ×
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Danh sách sinh viên đăng ký</h3>
                        {loadingStudents[course.id] && <div>Đang tải danh sách sinh viên...</div>}
                        {errorStudents[course.id] && <div className="text-red-500">{errorStudents[course.id]}</div>}
                        {studentsByCourse[course.id] && studentsByCourse[course.id].length > 0 ? (
                          <table className="w-full mt-2 border">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-2 py-1 border">Họ tên</th>
                                <th className="px-2 py-1 border">Email</th>
                                <th className="px-2 py-1 border">Tiến độ</th>
                                <th className="px-2 py-1 border">Ngày ghi danh</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentsByCourse[course.id].map((item: any) => (
                                <tr key={item.student.id}>
                                  <td className="px-2 py-1 border">{item.student.name}</td>
                                  <td className="px-2 py-1 border">{item.student.email}</td>
                                  <td className="px-2 py-1 border">{item.enrollmentDetails.progress}%</td>
                                  <td className="px-2 py-1 border">{new Date(item.enrollmentDetails.enrolledAt).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          !loadingStudents[course.id] && <div>Chưa có sinh viên nào đăng ký khóa học này.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Hiển thị khi không có khóa học */}
            {displayedCourses.length === 0 && !loading && (
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
            {displayTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>

                  {Array.from({ length: displayTotalPages }, (_, i) => (
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
                    disabled={currentPage === displayTotalPages}
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
