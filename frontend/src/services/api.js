import axios from 'axios';

// URL del backend, si hay variable de entorno la usamos sino tiramos del local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:81/AutoPrevent/backend';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// interceptor para añadir el token en cada peticion sin tener que hacerlo a mano
// las rutas /admin/* gestionan su propio token (adminToken) desde el componente
api.interceptors.request.use(
    (config) => {
        const isAdminRoute = config.url?.startsWith('/admin');
        if (!isAdminRoute) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// si el servidor devuelve 401 en rutas de usuario, limpiamos sesion y redirigimos
// las rutas /admin/* quedan excluidas para que el componente muestre su propio error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAdminRoute = error.config?.url?.startsWith('/admin');
        if (!isAdminRoute && error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;