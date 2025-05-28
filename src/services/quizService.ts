import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { Quiz, CreateQuizRequest, SubmitQuizRequest, QuizSubmission } from '../types/api';

export const quizService = {
  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      return await apiClient.get<Quiz[]>(API_ENDPOINTS.QUIZZES.BASE);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  },

  async getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    try {
      return await apiClient.get<Quiz[]>(API_ENDPOINTS.QUIZZES.BY_COURSE(courseId));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course quizzes');
    }
  },

  async getQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
    try {
      return await apiClient.get<Quiz[]>(API_ENDPOINTS.QUIZZES.BY_LESSON(lessonId));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lesson quizzes');
    }
  },

  async createQuiz(quizData: CreateQuizRequest): Promise<Quiz> {
    try {
      return await apiClient.post<Quiz>(API_ENDPOINTS.QUIZZES.BASE, quizData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create quiz');
    }
  },

  async submitQuiz(quizId: string, answers: SubmitQuizRequest): Promise<QuizSubmission> {
    try {
      return await apiClient.post<QuizSubmission>(
        API_ENDPOINTS.QUIZZES.SUBMIT(quizId),
        answers
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit quiz');
    }
  },
};
