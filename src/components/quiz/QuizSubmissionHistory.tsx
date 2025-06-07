import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  TrophyIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { quizService } from '../../services/quizService';
import type { QuizSubmission } from '../../types/api';

interface QuizSubmissionHistoryProps {
  onClose: () => void;
  onViewSubmission?: (submission: QuizSubmission) => void;
}

const QuizSubmissionHistory: React.FC<QuizSubmissionHistoryProps> = ({ 
  onClose, 
  onViewSubmission 
}) => {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const userSubmissions = await quizService.getUserSubmissions();
      setSubmissions(userSubmissions);
    } catch (error: any) {
      setError(error.message || 'Failed to load quiz submissions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrophyIcon className="h-5 w-5" />;
    if (score >= 60) return <CheckCircleIcon className="h-5 w-5" />;
    return <XCircleIcon className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"></div>
          </div>
          <div className="ml-6">
            <div className="text-xl font-semibold text-gray-800 mb-2">Loading Your Quiz History...</div>
            <div className="text-gray-600">Please wait while we fetch your submissions</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Submissions</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={fetchSubmissions}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Submission History</h2>
          <p className="text-gray-600 text-lg">View all your completed quizzes and scores</p>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
        >
          <XCircleIcon className="h-5 w-5 inline mr-2" />
          Close
        </button>
      </div>

      {/* Statistics Summary */}
      {submissions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-xl">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
                <div className="text-blue-600 font-medium">Quizzes Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-xl">
                <TrophyIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length)}%
                </div>
                <div className="text-green-600 font-medium">Average Score</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 rounded-xl">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {submissions.filter(sub => sub.score >= 80).length}
                </div>
                <div className="text-purple-600 font-medium">High Scores (80%+)</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500 rounded-xl">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {submissions.reduce((sum, sub) => sum + (sub.timeSpent || 0), 0) > 0 
                    ? Math.round(submissions.reduce((sum, sub) => sum + (sub.timeSpent || 0), 0) / submissions.length / 60)
                    : 0}m
                </div>
                <div className="text-orange-600 font-medium">Avg. Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions List */}
      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <div 
              key={submission.id} 
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {submission.quiz?.title || 'Quiz Title Not Available'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {submission.submittedAt ? formatDate(submission.submittedAt) : 'Date not available'}
                        </div>
                        {submission.timeSpent && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {formatDuration(submission.timeSpent)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg ${getScoreColor(submission.score)}`}>
                      {getScoreIcon(submission.score)}
                      {Math.round(submission.score)}%
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Points:</span> {submission.totalPoints}/{submission.maxPoints}
                    </div>
                    <div>
                      <span className="font-medium">Course:</span> {submission.quiz?.course?.title || 'N/A'}
                    </div>
                    {submission.quiz?.lesson && (
                      <div>
                        <span className="font-medium">Lesson:</span> {submission.quiz.lesson.title}
                      </div>
                    )}
                  </div>

                  {/* Score Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500">Score Progress</span>
                      <span className="text-xs font-medium text-gray-500">
                        {submission.totalPoints}/{submission.maxPoints} points
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          submission.score >= 80 ? 'bg-green-500' :
                          submission.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, submission.score)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {onViewSubmission && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => onViewSubmission(submission)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <EyeIcon className="h-5 w-5" />
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <AcademicCapIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-700 mb-4">No Quiz Submissions Yet</h3>
          <p className="text-gray-500 text-lg mb-8">
            You haven't completed any quizzes yet. Start taking quizzes to see your progress here!
          </p>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:shadow-xl"
          >
            Explore Quizzes
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSubmissionHistory;
