import React from 'react';
import img from '../images/snapbg.jpg'

interface feedback {
  id: number;
  name: string;
  image: string;
  text: string;
}

const FeedbackSection: React.FC = () => {
  const feedback: feedback[] = [
    {
      id: 1,
      name: 'Đỗ Anh Quân',
      image: '/images/feedback-1.jpg',
      text: 'Trang web này thực sự là một nền tảng học tiếng Trung rất thân thiện và tiện lợi. Giao diện dễ sử dụng, giúp người học dễ dàng tìm kiếm các bài học phù hợp.',
    },
    {
      id: 2,
      name: 'Đỗ Anh Quân',
      image: '/images/feedback-2.jpg',
      text: 'Trang web này thực sự là một nền tảng học tiếng Trung rất thân thiện và tiện lợi. Giao diện dễ sử dụng, giúp người học dễ dàng tìm kiếm các bài học phù hợp.',
    },
    {
      id: 3,
      name: 'Đỗ Anh Quân',
      image: '/images/feedback-3.jpg',
      text: 'Trang web này thực sự là một nền tảng học tiếng Trung rất thân thiện và tiện lợi. Giao diện dễ sử dụng, giúp người học dễ dàng tìm kiếm các bài học phù hợp.',
    },
    {
      id: 4,
      name: 'Đỗ Anh Quân',
      image: '/images/feedback-1.jpg',
      text: 'Trang web này thực sự là một nền tảng học tiếng Trung rất thân thiện và tiện lợi. Giao diện dễ sử dụng, giúp người học dễ dàng tìm kiếm các bài học phù hợp.',
    },
    {
      id: 5,
      name: 'Đỗ Anh Quân',
      image: '/images/feedback-2.jpg',
      text: 'Trang web này thực sự là một nền tảng học tiếng Trung rất thân thiện và tiện lợi. Giao diện dễ sử dụng, giúp người học dễ dàng tìm kiếm các bài học phù hợp.',
    },
    {
      id: 6,
      name: 'Đỗ Anh Quân',
      image: '/images/feedback-3.jpg',
      text: 'Trang web này thực sự là một nền tảng học tiếng Trung rất thân thiện và tiện lợi. Giao diện dễ sử dụng, giúp người học dễ dàng tìm kiếm các bài học phù hợp.',
    },
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Các đánh giá của học sinh dành
          <br />
          cho Tieng Trung Ni Hao
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {feedback.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-[#F8F9FD] p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <img
                  src={img}
                  alt={feedback.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <h3 className="font-semibold text-base">{feedback.name}</h3>
                  <div className="flex text-yellow-400 mt-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700">{feedback.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
