import React from 'react';
import contact from '../images/05558084d65c04a52ef78dca66bd0c332ffaaa42.jpg'

const NewsletterSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0">
        <div className="relative">
          <img
            src={contact}
            alt="form background"
            className="w-full h-full object-cover"
          />
          <h3 className="absolute top-8 left-8 text-white text-2xl font-semibold drop-shadow-md">
            Form đăng ký nhận thông tin
          </h3>
        </div>
        <div className="bg-[#9B1C1C] text-white px-10 py-12 flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-2">Đăng ký nhận thông tin</h3>
          <p className="text-sm mb-6">
            Nhận những thông tin sớm nhất về các lớp học mới mở của Tiếng Trung Ni Hao
          </p>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Tên của bạn"
              className="px-4 py-2 rounded-md bg-[#9B1C1C] border border-gray-500 text-gray-300 placeholder-gray-300"
            />
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded-md bg-[#9B1C1C] border border-gray-500 text-gray-300 placeholder-gray-300"
            />
            <textarea
              placeholder="Nội dung"
              className="px-4 py-2 rounded-md bg-[#9B1C1C] border border-gray-500 text-white placeholder-gray-300"
              rows={3}
            />
            <button
              type="submit"
              className="bg-yellow-300 hover:bg-yellow-400 text-black py-2 rounded-md font-medium"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
