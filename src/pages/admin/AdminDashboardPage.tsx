import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg"; // Adjust path if needed
import DashboardHeader from "../../components/DashboardHeader";
import AdminLayout from "../../components/admin/AdminLayout";

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

const ChineseCourseDashboard: React.FC = () => {
  const stats = [
    {
      title: "Học viên đang học",
      count: 850,
      color: "bg-red-600",
      href: "/admin/students",
    },
    {
      title: "Khóa học đang mở",
      count: 12,
      color: "bg-green-600",
      href: "/admin/courses",
    },
    {
      title: "Khóa học sắp khai giảng",
      count: 5,
      color: "bg-yellow-500",
      href: "/admin/upcoming-courses",
    },
    {
      title: "Phản hồi từ học viên",
      count: 34,
      color: "bg-red-600",
      href: "/admin/feedback",
    },
  ];

  const barData = {
    labels: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"],
    datasets: [
      {
        label: "Số lượng học viên",
        backgroundColor: "#2563eb",
        data: [120, 200, 180, 150, 100, 50],
      },
    ],
  };

  const doughnutData = {
    labels: ["Nghe", "Nói", "Đọc", "Viết"],
    datasets: [
      {
        backgroundColor: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#facc15"],
        data: [300, 250, 200, 180],
      },
    ],
  };
  // Sample notifications for admin
  const adminNotifications = [
    {
      id: "1",
      title: "Đăng ký khóa học mới",
      message: "5 học viên mới đăng ký khóa HSK 1",
      time: "2 phút trước",
      type: "info" as const,
      read: false,
    },
    {
      id: "2",
      title: "Phản hồi học viên",
      message: "Có 3 phản hồi mới cần xem xét",
      time: "15 phút trước",
      type: "warning" as const,
      read: false,
    },
    {
      id: "3",
      title: "Khóa học sắp khai giảng",
      message: "HSK 2 sẽ khai giảng vào ngày mai",
      time: "1 giờ trước",
      type: "success" as const,
      read: true,
    },
  ];

  // Danh sách menu sidebar đơn giản
  const sidebarItems = [
    {
      id: "students",
      label: "Học viên",
      href: "/admin/students",
      notificationCount: 0,
    },
    {
      id: "courses",
      label: "Khóa học",
      href: "/admin/courses",
      notificationCount: 0,
    },
    {
      id: "upcoming",
      label: "Sắp khai giảng",
      href: "/admin/upcoming-courses",
      notificationCount: 2,
    },
    {
      id: "feedback",
      label: "Phản hồi",
      href: "/admin/feedback",
      notificationCount: 3,
    },
  ];

  return (
    <AdminLayout logoImage={logoImage} activePath="/admin-dashboard/dashboard">
      <div className="flex min-h-screen bg-gray-50">
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {" "}
          <DashboardHeader
            title="Trang quản trị"
            notifications={adminNotifications}
          />
          <div className="flex-1 p-8">
            {/* Stats & Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, i) => (
                <a
                  href={stat.href}
                  key={i}
                  className="transform hover:scale-105 transition"
                >
                  <div className="rounded-xl shadow-md overflow-hidden">
                    <div className={`p-5 text-white text-center ${stat.color}`}>
                      <h3 className="text-lg font-semibold">{stat.title}</h3>
                    </div>
                    <div className="bg-white py-4 text-center">
                      <p
                        className={`text-3xl font-bold text-${stat.color.replace(
                          "bg-",
                          ""
                        )}`}
                      >
                        {stat.count}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Thống kê học viên theo cấp độ HSK
                </h2>
                <Bar data={barData} options={{ responsive: true }} />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                  Thống kê học viên theo kỹ năng
                </h2>{" "}
                <Doughnut data={doughnutData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default ChineseCourseDashboard;
