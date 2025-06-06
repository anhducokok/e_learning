import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";
import DashboardHeader from "../../components/DashboardHeader";
import TeacherLayout from "../../components/teacher/TeacherLayout";

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
  const stats = [
    {
      title: "Khóa học của tôi",
      count: 12,
      color: "bg-purple-600",
      href: "/teacher/courses",
    },
    {
      title: "Học viên của tôi",
      count: 120,
      color: "bg-blue-600",
      href: "/teacher/students",
    },
    {
      title: "Lớp đang dạy",
      count: 4,
      color: "bg-green-600",
      href: "/teacher/classes",
    },
    {
      title: "Bài tập cần chấm",
      count: 8,
      color: "bg-yellow-500",
      href: "/teacher/assignments",
    },
  ];

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
    <TeacherLayout logoImage={logoImage} activePath="/teacher/courses">
      <h1 className="text-2xl font-semibold mb-4">Quản lý khóa học</h1>
      <div className="flex min-h-screen bg-gray-50">
        {/* Main content */}{" "}
        <main className="flex-1 flex flex-col">
          <DashboardHeader
            title="Giáo viên Dashboard"
            notifications={teacherNotifications}
          />

          <div className="flex-1 p-8">
            {" "}
            {/* Stats */}
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
                    </div>{" "}
                    <div className="bg-white py-4 text-center">
                      <p className="text-3xl font-bold text-gray-800">
                        {stat.count}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}{" "}
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
                </h2>{" "}
                <Doughnut data={doughnutData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
