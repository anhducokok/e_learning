import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LearningSessionPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Day 1 Learning Chinese');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/learning-room');
  };
  // Sidebar data
  const sidebarSections = [
    { title: "Introduction", items: ["Getting Started", "Basic Pronunciation"], complete: 25 },
    { title: "Day 1", items: ["Day 1 Learning Chinese"], complete: 10 },
    {
      title: "Basic Chinese",
      items: ["Greetings", "Numbers", "Common Phrases"],
      complete: 50,
    },
    {
      title: "Grammar Basics",
      items: ["Sentence Structure", "Pronouns", "Basic Verbs", "Question Forms"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-white text-gray-900">
      {/* Breadcrumb & Back Button */}
      <div className="border-b bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-sm font-medium tracking-wide text-gray-600">          <nav className="flex items-center space-x-2">
            <Link to="/learning-room" className="hover:text-blue-600 transition-colors duration-200">
              Learning Room
            </Link>
            <span>/</span>
            <Link to="/learning-room" className="hover:text-blue-600 transition-colors duration-200">
              Chinese Language
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Day 1 Learning Chinese</span>
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
        <main className="flex-1 bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col">          <h1 className="text-3xl font-extrabold mb-6 text-gray-900 select-none">
            Day 1 Learning Chinese for Vietnamese
          </h1>

          {/* Video Player */}
          <div className="mb-10 relative rounded-xl overflow-hidden shadow-xl bg-black">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/gjy0bGkrYOY"
                title="Day 1 Learning Chinese for Vietnamese"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
                frameBorder="0"
              />
            </div>
          </div>          {/* Course Content */}
          <article className="prose prose-yellow max-w-none text-gray-800 mb-12">
            <p>
              Welcome to Day 1 of learning Chinese for Vietnamese speakers! In this lesson, you will learn 
              the fundamentals of Chinese pronunciation, basic greetings, and essential phrases that will 
              help you start your Chinese learning journey.
            </p>
            <p>Watch the video above carefully and practice along with the instructor.</p>

            <h2>What You'll Learn Today</h2>
            <ul>
              <li>Basic Chinese pronunciation and tones</li>
              <li>Common greetings and polite expressions</li>
              <li>Numbers 1-10 in Chinese</li>
              <li>Self-introduction phrases</li>
            </ul>

            <h2>Key Phrases Covered</h2>
            <ol>
              <li><strong>你好 (Nǐ hǎo)</strong> - Hello</li>
              <li><strong>我叫... (Wǒ jiào...)</strong> - My name is...</li>
              <li><strong>很高兴认识你 (Hěn gāoxìng rènshi nǐ)</strong> - Nice to meet you</li>
              <li><strong>谢谢 (Xiè xiè)</strong> - Thank you</li>
              <li><strong>再见 (Zàijiàn)</strong> - Goodbye</li>
            </ol>

            <h2>Practice Tips</h2>
            <p>
              Remember to practice the tones carefully as they are crucial in Chinese. 
              Repeat each phrase several times and try to mimic the instructor's pronunciation.
            </p>
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
