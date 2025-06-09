// src/pages/public/HomePage.tsx
import React from "react";
import HeroSection from "../../components/HeroSection";
import CoursesSection from "../../components/CoursesSection";
import BlogSection from "../../components/BlogSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import FeedbackSection from "../../components/FeedbackSection";
import ContactSection from "../../components/ContactSection";
import ChatPopup from "../../components/ChatPopup";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <FeedbackSection />
      <CoursesSection />
      <TestimonialsSection />
      <ContactSection />
      <BlogSection />
      <ChatPopup />
    </div>
  );
};

export default HomePage;
