import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";

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

const TeacherDashboard: React.FC = () => {
  const stats = [
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
    {
      title: "Phản hồi mới",
      count: 5,
      color: "bg-red-500",
      href: "/teacher/feedback",
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <img src={logoImage} alt="Nihao" className="h-8" />
          <div>
            <span className="font-bold text-lg text-blue-600">NiHao</span>
            <span className="text-xs text-gray-500"> Teacher</span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <a href="/teacher/classes" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                Lớp học của tôi
              </a>
            </li>
            <li>
              <a href="/teacher/students" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                Học viên
              </a>
            </li>
            <li>
              <a href="/teacher/assignments" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                Bài tập
              </a>
            </li>
            <li>
              <a href="/teacher/feedback" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                Phản hồi
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Giáo viên Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-white">
              GV
            </div>
            <span className="font-medium">Cô Hà</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <a key={i} href={stat.href} className="transform hover:scale-105 transition">
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
      </main>
    </div>
  );
};

export default TeacherDashboard;
