import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHeroBackground, preloadHeroImages, HERO_BACKGROUNDS } from '../config/images';
import OptimizedBackground from './OptimizedBackground';
import HeroBG from '../images/HeroBackGround.jpg'
const HeroSection: React.FC = () => {
  const heroBackgroundUrl = getHeroBackground();

  // Preload hero images for better performance
  useEffect(() => {
    preloadHeroImages();
  }, []);

  return (    <OptimizedBackground
      imageUrl={HeroBG}
      fallbackUrls={[HERO_BACKGROUNDS.fallback1, HERO_BACKGROUNDS.fallback2, HERO_BACKGROUNDS.local]}
      className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden crisp-background"
    >
      {/* Blurred gray overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800/20 via-gray-700/30 to-gray-900/40"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="block">Học tiếng Trung</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  một cách dễ dàng
                </span>
              </h1>
              
              {/* Decorative line */}
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 mx-auto lg:mx-0"></div>
            </div>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Bắt đầu hành trình tiếng Trung của bạn thông qua các khóa học tương tác, 
              hướng dẫn trực tiếp và trải nghiệm văn hóa phong phú
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/auth" 
                className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Bắt đầu học ngay
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link 
                to="/auth?mode=login" 
                className="group px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-full text-lg transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  Tìm hiểu thêm
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
            
            {/* Stats or features */}
            {/* <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-8">
              {/* <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">1000+</div>
                <div className="text-gray-300 text-sm">Học viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">50+</div>
                <div className="text-gray-300 text-sm">Khóa học</div>
              </div> */}
              {/* <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">24/7</div>
                <div className="text-gray-300 text-sm">Hỗ trợ</div>
              </div>
            </div> */}
          </div>
          
          {/* Right side - decorative elements */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Floating cards or decorative elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-xl"></div>
              
              {/* Chinese characters or symbols as decoration */}
              {/* <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-6xl text-yellow-300 text-center mb-4">中文</div>
                <div className="text-white text-center">
                  <p className="text-lg font-semibold">Khám phá</p>
                  <p className="text-sm opacity-80">Ngôn ngữ & Văn hóa Trung Hoa</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
        {/* Animated floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-300/50 rounded-full animate-bounce"></div>
      <div className="absolute bottom-32 right-16 w-6 h-6 bg-orange-400/50 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-8 w-3 h-3 bg-red-300/50 rounded-full animate-ping"></div>
    </OptimizedBackground>
  );
};

export default HeroSection;
