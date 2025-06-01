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
      console.log('🔍 Calling getUpcomingSessions API (public)...');
      const response = await apiClient.get<any>(API_ENDPOINTS.SCHEDULE.UPCOMING);
      console.log('✅ getUpcomingSessions API Response:', response);
      
      const sessions = response.data?.data || [];
      console.log('📅 Upcoming sessions data:', sessions);
      return sessions;
    } catch (error: any) {
      console.error('❌ getUpcomingSessions error:', error);
      // For public access, return empty array if API fails
      console.log('🔄 Returning empty array for public access');
      return [];
    }
  },

  // Get currently active sessions (public access)
  async getActiveSessions(): Promise<ClassSession[]> {
    try {
      console.log('🔍 Calling getActiveSessions API (public)...');
      const response = await apiClient.get<any>(API_ENDPOINTS.SCHEDULE.ACTIVE);
      console.log('✅ getActiveSessions API Response:', response);
      
      const sessions = response.data?.data || [];
      console.log('📅 Active sessions data:', sessions);
      return sessions;
    } catch (error: any) {
      console.error('❌ getActiveSessions error:', error);
      // For public access, return empty array if API fails
      console.log('🔄 Returning empty array for public access');
      return [];
    }
  },

  // Get today's schedule (public access)
  async getTodaySchedule(): Promise<ScheduleDay> {
    try {
      console.log('🔍 Calling getTodaySchedule API (public)...');
      const response = await apiClient.get<any>(API_ENDPOINTS.SCHEDULE.TODAY);
      console.log('✅ getTodaySchedule API Response:', response);
      
      const schedule = response.data?.data || { date: new Date().toISOString().split('T')[0], sessions: [] };
      console.log('📅 Today schedule data:', schedule);
      return schedule;
    } catch (error: any) {
      console.error('❌ getTodaySchedule error:', error);
      // For public access, return empty schedule if API fails
      console.log('🔄 Returning empty schedule for public access');
      return { date: new Date().toISOString().split('T')[0], sessions: [] };
    }
  },

  // Get weekly schedule (public access)
  async getWeeklySchedule(weekStart?: string): Promise<WeeklySchedule> {
    try {
      console.log('🔍 Calling getWeeklySchedule API (public)...');
      const url = weekStart 
        ? `${API_ENDPOINTS.SCHEDULE.WEEKLY}?weekStart=${weekStart}`
        : API_ENDPOINTS.SCHEDULE.WEEKLY;
      const response = await apiClient.get<any>(url);
      console.log('✅ getWeeklySchedule API Response:', response);
      
      const schedule = response.data?.data || { 
        weekStart: new Date().toISOString().split('T')[0], 
        weekEnd: new Date().toISOString().split('T')[0], 
        days: [] 
      };
      console.log('📅 Weekly schedule data:', schedule);
      return schedule;
    } catch (error: any) {
      console.error('❌ getWeeklySchedule error:', error);
      // For public access, return empty schedule if API fails
      console.log('🔄 Returning empty schedule for public access');
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
      console.log(`🔍 Joining session ${sessionId}...`);
      const response = await apiClient.post<any>(`${API_ENDPOINTS.SCHEDULE.BASE}/${sessionId}/join`);
      console.log('✅ Join session response:', response);
      
      return response.data?.data || {};
    } catch (error: any) {
      console.error('❌ Join session error:', error);
      throw new Error(error.response?.data?.message || 'Failed to join session');
    }
  },

  // Enroll in a course from schedule (requires authentication)
  async enrollInCourseFromSchedule(courseId: string): Promise<void> {
    try {
      console.log(`🔍 Enrolling in course ${courseId} from schedule...`);
      const response = await apiClient.post<any>(`/courses/${courseId}/enroll`);
      console.log('✅ Course enrollment response:', response);
    } catch (error: any) {
      console.error('❌ Course enrollment error:', error);
      throw new Error(error.response?.data?.message || 'Failed to enroll in course');
    }
  },
};
