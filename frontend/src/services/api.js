import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
});

// Interceptor para añadir el token automáticamente a CUALQUIER petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Sesión caducada. Redirigiendo al login...");
            localStorage.clear();
            window.location.href = '/login?expirado=true';
        }
        return Promise.reject(error);
    }
);

export default api;