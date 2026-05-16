# AutoPrevent

Plataforma web para la gestión inteligente del mantenimiento preventivo y diagnóstico colaborativo de vehículos.

Desarrollado por **Hugo Israel Encalada Rodríguez** — TFG DAW 2025-2026, IES Bilingüe Laguna de Joatzel.

---

## ¿Qué es AutoPrevent?

AutoPrevent transforma la gestión del mantenimiento vehicular de un modelo reactivo a uno preventivo. Permite a los usuarios digitalizar el historial técnico de sus vehículos y recibir alertas visuales basadas en el uso registrado.

### Sistema Semáforo

El motor de semáforo evalúa el estado de cada vehículo según los kilómetros recorridos, los intervalos de mantenimiento del fabricante y la normativa ITV española:

- 🟢 **Verde** — todo al día
- 🟡 **Amarillo** — mantenimiento o ITV próximos (menos del 20% del intervalo restante)
- 🔴 **Rojo** — mantenimiento vencido o ITV caducada

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | PHP 8 — API RESTful sin framework |
| Frontend | React 19 + Bootstrap 5 |
| Base de datos | MySQL 8 |
| Autenticación | JWT propio (HS256, sin librerías externas) |
| Bundler | Vite 5 |
| Servidor local | XAMPP |
| Control de versiones | Git / GitHub |

---

## Estructura del proyecto

```
AutoPrevent/
├── backend/
│   ├── config/
│   │   ├── database.php          # Conexión PDO a MySQL
│   │   └── jwt.php               # JWT HS256 propio
│   ├── controllers/
│   │   ├── AuthController.php    # Login / Registro usuarios y admins
│   │   ├── VehicleController.php # CRUD vehículos
│   │   ├── HistoryController.php # Historial de mantenimiento
│   │   ├── DiagnosticController.php # Diagnóstico colaborativo
│   │   └── AdminController.php   # Panel de administración
│   ├── middleware/
│   │   └── AuthMiddleware.php    # Verificación JWT y roles
│   ├── models/
│   │   ├── Vehicle.php
│   │   ├── History.php
│   │   └── Diagnostic.php
│   ├── routes/
│   │   └── api.php               # Router manual (switch/case)
│   ├── utils/
│   │   └── SemaphoreEngine.php   # Motor del semáforo
│   └── index.php                 # Punto de entrada único
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Auth/             # Login.jsx, Register.jsx
│       │   ├── Landing/          # Página principal pública
│       │   ├── Dashboard/        # Semáforo y resumen de vehículos
│       │   ├── Garage/           # Gestión de vehículos (CRUD)
│       │   ├── History/          # Historial de mantenimiento
│       │   ├── Diagnostic/       # Diagnóstico colaborativo
│       │   ├── Admin/            # Panel de administración
│       │   ├── WWAre/            # Quiénes somos
│       │   └── Navbar.jsx
│       ├── context/
│       │   └── AuthContext.jsx   # Estado global de autenticación
│       ├── services/
│       │   └── api.js            # Cliente Axios con interceptores
│       └── App.jsx
├── database/
│   ├── schema.sql                # DDL completo
│   └── seeds.sql                 # Datos iniciales (marcas, modelos, admin)
├── setup.bat                     # Setup automático (BD + dependencias)
├── start.bat                     # Arranque del servidor de desarrollo
└── README.md
```

---

## Instalación

### Requisitos

- [XAMPP](https://www.apachefriends.org/) con Apache y MySQL en ejecución
- [Node.js](https://nodejs.org/) 20 o superior
- [Git](https://git-scm.com/)

### Pasos

**1. Clonar el repositorio** en la carpeta `htdocs` de XAMPP:

```bash
cd C:\xampp\htdocs
git clone https://github.com/hencaladarodriguez/AutoPrevent.git
cd AutoPrevent
```

**2. Ejecutar el setup automático:**

```bash
setup.bat
```

Esto detecta el puerto de Apache, importa `schema.sql` y `seeds.sql` y ejecuta `npm install`.

**3. Arrancar la aplicación:**

```bash
start.bat
```

**4. Abrir en el navegador:**

```
http://localhost:5173
```

### Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Usuario | hugo@gmail.com | 1234 |
| Administrador | admin@autoprevent.com | Admin1234 |

---

## Convención de commits

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de errores |
| `docs:` | Documentación |
| `style:` | Estilos y CSS |
| `db:` | Base de datos |
| `refactor:` | Reestructuración de código |
| `chore:` | Tareas de mantenimiento |
| `deploy:` | Cambios relacionados con el despliegue |
