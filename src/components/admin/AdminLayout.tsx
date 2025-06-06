import React from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  logoImage: string;
  activePath?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, logoImage, activePath }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar logoImage={logoImage} />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
