import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance } from 'axios';
import { API_BASE_URL } from '../config/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearAuthToken();
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  public clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<any> {
    const response = await this.client.get(url, config);
    return response;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    const response = await this.client.post(url, data, config);
    return response;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    const response = await this.client.put(url, data, config);
    return response;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    const response = await this.client.patch(url, data, config);
    return response;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<any> {
    const response = await this.client.delete(url, config);
    return response;
  }
}

export const apiClient = new ApiClient();
