import type { Class, Course } from '../types/api';
import { API_BASE_URL } from '../config/api';

// Direct fetch implementation to test API connectivity
export const classService = {
  /**
   * Get all classes
   */
  async getClasses(): Promise<Class[]> {
    try {
      console.log('🔍 Calling getClasses API with direct fetch...');
      const url = `${API_BASE_URL}/classes`;
      console.log('URL:', url);
      
      const response = await fetch(url);
      console.log('✅ Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch classes: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Response data:', data);
      
      const classes = data.data || [];
      console.log('📚 Classes count:', classes.length);
      
      return classes;
    } catch (error) {
      console.error('❌ getClasses error:', error);
      throw error;
    }
  },

  /**
   * Get a specific class by ID
   */
  async getClass(id: string): Promise<Class> {
    try {
      console.log(`🔍 Calling getClass API for ID: ${id}`);
      const url = `${API_BASE_URL}/classes/${id}`;
      console.log('URL:', url);
      
      const response = await fetch(url);
      console.log('✅ Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch class: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Response data:', data);
      
      if (!data.data) {
        throw new Error('Class data is missing or invalid');
      }
      
      return data.data;
    } catch (error) {
      console.error('❌ getClass error:', error);
      throw error;
    }
  },

  /**
   * Get courses within a specific class
   */
  async getClassCourses(classId: string): Promise<Course[]> {
    try {
      console.log(`🔍 Calling getClassCourses API for class ID: ${classId}`);
      const url = `${API_BASE_URL}/classes/${classId}/courses`;
      console.log('URL:', url);
      
      const response = await fetch(url);
      console.log('✅ Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch courses for class: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Response data:', data);
      
      const courses = data.data || [];
      console.log(`📚 Courses count for class ${classId}:`, courses.length);
      
      return courses;
    } catch (error) {
      console.error('❌ getClassCourses error:', error);
      throw error;
    }
  },
};
