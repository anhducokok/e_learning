import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LearningSessionPage: React.FC = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('Installasi Tools');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/learning-room');
  };

  // Sidebar data
  const sidebarSections = [
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
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-white text-gray-900">
      {/* Breadcrumb & Back Button */}
      <div className="border-b bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-sm font-medium tracking-wide text-gray-600">
          <nav className="flex items-center space-x-2">
            <Link to="/learning-room" className="hover:text-blue-600 transition-colors duration-200">
              Learning Room
            </Link>
            <span>/</span>
            <Link to="/learning-room" className="hover:text-blue-600 transition-colors duration-200">
              Web Development
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Installasi Tools</span>
          </nav>
          <button
            onClick={handleBack}
            className="text-sm text-blue-600 hover:underline font-semibold"
            aria-label="Back to Learning Room"
          >
            ← Back to Learning Room
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-x-8">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-2xl shadow-lg p-6 sticky top-20 h-fit">
          <nav className="space-y-8">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {section.title}
                  {section.complete !== undefined && (
                    <span className="ml-2 text-xs text-red-500 font-semibold">{section.complete}%</span>
                  )}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = item === activeItem;
                    return (
                      <li key={item}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveItem(item);
                          }}
                          className={`relative block rounded-lg px-3 py-2 text-sm font-medium transition
                            ${isActive
                              ? 'bg-red-600 text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                          `}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item}
                          {isActive && (
                            <span className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-red-700 rounded-r-full shadow-md" />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900 select-none">
            Installasi Tools
          </h1>

          {/* Video Thumbnail */}
          <div className="mb-10 relative cursor-pointer group rounded-xl overflow-hidden shadow-xl">
            <img
              src="/images/video-thumbnail.jpg"
              alt="Installation video"
              className="w-full h-auto object-cover brightness-90 transition-transform duration-300 group-hover:scale-105"
              onClick={() => setVideoOpen(true)}
            />
            <div
              onClick={() => setVideoOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              role="button"
              aria-label="Play video"
            >
              <div className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-10 border-t-transparent border-l-16 border-l-white border-b-10 border-b-transparent ml-1" />
              </div>
            </div>
          </div>

          {/* Video Modal */}
          {videoOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={() => setVideoOpen(false)}
              aria-modal="true"
              role="dialog"
            >
              <div className="relative w-[90vw] max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Installation Video Tutorial"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="w-full h-full"
                  frameBorder="0"
                />
                <button
                  onClick={() => setVideoOpen(false)}
                  className="absolute top-4 right-4 text-white text-3xl hover:text-red-400 transition"
                  aria-label="Close video"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* Course Content */}
          <article className="prose prose-yellow max-w-none text-gray-800 mb-12">
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
          </article>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-auto">
            <button
              className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition shadow-sm"
              aria-label="Previous lesson"
            >
              ← Previous
            </button>
            <button
              className="px-7 py-3 bg-red-600 rounded-xl text-white hover:bg-red-800 font-semibold shadow-lg transition transform hover:scale-105"
              aria-label="Continue and complete"
            >
              Continue & Complete →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearningSessionPage;
