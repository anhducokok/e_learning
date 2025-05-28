import React, { useState } from "react";
import { Link } from "react-router-dom";
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
}

const CourseListPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");

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
    },
  ];

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "beginner", name: "Căn bản" },
    { id: "communication", name: "Giao tiếp" },
    { id: "exam", name: "Luyện thi" },
    { id: "advanced", name: "Nâng cao" },
  ];

  const filteredCourses =
    activeCategory === "all"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Danh sách khóa học
        </h1>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="h-48">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {course.description}
                </p>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{course.author}</span>
                  <span>{course.date}</span>
                  <span>{course.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-1">
            <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-md">
              1
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              2
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              10
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
              Tiếp
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseListPage;
