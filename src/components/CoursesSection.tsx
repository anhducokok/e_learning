import React from 'react';
import { Clock, Video, Users } from 'lucide-react';
import img from '../images/course.jpg'

const courses = [
  {
    id: 1,
    image: '/images/course-1.jpg',
    title: 'Dasar Pemrograman WEB',
    description: 'Materi pembelajaran mengenai pembuatan website tingkat pemula',
    hours: '4,5 Jam',
    videos: 20,
    students: 1900,
  },
  {
    id: 2,
    image: '/images/course-2.jpg',
    title: 'Digital Marketing 101',
    description: 'Materi mengenai strategi dan konsep marketing pemula',
    hours: '6,2 Jam',
    videos: 32,
    students: 930,
  },
  {
    id: 3,
    image: '/images/course-3.jpg',
    title: 'Data Science Dasar',
    description: 'Materi pembelajaran mengenai dasar-dasar data science',
    hours: '8 Jam',
    videos: 46,
    students: 1043,
  },
];

const CourseListSection: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Các lớp học đang sẵn sàng</h2>
          <div className="flex items-center gap-3">
            <select className="border px-4 py-2 rounded-md text-sm">
              <option>Số lượng</option>
              <option>Thời lượng</option>
              <option>Phổ biến</option>
            </select>
            <button className="bg-yellow-400 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-500">
              Xem thêm
            </button>
          </div>
        </div>

        <hr className="mb-10 border-gray-200" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id}>
              <img
                src={img}
                alt={course.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">{course.description}</p>
              <div className="flex flex-wrap text-sm text-gray-700 gap-x-4 gap-y-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.hours}
                </div>
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  {course.videos} Video
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.students.toLocaleString()} Siswa
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseListSection;
