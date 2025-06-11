import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  BookOpenIcon,
  ClockIcon,
  AcademicCapIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { practiceService } from '../../services/practiceService';
import type { Practice, CreatePracticeRequest, PracticeSkill, PracticeLevel, QuestionType } from '../../types/api';
import DashboardHeader from '../../components/DashboardHeader';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";

interface PracticeFormQuestion {
  question: string;
  questionType: QuestionType;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  points: number;
  orderIndex: number;
}

interface PracticeForm {
  title: string;
  description: string;
  skill: PracticeSkill;
  level: PracticeLevel;
  timeLimit: number;
  questions: PracticeFormQuestion[];
}

const PracticeManagementPage: React.FC = () => {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null);
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<PracticeSkill | ''>('');
  const [levelFilter, setLevelFilter] = useState<PracticeLevel | ''>('');
  
  // Form state
  const [practiceForm, setPracticeForm] = useState<PracticeForm>({
    title: '',
    description: '',
    skill: 'READING',
    level: 'BASIC',
    timeLimit: 30,
    questions: [{
      question: '',
      questionType: 'MULTIPLE_CHOICE',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 1,
      orderIndex: 1
    }]
  });

  const skillColors = {
    READING: 'bg-blue-100 text-blue-800',
    LISTENING: 'bg-green-100 text-green-800',
    GRAMMAR: 'bg-purple-100 text-purple-800'
  };

  const levelColors = {
    BASIC: 'bg-gray-100 text-gray-800',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
    ADVANCED: 'bg-red-100 text-red-800'
  };

  const fetchPractices = async () => {
    try {
      setLoading(true);
      const result = await practiceService.getAllPractices({
        skill: skillFilter || undefined,
        level: levelFilter || undefined,
        search: searchQuery || undefined,
        page: 1,
        limit: 50
      });
      setPractices(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch practices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPractices();
  }, [skillFilter, levelFilter, searchQuery]);
  const resetForm = () => {
    setPracticeForm({
      title: '',
      description: '',
      skill: 'READING',
      level: 'BASIC',
      timeLimit: 30,
      questions: [{
        question: '',
        questionType: 'MULTIPLE_CHOICE',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        points: 1,
        orderIndex: 1
      }]
    });
  };

  const handleCreatePractice = async () => {
    try {
      const createRequest: CreatePracticeRequest = {
        title: practiceForm.title,
        description: practiceForm.description,
        skill: practiceForm.skill,
        level: practiceForm.level,
        questionCount: practiceForm.questions.length,
        timeLimit: practiceForm.timeLimit,
        questions: practiceForm.questions.map(q => ({
          question: q.question,
          questionType: q.questionType,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          audioUrl: q.audioUrl,
          imageUrl: q.imageUrl,
          points: q.points,
          orderIndex: q.orderIndex
        }))
      };

      await practiceService.createPractice(createRequest);
      setShowCreateForm(false);
      resetForm();
      fetchPractices();
    } catch (err: any) {
      setError(err.message || 'Failed to create practice');
    }
  };

  const handleUpdatePractice = async () => {
    if (!editingPractice) return;
    
    try {
      const updateRequest = {
        title: practiceForm.title,
        description: practiceForm.description,
        skill: practiceForm.skill,
        level: practiceForm.level,
        timeLimit: practiceForm.timeLimit
      };

      await practiceService.updatePractice(editingPractice.id, updateRequest);
      setShowCreateForm(false);
      setEditingPractice(null);
      resetForm();
      fetchPractices();
    } catch (err: any) {
      setError(err.message || 'Failed to update practice');
    }
  };

  const handleDeletePractice = async (practiceId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài luyện tập này?')) return;
    
    try {
      await practiceService.deletePractice(practiceId);
      fetchPractices();
    } catch (err: any) {
      setError(err.message || 'Failed to delete practice');
    }
  };

  const openEditForm = (practice: Practice) => {
    setEditingPractice(practice);
    setPracticeForm({
      title: practice.title,
      description: practice.description,
      skill: practice.skill,
      level: practice.level,
      timeLimit: practice.timeLimit,
      questions: practice.questions?.map(q => ({
        question: q.question,
        questionType: q.questionType, // already correct
        options: q.options,
        correctAnswer: q.correctAnswer || '',
        explanation: q.explanation,
        audioUrl: q.audioUrl,
        imageUrl: q.imageUrl,
        points: q.points,        orderIndex: q.orderIndex
      })) || [{
        question: '',
        questionType: 'MULTIPLE_CHOICE',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        points: 1,
        orderIndex: 1
      }]
    });
    setShowCreateForm(true);
  };
  const addQuestion = () => {
    const newQuestion: PracticeFormQuestion = {
      question: '',
      questionType: 'MULTIPLE_CHOICE',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 1,
      orderIndex: practiceForm.questions.length + 1
    };
    setPracticeForm({
      ...practiceForm,
      questions: [...practiceForm.questions, newQuestion]
    });
  };

  const updateQuestion = (index: number, updatedQuestion: Partial<PracticeFormQuestion>) => {
    const newQuestions = [...practiceForm.questions];
    newQuestions[index] = { ...newQuestions[index], ...updatedQuestion };
    setPracticeForm({ ...practiceForm, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    if (practiceForm.questions.length > 1) {
      const newQuestions = practiceForm.questions.filter((_, i) => i !== index);
      setPracticeForm({ ...practiceForm, questions: newQuestions });
    }
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...practiceForm.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setPracticeForm({ ...practiceForm, questions: newQuestions });
  };

  const teacherNotifications = [
    {
      id: '1',
      title: 'Practice Management',
      message: 'Quản lý bài luyện tập tiếng Trung',
      time: 'Now',
      type: 'info' as const,
      read: false
    }
  ];

  if (loading && practices.length === 0) {
    return (
      <TeacherLayout logoImage={logoImage}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout logoImage={logoImage}>
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 flex flex-col">
          <DashboardHeader
            title="Quản lý bài luyện tập"
            notifications={teacherNotifications}
          />

          <div className="flex-1 p-8">
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Header and Search */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Bài luyện tập của tôi
              </h1>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingPractice(null);
                  resetForm();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Tạo bài luyện tập mới
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tìm kiếm
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm bài luyện tập..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kỹ năng
                  </label>
                  <select
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value as PracticeSkill | '')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tất cả kỹ năng</option>
                    <option value="READING">Đọc hiểu</option>
                    <option value="LISTENING">Nghe hiểu</option>
                    <option value="GRAMMAR">Ngữ pháp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp độ
                  </label>
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value as PracticeLevel | '')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tất cả cấp độ</option>
                    <option value="BASIC">Cơ bản</option>
                    <option value="INTERMEDIATE">Trung cấp</option>
                    <option value="ADVANCED">Nâng cao</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSkillFilter('');
                      setLevelFilter('');
                    }}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>

            {/* Practice List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practices.map((practice) => (
                <div key={practice.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${skillColors[practice.skill]}`}>
                          {practice.skill === 'READING' ? 'Đọc hiểu' : 
                           practice.skill === 'LISTENING' ? 'Nghe hiểu' : 'Ngữ pháp'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[practice.level]}`}>
                          {practice.level === 'BASIC' ? 'Cơ bản' : 
                           practice.level === 'INTERMEDIATE' ? 'Trung cấp' : 'Nâng cao'}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {practice.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {practice.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpenIcon className="h-4 w-4" />
                        {practice.questionCount} câu hỏi
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {practice.timeLimit} phút
                      </div>
                      <div className="flex items-center gap-1">
                        <AcademicCapIcon className="h-4 w-4" />
                        {practice._count?.attempts || 0} lượt thử
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`/practice/${practice.id}`, '_blank')}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-1 text-sm"
                      >
                        <EyeIcon className="h-4 w-4" />
                        Xem trước
                      </button>
                      <button
                        onClick={() => openEditForm(practice)}
                        className="px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePractice(practice.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg"
                        title="Xóa"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {practices.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có bài luyện tập nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Tạo bài luyện tập đầu tiên cho học sinh của bạn
                </p>
                <button
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingPractice(null);
                    resetForm();
                  }}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center gap-2 mx-auto"
                >
                  <PlusIcon className="h-5 w-5" />
                  Tạo bài luyện tập mới
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Practice Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingPractice ? 'Chỉnh sửa bài luyện tập' : 'Tạo bài luyện tập mới'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề bài luyện tập
                  </label>
                  <input
                    type="text"
                    value={practiceForm.title}
                    onChange={(e) => setPracticeForm({...practiceForm, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                    placeholder="Nhập tiêu đề bài luyện tập"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian (phút)
                  </label>
                  <input
                    type="number"
                    value={practiceForm.timeLimit}
                    onChange={(e) => setPracticeForm({...practiceForm, timeLimit: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                    min="1"
                    max="180"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={practiceForm.description}
                  onChange={(e) => setPracticeForm({...practiceForm, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập mô tả bài luyện tập"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kỹ năng
                  </label>
                  <select
                    value={practiceForm.skill}
                    onChange={(e) => setPracticeForm({...practiceForm, skill: e.target.value as PracticeSkill})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="READING">Đọc hiểu</option>
                    <option value="LISTENING">Nghe hiểu</option>
                    <option value="GRAMMAR">Ngữ pháp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp độ
                  </label>
                  <select
                    value={practiceForm.level}
                    onChange={(e) => setPracticeForm({...practiceForm, level: e.target.value as PracticeLevel})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="BASIC">Cơ bản</option>
                    <option value="INTERMEDIATE">Trung cấp</option>
                    <option value="ADVANCED">Nâng cao</option>
                  </select>
                </div>
              </div>

              {/* Questions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Câu hỏi ({practiceForm.questions.length})</h3>
                  <button
                    onClick={addQuestion}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Thêm câu hỏi
                  </button>
                </div>

                <div className="space-y-6">
                  {practiceForm.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Câu hỏi {qIndex + 1}</h4>
                        {practiceForm.questions.length > 1 && (
                          <button
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-600 hover:bg-red-100 p-1 rounded"
                            title="Xóa câu hỏi"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nội dung câu hỏi
                          </label>
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                            rows={2}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                            placeholder="Nhập nội dung câu hỏi"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Loại câu hỏi
                            </label>
                            <select
                              value={question.questionType}
                              onChange={(e) => updateQuestion(qIndex, { questionType: e.target.value as QuestionType })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                            >
                              <option value="MCQ">Trắc nghiệm</option>
                              <option value="TRUE_FALSE">Đúng/Sai</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Điểm
                            </label>
                            <input
                              type="number"
                              value={question.points}
                              onChange={(e) => updateQuestion(qIndex, { points: Number(e.target.value) })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                              min="1"
                              max="10"
                            />
                          </div>
                        </div>                        {/* Options */}
                        {question.questionType === 'MULTIPLE_CHOICE' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Các phương án trả lời
                            </label>
                            <div className="space-y-2">
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-500 w-6">
                                    {String.fromCharCode(65 + oIndex)}.
                                  </span>
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                    placeholder={`Phương án ${String.fromCharCode(65 + oIndex)}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.questionType === 'TRUE_FALSE' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Các phương án trả lời
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">A.</span>
                                <span className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                                  Đúng
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">B.</span>
                                <span className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                                  Sai
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đáp án đúng
                          </label>
                          <select
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(qIndex, { correctAnswer: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                          >
                            <option value="">Chọn đáp án đúng</option>
                            {question.questionType === 'TRUE_FALSE' ? (
                              <>
                                <option value="Đúng">A. Đúng</option>
                                <option value="Sai">B. Sai</option>
                              </>
                            ) : (
                              question.options.map((option, oIndex) => (
                                <option key={oIndex} value={option}>
                                  {String.fromCharCode(65 + oIndex)}. {option}
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giải thích (tùy chọn)
                          </label>
                          <textarea
                            value={question.explanation || ''}
                            onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
                            rows={2}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                            placeholder="Nhập giải thích cho đáp án"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingPractice(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={editingPractice ? handleUpdatePractice : handleCreatePractice}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {editingPractice ? 'Cập nhật' : 'Tạo bài luyện tập'}
              </button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};

export default PracticeManagementPage;
