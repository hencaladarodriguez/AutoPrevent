import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Register() {

    const [form, setForm]         = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        confirmar: ''
    });
    const [error, setError]       = useState('');
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate  = useNavigate();

    // actualiza el campo correspondiente del form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // comprobamos que las contraseñas coinciden antes de enviar
        if (form.password !== form.confirmar) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setCargando(true);

        try {
            const res = await api.post('/auth/register', {
                nombre:    form.nombre,
                apellidos: form.apellidos,
                email:     form.email,
                password:  form.password
            });
            // si el registro va bien iniciamos sesion directamente
            login(res.data.token, res.data.usuario);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrarse');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center min-vh-100">
            <div className="register-card card shadow p-4">

                {/* cabecera */}
                <div className="text-center mb-4">
                    <span className="login-icon">🚗</span>
                    <h2 className="mt-2 fw-bold">AutoPrevent</h2>
                    <p className="text-muted">Crea tu cuenta</p>
                </div>

                {/* mensaje de error */}
                {error && (
                    <div className="alert alert-danger py-2" role="alert">
                        {error}
                    </div>
                )}

                {/* formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                className="form-control"
                                placeholder="Hugo"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Apellidos</label>
                            <input
                                type="text"
                                name="apellidos"
                                className="form-control"
                                placeholder="Encalada Rodriguez"
                                value={form.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="tu@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Confirmar contraseña</label>
                        <input
                            type="password"
                            name="confirmar"
                            className="form-control"
                            placeholder="••••••••"
                            value={form.confirmar}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-semibold"
                        disabled={cargando}
                    >
                        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                {/* enlace al login */}
                <p className="text-center mt-3 mb-0 text-muted">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-primary fw-semibold">
                        Inicia sesión
                    </Link>
                </p>

            </div>
        </div>
    );
}