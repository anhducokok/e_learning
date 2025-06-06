import React from "react";
import { Link, useLocation } from "react-router-dom";

interface TeacherSidebarProps {
  logoImage: string;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ logoImage }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const activePath = location.pathname;

  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <img src={logoImage} alt="Nihao" className="h-8" />
        <div>
          <span className="font-bold text-lg text-yellow-600">NiHao</span>
          <span className="text-xs text-gray-500"> Teacher</span>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <Link
              to="/teacher/dashboard"
              className={`block px-3 py-2 rounded-lg hover:bg-yellow-100 text-gray-700 ${
                currentPath === "/teacher/dashboard"
                  ? "bg-yellow-100 text-yellow-800 font-medium"
                  : ""
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/teacher/courses"
              className={`block px-3 py-2 rounded-lg hover:bg-yellow-100 ${
                activePath.includes("/teacher/courses")
                  ? "bg-yellow-100 text-yellow-800 font-medium"
                  : "text-gray-700"
              }`}
            >
              Quản lý khóa học
            </Link>
          </li>
          <li>
            <Link to="/teacher/students"
              className="block px-3 py-2 rounded-lg hover:bg-yellow-100 text-gray-700"
            >
              Học viên
            </Link>
          </li>
          <li>
            <Link to="/teacher/assignments"
              className="block px-3 py-2 rounded-lg hover:bg-yellow-100 text-gray-700"
            >
              Bài tập
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default TeacherSidebar;
