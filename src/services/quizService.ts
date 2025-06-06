import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { Quiz, CreateQuizRequest, SubmitQuizRequest, QuizSubmission } from '../types/api';

export const quizService = {  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.QUIZZES.BASE);
      return response.data?.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  },async getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.QUIZZES.BY_COURSE(courseId));
      // Backend wraps data in ApiSuccessResponse, so we need to extract the data
      return response.data?.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course quizzes');
    }
  },
  async getQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.QUIZZES.BY_LESSON(lessonId));
      return response.data?.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lesson quizzes');
    }
  },
  async createQuiz(quizData: CreateQuizRequest): Promise<Quiz> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.QUIZZES.BASE, quizData);
      return response.data?.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create quiz');
    }
  },  async submitQuiz(quizId: string, answers: SubmitQuizRequest): Promise<QuizSubmission> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.QUIZZES.SUBMIT(quizId),
        answers
      );
      return response.data?.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit quiz');
    }
  },
};
