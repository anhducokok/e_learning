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
      console.log('🔍 Calling getAllPractices API...');
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
      console.log('✅ getAllPractices API Response:', response);
      
      // Handle standardized response structure
      const responseData = response.data?.data || response.data || response;
      console.log('📚 Practices data:', responseData);
      
      return {
        data: responseData.practices || responseData.data || responseData || [],
        total: responseData.pagination?.total || responseData.total || 0,
        page: responseData.pagination?.page || responseData.page || filters.page || 1,
        limit: responseData.pagination?.limit || responseData.limit || filters.limit || 10
      };
    } catch (error: any) {
      console.error('❌ getAllPractices error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch practices');
    }
  },  async getPracticeById(id: string): Promise<Practice> {
    try {
      console.log(`🔍 Calling getPracticeById API for ID: ${id}`);
      const response = await apiClient.get<any>(API_ENDPOINTS.PRACTICES.BY_ID(id));
      console.log('✅ getPracticeById API Response:', response);
      return response.data?.data || response.data || response;
    } catch (error: any) {
      console.error('❌ getPracticeById error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch practice');
    }
  },

  async createPractice(practiceData: CreatePracticeRequest): Promise<Practice> {
    try {
      console.log('🔍 Calling createPractice API...');
      const response = await apiClient.post<any>(API_ENDPOINTS.PRACTICES.BASE, practiceData);
      console.log('✅ createPractice API Response:', response);
      return response.data?.data || response.data || response;
    } catch (error: any) {
      console.error('❌ createPractice error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create practice');
    }
  },

  async updatePractice(id: string, practiceData: Partial<CreatePracticeRequest>): Promise<Practice> {
    try {
      console.log(`🔍 Calling updatePractice API for ID: ${id}`);
      const response = await apiClient.put<any>(API_ENDPOINTS.PRACTICES.BY_ID(id), practiceData);
      console.log('✅ updatePractice API Response:', response);
      return response.data?.data || response.data || response;
    } catch (error: any) {
      console.error('❌ updatePractice error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update practice');
    }
  },

  async deletePractice(id: string): Promise<void> {
    try {
      console.log(`🔍 Calling deletePractice API for ID: ${id}`);
      const url = API_ENDPOINTS.PRACTICES.BY_ID(id);
      console.log(`🔍 API URL: ${url}`);
      await apiClient.delete(url);
      console.log('✅ Practice deleted successfully');
    } catch (error: any) {
      console.error('❌ deletePractice error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw new Error(error.response?.data?.message || 'Failed to delete practice');
    }
  },
  async startPractice(practiceId: string): Promise<StartPracticeResponse> {
    try {
      console.log(`🔍 Starting practice ${practiceId}...`);
      const response = await apiClient.post<any>(API_ENDPOINTS.PRACTICES.START(practiceId));
      console.log('✅ startPractice API Response:', response);
      return response.data || response;
    } catch (error: any) {
      if (error.response) {
        console.error('❌ startPractice error:', error.response.data);
        throw new Error(error.response.data?.message || 'Failed to start practice');
      } else {
        console.error('❌ startPractice error:', error);
        throw new Error(error.message || 'Failed to start practice');
      }
    }
  },

  async submitPractice(practiceId: string, submission: SubmitPracticeRequest): Promise<PracticeAttempt> {
    try {
      console.log(`🔍 Submitting practice ${practiceId}...`);
      const response = await apiClient.post<any>(API_ENDPOINTS.PRACTICES.SUBMIT(practiceId), submission);
      console.log('✅ submitPractice API Response:', response);
      return response.data || response;
    } catch (error: any) {
      console.error('❌ submitPractice error:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit practice');
    }
  },

  async getMyAttempts(page = 1, limit = 10, skill?: PracticeSkill, level?: PracticeLevel): Promise<{ attempts: PracticeAttempt[]; pagination: any }> {
    try {
      console.log('🔍 Getting my practice attempts...');
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      if (skill) queryParams.append('skill', skill);
      if (level) queryParams.append('level', level);

      const response = await apiClient.get<any>(`${API_ENDPOINTS.PRACTICES.MY_ATTEMPTS}?${queryParams}`);
      console.log('✅ getMyAttempts API Response:', response);
      
      return {
        attempts: response.data?.attempts || response.data || response || [],
        pagination: response.data?.pagination || { page, limit, total: 0 }
      };
    } catch (error: any) {
      console.error('❌ getMyAttempts error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get practice attempts');
    }
  },

  async getPracticeAttempts(practiceId: string, page = 1, limit = 10): Promise<{ attempts: PracticeAttempt[]; pagination: any }> {
    try {
      console.log(`🔍 Getting attempts for practice ${practiceId}...`);
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      const response = await apiClient.get<any>(`${API_ENDPOINTS.PRACTICES.ATTEMPTS(practiceId)}?${queryParams}`);
      console.log('✅ getPracticeAttempts API Response:', response);
      
      return {
        attempts: response.data?.attempts || response.data || response || [],
        pagination: response.data?.pagination || { page, limit, total: 0 }
      };
    } catch (error: any) {
      console.error('❌ getPracticeAttempts error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get practice attempts');
    }
  },

  async getMyStats(): Promise<PracticeStats> {
    try {
      console.log('🔍 Getting my practice stats...');
      const response = await apiClient.get<any>(API_ENDPOINTS.PRACTICES.STATS);
      console.log('✅ getMyStats API Response:', response);
      return response.data || response;
    } catch (error: any) {
      console.error('❌ getMyStats error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get practice statistics');
    }
  },

  async getPracticeAnswers(attemptId: string): Promise<PracticeAnswer[]> {
    try {
      console.log(`🔍 Getting answers for attempt ${attemptId}...`);
      const response = await apiClient.get<any>(`${API_ENDPOINTS.PRACTICES.BASE}/attempts/${attemptId}/answers`);
      console.log('✅ getPracticeAnswers API Response:', response);
      return response.data || response || [];
    } catch (error: any) {
      console.error('❌ getPracticeAnswers error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get practice answers');
    }
  },
};
