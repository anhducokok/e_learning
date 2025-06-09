import React, { useState, useEffect } from 'react';
import type { Practice, PracticeSkill, PracticeLevel } from '../../types/api';
import { practiceService } from '../../services';
import PracticeCard from './PracticeCard';

interface PracticeListProps {
  userRole?: string;
  onStartPractice: (practiceId: string) => void;
  onEditPractice?: (practiceId: string) => void;
  onDeletePractice?: (practiceId: string) => void;
}

interface Filters {
  skill?: PracticeSkill;
  level?: PracticeLevel;
  search?: string;
}

const PracticeList: React.FC<PracticeListProps> = ({
  userRole,
  onStartPractice,
  onEditPractice,
  onDeletePractice
}) => {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPractices = async () => {
    try {
      setLoading(true);      const response = await practiceService.getAllPractices({
        ...filters,
        page: currentPage,
        limit: 12
      });
      setPractices(response.data);
      setTotalPages(Math.ceil(response.total / 12));
    } catch (err) {
      setError('Failed to load practices');
      console.error('Error loading practices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPractices();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const skillOptions: PracticeSkill[] = ['READING', 'LISTENING', 'GRAMMAR'];
  const levelOptions: PracticeLevel[] = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
        <button
          onClick={loadPractices}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Chinese Practice</h1>
          <p className="text-gray-600 mt-1">
            Improve your Chinese skills with interactive exercises
          </p>
        </div>
        
        {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
          <button
            onClick={() => onEditPractice?.('new')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Practice</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search practices..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill
            </label>
            <select
              value={filters.skill || ''}
              onChange={(e) => handleFilterChange({ skill: e.target.value as PracticeSkill || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Skills</option>
              {skillOptions.map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={filters.level || ''}
              onChange={(e) => handleFilterChange({ level: e.target.value as PracticeLevel || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {levelOptions.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Practices Grid */}
      {!loading && practices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practices.map((practice) => (
            <PracticeCard
              key={practice.id}
              practice={practice}
              onStart={onStartPractice}
              userRole={userRole}
              onEdit={onEditPractice}
              onDelete={onDeletePractice}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && practices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No practices found
          </h3>
          <p className="text-gray-600 mb-6">
            {Object.keys(filters).length > 0
              ? 'Try adjusting your filters to find more practices.'
              : 'No practices available at the moment.'}
          </p>
          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PracticeList;
