import { createContext, useState, useContext } from 'react';

// contexto de autenticacion global, evita pasar props entre componentes
const AuthContext = createContext();

export function AuthProvider({ children }) {

    // recuperamos usuario del localStorage si habia sesion guardada
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

// hook para usar el contexto sin importar useContext cada vez
export function useAuth() {
    return useContext(AuthContext);
}