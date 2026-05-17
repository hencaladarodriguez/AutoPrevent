import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {

    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-ap px-4">
            <Link className="navbar-brand" to="/">
                AutoPrevent
            </Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navMenu"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navMenu">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/" end>Inicio</NavLink>
                    </li>

                    {/* panel de control solo aparece si hay sesion activa */}
                    {usuario && (
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/dashboard">Panel de Control</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/garage">Mi Garaje</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/historial">Historial</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/diagnostico">Incidencias</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/perfil">Mi Perfil</NavLink>
                            </li>
                        </>
                    )}

                    <li className="nav-item">
                        <NavLink className="nav-link" to="/quienes-somos">Quienes somos</NavLink>
                    </li>
                </ul>

                <ul className="navbar-nav ms-auto align-items-center">
                    {usuario ? (
                        <>
                            <li className="nav-item me-3">
                                <span style={{ color: 'var(--ap-oscuro)', fontWeight: 500 }}>
                                    Hola, "{usuario.nombre}"
                                </span>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-sm"
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--ap-oscuro)',
                                        color: 'var(--ap-oscuro)',
                                        borderRadius: '6px',
                                        fontWeight: 500,
                                    }}
                                    onClick={handleLogout}
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item">
                            <Link className="btn-login-nav nav-link" to="/login">
                                Iniciar sesión
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
