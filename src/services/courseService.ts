import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../types/api';

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    try {
      console.log('🔍 Calling getAllCourses API...');
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.BASE);
      console.log('✅ getAllCourses API Response:', response);
      
      // Handle the backend response format which wraps data
      const courses = response.data?.data || [];
      console.log('📚 All courses data:', courses);
      
      return courses;
    } catch (error: any) {
      console.error('❌ getAllCourses error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  },

  async getCourseById(id: string): Promise<Course> {
    try {
      console.log('🔍 Calling getCourseById API for ID:', id);
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.BY_ID(id));
      console.log('✅ getCourseById API Response:', response);
      
      // Handle the backend response format which wraps data
      if (!response.data?.data) {
        throw new Error('Course data is missing or invalid');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('❌ getCourseById error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch course');
    }
  },  async getMyCourses(): Promise<Course[]> {
    try {
      console.log('🔍 Calling getMyCourses API...');
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.ENROLLED);
      console.log('✅ getMyCourses API Response:', response);
      
      // The backend returns the courses directly in response.data.data (not nested under courses property)
      const data = response.data?.data;
      if (Array.isArray(data)) {
        console.log('📚 My enrolled courses data (array):', data);
        return data;
      }
      // Fallback for potential object structure with courses property
      const courses = data?.courses || [];
      console.log('📚 My enrolled courses data (object):', courses);
      return courses;
    } catch (error: any) {
      console.error('❌ getMyCourses error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch enrolled courses');
    }
  },

  async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.COURSES.BASE, courseData);
      return response.data?.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create course');
    }
  },

  async updateCourse(id: string, courseData: UpdateCourseRequest): Promise<Course> {
    try {
      const response = await apiClient.patch<any>(API_ENDPOINTS.COURSES.BY_ID(id), courseData);
      return response.data?.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update course');
    }
  },

  async deleteCourse(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(id));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete course');
    }
  },

  async enrollInCourse(courseId: string): Promise<void> {
    try {
      console.log(`🔍 Enrolling in course with ID: ${courseId}`);
      // Log the full URL to debug the API call
      const url = `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`;
      console.log('Enrollment URL:', url);
      
      const response = await apiClient.post<any>(url);
      console.log('✅ Enrollment response:', response);
    } catch (error: any) {
      console.error('❌ Enrollment error:', error);
      console.error('Request URL:', `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw new Error(error.response?.data?.message || 'Failed to enroll in course');
    }
  },

  async unenrollFromCourse(courseId: string): Promise<void> {
    try {
      console.log(`🔍 Unenrolling from course with ID: ${courseId}`);
      const url = `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`;
      console.log('Unenrollment URL:', url);
      
      const response = await apiClient.delete(url);
      console.log('✅ Unenrollment response:', response);
    } catch (error: any) {
      console.error('❌ Unenrollment error:', error);
      console.error('Request URL:', `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw new Error(error.response?.data?.message || 'Failed to unenroll from course');
    }
  },

  async checkEnrollmentStatus(courseId: string): Promise<{ isEnrolled: boolean; enrollment?: any }> {
    try {
      console.log(`🔍 Checking enrollment status for course ID: ${courseId}`);
      const url = `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enrollment-status`;
      console.log('Enrollment status URL:', url);
      
      const response = await apiClient.get<any>(url);
      console.log('✅ Enrollment status response:', response);
      return response.data?.data || { isEnrolled: false };
    } catch (error: any) {
      console.error('❌ Enrollment status check error:', error);
      console.error('Request URL:', `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enrollment-status`);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw new Error(error.response?.data?.message || 'Failed to check enrollment status');
    }
  },
};
