import type { Class, Course } from '../types/api';
import { API_BASE_URL } from '../config/api';

// Direct fetch implementation to test API connectivity
export const classService = {  /**
   * Get all classes
   */
  async getClasses(): Promise<Class[]> {
    try {
      const url = `${API_BASE_URL}/classes`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch classes: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const classes = data.data || [];
      
      return classes;
    } catch (error) {
      throw error;
    }
  },
  /**
   * Get a specific class by ID
   */
  async getClass(id: string): Promise<Class> {
    try {
      const url = `${API_BASE_URL}/classes/${id}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch class: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.data) {
        throw new Error('Class data is missing or invalid');
      }
      
      return data.data;
    } catch (error) {
      throw error;
    }
  },
  /**
   * Get courses within a specific class
   */
  async getClassCourses(classId: string): Promise<Course[]> {
    try {
      const url = `${API_BASE_URL}/classes/${classId}/courses`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch courses for class: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const courses = data.data || [];
      
      return courses;
    } catch (error) {
      throw error;
    }
  },
};
