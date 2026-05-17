import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminPanel() {

    const [seccion, setSeccion]   = useState('marcas');
    const [marcas, setMarcas]     = useState([]);
    const [modelos, setModelos]   = useState([]);
    const [fallos, setFallos]     = useState([]);
    const [marcaSel, setMarcaSel] = useState('');
    const [error, setError]       = useState('');
    const [aviso, setAviso]       = useState('');
    const navigate                = useNavigate();

    // estado para la sección de moderación de incidencias
    const [incidencias, setIncidencias]               = useState([]);
    const [filtroMarcaInc, setFiltroMarcaInc]         = useState('');
    const [filtroModeloInc, setFiltroModeloInc]       = useState('');
    const [modelosFiltro, setModelosFiltro]           = useState([]);
    const [cargandoInc, setCargandoInc]               = useState(false);

    // formularios
    const [formMarca, setFormMarca]   = useState({ nombre: '' });
    const [formModelo, setFormModelo] = useState({
        marca_id: '', nombre: '', anio_inicio: '', anio_fin: ''
    });
    const [formFallo, setFormFallo]   = useState({
        modelo_id: '', titulo: '', descripcion: '',
        km_inicio: '', km_fin: '', solucion: '', gravedad: 'moderado'
    });

    useEffect(() => {
        cargarMarcas();
    }, []);

    // usamos el token de admin para las peticiones
    const apiAdmin = () => {
        const token = localStorage.getItem('adminToken');
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };

    const cargarMarcas = async () => {
        try {
            const res = await api.get('/marcas');
            setMarcas(res.data.marcas);
        } catch (err) {
            setError('Error al cargar marcas');
        }
    };

    const cargarModelos = async (marca_id) => {
        try {
            const res = await api.get(`/modelos?marca_id=${marca_id}`);
            setModelos(res.data.modelos);
        } catch (err) {
            setError('Error al cargar modelos');
        }
    };

    const cargarFallos = async (modelo_id) => {
        try {
            const res = await api.get(`/admin/fallos?modelo_id=${modelo_id}`, apiAdmin());
            setFallos(res.data.fallos);
        } catch (err) {
            setError('Error al cargar fallos');
        }
    };

    const cargarModelosFiltro = async (marca_id) => {
        try {
            const res = await api.get(`/modelos?marca_id=${marca_id}`);
            setModelosFiltro(res.data.modelos);
            setFiltroModeloInc('');
            setIncidencias([]);
        } catch (err) {
            setError('Error al cargar modelos');
        }
    };

    const cargarIncidenciasAdmin = async (modelo_id) => {
        if (!modelo_id) return;
        setCargandoInc(true);
        setError('');
        try {
            const res = await api.get(`/admin/incidencias?modelo_id=${modelo_id}`, apiAdmin());
            setIncidencias(res.data.incidencias);
        } catch (err) {
            setError('Error al cargar incidencias');
        } finally {
            setCargandoInc(false);
        }
    };

    const handleEliminarIncidencia = async (id) => {
        try {
            await api.delete(`/admin/incidencias/${id}`, apiAdmin());
            setIncidencias(prev => prev.filter(i => i.id !== id));
            mostrarAviso('Incidencia eliminada');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar la incidencia');
        }
    };

    const mostrarAviso = (msg) => {
        setAviso(msg);
        setTimeout(() => setAviso(''), 3000);
    };

    // crear marca
    const handleCrearMarca = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/marcas', formMarca, apiAdmin());
            setFormMarca({ nombre: '' });
            cargarMarcas();
            mostrarAviso('Marca añadida');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear la marca');
        }
    };

    // crear modelo
    const handleCrearModelo = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/modelos', formModelo, apiAdmin());
            setFormModelo({ marca_id: '', nombre: '', anio_inicio: '', anio_fin: '' });
            mostrarAviso('Modelo añadido');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear el modelo');
        }
    };

    // crear fallo
    const handleCrearFallo = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/fallos', formFallo, apiAdmin());
            setFormFallo({
                modelo_id: '', titulo: '', descripcion: '',
                km_inicio: '', km_fin: '', solucion: '', gravedad: 'moderado'
            });
            mostrarAviso('Fallo añadido');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear el fallo');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/admin/login');
    };

    return (
        <div>
            {/* navbar admin */}
            <nav className="navbar navbar-dark bg-danger px-4">
                <span className="navbar-brand fw-bold">AutoPrevent Admin</span>
                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </nav>

            <div className="container mt-4">

                <h4 className="fw-bold mb-4">Panel de administración</h4>

                {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                )}
                {aviso && (
                    <div className="alert alert-success py-2">{aviso}</div>
                )}

                {/* tabs */}
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${seccion === 'marcas' ? 'active' : ''}`}
                            onClick={() => setSeccion('marcas')}
                        >
                            Marcas
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${seccion === 'modelos' ? 'active' : ''}`}
                            onClick={() => setSeccion('modelos')}
                        >
                            Modelos
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${seccion === 'fallos' ? 'active' : ''}`}
                            onClick={() => setSeccion('fallos')}
                        >
                            Fallos conocidos
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${seccion === 'incidencias' ? 'active' : ''}`}
                            onClick={() => setSeccion('incidencias')}
                        >
                            Moderación incidencias
                        </button>
                    </li>
                </ul>

                {/* seccion marcas */}
                {seccion === 'marcas' && (
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card shadow-sm">
                                <div className="card-header fw-bold">Nueva marca</div>
                                <div className="card-body">
                                    <form onSubmit={handleCrearMarca}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Nombre de la marca
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ej: Ford"
                                                value={formMarca.nombre}
                                                onChange={(e) => setFormMarca({ nombre: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">
                                            Crear marca
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="card shadow-sm">
                                <div className="card-header fw-bold">
                                    Marcas registradas ({marcas.length})
                                </div>
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush">
                                        {marcas.map(m => (
                                            <li
                                                key={m.id}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                {m.nombre}
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => {
                                                        setMarcaSel(m.id);
                                                        setFormModelo(prev => ({ ...prev, marca_id: m.id }));
                                                        cargarModelos(m.id);
                                                        setSeccion('modelos');
                                                    }}
                                                >
                                                    Ver modelos →
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* seccion modelos */}
                {seccion === 'modelos' && (
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card shadow-sm">
                                <div className="card-header fw-bold">Nuevo modelo</div>
                                <div className="card-body">
                                    <form onSubmit={handleCrearModelo}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Marca</label>
                                            <select
                                                className="form-select"
                                                value={formModelo.marca_id}
                                                onChange={(e) => {
                                                    setFormModelo(prev => ({ ...prev, marca_id: e.target.value }));
                                                    cargarModelos(e.target.value);
                                                }}
                                                required
                                            >
                                                <option value="">Selecciona una marca</option>
                                                {marcas.map(m => (
                                                    <option key={m.id} value={m.id}>{m.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Nombre del modelo
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ej: Focus"
                                                value={formModelo.nombre}
                                                onChange={(e) => setFormModelo(prev => ({ ...prev, nombre: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-6 mb-3">
                                                <label className="form-label fw-semibold">
                                                    Año inicio
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="2019"
                                                    value={formModelo.anio_inicio}
                                                    onChange={(e) => setFormModelo(prev => ({ ...prev, anio_inicio: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                            <div className="col-6 mb-3">
                                                <label className="form-label fw-semibold">
                                                    Año fin
                                                    <span className="text-muted fw-normal"> (opcional)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="2023"
                                                    value={formModelo.anio_fin}
                                                    onChange={(e) => setFormModelo(prev => ({ ...prev, anio_fin: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">
                                            Crear modelo
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="card shadow-sm">
                                <div className="card-header fw-bold">
                                    Modelos registrados ({modelos.length})
                                </div>
                                <div className="card-body p-0">
                                    {modelos.length === 0 ? (
                                        <p className="text-muted text-center py-3">
                                            Selecciona una marca para ver sus modelos
                                        </p>
                                    ) : (
                                        <ul className="list-group list-group-flush">
                                            {modelos.map(m => (
                                                <li
                                                    key={m.id}
                                                    className="list-group-item d-flex justify-content-between"
                                                >
                                                    <span>{m.nombre}</span>
                                                    <span className="text-muted small">
                                                        {m.anio_inicio} — {m.anio_fin || 'actualidad'}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* seccion fallos */}
                {seccion === 'fallos' && (
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card shadow-sm">
                                <div className="card-header fw-bold">Nuevo fallo conocido</div>
                                <div className="card-body">
                                    <form onSubmit={handleCrearFallo}>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Marca</label>
                                            <select
                                                className="form-select"
                                                onChange={(e) => {
                                                    cargarModelos(e.target.value);
                                                }}
                                                required
                                            >
                                                <option value="">Selecciona una marca</option>
                                                {marcas.map(m => (
                                                    <option key={m.id} value={m.id}>{m.nombre}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Modelo</label>
                                            <select
                                                className="form-select"
                                                value={formFallo.modelo_id}
                                                onChange={(e) => {
                                                    setFormFallo(prev => ({ ...prev, modelo_id: e.target.value }));
                                                    cargarFallos(e.target.value);
                                                }}
                                                required
                                            >
                                                <option value="">Selecciona un modelo</option>
                                                {modelos.map(m => (
                                                    <option key={m.id} value={m.id}>{m.nombre}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Título</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ej: Fallo en bomba de agua"
                                                value={formFallo.titulo}
                                                onChange={(e) => setFormFallo(prev => ({ ...prev, titulo: e.target.value }))}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                rows="2"
                                                value={formFallo.descripcion}
                                                onChange={(e) => setFormFallo(prev => ({ ...prev, descripcion: e.target.value }))}
                                                required
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-6 mb-3">
                                                <label className="form-label fw-semibold">
                                                    Km inicio
                                                    <span className="text-muted fw-normal"> (opcional)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="60000"
                                                    value={formFallo.km_inicio}
                                                    onChange={(e) => setFormFallo(prev => ({ ...prev, km_inicio: e.target.value }))}
                                                />
                                            </div>
                                            <div className="col-6 mb-3">
                                                <label className="form-label fw-semibold">
                                                    Km fin
                                                    <span className="text-muted fw-normal"> (opcional)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="90000"
                                                    value={formFallo.km_fin}
                                                    onChange={(e) => setFormFallo(prev => ({ ...prev, km_fin: e.target.value }))}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Solución</label>
                                            <textarea
                                                className="form-control"
                                                rows="2"
                                                placeholder="Ej: Sustitución de la bomba de agua"
                                                value={formFallo.solucion}
                                                onChange={(e) => setFormFallo(prev => ({ ...prev, solucion: e.target.value }))}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Gravedad</label>
                                            <select
                                                className="form-select"
                                                value={formFallo.gravedad}
                                                onChange={(e) => setFormFallo(prev => ({ ...prev, gravedad: e.target.value }))}
                                            >
                                                <option value="leve">Leve</option>
                                                <option value="moderado">Moderado</option>
                                                <option value="grave">Grave</option>
                                            </select>
                                        </div>

                                        <button type="submit" className="btn btn-danger w-100">
                                            Añadir fallo conocido
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card shadow-sm">
                                <div className="card-header fw-bold">
                                    Fallos registrados ({fallos.length})
                                </div>
                                <div className="card-body p-0">
                                    {fallos.length === 0 ? (
                                        <p className="text-muted text-center py-3">
                                            Selecciona un modelo para ver sus fallos
                                        </p>
                                    ) : (
                                        <ul className="list-group list-group-flush">
                                            {fallos.map(f => (
                                                <li key={f.id} className="list-group-item">
                                                    <div className="d-flex justify-content-between">
                                                        <span className="fw-bold small">{f.titulo}</span>
                                                        <span className={`badge bg-${f.gravedad === 'grave' ? 'danger' : f.gravedad === 'moderado' ? 'warning' : 'success'}`}>
                                                            {f.gravedad}
                                                        </span>
                                                    </div>
                                                    <p className="text-muted small mb-0">{f.descripcion}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* seccion moderacion incidencias */}
                {seccion === 'incidencias' && (
                    <div>
                        <div className="card shadow-sm mb-4">
                            <div className="card-header fw-bold">Filtrar por marca y modelo</div>
                            <div className="card-body">
                                <div className="row g-3 align-items-end">

                                    {/* selector marca */}
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Marca</label>
                                        <select
                                            className="form-select"
                                            value={filtroMarcaInc}
                                            onChange={(e) => {
                                                setFiltroMarcaInc(e.target.value);
                                                cargarModelosFiltro(e.target.value);
                                            }}
                                        >
                                            <option value="">Selecciona una marca</option>
                                            {marcas.map(m => (
                                                <option key={m.id} value={m.id}>{m.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* selector modelo */}
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Modelo</label>
                                        <select
                                            className="form-select"
                                            value={filtroModeloInc}
                                            disabled={!filtroMarcaInc}
                                            onChange={(e) => {
                                                setFiltroModeloInc(e.target.value);
                                                cargarIncidenciasAdmin(e.target.value);
                                            }}
                                        >
                                            <option value="">Selecciona un modelo</option>
                                            {modelosFiltro.map(m => (
                                                <option key={m.id} value={m.id}>{m.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        {filtroModeloInc && (
                                            <p className="text-muted mb-0">
                                                {incidencias.length} incidencia{incidencias.length !== 1 ? 's' : ''} encontrada{incidencias.length !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* listado de incidencias */}
                        {cargandoInc && (
                            <div className="text-center py-4">
                                <div className="spinner-border text-danger" role="status" />
                            </div>
                        )}

                        {!cargandoInc && filtroModeloInc && incidencias.length === 0 && (
                            <div className="text-center py-4 text-muted">
                                <p>No hay incidencias para este modelo</p>
                            </div>
                        )}

                        {!cargandoInc && !filtroModeloInc && (
                            <div className="text-center py-4 text-muted">
                                <p>Selecciona una marca y un modelo para ver las incidencias</p>
                            </div>
                        )}

                        <div>
                            {incidencias.map(inc => (
                                <div key={inc.id} className="card shadow-sm mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1 me-3">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <h6 className="fw-bold mb-0">{inc.titulo}</h6>
                                                    <span className="badge bg-secondary fw-normal">
                                                        {inc.votos} votos
                                                    </span>
                                                </div>
                                                <p className="text-muted small mb-2">{inc.descripcion}</p>
                                                <div className="d-flex gap-3 flex-wrap">
                                                    <span className="small">
                                                        {new Date(inc.fecha + 'T12:00:00').toLocaleDateString('es-ES')}
                                                    </span>
                                                    {inc.kilometraje && (
                                                        <span className="small">
                                                            {parseInt(inc.kilometraje).toLocaleString()} km
                                                        </span>
                                                    )}
                                                    <span className="small text-muted">
                                                        Autor: {inc.autor} ({inc.autor_email})
                                                    </span>
                                                    <span className="small text-muted">
                                                        Vehículo: {inc.matricula}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-danger btn-sm flex-shrink-0"
                                                onClick={() => handleEliminarIncidencia(inc.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}