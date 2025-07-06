import { API_ENDPOINTS } from "../config/api";

export const paymentService = {
  /**
   * Lấy danh sách các yêu cầu thanh toán đang chờ duyệt
   */
  async getPendingPayments(): Promise<any[]> {
    try {
      const url = API_ENDPOINTS.PAYMENTS.PENDING;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch pending payments: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy tất cả các yêu cầu thanh toán (mọi trạng thái)
   */
  async getAllPayments(): Promise<any[]> {
    try {
      const url = API_ENDPOINTS.PAYMENTS.ALL;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch all payments: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Duyệt yêu cầu thanh toán và ghi danh user vào khóa học
   */
  async approvePayment(requestId: string, userId: string, courseId: string) {
    try {
      const url = API_ENDPOINTS.PAYMENTS.APPROVE(requestId);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId }),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to approve payment: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Từ chối yêu cầu thanh toán
   */
  async rejectPayment(requestId: string) {
    try {
      const url = API_ENDPOINTS.PAYMENTS.REJECT(requestId);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(
          `Failed to reject payment: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
