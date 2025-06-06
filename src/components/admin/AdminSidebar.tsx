import React from "react";
import { Link, useLocation } from "react-router-dom";

interface AdminSidebarProps {
  logoImage: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ logoImage }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define sidebar menu items
  const sidebarItems = [
    { to: "/admin-dashboard/dashboard", label: "Dashboard" },
    { to: "/admin-dashboard/courses", label: "Quản lý khóa học" },
    { to: "/admin-dashboard/user", label: "Người dùng" },
    { to: "/admin-dashboard/payment", label: "Yêu cầu thanh toán" },
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <img src={logoImage} alt="Nihao" className="h-8" />
        <div>
          <span className="font-bold text-lg text-red-600">NiHao</span>
          <span className="text-xs text-gray-500"> Admin</span>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`block px-3 py-2 rounded-lg hover:bg-red-100 transition-colors ${
                  currentPath === item.to || currentPath.startsWith(item.to + "/")
                    ? "bg-red-100 text-red-800 font-medium"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;