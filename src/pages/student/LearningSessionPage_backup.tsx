import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LearningSessionPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/learning-room');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Learning Session
            </h1>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Learning Room
            </button>
          </div>
          
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600 mb-4">
              Course ID: {courseId}
            </h2>
            <p className="text-gray-500">
              This is a simplified Learning Session page for testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningSessionPage;
