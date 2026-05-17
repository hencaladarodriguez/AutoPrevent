import { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import api from '../../services/api';

// tarjeta de fallo conocido — solo lectura, precargada por admin
function TarjetaFalloConocido({ fallo }) {

    const coloresGravedad = {
        leve:     'success',
        moderado: 'warning',
        grave:    'danger'
    };

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{fallo.titulo}</h6>
                    <span className={`badge bg-${coloresGravedad[fallo.gravedad]}`}>
                        {fallo.gravedad}
                    </span>
                </div>
                <p className="text-muted small mb-2">{fallo.descripcion}</p>
                {(fallo.km_inicio || fallo.km_fin) && (
                    <p className="small mb-2">
                        Frecuente entre{' '}
                        {fallo.km_inicio ? fallo.km_inicio.toLocaleString() : '0'} km
                        {fallo.km_fin ? ` y ${fallo.km_fin.toLocaleString()} km` : ' en adelante'}
                    </p>
                )}
                {fallo.solucion && (
                    <div className="alert alert-light py-2 px-3 mb-0 small">
                        <strong>Solución:</strong> {fallo.solucion}
                    </div>
                )}
            </div>
        </div>
    );
}

// tarjeta de incidencia de la comunidad — muestra autor y permite votar
function TarjetaIncidencia({ incidencia, onVotar }) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{incidencia.titulo}</h6>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => onVotar(incidencia.id)}
                    >
                        {incidencia.votos} votos
                    </button>
                </div>
                <p className="text-muted small mb-2">{incidencia.descripcion}</p>
                <div className="d-flex gap-3 flex-wrap">
                    <span className="small">
                        {new Date(incidencia.fecha + 'T12:00:00').toLocaleDateString('es-ES')}
                    </span>
                    {incidencia.kilometraje && (
                        <span className="small">
                            {parseInt(incidencia.kilometraje).toLocaleString()} km
                        </span>
                    )}
                    {incidencia.autor && (
                        <span className="small text-muted">por {incidencia.autor}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

// tarjeta de incidencia propia — permite editar y eliminar
function TarjetaMiIncidencia({ incidencia, onEditar, onEliminar }) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{incidencia.titulo}</h6>
                    <span className="badge bg-secondary fw-normal">{incidencia.votos} votos</span>
                </div>
                <p className="text-muted small mb-2">{incidencia.descripcion}</p>
                <div className="d-flex gap-3 flex-wrap mb-3">
                    <span className="small">
                        {new Date(incidencia.fecha + 'T12:00:00').toLocaleDateString('es-ES')}
                    </span>
                    {incidencia.kilometraje && (
                        <span className="small">
                            {parseInt(incidencia.kilometraje).toLocaleString()} km
                        </span>
                    )}
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => onEditar(incidencia)}
                    >
                        Editar
                    </button>
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onEliminar(incidencia.id)}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

