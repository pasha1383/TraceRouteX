import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email: string, password: string, role?: string) =>
    api.post('/auth/register', { email, password, role }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id: string) => api.get(`/services/${id}`),
  create: (data: { name: string; description?: string; status?: string }) =>
    api.post('/services', data),
  update: (id: string, data: Partial<{ name: string; description: string; status: string }>) =>
    api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

// Incidents API
export const incidentsAPI = {
  getAll: () => api.get('/incidents'),
  getById: (id: string) => api.get(`/incidents/${id}`),
  create: (data: {
    title: string;
    description: string;
    severity?: string;
    status?: string;
    isPublic?: boolean;
  }) => api.post('/incidents', data),
  update: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      severity: string;
      status: string;
      isPublic: boolean;
    }>
  ) => api.put(`/incidents/${id}`, data),
  delete: (id: string) => api.delete(`/incidents/${id}`),
};

// Updates API
export const updatesAPI = {
  getByIncident: (incidentId: string) => api.get(`/updates/incident/${incidentId}`),
  create: (data: { incidentId: string; content: string }) => api.post('/updates', data),
  delete: (id: string) => api.delete(`/updates/${id}`),
};

// Audit Logs API
export const auditLogsAPI = {
  getAll: (params?: { entityType?: string; entityId?: string; limit?: number }) =>
    api.get('/audit-logs', { params }),
};
