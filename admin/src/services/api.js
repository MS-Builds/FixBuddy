import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/admin' : 'https://fix-buddy.vercel.app/api/admin';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle 401
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
});

// Auth endpoints
export const login = (email, password) => axios.post(`${API_BASE_URL.replace('/admin', '/auth/admin')}/login`, { email, password });

export const getUsers = () => api.get('/users');
export const getCaptains = () => api.get('/captains');
export const deleteUser = (id) => api.delete(`/user/${id}`);
export const verifyCaptain = (id, isVerified) => api.patch(`/captain/${id}/verify`, { isVerified });
export const getServiceRequests = () => api.get('/requests');

export default api;
