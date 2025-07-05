import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService";

const TeacherEnrolledStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await userService.getEnrolledStudentsInMyCourses();
        setStudents(data);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải danh sách sinh viên");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Danh sách sinh viên đã tham gia các khóa học của bạn</h2>
      <table>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Khóa học</th>
            <th>Ngày ghi danh</th>
          </tr>
        </thead>
        <tbody>
          {students.map((item) => (
            <tr key={item.id + item.course.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.course.title}</td>
              <td>{new Date(item.enrolledAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherEnrolledStudentsPage;