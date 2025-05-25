import React from 'react';

const ContactSection: React.FC = () => {
  const contactItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Địa chỉ',
      content: ['100 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh, Việt Nam'],
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Điện thoại',
      content: ['+84 28 1234 5678'],
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      content: ['info@nihaoeducation.com'],
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Giờ làm việc',
      content: ['Thứ Hai - Thứ Sáu: 9:00 - 18:00', 'Thứ Bảy: 9:00 - 15:00'],
    },
  ];

  return (
    <section id="contact" className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Liên hệ với chúng tôi</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Nếu bạn có bất kỳ câu hỏi nào hoặc muốn biết thêm thông tin, hãy liên hệ với chúng tôi bất cứ lúc nào
        </p>

        <div className="flex flex-col-reverse md:flex-row gap-10">
          {/* Contact Info */}
          <div className="w-full md:w-5/12 space-y-6">
            {contactItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.content.map((line, i) => (
                    <p key={i} className="text-gray-600">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-7/12">
            <form className="bg-white shadow-md rounded-lg p-6 space-y-5">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">Họ tên</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Họ tên của bạn"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block font-medium mb-1">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Địa chỉ email của bạn"
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block font-medium mb-1">Điện thoại</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Số điện thoại của bạn"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block font-medium mb-1">Chủ đề</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Chủ đề của tin nhắn"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-medium mb-1">Tin nhắn</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Vui lòng nhập tin nhắn của bạn"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold transition-colors"
                >
                  Gửi tin nhắn
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
