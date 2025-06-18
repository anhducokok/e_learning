import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { Course } from '../../types/api';
import tralelaImage from '../../images/tralela.jpg';
import tungtungImage from '../../images/tungtung.jpg';
import HSK3Image from '../../images/HSK3.jpg';
import tieImage from "../../images/download.jpg";
const LearningRoomPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const { user } = useAuth();

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) {
        return;
      }
      
      try {
        setLoading(true);
        const courses = await courseService.getMyCourses();
        setMyCourses(courses);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch your courses');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [user]);

  // Sample learning path data

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="flex max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 gap-6">
        <div className="w-72 bg-white rounded-lg shadow-md flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="mb-4 relative w-24 h-24 mx-auto">
              <img src={tungtungImage} alt="User avatar" className="rounded-full w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800">{user?.name || 'Học viên'}</h3>
              <p className="text-gray-500 text-sm mb-4">Học viên</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <span className="block text-xl font-bold text-red-600">{myCourses.length}</span>
                  <span className="text-xs text-gray-500">Khóa học</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-red-600">45</span>
                  <span className="text-xs text-gray-500">Bài học</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-red-600">12</span>
                  <span className="text-xs text-gray-500">Giờ học</span>
                </div>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4">
            <button
              className={`flex items-center w-full px-4 py-3 mb-2 text-left rounded-lg transition ${activeTab === 'courses' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('courses')}
            >
              <span className="mr-3 text-xl">📚</span>
              <span className="font-medium">Khóa học của tôi</span>
            </button>
           <button
              className={`flex items-center w-full px-4 py-3 mb-2 text-left rounded-lg transition ${activeTab === 'practice' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('practice')}
            >
              <span className="mr-3 text-xl">✏️</span>
              <span className="font-medium">Luyện tập</span>
            </button>
            <button
              className={`flex items-center w-full px-4 py-3 mb-2 text-left rounded-lg transition ${activeTab === 'achievements' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('achievements')}
            >
              <span className="mr-3 text-xl">🏆</span>
              <span className="font-medium">Thành tựu</span>
            </button>
            <button
              className={`flex items-center w-full px-4 py-3 mb-2 text-left rounded-lg transition ${activeTab === 'settings' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="mr-3 text-xl">⚙️</span>
              <span className="font-medium">Cài đặt</span>
            </button>
          </nav>
          <div className="p-4 mt-auto border-t border-gray-200">
            <div className="flex items-center mb-3">
              <span className="mr-2 text-lg">🔥</span>
              <span className="text-gray-700 font-medium">5 ngày liên tiếp</span>
            </div>
            <div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <span className="text-xs text-gray-600">Mục tiêu hàng ngày: 70%</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6 rounded-lg shadow-md mb-6 flex flex-wrap md:flex-nowrap justify-between items-center">
            <div className="w-full md:w-3/5 mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Xin chào, {user?.name || 'bạn'}!</h1>
              <p className="text-red-100">Chào mừng trở lại với hành trình học tiếng Trung của bạn. Hôm nay bạn muốn học gì?</p>
            </div>
            <div className="w-full md:w-2/5 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Thử thách hôm nay</h3>
              <p className="text-sm mb-4 text-red-100">Học 5 từ vựng mới & hoàn thành 1 bài tập nghe</p>
              <button className="bg-white text-red-600 font-medium py-2 px-4 rounded-lg hover:bg-red-50 transition-colors">Bắt đầu ngay</button>
            </div>
          </div>
          
          {activeTab === 'courses' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Khóa học của tôi</h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Link
                    to="/courses"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Khám phá khóa học
                  </Link>
                </div>
              ) : myCourses.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Bạn chưa đăng ký khóa học nào
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Khám phá các khóa học thú vị và bắt đầu hành trình học tập của bạn
                  </p>
                  <Link
                    to="/courses"
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Khám phá khóa học
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myCourses.map(course => (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row" key={course.id}>
                      <div className="relative md:w-1/3">
                        <img 
                          src={course.image || tralelaImage} 
                          alt={course.title} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = tralelaImage;
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          {/* <svg className="w-16 h-16" viewBox="0 0 36 36">
                            <path
                              className="stroke-gray-300 fill-none stroke-2"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="stroke-red-500 fill-none stroke-2"
                              strokeDasharray="50, 100"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="text-sm font-medium fill-red-600 text-center" textAnchor="middle">50%</text>
                          </svg> */}
                        </div>
                      </div>
                      <div className="p-6 md:w-2/3 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-2 text-gray-800">{course.title}</h3>                          <p className="text-sm text-gray-600 mb-4">
                            <span className="font-semibold">Giảng viên:</span> {course.teacher?.name || course.instructor?.name || 'Chưa có thông tin'}
                          </p>
                        </div>
                        <Link
                          to={`/learning-session/${course.id}`}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-center"
                        >
                          Tiếp tục học
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Khám phá thêm khóa học</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link to="/courses" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-2">HSK 2 - Nâng cao kỹ năng</h4>
                    <p className="text-gray-600 text-sm">Nâng cao trình độ tiếng Trung với khóa học HSK 2</p>
                  </Link>
                  <Link to="/courses" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-2">Tiếng Trung văn phòng</h4>
                    <p className="text-gray-600 text-sm">Học tiếng Trung chuyên ngành văn phòng và công sở</p>
                  </Link>
                  <Link to="/courses" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-2">Xem tất cả khóa học</h4>
                    <p className="text-gray-600 text-sm">Khám phá hơn 50+ khóa học tiếng Trung</p>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
         
       

          {activeTab === 'achievements' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Thành tựu</h2>
              <p className="text-gray-600">Tính năng đang phát triển. Sẽ sớm ra mắt!</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cài đặt</h2>
              <p className="text-gray-600">Tính năng đang phát triển. Sẽ sớm ra mắt!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default LearningRoomPage;
