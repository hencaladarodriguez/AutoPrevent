import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar';
import api from '../../services/api';

// sección de datos personales: nombre, apellidos, fecha de nacimiento
// el email se muestra como campo de solo lectura, no se puede modificar
function SeccionDatosPersonales({ usuario, onActualizado }) {

    const [form, setForm]         = useState({
        nombre:          '',
        apellidos:       '',
        fecha_nacimiento: ''
    });
    const [cargando, setCargando] = useState(false);
    const [error, setError]       = useState('');
    const [exito, setExito]       = useState('');

    useEffect(() => {
        if (usuario) {
            setForm({
                nombre:           usuario.nombre           || '',
                apellidos:        usuario.apellidos        || '',
                fecha_nacimiento: usuario.fecha_nacimiento || ''
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // calcula edad exacta en años a partir de una fecha
    const calcularEdad = (fechaStr) => {
        const hoy       = new Date();
        const nacimiento = new Date(fechaStr + 'T12:00:00');
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mDiff = hoy.getMonth() - nacimiento.getMonth();
        if (mDiff < 0 || (mDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        // validación de edad en cliente antes de enviar
        if (form.fecha_nacimiento) {
            const edad = calcularEdad(form.fecha_nacimiento);
            if (edad < 16) {
                setError('Debes tener al menos 16 años para registrar una fecha de nacimiento');
                return;
            }
            if (edad > 115) {
                setError('La fecha de nacimiento no es válida (máxima edad: 115 años)');
                return;
            }
        }

        setCargando(true);

        try {
            const res = await api.put('/perfil', form);
            setExito('Perfil actualizado correctamente');
            onActualizado(res.data.usuario);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar el perfil');
        } finally {
            setCargando(false);
        }
    };

    // límites del input: mín = hoy − 115 años, máx = hoy − 16 años
    const maxFechaNac = (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 16);
        return d.toISOString().split('T')[0];
    })();
    const minFechaNac = (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 115);
        return d.toISOString().split('T')[0];
    })();

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header fw-bold" style={{ backgroundColor: 'var(--ap-dorado)', color: '#1a1a1a' }}>
                Datos personales
            </div>
            <div className="card-body">

                {error && <div className="alert alert-danger py-2">{error}</div>}
                {exito && <div className="alert alert-success py-2">{exito}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row">

                        {/* nombre */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                className="form-control"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* apellidos */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Apellidos</label>
                            <input
                                type="text"
                                name="apellidos"
                                className="form-control"
                                value={form.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* fecha de nacimiento */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                Fecha de nacimiento
                                <span className="text-muted fw-normal"> (opcional)</span>
                            </label>
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                className="form-control"
                                value={form.fecha_nacimiento}
                                onChange={handleChange}
                                min={minFechaNac}
                                max={maxFechaNac}
                            />
                            <div className="form-text text-muted">
                                Debes tener entre 16 y 115 años
                            </div>
                        </div>

                        {/* email — solo lectura, no se puede cambiar */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                Correo electrónico
                                <span className="text-muted fw-normal small ms-2">
                                    (no editable)
                                </span>
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                value={usuario?.email || ''}
                                readOnly
                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                            />
                            <div className="form-text text-muted">
                                El correo electrónico no puede modificarse tras el registro.
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={cargando}
                    >
                        {cargando ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// sección de cambio de contraseña
function SeccionCambiarContrasena() {

    const [form, setForm]         = useState({
        password_actual: '',
        password_nuevo:  '',
        password_repetir: ''
    });
    const [cargando, setCargando] = useState(false);
    const [error, setError]       = useState('');
    const [exito, setExito]       = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        if (form.password_nuevo !== form.password_repetir) {
            setError('Las contraseñas nuevas no coinciden');
            return;
        }

        if (form.password_nuevo.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        setCargando(true);

        try {
            await api.put('/perfil/password', {
                password_actual: form.password_actual,
                password_nuevo:  form.password_nuevo
            });
            setExito('Contraseña actualizada correctamente');
            setForm({ password_actual: '', password_nuevo: '', password_repetir: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cambiar la contraseña');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header fw-bold" style={{ backgroundColor: 'var(--ap-dorado)', color: '#1a1a1a' }}>
                Cambiar contraseña
            </div>
            <div className="card-body">

                {error && <div className="alert alert-danger py-2">{error}</div>}
                {exito && <div className="alert alert-success py-2">{exito}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row">

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">Contraseña actual</label>
                            <input
                                type="password"
                                name="password_actual"
                                className="form-control"
                                value={form.password_actual}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">Nueva contraseña</label>
                            <input
                                type="password"
                                name="password_nuevo"
                                className="form-control"
                                value={form.password_nuevo}
                                onChange={handleChange}
                                minLength={6}
                                required
                            />
                            <div className="form-text text-muted">Mínimo 6 caracteres</div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">Repetir nueva contraseña</label>
                            <input
                                type="password"
                                name="password_repetir"
                                className="form-control"
                                value={form.password_repetir}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={cargando}
                    >
                        {cargando ? 'Actualizando...' : 'Cambiar contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// sección de eliminación de cuenta — requiere confirmar contraseña
function SeccionEliminarCuenta({ onCuentaEliminada }) {

    const [confirmando, setConfirmando] = useState(false);
    const [password, setPassword]       = useState('');
    const [cargando, setCargando]       = useState(false);
    const [error, setError]             = useState('');

    const handleEliminar = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            await api.delete('/perfil', { data: { password } });
            onCuentaEliminada();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar la cuenta');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="card border-danger shadow-sm mb-4">
            <div className="card-header fw-bold text-white bg-danger">
                Zona de peligro — Eliminar cuenta
            </div>
            <div className="card-body">
                <p className="text-muted mb-3">
                    Al eliminar tu cuenta se desactivará el acceso. Tus vehículos e historial
                    quedarán desactivados. Esta acción no se puede deshacer.
                </p>

                {!confirmando ? (
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => setConfirmando(true)}
                    >
                        Quiero eliminar mi cuenta
                    </button>
                ) : (
                    <form onSubmit={handleEliminar}>
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        <p className="fw-semibold text-danger mb-2">
                            Confirma tu contraseña para continuar:
                        </p>
                        <div className="d-flex gap-2 align-items-start">
                            <div>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Tu contraseña actual"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-danger"
                                disabled={cargando}
                            >
                                {cargando ? 'Eliminando...' : 'Confirmar eliminación'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => { setConfirmando(false); setPassword(''); setError(''); }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function Profile() {

    const { usuario, updateUsuario, logout } = useAuth();
    const navigate                           = useNavigate();
    const [perfilCompleto, setPerfilCompleto] = useState(null);
    const [cargando, setCargando]            = useState(true);

    // cargamos el perfil completo desde la API para tener fecha_nacimiento y fecha_registro
    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const res = await api.get('/perfil');
                setPerfilCompleto(res.data.usuario);
            } catch (err) {
                // si falla usamos los datos del contexto
                setPerfilCompleto(usuario);
            } finally {
                setCargando(false);
            }
        };
        cargarPerfil();
    }, []);

    const handleActualizado = (datosActualizados) => {
        setPerfilCompleto(prev => ({ ...prev, ...datosActualizados }));
        // refrescamos el contexto para que el navbar muestre el nombre actualizado
        updateUsuario(datosActualizados);
    };

    const handleCuentaEliminada = () => {
        logout();
        navigate('/');
    };

    if (cargando) {
        return (
            <div>
                <Navbar />
                <div className="container mt-4 text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2 text-muted">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <div className="container mt-4" style={{ maxWidth: '800px' }}>

                <div className="mb-4">
                    <h4 className="fw-bold mb-0">Mi Perfil</h4>
                    <p className="text-muted mb-0">Gestiona tus datos personales y la seguridad de tu cuenta</p>
                    {perfilCompleto?.fecha_registro && (
                        <p className="text-muted small mb-0">
                            Miembro desde{' '}
                            {new Date(perfilCompleto.fecha_registro).toLocaleDateString('es-ES', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    )}
                </div>

                <SeccionDatosPersonales
                    usuario={perfilCompleto}
                    onActualizado={handleActualizado}
                />

                <SeccionCambiarContrasena />

                <SeccionEliminarCuenta onCuentaEliminada={handleCuentaEliminada} />

            </div>
        </div>
    );
}
