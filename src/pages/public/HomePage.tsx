import React from "react";
import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import FeaturesSection from "../../components/FeaturesSection";
import CoursesSection from "../../components/CoursesSection";
import BlogSection from "../../components/BlogSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import FeedbackSection from "../../components/FeedbackSection";
import ContactSection from "../../components/ContactSection";
import Footer from "../../components/Footer";
import ChatWidget from "../../components/ChatWidgetSection";
import MyChatWidget from "../../components/MyChatWidgetSection";
import ChatDropdown from "../../components/ChatDropdownSection";
import { ChatProvider } from "../../contexts/ChatContext";

const HomePage: React.FC = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <HeroSection />
        <FeedbackSection />
        <CoursesSection />
        <TestimonialsSection />
        <ContactSection />
        <BlogSection />
        <Footer />
        <ChatWidget />
        <MyChatWidget />
        <ChatDropdown />
      </div>
    </ChatProvider>
  );
};

export default HomePage;
