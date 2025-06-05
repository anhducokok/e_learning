import React, { useState } from 'react';
import { ArrowRight, Clock, User } from 'lucide-react';
import learnChineseImage from '../images/image.png';
import TeaBreakImage from '../images/download.jpg';
import RoadMapImage from '../images/download(1).png';
import conversationImage from '../images/download (1).jpg';
import img from '../images/bờ lóg.jpg'

const blogPosts = [
  {
    id: 1,
    title: 'Cách học chữ Hán hiệu quả cho người mới bắt đầu',
    excerpt: 'Khám phá những phương pháp đơn giản giúp bạn ghi nhớ và viết chữ Hán dễ dàng, phù hợp cho những người mới bắt đầu học tiếng Trung.',
    image: learnChineseImage,
    category: 'tips',
    author: 'Nguyễn Thị Minh',
    date: '20/05/2023',
    tags: ['chữ Hán', 'người mới bắt đầu', 'phương pháp học'],
    readTime: '5 phút',
  },
  {
    id: 2,
    title: 'Văn hóa trà đạo Trung Quốc: Nghệ thuật và lịch sử',
    excerpt: 'Tìm hiểu về văn hóa trà đạo Trung Quốc từ góc độ lịch sử, nghệ thuật thưởng trà và ý nghĩa văn hóa sâu sắc trong đời sống người Trung Quốc.',
    image: TeaBreakImage,
    category: 'culture',
    author: 'Trần Văn Bình',
    date: '15/04/2023',
    tags: ['văn hóa', 'trà đạo', 'lịch sử'],
    readTime: '8 phút',
  },
  {
    id: 3,
    title: 'Lộ trình học tiếng Trung từ mới bắt đầu đến HSK 4',
    excerpt: 'Hướng dẫn chi tiết về lộ trình học tiếng Trung từ cơ bản đến trình độ trung cấp (HSK 4) dành cho người Việt, kèm theo các tài liệu học tập hữu ích.',
    image: RoadMapImage,
    category: 'learning',
    author: 'Lê Thanh Hoa',
    date: '03/05/2023',
    tags: ['lộ trình học', 'HSK 4', 'kế hoạch học tập'],
    readTime: '10 phút',
  },
  {
    id: 4,
    title: 'Tổng hợp 50 câu giao tiếp tiếng Trung thông dụng nhất',
    excerpt: 'Bộ sưu tập 50 câu tiếng Trung thông dụng nhất trong giao tiếp hàng ngày, kèm theo phiên âm pinyin và cách sử dụng phù hợp.',
    image: conversationImage,
    category: 'vocabulary',
    author: 'Nguyễn Văn Tùng',
    date: '12/04/2023',
    tags: ['từ vựng', 'giao tiếp', 'hội thoại'],
    readTime: '7 phút',
  },
  {
    id: 5,
    title: 'Sự khác biệt giữa tiếng Trung giản thể và phồn thể',
    excerpt: 'Phân tích chi tiết về sự khác biệt giữa tiếng Trung giản thể và phồn thể, lịch sử và ứng dụng của hai hệ thống chữ viết này trong đời sống.',
    image: RoadMapImage,
    category: 'language',
    author: 'Phạm Minh Tuấn',
    date: '25/03/2023',
    tags: ['giản thể', 'phồn thể', 'chữ viết'],
    readTime: '6 phút',
  },
  {
    id: 6,
    title: '10 bộ phim Trung Quốc giúp cải thiện kỹ năng nghe tiếng Trung',
    excerpt: 'Giới thiệu 10 bộ phim Trung Quốc hấp dẫn không chỉ có nội dung thú vị mà còn giúp người học cải thiện kỹ năng nghe tiếng Trung hiệu quả.',
    image: img,
    category: 'culture',
    author: 'Trần Thanh Mai',
    date: '18/05/2023',
    tags: ['phim Trung Quốc', 'luyện nghe', 'giải trí'],
    readTime: '9 phút',
  },
  {
    id: 7,
    title: 'Những lỗi ngữ pháp tiếng Trung thường gặp ở người Việt',
    excerpt: 'Phân tích những lỗi ngữ pháp tiếng Trung phổ biến mà người Việt thường mắc phải và cách khắc phục để nói tiếng Trung tự nhiên hơn.',
    image: img,
    category: 'grammar',
    author: 'Lê Văn Tâm',
    date: '10/04/2023',
    tags: ['ngữ pháp', 'lỗi thường gặp', 'cách khắc phục'],
    readTime: '8 phút',
  },
  {
    id: 8,
    title: 'Ứng dụng công nghệ AI trong việc học tiếng Trung',
    excerpt: 'Khám phá cách công nghệ trí tuệ nhân tạo (AI) đang cách mạng hóa việc học tiếng Trung và những công cụ AI hữu ích cho người học.',
    image: img,
    category: 'technology',
    author: 'Nguyễn Minh Trí',
    date: '05/05/2023',
    tags: ['công nghệ', 'AI', 'ứng dụng học tập'],
    readTime: '7 phút',
  },
];

const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'tips', name: 'Mẹo học' },
  { id: 'culture', name: 'Văn hóa' },
  { id: 'learning', name: 'Phương pháp học' },
  { id: 'vocabulary', name: 'Từ vựng' },
  { id: 'grammar', name: 'Ngữ pháp' },
  { id: 'technology', name: 'Công nghệ' },
  { id: 'language', name: 'Ngôn ngữ học' },
];

const BlogSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter posts based on active category (show only 6 posts for section)
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts.slice(0, 6)
    : blogPosts.filter(post => post.category === activeCategory).slice(0, 6);

  // Featured post is the first post
  const featuredPost = blogPosts[0];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Blog, Tin tức và Sự kiện</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kiến thức, kinh nghiệm và văn hóa Trung Quốc cho người học tiếng Trung
          </p>
        </div>

        {/* Categories Filter */}
        {/* <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.slice(0, 6).map(category => (
              <button 
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div> */}

        {/* Featured Post */}
        {/* {activeCategory === 'all' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-72 md:h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = img;
                  }}
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="bg-yellow-100 text-yellow-600 inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  Bài viết nổi bật
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800 line-clamp-2">{featuredPost.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <User className="w-4 h-4 mr-1" />
                  <span className="font-medium text-gray-700 mr-4">{featuredPost.author}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="mr-4">{featuredPost.date}</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                  Đọc tiếp <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
              <div className="h-48">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = img;
                  }}
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-medium text-yellow-600 mb-2">
                  {categories.find(cat => cat.id === post.category)?.name}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="w-3 h-3 mr-1" />
                    <span className="mr-3">{post.author}</span>
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                  <button className="text-black-300 hover:text-yellow-700 font-medium text-sm flex items-center gap-1">
                    Đọc thêm <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
            Xem tất cả bài viết <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
