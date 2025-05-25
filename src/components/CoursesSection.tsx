import React from 'react';
import { Link } from 'react-router-dom';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  image: string;
  price: number;
}

const CoursesSection: React.FC = () => {
  const courses: Course[] = [
    {
      id: 1,
      title: 'Giao tiếp tiếng Trung cơ bản',
      description: 'Khóa học nói tiếng Trung dành cho người mới bắt đầu, học các đối thoại cơ bản và từ vựng thực tế',
      level: 'Sơ cấp',
      duration: '8 tuần',
      image: '/images/course-beginner.jpg',
      price: 2990000
    },
    {
      id: 2,
      title: 'Đọc và Viết tiếng Trung trung cấp',
      description: 'Nâng cao khả năng đọc và viết tiếng Trung, nắm vững cấu trúc câu phổ biến và cách diễn đạt',
      level: 'Trung cấp',
      duration: '10 tuần',
      image: '/images/course-intermediate.jpg',
      price: 3990000
    },
    {
      id: 3,
      title: 'Tiếng Trung thương mại',
      description: 'Khóa học tiếng Trung thiết kế dành cho người đi làm, học giao tiếp kinh doanh và từ vựng chuyên ngành',
      level: 'Trung-cao cấp',
      duration: '12 tuần',
      image: '/images/course-business.jpg',
      price: 4990000
    },
    {
      id: 4,
      title: 'Văn hóa và Ngôn ngữ Trung Quốc',
      description: 'Tìm hiểu sâu về văn hóa Trung Quốc, đồng thời nâng cao khả năng diễn đạt tiếng Trung cao cấp',
      level: 'Cao cấp',
      duration: '10 tuần',
      image: '/images/course-culture.jpg',
      price: 4590000
    }
  ];

  return (
    <section id="courses" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          Khóa học phổ biến
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Chọn khóa học tiếng Trung phù hợp với trình độ và mục tiêu của bạn, bắt đầu hành trình học tập
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="flex flex-col h-full rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  className="h-48 w-full object-cover rounded-t-lg"
                  src={course.image}
                  alt={course.title}
                />
                <span className="absolute top-4 right-4 bg-primary text-white px-2 py-1 text-sm font-medium rounded">
                  {course.level}
                </span>
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {course.description}
                </p>
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {course.duration}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold text-primary">
                  {course.price.toLocaleString('vi-VN')}₫
                </span>
                <button className="px-3 py-1 border border-primary text-primary hover:bg-primary hover:text-white rounded transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="text-primary font-semibold text-lg inline-flex items-center group"
          >
            Xem tất cả khóa học
            <svg 
              className="w-5 h-5 ml-1 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
