import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { 
  Practice, 
  PracticeAttempt, 
  PracticeAnswer,
  CreatePracticeRequest,
  SubmitPracticeRequest,
  PracticeFilterRequest,
  PracticeStats,
  PracticeSkill,
  PracticeLevel,
  StartPracticeResponse
} from '../types/api';

export const practiceService = {  async getAllPractices(filters: PracticeFilterRequest = {}): Promise<{ data: Practice[]; total: number; page: number; limit: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.skill) queryParams.append('skill', filters.skill);
      if (filters.level) queryParams.append('level', filters.level);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const url = queryParams.toString() 
        ? `${API_ENDPOINTS.PRACTICES.BASE}?${queryParams}`
        : API_ENDPOINTS.PRACTICES.BASE;

      const response = await apiClient.get<any>(url);
      // Handle standardized response structure
      const responseData = response.data?.data || response.data || response;
      return {
        data: responseData.practices || responseData.data || responseData || [],
        total: responseData.pagination?.total || responseData.total || 0,
        page: responseData.pagination?.page || responseData.page || filters.page || 1,
        limit: responseData.pagination?.limit || responseData.limit || filters.limit || 10
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch practices');
    }
  },  async getPracticeById(id: string): Promise<Practice> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PRACTICES.BY_ID(id));
      return response.data?.data || response.data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch practice');
    }
  },

  async createPractice(practiceData: CreatePracticeRequest): Promise<Practice> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.PRACTICES.BASE, practiceData);
      return response.data?.data || response.data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create practice');
    }
  },

  async updatePractice(id: string, practiceData: Partial<CreatePracticeRequest>): Promise<Practice> {
    try {
      const response = await apiClient.put<any>(API_ENDPOINTS.PRACTICES.BY_ID(id), practiceData);
      return response.data?.data || response.data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update practice');
    }
  },

  async deletePractice(id: string): Promise<void> {
    try {
      const url = API_ENDPOINTS.PRACTICES.BY_ID(id);
      await apiClient.delete(url);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete practice');
    }
  },
  async startPractice(practiceId: string): Promise<StartPracticeResponse> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.PRACTICES.START(practiceId));
      return response.data || response;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to start practice');
      } else {
        throw new Error(error.message || 'Failed to start practice');
      }
    }
  },

  async submitPractice(practiceId: string, submission: SubmitPracticeRequest): Promise<PracticeAttempt> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.PRACTICES.SUBMIT(practiceId), submission);
      return response.data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit practice');
    }
  },

  async getMyAttempts(page = 1, limit = 10, skill?: PracticeSkill, level?: PracticeLevel): Promise<{ attempts: PracticeAttempt[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      if (skill) queryParams.append('skill', skill);
      if (level) queryParams.append('level', level);

      const response = await apiClient.get<any>(`${API_ENDPOINTS.PRACTICES.MY_ATTEMPTS}?${queryParams}`);
      return {
        attempts: response.data?.attempts || response.data || response || [],
        pagination: response.data?.pagination || { page, limit, total: 0 }
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get practice attempts');
    }
  },

  async getPracticeAttempts(practiceId: string, page = 1, limit = 10): Promise<{ attempts: PracticeAttempt[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      const response = await apiClient.get<any>(`${API_ENDPOINTS.PRACTICES.ATTEMPTS(practiceId)}?${queryParams}`);
      return {
        attempts: response.data?.attempts || response.data || response || [],
        pagination: response.data?.pagination || { page, limit, total: 0 }
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get practice attempts');
    }
  },

  async getMyStats(): Promise<PracticeStats> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PRACTICES.STATS);
      return response.data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get practice statistics');
    }
  },

  async getPracticeAnswers(attemptId: string): Promise<PracticeAnswer[]> {
    try {
      const response = await apiClient.get<any>(`${API_ENDPOINTS.PRACTICES.BASE}/attempts/${attemptId}/answers`);
      return response.data || response || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get practice answers');
    }
  },
};
