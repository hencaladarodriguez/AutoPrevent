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
            const res = await api.get(`/diagnostico?modelo_id=${modelo_id}`, apiAdmin());
            setFallos(res.data.fallos_conocidos);
        } catch (err) {
            setError('Error al cargar fallos');
        }
    };

    const mostrarAviso = (msg) => {
        setAviso(msg);
        setTimeout(() => setAviso(''), 3000);
    };

    // -- CREAR MARCA --
    const handleCrearMarca = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/marcas', formMarca, apiAdmin());
            setFormMarca({ nombre: '' });
            cargarMarcas();
            mostrarAviso('Marca creada correctamente');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear la marca');
        }
    };

    // -- CREAR MODELO --
    const handleCrearModelo = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/modelos', formModelo, apiAdmin());
            setFormModelo({ marca_id: '', nombre: '', anio_inicio: '', anio_fin: '' });
            mostrarAviso('Modelo creado correctamente');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear el modelo');
        }
    };

    // -- CREAR FALLO --
    const handleCrearFallo = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/fallos', formFallo, apiAdmin());
            setFormFallo({
                modelo_id: '', titulo: '', descripcion: '',
                km_inicio: '', km_fin: '', solucion: '', gravedad: 'moderado'
            });
            mostrarAviso('Fallo conocido añadido correctamente');
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
                <span className="navbar-brand fw-bold">🔧 AutoPrevent Admin</span>
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
                </ul>

                {/* seccion marcas */}
                {seccion === 'marcas' && (
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card shadow-sm">
                                <div className="card-header fw-bold">➕ Nueva marca</div>
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
                                <div className="card-header fw-bold">➕ Nuevo modelo</div>
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
                                <div className="card-header fw-bold">➕ Nuevo fallo conocido</div>
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

            </div>
        </div>
    );
}