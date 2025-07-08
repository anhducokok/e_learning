import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../config/api";
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "../types/api";

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<Course[]>(API_ENDPOINTS.COURSES.BASE);
      return response || [];
    } catch (error: any) {
      // Log the full error object for debugging
      console.error('Failed to fetch courses (full error):', error);
      let errorMessage = 'Failed to fetch courses';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      throw new Error(errorMessage);
    }
  },
  async getCourseById(id: string): Promise<Course> {
    try {
      const response = await apiClient.get<any>(
        API_ENDPOINTS.COURSES.BY_ID(id)
      );
      // After API client fix, response should be the direct data
      const courseData = response.data || response;
      if (!courseData) {
        throw new Error("Course data is missing or invalid");
      }

      return courseData;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch course"
      );
    }
  },
  async getMyCourses(): Promise<Course[]> {
    try {
      // Use the new teacher-specific endpoint instead of enrolled courses
      const response = await apiClient.get<Course[]>(API_ENDPOINTS.COURSES.ENROLLED);
      return response || [];
    } catch (error: any) {
      console.error('Failed to fetch my courses:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch my courses";
      throw new Error(errorMessage);
    }
  },
  async createCourse(courseData: CreateCourseRequest, teacherId?: string): Promise<Course> {
    try {
      console.log('🔍 [CourseService] Creating course with data:', courseData);
      console.log('🔍 [CourseService] Teacher ID:', teacherId);
      
      // Add teacherId to course data if provided
      const coursePayload = teacherId 
        ? { ...courseData, teacherId }
        : courseData;
      
      console.log('🔍 [CourseService] Final course payload:', coursePayload);
      
      const response = await apiClient.post<any>(
        API_ENDPOINTS.COURSES.BASE,
        coursePayload
      );
      
      console.log('✅ [CourseService] Course created successfully:', response);
      return response.data || response;
    } catch (error: any) {
      console.error('❌ [CourseService] Error creating course:', error);
      throw new Error(
        error.response?.data?.message || "Failed to create course"
      );
    }
  },

  async updateCourse(
    id: string,
    courseData: UpdateCourseRequest
  ): Promise<Course> {
    try {
      const response = await apiClient.patch<any>(
        API_ENDPOINTS.COURSES.BY_ID(id),
        courseData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update course"
      );
    }
  },

  async deleteCourse(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(id));
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete course"
      );
    }
  },

  // Admin method to create course with specific teacher
  async createCourseWithTeacher(courseData: CreateCourseRequest & { teacherId: string }): Promise<Course> {
    try {
      console.log('🔍 [CourseService] Admin creating course with teacher:', courseData);
      
      const response = await apiClient.post<any>(
        API_ENDPOINTS.COURSES.CREATE_WITH_TEACHER,
        courseData
      );
      
      console.log('✅ [CourseService] Course created with teacher successfully:', response);
      return response.data || response;
    } catch (error: any) {
      console.error('❌ [CourseService] Error creating course with teacher:', error);
      throw new Error(
        error.response?.data?.message || "Failed to create course with teacher"
      );
    }
  },

  // Admin method to assign teacher to existing course
  async assignTeacherToCourse(courseId: string, teacherId: string): Promise<Course> {
    try {
      console.log('🔍 [CourseService] Assigning teacher to course:', { courseId, teacherId });
      
      const response = await apiClient.patch<any>(
        API_ENDPOINTS.COURSES.ASSIGN_TEACHER(courseId),
        { teacherId }
      );
      
      console.log('✅ [CourseService] Teacher assigned successfully:', response);
      return response.data || response;
    } catch (error: any) {
      console.error('❌ [CourseService] Error assigning teacher:', error);
      throw new Error(
        error.response?.data?.message || "Failed to assign teacher to course"
      );
    }
  },

  async enrollInCourse(courseId: string): Promise<void> {
    try {
      const url = `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`;
      await apiClient.post<any>(url);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to enroll in course"
      );
    }
  },

  async getEnrolledCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<Course[]>(
        API_ENDPOINTS.COURSES.ENROLLED
      );
      return response || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch enrolled courses"
      );
    }
  },

  // New API methods for teacher course management
  async getCoursesByTeacher(teacherId: string, page: number = 1, limit: number = 10): Promise<{ courses: Course[]; total: number; page: number; limit: number }> {
    try {
      console.log('🔍 [CourseService] getCoursesByTeacher called with:', { teacherId, page, limit });
      console.log('🔍 [CourseService] API endpoint:', API_ENDPOINTS.COURSES.BY_TEACHER(teacherId));
      
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.BY_TEACHER(teacherId), {
        params: { page, limit }
      });
      
      console.log('📊 [CourseService] getCoursesByTeacher raw response:', response);
      
      const result = response || { courses: [], total: 0, page, limit };
      console.log('📊 [CourseService] getCoursesByTeacher final result:', result);
      
      return result;
    } catch (error: any) {
      console.error('❌ [CourseService] Failed to fetch courses by teacher:', error);
      console.error('❌ [CourseService] Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || "Failed to fetch courses by teacher");
    }
  },

  async getTeacherStatistics(teacherId: string): Promise<any> {
    try {
      console.log('🔍 [CourseService] getTeacherStatistics called with teacherId:', teacherId);
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.TEACHER_STATISTICS(teacherId));
      console.log('📊 [CourseService] getTeacherStatistics response:', response);
      return response || {};
    } catch (error: any) {
      console.error('❌ [CourseService] Failed to fetch teacher statistics:', error);
      throw new Error(error.response?.data?.message || "Failed to fetch teacher statistics");
    }
  },

  async getMyStatistics(): Promise<any> {
    try {
      console.log('🔍 [CourseService] getMyStatistics called');
      console.log('🔍 [CourseService] API endpoint:', API_ENDPOINTS.COURSES.MY_STATISTICS);
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.MY_STATISTICS);
      console.log('📊 [CourseService] getMyStatistics response:', response);
      return response || {};
    } catch (error: any) {
      console.error('❌ [CourseService] Failed to fetch my statistics:', error);
      throw new Error(error.response?.data?.message || "Failed to fetch my statistics");
    }
  },

  // Enhanced getMyCourses with pagination
  async getMyCoursesWithPagination(page: number = 1, limit: number = 10): Promise<{ courses: Course[]; total: number; page: number; limit: number }> {
    try {
      console.log('🔍 [CourseService] getMyCoursesWithPagination called with:', { page, limit });
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.MY_COURSES, {
        params: { page, limit }
      });
      console.log('📊 [CourseService] getMyCoursesWithPagination response:', response);
      return response || { courses: [], total: 0, page, limit };
    } catch (error: any) {
      console.error('❌ [CourseService] Failed to fetch my courses with pagination:', error);
      throw new Error(error.response?.data?.message || "Failed to fetch my courses");
    }
  },

  // Thumbnail management methods (URL-based)
  async updateThumbnailUrl(courseId: string, thumbnailUrl: string): Promise<Course> {
    try {
      console.log('🔍 [CourseService] Updating thumbnail URL for course:', courseId);
      console.log('🔍 [CourseService] New thumbnail URL:', thumbnailUrl);
      
      const response = await apiClient.patch<any>(
        API_ENDPOINTS.COURSES.UPDATE_THUMBNAIL(courseId),
        { thumbnail: thumbnailUrl }
      );
      
      console.log('✅ [CourseService] Thumbnail URL updated successfully:', response);
      return response.data || response;
    } catch (error: any) {
      console.error('❌ [CourseService] Error updating thumbnail URL:', error);
      throw new Error(
        error.response?.data?.message || "Failed to update thumbnail URL"
      );
    }
  },

  async deleteThumbnail(courseId: string): Promise<void> {
    try {
      console.log('🔍 [CourseService] Deleting thumbnail for course:', courseId);
      
      await apiClient.delete(
        API_ENDPOINTS.COURSES.DELETE_THUMBNAIL(courseId)
      );
      
      console.log('✅ [CourseService] Thumbnail deleted successfully');
    } catch (error: any) {
      console.error('❌ [CourseService] Error deleting thumbnail:', error);
      throw new Error(
        error.response?.data?.message || "Failed to delete thumbnail"
      );
    }
  },
};
