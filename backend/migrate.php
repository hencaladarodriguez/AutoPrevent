<?php
// script de migración para Railway
// se ejecuta antes de arrancar el servidor PHP
// crea las tablas y carga los datos iniciales si no existen

$host     = getenv('MYSQLHOST')     ?: 'localhost';
$port     = getenv('MYSQLPORT')     ?: '3306';
$dbname   = getenv('MYSQLDATABASE') ?: 'railway';
$username = getenv('MYSQLUSER')     ?: 'root';
$password = getenv('MYSQLPASSWORD') ?: '';

echo "[migrate] Conectando a MySQL en $host:$port...\n";

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // intentamos crear la BD — si Railway no lo permite usamos la que ya existe
    try {
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "[migrate] Base de datos '$dbname' lista.\n";
    } catch (PDOException $e) {
        echo "[migrate] No se pudo crear la BD (puede que ya exista): " . $e->getMessage() . "\n";
    }

    $pdo->exec("USE `$dbname`");

    // si usuarios ya existe asumimos que la BD está migrada
    $stmt = $pdo->query("SHOW TABLES LIKE 'usuarios'");
    if ($stmt->rowCount() > 0) {
        echo "[migrate] Tablas ya existentes — saltando migración.\n";
        exit(0);
    }

    echo "[migrate] Creando tablas...\n";

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("SET NAMES utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
        activo TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS marcas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS modelos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        marca_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        anio_inicio INT NOT NULL,
        anio_fin INT,
        FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS vehiculos (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tipos_mantenimiento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        modelo_id INT NOT NULL,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT,
        intervalo_km INT,
        intervalo_meses INT,
        FOREIGN KEY (modelo_id) REFERENCES modelos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS historial_mantenimiento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehiculo_id INT NOT NULL,
        tipo_mantenimiento_id INT,
        descripcion TEXT NOT NULL,
        kilometraje INT NOT NULL,
        fecha DATE NOT NULL,
        coste DECIMAL(8,2),
        taller VARCHAR(150),
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE,
        FOREIGN KEY (tipo_mantenimiento_id) REFERENCES tipos_mantenimiento(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS fallos_conocidos (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS incidencias_usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehiculo_id INT NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        descripcion TEXT NOT NULL,
        kilometraje INT,
        fecha DATE NOT NULL,
        votos INT DEFAULT 0,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS votos_incidencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        incidencia_id INT NOT NULL,
        usuario_id INT NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY voto_unico (incidencia_id, usuario_id),
        FOREIGN KEY (incidencia_id) REFERENCES incidencias_usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

    echo "[migrate] Tablas creadas. Cargando datos iniciales...\n";

    // admin
    $pdo->exec("INSERT INTO admins (nombre, email, password) VALUES
        ('Administrador', 'admin@autoprevent.com', '\$2y\$10\$DwVJEG0RcTQ/zQne5fvfjOe9.ZknFXtnsTYz5igCNm5k8X9I9saLO')");

    // usuario de prueba
    $pdo->exec("INSERT INTO usuarios (nombre, apellidos, email, password) VALUES
        ('Hugo', 'Encalada', 'hugo@gmail.com', '\$2y\$10\$tmc6Kqirv9OQIKgECXfRS.BrqxRvWl4I6K7aW92q8YfmJYUsW3HEG')");

    // marcas
    $pdo->exec("INSERT INTO marcas (nombre) VALUES
        ('Seat'), ('Volkswagen'), ('Renault'), ('BMW'), ('Toyota')");

    // modelos
    $pdo->exec("INSERT INTO modelos (marca_id, nombre, anio_inicio, anio_fin) VALUES
        (1,'Ibiza',2017,NULL),(1,'Leon',2020,NULL),(1,'Ateca',2016,NULL),
        (2,'Golf',2019,NULL),(2,'Polo',2017,NULL),(2,'Tiguan',2016,NULL),
        (3,'Clio',2019,NULL),(3,'Megane',2016,NULL),(3,'Kadjar',2015,NULL),
        (4,'Serie 3',2019,NULL),(4,'Serie 1',2019,NULL),(4,'X3',2017,NULL),
        (5,'Corolla',2018,NULL),(5,'Yaris',2020,NULL),(5,'RAV4',2018,NULL)");

    // tipos de mantenimiento
    $pdo->exec("INSERT INTO tipos_mantenimiento (modelo_id, nombre, descripcion, intervalo_km, intervalo_meses) VALUES
        (1,'Cambio de aceite','Sustitución del aceite de motor y filtro de aceite',10000,12),
        (1,'Filtro de aire','Sustitución del filtro de aire del motor',20000,24),
        (1,'Filtro de habitáculo','Sustitución del filtro de aire del habitáculo',15000,12),
        (1,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',40000,NULL),
        (1,'Correa de distribución','Sustitución de la correa de distribución',120000,NULL),
        (2,'Cambio de aceite','Sustitución del aceite de motor y filtro de aceite',15000,12),
        (2,'Filtro de aire','Sustitución del filtro de aire del motor',30000,24),
        (2,'Filtro de habitáculo','Sustitución del filtro de aire del habitáculo',15000,12),
        (2,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',45000,NULL),
        (2,'Correa de distribución','Sustitución de la correa de distribución',150000,NULL),
        (3,'Cambio de aceite','Sustitución del aceite de motor y filtro de aceite',15000,12),
        (3,'Filtro de aire','Sustitución del filtro de aire del motor',30000,24),
        (3,'Filtro de habitáculo','Sustitución del filtro de habitáculo',15000,12),
        (3,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',50000,NULL),
        (3,'Líquido de frenos','Sustitución del líquido de frenos',NULL,24),
        (4,'Cambio de aceite','Sustitución del aceite de motor y filtro de aceite',15000,12),
        (4,'Filtro de aire','Sustitución del filtro de aire del motor',30000,24),
        (4,'Filtro de habitáculo','Sustitución del filtro de habitáculo',15000,12),
        (4,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',50000,NULL),
        (4,'Bujías','Sustitución de bujías de encendido',60000,NULL),
        (5,'Cambio de aceite','Sustitución del aceite de motor y filtro de aceite',15000,12),
        (5,'Filtro de aire','Sustitución del filtro de aire del motor',30000,24),
        (5,'Filtro de habitáculo','Sustitución del filtro de habitáculo',15000,12),
        (5,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',40000,NULL),
        (5,'Bujías','Sustitución de bujías de encendido',60000,NULL),
        (6,'Cambio de aceite','Sustitución del aceite de motor y filtro de aceite',15000,12),
        (6,'Filtro de aire','Sustitución del filtro de aire del motor',30000,24),
        (6,'Filtro de habitáculo','Sustitución del filtro de habitáculo',15000,12),
        (6,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',50000,NULL),
        (6,'Líquido de frenos','Sustitución del líquido de frenos',NULL,24),
        (7,'Cambio de aceite','Sustitución del aceite de motor y filtro de aceite',10000,12),
        (7,'Filtro de aire','Sustitución del filtro de aire del motor',20000,24),
        (7,'Filtro de habitáculo','Sustitución del filtro de habitáculo',15000,12),
        (7,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',40000,NULL),
        (7,'Bujías','Sustitución de bujías de encendido',60000,NULL),
        (8,'Cambio de aceite','Sustitución del aceite de motor y filtro de aceite',10000,12),
        (8,'Filtro de aire','Sustitución del filtro de aire del motor',20000,24),
        (8,'Filtro de habitáculo','Sustitución del filtro de habitáculo',15000,12),
        (8,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',40000,NULL),
        (8,'Correa de distribución','Sustitución de la correa de distribución',120000,NULL),
        (9,'Cambio de aceite','Sustitución del aceite de motor y filtro de aceite',15000,12),
        (9,'Filtro de aire','Sustitución del filtro de aire del motor',30000,24),
        (9,'Filtro de habitáculo','Sustitución del filtro de habitáculo',15000,12),
        (9,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',50000,NULL),
        (9,'Líquido de frenos','Sustitución del líquido de frenos',NULL,24),
        (10,'Cambio de aceite','Aceite sintético de alta gama y filtro',15000,12),
        (10,'Filtro de aire','Sustitución del filtro de aire',30000,24),
        (10,'Filtro de habitáculo','Sustitución del filtro de micropartículas',20000,12),
        (10,'Pastillas de freno delanteras','Revisión pastillas y discos delanteros',40000,NULL),
        (10,'Bujías','Sustitución de bujías de iridio',60000,NULL),
        (11,'Cambio de aceite','Aceite sintético de alta gama y filtro',15000,12),
        (11,'Filtro de aire','Sustitución del filtro de aire',30000,24),
        (11,'Filtro de habitáculo','Sustitución del filtro de micropartículas',20000,12),
        (11,'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',40000,NULL),
        (11,'Bujías','Sustitución de bujías de iridio',60000,NULL),
        (12,'Cambio de aceite','Aceite sintético de alta gama y filtro',15000,12),
        (12,'Filtro de aire','Sustitución del filtro de aire',30000,24),
        (12,'Filtro de habitáculo','Sustitución del filtro de micropartículas',20000,12),
        (12,'Pastillas de freno delanteras','Revisión pastillas y discos delanteros',50000,NULL),
        (12,'Líquido de frenos','Sustitución del líquido de frenos',NULL,24),
        (13,'Cambio de aceite','Sustitución del aceite de motor sintético y filtro',10000,12),
        (13,'Filtro de aire','Sustitución del filtro de aire del motor',40000,36),
        (13,'Filtro de habitáculo','Sustitución del filtro de habitáculo',20000,12),
        (13,'Pastillas de freno','Revisión y sustitución de pastillas',60000,NULL),
        (13,'Líquido de frenos','Sustitución del líquido de frenos',NULL,24),
        (14,'Cambio de aceite','Sustitución del aceite de motor sintético y filtro',10000,12),
        (14,'Filtro de aire','Sustitución del filtro de aire del motor',40000,36),
        (14,'Filtro de habitáculo','Sustitución del filtro de habitáculo',20000,12),
        (14,'Pastillas de freno','Las pastillas duran más en híbrido por frenada regen',60000,NULL),
        (14,'Líquido de frenos','Sustitución del líquido de frenos',NULL,36),
        (15,'Cambio de aceite','Sustitución del aceite de motor sintético y filtro',10000,12),
        (15,'Filtro de aire','Sustitución del filtro de aire del motor',40000,36),
        (15,'Filtro de habitáculo','Sustitución del filtro de habitáculo',20000,12),
        (15,'Pastillas de freno','Revisión y sustitución de pastillas',60000,NULL),
        (15,'Líquido de frenos','Sustitución del líquido de frenos',NULL,24)");

    // fallos conocidos
    $pdo->exec("INSERT INTO fallos_conocidos (modelo_id, titulo, descripcion, km_inicio, km_fin, solucion, gravedad) VALUES
        (1,'Fallo en bobina de encendido','Fallo intermitente en la bobina de encendido que causa tirones y pérdida de potencia.',60000,90000,'Sustitución de la bobina de encendido. Coste aproximado 80-120€.','moderado'),
        (1,'Consumo elevado de aceite en motor TSI','Los motores TSI de 1.0 y 1.2 presentan consumo de aceite elevado entre revisiones.',50000,NULL,'Revisión de sellos de válvulas. Recomendable revisar nivel cada 2.000 km.','leve'),
        (2,'Fallo sensor MAF','El sensor de masa de aire falla causando consumo elevado y ralentí inestable.',80000,120000,'Limpieza o sustitución del sensor MAF. Coste 50-150€.','moderado'),
        (2,'Desgaste prematuro de embrague DSG','La caja DSG de 7 velocidades puede presentar tirones y desgaste prematuro del embrague seco.',50000,80000,'Revisión del embrague DSG en taller oficial. Posible sustitución.','moderado'),
        (3,'Ruido en suspensión delantera','Ruido tipo clac en la suspensión delantera al pasar por baches, especialmente en frío.',30000,NULL,'Revisión y engrase de rótulas y silent-blocks. Coste variable según desgaste.','leve'),
        (3,'Fallo en sensor de aparcamiento trasero','Los sensores de parking traseros pueden dar falsas alarmas o dejar de funcionar.',20000,NULL,'Sustitución del sensor defectuoso. Coste aproximado 50-80€ por sensor.','leve'),
        (4,'Consumo de aceite DSG','Las cajas DSG de doble embrague pueden presentar fugas de aceite.',60000,NULL,'Revisión y sustitución de retenes de la caja DSG. Revisión en taller oficial.','moderado'),
        (4,'Fallo en módulo de control del motor','El ECU puede presentar errores de comunicación en motores TDI.',100000,NULL,'Actualización de firmware en taller oficial o sustitución del módulo.','grave'),
        (5,'Consumo elevado de aceite motor TSI 1.0','El motor TSI de tres cilindros es propenso a consumir aceite entre cambios.',40000,NULL,'Revisar nivel cada 3.000 km. Si es excesivo, revisión de anillos.','leve'),
        (5,'Fallo en actuador del turbo','El actuador del turbocompresor puede fallar provocando pérdida de potencia.',70000,120000,'Sustitución del actuador del turbo. Coste aproximado 200-400€.','moderado'),
        (6,'Fallo en módulo de tracción 4Motion','El sistema de tracción total puede presentar errores en condiciones de baja temperatura.',50000,NULL,'Actualización de software del módulo 4Motion en taller oficial.','moderado'),
        (6,'Desgaste de inyectores TDI','Los inyectores de los motores diesel pueden desgastarse causando tirones al acelerar.',100000,NULL,'Limpieza o sustitución de inyectores. Coste 150-300€ por inyector.','grave'),
        (7,'Fallo en caja EDC (cambio automático)','La caja de cambios automática EDC puede presentar tirones y sobrecalentamiento.',40000,80000,'Revisión de la caja EDC y sustitución del aceite de la transmisión.','moderado'),
        (7,'Ruido en motor 1.0 TCe en arranque','Ruido metálico en el arranque en frío típico del motor tricilíndrico TCe.',0,NULL,'Normal en el diseño del motor. Si persiste revisar tensor de cadena.','leve'),
        (8,'Fallo en pantalla multifunción R-Link','La pantalla táctil puede bloquearse o reiniciarse sola, especialmente con calor.',20000,NULL,'Actualización de firmware del sistema R-Link. Si persiste, sustitución.','leve'),
        (8,'Correa de distribución desgastada antes de lo previsto','Algunos motores Energy dCi presentan desgaste prematuro de la correa de distribución.',80000,120000,'Revisión de la correa antes del intervalo recomendado. Sustitución preventiva.','grave'),
        (9,'Vibración en volante a altas velocidades','Vibración notable en el volante por encima de 100 km/h por desequilibrio en ruedas.',10000,NULL,'Equilibrado y alineación de ruedas. Revisar estado de neumáticos.','leve'),
        (9,'Fallo en sistema de climatización automática','La climatización puede dejar de responder o mostrar temperaturas incorrectas.',30000,NULL,'Revisión del sistema de climatización. Posible sustitución de sensores.','moderado'),
        (10,'Fallo en bomba de refrigerante','La bomba de agua eléctrica puede fallar causando sobrecalentamiento.',80000,120000,'Sustitución de la bomba de agua eléctrica. Coste 300-500€ en taller.','grave'),
        (10,'Consumo elevado de aceite N20','Los motores N20 de 4 cilindros son conocidos por consumir aceite entre revisiones.',30000,NULL,'Revisar nivel cada 3.000 km. Posible sustitución de anillos si es excesivo.','moderado'),
        (11,'Desgaste prematuro de frenos traseros','Los frenos traseros se desgastan más rápido de lo esperado por la distribución de peso.',30000,50000,'Revisión y sustitución de pastillas y discos traseros. Coste 200-350€.','moderado'),
        (11,'Fallo en módulo de dirección eléctrica','La dirección asistida eléctrica puede presentar falta de asistencia de forma intermitente.',40000,NULL,'Diagnóstico electrónico. Posible actualización de software o sustitución.','grave'),
        (12,'Fallo en transferencia xDrive','La caja de transferencia del sistema xDrive puede presentar ruidos y pérdida de tracción.',60000,NULL,'Revisión y sustitución del aceite de la transferencia. Coste 150-300€.','moderado'),
        (12,'Consumo elevado de AdBlue','El sistema de reducción de emisiones SCR puede consumir AdBlue de forma excesiva.',50000,NULL,'Revisión del sistema SCR y del inyector de AdBlue. Diagnóstico en taller.','leve'),
        (13,'Ruido en motor híbrido en arranque en frío','Ruido metálico leve en el arranque cuando las temperaturas son bajas.',0,NULL,'Normal en motores híbridos. Si persiste revisar tensor de cadena.','leve'),
        (13,'Degradación prematura de batería híbrida','La batería de alta tensión puede perder capacidad antes de lo esperado en climas cálidos.',80000,NULL,'Diagnóstico de la batería híbrida en taller Toyota. Garantía extendida disponible.','grave'),
        (14,'Ruido en suspensión trasera en baches','Ruido tipo golpe en la suspensión trasera al circular por pavimento irregular.',20000,NULL,'Revisión de silent-blocks y amortiguadores traseros.','leve'),
        (14,'Fallo en sensor de temperatura exterior','El sensor de temperatura exterior puede dar lecturas incorrectas afectando la climatización.',15000,NULL,'Sustitución del sensor de temperatura. Coste aproximado 40-80€.','leve'),
        (15,'Vibración en aceleración desde parado en modo híbrido','Vibración perceptible en la carrocería al acelerar desde 0 en modo completamente eléctrico.',0,NULL,'Normal en el funcionamiento del sistema híbrido. Sin solución necesaria.','leve'),
        (15,'Fallo en sistema AWD-i en terreno resbaladizo','El sistema de tracción total puede tardar en activarse en superficies con poca adherencia.',10000,NULL,'Actualización de software del sistema AWD-i en taller Toyota.','moderado')");

    echo "[migrate] Migración completada correctamente.\n";

} catch (PDOException $e) {
    echo "[migrate] Error: " . $e->getMessage() . "\n";
    exit(1);
}
