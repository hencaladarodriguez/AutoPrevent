import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminLogin() {

    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate                = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const res = await api.post('/admin/login', { email, password });
            // guardamos el token de admin por separado al del usuario
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('admin', JSON.stringify(res.data.admin));
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Credenciales incorrectas');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center min-vh-100">
            <div className="login-card card shadow p-4">

                <div className="text-center mb-4">
                    <h2 className="fw-bold">Panel Admin</h2>
                    <p className="text-muted">AutoPrevent — Acceso restringido</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                )}

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
                        className="btn btn-danger w-100 fw-semibold"
                        disabled={cargando}
                    >
                        {cargando ? 'Accediendo...' : 'Acceder al panel'}
                    </button>
                </form>
            </div>
        </div>
    );
}