import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {

    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand fw-bold" to="/">
                🚗 AutoPrevent
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
                        <Link className="nav-link" to="/">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/garage">Mi Garaje</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/historial">Historial</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/diagnostico">Diagnóstico</Link>
                    </li>
                </ul>

                <ul className="navbar-nav ms-auto align-items-center">
                    <li className="nav-item me-3">
                        <span className="text-light">
                            👤 {usuario?.nombre}
                        </span>
                    </li>
                    <li className="nav-item">
                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={handleLogout}
                        >
                            Cerrar sesión
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}