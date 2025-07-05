import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { StarIcon, UsersIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

type Course = {
  id: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  students: number;
  hours: number;
  exercises: number;
  level?: string;
  instructor?: { name: string };
};

function getLevelDisplay(level?: string) {
  switch (level) {
    case "beginner":
      return "Sơ cấp";
    case "intermediate":
      return "Trung cấp";
    case "advanced":
      return "Cao cấp";
    default:
      return "Không xác định";
  }
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {        const res = await fetch(`${API_BASE_URL}/api/courses/${id}`);
        const data = await res.json();
        setCourse(data.data);
      } catch (err) {
        // Failed to fetch course
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (!course || !isAuthenticated) return;

    const checkEnrollment = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(
          `${API_BASE_URL}/api/courses/${course.id}/enrollment-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );        if (res.ok) {
          const data = await res.json();
          setIsEnrolled(data.data?.isEnrolled || false);
        }
      } catch (err) {
        // Failed to check enrollment status
      }
    };

    checkEnrollment();
  }, [course, isAuthenticated]);

  const handleEnrollmentToggle = async () => {
    if (!isAuthenticated || !course) return;
    setIsEnrolling(true);

    try {
      const token = localStorage.getItem("auth_token");
      const method = isEnrolled ? "DELETE" : "POST";

      const res = await fetch(`${API_BASE_URL}/api/courses/${course.id}/enroll`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to update enrollment");      setIsEnrolled(!isEnrolled);
    } catch (err: any) {
      alert(err.message || "Lỗi ghi danh");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!course)
    return <div className="p-6 text-center">Đang tải khóa học...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      {/* Bên trái */}
      <div className="md:col-span-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {course.title}
        </h1>

        <p className="text-gray-700 text-lg mb-4">{course.description}</p>

        <div className="text-sm text-gray-600 space-y-1 mb-6">
          <p>
            <strong>Giảng viên:</strong>{" "}
            {course.instructor?.name || "Chưa có thông tin"}
          </p>
          <p>
            <strong>Cấp độ:</strong> {getLevelDisplay(course.level)}
          </p>
          <p>
            <strong>Giá:</strong>{" "}
            {course.price?.toLocaleString("vi-VN") || "Liên hệ"} VNĐ
          </p>
          {course.rating && (
            <p>
              <strong>Đánh giá:</strong> {course.rating} ⭐
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Nội dung khóa học</h2>
          {/* <p className="text-gray-700 leading-relaxed">{course.content}</p> */}

          <h3 className="text-xl font-semibold mt-6 mb-3">Mục tiêu khóa học</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• Nắm vững kiến thức cơ bản về {course.title.toLowerCase()}</li>
            <li>• Phát triển kỹ năng thực hành thông qua bài tập</li>
            <li>• Chuẩn bị tốt cho các kỳ thi và ứng dụng thực tế</li>
            <li>• Tự tin giao tiếp và sử dụng trong công việc</li>
          </ul>
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 space-y-4 h-fit">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover rounded-md"
          onError={(e) => {
            e.currentTarget.src = "/images/china_girl.jpg";
          }}
        />

        <div className="space-y-1">
          <div className="text-2xl font-bold text-[#A82828]">
            {Number(course.price).toLocaleString("vi-VN")} VNĐ
          </div>
          <div className="line-through text-gray-400 text-sm">
            {Number(course.oldPrice).toLocaleString("vi-VN")} VNĐ
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-yellow-600">
          <StarIcon size={16} />
          <span>{course.rating} ⭐</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <UsersIcon size={16} />
          <span>{course.students} học viên</span>
        </div>

        <div className="text-sm text-gray-500">
          ⏱ {course.hours} giờ học · 📝 {course.exercises} bài tập
        </div>        {isAuthenticated ? (
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

        <Link
          to="/courses"
          className="block text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-md text-gray-800 font-semibold transition"
        >
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
}
