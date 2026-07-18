import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  logout: () => api.post('/api/auth/logout'),
  register: (userData) => api.post('/api/auth/register', userData)
};

export const employeeAPI = {
  getEmployees: (params) => api.get('/api/employees', { params }),
  getEmployee: (id) => api.get(`/api/employees/${id}`),
  createEmployee: (data) => api.post('/api/employees', data),
  updateEmployee: (id, data) => api.put(`/api/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/api/employees/${id}`),
  updateManager: (id, managerId) => api.patch(`/api/employees/${id}/manager`, { managerId }),
  getReportees: (id) => api.get(`/api/employees/${id}/reportees`)
};

export const organizationAPI = {
  getTree: () => api.get('/api/organization/tree'),
  getStats: () => api.get('/api/organization/stats')
};

export default api;
