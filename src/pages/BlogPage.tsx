import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample blog data
  const blogPosts = [
    {
      id: 1,
      title: 'Cách học chữ Hán hiệu quả cho người mới bắt đầu',
      excerpt: 'Khám phá những phương pháp đơn giản giúp bạn ghi nhớ và viết chữ Hán dễ dàng, phù hợp cho những người mới bắt đầu học tiếng Trung.',
      image: './images/tralela.jpg',
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
      image: '/images/tralela.jpg',
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
      image: '/images/tralela.jpg',
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
      image: '/images/tralela.jpg',
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
      image: '/images/tralela.jpg',
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
      image: '/images/tralela.jpg',
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
      image: '/images/tralela.jpg',
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
      image: './images/tralela.jpg',
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

  // Filter posts based on active category
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  // Featured post is the first post
  const featuredPost = blogPosts[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-cover bg-center py-20 text-white" style={{ backgroundImage: 'linear-gradient(rgba(29, 53, 87, 0.85), rgba(29, 53, 87, 0.85)), url("/images/blog-hero-bg.jpg")' }}>
        <div className="max-w-5xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog tiếng Trung NiHao</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">Chia sẻ kiến thức, kinh nghiệm và văn hóa Trung Quốc cho người học tiếng Trung</p>
          
          <div className="max-w-2xl mx-auto flex">
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết..." 
              className="flex-grow px-4 py-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 border-0"
            />
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 text-white font-medium rounded-r-md transition-colors">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Danh mục</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button 
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Featured Post */}
        {activeCategory === 'all' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-72 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="bg-red-100 text-red-600 inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  Bài viết nổi bật
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span className="font-medium text-gray-700 mr-3">{featuredPost.author}</span>
                  <span className="mr-3">{featuredPost.date}</span>
                  <span>{featuredPost.readTime} đọc</span>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded transition-colors">
                  Đọc tiếp
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Posts Grid and Sidebar */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Posts Grid */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {activeCategory === 'all' ? 'Tất cả bài viết' : 
                categories.find(cat => cat.id === activeCategory)?.name || 'Bài viết'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                  <div className="h-48">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-medium text-red-600 mb-2">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-3">{post.author}</span>
                      <span className="mr-3">{post.date}</span>
                      <span>{post.readTime} đọc</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-1">
                <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-md">1</button>
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">2</button>
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">3</button>
                <span className="px-2 text-gray-500">...</span>
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">10</button>
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                  Tiếp
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Popular Posts */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Bài viết phổ biến</h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="w-20 h-20 shrink-0">
                      <img 
                        src={`/images/popular-post-${i}.jpg`} 
                        alt="Popular post" 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1 line-clamp-2">
                        {i === 1 ? "5 ứng dụng học tiếng Trung miễn phí tốt nhất" : 
                         i === 2 ? "Kinh nghiệm thi HSK 4 đạt điểm cao" : 
                         "Các cấu trúc ngữ pháp quan trọng trong HSK 3"}
                      </h4>
                      <div className="flex text-xs text-gray-500">
                        <span className="mr-3">
                          {i === 1 ? "05/03/2023" : i === 2 ? "12/04/2023" : "28/04/2023"}
                        </span>
                        <span>{i === 1 ? "5" : i === 2 ? "8" : "7"} phút đọc</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Từ khóa phổ biến</h3>
              
              <div className="flex flex-wrap gap-2">
                {["HSK", "Ngữ pháp", "Từ vựng", "Luyện nghe", "Chữ Hán", "Giao tiếp", 
                  "Phương pháp học", "Kinh nghiệm", "Văn hóa", "Ứng dụng học tập", "Luyện thi", 
                  "Nghe nói đọc viết"].map(tag => (
                  <Link 
                    key={tag} 
                    to="#"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Đăng ký nhận bài viết mới</h3>
              <p className="text-gray-600 mb-4">Nhận thông báo khi có bài viết mới về học tiếng Trung</p>
              
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subscribe Banner */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Bạn muốn nâng cao trình độ tiếng Trung?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">Đăng ký khóa học trực tuyến để được học với giáo viên người Trung và nhận hỗ trợ học tập 1-1</p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-3 px-8 rounded-md transition-colors">
            Xem khóa học
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
