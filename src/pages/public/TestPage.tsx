import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/api";

const TestPage: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchCourses(selectedClassId);
    } else {
      setCourses([]);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching classes...');
      const response = await fetch(`${API_BASE_URL}/classes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Classes response:', data);
      
      if (data.success && data.data) {
        setClasses(data.data);
        // Auto-select first class if available
        if (data.data.length > 0) {
          setSelectedClassId(data.data[0].id);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setError(err.message || 'Failed to fetch classes');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (classId: string) => {
    setLoadingCourses(true);
    
    try {
      console.log(`Fetching courses for class ${classId}...`);
      const response = await fetch(`${API_BASE_URL}/classes/${classId}/courses`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Courses response:', data);
      
      if (data.success && data.data) {
        setCourses(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Classes</h2>
        {loading ? (
          <p>Loading classes...</p>
        ) : error ? (
          <div className="text-red-600 border border-red-300 p-3 rounded bg-red-50">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : (
          <div>
            <p className="mb-2">Found {classes.length} classes:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {classes.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => setSelectedClassId(classItem.id)}
                  className={`px-3 py-1 rounded-md ${
                    selectedClassId === classItem.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {classItem.name}
                </button>
              ))}
            </div>
            
            <div className="border p-3 rounded bg-gray-50">
              <pre>{JSON.stringify(classes, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
      
      {selectedClassId && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Courses for {classes.find(c => c.id === selectedClassId)?.name}
          </h2>
          {loadingCourses ? (
            <p>Loading courses...</p>
          ) : (
            <div>
              <p className="mb-2">Found {courses.length} courses:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md"
                  >
                    <h3 className="font-bold">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <p className="text-xs mt-2">Level: {course.level}</p>
                  </div>
                ))}
              </div>
              
              {courses.length === 0 && (
                <p className="text-gray-600">No courses found in this class.</p>
              )}
              
              <div className="border p-3 rounded bg-gray-50">
                <pre>{JSON.stringify(courses, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">API Information</h2>
        <p><strong>Base URL:</strong> {API_BASE_URL}</p>
        <p><strong>Endpoints:</strong></p>
        <ul className="list-disc pl-6">
          <li><code>{API_BASE_URL}/classes</code> - Get all classes</li>
          <li><code>{API_BASE_URL}/classes/:id</code> - Get a specific class</li>
          <li><code>{API_BASE_URL}/classes/:id/courses</code> - Get courses in a class</li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage;
