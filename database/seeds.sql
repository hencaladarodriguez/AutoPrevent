-- ============================================
-- AutoPrevent - Datos Precargados
-- Marcas, Modelos, Intervalos y Fallos
-- ============================================

-- --------------------------------------------
-- ADMIN por defecto
-- Password: Admin1234 (hash bcrypt)
-- --------------------------------------------
INSERT INTO admins (nombre, email, password) VALUES
('Administrador', 'admin@autoprevent.com', '$2y$10$DwVJEG0RcTQ/zQne5fvfjOe9.ZknFXtnsTYz5igCNm5k8X9I9saLO');

-- --------------------------------------------
-- MARCAS
-- --------------------------------------------
INSERT INTO marcas (nombre) VALUES
('Seat'),
('Volkswagen'),
('Renault'),
('BMW'),
('Toyota');

-- --------------------------------------------
-- MODELOS
-- id asignados por orden de insercion:
-- Seat:       Ibiza=1, Leon=2, Ateca=3
-- Volkswagen: Golf=4,  Polo=5, Tiguan=6
-- Renault:    Clio=7,  Megane=8, Kadjar=9
-- BMW:        Serie3=10, Serie1=11, X3=12
-- Toyota:     Corolla=13, Yaris=14, RAV4=15
-- --------------------------------------------
INSERT INTO modelos (marca_id, nombre, anio_inicio, anio_fin) VALUES
-- Seat (marca_id: 1)
(1, 'Ibiza',   2017, NULL),
(1, 'Leon',    2020, NULL),
(1, 'Ateca',   2016, NULL),
-- Volkswagen (marca_id: 2)
(2, 'Golf',    2019, NULL),
(2, 'Polo',    2017, NULL),
(2, 'Tiguan',  2016, NULL),
-- Renault (marca_id: 3)
(3, 'Clio',    2019, NULL),
(3, 'Megane',  2016, NULL),
(3, 'Kadjar',  2015, NULL),
-- BMW (marca_id: 4)
(4, 'Serie 3', 2019, NULL),
(4, 'Serie 1', 2019, NULL),
(4, 'X3',      2017, NULL),
-- Toyota (marca_id: 5)
(5, 'Corolla', 2018, NULL),
(5, 'Yaris',   2020, NULL),
(5, 'RAV4',    2018, NULL);

-- --------------------------------------------
-- TIPOS DE MANTENIMIENTO POR MODELO
-- --------------------------------------------
INSERT INTO tipos_mantenimiento (modelo_id, nombre, descripcion, intervalo_km, intervalo_meses) VALUES

-- Seat Ibiza (1)
(1, 'Cambio de aceite',             'Sustitución del aceite de motor y filtro de aceite',   10000,  12),
(1, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              20000,  24),
(1, 'Filtro de habitáculo',         'Sustitución del filtro de aire del habitáculo',         15000,  12),
(1, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        40000, NULL),
(1, 'Correa de distribución',       'Sustitución de la correa de distribución',             120000, NULL),

-- Seat Leon (2)
(2, 'Cambio de aceite',             'Sustitución del aceite de motor y filtro de aceite',   15000,  12),
(2, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              30000,  24),
(2, 'Filtro de habitáculo',         'Sustitución del filtro de aire del habitáculo',         15000,  12),
(2, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        45000, NULL),
(2, 'Correa de distribución',       'Sustitución de la correa de distribución',             150000, NULL),

-- Seat Ateca (3)
(3, 'Cambio de aceite',             'Sustitución del aceite de motor y filtro de aceite',   15000,  12),
(3, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              30000,  24),
(3, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  15000,  12),
(3, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        50000, NULL),
(3, 'Líquido de frenos',            'Sustitución del líquido de frenos',                     NULL,   24),

-- Volkswagen Golf (4)
(4, 'Cambio de aceite',             'Sustitución del aceite de motor y filtro de aceite',   15000,  12),
(4, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              30000,  24),
(4, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  15000,  12),
(4, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        50000, NULL),
(4, 'Bujías',                       'Sustitución de bujías de encendido',                    60000, NULL),

-- Volkswagen Polo (5)
(5, 'Cambio de aceite',             'Sustitución del aceite de motor y filtro de aceite',   15000,  12),
(5, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              30000,  24),
(5, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  15000,  12),
(5, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        40000, NULL),
(5, 'Bujías',                       'Sustitución de bujías de encendido',                    60000, NULL),

