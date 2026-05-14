import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar';

export default function Landing() {

    const { usuario } = useAuth();

    return (
        <div className="landing-hero">
            <Navbar />

            <div className="landing-hero-content">
                <h1 className="landing-titulo">AutoPrevent</h1>
                <p className="landing-subtitulo">
                    Diagnóstico y Mantenimiento de tu vehículo
                </p>

                <div className="landing-cta">
                    {usuario ? (
                        // si ya tiene sesion lo mandamos al panel
                        <Link to="/dashboard" className="btn btn-primary btn-lg px-5 fw-semibold">
                            Ir al Panel de Control
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary btn-lg px-5 fw-semibold">
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-lg px-5 fw-semibold"
                                style={{
                                    background: 'transparent',
                                    border: '2px solid #fff',
                                    color: '#fff',
                                }}
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* features rapidas debajo del hero */}
            <div
                className="py-4 px-3"
                style={{ background: 'rgba(0,0,0,0.5)' }}
            >
                <div className="container">
                    <div className="row text-center text-white g-3">
                        <div className="col-md-4">
                            <div className="fw-semibold">Sistema Semáforo</div>
                            <small className="opacity-75">Estado de tu vehículo de un vistazo</small>
                        </div>
                        <div className="col-md-4">
                            <div className="fw-semibold">Historial Técnico</div>
                            <small className="opacity-75">Registra cada intervención</small>
                        </div>
                        <div className="col-md-4">
                            <div className="fw-semibold">Diagnóstico Colaborativo</div>
                            <small className="opacity-75">Comparte y consulta incidencias</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
