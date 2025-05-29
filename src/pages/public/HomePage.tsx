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

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <FeedbackSection />
      <CoursesSection />
      <TestimonialsSection />
      <ContactSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default HomePage;
