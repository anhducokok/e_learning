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
    try {
      const response = await apiClient.patch(API_ENDPOINTS.USERS.CHANGE_ROLE(userId), { role: newRole });
      console.log('Role change response:', response);
      return response || [];
    } catch (error: any) {
      console.error('Failed to change user role:', error);
      throw new Error(error.response?.data?.message || "Failed to change user role");
    }
  },
  async updateUserInfo(userId: string, data: any) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.USERS.UPDATE_INFO(userId), data);
      console.log('Update user info response:', response);
      return response;
    } catch (error: any) {
      console.error('Failed to update user info:', error);
      throw new Error(error.response?.data?.message || "Failed to update user info");
    }
  },
  async addTeacher(data: { name: string; email: string; password: string }) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.ADD_TEACHER, data);
      console.log('Add teacher response:', response);
      return response;
    } catch (error: any) {
      console.error('Failed to add teacher:', error);
      throw new Error(error.response?.data?.message || "Failed to add teacher");
    }
  },

  // Admin endpoints
  async getAllUsersForAdmin(): Promise<User[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.USERS.ADMIN_ALL);
      return response.data?.data || response.data || response || [];
    } catch (error: any) {
      console.error('Failed to fetch all users for admin:', error);
      throw new Error(error.response?.data?.message || "Failed to fetch all users");
    }
  },

  async getTeachersForAdmin(): Promise<User[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.USERS.ADMIN_TEACHERS);
      return response.data?.data || response.data || response || [];
    } catch (error: any) {
      console.error('Failed to fetch teachers for admin:', error);
      throw new Error(error.response?.data?.message || "Failed to fetch teachers");
    }
  },

  async getStudentsForAdmin(): Promise<User[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.USERS.ADMIN_STUDENTS);
      return response.data?.data || response.data || response || [];
    } catch (error: any) {
      console.error('Failed to fetch students for admin:', error);
      throw new Error(error.response?.data?.message || "Failed to fetch students");
    }
  },

  // Enrollment management endpoints
  async getUserEnrollments(userId: string): Promise<any[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.USERS.ADMIN_USER_ENROLLMENTS(userId));
      return response.data?.data || response.data || response || [];
    } catch (error: any) {
      console.error('Failed to fetch user enrollments:', error);
      throw new Error(error.response?.data?.message || "Failed to fetch user enrollments");
    }
  },

  async getCourseEnrollments(courseId: string): Promise<any[]> {
    try {
      // Get all students
      const students = await this.getStudentsForAdmin();
      const allEnrollments: any[] = [];
      
      // Fetch enrollments for each student and filter by courseId
      for (const student of students) {
        try {
          const studentEnrollments = await this.getUserEnrollments(student.id);
          const courseEnrollments = studentEnrollments.filter((enrollment: any) => 
            enrollment.courseId === courseId
          );
          
          // Add student info to each enrollment and ensure userId is set
          courseEnrollments.forEach((enrollment: any) => {
            enrollment.userId = student.id; // Ensure userId is set
            enrollment.user = {
              id: student.id,
              name: student.name,
              email: student.email
            };
          });
          
          allEnrollments.push(...courseEnrollments);
        } catch (err) {
          console.warn(`Failed to fetch enrollments for student ${student.id}:`, err);
        }
      }
      
      return allEnrollments;
    } catch (error: any) {
      console.error('Failed to fetch course enrollments:', error);
      throw new Error(error.response?.data?.message || "Failed to fetch course enrollments");
    }
  },

  async updateEnrollmentDate(userId: string, courseId: string, enrolledAt: string): Promise<any> {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.USERS.ADMIN_UPDATE_ENROLLMENT_DATE(userId, courseId),
        { enrolledAt }
      );
      console.log('Update enrollment date response:', response);
      return response;
    } catch (error: any) {
      console.error('Failed to update enrollment date:', error);
      throw new Error(error.response?.data?.message || "Failed to update enrollment date");
    }
  },
};
