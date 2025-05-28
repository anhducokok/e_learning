import React from 'react';
import { MessageCircle, FileText } from 'lucide-react'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import chinaGirl from '../images/china_girl.jpg';

type Post = {
  id: number;
  author: string;
  avatar?: string; 
  type: 'assignment' | 'lecture';
  date: string;
  content?: string;
};

const posts: Post[] = [
  { id: 1, author: 'Nguyễn Việt Hà', type: 'assignment', date: '19 tháng 5 2025' },
  { id: 2, author: 'Nguyễn Việt Hà', type: 'lecture', date: '19 tháng 5 2025' },
  { id: 3, author: 'Nguyễn Việt Hà', avatar: '/avatar.png', type: 'lecture', date: '19 tháng 5 2025', content: 'Lên lớp học thôi cả nhà ơi' },
  { id: 4, author: 'Nguyễn Việt Hà', type: 'assignment', date: '19 tháng 5 2025' },
  { id: 5, author: 'Nguyễn Việt Hà', type: 'lecture', date: '19 tháng 5 2025' },
  { id: 6, author: 'Nguyễn Việt Hà', avatar: '/avatar.png', type: 'lecture', date: '19 tháng 5 2025', content: 'Lên lớp học thôi cả nhà ơi' },
  { id: 7, author: 'Nguyễn Việt Hà', type: 'assignment', date: '19 tháng 5 2025' },
  { id: 8, author: 'Nguyễn Việt Hà', type: 'assignment', date: '19 tháng 5 2025' },
];

const CoursePage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      <Header />
      <div className="bg-[#A82828] flex justify-between items-center p-6 rounded-b-xl shadow">
        <div>
          <h1 className="text-2xl text-white font-bold">Dasar Pemrograman WEB</h1>
          <p className="text-sm text-white">Giáo Viên: Nguyễn Việt Hà</p>
        </div>
        <img src={chinaGirl} alt="student" className="h-24" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-12 gap-4 p-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-gray-100 p-4 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-2">Lịch học và các bài tập</h2>
            <p className="text-sm">9.00AM: Học online</p>
            <p className="text-sm">11.00AM: Hạn nộp bài tập</p>
          </div>
        </div>

        {/* Posts */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-4">
          {/* Ask box */}
          <div className="bg-white border rounded-xl shadow p-4 flex items-center gap-2">
            <MessageCircle className="text-gray-500" />
            <span className="text-gray-600">Hỏi đáp về những vấn đề thắc mắc</span>
          </div>

          {/* List of posts */}
          {posts.map(post => (
            <div key={post.id} className="bg-white border rounded-xl shadow p-4 flex gap-3 items-start">
              {/* Avatar or icon */}
              {post.avatar ? (
                <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="bg-[#A82828] rounded-full w-10 h-10 flex items-center justify-center">
                  <FileText className="text-white" />
                </div>
              )}

              {/* Content */}
              <div>
                <p className="font-semibold">
                  {post.author} đã đăng một {post.type === 'assignment' ? 'bài tập' : 'bài giảng'}
                </p>
                <p className="text-sm text-gray-500">{post.date}</p>
                {post.content && <p className="text-sm mt-1">{post.content}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoursePage;
