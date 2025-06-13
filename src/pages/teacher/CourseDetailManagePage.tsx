import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  BookOpenIcon, 
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  PlayIcon,
  ChartBarIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { courseService, lessonService, quizService } from '../../services';
import type { Course, Lesson, Quiz, CreateLessonRequest, CreateQuizRequest } from '../../types/api';
import DashboardHeader from '../../components/DashboardHeader';
import QuizStatisticsDashboard from '../../components/quiz/QuizStatisticsDashboard';
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";

// Sortable Lesson Item Component
interface SortableLessonItemProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
}

const SortableLessonItem: React.FC<SortableLessonItemProps> = ({ lesson, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`border rounded-lg p-4 bg-white sortable-item ${isDragging ? 'dragging shadow-lg z-10' : 'hover:bg-gray-50'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="mt-1 p-1 text-gray-400 hover:text-gray-600 drag-handle"
            title="Drag to reorder"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                Bài {lesson.orderIndex || lesson.order}
              </span>
              <h3 className="font-semibold">{lesson.title}</h3>
            </div>
            <p className="text-gray-600 mb-2 line-clamp-2">{lesson.textContent || lesson.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {lesson.duration && <span>⏱️ {lesson.duration}</span>}
              {lesson.videoUrl && <span>🎥 Video có sẵn</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(lesson)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
            title="Chỉnh sửa"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(lesson.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded"
            title="Xóa"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Sortable Quiz Item Component
interface SortableQuizItemProps {
  quiz: Quiz;
  onViewStats: (quiz: Quiz) => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
}

const SortableQuizItem: React.FC<SortableQuizItemProps> = ({ quiz, onViewStats, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: quiz.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`border rounded-lg p-4 bg-white sortable-item ${isDragging ? 'dragging shadow-lg z-10' : 'hover:bg-gray-50'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="mt-1 p-1 text-gray-400 hover:text-gray-600 drag-handle"
            title="Drag to reorder"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">{quiz.title}</h3>
            <p className="text-gray-600 mb-2">{quiz.description}</p>
            <div className="text-sm text-gray-500">
              📝 {quiz.questions?.length || 0} câu hỏi
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onViewStats(quiz)}
            className="p-2 text-green-600 hover:bg-green-100 rounded"
            title="Xem thống kê"
          >
            <ChartBarIcon className="h-4 w-4" />
          </button>          <button
            onClick={() => onEdit(quiz)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
            title="Chỉnh sửa"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này?')) {
                onDelete(quiz.id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-100 rounded"
            title="Xóa"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showQuizStatistics, setShowQuizStatistics] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [selectedQuizForStats, setSelectedQuizForStats] = useState<Quiz | null>(null);
  // Form states
  const [lessonForm, setLessonForm] = useState<CreateLessonRequest>({
    title: '',
    textContent: '',
    orderIndex: 1,
    videoUrl: ''
  });  const [quizForm, setQuizForm] = useState<CreateQuizRequest>({
    title: '',
    description: '',
    courseId: courseId || '',
    questions: [
      {
        questionText: '',
        type: 'MCQ' as const,
        choices: ['', '', '', ''],
        correctAnswer: '',
        orderIndex: 1
      }
    ]
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        setCourse(courseData);      // Ensure lessonsData is an array before sorting
      const lessonsArray = Array.isArray(lessonsData) ? lessonsData : [];
      setLessons(lessonsArray.sort((a, b) => (a.orderIndex || a.order || 0) - (b.orderIndex || b.order || 0)));
      
      // Ensure quizzesData is an array before setting
      const quizzesArray = Array.isArray(quizzesData) ? quizzesData : [];
      setQuizzes(quizzesArray);
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
      // Debug course ownership
      // Parse and log user data for comparison
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
        } catch (e) {
        }
      }
      
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
    // --- Robust frontend validation ---
    const errors: string[] = [];
    if (!quizForm.title || quizForm.title.trim() === '') {
      errors.push('Tên bài kiểm tra không được để trống.');
    }
    // Accept empty string for description, but ensure it's defined
    if (typeof quizForm.description !== 'string') {
      quizForm.description = '';
    }
    if (!quizForm.courseId) {
      errors.push('Quiz form is missing courseId!');
    }
    if (!Array.isArray(quizForm.questions) || quizForm.questions.length === 0) {
      errors.push('Bài kiểm tra phải có ít nhất một câu hỏi.');
    } else {
      quizForm.questions.forEach((q, idx) => {
        if (!q.questionText || q.questionText.trim() === '') {
          errors.push(`Câu hỏi ${idx + 1} không được để trống.`);
        }
        if (!Array.isArray(q.choices) || q.choices.length < 2) {
          errors.push(`Câu hỏi ${idx + 1} phải có ít nhất 2 phương án.`);
        } else {
          q.choices.forEach((choice, cidx) => {
            if (!choice || choice.trim() === '') {
              errors.push(`Phương án ${cidx + 1} của câu hỏi ${idx + 1} không được để trống.`);
            }
          });
        }
        if (!q.correctAnswer || !q.choices.includes(q.correctAnswer)) {
          errors.push(`Câu hỏi ${idx + 1} phải chọn đáp án đúng.`);
        }
      });
    }
    if (errors.length > 0) {
      alert('Vui lòng sửa các lỗi sau:\n' + errors.join('\n'));
      return;
    }
    try {
      const result = await quizService.createQuiz(quizForm);
      setShowQuizForm(false);
      resetQuizForm();
      fetchCourseData();
    } catch (err: any) {
      // Show full error details
      let details = '';
      if (err.response) {
        details = JSON.stringify(err.response.data, null, 2);
      } else if (err.stack) {
        details = err.stack;
      }
      setError((err.message || 'Failed to create quiz') + (details ? ('\n' + details) : ''));
      alert('Quiz creation failed: ' + (err.message || 'Unknown error') + (details ? ('\n' + details) : ''));
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này không?')) return;
    
    try {
      await quizService.deleteQuiz(quizId);
      fetchCourseData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete quiz');
    }
  };
  const handleViewQuizStatistics = (quiz: Quiz) => {
    setSelectedQuizForStats(quiz);
    setShowQuizStatistics(true);
  };

  // Drag and drop handlers
  const handleLessonDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = lessons.findIndex(lesson => lesson.id === active.id);
      const newIndex = lessons.findIndex(lesson => lesson.id === over.id);

      const newLessons = arrayMove(lessons, oldIndex, newIndex);
      
      // Update local state immediately for better UX
      setLessons(newLessons);

      try {
        // Call API to update order on server
        const lessonIds = newLessons.map(lesson => lesson.id);
        await lessonService.reorderLessons(courseId!, lessonIds);
        
        // Refresh data to ensure consistency
        fetchCourseData();
      } catch (err: any) {
        setError(err.message || 'Failed to reorder lessons');
        // Revert local state on error
        fetchCourseData();
      }
    }
  };

  const handleQuizDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = quizzes.findIndex(quiz => quiz.id === active.id);
      const newIndex = quizzes.findIndex(quiz => quiz.id === over.id);

      const newQuizzes = arrayMove(quizzes, oldIndex, newIndex);
      
      // Update local state immediately for better UX
      setQuizzes(newQuizzes);

      try {
        // Call API to update order on server
        const quizIds = newQuizzes.map(quiz => quiz.id);
        await quizService.reorderQuizzes(courseId!, quizIds);
        
        // Refresh data to ensure consistency
        fetchCourseData();
      } catch (err: any) {
        setError(err.message || 'Failed to reorder quizzes');
        // Revert local state on error
        fetchCourseData();
      }
    }
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      textContent: '',
      orderIndex: lessons.length + 1,
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
          questionText: '',
          type: 'MCQ' as const,
          choices: ['', '', '', ''],
          correctAnswer: '',
          orderIndex: 1
        }
      ]
    });  };const openLessonEditForm = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      textContent: lesson.textContent || lesson.content || '',
      orderIndex: lesson.orderIndex || lesson.order || 1,
      videoUrl: lesson.videoUrl || ''
    });
    setShowLessonForm(true);
  };
  const openQuizEditForm = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    
    // Map quiz questions to the form format
    const formQuestions = quiz.questions?.map((q: any, index) => ({
      questionText: q.questionText || q.question || '',
      type: q.type || 'MCQ' as const,
      choices: q.choices || q.options || ['', '', '', ''],
      correctAnswer: typeof q.correctAnswer === 'number' 
        ? (q.choices || q.options || [])[q.correctAnswer] 
        : q.correctAnswer || '',
      orderIndex: q.orderIndex || index + 1
    })) || [
      {
        questionText: '',
        type: 'MCQ' as const,
        choices: ['', '', '', ''],
        correctAnswer: '',
        orderIndex: 1
      }
    ];

    setQuizForm({
      title: quiz.title,
      description: quiz.description || '',
      courseId: courseId || '',
      questions: formQuestions
    });
    setShowQuizForm(true);
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz) return;
    
    try {
      await quizService.updateQuiz(editingQuiz.id, quizForm);
      setEditingQuiz(null);
      setShowQuizForm(false);
      resetQuizForm();
      fetchCourseData();
    } catch (err: any) {
      setError(err.message || 'Failed to update quiz');
    }
  };

  const addQuizQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        {
          questionText: '',
          type: 'MCQ' as const,
          choices: ['', '', '', ''],
          correctAnswer: '',
          orderIndex: quizForm.questions.length + 1
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
    newQuestions[questionIndex].choices[optionIndex] = value;
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
                  {course.price && course.price > 0 ? `${course.price.toLocaleString()} VNĐ` : 'Miễn phí'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Mô tả</span>
              <p className="mt-1">{course.description}</p>
            </div>
          </div>          {/* Lessons Section */}
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
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleLessonDragEnd}
                >
                  <SortableContext
                    items={lessons.map(lesson => lesson.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {lessons.map((lesson) => (
                        <SortableLessonItem
                          key={lesson.id}
                          lesson={lesson}
                          onEdit={openLessonEditForm}
                          onDelete={handleDeleteLesson}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>          {/* Quizzes Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <QuestionMarkCircleIcon className="h-6 w-6" />
                Bài kiểm tra ({quizzes.length})
              </h2>              <button
                onClick={() => {
                  setShowQuizForm(true);
                  setEditingQuiz(null);
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
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleQuizDragEnd}
                >
                  <SortableContext
                    items={quizzes.map(quiz => quiz.id)}
                    strategy={verticalListSortingStrategy}
                  >                    <div className="space-y-4">
                      {quizzes.map((quiz) => (
                        <SortableQuizItem
                          key={quiz.id}
                          quiz={quiz}
                          onViewStats={handleViewQuizStatistics}
                          onEdit={openQuizEditForm}
                          onDelete={handleDeleteQuiz}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
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
                      </label>                      <input
                        type="number"
                        value={lessonForm.orderIndex}
                        onChange={(e) => setLessonForm({...lessonForm, orderIndex: Number(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nội dung bài học
                    </label>                    <textarea
                      value={lessonForm.textContent}
                      onChange={(e) => setLessonForm({...lessonForm, textContent: e.target.value})}
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập nội dung bài học"
                    />
                  </div>                  <div>
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
          )}          {/* Quiz Form Modal */}
          {showQuizForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editingQuiz ? 'Chỉnh sửa bài kiểm tra' : 'Thêm bài kiểm tra mới'}
                </h2>
                
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
                          
                          <div className="space-y-3">                            <input
                              type="text"
                              value={question.questionText}
                              onChange={(e) => updateQuizQuestion(qIndex, 'questionText', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                              placeholder="Nhập câu hỏi"
                            />
                            
                            <div className="grid grid-cols-2 gap-2">
                              {question.choices.map((option: string, oIndex: number) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    checked={question.correctAnswer === option}
                                    onChange={() => updateQuizQuestion(qIndex, 'correctAnswer', option)}
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
                </div>                <div className="flex justify-end gap-2 mt-6">                  <button
                    onClick={() => {
                      setShowQuizForm(false);
                      setEditingQuiz(null);
                      resetQuizForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {editingQuiz ? 'Cập nhật bài kiểm tra' : 'Tạo bài kiểm tra'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Statistics Modal */}
          {showQuizStatistics && selectedQuizForStats && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Thống kê bài kiểm tra: {selectedQuizForStats.title}</h2>
                
                <QuizStatisticsDashboard 
                  quiz={selectedQuizForStats} 
                  onClose={() => setShowQuizStatistics(false)}
                />
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowQuizStatistics(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Đóng
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