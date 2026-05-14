import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../Navbar';
import api from '../../services/api';

// recibe modeloId para precargar los tipos de mantenimiento específicos de ese modelo
function FormularioHistorial({ vehiculoId, modeloId, onGuardado, onCancelar }) {

    const [tipos, setTipos]       = useState([]);
    const [form, setForm]         = useState({
        tipo_mantenimiento_id: '',
        descripcion:           '',
        kilometraje:           '',
        fecha:                 new Date().toISOString().split('T')[0],
        coste:                 '',
        taller:                ''
    });
    const [error, setError]       = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        cargarTipos();
    }, []);

    const cargarTipos = async () => {
        try {
            // cargamos los tipos de mantenimiento del modelo del vehiculo
            const res = await api.get(`/historial/tipos?modelo_id=${modeloId}`);
            setTipos(res.data.tipos);
        } catch (err) {
            // si falla no pasa nada, el campo es opcional
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            await api.post('/historial', {
                vehiculo_id:           vehiculoId,
                tipo_mantenimiento_id: form.tipo_mantenimiento_id || null,
                descripcion:           form.descripcion,
                kilometraje:           form.kilometraje,
                fecha:                 form.fecha,
                coste:                 form.coste || null,
                taller:                form.taller || null
            });
            onGuardado();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar el registro');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header fw-bold" style={{ backgroundColor: 'var(--ap-dorado)', color: '#1a1a1a' }}>
                Añadir registro al historial
            </div>
            <div className="card-body">

                {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row">

                        {/* tipo de mantenimiento */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                Tipo de mantenimiento
                                <span className="text-muted fw-normal"> (opcional)</span>
                            </label>
                            <select
                                name="tipo_mantenimiento_id"
                                className="form-select"
                                value={form.tipo_mantenimiento_id}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona un tipo</option>
                                {tipos.map(t => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* fecha */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Fecha</label>
                            <input
                                type="date"
                                name="fecha"
                                className="form-control"
                                value={form.fecha}
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
                                rows="2"
                                placeholder="Ej: Cambio de aceite 5W30 y filtro de aceite"
                                value={form.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* kilometraje */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">Kilometraje</label>
                            <input
                                type="number"
                                name="kilometraje"
                                className="form-control"
                                placeholder="78000"
                                min="0"
                                value={form.kilometraje}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* coste */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                Coste €
                                <span className="text-muted fw-normal"> (opcional)</span>
                            </label>
                            <input
                                type="number"
                                name="coste"
                                className="form-control"
                                placeholder="65.00"
                                min="0"
                                step="0.01"
                                value={form.coste}
                                onChange={handleChange}
                            />
                        </div>

                        {/* taller */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                Taller
                                <span className="text-muted fw-normal"> (opcional)</span>
                            </label>
                            <input
                                type="text"
                                name="taller"
                                className="form-control"
                                placeholder="Taller Pepe"
                                value={form.taller}
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
                            {cargando ? 'Guardando...' : 'Guardar registro'}
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

// si el registro tiene tipo vinculado muestra el nombre, si no pone 'Intervención manual'
function EntradaHistorial({ registro, onEliminar }) {

    return (
        <div className="timeline-entrada d-flex gap-3 mb-4">

            {/* indicador de linea del timeline */}
            <div className="timeline-icono text-center">
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--ap-dorado)', margin: '0 auto' }} />
                <div className="timeline-linea" />
            </div>

            {/* contenido */}
            <div className="card shadow-sm flex-grow-1">
                <div className="card-body py-2 px-3">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <p className="fw-bold mb-0">
                                {registro.tipo_nombre || 'Intervención manual'}
                            </p>
                            <p className="text-muted small mb-1">{registro.descripcion}</p>
                            <div className="d-flex gap-3 flex-wrap">
                                <span className="small">
                                    {new Date(registro.fecha + 'T12:00:00').toLocaleDateString('es-ES')}
                                </span>
                                <span className="small">
                                    {parseInt(registro.kilometraje).toLocaleString()} km
                                </span>
                                {registro.coste && (
                                    <span className="small">
                                        {parseFloat(registro.coste).toFixed(2)} €
                                    </span>
                                )}
                                {registro.taller && (
                                    <span className="small">
                                        {registro.taller}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onEliminar(registro.id)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function History() {

    const [searchParams]                  = useSearchParams();
    const [vehiculos, setVehiculos]       = useState([]);
    const [vehiculoSel, setVehiculoSel]   = useState(null);
    const [historial, setHistorial]       = useState([]);
    const [cargando, setCargando]         = useState(true);
    const [mostrarForm, setMostrarForm]   = useState(false);
    const [error, setError]               = useState('');

    useEffect(() => {
        cargarVehiculos();
    }, []);

    useEffect(() => {
        // si viene vehiculo_id en la url lo seleccionamos automaticamente
        const vid = searchParams.get('vehiculo_id');
        if (vid && vehiculos.length > 0) {
            const v = vehiculos.find(v => v.id === parseInt(vid));
            if (v) seleccionarVehiculo(v);
        }
    }, [vehiculos, searchParams]);

    const cargarVehiculos = async () => {
        try {
            const res = await api.get('/vehiculos');
            setVehiculos(res.data.vehiculos);
        } catch (err) {
            setError('Error al cargar los vehículos');
        } finally {
            setCargando(false);
        }
    };

    const seleccionarVehiculo = async (vehiculo) => {
        setVehiculoSel(vehiculo);
        setCargando(true);
        try {
            const res = await api.get(`/historial?vehiculo_id=${vehiculo.id}`);
            setHistorial(res.data.historial);
        } catch (err) {
            setError('Error al cargar el historial');
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async (id) => {
        try {
            await api.delete(`/historial/${id}`);
            // recargamos el historial del vehiculo actual
            seleccionarVehiculo(vehiculoSel);
        } catch (err) {
            setError('Error al eliminar el registro');
        }
    };

    const handleGuardado = () => {
        setMostrarForm(false);
        seleccionarVehiculo(vehiculoSel);
    };

    return (
        <div>
            <Navbar />

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="fw-bold mb-0">Historial de mantenimiento</h4>
                        <p className="text-muted mb-0">Registro de intervenciones de tus vehículos</p>
                    </div>
                    {vehiculoSel && !mostrarForm && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setMostrarForm(true)}
                        >
                            + Añadir registro
                        </button>
                    )}
                </div>

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                <div className="mb-4">
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

                {mostrarForm && vehiculoSel && (
                    <FormularioHistorial
                        vehiculoId={vehiculoSel.id}
                        modeloId={vehiculoSel.modelo_id}
                        onGuardado={handleGuardado}
                        onCancelar={() => setMostrarForm(false)}
                    />
                )}

                {cargando && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="mt-2 text-muted">Cargando historial...</p>
                    </div>
                )}

                {!cargando && vehiculoSel && historial.length === 0 && (
                    <div className="text-center py-5">
                        <h5 className="text-muted">No hay registros para este vehículo</h5>
                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => setMostrarForm(true)}
                        >
                            Añadir primer registro
                        </button>
                    </div>
                )}

                {!vehiculoSel && !cargando && (
                    <div className="text-center py-5">
                        <h5 className="text-muted">Selecciona un vehículo para ver su historial</h5>
                    </div>
                )}

                <div className="timeline">
                    {historial.map(registro => (
                        <EntradaHistorial
                            key={registro.id}
                            registro={registro}
                            onEliminar={handleEliminar}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}