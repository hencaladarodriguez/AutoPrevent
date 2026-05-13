import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Garage from './components/Garage/Garage';
import History from './components/History/History';
import Diagnostic from './components/Diagnostic/Diagnostic';
import AdminLogin from './components/Admin/AdminLogin';
import AdminPanel from './components/Admin/AdminPanel';

// bloquea las rutas si no hay sesion iniciada
function RutaPrivada({ children }) {
    const { usuario } = useAuth();
    if (!usuario) {
        return <Navigate to="/login" />;
    }
    return children;
}

// componente que bloquea rutas de admin
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
                    <Route path="/login"    element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/login" element={<AdminLogin />} />

                    <Route path="/admin" element={
                        <RutaAdmin>
                            <AdminPanel />
                        </RutaAdmin>
                    } />

                    <Route path="/" element={
                        <RutaPrivada>
                            <Dashboard />
                        </RutaPrivada>
                    } />

                    <Route path="/garage" element={
                        <RutaPrivada>
                            <Garage />
                        </RutaPrivada>
                    } />

                    <Route path="/historial" element={
                        <RutaPrivada>
                            <History />
                        </RutaPrivada>
                    } />

                    <Route path="/diagnostico" element={
                        <RutaPrivada>
                            <Diagnostic />
                        </RutaPrivada>
                    } />

                    {/* si la ruta no existe mandamos al inicio */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;