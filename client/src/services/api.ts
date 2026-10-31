import { DashboardOverview, Habit, Goal, AIReport, Profile, User } from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: any[]) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    throw new ApiError(response.status, data.message || 'An unexpected error occurred', data.errors);
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: { email: string; password: string; name: string }) =>
      request<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: () => request<User>('/auth/me'),
  },

  // Profile
  profile: {
    get: () => request<Profile & { name: string; email: string }>('/profile'),
    update: (data: Partial<Profile & { name: string }>) =>
      request<Profile>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Dashboard & Analytics
  dashboard: {
    getOverview: () => request<DashboardOverview>('/dashboard/overview'),
    getTrends: (range: '7d' | '30d' | '90d' = '7d') =>
      request<{ range: string; timeSeries: any[] }>(`/dashboard/trends?range=${range}`),
  },

  // Dimension Modules (All 11 Dimensions)
  dimensions: {
    get: (module: string) => request<{ latest: any; history: any[]; score?: any }>(`/${module}`),
    log: (module: string, data: any) =>
      request<{ record: any; scoreResult?: any }>(`/${module}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Habits
  habits: {
    list: () => request<Habit[]>('/habits'),
    create: (data: { name: string; category: string; targetFrequency?: string; targetTime?: string }) =>
      request<Habit>('/habits', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    toggle: (id: string, date: string, completed: boolean) =>
      request<Habit>(`/habits/${id}/toggle`, {
        method: 'POST',
        body: JSON.stringify({ date, completed }),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/habits/${id}`, {
        method: 'DELETE',
      }),
  },

  // Goals
  goals: {
    list: () => request<Goal[]>('/goals'),
    create: (data: Partial<Goal>) =>
      request<Goal>('/goals', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateProgress: (id: string, currentValue: number, status?: string) =>
      request<Goal>(`/goals/${id}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ currentValue, status }),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/goals/${id}`, {
        method: 'DELETE',
      }),
  },

  // AI Reports
  ai: {
    generate: (reportType: 'HOLISTIC_TWIN' | 'WEEKLY_SUMMARY' | 'MONTHLY_SUMMARY' | 'PREDICTIVE_INSIGHT') =>
      request<AIReport>('/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ reportType }),
      }),
    listReports: () => request<AIReport[]>('/ai/reports'),
  },
};
