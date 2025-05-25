import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CourseDetailPage: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  
  // Mock course data for testing
  const course = {
    id: 1,
    title: 'Build Text to Image SaaS App in React JS',
    description: 'Master AI-driven text-to-image SaaS from scratch! Build a Text to Image SaaS App using React JS, Node.js & Stripe Payment!',
    instructor: 'Nguyen Van A',
    rating: 4.7,
    reviewCount: 137,
    studentCount: 577,
    lastUpdated: 'April 2023',
    price: 109.99,
    salePrice: 19.99,
    hoursOfVideo: 26,
    articles: 12,
    resources: 5,
    sections: 8,
    lectures: 22,
    totalLength: '6h 30m',
    level: 'All Levels',
    languages: ['English', 'Vietnamese'],
    thumbnail: '/images/text-to-image.jpg',
    whatYouWillLearn: [
      'Complete course with step-by-step guidance',
      'Build a fully functional text-to-image app',
      'Integrate Stripe for payment processing',
      'Master React.js fundamentals',
      'Learn Node.js for backend development',
      'Understand modern UI/UX principles'
    ],
    curriculum: [
      {
        title: 'Project Introduction',
        lectures: [
          { title: 'App Overview - Build Text to Image SaaS', duration: '11 min' },
          { title: 'About This Course', duration: '9 min' },
          { title: 'Course Structure & Expectations', duration: '7 min' }
        ],
        totalTime: '27 min'
      },
      {
        title: 'Project Setup and Configuration',
        lectures: [
          { title: 'Environment Setup & Dependencies', duration: '15 min' },
          { title: 'Workspace setup & VS Code', duration: '8 min' },
          { title: 'React Project Initialization', duration: '12 min' }
        ],
        totalTime: '35 min'
      },
      {
        title: 'Frontend Development',
        lectures: [
          { title: 'Creating the User Interface', duration: '20 min' },
          { title: 'Image Generation Form Components', duration: '25 min' },
          { title: 'Responsive Design Implementation', duration: '15 min' }
        ],
        totalTime: '60 min'
      },
      {
        title: 'Payment Integration',
        lectures: [
          { title: 'Stripe API Integration', duration: '30 min' },
          { title: 'Payment Flow Implementation', duration: '25 min' },
          { title: 'Testing Payment Functionality', duration: '20 min' }
        ],
        totalTime: '75 min'
      }
    ],
    requirements: [
      'Basic knowledge of React.js is recommended',
      'Basic understanding of JavaScript and ES6 features',
      'No prior experience with Node.js or payment processing is required'
    ]
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Course header - dark section with title */}
      <div className="bg-[#1d3557] py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/3 pr-0 lg:pr-10">
              <nav className="flex mb-4 text-sm font-medium text-gray-300">
                <Link to="/" className="hover:text-white">Home</Link>
                <span className="mx-2">›</span>
                <Link to="/courses" className="hover:text-white">Courses</Link>
                <span className="mx-2">›</span>
                <span className="text-gray-400">React JS</span>
              </nav>
              
              <h1 className="text-2xl md:text-4xl font-bold mb-4">{course.title}</h1>
              
              <p className="text-lg mb-4">{course.description}</p>
              
              <div className="flex items-center mb-3">
                <span className="text-yellow-400 font-bold mr-2">{course.rating}</span>
                <div className="flex text-yellow-400 mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4" fill={star <= Math.floor(course.rating) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-300">({course.reviewCount} reviews)</span>
                <span className="mx-2">•</span>
                <span>{course.studentCount} students</span>
              </div>
              
              <p className="text-sm mb-4">
                Created by <a href="#" className="text-blue-300 hover:underline">{course.instructor}</a>
              </p>
              
              <div className="flex items-center text-sm mb-6">
                <span className="flex items-center mr-3">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Last updated {course.lastUpdated}
                </span>
                <span className="flex items-center mr-3">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  {course.languages.join(', ')}
                </span>
              </div>
            </div>
            
            {/* Course Card - Purchase Section */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src="/images/text-to-image.jpg"
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer">
                      <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl font-bold">${course.salePrice}</span>
                    <span className="text-lg text-gray-500 line-through ml-2">${course.price}</span>
                    <span className="text-sm bg-red-100 text-red-600 font-semibold px-2 py-1 rounded ml-2">82% off</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>5 days left at this price!</span>
                  </div>
                  
                  <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg mb-3 transition-colors">
                    Buy this course
                  </button>
                  
                  <button className="w-full py-3 border border-gray-300 hover:bg-gray-100 font-bold rounded-lg mb-3 transition-colors">
                    Try for free
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mb-6">
                    30-Day Money-Back Guarantee
                  </p>
                  
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <h4 className="font-semibold">This course includes:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{course.hoursOfVideo} hours on-demand video</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <span>{course.articles} articles</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>{course.resources} downloadable resources</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span>Full lifetime access</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>Access on mobile and TV</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 flex justify-center gap-2">
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Share
                    </button>
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Gift this course
                    </button>
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Apply Coupon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course content navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto whitespace-nowrap py-4 -mx-4 px-4">
            <button 
              onClick={() => setSelectedSection('overview')}
              className={`px-4 py-2 mr-2 font-medium ${selectedSection === 'overview' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setSelectedSection('curriculum')}
              className={`px-4 py-2 mr-2 font-medium ${selectedSection === 'curriculum' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
            >
              Curriculum
            </button>
            <button 
              onClick={() => setSelectedSection('instructor')}
              className={`px-4 py-2 mr-2 font-medium ${selectedSection === 'instructor' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
            >
              Instructor
            </button>
            <button 
              onClick={() => setSelectedSection('reviews')}
              className={`px-4 py-2 mr-2 font-medium ${selectedSection === 'reviews' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
            >
              Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 pr-0 lg:pr-10">
            {/* Overview section */}
            {selectedSection === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Course content</h2>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span>{course.sections} sections</span>
                      <span className="mx-1">•</span>
                      <span>{course.lectures} lectures</span>
                      <span className="mx-1">•</span>
                      <span>Total length: {course.totalLength}</span>
                    </div>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                      Expand all sections
                    </button>
                  </div>

                  {/* Course curriculum preview */}
                  <div className="border border-gray-200 rounded-lg mb-6">
                    {course.curriculum.slice(0, 2).map((section, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-b-0">
                        <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer">
                          <div className="font-semibold">
                            {section.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {section.lectures.length} lectures • {section.totalTime}
                          </div>
                        </div>
                        <div className="bg-white">
                          {section.lectures.map((lecture, lectureIndex) => (
                            <div key={lectureIndex} className="flex items-center justify-between p-4 border-t border-gray-200">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{lecture.title}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {lecture.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mb-10 w-full py-3 border border-gray-300 hover:bg-gray-100 font-bold rounded-lg transition-colors">
                    {course.curriculum.length - 2} more sections
                  </button>

                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Basic knowledge of React.js is recommended</li>
                      <li>Basic understanding of JavaScript and ES6 features</li>
                      <li>No prior experience with Node.js or payment processing is required</li>
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Description</h2>
                    <div className="prose max-w-none">
                      <p className="mb-4">
                        This has been the most comprehensive course on building specific image generation SaaS applications with React JS, Node.js, and Stripe Payment!
                      </p>
                      <p className="mb-4">
                        Whether you're a developer looking to expand your portfolio, an entrepreneur seeking to create the next big SaaS product, or simply curious about combining AI with web development, this course is designed with you in mind.
                      </p>
                      <p className="mb-4">
                        Throughout this course, we'll build a complete text-to-image SaaS application from scratch. You'll learn how to:
                      </p>
                      <ul className="list-disc pl-5 mb-4 space-y-2">
                        <li>Set up a React.js project with modern tooling</li>
                        <li>Create responsive and intuitive user interfaces</li>
                        <li>Implement a robust backend using Node.js</li>
                        <li>Integrate text-to-image AI models into your application</li>
                        <li>Set up Stripe payment processing for subscription and one-time purchases</li>
                        <li>Deploy your application to production</li>
                      </ul>
                      <p>
                        By the end of this course, you'll have a fully functional SaaS application that you can showcase in your portfolio or even launch as a real business!
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Who this course is for:</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>React developers looking to expand their skills</li>
                      <li>Web developers interested in SaaS application development</li>
                      <li>Entrepreneurs wanting to create text-to-image SaaS products</li>
                      <li>Anyone interested in AI integration with web applications</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum section */}
            {selectedSection === 'curriculum' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Course content</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm">
                    <span>{course.sections} sections</span>
                    <span className="mx-1">•</span>
                    <span>{course.lectures} lectures</span>
                    <span className="mx-1">•</span>
                    <span>Total length: {course.totalLength}</span>
                  </div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                    Expand all sections
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg">
                  {course.curriculum.map((section, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0">
                      <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer">
                        <div className="font-semibold">
                          {section.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {section.lectures.length} lectures • {section.totalTime}
                        </div>
                      </div>
                      <div className="bg-white">
                        {section.lectures.map((lecture, lectureIndex) => (
                          <div key={lectureIndex} className="flex items-center justify-between p-4 border-t border-gray-200">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{lecture.title}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {lecture.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor section */}
            {selectedSection === 'instructor' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Instructor</h2>
                <div className="flex items-start mb-6">
                  <img
                    src="/images/instructor-avatar.jpg"
                    alt={course.instructor}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      <a href="#" className="text-blue-600 hover:underline">{course.instructor}</a>
                    </h3>
                    <p className="text-gray-600 mb-2">React & Node.js Developer | SaaS Expert</p>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <div className="flex items-center mr-3">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        <span>4.6 Instructor Rating</span>
                      </div>
                      <div className="flex items-center mr-3">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>328 Reviews</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>2,453 Students</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p className="mb-4">
                    Hi, I'm {course.instructor}, a passionate full-stack developer with over 8 years of experience in web development. I specialize in React.js, Node.js, and building SaaS applications.
                  </p>
                  <p className="mb-4">
                    I've worked with numerous startups and enterprises, helping them build scalable web applications. My teaching approach focuses on practical, project-based learning that you can immediately apply to your own work.
                  </p>
                  <p>
                    I believe in teaching not just the "how" but also the "why" behind coding decisions. When you understand the reasoning, you become a better developer who can make smart architectural choices on your own.
                  </p>
                </div>
              </div>
            )}

            {/* Reviews section */}
            {selectedSection === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Student feedback</h2>
                
                <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                  <div className="md:w-1/3">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-yellow-500 mb-2">{course.rating}</div>
                      <div className="flex justify-center text-yellow-400 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-5 h-5" fill={star <= Math.floor(course.rating) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">Course Rating</div>
                      <div className="text-sm font-semibold">{course.reviewCount} Reviews</div>
                    </div>
                  </div>
                  <div className="md:w-2/3 w-full">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percent = rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 1 : 1;
                      return (
                        <div key={rating} className="flex items-center mb-2">
                          <div className="flex items-center text-sm w-12">
                            <span>{rating}</span>
                            <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                          <span className="text-sm ml-3 w-10">{percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">Reviews</h3>
                  
                  <div className="space-y-6">
                    {[
                      { name: "Trần Minh", rating: 5, date: "2 weeks ago", comment: "This course was exactly what I needed to start building my SaaS project! Well-structured and easy to follow.", avatar: "/images/avatar1.jpg" },
                      { name: "Nguyễn Hoàng", rating: 4, date: "1 month ago", comment: "Very comprehensive course on building a text-to-image app. I especially liked the payment integration section.", avatar: "/images/avatar2.jpg" },
                      { name: "Lê Thu", rating: 5, date: "3 weeks ago", comment: "The instructor explains complex concepts in a way that's easy to understand. Great course!", avatar: "/images/avatar3.jpg" }
                    ].map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start">
                          <img 
                            src={review.avatar} 
                            alt={review.name} 
                            className="w-10 h-10 rounded-full mr-4 object-cover"
                          />
                          <div>
                            <h4 className="font-semibold">{review.name}</h4>
                            <div className="flex items-center mt-1 mb-2">
                              <div className="flex text-yellow-400 mr-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg key={star} className="w-4 h-4" fill={star <= review.rating ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                            <div className="flex items-center mt-3 text-sm">
                              <button className="text-gray-500 hover:text-gray-700 mr-4">Helpful</button>
                              <button className="text-gray-500 hover:text-gray-700">Report</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-6 py-2 px-4 border border-gray-300 hover:bg-gray-100 rounded font-medium transition-colors">
                    Show all reviews
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar for desktop view (sticks while scrolling) */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-lg mb-3">Course includes:</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{course.hoursOfVideo} hours on-demand video</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span>{course.articles} articles</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{course.resources} downloadable resources</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>Full lifetime access</span>
                  </li>
                </ul>
                
                <div className="flex gap-2 mb-6">
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-medium hover:bg-gray-100 transition-colors">
                    Share
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-medium hover:bg-gray-100 transition-colors">
                    Gift
                  </button>
                </div>
                
                <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg mb-3 transition-colors">
                  Buy this course
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  30-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
