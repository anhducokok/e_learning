import React from 'react';
import type { Practice, PracticeSkill, PracticeLevel } from '../../types/api';

interface PracticeCardProps {
  practice: Practice;
  onStart: (practiceId: string) => void;
  userRole?: string;
  onEdit?: (practiceId: string) => void;
  onDelete?: (practiceId: string) => void;
}

const getSkillColor = (skill: PracticeSkill): string => {
  switch (skill) {
    case 'READING':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'LISTENING':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'GRAMMAR':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getLevelColor = (level: PracticeLevel): string => {
  switch (level) {
    case 'BASIC':
      return 'bg-green-50 text-green-700';
    case 'INTERMEDIATE':
      return 'bg-yellow-50 text-yellow-700';
    case 'ADVANCED':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

const getSkillIcon = (skill: PracticeSkill): string => {
  switch (skill) {
    case 'READING':
      return '📖';
    case 'LISTENING':
      return '🎧';
    case 'GRAMMAR':
      return '📝';
    default:
      return '📚';
  }
};

const PracticeCard: React.FC<PracticeCardProps> = ({
  practice,
  onStart,
  userRole,
  onEdit,
  onDelete
}) => {
  const skillColor = getSkillColor(practice.skill);
  const levelColor = getLevelColor(practice.level);
  const skillIcon = getSkillIcon(practice.skill);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{skillIcon}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
              {practice.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${skillColor}`}>
                {practice.skill}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColor}`}>
                {practice.level}
              </span>
            </div>
          </div>
        </div>

        {/* Admin/Teacher Actions */}
        {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(practice.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Practice"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(practice.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Practice"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-2">
        {practice.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {practice.questionCount}
          </div>
          <div className="text-sm text-gray-500">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(practice.timeLimit / 60)}
          </div>
          <div className="text-sm text-gray-500">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {practice._count?.attempts || 0}
          </div>
          <div className="text-sm text-gray-500">Attempts</div>
        </div>
      </div>

      {/* Creator Info */}
      {practice.creator && (
        <div className="flex items-center mb-4 text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Created by {practice.creator.name}
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={() => onStart(practice.id)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Start Practice
      </button>
    </div>
  );
};

export default PracticeCard;
