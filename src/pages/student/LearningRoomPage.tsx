import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
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
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Debug logging for render state
  console.log('🎭 LearningRoomPage render - Current state:', {
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    myCoursesLength: myCourses?.length || 0,
    myCourses: myCourses,
    loading,
    error
  });useEffect(() => {
    const fetchMyCourses = async () => {
      console.log('🔍 LearningRoomPage: fetchMyCourses called, user:', user);
      if (!user) {
        console.log('❌ LearningRoomPage: No user found, skipping course fetch');
        return;
      }
      
      try {
        setLoading(true);
        console.log('📞 LearningRoomPage: Calling courseService.getMyCourses()...');
        const courses = await courseService.getMyCourses();
        console.log('✅ LearningRoomPage: Received courses from API:', courses);
        console.log('📊 LearningRoomPage: Courses array length:', courses?.length || 0);
        setMyCourses(courses);
        console.log('✅ LearningRoomPage: State updated with courses');
      } catch (err: any) {
        console.error('❌ LearningRoomPage: Error fetching courses:', err);
        setError(err.message || 'Failed to fetch your courses');
      } finally {
        setLoading(false);
        console.log('✅ LearningRoomPage: Loading set to false');
      }
    };

    fetchMyCourses();
  }, [user]);

  // Sample learning path data
  const learningPaths = [
    {
      id: 1,
      title: 'Từ mới bắt đầu đến HSK 3',
      steps: 30,
      completedSteps: 10,
      description: 'Lộ trình học tiếng Trung từ con số 0 đến HSK 3, giúp bạn đạt trình độ giao tiếp trung cấp',
      image: HSK3Image,
    },
    {
      id: 2,
      title: 'Tiếng Trung thương mại',
      steps: 24,
      completedSteps: 5,
      description: 'Tiếng Trung chuyên ngành về kinh doanh và thương mại, giúp bạn tự tin trong môi trường làm việc',
      image: tieImage,
    },
  ];

  // Sample flashcard sets
  const flashcardSets = [
    {
      id: 1,
      title: 'Từ vựng HSK 1',
      cards: 150,
      mastered: 75,
      lastPracticed: '2 ngày trước',
      image: HSK3Image,
    },
    {
      id: 2,
      title: 'Từ vựng về thức ăn và nhà hàng',
      cards: 100,
      mastered: 40,
      lastPracticed: '1 tuần trước',
      image: tieImage,
    },
    {
      id: 3,
      title: 'Từ vựng về giao thông và du lịch',
      cards: 120,
      mastered: 50,
      lastPracticed: '3 ngày trước',
      image: "https://images.unsplash.com/photo-1695702273667-bbd3af94d45f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QnVzc2luZXNzJTIw",
    },
  ];

  // Sample practice exercises
  const practiceExercises = [
    {
      id: 1,
      title: 'Luyện nghe HSK 1',
      type: 'Luyện nghe',
      questions: 25,
      duration: '20 phút',
      difficulty: 'Cơ bản',
      image: "https://images.unsplash.com/photo-1695702273667-bbd3af94d45f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QnVzc2luZXNzJTIw",
    },
    {
      id: 2,
      title: 'Luyện đọc chữ Hán cơ bản',
      type: 'Luyện đọc',
      questions: 20,
      duration: '15 phút',
      difficulty: 'Cơ bản',
      image: "https://plus.unsplash.com/premium_photo-1661411124435-5de83a96be24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpbmVzZSUyMGV4YW18ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 3,
      title: 'Bài tập ngữ pháp tiếng Trung',
      type: 'Ngữ pháp',
      questions: 30,
      duration: '25 phút',
      difficulty: 'Trung cấp',
      image: "https://plus.unsplash.com/premium_photo-1661600619578-2d9e2593bbfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFzaWMlMjBjaGluZXNlfGVufDB8fDB8fHww",
    },
  ];

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
              className={`flex items-center w-full px-4 py-3 mb-2 text-left rounded-lg transition ${activeTab === 'paths' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('paths')}
            >
              <span className="mr-3 text-xl">🛣️</span>
              <span className="font-medium">Lộ trình học</span>
            </button>
            <button
              className={`flex items-center w-full px-4 py-3 mb-2 text-left rounded-lg transition ${activeTab === 'flashcards' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('flashcards')}
            >
              <span className="mr-3 text-xl">🗂️</span>
              <span className="font-medium">Thẻ ghi nhớ</span>
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
                          src={course.thumbnail || tralelaImage} 
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
                          <h3 className="font-bold text-lg mb-2 text-gray-800">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            <span className="font-semibold">Giảng viên:</span> {course.instructor?.name || 'Chưa có thông tin'}
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
          
          {activeTab === 'paths' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Lộ trình học</h2>

              <div className="space-y-6">
                {learningPaths.map(path => (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row" key={path.id}>
                    <div className="md:w-1/3">
                      <img src={path.image} alt={path.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="font-bold text-lg mb-2 text-gray-800">{path.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{path.description}</p>
                      <div className="mb-4">
                        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                          <div
                            className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                            style={{ width: `${(path.completedSteps / path.steps) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {path.completedSteps}/{path.steps} hoàn thành
                        </span>
                      </div>
                      <Link
                        to={`/learning-session/${path.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Tiếp tục học
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Khám phá lộ trình khác</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-2">Lộ trình HSK 4-6</h4>
                    <p className="text-gray-600 text-sm">Cho người học đã có nền tảng tiếng Trung tốt</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-2">Tiếng Trung du lịch</h4>
                    <p className="text-gray-600 text-sm">Học tiếng Trung chuyên ngành du lịch và khách sạn</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'flashcards' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Thẻ ghi nhớ</h2>

              <div className="space-y-6">
                {flashcardSets.map(set => (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row" key={set.id}>
                    <div className="md:w-1/3">
                      <img src={set.image} alt={set.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="font-bold text-lg mb-3 text-gray-800">{set.title}</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center bg-blue-50 rounded-lg p-2">
                          <span className="block text-sm text-blue-700 font-medium">Thẻ:</span>
                          <span className="block text-blue-800 font-bold">{set.cards}</span>
                        </div>
                        <div className="text-center bg-green-50 rounded-lg p-2">
                          <span className="block text-sm text-green-700 font-medium">Đã thuộc:</span>
                          <span className="block text-green-800 font-bold">{set.mastered}</span>
                        </div>
                        <div className="text-center bg-purple-50 rounded-lg p-2">
                          <span className="block text-sm text-purple-700 font-medium">Lần học cuối:</span>
                          <span className="block text-purple-800 font-bold">{set.lastPracticed}</span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">Luyện tập</button>
                        <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors">Ôn tập</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tạo bộ thẻ mới</h3>
                <p className="text-gray-600 mb-4">Tạo bộ thẻ ghi nhớ riêng với từ vựng bạn muốn học</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">Tạo bộ thẻ mới</button>
              </div>
            </div>
          )}
          
          {activeTab === 'practice' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Bài luyện tập</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {practiceExercises.map(exercise => (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden" key={exercise.id}>
                    <div className="relative">
                      <img src={exercise.image} alt={exercise.title} className="w-full h-48 object-cover" />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">{exercise.type}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-3 text-gray-800">{exercise.title}</h3>
                      <div className="flex flex-wrap mb-4 gap-3">
                        <div className="flex items-center text-gray-700 text-sm">
                          <span className="mr-1 text-lg">❓</span>
                          <span>{exercise.questions} câu hỏi</span>
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                          <span className="mr-1 text-lg">⏱️</span>
                          <span>{exercise.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                          <span className="mr-1 text-lg">📊</span>
                          <span>{exercise.difficulty}</span>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">Bắt đầu</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Danh mục luyện tập</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center bg-blue-50 rounded-lg p-4 shadow hover:shadow-md transition">
                    <div className="text-3xl mb-2">🎧</div>
                    <h4 className="text-base font-medium text-blue-700">Luyện nghe</h4>
                  </div>
                  <div className="flex flex-col items-center bg-green-50 rounded-lg p-4 shadow hover:shadow-md transition">
                    <div className="text-3xl mb-2">📝</div>
                    <h4 className="text-base font-medium text-green-700">Luyện viết</h4>
                  </div>
                  <div className="flex flex-col items-center bg-purple-50 rounded-lg p-4 shadow hover:shadow-md transition">
                    <div className="text-3xl mb-2">🔤</div>
                    <h4 className="text-base font-medium text-purple-700">Ngữ pháp</h4>
                  </div>
                  <div className="flex flex-col items-center bg-yellow-50 rounded-lg p-4 shadow hover:shadow-md transition">
                    <div className="text-3xl mb-2">💬</div>
                    <h4 className="text-base font-medium text-yellow-700">Luyện nói</h4>
                  </div>
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
