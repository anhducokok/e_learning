import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { lessonService } from '../../services/lessonService';
import { quizService } from '../../services/quizService';
import type { Course, Lesson, Quiz, QuizSubmission } from '../../types/api';
import { 
  BookOpenIcon, 
  QuestionMarkCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  FireIcon,
  TrophyIcon,
  AcademicCapIcon,
  ClockIcon as HistoryIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import { processLessons, processQuizzes, checkLessonVideos } from '../../utils/apiHelpers';
import EnhancedQuizInterface from '../../components/quiz/EnhancedQuizInterface';
import QuizSubmissionHistory from '../../components/quiz/QuizSubmissionHistory';

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  watchTime?: number;
}

interface QuizAttempt {
  quizId: string;
  score?: number;
  completed: boolean;
  attempts: number;
}

const LearningSessionPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lesson' | 'quiz' | 'quiz-history'>('overview');  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isQuizRetake, setIsQuizRetake] = useState(false);
  
  // Mock progress data - in real app, this would come from API
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course details
      const courseData = await courseService.getCourseById(courseId!);
      setCourse(courseData);
      let processedLessons: Lesson[] = [];
      let processedQuizzes: Quiz[] = [];

      // Fetch lessons
      try {
        const lessonsData = await lessonService.getLessonsByCourse(courseId!);
        processedLessons = processLessons(lessonsData);
        checkLessonVideos(processedLessons);
        setLessons(processedLessons);
      } catch (lessonError: any) {
        if (lessonError.message?.includes('Unauthorized')) {
          setError('Vui lòng đăng nhập để xem bài học trong khóa học này.');
        } else {
          setError(`Không thể tải bài học: ${lessonError.message}`);
        }
        setLessons([]);
      }

      // Fetch quizzes
      try {
        const quizzesData = await quizService.getQuizzesByCourse(courseId!);
        processedQuizzes = processQuizzes(quizzesData);
        setQuizzes(processedQuizzes);
      } catch (quizError: any) {
        if (quizError.message?.includes('Unauthorized')) {
          if (!error) {
            setError('Vui lòng đăng nhập để xem bài kiểm tra trong khóa học này.');
          }
        } else {
          setError(`Không thể tải bài kiểm tra: ${quizError.message}`);
        }
        setQuizzes([]);
      }

      // Initialize progress
      if (processedLessons.length > 0) {
        setLessonProgress(processedLessons.map(lesson => ({
          lessonId: lesson.id,
          completed: Math.random() > 0.7,
          watchTime: Math.floor(Math.random() * 100)
        })));
      }      // Load actual quiz submission data
      if (processedQuizzes.length > 0) {
        try {
          const userSubmissions = await quizService.getUserSubmissions();
          const quizAttemptsData = processedQuizzes.map(quiz => {
            const submission = userSubmissions.find((sub: any) => sub.quizId === quiz.id);
            return {
              quizId: quiz.id,
              completed: submission ? !!submission.submittedAt : false,
              score: submission?.score || undefined,
              attempts: submission ? 1 : 0 // Backend doesn't track multiple attempts yet
            };
          });
          setQuizAttempts(quizAttemptsData);
        } catch (submissionError) {
          console.log('Could not load quiz submissions, using default values');
          // Fallback to default values if submissions can't be loaded
          setQuizAttempts(processedQuizzes.map(quiz => ({
            quizId: quiz.id,
            completed: false,
            score: undefined,
            attempts: 0
          })));
        }
      }

    } catch (err: any) {
      if (err.message?.includes('Unauthorized')) {
        setError('Bạn cần đăng nhập để truy cập khóa học này. Vui lòng đăng nhập và thử lại.');
      } else {
        setError(err.message || 'Không thể tải dữ liệu khóa học');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/learning-room');
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedQuiz(null);
    setActiveTab('lesson');
    setIsQuizMode(false);
  };  const handleQuizSelect = async (quiz: Quiz) => {
    const quizAttempt = getQuizAttempt(quiz.id);
    
    // If quiz is already completed, try to load the previous submission
    if (quizAttempt?.completed) {
      try {
        const submission = await quizService.getQuizSubmission(quiz.id);
        if (submission && submission.submittedAt) {
          // Show the completed quiz results
          setSelectedQuiz(quiz);
          setSelectedLesson(null);
          setActiveTab('quiz');
          setIsQuizMode(false); // This will show the quiz details with completion status
          return;
        }
      } catch (error) {
        console.log('Could not load previous submission, allowing new attempt');
      }
    }
    
    // Normal quiz selection flow
    setSelectedQuiz(quiz);
    setSelectedLesson(null);
    setActiveTab('quiz');
    setIsQuizMode(false);
  };
  const handleStartQuiz = () => {
    setIsQuizMode(true);
    setIsQuizRetake(false);
  };

  const handleRetakeQuiz = () => {
    setIsQuizMode(true);
    setIsQuizRetake(true);
  };

  const handleQuizSubmitted = (submission: QuizSubmission) => {
    // Update quiz attempts with the submission data
    setQuizAttempts(prev => {
      const existing = prev.findIndex(a => a.quizId === selectedQuiz?.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { 
          ...updated[existing], 
          completed: true, 
          score: Math.round(submission.score || 0),
          attempts: updated[existing].attempts + 1 
        };
        return updated;
      }
      return [...prev, { 
        quizId: selectedQuiz?.id || '', 
        completed: true, 
        score: Math.round(submission.score || 0), 
        attempts: 1 
      }];
    });
    
    setIsQuizMode(false);
  };
  const handleShowQuizHistory = () => {
    setActiveTab('quiz-history');
    setSelectedLesson(null);
    setSelectedQuiz(null);
  };

  const handleCompleteLesson = () => {
    if (!selectedLesson) return;
    
    setLessonProgress(prev => {
      const existing = prev.findIndex(p => p.lessonId === selectedLesson.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], completed: true };
        return updated;
      }
      return [...prev, { lessonId: selectedLesson.id, completed: true }];
    });
    
    alert('Bạn đã hoàn thành bài học này!');
  };

  const getLessonProgress = (lessonId: string) => {
    return lessonProgress.find(p => p.lessonId === lessonId);
  };

  const getQuizAttempt = (quizId: string) => {
    return quizAttempts.find(a => a.quizId === quizId);
  };
  const calculateCourseProgress = () => {
    const totalItems = lessons.length + quizzes.length;
    if (totalItems === 0) return 0;
    
    const completedLessons = lessonProgress.filter(p => p.completed).length;
    const completedQuizzes = quizAttempts.filter(a => a.completed).length;
    
    return Math.round(((completedLessons + completedQuizzes) / totalItems) * 100);
  };

  // Helper function to convert YouTube URL to embed URL
  function convertYoutubeUrlToEmbed(url: string): string {
    // Chuyển https://www.youtube.com/watch?v=xxxx hoặc https://youtu.be/xxxx thành https://www.youtube.com/embed/xxxx
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"></div>
              </div>
              <div className="ml-6">
                <div className="text-xl font-semibold text-gray-800 mb-2">Đang tải khóa học...</div>
                <div className="text-gray-600">Vui lòng chờ trong giây lát</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
            <div className="text-center py-12">
              <div className="relative mb-6">
                <ExclamationTriangleIcon className="h-20 w-20 text-red-500 mx-auto" />
                <div className="absolute inset-0 animate-pulse bg-red-200 rounded-full opacity-20"></div>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Có lỗi xảy ra</h2>
              <p className="text-gray-600 mb-8 text-lg">{error}</p>
              <button
                onClick={handleBack}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform font-semibold"
              >
                <ArrowLeftIcon className="h-5 w-5 inline mr-2" />
                Quay lại Learning Room
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-white to-slate-50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                  </div>
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                  >
                    <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Quay lại Learning Room</span>
                  </button>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {course?.title || 'Đang tải...'}
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  {course?.description || 'Mô tả khóa học'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    <ClockIcon className="h-4 w-4" />
                    {lessons.length} bài học
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <QuestionMarkCircleIcon className="h-4 w-4" />
                    {quizzes.length} bài kiểm tra
                  </div>
                  <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    <TrophyIcon className="h-4 w-4" />
                    {calculateCourseProgress()}% hoàn thành
                  </div>
                </div>
              </div>
              
              {/* Progress Circle */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <div className="text-white font-bold text-lg">{calculateCourseProgress()}%</div>
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Nội dung khóa học</h3>
              
              {/* Lessons */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5" />
                  Bài học ({lessons.length})
                </h4>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => {
                    const progress = getLessonProgress(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                          selectedLesson?.id === lesson.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                            : 'bg-white hover:bg-blue-50 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Bài {index + 1}</span>
                          {progress?.completed && (
                            <CheckCircleIconSolid className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <h5 className="font-semibold mb-1">{lesson.title}</h5>
                        <p className={`text-sm ${
                          selectedLesson?.id === lesson.id ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {lesson.duration || '15 phút'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>              {/* Quizzes */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                  Bài kiểm tra ({quizzes.length})
                </h4>
                <div className="space-y-3">
                  {quizzes.map((quiz) => {
                    const attempt = getQuizAttempt(quiz.id);
                    return (
                      <button
                        key={quiz.id}
                        onClick={() => handleQuizSelect(quiz)}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                          selectedQuiz?.id === quiz.id
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                            : 'bg-white hover:bg-green-50 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Quiz</span>
                          {attempt?.completed && (
                            <div className="flex items-center gap-1">
                              <StarIconSolid className="h-4 w-4 text-yellow-400" />
                              <span className="text-xs font-bold">{attempt.score}</span>
                            </div>
                          )}
                        </div>
                        <h5 className="font-semibold mb-1">{quiz.title}</h5>
                        <p className={`text-sm ${
                          selectedQuiz?.id === quiz.id ? 'text-green-100' : 'text-gray-600'
                        }`}>
                          {quiz.questions?.length || 0} câu hỏi
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quiz History Button */}
              <div>
                <button
                  onClick={handleShowQuizHistory}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                    activeTab === 'quiz-history'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                      : 'bg-white hover:bg-purple-50 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HistoryIcon className="h-5 w-5" />
                    <div>
                      <h5 className="font-semibold">Lịch sử bài kiểm tra</h5>
                      <p className={`text-sm ${
                        activeTab === 'quiz-history' ? 'text-purple-100' : 'text-gray-600'
                      }`}>
                        Xem kết quả và thống kê
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              {activeTab === 'overview' && (
                <div className="p-8">
                  <div className="text-center py-16">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                        <AcademicCapIcon className="h-16 w-16 text-white" />
                      </div>
                      <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 animate-pulse"></div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Chào mừng đến với khóa học!
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                      Chọn một bài học hoặc bài kiểm tra từ menu bên trái để bắt đầu hành trình học tập của bạn.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl">
                        <BookOpenIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Bài học</h3>
                        <p className="text-gray-600">Học từ video, văn bản và tài liệu tương tác</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl">
                        <QuestionMarkCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Bài kiểm tra</h3>
                        <p className="text-gray-600">Kiểm tra kiến thức và theo dõi tiến độ</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lesson' && selectedLesson && (
                <div className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h2>
                    <p className="text-gray-600">{selectedLesson.textContent || selectedLesson.content}</p>
                  </div>                  {/* Video Player */}
                  {selectedLesson.videoUrl && (
                    <div className="mb-8">
                      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                        {(selectedLesson.videoUrl.includes('youtube.com') || selectedLesson.videoUrl.includes('youtu.be')) ? (
                          <iframe
                            key={selectedLesson.id}
                            className="w-full h-[360px] min-h-[300px]"
                            src={convertYoutubeUrlToEmbed(selectedLesson.videoUrl)}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            controls
                            key={selectedLesson.id}
                            className="w-full h-auto min-h-[300px]"
                            poster="/images/video-poster.jpg"
                            src={selectedLesson.videoUrl}
                          >
                            Your browser does not support HTML5 video.
                          </video>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Lesson Content */}
                  <div className="prose max-w-none mb-8">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nội dung bài học</h3>
                      <div className="text-gray-700 leading-relaxed">
                        {selectedLesson.textContent || selectedLesson.content || 'Nội dung bài học sẽ được hiển thị ở đây...'}
                      </div>
                    </div>
                  </div>

                  {/* Complete Lesson Button */}
                  <div className="text-center">
                    <button
                      onClick={handleCompleteLesson}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
                    >
                      <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                      Hoàn thành bài học
                    </button>
                  </div>
                </div>
              )}              {activeTab === 'quiz' && selectedQuiz && (
                <div>
                  {!isQuizMode ? (                    <div className="p-8">
                      <div className="text-center py-16">
                        <div className="relative mb-8">
                          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl ${
                            getQuizAttempt(selectedQuiz.id)?.completed 
                              ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          }`}>
                            {getQuizAttempt(selectedQuiz.id)?.completed ? (
                              <CheckCircleIconSolid className="h-16 w-16 text-white" />
                            ) : (
                              <QuestionMarkCircleIcon className="h-16 w-16 text-white" />
                            )}
                          </div>
                          <div className={`absolute -inset-4 rounded-full opacity-20 animate-pulse ${
                            getQuizAttempt(selectedQuiz.id)?.completed 
                              ? 'bg-gradient-to-br from-emerald-400 to-green-500' 
                              : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                          }`}></div>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedQuiz.title}</h2>
                        <p className="text-gray-600 text-lg mb-8">{selectedQuiz.description}</p>
                        
                        {getQuizAttempt(selectedQuiz.id)?.completed && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
                            <CheckCircleIconSolid className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-emerald-800 mb-2">Bạn đã hoàn thành bài kiểm tra này!</h3>
                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                              {getQuizAttempt(selectedQuiz.id)?.score || 0}/100 điểm
                            </div>
                            <p className="text-emerald-700">
                              Kết quả đã được lưu lại. Bạn có thể xem chi tiết trong phần lịch sử bài kiểm tra.
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                          <div className="bg-blue-50 p-4 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600">{selectedQuiz.questions?.length || 0}</div>
                            <div className="text-blue-800 font-medium">Câu hỏi</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-xl">
                            <div className="text-2xl font-bold text-green-600">20</div>
                            <div className="text-green-800 font-medium">Phút</div>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-xl">
                            <div className="text-2xl font-bold text-purple-600">60%</div>
                            <div className="text-purple-800 font-medium">Điểm tối thiểu</div>
                          </div>
                        </div>
                        
                        {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {getQuizAttempt(selectedQuiz.id)?.completed ? (
                              <>
                                <button
                                  onClick={handleShowQuizHistory}
                                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
                                >
                                  <HistoryIcon className="h-5 w-5 inline mr-2" />
                                  Xem lịch sử chi tiết
                                </button>                                <button
                                  onClick={handleRetakeQuiz}
                                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
                                >
                                  <FireIcon className="h-5 w-5 inline mr-2" />
                                  Làm lại bài kiểm tra
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={handleStartQuiz}
                                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
                              >
                                <FireIcon className="h-5 w-5 inline mr-2" />
                                Bắt đầu bài kiểm tra
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-2xl mx-auto">
                            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Bài kiểm tra chưa sẵn sàng</h3>
                            <p className="text-yellow-700">
                              Bài kiểm tra này chưa có câu hỏi nào. Vui lòng liên hệ giảng viên để được hỗ trợ.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (                    <EnhancedQuizInterface
                      quiz={selectedQuiz}
                      onComplete={handleQuizSubmitted}
                      onExit={() => setIsQuizMode(false)}
                      isRetake={isQuizRetake}
                    />
                  )}
                </div>
              )}              {activeTab === 'quiz-history' && (
                <QuizSubmissionHistory
                  onClose={() => {
                    setActiveTab('overview');
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningSessionPage;