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
    name: 'Nguyễn Thị Minh Châu',
    image: '/images/feedback-2.jpg',
    text: 'Tôi rất thích cách các bài học được sắp xếp hợp lý và dễ hiểu. Trang web giúp tôi cải thiện tiếng Trung mỗi ngày một chút.',
  },
  {
    id: 2,
    name: 'Lê Văn Hùng',
    image: '/images/feedback-2.jpg',
    text: 'Chức năng luyện phát âm rất hữu ích. Nhờ có nó mà tôi tự tin hơn khi giao tiếp bằng tiếng Trung.',
  },
  {
    id: 3,
    name: 'Trần Mỹ Linh',
    image: '/images/feedback-2.jpg',
    text: 'Trang web có thiết kế hiện đại, màu sắc dễ chịu. Tôi thích việc có thể học mọi lúc mọi nơi trên điện thoại.',
  },
  {
    id: 4,
    name: 'Phạm Quốc Khánh',
    image: '/images/feedback-2.jpg',
    text: 'Kho từ vựng đa dạng và bài tập tương tác rất thú vị. Mỗi bài học đều mang lại cảm giác mới mẻ.',
  },
  {
    id: 5,
    name: 'Hoàng Thị Thanh Hương',
    image: '/images/feedback-2.jpg',
    text: 'Tôi đã thử nhiều nền tảng học tiếng Trung và đây là nền tảng phù hợp nhất với lộ trình học của tôi.',
  },
  {
    id: 6,
    name: 'Đinh Gia Bảo',
    image: '/images/feedback-2.jpg',
    text: 'Trang web không chỉ hỗ trợ người mới bắt đầu mà còn có nội dung nâng cao rất chất lượng.',
  },
];



  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Các đánh giá của học sinh dành
          <br />
          cho NiHao Education
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
