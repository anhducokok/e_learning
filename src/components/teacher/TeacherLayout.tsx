import React from "react";
import TeacherSidebar from "./TeacherSidebar";

interface TeacherLayoutProps {
  children: React.ReactNode;
  logoImage: string;
  activePath?: string;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children, logoImage, activePath }) => {
  return (
    <div className="flex min-h-screen">
      <TeacherSidebar logoImage={logoImage} />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default TeacherLayout;
