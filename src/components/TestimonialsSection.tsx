import React, { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Nguyễn Văn Minh',
      role: 'Chuyên viên kinh doanh',
      image: '/images/testimonial-1.jpg',
      text: 'Khóa học tiếng Trung thương mại của Ni Hao Education đã giúp ích rất nhiều cho sự nghiệp của tôi. Nội dung khóa học thiết thực, phương pháp giảng dạy linh hoạt của giáo viên giúp tôi nâng cao khả năng giao tiếp thương mại bằng tiếng Trung trong thời gian ngắn.'
    },
    {
      id: 2,
      name: 'Trần Thị Hà',
      role: 'Sinh viên đại học',
      image: '/images/testimonial-2.jpg',
      text: 'Là một người học ngôn ngữ, tôi đã thử nhiều khóa học tiếng Trung, nhưng khóa học của Ni Hao Education là hấp dẫn nhất. Các bài tập tương tác và nội dung văn hóa của họ làm cho việc học trở nên thú vị và có ý nghĩa.'
    },
    {
      id: 3,
      name: 'Lê Quang Đạt',
      role: 'Kỹ sư phần mềm',
      image: '/images/testimonial-3.jpg',
      text: 'Lớp học một-một của Ni Hao Education rất phù hợp với lịch trình bận rộn của tôi. Các giáo viên đều rất chuyên nghiệp và có thể điều chỉnh nội dung khóa học theo nhu cầu và sở thích của tôi. Tôi thực sự khuyên bạn nên học ở đây!'
    },
    {
      id: 4,
      name: 'Phạm Thu Hương',
      role: 'Quản lý tiếp thị',
      image: '/images/testimonial-4.jpg',
      text: 'Tôi cần học tiếng Trung vì yêu cầu công việc, và khóa học chuyên nghiệp của Ni Hao Education chính xác là những gì tôi cần. Nội dung khóa học thiết thực và phương pháp giảng dạy của giáo viên khiến việc học trở nên dễ dàng.'
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <section className="bg-white py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          Đánh giá từ học viên
        </h2>
        
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Hãy nghe học viên của chúng tôi nói gì, những câu chuyện thành công và trải nghiệm học tập của họ
        </p>
        
        <div className="flex items-center max-w-4xl mx-auto relative">
          <button 
            onClick={prevTestimonial} 
            aria-label="Previous testimonial"
            className="text-4xl text-primary hover:text-secondary p-2 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex-1 relative min-h-[300px] mx-2">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`absolute w-full transition-opacity duration-500 ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="bg-white p-6 rounded-lg shadow-md relative">
                  <div className="absolute top-5 right-5 text-primary opacity-20 transform scale-[2]">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,17L4,17L4,13C4,7.5 7.5,4 13,4L13,6C9,6 6,9 6,13L6,15L14,15L14,17M20,17L10,17L10,13C10,7.5 13.5,4 19,4L19,6C15,6 12,9 12,13L12,15L20,15L20,17Z" />
                    </svg>
                  </div>
                  
                  <p className="text-lg text-gray-600 italic leading-relaxed relative z-10">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="absolute -bottom-2 left-8 w-5 h-5 bg-white transform rotate-45 shadow-md"></div>
                </div>
                
                <div className="flex items-center mt-6 ml-8">
                  <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={nextTestimonial} 
            aria-label="Next testimonial"
            className="text-4xl text-primary hover:text-secondary p-2 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to testimonial ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeIndex 
                  ? 'bg-primary transform scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

