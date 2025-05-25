import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="py-8 px-2 md:py-10 md:px-5 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-primary">
              Học tiếng Trung một cách dễ dàng
            </h1>
            <p className="text-lg text-gray-600 mb-5 leading-relaxed">
              Bắt đầu hành trình tiếng Trung của bạn thông qua các khóa học tương tác, hướng dẫn trực tiếp và trải nghiệm văn hóa
            </p>
            <div className="flex flex-wrap gap-2">
              <Link 
                to="/courses" 
                className="px-5 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md text-base transition-colors duration-200"
              >
                Bắt đầu học
              </Link>
              <Link 
                to="/about" 
                className="px-5 py-3 border border-primary text-primary hover:bg-gray-50 font-semibold rounded-md text-base transition-colors duration-200"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 text-center">
            {/* <img 
              src={process.env.PUBLIC_URL + '/images/hero-image.jpg'}
              alt="Students learning Chinese"
              className="w-full max-w-[500px] h-auto rounded-md shadow-md object-cover mx-auto"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.jpg`;
                console.log('Hero image failed to load, using placeholder');
              }}
            /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