// formulario compartido para crear y editar incidencias
// si incidenciaEditar != null estamos en modo edición (PUT), si es null creamos (POST)
function FormularioIncidencia({ vehiculos, incidenciaEditar, onGuardado, onCancelar }) {

    const [form, setForm]         = useState({
        vehiculo_id:  '',
        titulo:       '',
        descripcion:  '',
        kilometraje:  '',
        fecha:        new Date().toISOString().split('T')[0]
    });
    const [error, setError]       = useState('');
    const [cargando, setCargando] = useState(false);

    // si editamos precargamos el formulario con los datos existentes
    useEffect(() => {
        if (incidenciaEditar) {
            setForm({
                vehiculo_id:  incidenciaEditar.vehiculo_id  || '',
                titulo:       incidenciaEditar.titulo       || '',
                descripcion:  incidenciaEditar.descripcion  || '',
                kilometraje:  incidenciaEditar.kilometraje  || '',
                fecha:        incidenciaEditar.fecha        || new Date().toISOString().split('T')[0]
            });
        }
    }, [incidenciaEditar]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            if (incidenciaEditar) {
                // edición: PUT /diagnostico/{id}
                await api.put(`/diagnostico/${incidenciaEditar.id}`, {
                    titulo:      form.titulo,
                    descripcion: form.descripcion,
                    kilometraje: form.kilometraje || null,
                    fecha:       form.fecha
                });
            } else {
                // creación: POST /diagnostico
                await api.post('/diagnostico', {
                    vehiculo_id:  form.vehiculo_id,
                    titulo:       form.titulo,
                    descripcion:  form.descripcion,
                    kilometraje:  form.kilometraje || null,
                    fecha:        form.fecha
                });
            }
            onGuardado();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar la incidencia');
        } finally {
            setCargando(false);
        }
    };

    const modoEditar = !!incidenciaEditar;

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header fw-bold" style={{ backgroundColor: 'var(--ap-dorado)', color: '#1a1a1a' }}>
                {modoEditar ? 'Editar incidencia' : 'Reportar incidencia'}
            </div>
            <div className="card-body">

                {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row">

                        {/* selector de vehiculo — solo al crear */}
                        {!modoEditar && (
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Tu vehículo</label>
                                <select
                                    name="vehiculo_id"
                                    className="form-select"
                                    value={form.vehiculo_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona un vehículo</option>
                                    {vehiculos.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.nombre_marca} {v.nombre_modelo} — {v.matricula}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* fecha */}
                        <div className={`col-md-${modoEditar ? '6' : '6'} mb-3`}>
                            <label className="form-label fw-semibold">Fecha</label>
                            <input
                                type="date"
                                name="fecha"
                                className="form-control"
                                value={form.fecha}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        {/* titulo */}
                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">Título</label>
                            <input
                                type="text"
                                name="titulo"
                                className="form-control"
                                placeholder="Ej: Ruido en suspensión delantera"
                                value={form.titulo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* descripcion */}
                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">Descripción</label>
                            <textarea
                                name="descripcion"
                                className="form-control"
                                rows="3"
                                placeholder="Describe el problema con el mayor detalle posible..."
                                value={form.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* kilometraje */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                Kilometraje
                                <span className="text-muted fw-normal"> (opcional)</span>
                            </label>
                            <input
                                type="number"
                                name="kilometraje"
                                className="form-control"
                                placeholder="78000"
                                min="0"
                                value={form.kilometraje}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="d-flex gap-2">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={cargando}
                        >
                            {cargando
                                ? (modoEditar ? 'Guardando...' : 'Enviando...')
                                : (modoEditar ? 'Guardar cambios' : 'Reportar incidencia')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onCancelar}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Diagnostic() {

    const [vehiculos, setVehiculos]           = useState([]);
    const [vehiculoSel, setVehiculoSel]       = useState(null);
    const [fallos, setFallos]                 = useState([]);
    const [incidencias, setIncidencias]       = useState([]);
    const [misIncidencias, setMisIncidencias] = useState([]);
    const [cargando, setCargando]             = useState(false);
    const [mostrarForm, setMostrarForm]       = useState(false);
    const [incidenciaEditar, setIncidenciaEditar] = useState(null);
    const [error, setError]                   = useState('');
    const [aviso, setAviso]                   = useState('');

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        try {
            const res = await api.get('/vehiculos');
            setVehiculos(res.data.vehiculos);
        } catch (err) {
            setError('Error al cargar los vehículos');
        }
    };

    const seleccionarVehiculo = async (vehiculo) => {
        setVehiculoSel(vehiculo);
        setFallos([]);
        setIncidencias([]);
        setMisIncidencias([]);
        setMostrarForm(false);
        setIncidenciaEditar(null);
        setCargando(true);
        setError('');

        try {
            const res = await api.get(`/diagnostico?modelo_id=${vehiculo.modelo_id}`);
            setFallos(res.data.fallos_conocidos);
            setIncidencias(res.data.incidencias);
            setMisIncidencias(res.data.mis_incidencias || []);
        } catch (err) {
            setError('Error al cargar las incidencias');
        } finally {
            setCargando(false);
        }
    };

    const handleVotar = async (incidencia_id) => {
        try {
            await api.post(`/diagnostico/${incidencia_id}/votar`);
            seleccionarVehiculo(vehiculoSel);
        } catch (err) {
            if (err.response?.status === 409) {
                setAviso('Ya has votado esta incidencia');
                setTimeout(() => setAviso(''), 3000);
            }
        }
    };

    const handleEditar = (incidencia) => {
        setIncidenciaEditar(incidencia);
        setMostrarForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEliminar = async (id) => {
        try {
            await api.delete(`/diagnostico/${id}`);
            seleccionarVehiculo(vehiculoSel);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar la incidencia');
        }
    };

    const handleGuardado = () => {
        setMostrarForm(false);
        setIncidenciaEditar(null);
        if (vehiculoSel) seleccionarVehiculo(vehiculoSel);
    };

    const abrirFormNuevo = () => {
        setIncidenciaEditar(null);
        setMostrarForm(true);
    };

    return (
        <div>
            <Navbar />

            <div className="container-fluid mt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="fw-bold mb-0">Incidencias</h4>
                        <p className="text-muted mb-0">
                            Fallos conocidos e incidencias de otros usuarios con tu mismo modelo
                        </p>
                    </div>
                    {vehiculoSel && !mostrarForm && (
                        <button
                            className="btn btn-warning"
                            onClick={abrirFormNuevo}
                        >
                            Reportar incidencia
                        </button>
                    )}
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {aviso && <div className="alert alert-info py-2">{aviso}</div>}

                {/* selector de vehiculo */}
                <div className="mb-4">
                    <p className="text-muted small mb-2">
                        Selecciona un vehículo para ver sus incidencias:
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                        {vehiculos.map(v => (
                            <button
                                key={v.id}
                                className={`btn ${vehiculoSel?.id === v.id ? 'btn-dark' : 'btn-outline-dark'}`}
                                onClick={() => seleccionarVehiculo(v)}
                            >
                                {v.nombre_marca} {v.nombre_modelo} — {v.matricula}
                            </button>
                        ))}
                    </div>
                </div>

                {/* formulario crear / editar */}
                {mostrarForm && (
                    <FormularioIncidencia
                        vehiculos={vehiculos}
                        incidenciaEditar={incidenciaEditar}
                        onGuardado={handleGuardado}
                        onCancelar={() => {
                            setMostrarForm(false);
                            setIncidenciaEditar(null);
                        }}
                    />
                )}

                {cargando && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="mt-2 text-muted">Cargando incidencias...</p>
                    </div>
                )}

                {!vehiculoSel && !cargando && (
                    <div className="text-center py-5">
                        <h5 className="text-muted">Selecciona un vehículo para ver sus incidencias</h5>
                    </div>
                )}

                {/* 3 columnas: fallos conocidos | comunidad | mis incidencias */}
                {vehiculoSel && !cargando && (
                    <div className="row">

                        {/* columna 1 — fallos conocidos (admin) */}
                        <div className="col-md-4">
                            <h5 className="fw-bold mb-3">
                                Fallos conocidos
                                <span className="badge bg-secondary ms-2 fw-normal">
                                    {fallos.length}
                                </span>
                            </h5>

                            {fallos.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <p className="small">No hay fallos conocidos registrados para este modelo</p>
                                </div>
                            ) : (
                                fallos.map(fallo => (
                                    <TarjetaFalloConocido key={fallo.id} fallo={fallo} />
                                ))
                            )}
                        </div>

                        {/* columna 2 — incidencias de la comunidad */}
                        <div className="col-md-4">
                            <h5 className="fw-bold mb-3">
                                Incidencias de usuarios
                                <span className="badge bg-secondary ms-2 fw-normal">
                                    {incidencias.length}
                                </span>
                            </h5>

                            {incidencias.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <p className="small">No hay incidencias reportadas para este modelo</p>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={abrirFormNuevo}
                                    >
                                        Sé el primero en reportar
                                    </button>
                                </div>
                            ) : (
                                incidencias.map(inc => (
                                    <TarjetaIncidencia
                                        key={inc.id}
                                        incidencia={inc}
                                        onVotar={handleVotar}
                                    />
                                ))
                            )}
                        </div>

                        {/* columna 3 — mis incidencias (propias, editables) */}
                        <div className="col-md-4">
                            <h5 className="fw-bold mb-3">
                                Mis incidencias
                                <span className="badge bg-secondary ms-2 fw-normal">
                                    {misIncidencias.length}
                                </span>
                            </h5>

                            {misIncidencias.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <p className="small">Aún no has reportado ninguna incidencia para este modelo</p>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={abrirFormNuevo}
                                    >
                                        Reportar incidencia
                                    </button>
                                </div>
                            ) : (
                                misIncidencias.map(inc => (
                                    <TarjetaMiIncidencia
                                        key={inc.id}
                                        incidencia={inc}
                                        onEditar={handleEditar}
                                        onEliminar={handleEliminar}
                                    />
                                ))
                            )}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
