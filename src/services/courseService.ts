import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../types/api';

export const courseService = {  async getAllCourses(): Promise<Course[]> {
    try {
      console.log('🔍 Calling getAllCourses API...');
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.BASE);
      console.log('✅ getAllCourses API Response:', response);
      
      // Handle the backend response format which wraps data
      const courses = response.data || [];
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
      if (!response.data) {
        throw new Error('Course data is missing or invalid');
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ getCourseById error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch course');
    }
  },async getMyCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.ENROLLED);
      // Handle the backend response format which wraps data
      return response.data || [];
    } catch (error: any) {
      console.error('getMyCourses error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch enrolled courses');
    }
  },

  async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    try {
      return await apiClient.post<Course>(API_ENDPOINTS.COURSES.BASE, courseData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create course');
    }
  },

  async updateCourse(id: string, courseData: UpdateCourseRequest): Promise<Course> {
    try {
      return await apiClient.patch<Course>(API_ENDPOINTS.COURSES.BY_ID(id), courseData);
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
      await apiClient.post(`${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to enroll in course');
    }
  },

  async unenrollFromCourse(courseId: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unenroll from course');
    }
  },

  async checkEnrollmentStatus(courseId: string): Promise<{ isEnrolled: boolean; enrollment?: any }> {
    try {
      const response = await apiClient.get<any>(`${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enrollment-status`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check enrollment status');
    }
  },
};
