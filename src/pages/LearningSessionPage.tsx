import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { courseService, lessonService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import type { Course, Lesson } from '../types/api';

const LearningSessionPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !user) return;
      
      try {
        setLoading(true);        const [courseData, lessonsData] = await Promise.all([
          courseService.getCourseById(courseId),
          lessonService.getLessonsByCourse(courseId)
        ]);
        
        setCourse(courseData);
        setLessons(lessonsData);
        
        // Set first lesson as current if available
        if (lessonsData.length > 0) {
          setCurrentLesson(lessonsData[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]);
  
  const handleBack = () => {
    navigate('/learning-room');
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Course not found'}</p>
            <button
              onClick={handleBack}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Back to Learning Room
            </button>
          </div>
        </div>
      </div>
    );
  }
  
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
              {course.title}
            </Link>
            {currentLesson && (
              <>
                <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-700 font-medium">{currentLesson.title}</span>
              </>
            )}
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
      <div className="flex flex-1">        {/* Left sidebar */}
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col">
          {/* Navigation sections */}
          <nav className="flex-1 overflow-y-auto">
            <div className="py-2">
              <div className="px-4 py-2 text-sm font-semibold text-gray-500">{course.title}</div>
              {lessons.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">No lessons available</div>
              ) : (
                <div className="mt-1 pl-4">
                  {lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id}
                      className={`flex items-center py-1 text-sm cursor-pointer hover:bg-gray-50 rounded ${
                        currentLesson?.id === lesson.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleLessonSelect(lesson)}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs mr-2 ${
                        currentLesson?.id === lesson.id 
                          ? 'bg-blue-200' 
                          : 'border border-gray-300'
                      }`}>
                        {currentLesson?.id === lesson.id ? (
                          <span className="text-blue-700">→</span>
                        ) : (
                          <span className="text-gray-500">{index + 1}</span>
                        )}
                      </div>
                      <span className={`${
                        currentLesson?.id === lesson.id 
                          ? 'text-blue-700 font-medium' 
                          : 'text-gray-700'
                      }`}>
                        {lesson.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-1 px-4 text-xs text-gray-500">
                {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} available
              </div>
            </div>
          </nav>
        </aside>
          {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {currentLesson ? (
              <>
                <div className="flex items-center mb-4">
                  <h1 className="text-xl font-bold text-gray-800">{currentLesson.title}</h1>
                </div>
                
                {/* Video section */}
                {currentLesson.videoUrl && (
                  <div className="mb-8">
                    <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                      <div className="relative w-full h-full bg-gray-900">
                        {/* Video embed or placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer">
                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-white border-b-8 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Content section */}
                <div className="prose max-w-none">
                  {currentLesson.content ? (
                    <div 
                      className="text-gray-700" 
                      dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                    />
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      <p>Lesson content is not available yet.</p>
                    </div>
                  )}
                </div>
                
                {/* Navigation buttons */}
                <div className="flex justify-between mt-12">
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors flex items-center"
                    onClick={() => {
                      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
                      if (currentIndex > 0) {
                        setCurrentLesson(lessons[currentIndex - 1]);
                      }
                    }}
                    disabled={lessons.findIndex(l => l.id === currentLesson.id) === 0}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </button>
                  <button 
                    className="px-5 py-2 bg-yellow-400 rounded-md text-gray-800 hover:bg-yellow-500 transition-colors font-medium"
                    onClick={() => {
                      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
                      if (currentIndex < lessons.length - 1) {
                        setCurrentLesson(lessons[currentIndex + 1]);
                      } else {
                        // Lesson completed, navigate back or to next course
                        navigate('/learning-room');
                      }
                    }}
                  >
                    {lessons.findIndex(l => l.id === currentLesson.id) === lessons.length - 1 
                      ? 'Complete Course' 
                      : 'Continue & Next'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Select a lesson to start learning
                </h2>
                <p className="text-gray-600">
                  Choose a lesson from the sidebar to view its content and begin your learning journey.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearningSessionPage;