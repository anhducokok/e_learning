// src/pages/public/HomePage.tsx
import React from "react";
import HeroSection from "../../components/HeroSection";
import FeaturesSection from "../../components/FeaturesSection";
import CoursesSection from "../../components/CoursesSection";
import BlogSection from "../../components/BlogSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import FeedbackSection from "../../components/FeedbackSection";
import ContactSection from "../../components/ContactSection";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <FeedbackSection />
      <CoursesSection />
      <TestimonialsSection />
      <ContactSection />
      <BlogSection />
    </div>
  );
};

export default HomePage;
