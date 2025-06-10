import React from "react";
import AdminSidebar from "./AdminSidebar";
import MyChat from "../MyChatWidgetSection";

interface AdminLayoutProps {
  children: React.ReactNode;
  logoImage: string;
  activePath?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, logoImage }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar logoImage={logoImage} />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        {children}
      </main>
      <MyChat />
    </div>
  );
};

export default AdminLayout;
