import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { lessonService } from '../../services/lessonService';
import { quizService } from '../../services/quizService';
import type { Course, Lesson, Quiz } from '../../types/api';
import { 
  PlayIcon, 
  BookOpenIcon, 
  QuestionMarkCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PauseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FireIcon,
  TrophyIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
}

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
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lesson' | 'quiz'>('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  
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

      // Fetch lessons
      const lessonsData = await lessonService.getLessonsByCourse(courseId!);
      const sortedLessons = Array.isArray(lessonsData) 
        ? lessonsData.sort((a, b) => (a.orderIndex || a.order || 0) - (b.orderIndex || b.order || 0))
        : [];
      setLessons(sortedLessons);

      // Fetch quizzes
      const quizzesData = await quizService.getQuizzesByCourse(courseId!);
      const quizzesArray = Array.isArray(quizzesData) ? quizzesData : [];
      setQuizzes(quizzesArray);

      // Initialize progress (mock data)
      setLessonProgress(sortedLessons.map(lesson => ({
        lessonId: lesson.id,
        completed: Math.random() > 0.7, // Random completion status for demo
        watchTime: Math.floor(Math.random() * 100)
      })));

      setQuizAttempts(quizzesArray.map(quiz => ({
        quizId: quiz.id,
        completed: Math.random() > 0.6,
        score: Math.random() > 0.6 ? Math.floor(Math.random() * 40) + 60 : undefined,
        attempts: Math.floor(Math.random() * 3) + 1
      })));

    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu khóa học');
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
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setSelectedLesson(null);
    setActiveTab('quiz');
    setIsQuizMode(false);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
  };

  const handleStartQuiz = () => {
    setIsQuizMode(true);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, selectedAnswer: answer };
        return updated;
      }
      return [...prev, { questionId, selectedAnswer: answer }];
    });
  };

  const handleNextQuestion = () => {
    if (selectedQuiz && selectedQuiz.questions && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;
    
    try {
      // Calculate score
      let correct = 0;
      if (selectedQuiz.questions) {
        selectedQuiz.questions.forEach(question => {
          const userAnswer = quizAnswers.find(a => a.questionId === question.id)?.selectedAnswer;
          if (
            userAnswer !== undefined &&
            parseInt(userAnswer) === question.correctAnswer
          ) {
            correct++;
          }
        });
      }
      
      const score = selectedQuiz.questions && selectedQuiz.questions.length > 0
        ? Math.round((correct / selectedQuiz.questions.length) * 100)
        : 0;
      
      // Submit to backend
      try {
        const submitData = {
          answers: quizAnswers.map(answer => ({
            questionId: answer.questionId,
            selectedAnswer: answer.selectedAnswer
          }))
        };
        
        await quizService.submitQuiz(selectedQuiz.id, submitData);
      } catch (submitError) {
        console.error('Failed to submit quiz to backend:', submitError);
        // Continue with local scoring even if backend submission fails
      }
      
      // Update quiz attempts
      setQuizAttempts(prev => {
        const existing = prev.findIndex(a => a.quizId === selectedQuiz.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { 
            ...updated[existing], 
            completed: true, 
            score,
            attempts: updated[existing].attempts + 1 
          };
          return updated;
        }
        return [...prev, { quizId: selectedQuiz.id, completed: true, score, attempts: 1 }];
      });
      
      setIsQuizMode(false);
      alert(`Bạn đã hoàn thành bài kiểm tra với điểm số: ${score}/100\nSố câu đúng: ${correct}/${selectedQuiz.questions?.length || 0}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    }
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

  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
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

  const getCurrentQuestion = () => {
    if (!selectedQuiz || !selectedQuiz.questions) return null;
    return selectedQuiz.questions[currentQuestionIndex];
  };

  const getAnswerForQuestion = (questionId: string) => {
    return quizAnswers.find(a => a.questionId === questionId)?.selectedAnswer || '';
  };

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
              </div>

              {/* Quizzes */}
              <div>
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
                        <video
                          controls
                          className="w-full h-auto"
                          poster="/images/video-poster.jpg"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                        >
                          <source src={selectedLesson.videoUrl} type="video/mp4" />
                          <source src={selectedLesson.videoUrl} type="video/webm" />
                          <source src={selectedLesson.videoUrl} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                        {!selectedLesson.videoUrl.includes('http') && (
                          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20"></div>
                            <div className="relative z-10">
                              <button
                                onClick={toggleVideo}
                                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto hover:bg-white/30 transition-all duration-300 hover:scale-110 transform"
                              >
                                {isPlaying ? (
                                  <PauseIcon className="h-8 w-8 text-white" />
                                ) : (
                                  <PlayIcon className="h-8 w-8 text-white ml-1" />
                                )}
                              </button>
                              <p className="text-white text-lg font-medium">
                                {isPlaying ? 'Video đang phát...' : 'Video demo - URL không hợp lệ'}
                              </p>
                              <p className="text-white/70 text-sm mt-2">
                                URL: {selectedLesson.videoUrl}
                              </p>
                            </div>
                          </div>
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
              )}

              {activeTab === 'quiz' && selectedQuiz && (
                <div className="p-8">                  {!isQuizMode ? (
                    <div className="text-center py-16">
                      <div className="relative mb-8">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                          <QuestionMarkCircleIcon className="h-16 w-16 text-white" />
                        </div>
                        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-20 animate-pulse"></div>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedQuiz.title}</h2>
                      <p className="text-gray-600 text-lg mb-8">{selectedQuiz.description}</p>
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
                      
                      {/* Check if quiz has questions */}
                      {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                        <button
                          onClick={handleStartQuiz}
                          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
                        >
                          <FireIcon className="h-5 w-5 inline mr-2" />
                          Bắt đầu bài kiểm tra
                        </button>
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
                  ) : (
                    <div>
                      {/* Quiz Progress */}
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl font-bold text-gray-900">{selectedQuiz.title}</h2>
                          <span className="text-gray-600 font-medium">
                            Câu {currentQuestionIndex + 1} / {selectedQuiz.questions?.length || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / (selectedQuiz.questions?.length || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>                      {/* Current Question */}
                      {getCurrentQuestion() ? (
                        <div className="mb-8">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                              {getCurrentQuestion()?.question}
                            </h3>
                            <div className="space-y-3">
                              {getCurrentQuestion()?.options?.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleQuizAnswer(getCurrentQuestion()!.id, String(index))}
                                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                                    getAnswerForQuestion(getCurrentQuestion()!.id) === String(index)
                                      ? 'bg-blue-500 text-white shadow-lg'
                                      : 'bg-white hover:bg-blue-50 text-gray-800'
                                  }`}
                                >
                                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                                </button>
                              )) || []}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-8">
                          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải câu hỏi</h3>
                            <p className="text-red-700 mb-4">
                              Không thể tải câu hỏi số {currentQuestionIndex + 1}. 
                            </p>
                            <div className="text-sm text-red-600 bg-red-100 rounded-lg p-3">
                              <p><strong>Debug Info:</strong></p>
                              <p>Current Question Index: {currentQuestionIndex}</p>
                              <p>Total Questions: {selectedQuiz.questions?.length || 0}</p>
                              <p>Questions Array: {selectedQuiz.questions ? 'Present' : 'Missing'}</p>
                              {selectedQuiz.questions && (
                                <p>First Question: {JSON.stringify(selectedQuiz.questions[0], null, 2)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between items-center">
                        <button
                          onClick={handlePreviousQuestion}
                          disabled={currentQuestionIndex === 0}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          <ArrowLeftIcon className="h-5 w-5 inline mr-2" />
                          Câu trước
                        </button>
                        
                        {currentQuestionIndex === (selectedQuiz.questions?.length || 1) - 1 ? (
                          <button
                            onClick={handleSubmitQuiz}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl"
                          >
                            <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                            Nộp bài
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
                          >
                            Câu tiếp theo
                            <ArrowRightIcon className="h-5 w-5 inline ml-2" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningSessionPage;