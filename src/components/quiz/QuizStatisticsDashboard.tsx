import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  UsersIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { quizService, type QuizStatistics } from '../../services/quizService';
import type { Quiz } from '../../types/api';

interface QuizStatisticsDashboardProps {
  quiz: Quiz;
  onClose: () => void;
}

const QuizStatisticsDashboard: React.FC<QuizStatisticsDashboardProps> = ({ quiz, onClose }) => {
  const [statistics, setStatistics] = useState<QuizStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, [quiz.id]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await quizService.getQuizStatistics(quiz.id);
      setStatistics(stats);
    } catch (error: any) {
      setError(error.message || 'Failed to load quiz statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"></div>
          </div>
          <div className="ml-6">
            <div className="text-xl font-semibold text-gray-800 mb-2">Loading Statistics...</div>
            <div className="text-gray-600">Please wait while we analyze the data</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="text-center py-12">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Statistics</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={fetchStatistics}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Statistics</h2>
          <p className="text-gray-600 text-lg">{quiz.title}</p>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
        >
          <XCircleIcon className="h-5 w-5 inline mr-2" />
          Close
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-xl">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{statistics.totalAttempts}</div>
              <div className="text-blue-600 font-medium">Total Attempts</div>
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
                {Math.round(statistics.averageScore)}%
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
                {Math.round(statistics.completionRate)}%
              </div>
              <div className="text-purple-600 font-medium">Completion Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500 rounded-xl">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{quiz.questions?.length || 0}</div>
              <div className="text-orange-600 font-medium">Total Questions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Statistics */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Question Performance</h3>
        
        {statistics.questionStatistics && statistics.questionStatistics.length > 0 ? (
          <div className="space-y-4">
            {statistics.questionStatistics.map((questionStat, index) => {
              const question = quiz.questions?.find(q => q.id === questionStat.questionId);
              const accuracy = questionStat.correctPercentage || 0;
              
              return (
                <div key={questionStat.questionId} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Question {index + 1}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {question?.question || 'Question text not available'}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round(accuracy)}%
                      </div>
                      <div className="text-sm text-gray-500">Accuracy</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>
                      {questionStat.correctAnswers} / {questionStat.totalAnswers} correct
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      accuracy >= 80 ? 'bg-green-100 text-green-700' :
                      accuracy >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {accuracy >= 80 ? 'Easy' : accuracy >= 60 ? 'Medium' : 'Difficult'}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        accuracy >= 80 ? 'bg-green-500' :
                        accuracy >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${accuracy}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h4>
            <p className="text-gray-500">No submissions yet to analyze question performance.</p>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Quiz Difficulty Analysis</h4>
            {statistics.questionStatistics && statistics.questionStatistics.length > 0 ? (
              <div className="space-y-2">
                {(() => {
                  const easyQuestions = statistics.questionStatistics.filter(q => q.correctPercentage >= 80).length;
                  const mediumQuestions = statistics.questionStatistics.filter(q => q.correctPercentage >= 60 && q.correctPercentage < 80).length;
                  const hardQuestions = statistics.questionStatistics.filter(q => q.correctPercentage < 60).length;
                  
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600">Easy Questions</span>
                        <span className="font-semibold">{easyQuestions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-600">Medium Questions</span>
                        <span className="font-semibold">{mediumQuestions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-600">Difficult Questions</span>
                        <span className="font-semibold">{hardQuestions}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
            <div className="space-y-2 text-sm">
              {statistics.averageScore < 60 && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Consider reviewing quiz content - average score is low</span>
                </div>
              )}
              {statistics.completionRate < 80 && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Low completion rate - consider reducing quiz length or time limit</span>
                </div>
              )}
              {statistics.questionStatistics && statistics.questionStatistics.filter(q => q.correctPercentage < 40).length > 0 && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Some questions are very difficult - consider clarifying or providing hints</span>
                </div>
              )}
              {statistics.averageScore >= 80 && statistics.completionRate >= 90 && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Excellent quiz performance! Students are engaging well</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStatisticsDashboard;
