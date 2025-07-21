import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { courseService } from "../../services/courseService";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";
import DashboardHeader from "../../components/DashboardHeader";
import AdminLayout from "../../components/admin/AdminLayout";
import type { UserEnrollment } from "../../types/api";

interface Teacher {
  id: string;
  name: string;
  email: string;
}

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherStats, setTeacherStats] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [editingEnrollment, setEditingEnrollment] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'teachers'>('courses');
  const [showEditDate, setShowEditDate] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const teachersData = await userService.getTeachersForAdmin();
      console.log('Teachers data:', teachersData);
      setTeachers(teachersData || []);
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      setError(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherStatistics = async (teacherId: string) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await courseService.getTeacherStatistics(teacherId);
      console.log('Teacher statistics:', stats);
      setTeacherStats(stats);
    } catch (err: any) {
      console.error('Error fetching teacher statistics:', err);
      setError(err.message || "Failed to load teacher statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherCourses = async (teacherId: string, page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const coursesData = await courseService.getCoursesByTeacher(teacherId, page, limit);
      console.log('Teacher courses:', coursesData);
      setCourses(coursesData.courses || []);
    } catch (err: any) {
      console.error('Error fetching teacher courses:', err);
      setError(err.message || "Failed to load teacher courses");
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setSelectedCourse(null);
    setEnrollments([]);
    fetchTeacherStatistics(teacher.id);
    fetchTeacherCourses(teacher.id);
  };

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const coursesData = await courseService.getAllCourses();
      console.log('Courses data:', coursesData);
      setCourses(coursesData || []);
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const courseEnrollments = await userService.getCourseEnrollments(courseId);
      console.log('🔍 [AdminCourses] Course enrollments:', courseEnrollments);
      
      // Log each enrollment structure
      courseEnrollments.forEach((enrollment, index) => {
        console.log(`🔍 [AdminCourses] Enrollment ${index}:`, {
          id: enrollment.id,
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          user: enrollment.user,
          enrolledAt: enrollment.enrolledAt
        });
      });
      
      setEnrollments(courseEnrollments);
    } catch (err: any) {
      console.error('Error fetching enrollments:', err);
      setError(err.message || "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course);
    fetchEnrollments(course.id);
  };

  const handleEditEnrollment = (enrollment: UserEnrollment) => {
    setEditingEnrollment(enrollment.id);
    setEditDate(new Date(enrollment.enrolledAt).toISOString().slice(0, 16));
  };

  const handleUpdateEnrollmentDate = async (enrollment: UserEnrollment) => {
    if (!editDate) return;
    
    console.log('🔍 [AdminCourses] Updating enrollment date:', {
      enrollment,
      userId: enrollment.userId,
      userIdFromUser: enrollment.user?.id,
      courseId: enrollment.courseId,
      editDate
    });
    
    // Use enrollment.user.id as fallback if enrollment.userId is undefined
    const userId = enrollment.userId || enrollment.user?.id;
    
    if (!userId) {
      setError("Cannot determine user ID for this enrollment");
      return;
    }
    
    try {
      await userService.updateEnrollmentDate(
        userId,
        enrollment.courseId,
        new Date(editDate).toISOString()
      );
      
      setEditingEnrollment(null);
      setEditDate("");
      
      // Refresh enrollments
      if (selectedCourse) {
        fetchEnrollments(selectedCourse.id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update enrollment date");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminLayout logoImage={logoImage} activePath="/admin-dashboard/courses">
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 flex flex-col">
          <DashboardHeader title="Quản lý khóa học và đăng ký" />
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Quản lý khóa học và giáo viên</h1>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'courses'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Khóa học
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'teachers'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Giáo viên
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 mb-4 p-3 bg-red-100 rounded">{error}</div>}

            {/* Courses Tab */}
            {activeTab === 'courses' && (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Courses List */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Danh sách khóa học</h2>
                  <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600" hidden>Sửa ngày:</span>
                        <button
                          onClick={() => setShowEditDate(! showEditDate)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            showEditDate ? 'bg-orange-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              showEditDate ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-medium ${showEditDate ? 'text-orange-600' : 'text-gray-400'}`} hidden>
                          {showEditDate ? 'BẬT' : 'TẮT'}
                        </span>
                      </div>
                  <button 
                    onClick={fetchCourses} 
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Reload
                  </button>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {courses.map((course) => (
                    <div 
                      key={course.id} 
                      className={`p-3 border rounded cursor-pointer transition ${
                        selectedCourse?.id === course.id 
                          ? 'bg-blue-100 border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCourseSelect(course)}
                    >
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-gray-600">{course.description}</p>
                      <p className="text-sm text-green-600 font-medium">
                        {Number(course.price).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enrollments List */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {selectedCourse ? `Sinh viên đăng ký: ${selectedCourse.title}` : 'Chọn khóa học để xem danh sách đăng ký'}
                  </h2>
                  
                  {selectedCourse && (
                    <div className="flex items-center gap-3">
                      {/* Toggle Switch for Edit Date */}
                      {/* <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600" hidden>Sửa ngày:</span>
                        <button
                          onClick={() => setShowEditDate(!showEditDate)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            showEditDate ? 'bg-orange-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              showEditDate ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-medium ${showEditDate ? 'text-orange-600' : 'text-gray-400'}`}>
                          {showEditDate ? 'BẬT' : 'TẮT'}
                        </span>
                      </div> */}
                      <button 
                        onClick={() => selectedCourse && fetchEnrollments(selectedCourse.id)} 
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Reload
                      </button>
                    </div>
                  )}
                </div>
                
                {selectedCourse && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {enrollments.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Chưa có sinh viên nào đăng ký khóa học này</p>
                    ) : (
                      enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="border rounded p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{enrollment.user.name}</h4>
                              <p className="text-sm text-gray-600">{enrollment.user.email}</p>
                              
                              {editingEnrollment === enrollment.id ? (
                                <div className="mt-2">
                                  <input
                                    type="datetime-local"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    className="border rounded px-2 py-1 text-sm w-full"
                                  />
                                  <div className="mt-2 space-x-2">
                                    <button
                                      onClick={() => handleUpdateEnrollmentDate(enrollment)}
                                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                      Lưu
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingEnrollment(null);
                                        setEditDate("");
                                      }}
                                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                                    >
                                      Hủy
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-1">
                                  <p className="text-sm text-blue-600">
                                    Đăng ký: {formatDate(enrollment.enrolledAt)}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {editingEnrollment !== enrollment.id && showEditDate && (
                              <button
                                onClick={() => handleEditEnrollment(enrollment)}
                                className="bg-orange-500 text-white px-2 py-1 rounded text-sm hover:bg-orange-600"
                              >
                                Sửa ngày
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Teachers List */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Danh sách giáo viên</h2>
                    <button 
                      onClick={fetchTeachers} 
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Reload
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {teachers.map((teacher) => (
                      <div 
                        key={teacher.id} 
                        className={`p-3 border rounded cursor-pointer transition ${
                          selectedTeacher?.id === teacher.id 
                            ? 'bg-blue-100 border-blue-500' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleTeacherSelect(teacher)}
                      >
                        <h3 className="font-medium">{teacher.name}</h3>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teacher Statistics */}
                {selectedTeacher && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Thống kê giáo viên: {selectedTeacher.name}
                    </h2>
                    
                    {teacherStats ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-purple-600">Tổng khóa học</h3>
                            <p className="text-2xl font-bold text-purple-900">{teacherStats.totalCourses || 0}</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-600">Tổng học viên</h3>
                            <p className="text-2xl font-bold text-blue-900">{teacherStats.totalStudents || 0}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-green-600">Bài học</h3>
                            <p className="text-2xl font-bold text-green-900">{teacherStats.totalLessons || 0}</p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-yellow-600">Bài kiểm tra</h3>
                            <p className="text-2xl font-bold text-yellow-900">{teacherStats.totalQuizzes || 0}</p>
                          </div>
                        </div>
                        
                        {teacherStats.recentEnrollments && teacherStats.recentEnrollments.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-lg font-medium mb-3">Đăng ký gần đây</h3>
                            <div className="space-y-2">
                              {teacherStats.recentEnrollments.slice(0, 3).map((enrollment: any, index: number) => (
                                <div key={index} className="text-sm text-gray-600 border-l-4 border-blue-500 pl-3">
                                  <p className="font-medium">{enrollment.studentName}</p>
                                  <p>{enrollment.courseName} - {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">Đang tải thống kê...</p>
                    )}
                  </div>
                )}

                {/* Teacher Courses */}
                {selectedTeacher && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Khóa học của {selectedTeacher.name}
                    </h2>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {courses.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Giáo viên chưa có khóa học nào</p>
                      ) : (
                        courses.map((course) => (
                          <div 
                            key={course.id} 
                            className={`p-3 border rounded cursor-pointer transition ${
                              selectedCourse?.id === course.id 
                                ? 'bg-blue-100 border-blue-500' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleCourseSelect(course)}
                          >
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.description}</p>
                            <p className="text-sm text-green-600 font-medium">
                              {Number(course.price).toLocaleString('vi-VN')} VNĐ
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminCoursesPage;
