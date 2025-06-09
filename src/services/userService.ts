import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../config/api";
import type { User } from "../types/api";

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      console.log("🔍 Calling getAllUsers API...");
      const response = await apiClient.get<any>(API_ENDPOINTS.USERS.BASE);
      console.log("✅ getAllUsers API Response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error in getAllUsers:", error);
      throw error;
    }
  },
  async getUserById(userId: string): Promise<User> {
    try {
      console.log("🔍 Calling getUserById API for ID:", userId);
      const response = await apiClient.get<any>(
        API_ENDPOINTS.USERS.BY_ID(userId)
      );
      console.log("✅ getUserById API Response:", response);

      // Lấy data trả về (có thể ở response.data hoặc response)
      const userData = response.data || response;
      if (!userData) {
        throw new Error("User data is missing or invalid");
      }

      // Debug một số trường user
      console.log("📋 User data debug:", {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });

      return userData;
    } catch (error: any) {
      console.error("❌ getUserById error:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },
};
