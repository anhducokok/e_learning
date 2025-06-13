import React/*, { useEffect, useState }*/ from "react"; // useEffect, useState unused
import AdminLayout from "../../components/admin/AdminLayout";
import DashboardHeader from "../../components/DashboardHeader";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";
import ChatPopup from "../../components/ChatPopup"

const UserListPage: React.FC = () => {

  return (
    <AdminLayout logoImage={logoImage} activePath="/admin-dashboard/payment">
      <main className="flex flex-col bg-gray-50 min-h-screen">
        <DashboardHeader title="Quản lý thanh toán" />
        <ChatPopup />
      </main>
    </AdminLayout>
  );
};

export default UserListPage;
