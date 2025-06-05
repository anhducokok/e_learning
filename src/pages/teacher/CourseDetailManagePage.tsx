import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  BookOpenIcon, 
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { courseService, lessonService, quizService } from '../../services';
import type { Course, Lesson, Quiz, CreateLessonRequest, CreateQuizRequest } from '../../types/api';
import DashboardHeader from '../../components/DashboardHeader';
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";

const CourseDetailManagePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // Modal states
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Form states
  const [lessonForm, setLessonForm] = useState<CreateLessonRequest>({
    title: '',
    content: '',
    order: 1,
    duration: '',
    videoUrl: ''
  });

  const [quizForm, setQuizForm] = useState<CreateQuizRequest>({
    title: '',
    description: '',
    courseId: courseId || '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const [courseData, lessonsData, quizzesData] = await Promise.all([
        courseService.getCourseById(courseId),
        lessonService.getLessonsByCourse(courseId),
        quizService.getQuizzesByCourse(courseId)
      ]);
      
      setCourse(courseData);
      setLessons(lessonsData.sort((a, b) => a.order - b.order));
      setQuizzes(quizzesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch course data');
    } finally {
      setLoading(false);
    }
  };

  // Lesson management
  const handleCreateLesson = async () => {
    if (!courseId) return;
    
    try {
      await lessonService.createLesson(courseId, lessonForm);
      setShowLessonForm(false);
      resetLessonForm();
      fetchCourseData();
    } catch (err: any) {
      setError(err.message || 'Failed to create lesson');
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    
    try {
      await lessonService.updateLesson(editingLesson.id, lessonForm);
      setEditingLesson(null);
      setShowLessonForm(false);
      resetLessonForm();
      fetchCourseData();
    } catch (err: any) {
      setError(err.message || 'Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      await lessonService.deleteLesson(lessonId);
      fetchCourseData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete lesson');
    }
  };

  // Quiz management
  const handleCreateQuiz = async () => {
    try {
      await quizService.createQuiz(quizForm);
      setShowQuizForm(false);
      resetQuizForm();
      fetchCourseData();
    } catch (err: any) {
      setError(err.message || 'Failed to create quiz');
    }
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      content: '',
      order: lessons.length + 1,
      duration: '',
      videoUrl: ''
    });
  };

  const resetQuizForm = () => {
    setQuizForm({
      title: '',
      description: '',
      courseId: courseId || '',
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    });
  };

  const openLessonEditForm = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      order: lesson.order,
      duration: lesson.duration || '',
      videoUrl: lesson.videoUrl || ''
    });
    setShowLessonForm(true);
  };

  const addQuizQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    });
  };

  const updateQuizQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const updateQuizOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const removeQuizQuestion = (index: number) => {
    if (quizForm.questions.length > 1) {
      const newQuestions = quizForm.questions.filter((_, i) => i !== index);
      setQuizForm({ ...quizForm, questions: newQuestions });
    }
  };

  // Teacher notifications
  const teacherNotifications = [
    {
      id: '1',
      title: 'Course Management',
      message: `Managing course: ${course?.title}`,
      time: 'Now',
      type: 'info' as const,
      read: false
    }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Không tìm thấy khóa học</h2>
          <button
            onClick={() => navigate('/teacher/courses')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <img src={logoImage} alt="Nihao" className="h-8" />
          <div>
            <span className="font-bold text-lg text-blue-600">NiHao</span>
            <span className="text-xs text-gray-500"> Teacher</span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <a href="/teacher/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/teacher/courses" className="block px-3 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium">
                Quản lý khóa học
              </a>
            </li>
            <li>
              <a href="/teacher/students" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                Học viên
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <DashboardHeader 
          title={`Quản lý: ${course.title}`} 
          notifications={teacherNotifications}
        />
        
        <div className="flex-1 p-8">
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/teacher/courses')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                Quay lại
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => window.open(`/learning-session/${course.id}`, '_blank')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <PlayIcon className="h-4 w-4" />
                Xem trước khóa học
              </button>
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Cấp độ</span>
                <p className="font-semibold capitalize">{course.level}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Thời lượng</span>
                <p className="font-semibold">{course.duration || 'Chưa thiết lập'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Giá</span>
                <p className="font-semibold">
                  {course.price ? `${course.price.toLocaleString()} VNĐ` : 'Miễn phí'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Mô tả</span>
              <p className="mt-1">{course.description}</p>
            </div>
          </div>

          {/* Lessons Section */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpenIcon className="h-6 w-6" />
                Bài học ({lessons.length})
              </h2>
              <button
                onClick={() => {
                  setShowLessonForm(true);
                  setEditingLesson(null);
                  resetLessonForm();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Thêm bài học
              </button>
            </div>
            
            <div className="p-6">
              {lessons.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có bài học nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                              Bài {lesson.order}
                            </span>
                            <h3 className="font-semibold">{lesson.title}</h3>
                          </div>
                          <p className="text-gray-600 mb-2 line-clamp-2">{lesson.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {lesson.duration && <span>⏱️ {lesson.duration}</span>}
                            {lesson.videoUrl && <span>🎥 Video có sẵn</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => openLessonEditForm(lesson)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                            title="Xóa"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quizzes Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <QuestionMarkCircleIcon className="h-6 w-6" />
                Bài kiểm tra ({quizzes.length})
              </h2>              <button
                onClick={() => {
                  setShowQuizForm(true);
                  resetQuizForm();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Thêm bài kiểm tra
              </button>
            </div>
            
            <div className="p-6">
              {quizzes.length === 0 ? (
                <div className="text-center py-8">
                  <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có bài kiểm tra nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{quiz.title}</h3>
                          <p className="text-gray-600 mb-2">{quiz.description}</p>
                          <div className="text-sm text-gray-500">
                            📝 {quiz.questions?.length || 0} câu hỏi
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                            title="Xóa"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Lesson Form Modal */}
          {showLessonForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editingLesson ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu đề bài học
                      </label>
                      <input
                        type="text"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tiêu đề bài học"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thứ tự
                      </label>
                      <input
                        type="number"
                        value={lessonForm.order}
                        onChange={(e) => setLessonForm({...lessonForm, order: Number(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nội dung bài học
                    </label>
                    <textarea
                      value={lessonForm.content}
                      onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập nội dung bài học"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời lượng
                      </label>
                      <input
                        type="text"
                        value={lessonForm.duration}
                        onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Ví dụ: 30 phút"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={lessonForm.videoUrl}
                        onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => {
                      setShowLessonForm(false);
                      setEditingLesson(null);
                      resetLessonForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={editingLesson ? handleUpdateLesson : handleCreateLesson}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingLesson ? 'Cập nhật' : 'Thêm bài học'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Form Modal */}
          {showQuizForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Thêm bài kiểm tra mới</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên bài kiểm tra
                      </label>
                      <input
                        type="text"
                        value={quizForm.title}
                        onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên bài kiểm tra"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        value={quizForm.description}
                        onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả bài kiểm tra"
                      />
                    </div>
                  </div>

                  {/* Questions */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Câu hỏi</h3>
                      <button
                        onClick={addQuizQuestion}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Thêm câu hỏi
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {quizForm.questions.map((question, qIndex) => (
                        <div key={qIndex} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium">Câu hỏi {qIndex + 1}</h4>
                            {quizForm.questions.length > 1 && (
                              <button
                                onClick={() => removeQuizQuestion(qIndex)}
                                className="text-red-600 hover:bg-red-100 p-1 rounded"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={question.question}
                              onChange={(e) => updateQuizQuestion(qIndex, 'question', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                              placeholder="Nhập câu hỏi"
                            />
                            
                            <div className="grid grid-cols-2 gap-2">
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    checked={question.correctAnswer === oIndex}
                                    onChange={() => updateQuizQuestion(qIndex, 'correctAnswer', oIndex)}
                                    className="text-blue-600"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateQuizOption(qIndex, oIndex, e.target.value)}
                                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder={`Phương án ${oIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">                  <button
                    onClick={() => {
                      setShowQuizForm(false);
                      resetQuizForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateQuiz}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Tạo bài kiểm tra
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetailManagePage;
