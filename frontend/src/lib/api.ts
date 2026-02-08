import axios from 'axios';
import { IncidentFilters } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
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
    apiInstance.post('/auth/register', { email, password, role }),
  login: (email: string, password: string) =>
    apiInstance.post('/auth/login', { email, password }),
  getMe: () => apiInstance.get('/auth/me'),
};

// Services API
export const servicesAPI = {
  getAll: () => apiInstance.get('/services'),
  getById: (id: string) => apiInstance.get(`/services/${id}`),
  create: (data: { name: string; description?: string; status?: string }) =>
    apiInstance.post('/services', data),
  update: (id: string, data: Partial<{ name: string; description: string; status: string }>) =>
    apiInstance.patch(`/services/${id}`, data),
  updateStatus: (id: string, status: string) =>
    apiInstance.patch(`/services/${id}/status`, { status }),
  delete: (id: string) => apiInstance.delete(`/services/${id}`),
};

// Incidents API
export const incidentsAPI = {
  getAll: (filters?: IncidentFilters) =>
    apiInstance.get('/incidents', { params: filters }),
  getById: (id: string) => apiInstance.get(`/incidents/${id}`),
  create: (data: {
    title: string;
    description: string;
    severity?: string;
    isPublic?: boolean;
    serviceId?: string;
  }) => apiInstance.post('/incidents', data),
  update: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      severity: string;
      isPublic: boolean;
      serviceId: string;
    }>
  ) => apiInstance.patch(`/incidents/${id}`, data),
  resolve: (id: string, rootCauseSummary?: string) =>
    apiInstance.patch(`/incidents/${id}/resolve`, { rootCauseSummary }),
  publish: (id: string, isPublic: boolean) =>
    apiInstance.patch(`/incidents/${id}/publish`, { isPublic }),
  addUpdate: (id: string, content: string) =>
    apiInstance.post(`/incidents/${id}/updates`, { content }),
  getUpdates: (id: string) => apiInstance.get(`/incidents/${id}/updates`),
  delete: (id: string) => apiInstance.delete(`/incidents/${id}`),
};

// Updates API
export const updatesAPI = {
  getByIncident: (incidentId: string) =>
    apiInstance.get(`/updates/incident/${incidentId}`),
  create: (data: { incidentId: string; content: string }) =>
    apiInstance.post('/updates', data),
  delete: (id: string) => apiInstance.delete(`/updates/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => apiInstance.get('/users'),
  updateRole: (id: string, role: string) =>
    apiInstance.patch(`/users/${id}/role`, { role }),
  delete: (id: string) => apiInstance.delete(`/users/${id}`),
};

// Public API (no auth required)
export const publicAPI = {
  getServices: () =>
    axios.get(`${API_BASE_URL.replace('/api', '')}/public/services`),
  getIncidents: () =>
    axios.get(`${API_BASE_URL.replace('/api', '')}/public/incidents`),
};

// Audit Logs API
export const auditLogsAPI = {
  getAll: (params?: {
    entityType?: string;
    entityId?: string;
    limit?: number;
  }) => apiInstance.get('/audit-logs', { params }),
};

// Export a unified API object
export default {
  // Auth
  login: async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    return res.data;
  },
  register: async (email: string, password: string, role?: string) => {
    const res = await authAPI.register(email, password, role);
    return res.data;
  },
  getMe: async () => {
    const res = await authAPI.getMe();
    return res.data;
  },

  // Services
  getServices: async () => {
    const res = await servicesAPI.getAll();
    return res.data;
  },
  getServiceById: async (id: string) => {
    const res = await servicesAPI.getById(id);
    return res.data;
  },
  createService: async (data: {
    name: string;
    description?: string;
    status?: string;
  }) => {
    const res = await servicesAPI.create(data);
    return res.data;
  },
  updateService: async (
    id: string,
    data: Partial<{ name: string; description: string; status: string }>
  ) => {
    const res = await servicesAPI.update(id, data);
    return res.data;
  },
  updateServiceStatus: async (id: string, status: string) => {
    const res = await servicesAPI.updateStatus(id, status);
    return res.data;
  },
  deleteService: async (id: string) => {
    const res = await servicesAPI.delete(id);
    return res.data;
  },

  // Incidents
  getIncidents: async (filters?: IncidentFilters) => {
    const res = await incidentsAPI.getAll(filters);
    return res.data;
  },
  getIncidentById: async (id: string) => {
    const res = await incidentsAPI.getById(id);
    return res.data;
  },
  createIncident: async (data: {
    title: string;
    description: string;
    severity?: string;
    isPublic?: boolean;
    serviceId?: string;
  }) => {
    const res = await incidentsAPI.create(data);
    return res.data;
  },
  updateIncident: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      severity: string;
      isPublic: boolean;
      serviceId: string;
    }>
  ) => {
    const res = await incidentsAPI.update(id, data);
    return res.data;
  },
  resolveIncident: async (id: string, rootCauseSummary?: string) => {
    const res = await incidentsAPI.resolve(id, rootCauseSummary);
    return res.data;
  },
  publishIncident: async (id: string, isPublic: boolean) => {
    const res = await incidentsAPI.publish(id, isPublic);
    return res.data;
  },
  addIncidentUpdate: async (id: string, content: string) => {
    const res = await incidentsAPI.addUpdate(id, content);
    return res.data;
  },
  getIncidentUpdates: async (id: string) => {
    const res = await incidentsAPI.getUpdates(id);
    return res.data;
  },
  deleteIncident: async (id: string) => {
    const res = await incidentsAPI.delete(id);
    return res.data;
  },

  // Updates
  getUpdatesByIncident: async (incidentId: string) => {
    const res = await updatesAPI.getByIncident(incidentId);
    return res.data;
  },
  createUpdate: async (data: { incidentId: string; content: string }) => {
    const res = await updatesAPI.create(data);
    return res.data;
  },
  deleteUpdate: async (id: string) => {
    const res = await updatesAPI.delete(id);
    return res.data;
  },

  // Users
  getUsers: async () => {
    const res = await usersAPI.getAll();
    return res.data;
  },
  updateUserRole: async (id: string, role: string) => {
    const res = await usersAPI.updateRole(id, role);
    return res.data;
  },
  deleteUser: async (id: string) => {
    const res = await usersAPI.delete(id);
    return res.data;
  },

  // Public
  getPublicServices: async () => {
    const res = await publicAPI.getServices();
    return res.data;
  },
  getPublicIncidents: async () => {
    const res = await publicAPI.getIncidents();
    return res.data;
  },

  // Audit Logs
  getAuditLogs: async (params?: {
    entityType?: string;
    entityId?: string;
    limit?: number;
  }) => {
    const res = await auditLogsAPI.getAll(params);
    return res.data;
  },
};
