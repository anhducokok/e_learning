import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/api';

export const authService = {  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      // Extract data from the API response structure
      // The backend wraps data in an ApiSuccessResponse: { success, statusCode, message, data: { access_token, user } }
      const authData = response.data?.data || response.data || response;
      
      console.log('🔐 Auth data structure:', 
        authData.access_token ? 'Token found at root level' : 
        response.data?.data?.access_token ? 'Token found in data.data' : 
        'Token not found');
      
      // Store token and user data
      if (authData.access_token) {
        apiClient.setAuthToken(authData.access_token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(authData.user));
        }
      }
      
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      
      // Extract data from the API response structure
      // The backend wraps data in an ApiSuccessResponse: { success, statusCode, message, data: { access_token, user } }
      const authData = response.data?.data || response.data || response;
      
      console.log('🔐 Register auth data structure:', 
        authData.access_token ? 'Token found at root level' : 
        response.data?.data?.access_token ? 'Token found in data.data' : 
        'Token not found');
      
      // Store token and user data
      if (authData.access_token) {
        apiClient.setAuthToken(authData.access_token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(authData.user));
        }
      }
      
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  logout(): void {
    apiClient.clearAuthToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  },

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user_data');
      return Boolean(token && user);
    }
    return false;
  },
};
