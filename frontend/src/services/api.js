import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cupping Notes API
export const cuppingAPI = {
  create: (data) => api.post('/cupping/', data),
  getAll: (params) => api.get('/cupping/', { params }),
  getById: (id) => api.get(`/cupping/${id}`),
  delete: (id) => api.delete(`/cupping/${id}`),
};

// SCA Standards API
export const standardsAPI = {
  getAll: () => api.get('/standards/'),
  getById: (id) => api.get(`/standards/${id}`),
  getByCategory: (category) => api.get(`/standards/category/${category}`),
};

// Mapping API
export const mappingAPI = {
  analyze: (cuppingNoteId) => api.post('/mapping/analyze', { cupping_note_id: cuppingNoteId }),
  getResults: (cuppingNoteId) => api.get(`/mapping/${cuppingNoteId}`),
};

export default api;
