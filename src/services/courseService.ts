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
      
      // After API client fix, response should be the direct data
      const courses = response.data || response || [];
      console.log('📚 All courses data:', courses);
      
      return courses;
    } catch (error: any) {
      console.error('❌ getAllCourses error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  },  async getCourseById(id: string): Promise<Course> {
    try {
      console.log('🔍 Calling getCourseById API for ID:', id);
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.BY_ID(id));
      console.log('✅ getCourseById API Response:', response);
      
      // After API client fix, response should be the direct data
      const courseData = response.data || response;
      if (!courseData) {
        throw new Error('Course data is missing or invalid');
      }
      
      // Debug course ownership fields
      console.log('📚 Course ownership debug:', {
        id: courseData.id,
        title: courseData.title,
        createdBy: courseData.createdBy,
        teacherId: courseData.teacherId,
        teacher: courseData.teacher,
        creator: courseData.creator
      });
      
      return courseData;
    } catch (error: any) {
      console.error('❌ getCourseById error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch course');
    }
  },async getMyCourses(): Promise<Course[]> {
    try {
      console.log('🔍 Calling getMyCourses API...');
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.ENROLLED);
      console.log('✅ getMyCourses API Response structure:', {
        hasData: !!response.data,
        hasNestedData: !!response.data?.data,
        isDataArray: Array.isArray(response.data),
        isNestedDataArray: Array.isArray(response.data?.data)
      });
      
      // The backend response structure should be:
      // { success: true, statusCode: 200, message: "...", data: [...courses], timestamp: "..." }
      
      // First try to get courses from data.data array (most likely path)
      if (response.data?.data && Array.isArray(response.data.data)) {
        console.log('📚 Found courses in response.data.data array:', response.data.data.length);
        return response.data.data;
      }
      
      // Then try response.data.data.courses
      if (response.data?.data?.courses && Array.isArray(response.data.data.courses)) {
        console.log('📚 Found courses in response.data.data.courses:', response.data.data.courses.length);
        return response.data.data.courses;
      }
      
      // Finally try response.data (if it's already the courses array)
      if (Array.isArray(response.data)) {
        console.log('📚 Found courses directly in response.data array:', response.data.length);
        return response.data;
      }
      
      // Fallback to empty array if nothing found
      console.log('⚠️ No courses found in response structure');
      return [];
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
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create course');
    }
  },

  async updateCourse(id: string, courseData: UpdateCourseRequest): Promise<Course> {
    try {
      const response = await apiClient.patch<any>(API_ENDPOINTS.COURSES.BY_ID(id), courseData);
      return response.data;
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