import React, { useState, useEffect, useCallback } from 'react';
import type { Practice, PracticeAttempt } from '../../types/api';
import { practiceService } from '../../services';

interface PracticeAttemptProps {
  practiceId: string;
  onComplete: (attempt: PracticeAttempt) => void;
  onExit: () => void;
}

interface Answer {
  questionId: string;
  selectedAnswer: string;
}

const PracticeAttemptView: React.FC<PracticeAttemptProps> = ({
  practiceId,
  onComplete,
  onExit
}) => {  const [practice, setPractice] = useState<Practice | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [unansweredWarning, setUnansweredWarning] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Load practice data
  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      if (isStarting) return;
      setIsStarting(true);
      try {
        setLoading(true);
        // Gọi startPractice để tạo attempt mới
        const startRes = await practiceService.startPractice(practiceId);
        if (cancelled) return;
        setPractice({
          ...startRes.practice,
          questions: startRes.questions || [] // Ensure questions are always an array
        });
        setTimeLeft(startRes.practice.timeLimit);
        setStartTime(new Date(startRes.startedAt));
        setAttemptId(startRes.attemptId);
        setError(null);
        setRetryCount(0);
      } catch (err: any) {
        // Nếu vừa tạo xong practice mà backend chưa sẵn sàng, thử lại 1 lần sau 400ms
        if (
          err.message &&
          err.message.toLowerCase().includes('not found') &&
          retryCount < 1
        ) {
          setTimeout(() => setRetryCount((c) => c + 1), 400);
        } else {
          setError(err.message || 'Failed to start practice');
          console.error('Error starting practice:', err);
        }
      } finally {
        setLoading(false);
        setIsStarting(false);
      }
    };
    if (retryCount === 0) start();
    if (retryCount === 1) start();
    return () => {
      cancelled = true;
    };
  }, [practiceId, retryCount]);
  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || !startTime) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        // Show warning when 60 seconds left
        if (prev === 61) {
          setShowTimeWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, startTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeWarningColor = (): string => {
    if (timeLeft <= 60) return 'text-red-600'; // Last minute
    if (timeLeft <= 300) return 'text-orange-600'; // Last 5 minutes
    return 'text-gray-800';
  };

  const handleAnswerSelect = (questionId: string, selectedAnswer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId 
            ? { ...a, selectedAnswer }
            : a
        );
      }
      return [...prev, { questionId, selectedAnswer }];
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!practice || !startTime || submitting || !attemptId) return;
    if (!practice.questions) return;
    // Kiểm tra tất cả câu hỏi đã được trả lời
    const unanswered = practice.questions.filter(
      q => !answers.find(a => a.questionId === q.id)
    );
    if (unanswered.length > 0) {
      setUnansweredWarning(true);
      return;
    }
    try {
      setSubmitting(true);
      setUnansweredWarning(false);
      const timeSpent = Math.floor((Date.now() - startTime.getTime()) / 1000);
      // Đảm bảo chỉ gửi đúng trường backend yêu cầu
      const submitAnswers = answers.map(a => ({
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer
      }));
      // Gửi submitPractice như cũ (vì backend nhận theo practiceId, userId từ token, không cần attemptId)
      const result = await practiceService.submitPractice(practiceId, {
        timeSpent,
        answers: submitAnswers
      });

      onComplete(result);
    } catch (err) {
      setError('Failed to submit practice');
      console.error('Error submitting practice:', err);
    } finally {
      setSubmitting(false);
    }  }, [practice, startTime, practiceId, answers, onComplete, submitting, attemptId]);

  const handleDismissTimeWarning = () => {
    setShowTimeWarning(false);
  };

  const handleNextQuestion = () => {
    if (practice && currentQuestion < practice.questions!.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestion(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice...</p>
        </div>
      </div>
    );
  }

  if (error || !practice || !practice.questions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error || 'Practice not found'}</div>
          <button
            onClick={onExit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQ = practice.questions[currentQuestion];
  const currentAnswer = answers.find(a => a.questionId === currentQ.id);
  const isLastQuestion = currentQuestion === practice.questions.length - 1;
  const answeredCount = answers.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onExit}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Exit Practice"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{practice.title}</h1>
                <p className="text-sm text-gray-600">{practice.skill} • {practice.level}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Progress */}
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {practice.questions.length}
              </div>
              
              {/* Timer */}
              <div className={`text-2xl font-bold ${getTimeWarningColor()}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / practice.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                {practice.questions.map((q, index) => {
                  const isAnswered = answers.some(a => a.questionId === q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleQuestionJump(index)}
                      className={`w-full p-3 rounded-lg text-sm font-medium transition-colors ${
                        currentQuestion === index
                          ? 'bg-blue-600 text-white'
                          : isAnswered
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-medium">{answeredCount}/{practice.questions.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Question {currentQuestion + 1}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {currentQ.points} point{currentQ.points !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Audio */}
                {currentQ.audioUrl && (
                  <div className="mb-6">
                    <audio controls className="w-full">
                      <source src={currentQ.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {/* Image */}
                {currentQ.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={currentQ.imageUrl}
                      alt="Question"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}

                <div className="prose max-w-none">
                  <div className="text-lg text-gray-800 whitespace-pre-wrap">
                    {currentQ.question}
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                      currentAnswer?.selectedAnswer === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option}
                      checked={currentAnswer?.selectedAnswer === option}
                      onChange={() => handleAnswerSelect(currentQ.id, option)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      currentAnswer?.selectedAnswer === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer?.selectedAnswer === option && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </label>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex space-x-4">
                  {!isLastQuestion ? (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Practice</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Time Warning Modal */}
      {showTimeWarning && timeLeft <= 60 && timeLeft > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Time Warning!</h3>
              <p className="text-gray-600 mb-4">
                Only {timeLeft} second{timeLeft !== 1 ? 's' : ''} remaining!
              </p>
              <button
                onClick={handleDismissTimeWarning}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unanswered Warning Modal */}
      {unansweredWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 text-center">
            <div className="text-2xl mb-4 text-red-600">⚠️</div>
            <h3 className="text-lg font-bold mb-2">Bạn cần trả lời tất cả các câu hỏi trước khi nộp bài!</h3>
            <button
              onClick={() => setUnansweredWarning(false)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeAttemptView;
