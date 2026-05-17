import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Login() {

    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate  = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const res = await api.post('/auth/login', { email, password });
            // guardamos el token y los datos del usuario
            login(res.data.token, res.data.usuario);
            navigate('/dashboard');
        } catch (err) {
            // si el servidor devuelve un error lo mostramos
            setError(err.response?.data?.error || 'Error al iniciar sesion');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center min-vh-100">
            <div className="login-card card shadow p-4">

                {/* cabecera */}
                <div className="text-center mb-4">
                    <h2 className="fw-bold">AutoPrevent</h2>
                    <p className="text-muted">Bienvenido de nuevo</p>
                </div>

                {/* mensaje de error */}
                {error && (
                    <div className="alert alert-danger py-2" role="alert">
                        {error}
                    </div>
                )}

                {/* formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Introduce tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-semibold"
                        disabled={cargando}
                    >
                        {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>

                {/* enlace al registro */}
                <p className="text-center mt-3 mb-0 text-muted">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-primary fw-semibold">
                        Regístrate
                    </Link>
                </p>

                {/* volver a la página principal */}
                <p className="text-center mt-2 mb-0">
                    <Link to="/" className="text-muted small">
                        Volver al inicio
                    </Link>
                </p>

            </div>
        </div>
    );
}