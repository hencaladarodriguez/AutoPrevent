import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar';
import api from '../../services/api';

// lo separo en componente propio para reutilizarlo en cada tarjeta sin repetir lógica
function Semaforo({ estado }) {
    const colores = {
        verde:    '#28a745',
        amarillo: '#ffc107',
        rojo:     '#dc3545'
    };

    const etiquetas = {
        verde:    'Óptimo',
        amarillo: 'Advertencia',
        rojo:     'Crítico'
    };

    return (
        <div className="text-center">
            <div
                className="semaforo-circulo mx-auto"
                style={{ backgroundColor: colores[estado] || '#6c757d' }}
            />
            <span
                className="badge mt-2"
                style={{ backgroundColor: colores[estado] || '#6c757d' }}
            >
                {etiquetas[estado] || 'Sin datos'}
            </span>
        </div>
    );
}

// muestra datos del vehiculo + semaforo + avisos activos (solo los que no están en verde)
function TarjetaVehiculo({ vehiculo, semaforo }) {

    const alertas = semaforo?.checks?.filter(c => c.estado !== 'verde') || [];

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card card-vehiculo h-100 shadow-sm">
                <div className="card-header fw-bold d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--ap-dorado)', color: '#1a1a1a' }}>
                    <span className="fw-bold">
                        {vehiculo.nombre_marca} {vehiculo.nombre_modelo}
                    </span>
                    <span className="badge bg-secondary">
                        {vehiculo.anio}
                    </span>
                </div>

                <div className="card-body">
                    <div className="row align-items-center mb-3">
                        <div className="col-6">
                            <p className="mb-1 text-muted small">Matrícula</p>
                            <p className="fw-bold mb-0">{vehiculo.matricula}</p>
                            <p className="mb-1 text-muted small mt-2">Kilometraje</p>
                            <p className="fw-bold mb-0">
                                {vehiculo.kilometraje_actual.toLocaleString()} km
                            </p>
                        </div>
                        <div className="col-6">
                            <Semaforo estado={semaforo?.estado_global} />
                        </div>
                    </div>

                    {/* alertas activas */}
                    {alertas.length > 0 && (
                        <div className="mt-2">
                            <p className="text-muted small mb-1">Avisos activos:</p>
                            {alertas.slice(0, 3).map((check, i) => (
                                <div
                                    key={i}
                                    className={`alert py-1 px-2 mb-1 small badge-${check.estado}`}
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    {check.nombre}: {check.mensaje}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card-footer bg-white border-0">
                    <Link
                        to={`/historial?vehiculo_id=${vehiculo.id}`}
                        className="btn btn-outline-primary btn-sm w-100"
                    >
                        Ver historial
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {

    const { usuario } = useAuth();
    const [vehiculos, setVehiculos]   = useState([]);
    const [semaforos, setSemaforos]   = useState({});
    const [cargando, setCargando]     = useState(true);
    const [error, setError]           = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            // cargamos vehiculos y semaforos en paralelo
            const [resVehiculos, resSemaforos] = await Promise.all([
                api.get('/vehiculos'),
                api.get('/semaforo')
            ]);

            setVehiculos(resVehiculos.data.vehiculos);

            // convertimos el array de semaforos a un objeto indexado por vehiculo_id
            // para acceder facilmente desde cada tarjeta
            const mapaS = {};
            resSemaforos.data.vehiculos.forEach(s => {
                mapaS[s.vehiculo_id] = s.semaforo;
            });
            setSemaforos(mapaS);

        } catch (err) {
            setError('Error al cargar los datos');
        } finally {
            setCargando(false);
        }
    };

    // contamos cuantos vehiculos tienen cada estado
    const contarEstados = () => {
        let verde = 0, amarillo = 0, rojo = 0;
        Object.values(semaforos).forEach(s => {
            if (s.estado_global === 'verde')    verde++;
            if (s.estado_global === 'amarillo') amarillo++;
            if (s.estado_global === 'rojo')     rojo++;
        });
        return { verde, amarillo, rojo };
    };

    const estados = contarEstados();

    return (
        <div>
            <Navbar />

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="fw-bold mb-0">
                            Bienvenido, {usuario?.nombre}
                        </h4>
                        <p className="text-muted mb-0">
                            Aquí tienes el estado de tus vehículos
                        </p>
                    </div>
                    <Link to="/garage" className="btn btn-primary">
                        + Añadir vehículo
                    </Link>
                </div>

                {/* contadores — solo se muestran si hay al menos un vehiculo */}
                {vehiculos.length > 0 && (
                    <div className="row mb-4">
                        <div className="col-4">
                            <div className="card text-center border-0 bg-success bg-opacity-10">
                                <div className="card-body py-2">
                                    <h3 className="fw-bold text-success mb-0">{estados.verde}</h3>
                                    <small className="text-success">Óptimos</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-center border-0 bg-warning bg-opacity-10">
                                <div className="card-body py-2">
                                    <h3 className="fw-bold text-warning mb-0">{estados.amarillo}</h3>
                                    <small className="text-warning">Advertencia</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-center border-0 bg-danger bg-opacity-10">
                                <div className="card-body py-2">
                                    <h3 className="fw-bold text-danger mb-0">{estados.rojo}</h3>
                                    <small className="text-danger">Críticos</small>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {cargando && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="mt-2 text-muted">Cargando vehículos...</p>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                {!cargando && vehiculos.length === 0 && (
                    <div className="text-center py-5">
                        <h5 className="text-muted">No tienes vehículos registrados</h5>
                        <Link to="/garage" className="btn btn-primary mt-2">
                            Añadir mi primer vehículo
                        </Link>
                    </div>
                )}

                <div className="row">
                    {vehiculos.map(vehiculo => (
                        <TarjetaVehiculo
                            key={vehiculo.id}
                            vehiculo={vehiculo}
                            semaforo={semaforos[vehiculo.id]}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}
