-- ============================================
-- AutoPrevent - Esquema de Base de Datos
-- Autor: Hugo Israel Encalada Rodríguez
-- Versión: 1.0
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- --------------------------------------------
-- TABLA: usuarios
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: admins
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: marcas
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: modelos
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS modelos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    anio_inicio INT NOT NULL,
    anio_fin INT,
    FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: vehiculos
-- Vehículos registrados por cada usuario
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    modelo_id INT NOT NULL,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    vin VARCHAR(17),
    anio INT NOT NULL,
    kilometraje_actual INT NOT NULL DEFAULT 0,
    fecha_matriculacion DATE NOT NULL,
    color VARCHAR(50),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (modelo_id) REFERENCES modelos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: tipos_mantenimiento
-- Intervalos por modelo (datos admin precargados)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS tipos_mantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    intervalo_km INT,
    intervalo_meses INT,
    FOREIGN KEY (modelo_id) REFERENCES modelos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: historial_mantenimiento
-- Intervenciones realizadas por el usuario
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS historial_mantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    tipo_mantenimiento_id INT,
    descripcion TEXT NOT NULL,
    kilometraje INT NOT NULL,
    fecha DATE NOT NULL,
    coste DECIMAL(8,2),
    taller VARCHAR(150),
    tipo_entrada ENUM('manual', 'alerta') DEFAULT 'manual',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_mantenimiento_id) REFERENCES tipos_mantenimiento(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: alertas
-- Alertas automáticas generadas por el semáforo
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    tipo_mantenimiento_id INT,
    tipo_alerta ENUM('mantenimiento', 'itv') NOT NULL,
    estado ENUM('verde', 'amarillo', 'rojo') NOT NULL,
    mensaje TEXT NOT NULL,
    kilometraje_aviso INT,
    fecha_aviso DATE,
    resuelta TINYINT(1) DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_mantenimiento_id) REFERENCES tipos_mantenimiento(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: fallos_conocidos
-- Base de datos de fallos precargada por admin
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS fallos_conocidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    km_inicio INT,
    km_fin INT,
    solucion TEXT,
    gravedad ENUM('leve', 'moderado', 'grave') DEFAULT 'moderado',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (modelo_id) REFERENCES modelos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: incidencias_usuarios
-- Fallos reportados por usuarios
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS incidencias_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    kilometraje INT,
    fecha DATE NOT NULL,
    votos INT DEFAULT 0,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------
-- TABLA: votos_incidencias
-- Control de votos únicos por usuario
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS votos_incidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incidencia_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY voto_unico (incidencia_id, usuario_id),
    FOREIGN KEY (incidencia_id) REFERENCES incidencias_usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;