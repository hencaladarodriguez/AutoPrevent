import axios from 'axios';

// en local apunta a XAMPP, en Railway se sobreescribe con VITE_API_URL en el panel de variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:81/AutoPrevent/backend';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// añade el token automaticamente en cada peticion
// para no tener que ponerlo a mano cada vez
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

// si el token caduca mandamos al login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;