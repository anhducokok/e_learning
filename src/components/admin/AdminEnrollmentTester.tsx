import React, { useState } from 'react';
import { testAdminEnrollmentAPI, testCourseEnrollments } from '../../test-enrollment-api';

const AdminEnrollmentTester: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string>('');

  const runEnrollmentTests = async () => {
    setTesting(true);
    setError(null);
    setResults(null);
    
    try {
      const testResults = await testAdminEnrollmentAPI();
      setResults(testResults);
    } catch (err: any) {
      setError(err.message || 'Enrollment test failed');
      console.error('Enrollment test error:', err);
    } finally {
      setTesting(false);
    }
  };

  const runCourseEnrollmentTest = async () => {
    if (!courseId.trim()) {
      setError('Please enter a course ID');
      return;
    }

    setTesting(true);
    setError(null);
    
    try {
      const testResults = await testCourseEnrollments(courseId);
      setResults(testResults);
    } catch (err: any) {
      setError(err.message || 'Course enrollment test failed');
      console.error('Course enrollment test error:', err);
    } finally {
      setTesting(false);
    }
  };

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="text-lg font-semibold mb-2">🎯 Enrollment API Tester</h3>
      
      <div className="space-y-2">
        <button 
          onClick={runEnrollmentTests}
          disabled={testing}
          className={`w-full px-4 py-2 rounded text-sm ${
            testing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {testing ? 'Testing...' : 'Test Enrollment APIs'}
        </button>
        
        <div className="border-t pt-2">
          <input
            type="text"
            placeholder="Course ID"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm mb-2"
          />
          <button 
            onClick={runCourseEnrollmentTest}
            disabled={testing || !courseId.trim()}
            className={`w-full px-4 py-1 rounded text-sm ${
              testing || !courseId.trim()
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            Test Course Enrollments
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {results && (
        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-xs">
          <strong>Success!</strong>
          <div className="mt-1">
            {results.totalStudents !== undefined && (
              <div>Students: {results.totalStudents}</div>
            )}
            {results.enrollmentCount !== undefined && (
              <div>Enrollments: {results.enrollmentCount}</div>
            )}
            {results.courseId && (
              <div>Course: {results.courseId}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnrollmentTester;
