# AutoPrevent
Plataforma web para la gestión inteligente del mantenimiento preventivo y diagnóstico colaborativo de vehículos 

---- Desarrollado por: Hugo Israel Encalada Rodríguez ----

# Descripción
AutoPrevent transforma la gestión del mantenimiento vehicular de un modelo
reactivo a uno preventivo. Permite a los usuarios digitalizar el historial
técnico de sus vehículos y recibir alertas visuales basadas en el uso registrado

### Funcionalidad principal -- Sistema Semáforo
El sistema evalúa el estado de mantenimiento de cada vehículo y lo clasifica en:
    - **Verde:** Todo al día
    - **Amarillo:** Mantenimiento o ITV próxima
    - **Rojo:** Mantenimiento caducado o ITV vencida

## Tecnologías utilizadas
|        Capa         |     Tecnología    |
|  -----------------  |   --------------  |
|   Backend           | PHP 8 (API Rest)  | 
|   Frontend          |   React.js + BS 5 |
|   Base Datos        |       MySQL       |
|   Auth              |        JWT        |
|   Servidor  local   |      XAMPP        |
|   Control versiones |      Github       |
|    Testing API      |      Postman      |
-------------------------------------------

## Estructura del Proyecto

AutoPrevent/
│
├── backend/
│   ├── config/
│   │   ├── database.php          # Conexión MySQL
│   │   └── jwt.php               # Configuración JWT
│   │
│   ├── controllers/
│   │   ├── AuthController.php    # Login / Registro
│   │   ├── VehicleController.php # CRUD vehículos
│   │   ├── HistoryController.php # Historial
│   │   ├── DiagnosticController.php
│   │   └── AdminController.php   # Panel admin
│   │
│   ├── middleware/
│   │   └── AuthMiddleware.php    # Verificación JWT
│   │
│   ├── models/
│   │   ├── User.php
│   │   ├── Vehicle.php
│   │   ├── History.php
│   │   └── Diagnostic.php
│   │
│   ├── routes/
│   │   └── api.php               # Todas las rutas centralizadas
│   │
│   ├── utils/
│   │   └── SemaphoreEngine.php   # Lógica del semáforo
│   │
│   └── index.php                 # Punto de entrada único
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── components/
│       │   ├── Dashboard/
│       │   ├── Garage/
│       │   ├── History/
│       │   ├── Diagnostic/
│       │   └── Admin/
│       │
│       ├── services/
│       │   └── api.js            # Llamadas a la API PHP
│       │
│       ├── context/
│       │   └── AuthContext.jsx   # Estado global del usuario
│       │
│       └── App.jsx
│
├── database/
│   ├── schema.sql                # Estructura de tablas
│   └── seeds.sql                 # Datos precargados (marcas, modelos...)
│
├── .gitignore
└── README.md

## Instalación
### Requisitos previos
    - XAMPP instalado y en ejecución
    - Node.js instalado
    - Git instalado

### Backend
1. Clona el repositorio de 'htdocs' de XAMPP:
https://github.com/hencaladarodriguez/AutoPrevent.git

2. Importa la base de datos en phpMyAdmin:
    - Abre 'http://localhost/phpmyadmin'
    - Crea una base de datos llamada 'autoprevent'
    - Importa el archivo 'database/schema.sql'
    - Importa el archivo 'database/seeds.sql'

3. Configura la conexión en 'backend/config/database.php'
### FrontEnd

cd frontend
npm install
npm start


Despliegue local

1. Inicia Apache y MySQL desde el panel de XAMPP
2. Accede al backend en: `http://localhost/AutoPrevent/backend`
3. Accede al frontend en: `http://localhost:3000`


Convención de commits

Este proyecto sigue la convención **Conventional Commits**:

| Prefijo | Uso |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de errores |
| `docs:` | Documentación |
| `style:` | Estilos y CSS |
| `db:` | Base de datos |
| `config:` | Configuración |
| `refactor:` | Reestructuración de código |