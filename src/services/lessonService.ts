import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  Lesson,
  CreateLessonRequest,
  UpdateLessonRequest,
} from '../types/api';

export const lessonService = {
  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.LESSONS.BY_COURSE(courseId));
      console.log('[lessonService] Raw API response for lessons:', response);
      // Use response.data directly, not response.data.data
      const lessons = response.data || [];
      console.log('[lessonService] Extracted lessons:', lessons, 'Type:', typeof lessons, 'Is Array:', Array.isArray(lessons));
      return lessons;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
    }
  },

  async getLessonById(id: string): Promise<Lesson> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.LESSONS.BY_ID(id));
      return response.data?.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lesson');
    }
  },async createLesson(courseId: string, lessonData: CreateLessonRequest): Promise<Lesson> {


    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.LESSONS.BY_COURSE(courseId),
        lessonData
      );
      // Backend wraps data in ApiSuccessResponse, so we need to extract the data
      return response.data?.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create lesson');
    }
  },

  async updateLesson(id: string, lessonData: UpdateLessonRequest): Promise<Lesson> {
    try {
      const response = await apiClient.patch<any>(API_ENDPOINTS.LESSONS.BY_ID(id), lessonData);
      return response.data?.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update lesson');
    }
  },

  async deleteLesson(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.LESSONS.BY_ID(id));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete lesson');
    }
  },
};