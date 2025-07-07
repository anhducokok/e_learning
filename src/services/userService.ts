import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../config/api";
import type { User } from "../types/api";
import type { EnrolledStudent } from "../types/enrolledStudent";

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.USERS.BASE);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getUserById(userId: string): Promise<User> {
    try {
      const response = await apiClient.get<any>(
        API_ENDPOINTS.USERS.BY_ID(userId)
      );

      // Lấy data trả về (có thể ở response.data hoặc response)
      const userData = response.data || response;
      if (!userData) {
        throw new Error("User data is missing or invalid");
      }

      return userData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },
  async getEnrolledStudentsInMyCourses(): Promise<EnrolledStudent[]> {
    try {
      const response = await apiClient.get<EnrolledStudent[]>(
        API_ENDPOINTS.USERS.ENROLLED_IN_MY_COURSES
      );
      return response || [];
    } catch (error: any) {
      console.error('Failed to fetch enrolled students:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch enrolled students";
      throw new Error(errorMessage);
    }
  },
  async getStudentsByCourse(courseId: string): Promise<any[]> {
    try {
      const response = await apiClient.get<any>(`/api/users/courses/${courseId}/students`);
      // console.log('response', response);
      // Nếu response là { data: [...] }
      if (response && Array.isArray(response.data?.data)) return response.data.data;
      // Nếu response là mảng trực tiếp
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response)) return response;
      return [];
    } catch (error: any) {
      console.error('Failed to fetch students by course:', error);
      throw new Error(error.response?.data?.message || "Failed to fetch students by course");
    }
  },
  async changeUserRole(userId: string, newRole: string) {
    const response =  apiClient.patch(`/api/users/admin/${userId}/role`, { role: newRole });
     console.log('response', response);
     return response || [];
  },
  async updateUserInfo(userId: string, data: any) {
    return apiClient.patch(`/api/users/admin/${userId}`, data);
  },
  async addTeacher(data: { name: string; email: string; password: string }) {
    return apiClient.post(`/api/users/admin/add-teacher`, data);
  }
};
