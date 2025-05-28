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
      return await apiClient.get<Lesson[]>(API_ENDPOINTS.LESSONS.BY_COURSE(courseId));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
    }
  },

  async getLessonById(id: string): Promise<Lesson> {
    try {
      return await apiClient.get<Lesson>(API_ENDPOINTS.LESSONS.BY_ID(id));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lesson');
    }
  },

  async createLesson(courseId: string, lessonData: CreateLessonRequest): Promise<Lesson> {
    try {
      return await apiClient.post<Lesson>(
        API_ENDPOINTS.LESSONS.BY_COURSE(courseId),
        lessonData
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create lesson');
    }
  },

  async updateLesson(id: string, lessonData: UpdateLessonRequest): Promise<Lesson> {
    try {
      return await apiClient.patch<Lesson>(API_ENDPOINTS.LESSONS.BY_ID(id), lessonData);
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
