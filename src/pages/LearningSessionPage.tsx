import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

const LearningSessionPage: React.FC = () => {
  const [currentTool] = useState<string>('installasi');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/learning-room');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />

      {/* Breadcrumb & Back Button */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <Link to="/learning-room" className="hover:text-blue-600">Learning Room</Link>
            <span>/</span>
            <Link to="/learning-room" className="hover:text-blue-600">Web Development</Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold">Installasi Tools</span>
          </div>
          <button
            onClick={handleBack}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Learning Room
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-x-6">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-lg shadow p-4 h-fit">
          <nav className="space-y-6">
            {[
              { title: "Startups", items: ["Introduction to Startups", "A bit of basic theory"], complete: 25 },
              { title: "HTML", items: ["Introduction to HTML"], complete: 10 },
              {
                title: "Installation",
                items: ["Download tools", "Installasi Tools", "Basic Programming Tools"],
                complete: 50,
              },
              {
                title: "Deeper HTML",
                items: ["Formatting HTML", "Links", "Tables", "Lists"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">{section.title}</h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className={`text-sm px-2 py-1 rounded-md transition ${
                        item === "Installasi Tools"
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-xl shadow px-8 py-6">
          <h1 className="text-2xl font-bold mb-4">Installasi Tools</h1>

          {/* Video Thumbnail */}
          <div className="mb-6">
            <div className="relative overflow-hidden rounded-lg shadow-lg aspect-w-16 aspect-h-9">
              <img
                src="/images/video-thumbnail.jpg"
                alt="Installation video"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-white border-b-8 border-b-transparent ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="prose max-w-none text-gray-700 mb-10">
            <p>
              In this section, you will learn how to install all the necessary tools for web development.
              We'll cover installation of code editors, browsers, and other essential utilities.
            </p>
            <p>Make sure to follow along with the video tutorial above for step-by-step guidance.</p>

            <h2>Required Tools</h2>
            <ul>
              <li>Visual Studio Code or another code editor</li>
              <li>Node.js and npm</li>
              <li>Git for version control</li>
              <li>Chrome or Firefox for testing</li>
            </ul>

            <h2>Installation Steps</h2>
            <ol>
              <li>Download Visual Studio Code from the official website</li>
              <li>Install Node.js LTS version</li>
              <li>Check installation with <code>node -v</code> and <code>npm -v</code></li>
              <li>Download and install Git</li>
              <li>Configure Git with your credentials</li>
            </ol>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100">
              ← Previous
            </button>
            <button className="px-5 py-2 bg-yellow-400 rounded-md text-gray-800 hover:bg-yellow-500 font-medium shadow">
              Continue & Complete →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearningSessionPage;
