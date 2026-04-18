import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const interactionService = {
    getInteractions: () => api.get('/interactions'),
    logInteraction: (data) => api.post('/interactions', data),
    updateInteraction: (id, data) => api.put(`/interactions/${id}`, data),
    aiChat: (message) => api.post('/ai/chat', { message }),
};

export default api;
