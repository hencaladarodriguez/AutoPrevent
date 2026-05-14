import Navbar from '../Navbar';

export default function WWAre() {
    return (
        <div>
            <Navbar />

            {/* cabecera dorada */}
            <div className="qs-hero text-center">
                <div className="container">
                    <h1 className="display-5 fw-bold mb-3">¿Quiénes somos?</h1>
                    <p className="lead mb-0" style={{ maxWidth: 600, margin: '0 auto' }}>
                        AutoPrevent nació para transformar la forma en que los conductores
                        gestionan el mantenimiento de sus vehículos.
                    </p>
                </div>
            </div>

            {/* descripcion del proyecto */}
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm p-4 mb-4">
                            <h3 className="fw-bold mb-3">El proyecto</h3>
                            <p>
                                <strong>AutoPrevent</strong> es una plataforma web desarrollada como
                                Trabajo de Fin de Grado que permite digitalizar el historial técnico
                                de vehículos y conocer el estado real de su mantenimiento en tiempo real.
                            </p>
                            <p className="mb-0">
                                El objetivo es pasar de un mantenimiento <em>reactivo</em> — actuar
                                cuando algo falla — a uno <em>preventivo</em>, anticipándose a los
                                problemas antes de que ocurran.
                            </p>
                        </div>

                        {/* features en cards pequeñas */}
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <div className="card h-100 p-3 text-center">
                                    <div className="qs-feature-icon">🚦</div>
                                    <h5 className="fw-bold">Sistema Semáforo</h5>
                                    <p className="text-muted small mb-0">
                                        Verde, amarillo y rojo según el estado real de tus
                                        revisiones e ITV.
                                    </p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card h-100 p-3 text-center">
                                    <div className="qs-feature-icon">📋</div>
                                    <h5 className="fw-bold">Historial técnico</h5>
                                    <p className="text-muted small mb-0">
                                        Registra cada cambio de aceite, filtros, frenos y más
                                        en un timeline ordenado.
                                    </p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card h-100 p-3 text-center">
                                    <div className="qs-feature-icon">👥</div>
                                    <h5 className="fw-bold">Diagnóstico colaborativo</h5>
                                    <p className="text-muted small mb-0">
                                        Consulta fallos conocidos de tu modelo y comparte
                                        incidencias con otros usuarios.
                                    </p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card h-100 p-3 text-center">
                                    <div className="qs-feature-icon">🏠</div>
                                    <h5 className="fw-bold">Garaje virtual</h5>
                                    <p className="text-muted small mb-0">
                                        Gestiona todos tus vehículos desde un único lugar,
                                        con toda su información centralizada.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* autor */}
                        <div className="card mt-4 p-4 text-center">
                            <p className="text-muted small mb-1">Desarrollado por</p>
                            <h5 className="fw-bold mb-0">Hugo Israel Encalada Rodríguez</h5>
                            <p className="text-muted small mt-1 mb-0">TFG — 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
