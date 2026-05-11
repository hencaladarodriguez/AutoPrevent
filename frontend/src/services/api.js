import axios from 'axios';

// url base del backend
// url al tener en cuenta ya que se debe de cambiar en caso que en el xampp no este bien definida (pendiente de arreglar    )
const API_URL = 'http://localhost:81/AutoPrevent/backend';

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