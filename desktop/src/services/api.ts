import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'sage_token';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const fetchTodayMeetings = async () => {
    const response = await api.get('/meetings/today');
    return response.data;
};

export const createVIPAlert = async (meetingId: number, vipName: string) => {
    const response = await api.post('/alerts', { meetingId, vipName });
    return response.data;
};

export default api;
