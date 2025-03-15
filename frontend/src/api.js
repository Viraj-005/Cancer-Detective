import axios from 'axios';
import { ACCESS_TOKEN, GOOGLE_ACCESS_TOKEN } from './token';

// Update the baseURL to point to your backend server
const apiUrl = "http://localhost:8000"; // Backend URL

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add access token if available
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Add Google access token if available
        const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
        if (googleAccessToken) {
            config.headers["X-Google-Access-Token"] = googleAccessToken;
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Handle token refresh or redirect to login
                window.location.href = '/login';
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;