-- Volkswagen Tiguan (6)
(6, 'Cambio de aceite',             'Sustitución del aceite de motor y filtro de aceite',   15000,  12),
(6, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              30000,  24),
(6, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  15000,  12),
(6, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        50000, NULL),
(6, 'Líquido de frenos',            'Sustitución del líquido de frenos',                     NULL,   24),

-- Renault Clio (7)
(7, 'Cambio de aceite',             'Sustitución del aceite de motor y filtro de aceite',   10000,  12),
(7, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              20000,  24),
(7, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  15000,  12),
(7, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        40000, NULL),
(7, 'Bujías',                       'Sustitución de bujías de encendido',                    60000, NULL),

-- Renault Megane (8)
(8, 'Cambio de aceite',             'Sustitución del aceite de motor y filtro de aceite',   10000,  12),
(8, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              20000,  24),
(8, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  15000,  12),
(8, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        40000, NULL),
(8, 'Correa de distribución',       'Sustitución de la correa de distribución',             120000, NULL),

-- Renault Kadjar (9)
(9, 'Cambio de aceite',             'Sustitución del aceite de motor y filtro de aceite',   15000,  12),
(9, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              30000,  24),
(9, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  15000,  12),
(9, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        50000, NULL),
(9, 'Líquido de frenos',            'Sustitución del líquido de frenos',                     NULL,   24),

-- BMW Serie 3 (10)
(10, 'Cambio de aceite',             'Aceite sintético de alta gama y filtro',               15000,  12),
(10, 'Filtro de aire',               'Sustitución del filtro de aire',                        30000,  24),
(10, 'Filtro de habitáculo',         'Sustitución del filtro de micropartículas',             20000,  12),
(10, 'Pastillas de freno delanteras','Revisión pastillas y discos delanteros',               40000, NULL),
(10, 'Bujías',                       'Sustitución de bujías de iridio',                       60000, NULL),

-- BMW Serie 1 (11)
(11, 'Cambio de aceite',             'Aceite sintético de alta gama y filtro',               15000,  12),
(11, 'Filtro de aire',               'Sustitución del filtro de aire',                        30000,  24),
(11, 'Filtro de habitáculo',         'Sustitución del filtro de micropartículas',             20000,  12),
(11, 'Pastillas de freno delanteras','Revisión y sustitución de pastillas delanteras',        40000, NULL),
(11, 'Bujías',                       'Sustitución de bujías de iridio',                       60000, NULL),

-- BMW X3 (12)
(12, 'Cambio de aceite',             'Aceite sintético de alta gama y filtro',               15000,  12),
(12, 'Filtro de aire',               'Sustitución del filtro de aire',                        30000,  24),
(12, 'Filtro de habitáculo',         'Sustitución del filtro de micropartículas',             20000,  12),
(12, 'Pastillas de freno delanteras','Revisión pastillas y discos delanteros',               50000, NULL),
(12, 'Líquido de frenos',            'Sustitución del líquido de frenos',                     NULL,   24),

-- Toyota Corolla (13)
(13, 'Cambio de aceite',             'Sustitución del aceite de motor sintético y filtro',   10000,  12),
(13, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              40000,  36),
(13, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  20000,  12),
(13, 'Pastillas de freno',           'Revisión y sustitución de pastillas',                   60000, NULL),
(13, 'Líquido de frenos',            'Sustitución del líquido de frenos',                     NULL,   24),

-- Toyota Yaris (14)
(14, 'Cambio de aceite',             'Sustitución del aceite de motor sintético y filtro',   10000,  12),
(14, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              40000,  36),
(14, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  20000,  12),
(14, 'Pastillas de freno',           'Las pastillas duran más en híbrido por frenada regen',  60000, NULL),
(14, 'Líquido de frenos',            'Sustitución del líquido de frenos',                     NULL,   36),

-- Toyota RAV4 (15)
(15, 'Cambio de aceite',             'Sustitución del aceite de motor sintético y filtro',   10000,  12),
(15, 'Filtro de aire',               'Sustitución del filtro de aire del motor',              40000,  36),
(15, 'Filtro de habitáculo',         'Sustitución del filtro de habitáculo',                  20000,  12),
(15, 'Pastillas de freno',           'Revisión y sustitución de pastillas',                   60000, NULL),
(15, 'Líquido de frenos',            'Sustitución del líquido de frenos',                     NULL,   24);

