import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar';
import api from '../../services/api';

// formulario compartido para crear y editar vehiculos, null = modo crear
function FormularioVehiculo({ vehiculoEditar, onGuardado, onCancelar }) {

    const [marcas, setMarcas]   = useState([]);
    const [modelos, setModelos] = useState([]);
    const [form, setForm]       = useState({
        marca_id:            '',
        modelo_id:           '',
        matricula:           '',
        vin:                 '',
        anio:                '',
        kilometraje_actual:  '',
        fecha_matriculacion: '',
        color:               ''
    });
    const [error, setError]       = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        cargarMarcas();
        // si estamos editando rellenamos el formulario
        if (vehiculoEditar) {
            setForm({
                marca_id:            vehiculoEditar.marca_id            || '',
                modelo_id:           vehiculoEditar.modelo_id           || '',
                matricula:           vehiculoEditar.matricula           || '',
                vin:                 vehiculoEditar.vin                 || '',
                anio:                vehiculoEditar.anio                || '',
                kilometraje_actual:  vehiculoEditar.kilometraje_actual  || '',
                fecha_matriculacion: vehiculoEditar.fecha_matriculacion || '',
                color:               vehiculoEditar.color               || ''
            });
            if (vehiculoEditar.modelo_id) {
                cargarModelos(vehiculoEditar.marca_id);
            }
        }
    }, [vehiculoEditar]);

    const cargarMarcas = async () => {
        try {
            const res = await api.get('/marcas');
            setMarcas(res.data.marcas);
        } catch (err) {
            setError('Error al cargar las marcas');
        }
    };

    const cargarModelos = async (marca_id) => {
        try {
            const res = await api.get(`/modelos?marca_id=${marca_id}`);
            setModelos(res.data.modelos);
        } catch (err) {
            setError('Error al cargar los modelos');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // si cambia la marca cargamos sus modelos
        if (name === 'marca_id') {
            setForm(prev => ({ ...prev, marca_id: value, modelo_id: '' }));
            cargarModelos(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            if (vehiculoEditar) {
                await api.put(`/vehiculos/${vehiculoEditar.id}`, form);
            } else {
                await api.post('/vehiculos', form);
            }
            onGuardado();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar el vehículo');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header fw-bold" style={{ backgroundColor: 'var(--ap-dorado)', color: '#1a1a1a' }}>
                {vehiculoEditar ? 'Editar vehículo' : 'Añadir vehículo'}
            </div>
            <div className="card-body">

                {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row">

                        {/* marca */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Marca</label>
                            <select
                                name="marca_id"
                                className="form-select"
                                value={form.marca_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona una marca</option>
                                {marcas.map(m => (
                                    <option key={m.id} value={m.id}>{m.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* modelo */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Modelo</label>
                            <select
                                name="modelo_id"
                                className="form-select"
                                value={form.modelo_id}
                                onChange={handleChange}
                                required
                                disabled={!form.marca_id}
                            >
                                <option value="">Selecciona un modelo</option>
                                {modelos.map(m => (
                                    <option key={m.id} value={m.id}>{m.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* matricula */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Matrícula</label>
                            <input
                                type="text"
                                name="matricula"
                                className="form-control"
                                placeholder="1234ABC"
                                value={form.matricula}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* vin */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                VIN <span className="text-muted fw-normal">(opcional)</span>
                            </label>
                            <input
                                type="text"
                                name="vin"
                                className="form-control"
                                placeholder="WVWZZZ1KZAM000000"
                                value={form.vin}
                                onChange={handleChange}
                            />
                        </div>

                        {/* año */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">Año</label>
                            <input
                                type="number"
                                name="anio"
                                className="form-control"
                                placeholder="2019"
                                min="1990"
                                max="2026"
                                value={form.anio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* kilometraje */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">Kilometraje actual</label>
                            <input
                                type="number"
                                name="kilometraje_actual"
                                className="form-control"
                                placeholder="78000"
                                min="0"
                                value={form.kilometraje_actual}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* color */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                Color <span className="text-muted fw-normal">(opcional)</span>
                            </label>
                            <input
                                type="text"
                                name="color"
                                className="form-control"
                                placeholder="Rojo"
                                value={form.color}
                                onChange={handleChange}
                            />
                        </div>

                        {/* fecha matriculacion */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Fecha de matriculación</label>
                            <input
                                type="date"
                                name="fecha_matriculacion"
                                className="form-control"
                                value={form.fecha_matriculacion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className="d-flex gap-2">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={cargando}
                        >
                            {cargando ? 'Guardando...' : 'Guardar vehículo'}
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

// pido confirmación antes de borrar para que no se elimine un coche por un clic accidental
function ModalBorrar({ vehiculo, onConfirmar, onCancelar }) {
    return (
        <div className="modal-overlay">
            <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h5 className="fw-bold mb-2">¿Eliminar vehículo?</h5>
                <p className="text-muted">
                    Vas a eliminar el <strong>{vehiculo.nombre_marca} {vehiculo.nombre_modelo}</strong> con matrícula <strong>{vehiculo.matricula}</strong>. Esta acción no se puede deshacer.
                </p>
                <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-outline-secondary" onClick={onCancelar}>
                        Cancelar
                    </button>
                    <button className="btn btn-danger" onClick={onConfirmar}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Garage() {

    const [vehiculos, setVehiculos]         = useState([]);
    const [cargando, setCargando]           = useState(true);
    const [mostrarForm, setMostrarForm]     = useState(false);
    const [vehiculoEditar, setVehiculoEditar] = useState(null);
    const [vehiculoBorrar, setVehiculoBorrar] = useState(null);
    const [error, setError]                 = useState('');

    useEffect(() => {
        cargarVehiculos();
    }, []);

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

    const handleGuardado = () => {
        setMostrarForm(false);
        setVehiculoEditar(null);
        cargarVehiculos();
    };

    const handleEditar = (vehiculo) => {
        setVehiculoEditar(vehiculo);
        setMostrarForm(true);
        // scroll arriba para ver el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBorrar = async () => {
        try {
            await api.delete(`/vehiculos/${vehiculoBorrar.id}`);
            setVehiculoBorrar(null);
            cargarVehiculos();
        } catch (err) {
            setError('Error al eliminar el vehículo');
        }
    };

    return (
        <div>
            <Navbar />

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="fw-bold mb-0">Mi Garaje</h4>
                        <p className="text-muted mb-0">Gestiona tus vehículos</p>
                    </div>
                    {!mostrarForm && (
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setVehiculoEditar(null);
                                setMostrarForm(true);
                            }}
                        >
                            + Añadir vehículo
                        </button>
                    )}
                </div>

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                {mostrarForm && (
                    <FormularioVehiculo
                        vehiculoEditar={vehiculoEditar}
                        onGuardado={handleGuardado}
                        onCancelar={() => {
                            setMostrarForm(false);
                            setVehiculoEditar(null);
                        }}
                    />
                )}

                {cargando && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="mt-2 text-muted">Cargando vehículos...</p>
                    </div>
                )}

                {!cargando && vehiculos.length === 0 && !mostrarForm && (
                    <div className="text-center py-5">
                        <h5 className="text-muted">No tienes vehículos registrados</h5>
                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => setMostrarForm(true)}
                        >
                            Añadir mi primer vehículo
                        </button>
                    </div>
                )}

                <div className="row">
                    {vehiculos.map(vehiculo => (
                        <div key={vehiculo.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card card-vehiculo h-100 shadow-sm">
                                <div className="card-header fw-bold d-flex justify-content-between" style={{ backgroundColor: 'var(--ap-dorado)', color: '#1a1a1a' }}>
                                    <span className="fw-bold">
                                        {vehiculo.nombre_marca} {vehiculo.nombre_modelo}
                                    </span>
                                    <span className="badge bg-secondary">{vehiculo.anio}</span>
                                </div>
                                <div className="card-body">
                                    <div className="mb-2">
                                        <span className="text-muted small">Matrícula: </span>
                                        <span className="fw-bold">{vehiculo.matricula}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-muted small">Kilometraje: </span>
                                        <span className="fw-bold">
                                            {vehiculo.kilometraje_actual.toLocaleString()} km
                                        </span>
                                    </div>
                                    {vehiculo.color && (
                                        <div className="mb-2">
                                            <span className="text-muted small">Color: </span>
                                            <span className="fw-bold">{vehiculo.color}</span>
                                        </div>
                                    )}
                                    {vehiculo.vin && (
                                        <div className="mb-2">
                                            <span className="text-muted small">VIN: </span>
                                            <span className="fw-bold small">{vehiculo.vin}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="card-footer bg-white border-0 d-flex gap-2">
                                    <button
                                        className="btn btn-outline-primary btn-sm flex-grow-1"
                                        onClick={() => handleEditar(vehiculo)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm flex-grow-1"
                                        onClick={() => setVehiculoBorrar(vehiculo)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {vehiculoBorrar && (
                <ModalBorrar
                    vehiculo={vehiculoBorrar}
                    onConfirmar={handleBorrar}
                    onCancelar={() => setVehiculoBorrar(null)}
                />
            )}
        </div>
    );
}
