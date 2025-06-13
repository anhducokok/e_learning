import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  ClassSession,
  ScheduleDay,
  WeeklySchedule,
} from '../types/api';

export const scheduleService = {
  // Get all upcoming sessions (public access)
  async getUpcomingSessions(): Promise<ClassSession[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.SCHEDULE.UPCOMING);
      const sessions = response.data?.data || [];
      return sessions;
    } catch (error: any) {
      // For public access, return empty array if API fails
      return [];
    }
  },

  // Get currently active sessions (public access)
  async getActiveSessions(): Promise<ClassSession[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.SCHEDULE.ACTIVE);
      const sessions = response.data?.data || [];
      return sessions;
    } catch (error: any) {
      // For public access, return empty array if API fails
      return [];
    }
  },

  // Get today's schedule (public access)
  async getTodaySchedule(): Promise<ScheduleDay> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.SCHEDULE.TODAY);
      const schedule = response.data?.data || { date: new Date().toISOString().split('T')[0], sessions: [] };
      return schedule;
    } catch (error: any) {
      // For public access, return empty schedule if API fails
      return { date: new Date().toISOString().split('T')[0], sessions: [] };
    }
  },

  // Get weekly schedule (public access)
  async getWeeklySchedule(weekStart?: string): Promise<WeeklySchedule> {
    try {
      const url = weekStart 
        ? `${API_ENDPOINTS.SCHEDULE.WEEKLY}?weekStart=${weekStart}`
        : API_ENDPOINTS.SCHEDULE.WEEKLY;
      const response = await apiClient.get<any>(url);
      const schedule = response.data?.data || { 
        weekStart: new Date().toISOString().split('T')[0], 
        weekEnd: new Date().toISOString().split('T')[0], 
        days: [] 
      };
      return schedule;
    } catch (error: any) {
      // For public access, return empty schedule if API fails
      return { 
        weekStart: new Date().toISOString().split('T')[0], 
        weekEnd: new Date().toISOString().split('T')[0], 
        days: [] 
      };
    }
  },

  // Join a class session (requires authentication)
  async joinSession(sessionId: string): Promise<{ meetingLink?: string }> {
    try {
      const response = await apiClient.post<any>(`${API_ENDPOINTS.SCHEDULE.BASE}/${sessionId}/join`);
      return response.data?.data || {};
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to join session');
    }
  },

  // Enroll in a course from schedule (requires authentication)
  async enrollInCourseFromSchedule(courseId: string): Promise<void> {    try {
      // const response = await apiClient.post<any>(`/courses/${courseId}/enroll`); // response unused
      await apiClient.post<any>(`/courses/${courseId}/enroll`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to enroll in course');
    }
  },
};
