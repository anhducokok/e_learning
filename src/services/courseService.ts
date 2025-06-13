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
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.BASE);
      // After API client fix, response should be the direct data
      const courses = response.data || response || [];
      return courses;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch courses"
      );
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
      const response = await apiClient.get<any>(API_ENDPOINTS.COURSES.ENROLLED);
      // The backend response structure should be:
      // { success: true, statusCode: 200, message: "...", data: [...courses], timestamp: "..." }

      // First try to get courses from data.data array (most likely path)
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      // Then try response.data.data.courses
      if (
        response.data?.data?.courses &&
        Array.isArray(response.data.data.courses)
      ) {
        return response.data.data.courses;
      }

      // Finally try response.data (if it's already the courses array)
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Fallback to empty array if nothing found
      return [];
    } catch (error: any) {
      if (error.response) {
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch enrolled courses"
      );
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
