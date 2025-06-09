import React from 'react';
import type { PracticeAttempt, PracticeAnswer } from '../../types/api';

interface PracticeResultsProps {
  attempt: PracticeAttempt;
  answers?: PracticeAnswer[];
  onRetry: () => void;
  onBackToList: () => void;
}

const PracticeResults: React.FC<PracticeResultsProps> = ({
  attempt,
  answers = [],
  onRetry,
  onBackToList
}) => {
  const scorePercentage = Math.round((attempt.score / attempt.totalPoints) * 100);
  const timeSpentMinutes = Math.floor(attempt.timeSpent / 60);
  const timeSpentSeconds = attempt.timeSpent % 60;

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPerformanceMessage = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent work! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good performance! 👍';
    if (percentage >= 60) return 'Keep practicing! 💪';
    return 'Don\'t give up, try again! 🔄';
  };

  const getPerformanceEmoji = (percentage: number): string => {
    if (percentage >= 90) return '🌟';
    if (percentage >= 80) return '🎯';
    if (percentage >= 70) return '✅';
    if (percentage >= 60) return '📈';
    return '📚';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getPerformanceEmoji(scorePercentage)}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Practice Complete!</h1>
          <p className="text-xl text-gray-600">{getPerformanceMessage(scorePercentage)}</p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Practice Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {attempt.practice?.title}
            </h2>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {attempt.practice?.skill}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                {attempt.practice?.level}
              </span>
            </div>
          </div>

          {/* Score Display */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(scorePercentage)} mb-4`}>
              <span className={`text-4xl font-bold ${getScoreColor(scorePercentage)}`}>
                {scorePercentage}%
              </span>
            </div>
            <p className="text-lg text-gray-600">
              {attempt.score} out of {attempt.totalPoints} points
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Correct Answers */}
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {attempt.correctAnswers}
              </div>
              <div className="text-green-700 font-medium">Correct Answers</div>
              <div className="text-sm text-green-600 mt-1">
                out of {attempt.totalQuestions}
              </div>
            </div>

            {/* Time Spent */}
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {timeSpentMinutes}:{timeSpentSeconds.toString().padStart(2, '0')}
              </div>
              <div className="text-blue-700 font-medium">Time Spent</div>
              <div className="text-sm text-blue-600 mt-1">
                minutes
              </div>
            </div>

            {/* Accuracy */}
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)}%
              </div>
              <div className="text-purple-700 font-medium">Accuracy</div>
              <div className="text-sm text-purple-600 mt-1">
                correct rate
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRetry}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try Again</span>
            </button>
            
            <button
              onClick={onBackToList}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Back to Practices</span>
            </button>
          </div>
        </div>

        {/* Detailed Results */}
        {answers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Detailed Results</h3>
            
            <div className="space-y-6">
              {answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className={`p-6 rounded-xl border-2 ${
                    answer.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Question {index + 1}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        answer.isCorrect
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {answer.pointsEarned}/{answer.question?.points || 0} pts
                      </span>
                    </div>
                  </div>

                  {answer.question && (
                    <>
                      <div className="text-gray-800 mb-4">
                        {answer.question.question}
                      </div>

                      <div className="grid gap-3">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Your Answer:</span>
                          <div className={`mt-1 p-3 rounded-lg ${
                            answer.isCorrect ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {answer.selectedAnswer}
                          </div>
                        </div>

                        {!answer.isCorrect && answer.question.correctAnswer && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">Correct Answer:</span>
                            <div className="mt-1 p-3 rounded-lg bg-green-100">
                              {answer.question.correctAnswer}
                            </div>
                          </div>
                        )}

                        {answer.question.explanation && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">Explanation:</span>
                            <div className="mt-1 p-3 rounded-lg bg-blue-50 text-blue-800">
                              {answer.question.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeResults;
