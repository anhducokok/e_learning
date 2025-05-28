import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  date: string;
  duration: string;
  content: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Khóa học Tiếng Trung căn bản",
    description:
      "Bắt đầu hành trình học tiếng Trung với những kiến thức căn bản nhất.",
    image: "/images/course1.jpg",
    category: "beginner",
    author: "Nguyễn Việt Hà",
    date: "01/01/2023",
    duration: "12 tuần",
    content: "Nội dung chi tiết của khóa học Tiếng Trung căn bản...",
  },
  {
    id: 2,
    title: "Khóa học Tiếng Trung giao tiếp",
    description:
      "Phát triển kỹ năng giao tiếp tiếng Trung trong cuộc sống hàng ngày.",
    image: "/images/course2.jpg",
    category: "communication",
    author: "Nguyễn Việt Hà",
    date: "15/02/2023",
    duration: "10 tuần",
    content: "Nội dung chi tiết của khóa học Tiếng Trung giao tiếp...",
  },
  {
    id: 3,
    title: "Luyện thi HSK 4",
    description:
      "Chuẩn bị kỹ năng và kiến thức để vượt qua kỳ thi HSK cấp độ 4.",
    image: "/images/course3.jpg",
    category: "exam",
    author: "Nguyễn Việt Hà",
    date: "10/03/2023",
    duration: "8 tuần",
    content: "Nội dung chi tiết của khóa luyện thi HSK 4...",
  },
  {
    id: 4,
    title: "Khóa học Tiếng Trung nâng cao",
    description:
      "Nâng cao kỹ năng tiếng Trung cho những ai đã có nền tảng vững chắc.",
    image: "/images/course4.jpg",
    category: "advanced",
    author: "Nguyễn Việt Hà",
    date: "20/04/2023",
    duration: "14 tuần",
    content: "Nội dung chi tiết của khóa học Tiếng Trung nâng cao...",
  },
  {
    id: 5,
    title: "Khóa học HSK 5 chuyên sâu",
    description:
      "Luyện thi HSK cấp 5 với các bài học chuyên sâu và mẹo làm bài.",
    image: "/images/course5.jpg",
    category: "exam",
    author: "Nguyễn Việt Hà",
    date: "05/05/2023",
    duration: "10 tuần",
    content: "Nội dung chi tiết của khóa học HSK 5 chuyên sâu...",
  },
  {
    id: 6,
    title: "Khóa học Tiếng Trung thương mại",
    description:
      "Phát triển kỹ năng tiếng Trung trong môi trường kinh doanh và thương mại.",
    image: "/images/course6.jpg",
    category: "communication",
    author: "Nguyễn Việt Hà",
    date: "12/06/2023",
    duration: "12 tuần",
    content: "Nội dung chi tiết của khóa học Tiếng Trung thương mại...",
  },
];

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl text-red-500">Khóa học không tồn tại.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left content */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            <p className="text-gray-700 text-lg mb-4">{course.description}</p>

            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <p><strong>Tác giả:</strong> {course.author}</p>
              <p><strong>Ngày bắt đầu:</strong> {course.date}</p>
              <p><strong>Thời lượng:</strong> {course.duration}</p>
              <p><strong>Thể loại:</strong> {course.category}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Nội dung khóa học</h2>
              <p className="text-gray-700 leading-relaxed">{course.content}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <Link
              to="/courses-success"
              className="block text-center w-full bg-[#A82828] text-white px-4 py-3 rounded-md font-semibold hover:bg-red-700 transition mb-3"
            >
              Đăng ký khóa học
            </Link>
            <Link
              to="/courses"
              className="block text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-md text-gray-800 font-semibold transition"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
