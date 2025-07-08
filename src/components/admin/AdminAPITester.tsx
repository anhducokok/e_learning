import React, { useState } from 'react';
// import { testAdminUserAPI } from '../../test-admin-api';

const AdminAPITester: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setTesting(true);
    setError(null);
    setResults(null);
    
    try {
    //   const testResults = await testAdminUserAPI();
    //   setResults(testResults);
    } catch (err: any) {
      setError(err.message || 'Test failed');
      console.error('Test error:', err);
    } finally {
      setTesting(false);
    }
  };

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <h3 className="text-lg font-semibold mb-2">🧪 Admin API Tester</h3>
      <button 
        onClick={runTests}
        disabled={testing}
        className={`w-full px-4 py-2 rounded ${
          testing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {testing ? 'Testing...' : 'Test Admin APIs'}
      </button>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {results && (
        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
          <strong>Success!</strong>
          <div className="mt-1 text-xs">
            <div>Users: {results.allUsers?.length || 0}</div>
            <div>Teachers: {results.teachers?.length || 0}</div>
            <div>Students: {results.students?.length || 0}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAPITester;
