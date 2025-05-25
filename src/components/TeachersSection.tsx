import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import tungtungPicture from '../images/tungtung.jpg';
interface Teacher {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string;
}

const TeachersSection: React.FC = () => {  
  const teachers: Teacher[] = [
    {
      id: 1,
      name: 'Giáo sư Lý',
      title: 'Tiến sĩ Ngôn ngữ học',
      bio: 'Giáo sư Lý có 20 năm kinh nghiệm giảng dạy tiếng Trung, chuyên về ngữ pháp và phương pháp dạy giao tiếp. Phương pháp giảng dạy của cô sinh động, thú vị và được học viên yêu thích.',
      image: '/images/teacher-1.jpg'
    },
    {
      id: 2,
      name: 'Cô Trương',
      title: 'Giáo viên tiếng Trung cấp cao',
      bio: 'Cô Trương chuyên về giảng dạy tiếng Trung thương mại với nhiều kinh nghiệm giao tiếp đa văn hóa. Cô đã làm việc tại nhiều công ty quốc tế và hiểu rõ ứng dụng thực tế của tiếng Trung trong môi trường công sở.',
      image: '/images/teacher-2.jpg'
    },
    {
      id: 3,
      name: 'Thầy Vương',
      title: 'Giảng viên Văn học Trung Quốc',
      bio: 'Thầy Vương thông thạo văn học cổ điển và hiện đại Trung Quốc, có thể giúp học viên khám phá sức hấp dẫn của tiếng Trung và chiều sâu văn hóa Trung Quốc thông qua các tác phẩm văn học.',
      image: '/images/teacher-3.jpg'
    },
    {
      id: 4,
      name: 'Giáo sư Trần',
      title: 'Chuyên gia Tâm lý Giáo dục',
      bio: 'Giáo sư Trần chuyên nghiên cứu về việc tiếp thu ngôn ngữ và đã phát triển nhiều phương pháp dạy tiếng Trung phù hợp với các phong cách học tập khác nhau, giúp học viên học tiếng Trung hiệu quả hơn.',
      image: '/images/teacher-4.jpg'
    }
  ];
  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Đội ngũ giáo viên của chúng tôi
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Giáo viên của chúng tôi đều có kinh nghiệm giảng dạy phong phú và trình độ chuyên môn cao, cam kết mang đến cho học viên nền giáo dục tiếng Trung chất lượng nhất
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map(teacher => (
            <div 
              key={teacher.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
            >
              <div className="relative h-56 overflow-hidden">
                {/* <img 
                  src={process.env.PUBLIC_URL + teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.jpg`;
                  }}
                /> */}
                <img 
                  src={tungtungPicture} 
                  alt="Helele"
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = tungtungPicture; // Fallback image
                  }} />
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-1">
                  {teacher.name}
                </h3>
                <p className="text-primary font-medium mb-3">
                  {teacher.title}
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {teacher.bio}
                </p>
                <RouterLink 
                  to={`/teachers/${teacher.id}`}
                  className="inline-flex items-center text-primary font-semibold hover:underline"
                >
                  Tìm hiểu thêm
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                </RouterLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
