import { createContext, useState, useContext } from 'react';

// contexto para manejar el login global
// lo uso aqui para no andar pasando props de padre a hijo todo el rato
const AuthContext = createContext();

export function AuthProvider({ children }) {

    // intento recuperar el usuario si ya habia iniciado sesion antes
    const [usuario, setUsuario] = useState(() => {
        try {
            const guardado = localStorage.getItem('usuario');
            return guardado ? JSON.parse(guardado) : null;
        } catch(e) {
            // por si el localStorage esta corrupto o algo raro
            return null;
        }
    });

    const login = (token, datosUsuario) => {
        localStorage.setItem('token', token);
        // guardo el objeto usuario como string
        localStorage.setItem('usuario', JSON.stringify(datosUsuario));
        setUsuario(datosUsuario);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// hook personalizado para no tener que importar useContext
// en cada componente que lo necesite
export function useAuth() {
    return useContext(AuthContext);
}