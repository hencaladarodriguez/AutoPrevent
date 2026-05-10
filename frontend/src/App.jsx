import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Garage from './components/Garage/Garage';
import History from './components/History/History';
import Diagnostic from './components/Diagnostic/Diagnostic';

// bloquea las rutas si no hay sesion iniciada
function RutaPrivada({ children }) {
    const { usuario } = useAuth();
    if (!usuario) {
        return <Navigate to="/login" />;
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