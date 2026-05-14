import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing      from './components/Landing/Landing';
import WWAre        from './components/WWAre/WWAre';
import Login        from './components/Auth/Login';
import Register     from './components/Auth/Register';
import Dashboard    from './components/Dashboard/Dashboard';
import Garage       from './components/Garage/Garage';
import History      from './components/History/History';
import Diagnostic   from './components/Diagnostic/Diagnostic';
import AdminLogin   from './components/Admin/AdminLogin';
import AdminPanel   from './components/Admin/AdminPanel';

// bloquea las rutas si no hay sesion iniciada
function RutaPrivada({ children }) {
    const { usuario } = useAuth();
    if (!usuario) {
        return <Navigate to="/login" />;
    }
    return children;
}

// bloquea rutas de admin
function RutaAdmin({ children }) {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
        return <Navigate to="/admin/login" />;
    }
    return children;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* rutas publicas */}
                    <Route path="/"              element={<Landing />} />
                    <Route path="/quienes-somos" element={<WWAre />} />
                    <Route path="/login"         element={<Login />} />
                    <Route path="/register"      element={<Register />} />
                    <Route path="/admin/login"   element={<AdminLogin />} />

                    {/* rutas privadas de usuario */}
                    <Route path="/dashboard" element={
                        <RutaPrivada><Dashboard /></RutaPrivada>
                    } />
                    <Route path="/garage" element={
                        <RutaPrivada><Garage /></RutaPrivada>
                    } />
                    <Route path="/historial" element={
                        <RutaPrivada><History /></RutaPrivada>
                    } />
                    <Route path="/diagnostico" element={
                        <RutaPrivada><Diagnostic /></RutaPrivada>
                    } />

                    {/* ruta privada de admin */}
                    <Route path="/admin" element={
                        <RutaAdmin><AdminPanel /></RutaAdmin>
                    } />

                    {/* cualquier ruta desconocida va al inicio */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
