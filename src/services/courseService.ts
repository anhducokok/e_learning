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
      const response = await apiClient.get<Course[]>(API_ENDPOINTS.COURSES.ENROLLED);
      return response || [];
    } catch (error: any) {
      console.error('Failed to fetch enrolled courses:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch enrolled courses";
      throw new Error(errorMessage);
    }
  },
  async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.COURSES.BASE,
        courseData
      );
      return response.data;
    } catch (error: any) {
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
  async enrollInCourse(courseId: string): Promise<void> {
    try {      const url = `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`;
      // const response = await apiClient.post<any>(url); // response unused
      await apiClient.post<any>(url);
    } catch (error: any) {
      if (error.response) {
      }
      throw new Error(
        error.response?.data?.message || "Failed to enroll in course"
      );
    }
  },
  async unenrollFromCourse(courseId: string): Promise<void> {
    try {      const url = `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`;
      // const response = await apiClient.delete(url); // response unused
      await apiClient.delete(url);
    } catch (error: any) {
      if (error.response) {
      }
      throw new Error(
        error.response?.data?.message || "Failed to unenroll from course"
      );
    }
  },
  async checkEnrollmentStatus(
    courseId: string
  ): Promise<{ isEnrolled: boolean; enrollment?: any }> {
    try {
      const url = `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/enrollment-status`;
      const response = await apiClient.get<any>(url);
      return response.data?.data || { isEnrolled: false };
    } catch (error: any) {
      if (error.response) {
      }
      throw new Error(
        error.response?.data?.message || "Failed to check enrollment status"
      );
    }
  },
};