-- --------------------------------------------
-- FALLOS CONOCIDOS PRECARGADOS
-- --------------------------------------------
INSERT INTO fallos_conocidos (modelo_id, titulo, descripcion, km_inicio, km_fin, solucion, gravedad) VALUES

-- Seat Ibiza (1)
(1, 'Fallo en bobina de encendido',
    'Fallo intermitente en la bobina de encendido que causa tirones y pérdida de potencia.',
    60000, 90000, 'Sustitución de la bobina de encendido. Coste aproximado 80-120€.', 'moderado'),
(1, 'Consumo elevado de aceite en motor TSI',
    'Los motores TSI de 1.0 y 1.2 presentan consumo de aceite elevado entre revisiones.',
    50000, NULL, 'Revisión de sellos de válvulas. Recomendable revisar nivel cada 2.000 km.', 'leve'),

-- Seat Leon (2)
(2, 'Fallo sensor MAF',
    'El sensor de masa de aire falla causando consumo elevado y ralentí inestable.',
    80000, 120000, 'Limpieza o sustitución del sensor MAF. Coste 50-150€.', 'moderado'),
(2, 'Desgaste prematuro de embrague DSG',
    'La caja DSG de 7 velocidades puede presentar tirones y desgaste prematuro del embrague seco.',
    50000, 80000, 'Revisión del embrague DSG en taller oficial. Posible sustitución.', 'moderado'),

-- Seat Ateca (3)
(3, 'Ruido en suspensión delantera',
    'Ruido tipo "clac" en la suspensión delantera al pasar por baches, especialmente en frío.',
    30000, NULL, 'Revisión y engrase de rótulas y silent-blocks. Coste variable según desgaste.', 'leve'),
(3, 'Fallo en sensor de aparcamiento trasero',
    'Los sensores de parking traseros pueden dar falsas alarmas o dejar de funcionar.',
    20000, NULL, 'Sustitución del sensor defectuoso. Coste aproximado 50-80€ por sensor.', 'leve'),

-- Volkswagen Golf (4)
(4, 'Consumo de aceite DSG',
    'Las cajas DSG de doble embrague pueden presentar fugas de aceite.',
    60000, NULL, 'Revisión y sustitución de retenes de la caja DSG. Revisión en taller oficial.', 'moderado'),
(4, 'Fallo en módulo de control del motor',
    'El ECU puede presentar errores de comunicación en motores TDI.',
    100000, NULL, 'Actualización de firmware en taller oficial o sustitución del módulo.', 'grave'),

-- Volkswagen Polo (5)
(5, 'Consumo elevado de aceite motor TSI 1.0',
    'El motor TSI de tres cilindros es propenso a consumir aceite entre cambios.',
    40000, NULL, 'Revisar nivel cada 3.000 km. Si es excesivo, revisión de anillos.', 'leve'),
(5, 'Fallo en actuador del turbo',
    'El actuador del turbocompresor puede fallar provocando pérdida de potencia.',
    70000, 120000, 'Sustitución del actuador del turbo. Coste aproximado 200-400€.', 'moderado'),

-- Volkswagen Tiguan (6)
(6, 'Fallo en módulo de tracción 4Motion',
    'El sistema de tracción total puede presentar errores en condiciones de baja temperatura.',
    50000, NULL, 'Actualización de software del módulo 4Motion en taller oficial.', 'moderado'),
(6, 'Desgaste de inyectores TDI',
    'Los inyectores de los motores diesel pueden desgastarse causando tirones al acelerar.',
    100000, NULL, 'Limpieza o sustitución de inyectores. Coste 150-300€ por inyector.', 'grave'),

-- Renault Clio (7)
(7, 'Fallo en caja EDC (cambio automático)',
    'La caja de cambios automática EDC puede presentar tirones y sobrecalentamiento.',
    40000, 80000, 'Revisión de la caja EDC y sustitución del aceite de la transmisión.', 'moderado'),
(7, 'Ruido en motor 1.0 TCe en arranque',
    'Ruido metálico en el arranque en frío típico del motor tricilíndrico TCe.',
    0, NULL, 'Normal en el diseño del motor. Si persiste revisar tensor de cadena.', 'leve'),

-- Renault Megane (8)
(8, 'Fallo en pantalla multifunción R-Link',
    'La pantalla táctil puede bloquearse o reiniciarse sola, especialmente con calor.',
    20000, NULL, 'Actualización de firmware del sistema R-Link. Si persiste, sustitución.', 'leve'),
