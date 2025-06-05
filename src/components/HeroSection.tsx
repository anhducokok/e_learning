import React from 'react';
import { Link } from 'react-router-dom';
import chineseImage from '../images/china_girl.jpg'; 

const HeroSection: React.FC = () => {
  return (
    <section className="py-8 px-2 md:py-10 md:px-5 bg-red-600">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
              Học tiếng Trung một cách dễ dàng
            </h1>
            <p className="text-lg text-white mb-5 leading-relaxed">
              Bắt đầu hành trình tiếng Trung của bạn thông qua các khóa học tương tác, hướng dẫn trực tiếp và trải nghiệm văn hóa
            </p>
            <div className="flex flex-wrap gap-2">
              <Link 
                to="/auth" 
                className="px-5 py-3 bg-yellow-300 hover:bg-yellow-500 text-black font-semibold rounded-md text-base transition-colors duration-200"
              >
                Bắt đầu học
              </Link>
              <Link 
                to="/about" 
                className="px-5 py-3 border border-primary text-white hover:bg-gray-500 font-semibold rounded-md text-base transition-colors duration-200"
              >
                Tìm hiểu thêm 
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 text-center">
            <img 
              src={chineseImage}
              alt="Students learning Chinese"
              className="w-full max-w-[500px] h-auto rounded-md shadow-md object-cover mx-auto"
              
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
