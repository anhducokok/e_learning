import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#A82828] to-[#8B1F1F] text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer */}
        <div className="pt-16 pb-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Company Info - Takes more space */}
            <div className="lg:col-span-5">
              <div className="mb-8">
                <h3 className="font-bold text-3xl mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                   NiHao Education
                </h3>
                <p className="text-gray-200 leading-relaxed text-lg">
                  Nền tảng học tiếng Trung trực tuyến hàng đầu, cung cấp các khóa học chất lượng từ cơ bản đến nâng cao. 
                  Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất với đội ngũ giảng viên giàu kinh nghiệm.
                </p>
              </div>
              
              {/* Contact Info Card */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-bold text-gray-800 mb-4 text-lg">📞 Liên hệ với chúng tôi</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📧</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm">contact@nihao.edu.vn</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📱</span>
                    <div>
                      <p className="font-semibold">Điện thoại</p>
                      <p className="text-sm">+84 888 999 222</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Social Media */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold mb-6 flex items-center">
                  <span className="mr-2">🌐</span>
                  Mạng xã hội
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="https://www.facebook.com/profile.php?id=61577114962949" className="flex items-center space-x-3 hover:text-yellow-300 transition-colors duration-200 group">
                      <span className="text-lg group-hover:scale-110 transition-transform">📷</span>
                      <span>Facebook</span>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.tiktok.com/@tiengtrungnihao33?fbclid=IwY2xjawK5NkJleHRuA2FlbQIxMABicmlkETF1djJDMnZtalNGOXpBdTdVAR7BDMcab6hIrsIopcv_Av3ktWUL9dBEiMsrdIXZU-bRSiJJEq-Hhlq3efPGhw_aem_hXYvRq-xNUl3JufV63Dhbg" className="flex items-center space-x-3 hover:text-yellow-300 transition-colors duration-200 group">
                      <span className="text-lg group-hover:scale-110 transition-transform">🐦</span>
                      <span>Tiktok</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center space-x-3 hover:text-yellow-300 transition-colors duration-200 group">
                      <span className="text-lg group-hover:scale-110 transition-transform">💼</span>
                      <span>LinkedIn</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center space-x-3 hover:text-yellow-300 transition-colors duration-200 group">
                      <span className="text-lg group-hover:scale-110 transition-transform">📺</span>
                      <span>YouTube</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Programs */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold mb-6 flex items-center">
                  <span className="mr-2">📚</span>
                  Chương trình
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/courses" className="hover:text-yellow-300 transition-colors duration-200 hover:underline">
                      HSK 1-6
                    </Link>
                  </li>
                  <li>
                    <Link to="/courses" className="hover:text-yellow-300 transition-colors duration-200 hover:underline">
                      Tiếng Trung Giao tiếp
                    </Link>
                  </li>
                  <li>
                    <Link to="/courses" className="hover:text-yellow-300 transition-colors duration-200 hover:underline">
                      Tiếng Trung Thương mại
                    </Link>
                  </li>
                  <li>
                    <Link to="/courses" className="hover:text-yellow-300 transition-colors duration-200 hover:underline">
                      Luyện thi HSKK
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold mb-6 flex items-center">
                  <span className="mr-2">🆘</span>
                  Hỗ trợ
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/about" className="hover:text-yellow-300 transition-colors duration-200 hover:underline">
                      Về chúng tôi
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-yellow-300 transition-colors duration-200 hover:underline">
                      Liên hệ
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="hover:text-yellow-300 transition-colors duration-200 hover:underline">
                      Câu hỏi thường gặp
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-yellow-300 transition-colors duration-200 hover:underline">
                      Điều khoản
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="hover:text-yellow-300 transition-colors duration-200 hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-6 px-4 border-t border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <span>© 2025</span>
            <span className="font-bold text-yellow-400">TiengTrungNiHao</span>
            <span>- Tất cả quyền được bảo lưu</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span>🏗️ Made with ❤️ in Vietnam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
