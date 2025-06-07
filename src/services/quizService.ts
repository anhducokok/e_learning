import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { Quiz, CreateQuizRequest, SubmitQuizRequest, QuizSubmission } from '../types/api';

// Additional types for enhanced functionality
export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  timeLimit?: number;
  draftAnswers?: any;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
}

export interface QuizStatistics {
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  questionStatistics: Array<{
    questionId: string;
    correctAnswers: number;
    totalAnswers: number;
    correctPercentage: number;
  }>;
}

export interface SaveDraftRequest {
  answers: Array<{
    questionId: string;
    selectedAnswer: string;
  }>;
}

function mapQuizQuestions(quiz: any): Quiz {
  if (quiz.questions && Array.isArray(quiz.questions)) {
    quiz.questions = quiz.questions.map((q: any) => ({
      ...q,
      options: q.options || q.choices || [], // Map 'choices' to 'options' if needed
    }));
  }
  return quiz;
}

export const quizService = {
  // Basic CRUD operations
  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.QUIZZES.BASE);
      return (response.data?.data || []).map(mapQuizQuestions);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  },

  async getQuizById(id: string): Promise<Quiz> {
    try {
      const response = await apiClient.get<any>(`${API_ENDPOINTS.QUIZZES.BASE}/${id}`);
      return mapQuizQuestions(response.data?.data || response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz');
    }
  },

  async getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.QUIZZES.BY_COURSE(courseId));
      const quizzes = response.data || [];
      return quizzes.map(mapQuizQuestions);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course quizzes');
    }
  },

  async getQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.QUIZZES.BY_LESSON(lessonId));
      return (response.data?.data || []).map(mapQuizQuestions);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lesson quizzes');
    }
  },

  async createQuiz(quizData: CreateQuizRequest): Promise<Quiz> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.QUIZZES.BASE, quizData);
      return mapQuizQuestions(response.data?.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create quiz');
    }
  },

  async updateQuiz(id: string, quizData: Partial<CreateQuizRequest>): Promise<Quiz> {
    try {
      const response = await apiClient.patch<any>(`${API_ENDPOINTS.QUIZZES.BASE}/${id}`, quizData);
      return mapQuizQuestions(response.data?.data || response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update quiz');
    }
  },

  async deleteQuiz(id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.QUIZZES.BASE}/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete quiz');
    }
  },

  // Enhanced quiz functionality
  async startQuizAttempt(quizId: string, reset = false): Promise<QuizAttempt> {
    try {
      const url = reset 
        ? `${API_ENDPOINTS.QUIZZES.BASE}/${quizId}/start?reset=true`
        : `${API_ENDPOINTS.QUIZZES.BASE}/${quizId}/start`;
      const response = await apiClient.post<any>(url);
      return response.data?.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to start quiz attempt');
    }
  },

  async saveDraftAnswers(quizId: string, answers: SaveDraftRequest): Promise<void> {
    try {
      await apiClient.post<any>(`${API_ENDPOINTS.QUIZZES.BASE}/${quizId}/save-draft`, answers);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to save draft answers');
    }
  },

  async getDraftAnswers(quizId: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(`${API_ENDPOINTS.QUIZZES.BASE}/${quizId}/draft`);
      return response.data?.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get draft answers');
    }
  },

  async submitQuiz(quizId: string, answers: SubmitQuizRequest): Promise<QuizSubmission> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.QUIZZES.SUBMIT(quizId),
        answers
      );
      return response.data?.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit quiz');
    }
  },

  async submitQuizFinal(quizId: string, answers: SubmitQuizRequest): Promise<QuizSubmission> {
    try {
      const response = await apiClient.post<any>(
        `${API_ENDPOINTS.QUIZZES.BASE}/${quizId}/submit-final`,
        answers
      );
      return response.data?.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit quiz');
    }
  },

  // Submission and statistics
  async getQuizSubmission(quizId: string): Promise<QuizSubmission> {
    try {
      const response = await apiClient.get<any>(`${API_ENDPOINTS.QUIZZES.BASE}/${quizId}/submission`);
      return response.data?.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get quiz submission');
    }
  },

  async getUserSubmissions(): Promise<QuizSubmission[]> {
    try {
      const response = await apiClient.get<any>(`${API_ENDPOINTS.QUIZZES.BASE}/my-submissions`);
      return response.data?.data || response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user submissions');
    }
  },

  async getQuizStatistics(quizId: string): Promise<QuizStatistics> {
    try {
      const response = await apiClient.get<any>(`${API_ENDPOINTS.QUIZZES.BASE}/${quizId}/statistics`);
      return response.data?.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get quiz statistics');
    }
  },
};