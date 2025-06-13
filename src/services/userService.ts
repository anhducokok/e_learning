import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../config/api";
import type { User } from "../types/api";

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
};