(8, 'Correa de distribución desgastada antes de lo previsto',
    'Algunos motores Energy dCi presentan desgaste prematuro de la correa de distribución.',
    80000, 120000, 'Revisión de la correa antes del intervalo recomendado. Sustitución preventiva.', 'grave'),

-- Renault Kadjar (9)
(9, 'Vibración en volante a altas velocidades',
    'Vibración notable en el volante por encima de 100 km/h por desequilibrio en ruedas.',
    10000, NULL, 'Equilibrado y alineación de ruedas. Revisar estado de neumáticos.', 'leve'),
(9, 'Fallo en sistema de climatización automática',
    'La climatización puede dejar de responder o mostrar temperaturas incorrectas.',
    30000, NULL, 'Revisión del sistema de climatización. Posible sustitución de sensores.', 'moderado'),

-- BMW Serie 3 (10)
(10, 'Fallo en bomba de refrigerante',
    'La bomba de agua eléctrica puede fallar causando sobrecalentamiento.',
    80000, 120000, 'Sustitución de la bomba de agua eléctrica. Coste 300-500€ en taller.', 'grave'),
(10, 'Consumo elevado de aceite N20',
    'Los motores N20 de 4 cilindros son conocidos por consumir aceite entre revisiones.',
    30000, NULL, 'Revisar nivel cada 3.000 km. Posible sustitución de anillos si es excesivo.', 'moderado'),

-- BMW Serie 1 (11)
(11, 'Desgaste prematuro de frenos traseros',
    'Los frenos traseros se desgastan más rápido de lo esperado por la distribución de peso.',
    30000, 50000, 'Revisión y sustitución de pastillas y discos traseros. Coste 200-350€.', 'moderado'),
(11, 'Fallo en módulo de dirección eléctrica',
    'La dirección asistida eléctrica puede presentar falta de asistencia de forma intermitente.',
    40000, NULL, 'Diagnóstico electrónico. Posible actualización de software o sustitución.', 'grave'),

-- BMW X3 (12)
(12, 'Fallo en transferencia xDrive',
    'La caja de transferencia del sistema xDrive puede presentar ruidos y pérdida de tracción.',
    60000, NULL, 'Revisión y sustitución del aceite de la transferencia. Coste 150-300€.', 'moderado'),
(12, 'Consumo elevado de AdBlue',
    'El sistema de reducción de emisiones SCR puede consumir AdBlue de forma excesiva.',
    50000, NULL, 'Revisión del sistema SCR y del inyector de AdBlue. Diagnóstico en taller.', 'leve'),

-- Toyota Corolla (13)
(13, 'Ruido en motor híbrido en arranque en frío',
    'Ruido metálico leve en el arranque cuando las temperaturas son bajas.',
    0, NULL, 'Normal en motores híbridos. Si persiste revisar tensor de cadena.', 'leve'),
(13, 'Degradación prematura de batería híbrida',
    'La batería de alta tensión puede perder capacidad antes de lo esperado en climas cálidos.',
    80000, NULL, 'Diagnóstico de la batería híbrida en taller Toyota. Garantía extendida disponible.', 'grave'),

-- Toyota Yaris (14)
(14, 'Ruido en suspensión trasera en baches',
    'Ruido tipo golpe en la suspensión trasera al circular por pavimento irregular.',
    20000, NULL, 'Revisión de silent-blocks y amortiguadores traseros.', 'leve'),
(14, 'Fallo en sensor de temperatura exterior',
    'El sensor de temperatura exterior puede dar lecturas incorrectas afectando la climatización.',
    15000, NULL, 'Sustitución del sensor de temperatura. Coste aproximado 40-80€.', 'leve'),

-- Toyota RAV4 (15)
(15, 'Vibración en aceleración desde parado en modo híbrido',
    'Vibración perceptible en la carrocería al acelerar desde 0 en modo completamente eléctrico.',
    0, NULL, 'Normal en el funcionamiento del sistema híbrido. Sin solución necesaria.', 'leve'),
(15, 'Fallo en sistema AWD-i en terreno resbaladizo',
    'El sistema de tracción total puede tardar en activarse en superficies con poca adherencia.',
    10000, NULL, 'Actualización de software del sistema AWD-i en taller Toyota.', 'moderado');
