import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '/images/online-learning.png',
      title: 'Học trực tuyến',
      description: 'Truy cập khóa học mọi lúc, mọi nơi và học tiếng Trung theo nhịp độ của riêng bạn'
    },
    {
      icon: '/images/live-tutor.png',
      title: 'Giáo viên thực',
      description: 'Học trực tiếp một-một hoặc theo nhóm nhỏ với giáo viên tiếng Trung giàu kinh nghiệm'
    },
    {
      icon: '/images/practice.png',
      title: 'Bài tập tương tác',
      description: 'Cải thiện kỹ năng nghe, nói, đọc và viết thông qua các hoạt động và bài tập thú vị'
    },
    {
      icon: '/images/culture.png',
      title: 'Trải nghiệm văn hóa',
      description: 'Tìm hiểu về văn hóa, lịch sử và truyền thống Trung Quốc để làm phong phú trải nghiệm học tập của bạn'
    }
  ];

  return (
    <section className="bg-white py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 relative">
          Tính năng nổi bật
          <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="h-full flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex justify-center pt-6 pb-2">
                <div className="flex justify-center items-center w-20 h-20 rounded-full bg-white p-4 shadow">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="p-5 flex-grow">
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
