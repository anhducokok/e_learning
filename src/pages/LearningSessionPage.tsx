import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

const LearningSessionPage: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<string>('installasi');
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/learning-room');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Breadcrumb and back button */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
         
          <div className="flex items-center text-sm">
            <Link to="/learning-room" className="text-gray-500 hover:text-gray-700">
              Learning Room
            </Link>
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/learning-room" className="text-gray-500 hover:text-gray-700">
              Web Development
            </Link>
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-700 font-medium">Installasi Tools</span>
          </div>
          
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Learning Room
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* Left sidebar */}
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col">
          {/* <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="bg-blue-700 text-white px-2 py-0.5 text-xs font-semibold rounded mr-2">EDUFREE</span>
            </div>
          </div> */}
          
          {/* Navigation sections */}
          <nav className="flex-1 overflow-y-auto">
            <div className="py-2">
              <div className="px-4 py-2 text-sm font-semibold text-gray-500">Startups</div>
              <div className="mt-1 pl-4">
                <div className="flex items-center py-1 text-sm">
                  <div className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-2">
                    <span className="text-blue-700">✓</span>
                  </div>
                  <span className="text-gray-700">Introduction to Startups</span>
                </div>
                <div className="flex items-center py-1 text-sm">
                  <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                  <span className="text-gray-700">A bit of basic theory</span>
                </div>
              </div>
              <div className="mt-1 px-4 text-xs text-gray-500">
                25% complete
              </div>
            </div>
            
            <div className="py-2">
              <div className="px-4 py-2 text-sm font-semibold text-gray-500">HTML</div>
              <div className="mt-1 pl-4">
                <div className="flex items-center py-1 text-sm">
                  <div className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-2">
                    <span className="text-blue-700">✓</span>
                  </div>
                  <span className="text-gray-700">Introduction to HTML</span>
                </div>
              </div>
            </div>
            
            <div className="py-2 bg-gray-100">
              <div className="px-4 py-2 text-sm font-semibold text-gray-800">Installation</div>
              <div className="mt-1 pl-4">
                <div className="flex items-center py-1 text-sm">
                  <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                  <span className="text-gray-700">Download tools</span>
                </div>
                <div className="flex items-center py-1 text-sm text-blue-700 font-medium">
                  <div className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-2">
                    <span className="text-blue-700">→</span>
                  </div>
                  <span>Installasi Tools</span>
                </div>
                <div className="flex items-center py-1 text-sm">
                  <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                  <span className="text-gray-700">Basic Programming Tools</span>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <div className="px-4 py-2 text-sm font-semibold text-gray-500">Deeper HTML</div>
              <div className="mt-1 pl-4">
                <div className="flex items-center py-1 text-sm">
                  <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                  <span className="text-gray-700">Formatting HTML</span>
                </div>
                <div className="flex items-center py-1 text-sm">
                  <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                  <span className="text-gray-700">Links</span>
                </div>
                <div className="flex items-center py-1 text-sm">
                  <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                  <span className="text-gray-700">Tables</span>
                </div>
                <div className="flex items-center py-1 text-sm">
                  <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                  <span className="text-gray-700">Lists</span>
                </div>
              </div>
            </div>
          </nav>
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center mb-4">
              <h1 className="text-xl font-bold text-gray-800">Installasi Tools</h1>
            </div>
            
            {/* Video section */}
            <div className="mb-8">
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                <div className="relative w-full h-full bg-gray-900">
                  {/* Video thumbnail with play button overlay */}
                  <img
                    src="/images/video-thumbnail.jpg"
                    alt="Installation video"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content section */}
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                In this section, you will learn how to install all the necessary tools for web development.
                We'll cover installation of code editors, browsers, and other essential utilities.
              </p>
              <p className="text-gray-700 mb-4">
                Make sure to follow along with the video tutorial above for step-by-step guidance.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-3">Required Tools</h2>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-2">Visual Studio Code or another code editor</li>
                <li className="mb-2">Node.js and npm</li>
                <li className="mb-2">Git for version control</li>
                <li className="mb-2">Chrome or Firefox for testing</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-3">Installation Steps</h2>
              <ol className="list-decimal pl-5 mb-6">
                <li className="mb-2">Download Visual Studio Code from the official website</li>
                <li className="mb-2">Install Node.js LTS version</li>
                <li className="mb-2">Check your installation with the commands: <code>node -v</code> and <code>npm -v</code></li>
                <li className="mb-2">Download and install Git</li>
                <li className="mb-2">Configure Git with your credentials</li>
              </ol>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-12">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <button className="px-5 py-2 bg-yellow-400 rounded-md text-gray-800 hover:bg-yellow-500 transition-colors font-medium">
                Continue & Complete
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearningSessionPage;