import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg'; // Adjust the path as necessary
const DashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("classes");
  
  const classesRef = useRef<HTMLElement>(null);
  const assignmentsRef = useRef<HTMLElement>(null);
  const documentsRef = useRef<HTMLElement>(null);
  const lecturesRef = useRef<HTMLElement>(null);
  const achievementsRef = useRef<HTMLElement>(null);

  // Sidebar data with notification counts
  const sidebarItems = [
    { id: "classes", label: "Phòng học hôm nay", icon: "🏫", notificationCount: 0, ref: classesRef },
    { id: "assignments", label: "Bài tập chưa làm", icon: "📝", notificationCount: 6, ref: assignmentsRef },
    { id: "documents", label: "Tài liệu chưa đọc", icon: "📄", notificationCount: 8, ref: documentsRef },
    { id: "lectures", label: "Bài giảng chưa xem", icon: "🎬", notificationCount: 40, ref: lecturesRef },
    { id: "achievements", label: "Thành tích", icon: "🏆", notificationCount: 0, ref: achievementsRef },
  ];

  // Mock data for assignments
  const assignments = [
    { name: "txd của hs logarit", class: "LỚP TỐI T4-TỐI CN", deadline: "Không có" },
    { name: "DIỆN TÍCH, THỂ TÍCH TRỤ", class: "LỚP TỐI T4-TỐI CN", deadline: "1 tháng 12 lúc 23:59" },
    { name: "hs lũy thừa vn(20 c)", class: "LỚP TỐI T4-TỐI CN", deadline: "Không có" },
    { name: "nón 1", class: "LỚP TỐI T4-TỐI CN", deadline: "21 tháng 11 lúc 23:59" },
    { name: "TƯƠNG GIAO HÀM HỢP", class: "LỚP TỐI T4-TỐI CN", deadline: "Không có" },
    { name: "ôn tập1 35 c", class: "LỚP TỐI T4-TỐI CN", deadline: "Không có" },
  ];

  // Mock data for documents
  const documents = [
    { name: "Đề các số năm 2022.pdf", class: "LỚP VẬT LÝ - TEAMADAMTHAI", date: "6 tháng 6 lúc 21:20" },
    { name: "Đề 03.pdf", class: "LỚP VẬT LÝ - TEAMADAMTHAI", date: "22 tháng 5 lúc 21:31" },
    { name: "TỔNG HỢP CÁC CÂU HỎI LÝ THUYẾT sai ngu.pdf", class: "LỚP VẬT LÝ - TEAMADAMTHAI", date: "10 tháng 5 lúc 23:03" },
    { name: "BÀI TẬP SỬ DỤNG PHƯƠNG PHÁP GIẢN ĐỒ VECTO (1).pdf", class: "LỚP VẬT LÝ - TEAMADAMTHAI", date: "10 tháng 5 lúc 16:10" },
    { name: "Đề-thi-thử-Vật-Lý.pdf", class: "LỚP VẬT LÝ - TEAMADAMTHAI", date: "2 tháng 5 lúc 21:44" },
    { name: "Bài tập buổi 01-05-2022.pdf", class: "LỚP VẬT LÝ - TEAMADAMTHAI", date: "2 tháng 5 lúc 8:46" },
    { name: "TÔNG HỢP BÀI GIẢNG CÁC BUỔI.pdf", class: "LỚP VẬT LÝ - TEAMADAMTHAI", date: "3 tháng 4 lúc 14:42" },
    { name: "600-cau-trac-nghiem-vat-ly-lop-12.pdf", class: "LỚP VẬT LÝ - TEAMADAMTHAI", date: "25 tháng 3 lúc 11:02" },
  ];

  // Mock data for lectures
  const lectures = [
    { name: "Chữa tiếp đề 4 ( 29/5/2022)", class: "LỚP VẬT LÝ - TEAMADAMTHAI", date: "29 tháng 5 lúc 23:33" },
    // Add more lectures as needed to get to 40 items
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      const sections = sidebarItems
        .filter(item => item.ref.current)
        .map(item => ({
          id: item.id,
          offsetTop: item.ref.current?.offsetTop || 0
        }))
        .sort((a, b) => a.offsetTop - b.offsetTop);
      
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offsetTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>, sectionId: string) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(sectionId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <img src={logoImage} alt="Nihao" className="h-8" />
          <div>
            <span className="font-bold text-lg text-blue-600">NiHao</span>
            <span className="text-xs text-gray-500"> Education</span>
          </div>
        </div>
        {/* <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.ref, item.id)}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.notificationCount > 0 && (
                    <span className={`ml-auto rounded-full px-2 text-xs text-white ${
                      item.id === "assignments" 
                        ? "bg-red-500" 
                        : item.id === "documents"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                    }`}>
                      {item.notificationCount}
                    </span>
                  )}
                  {activeSection === item.id && (
                    <svg className="ml-auto w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav> */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Phòng học hôm nay</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hỏi đáp
            </a>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-white">
                AD
              </div>
              <span className="font-medium">Đức</span>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Today's Classes Section */}
        <section ref={classesRef} className="mb-12">
          <div className="bg-white rounded-lg shadow p-8 mb-8 flex flex-col items-center justify-center">
            <div className="w-32 h-32 mb-6">
              <img src="/images/star-icon.svg" alt="No classes" className="w-full h-full" />
            </div>
            <p className="text-gray-500 text-lg">Không có buổi học nào diễn ra hôm nay</p>
          </div>
        </section>

        {/* Assignments Section */}
        <section ref={assignmentsRef} className="mb-12">
          <h2 className="text-xl font-bold mb-4">Bài tập chưa nộp • {assignments.length}</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-3 px-6 text-left font-medium">Tên bài tập</th>
                  <th className="py-3 px-6 text-left font-medium">Lớp</th>
                  <th className="py-3 px-6 text-left font-medium">Hạn chót</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assignments.map((assignment, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold mr-2">
                          PDF
                        </span>
                        <span>{assignment.name}</span>
                        <span className="ml-2 text-gray-400 text-sm">Chưa làm</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{assignment.class}</td>
                    <td className="py-4 px-6">{assignment.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Documents Section */}
        <section ref={documentsRef} className="mb-12">
          <h2 className="text-xl font-bold mb-4">Tài liệu chưa đọc • {documents.length}</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-3 px-6 text-left font-medium">Tên tài liệu</th>
                  <th className="py-3 px-6 text-left font-medium">Lớp</th>
                  <th className="py-3 px-6 text-left font-medium">Ngày đăng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((document, index) => (
                  <tr key={index} className={index === 2 ? "bg-blue-50" : ""}>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold mr-2">
                          PDF
                        </span>
                        <span>{document.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{document.class}</td>
                    <td className="py-4 px-6">{document.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Lectures Section */}
        <section ref={lecturesRef} className="mb-12">
          <h2 className="text-xl font-bold mb-4">Bài giảng chưa xem • 40</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-3 px-6 text-left font-medium">Tên bài giảng</th>
                  <th className="py-3 px-6 text-left font-medium">Lớp</th>
                  <th className="py-3 px-6 text-left font-medium">Ngày đăng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lectures.map((lecture, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold mr-2">
                          VIDEO
                        </span>
                        <span>{lecture.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{lecture.class}</td>
                    <td className="py-4 px-6">{lecture.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Achievements Section */}
        <section ref={achievementsRef} className="mb-12">
          <h2 className="text-xl font-bold mb-4">Thành tích</h2>
          <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center">
            <div className="w-24 h-24 mb-4">
              <img src="/images/trophy-icon.svg" alt="Achievements" className="w-full h-full" />
            </div>
            <p className="text-gray-500 text-lg">Không có thành tích nào</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;