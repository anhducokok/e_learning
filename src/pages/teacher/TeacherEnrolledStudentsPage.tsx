import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { courseService } from "../../services/courseService";

const TeacherEnrolledStudentsPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<{ [courseId: string]: boolean }>({});
  const [studentsByCourse, setStudentsByCourse] = useState<{ [courseId: string]: any[] }>({});
  const [loading, setLoading] = useState<{ [courseId: string]: boolean }>({});
  const [error, setError] = useState<{ [courseId: string]: string | null }>({});

  useEffect(() => {
    courseService.getMyCourses().then(setCourses);
  }, []);

  const handleToggle = async (courseId: string) => {
    setExpanded((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
    if (!studentsByCourse[courseId] && !loading[courseId]) {
      setLoading((prev) => ({ ...prev, [courseId]: true }));
      setError((prev) => ({ ...prev, [courseId]: null }));
      try {
        const students = await userService.getStudentsByCourse(courseId);
        setStudentsByCourse((prev) => ({ ...prev, [courseId]: students }));
      } catch (err: any) {
        setError((prev) => ({ ...prev, [courseId]: err.message || "Lỗi khi tải danh sách sinh viên" }));
      } finally {
        setLoading((prev) => ({ ...prev, [courseId]: false }));
      }
    }
  };

  return (
    <div>
      <h2>Danh sách các khóa học của bạn</h2>
      {courses.length === 0 && <div>Bạn chưa tạo khóa học nào.</div>}
      {courses.map((course) => (
        <div key={course.id} style={{ marginBottom: 24, border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong>{course.title}</strong>
            </div>
            <button onClick={() => handleToggle(course.id)} style={{ padding: '6px 16px', borderRadius: 4, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
              {expanded[course.id] ? 'Ẩn sinh viên' : 'Xem sinh viên'}
            </button>
          </div>
          {expanded[course.id] && (
            <div style={{ marginTop: 16 }}>
              {loading[course.id] && <div>Đang tải...</div>}
              {error[course.id] && <div style={{ color: 'red' }}>{error[course.id]}</div>}
              {studentsByCourse[course.id] && studentsByCourse[course.id].length > 0 ? (
                <table style={{ width: '100%', marginTop: 8 }}>
                  <thead>
                    <tr>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Tiến độ</th>
                      <th>Ngày ghi danh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsByCourse[course.id].map((item: any) => (
                      <tr key={item.student.id}>
                        <td>{item.student.name}</td>
                        <td>{item.student.email}</td>
                        <td>{item.enrollmentDetails.progress}%</td>
                        <td>{new Date(item.enrollmentDetails.enrolledAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : !loading[course.id] && <div>Chưa có sinh viên nào đăng ký khóa học này.</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeacherEnrolledStudentsPage;