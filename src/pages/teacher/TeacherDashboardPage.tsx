import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";
import DashboardHeader from "../../components/DashboardHeader";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import { courseService } from "../../services/courseService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState([
    {
      title: "Khóa học của tôi",
      count: 0,
      color: "bg-purple-600",
      href: "/teacher/courses",
    },
    {
      title: "Học viên của tôi",
      count: 0,
      color: "bg-blue-600",
      href: "/teacher/students",
    },
    {
      title: "Bài học đã tạo",
      count: 0,
      color: "bg-green-600",
      href: "/teacher/courses",
    },
    {
      title: "Bài kiểm tra",
      count: 0,
      color: "bg-yellow-500",
      href: "/teacher/courses",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeacherStatistics();
  }, []);

  const fetchTeacherStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch statistics from the new API
      const statistics = await courseService.getMyStatistics();
      
      setStats([
        {
          title: "Khóa học của tôi",
          count: statistics.totalCourses || 0,
          color: "bg-purple-600",
          href: "/teacher/courses",
        },
        {
          title: "Học viên của tôi",
          count: statistics.totalStudents || 0,
          color: "bg-blue-600",
          href: "/teacher/students",
        },
        {
          title: "Bài học đã tạo",
          count: statistics.totalLessons || 0,
          color: "bg-green-600",
          href: "/teacher/courses",
        },
        {
          title: "Bài kiểm tra",
          count: statistics.totalQuizzes || 0,
          color: "bg-yellow-500",
          href: "/teacher/courses",
        },
      ]);
    } catch (err: any) {
      console.error('Error fetching teacher statistics:', err);
      
      // Fallback: Try to get basic course count from existing API
      try {
        const courses = await courseService.getMyCourses();
        setStats([
          {
            title: "Khóa học của tôi",
            count: courses.length || 0,
            color: "bg-purple-600",
            href: "/teacher/courses",
          },
          {
            title: "Học viên của tôi",
            count: 0, // Will need to implement or fetch separately
            color: "bg-blue-600",
            href: "/teacher/students",
          },
          {
            title: "Bài học đã tạo",
            count: 0, // Will need to implement or fetch separately
            color: "bg-green-600",
            href: "/teacher/courses",
          },
          {
            title: "Bài kiểm tra",
            count: 0, // Will need to implement or fetch separately
            color: "bg-yellow-500",
            href: "/teacher/courses",
          },
        ]);
        setError("Không thể tải thống kê chi tiết. Hiển thị dữ liệu cơ bản.");
      } catch (fallbackErr: any) {
        setError(fallbackErr.message || "Failed to fetch any statistics");
      }
    } finally {
      setLoading(false);
    }
  };

  const barData = {
    labels: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"],
    datasets: [
      {
        label: "Số học viên mỗi cấp",
        backgroundColor: "#10b981",
        data: [15, 20, 35, 25, 15, 10],
      },
    ],
  };

  const doughnutData = {
    labels: ["Nghe", "Nói", "Đọc", "Viết"],
    datasets: [
      {
        label: "Kỹ năng yếu nhất",
        backgroundColor: ["#f87171", "#fb923c", "#facc15", "#34d399"],
        data: [10, 8, 6, 5],
      },
    ],
  };
  // Sample notifications for teacher
  const teacherNotifications = [
    {
      id: "1",
      title: "Bài tập mới",
      message: "8 bài tập cần chấm điểm",
      time: "5 phút trước",
      type: "warning" as const,
      read: false,
    },
    {
      id: "2",
      title: "Học viên mới",
      message: "2 học viên mới tham gia lớp HSK 2",
      time: "30 phút trước",
      type: "info" as const,
      read: false,
    },
    {
      id: "3",
      title: "Lịch dạy",
      message: "Lớp HSK 3 bắt đầu lúc 14:00 hôm nay",
      time: "2 giờ trước",
      type: "success" as const,
      read: true,
    },
  ];

  return (
    <TeacherLayout logoImage={logoImage} activePath="/teacher/dashboard">
      <div className="flex min-h-screen bg-gray-50">
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <DashboardHeader
            title="Giáo viên Dashboard"
            notifications={teacherNotifications}
          />

          <div className="flex-1 p-8">
            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center min-h-96">
                <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Lỗi tải dữ liệu
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={fetchTeacherStatistics}
                        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                      >
                        Thử lại
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {stats.map((stat, i) => (
                    <Link
                      key={i}
                      to={stat.href}
                      className="transform hover:scale-105 transition"
                    >
                      <div className="rounded-xl shadow-md overflow-hidden">
                        <div className={`p-5 text-white text-center ${stat.color}`}>
                          <h3 className="text-lg font-semibold">{stat.title}</h3>
                        </div>
                        <div className="bg-white py-4 text-center">
                          <p className="text-3xl font-bold text-gray-800">
                            {stat.count}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                      Học viên theo cấp độ HSK
                    </h2>
                    <Bar data={barData} options={{ responsive: true }} />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                      Kỹ năng học viên yếu
                    </h2>
                    <Doughnut data={doughnutData} options={{ responsive: true }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
