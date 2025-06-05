import React from 'react';
import { useParams, Link } from 'react-router-dom';

const LearningSessionPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="p-8">
        <Link to="/learning-room" className="text-blue-600 hover:underline">
          ← Back to Learning Room
        </Link>
        <h1 className="text-2xl font-bold mt-4">Learning Session</h1>
        <p>Course ID: {courseId}</p>
        <p>This is a simplified version for testing.</p>
      </div>
    </div>
  );
};

export default LearningSessionPage;
