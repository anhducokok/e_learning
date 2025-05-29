import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg"; // Adjust path if needed

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const ChineseCourseDashboard: React.FC = () => {
  const stats = [
    { title: "Học viên đang học", count: 850, color: "bg-blue-600", href: "/admin/students" },
    { title: "Khóa học đang mở", count: 12, color: "bg-green-600", href: "/admin/courses" },
    { title: "Khóa học sắp khai giảng", count: 5, color: "bg-yellow-500", href: "/admin/upcoming-courses" },
    { title: "Phản hồi từ học viên", count: 34, color: "bg-red-600", href: "/admin/feedback" },
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

  // Danh sách menu sidebar đơn giản
  const sidebarItems = [
    { id: "students", label: "Học viên", href: "/admin/students", notificationCount: 0 },
    { id: "courses", label: "Khóa học", href: "/admin/courses", notificationCount: 0 },
    { id: "upcoming", label: "Sắp khai giảng", href: "/admin/upcoming-courses", notificationCount: 2 },
    { id: "feedback", label: "Phản hồi", href: "/admin/feedback", notificationCount: 3 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <img src={logoImage} alt="Nihao" className="h-8" />
          <div>
            <span className="font-bold text-lg text-blue-600">NiHao</span>
            <span className="text-xs text-gray-500"> Education</span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <span>{item.label}</span>
                  {item.notificationCount > 0 && (
                    <span className="ml-auto rounded-full px-2 text-xs text-white bg-blue-500">
                      {item.notificationCount}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Trang quản trị</h1>
          <div className="flex items-center gap-4">
            <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Hỏi đáp
            </a>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-white">
                AD
              </div>
              <span className="font-medium">Đức</span>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats & Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <a href={stat.href} key={i} className="transform hover:scale-105 transition">
              <div className="rounded-xl shadow-md overflow-hidden">
                <div className={`p-5 text-white text-center ${stat.color}`}>
                  <h3 className="text-lg font-semibold">{stat.title}</h3>
                </div>
                <div className="bg-white py-4 text-center">
                  <p className={`text-3xl font-bold text-${stat.color.replace("bg-", "")}`}>
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
            </h2>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChineseCourseDashboard;
