// src/layouts/MainLayout.tsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MyChatWidget from "../components/MyChatWidgetSection";
import ChatWidget from "../components/ChatWidgetSection";
import ChatDropdown from "../components/ChatDropdownSection";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* Nội dung từng trang sẽ render ở đây */}
      </main>
      <Footer />
      {/* Chatbox hiện ở mọi trang */}
      <ChatWidget />
      <MyChatWidget />
      <ChatDropdown />
    </>
  );
};

export default MainLayout;
