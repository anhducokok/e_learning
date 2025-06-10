import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";
import DashboardHeader from "../../components/DashboardHeader";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import ChatPopup from "../../components/ChatPopup";

const TeacherChat: React.FC = () => {
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
          <ChatPopup />
        </main>
      </div>
    </TeacherLayout>
  );
};

export default TeacherChat;
