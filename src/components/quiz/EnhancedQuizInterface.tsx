import React, { useState, useEffect, useCallback } from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid 
} from '@heroicons/react/24/solid';
import { quizService, type QuizAttempt } from '../../services/quizService';
import type { Quiz, QuizSubmission } from '../../types/api';

interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
}

interface EnhancedQuizInterfaceProps {
  quiz: Quiz;
  onComplete: (submission: QuizSubmission) => void;
  onExit: () => void;
  isRetake?: boolean; // New prop to indicate if this is a retake
}

const EnhancedQuizInterface: React.FC<EnhancedQuizInterfaceProps> = ({
  quiz,
  onComplete,
  onExit,
  isRetake = false
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Auto-save draft answers every 30 seconds
  useEffect(() => {
    if (!isStarted || answers.length === 0) return;

    const interval = setInterval(() => {
      saveDraftAnswers();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [answers, isStarted]);

  // Timer for time-limited quizzes
  useEffect(() => {
    if (!isStarted || !quizAttempt?.timeLimit) return;

    const interval = setInterval(() => {
      if (timeRemaining !== null && timeRemaining > 0) {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, timeRemaining, quizAttempt]);
  const startQuiz = async () => {
    try {
      setLoading(true);
      setError(null);

      // First check if user has already completed this quiz
      try {
        const existingSubmission = await quizService.getQuizSubmission(quiz.id);
        if (existingSubmission && existingSubmission.submittedAt) {
          // User has already completed this quiz, show the results
          onComplete(existingSubmission);
          return;
        }
      } catch (submissionError) {
        // No existing submission found, continue with starting the quiz
        console.log('No previous submission found, starting new attempt');
      }      // Start the quiz attempt
      const attempt = await quizService.startQuizAttempt(quiz.id, isRetake);
      setQuizAttempt(attempt);
      setIsStarted(true);

      // Set timer if quiz has time limit
      if (attempt.timeLimit) {
        setTimeRemaining(attempt.timeLimit * 60); // Convert minutes to seconds
      }

      // Try to load any existing draft answers
      try {
        const draftData = await quizService.getDraftAnswers(quiz.id);
        if (draftData.answers && draftData.answers.length > 0) {
          const draftAnswers = draftData.answers.map((draft: any) => ({
            questionId: draft.questionId,
            selectedAnswer: draft.selectedAnswer
          }));
          setAnswers(draftAnswers);
        }
      } catch (draftError) {
        // Ignore draft loading errors - user can start fresh
        console.log('No draft answers found or error loading drafts');
      }

    } catch (error: any) {
      if (error.message?.includes('already completed')) {
        setError('You have already completed this quiz. Your previous results should be displayed.');
      } else {
        setError(error.message || 'Failed to start quiz');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveDraftAnswers = useCallback(async () => {
    if (!isStarted || answers.length === 0) return;

    try {
      setAutoSaveStatus('saving');
      await quizService.saveDraftAnswers(quiz.id, { answers });
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Failed to save draft answers:', error);
    }
  }, [quiz.id, answers, isStarted]);

  const handleAnswerSelect = (questionId: string, selectedAnswer: string) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, selectedAnswer };
        return updated;
      }
      return [...prev, { questionId, selectedAnswer }];
    });

    // Auto-save after answer selection with debounce
    setTimeout(() => saveDraftAnswers(), 1000);
  };

  const handleTimeUp = async () => {
    try {
      // Auto-submit when time is up
      const submitData = {
        answers: answers.map(answer => ({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer
        }))
      };
      
      const submission = await quizService.submitQuizFinal(quiz.id, submitData);
      onComplete(submission);
    } catch (error: any) {
      setError('Time expired and failed to auto-submit: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    if (!quiz.questions) return;

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter(question => 
      !answers.find(answer => answer.questionId === question.id)
    );

    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions. ${unansweredQuestions.length} questions remaining.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        answers: answers.map(answer => ({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer
        }))
      };

      const submission = await quizService.submitQuizFinal(quiz.id, submitData);
      onComplete(submission);
    } catch (error: any) {
      setError(error.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentQuestionIndex < (quiz.questions?.length || 1) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getCurrentQuestion = () => {
    if (!quiz.questions) return null;
    return quiz.questions[currentQuestionIndex];
  };

  const getAnswerForQuestion = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.selectedAnswer || '';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!quiz.questions) return 0;
    const answeredCount = answers.length;
    return Math.round((answeredCount / quiz.questions.length) * 100);
  };

  if (!isStarted) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlayIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{quiz.title}</h2>
            <p className="text-gray-600 mb-6">{quiz.description}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-xl p-4">
                <div className="text-blue-600 font-semibold">Questions</div>
                <div className="text-2xl font-bold text-gray-900">{quiz.questions?.length || 0}</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-green-600 font-semibold">Time Limit</div>
                <div className="text-2xl font-bold text-gray-900">
                  {quizAttempt?.timeLimit ? `${quizAttempt.timeLimit} min` : 'No limit'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-purple-600 font-semibold">Total Points</div>
                <div className="text-2xl font-bold text-gray-900">
                  {quiz.questions?.reduce((sum, q) => sum + ((q as any).points || 1), 0) || 0}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={onExit}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={startQuiz}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent inline mr-2"></div>
                  Starting...
                </>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5 inline mr-2" />
                  Start Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const questionWithChoices = currentQuestion as { id: string, question: string, choices?: string[] };
  if (!currentQuestion) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Question</h3>
          <p className="text-red-700">Unable to load question {currentQuestionIndex + 1}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
      {/* Quiz Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {quiz.questions?.length}</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Auto-save status */}
          <div className="flex items-center gap-2 text-sm">
            <BookmarkIcon className={`h-4 w-4 ${
              autoSaveStatus === 'saving' ? 'text-blue-500 animate-spin' :
              autoSaveStatus === 'saved' ? 'text-green-500' :
              autoSaveStatus === 'error' ? 'text-red-500' : 'text-gray-400'
            }`} />
            <span className={`${
              autoSaveStatus === 'saved' ? 'text-green-600' :
              autoSaveStatus === 'error' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {autoSaveStatus === 'saving' ? 'Saving...' :
               autoSaveStatus === 'saved' ? 'Saved' :
               autoSaveStatus === 'error' ? 'Save failed' : 'Draft'}
            </span>
          </div>

          {/* Timer */}
          {timeRemaining !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${
              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <ClockIcon className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{getProgressPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / (quiz.questions?.length || 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h3>
          {questionWithChoices.choices && questionWithChoices.choices.length > 0 ? (
            <div className="space-y-3">
              {questionWithChoices.choices.map((choice, index) => {
                const isSelected = getAnswerForQuestion(questionWithChoices.id) === choice;
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(questionWithChoices.id, choice)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                        : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                        isSelected ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {isSelected && <CheckCircleIconSolid className="h-4 w-4 text-white" />}
                      </div>
                      <span className="font-medium">{choice}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-red-600">No answer choices available for this question.</div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => handleNavigation('prev')}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ArrowLeftIcon className="h-5 w-5 inline mr-2" />
          Previous
        </button>
        
        {currentQuestionIndex === (quiz.questions?.length || 1) - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent inline mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                Submit Quiz
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => handleNavigation('next')}
            disabled={currentQuestionIndex >= (quiz.questions?.length || 1) - 1}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl disabled:opacity-50"
          >
            Next
            <ArrowRightIcon className="h-5 w-5 inline ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EnhancedQuizInterface;
