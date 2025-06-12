import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  Lesson,
  CreateLessonRequest,
  UpdateLessonRequest,
} from '../types/api';

export const lessonService = {  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.LESSONS.BY_COURSE(courseId));
      // Backend wraps data in ApiSuccessResponse, so extract from response.data if present
      const lessons = response?.data || response || [];
      return lessons;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
    }
  },

  async getLessonById(id: string): Promise<Lesson> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.LESSONS.BY_ID(id));
      return response?.data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lesson');
    }
  },  async createLesson(courseId: string, lessonData: CreateLessonRequest): Promise<Lesson> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.LESSONS.BY_COURSE(courseId),
        lessonData
      );
      // Return the lesson object from response.data.data if present
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create lesson');
    }
  },

  async updateLesson(id: string, lessonData: UpdateLessonRequest): Promise<Lesson> {
    try {
      const response = await apiClient.patch<any>(API_ENDPOINTS.LESSONS.BY_ID(id), lessonData);
      // Return the lesson object from response.data if present
      return response?.data || response;
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
  async reorderLessons(courseId: string, lessonIds: string[]): Promise<void> {
    try {
      await apiClient.patch(API_ENDPOINTS.LESSONS.REORDER(courseId), { lessonIds });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reorder lessons');
    }
  },
};