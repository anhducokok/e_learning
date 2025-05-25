import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import CoursesSection from '../components/CoursesSection';
import TeachersSection from '../components/TeachersSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CallToAction from '../components/CallToAction';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CoursesSection />
      <TeachersSection />
      <TestimonialsSection />
      {/* <CallToAction /> */}
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;
