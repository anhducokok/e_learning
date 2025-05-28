import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiClock, FiVideo, FiUsers } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  videos: number;
  students: number;
  rating: number;
}

const MyClassesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const courses: Course[] = [
    {
      id: 1,
      title: 'Public Speaking Dasar',
      description: 'Pelajari tentang konsep dan teori dasar public speaking',
      image: '/images/course-public-speaking.jpg',
      duration: '2,6 Jam',
      videos: 13,
      students: 900,
      rating: 4.6
    },
    {
      id: 2,
      title: 'Jaringan Dasar',
      description: 'Pemebelajaran jaringan komputer dasar untuk semua kalangan',
      image: '/images/course-networking.jpg',
      duration: '4 Jam',
      videos: 17,
      students: 909,
      rating: 4.9
    },
    {
      id: 3,
      title: 'UI/UX Pemula',
      description: 'Dasar-dasar teori dan praktik tentang dunia ui/ux design',
      image: '/images/course-uiux.jpg',
      duration: '5 Jam',
      videos: 25,
      students: 1150,
      rating: 4.7
    },
    {
      id: 4,
      title: 'Bahasa Inggris Dasar',
      description: 'Mudah dalam berbicara dengan bahasa inggris dengan menguasai grammar',
      image: '/images/course-english.jpg',
      duration: '12 Jam',
      videos: 50,
      students: 1430,
      rating: 4.8
    },
    {
      id: 5,
      title: 'Teknologi Cocok Tanaman',
      description: 'Teknik penanaman dengan bantuan teknologi yang terbukti',
      image: '/images/course-agriculture.jpg',
      duration: '7 Jam',
      videos: 24,
      students: 505,
      rating: 4.4
    },
    {
      id: 6,
      title: 'Machine Learning 101',
      description: 'Pelajari konsep dasar tentang mechine learning',
      image: '/images/course-machine-learning.jpg',
      duration: '7 Jam',
      videos: 17,
      students: 200,
      rating: 4.9
    },
    {
      id: 7,
      title: 'Dasar Pemrograman WEB',
      description: 'Materi pembelajarn mengenai pembuatan website tingkat pemula',
      image: '/images/course-web-dev.jpg',
      duration: '4,5 Jam',
      videos: 20,
      students: 1900,
      rating: 4.9
    },
    {
      id: 8,
      title: 'Digital Marketing 101',
      description: 'Materi mengenai strategi dan konsep marketing pemula',
      image: '/images/course-digital-marketing.jpg',
      duration: '6,2 Jam',
      videos: 32,
      students: 930,
      rating: 4.9
    },
    {
      id: 9,
      title: 'Data Science Dasar',
      description: 'Materi pembelajaran mengenai dasar-dasar data science',
      image: '/images/course-data-science.jpg',
      duration: '8 Jam',
      videos: 46,
      students: 1043,
      rating: 4.9
    }
  ];

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const coursesPerPage = 6;
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-600 opacity-70">Trang chủ &gt; Lớp học của tôi</p>
        </div>
      </div>
      
      <main className="flex-grow py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-10 flex justify-center">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Tìm lớp học . . ."
                className="w-full px-4 py-4 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#282938" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#282938" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCourses.map((course) => (
              <div key={course.id} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-60 w-full object-cover"
                    // onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    //   e.currentTarget.src = '/images/placeholder.jpg';
                    //   console.log('Course image failed to load, using placeholder');
                    // }}
                  />
                  <div className="absolute right-4 top-4 bg-[#1C1E53] text-white px-3 py-1 rounded-3xl flex items-center">
                    <FaStar className="text-[#FCD980] mr-1" size={14} />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-xl font-medium mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-6">{course.description}</p>
                  <div className="mt-auto grid grid-cols-3 gap-2">
                    <div className="flex items-center opacity-90">
                      <FiClock className="mr-2 opacity-80" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center opacity-90">
                      <FiVideo className="mr-2 opacity-80" />
                      <span className="text-sm">{course.videos} Video</span>
                    </div>
                    <div className="flex items-center opacity-90">
                      <FiUsers className="mr-2 opacity-80" />
                      <span className="text-sm">
                        {course.students > 999
                          ? `${(course.students / 1000).toFixed(3).replace('.', '.')} Siswa`
                          : `${course.students} Siswa`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 flex items-center justify-center rounded-md ${
                      currentPage === page
                        ? 'bg-[#FCD980] text-black font-bold shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyClassesPage;
