import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="relative bg-cover bg-center py-20 md:py-24 text-center text-white" 
      style={{ backgroundImage: 'url("/images/cta-background.jpg")' }}>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1d3557] bg-opacity-85"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bạn đã sẵn sàng bắt đầu hành trình học tiếng Trung chưa?
        </h2>
        
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
          Đăng ký ngay để nhận một buổi học thử tiếng Trung miễn phí và trải nghiệm phương pháp giảng dạy chất lượng cao của chúng tôi
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 sm:w-auto w-4/5 mx-auto">
          <Link 
            to="/auth" 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-3 px-8 rounded transition-colors w-full sm:w-auto"
          >
            Học thử miễn phí
          </Link>
          
          <Link 
            to="/#contact" 
            className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-semibold text-lg py-3 px-8 rounded transition-colors w-full sm:w-auto"
          >
            Liên hệ với chúng tôi
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
