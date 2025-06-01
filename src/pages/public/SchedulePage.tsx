import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign, Star, Filter, Search } from 'lucide-react';
import type { ClassSession } from '../../types/api';

const SchedulePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'featured' | 'upcoming' | 'calendar'>('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Mock data for Chinese language classes
  const mockSessions: ClassSession[] = [
    {
      id: '1',
      title: 'HSK 1 - Foundations of Chinese',
      description: 'Perfect for complete beginners. Learn basic greetings, numbers, and essential daily vocabulary.',
      courseId: 'course-1',
      course: {
        id: 'course-1',
        title: 'HSK 1 Complete Course',
        description: 'Complete beginner course for HSK 1',
        level: 'beginner',
        duration: '8 weeks',
        image: '/images/hsk1.jpg',
        price: 150000
      },
      instructorId: 'inst-1',
      instructor: {
        id: 'inst-1',
        name: 'Professor Li Wei',
        email: 'li.wei@example.com',
        avatar: '/images/instructor-li.jpg'
      },
      startTime: '2024-12-20T09:00:00Z',
      endTime: '2024-12-20T10:30:00Z',
      status: 'upcoming',
      maxStudents: 25,
      currentStudents: 18,
      location: 'Room A101, Main Campus',
      price: 150000
    },
    {
      id: '2',
      title: 'HSK 2 - Building Vocabulary',
      description: 'Expand your Chinese vocabulary and grammar understanding with practical conversations.',
      courseId: 'course-2',
      course: {
        id: 'course-2',
        title: 'HSK 2 Intermediate Course',
        description: 'Intermediate course for HSK 2',
        level: 'beginner',
        duration: '10 weeks',
        image: '/images/hsk2.jpg',
        price: 200000
      },
      instructorId: 'inst-2',
      instructor: {
        id: 'inst-2',
        name: 'Teacher Zhang Ming',
        email: 'zhang.ming@example.com',
        avatar: '/images/instructor-zhang.jpg'
      },
      startTime: '2024-12-20T14:00:00Z',
      endTime: '2024-12-20T15:30:00Z',
      status: 'upcoming',
      maxStudents: 20,
      currentStudents: 15,
      location: 'Room B205, East Building',
      price: 200000
    },
    {
      id: '3',
      title: 'Business Chinese Essentials',
      description: 'Learn professional Chinese for workplace communication, meetings, and business correspondence.',
      courseId: 'course-3',
      course: {
        id: 'course-3',
        title: 'Business Chinese Complete',
        description: 'Professional Chinese for business',
        level: 'intermediate',
        duration: '12 weeks',
        image: '/images/business-chinese.jpg',
        price: 350000
      },
      instructorId: 'inst-3',
      instructor: {
        id: 'inst-3',
        name: 'Dr. Wang Xiaoli',
        email: 'wang.xiaoli@example.com',
        avatar: '/images/instructor-wang.jpg'
      },
      startTime: '2024-12-21T10:00:00Z',
      endTime: '2024-12-21T11:30:00Z',
      status: 'upcoming',
      maxStudents: 15,
      currentStudents: 12,
      location: 'Conference Room C, Business Center',
      price: 350000
    },
    {
      id: '4',
      title: 'HSK 3 - Intermediate Conversations',
      description: 'Develop intermediate speaking skills and tackle more complex grammar structures.',
      courseId: 'course-4',
      course: {
        id: 'course-4',
        title: 'HSK 3 Advanced Intermediate',
        description: 'Advanced intermediate Chinese course',
        level: 'intermediate',
        duration: '12 weeks',
        image: '/images/hsk3.jpg',
        price: 280000
      },
      instructorId: 'inst-4',
      instructor: {
        id: 'inst-4',
        name: 'Master Chen Hui',
        email: 'chen.hui@example.com',
        avatar: '/images/instructor-chen.jpg'
      },
      startTime: '2024-12-22T16:00:00Z',
      endTime: '2024-12-22T17:30:00Z',
      status: 'upcoming',
      maxStudents: 18,
      currentStudents: 14,
      location: 'Room D301, Language Center',
      price: 280000
    },
    {
      id: '5',
      title: 'Children\'s Chinese (Ages 6-12)',
      description: 'Fun and interactive Chinese learning designed specifically for young learners.',
      courseId: 'course-5',
      course: {
        id: 'course-5',
        title: 'Kids Chinese Adventure',
        description: 'Chinese course for children',
        level: 'beginner',
        duration: '16 weeks',
        image: '/images/kids-chinese.jpg',
        price: 180000
      },
      instructorId: 'inst-5',
      instructor: {
        id: 'inst-5',
        name: 'Teacher Liu Mei',
        email: 'liu.mei@example.com',
        avatar: '/images/instructor-liu.jpg'
      },
      startTime: '2024-12-23T09:30:00Z',
      endTime: '2024-12-23T10:30:00Z',
      status: 'upcoming',
      maxStudents: 12,
      currentStudents: 8,
      location: 'Kids Learning Studio, Ground Floor',
      price: 180000
    },
    {
      id: '6',
      title: 'HSK 4 - Advanced Communication',
      description: 'Master advanced Chinese communication skills and prepare for HSK 4 examination.',
      courseId: 'course-6',
      course: {
        id: 'course-6',
        title: 'HSK 4 Mastery Course',
        description: 'Advanced Chinese communication course',
        level: 'advanced',
        duration: '14 weeks',
        image: '/images/hsk4.jpg',
        price: 320000
      },
      instructorId: 'inst-6',
      instructor: {
        id: 'inst-6',
        name: 'Professor Zhao Ling',
        email: 'zhao.ling@example.com',
        avatar: '/images/instructor-zhao.jpg'
      },
      startTime: '2024-12-24T11:00:00Z',
      endTime: '2024-12-24T12:30:00Z',
      status: 'upcoming',
      maxStudents: 16,
      currentStudents: 11,
      location: 'Advanced Learning Lab, 3rd Floor',
      price: 320000
    }
  ];

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getLevelBadge = (level: string) => {
    const levelColors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    const levelNames = {
      'beginner': 'Cơ bản',
      'intermediate': 'Trung cấp',
      'advanced': 'Nâng cao'
    };
    return {
      color: levelColors[level as keyof typeof levelColors] || 'bg-gray-100 text-gray-800',
      name: levelNames[level as keyof typeof levelNames] || level
    };
  };

  const getAvailabilityColor = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio < 0.5) return 'text-green-600';
    if (ratio < 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Filter sessions based on search and level
  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || session.course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  // Featured sessions (top 3 by enrollment)
  const featuredSessions = [...mockSessions]
    .sort((a, b) => (b.currentStudents || 0) - (a.currentStudents || 0))
    .slice(0, 3);

  const SessionCard: React.FC<{ session: ClassSession; featured?: boolean }> = ({ session, featured }) => {
    const levelBadge = getLevelBadge(session.course.level);
    const availabilityColor = getAvailabilityColor(session.currentStudents || 0, session.maxStudents || 1);
    
    return (
      <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${featured ? 'border-2 border-yellow-400' : 'border border-gray-200'}`}>
        {featured && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center py-2 font-semibold">
            <Star className="inline w-4 h-4 mr-1" />
            Khóa học nổi bật
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{session.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelBadge.color}`}>
              {levelBadge.name}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm">{formatDate(session.startTime)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-sm">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-red-500" />
              <span className="text-sm">{session.location}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Users className="w-4 h-4 mr-2 text-purple-500" />
              <span className={`text-sm ${availabilityColor}`}>
                {session.currentStudents}/{session.maxStudents} học viên
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <img
                src={session.instructor.avatar || '/images/default-avatar.jpg'}
                alt={session.instructor.name}
                className="w-8 h-8 rounded-full mr-2"
                onError={(e) => {
                  e.currentTarget.src = '/images/default-avatar.jpg';
                }}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{session.instructor.name}</p>
                <p className="text-xs text-gray-500">Giảng viên</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-lg font-bold text-green-600">
                <DollarSign className="w-4 h-4 mr-1" />
                {formatPrice(session.price || 0)}
              </div>
              <button className="mt-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WeeklyCalendarView: React.FC = () => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const sessionsByDay = mockSessions.reduce((acc, session) => {
      const dayIndex = new Date(session.startTime).getDay();
      const adjustedDay = dayIndex === 0 ? 6 : dayIndex - 1; // Convert Sunday=0 to index 6
      if (!acc[adjustedDay]) acc[adjustedDay] = [];
      acc[adjustedDay].push(session);
      return acc;
    }, {} as Record<number, ClassSession[]>);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {days.map((day, index) => (
          <div key={day} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-gray-900 mb-3 text-center border-b pb-2">
              {day}
            </h3>
            <div className="space-y-2">
              {sessionsByDay[index]?.map(session => (
                <div key={session.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-sm text-gray-900 truncate">{session.title}</p>
                  <p className="text-xs text-gray-600">{formatTime(session.startTime)}</p>
                  <p className="text-xs text-blue-600">{session.instructor.name}</p>
                </div>
              )) || (
                <p className="text-gray-400 text-sm text-center py-4">Không có lớp học</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Lịch học 
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              {' '}Tiếng Trung
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các khóa học tiếng Trung chất lượng cao với giảng viên giàu kinh nghiệm
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 inline-flex">
            {[
              { key: 'featured', label: 'Nổi bật', icon: Star },
              { key: 'upcoming', label: 'Sắp diễn ra', icon: Clock },
              { key: 'calendar', label: 'Lịch tuần', icon: Calendar }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as any)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeView === key
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Controls */}
        {(activeView === 'upcoming' || activeView === 'featured') && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học hoặc giảng viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Tất cả cấp độ</option>
                  <option value="beginner">Cơ bản</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content based on active view */}
        {activeView === 'featured' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Khóa học nổi bật nhất
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredSessions.map(session => (
                <SessionCard key={session.id} session={session} featured={true} />
              ))}
            </div>
          </div>
        )}

        {activeView === 'upcoming' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tất cả khóa học sắp diễn ra ({filteredSessions.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Lịch học trong tuần
            </h2>
            <WeeklyCalendarView />
          </div>
        )}

        {/* Empty state */}
        {activeView === 'upcoming' && filteredSessions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Không tìm thấy khóa học nào
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('all');
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;