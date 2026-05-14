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
-- --------------------------------------------
INSERT INTO modelos (marca_id, nombre, anio_inicio, anio_fin) VALUES
-- Seat (id: 1)
(1, 'Ibiza', 2017, NULL),
(1, 'Leon', 2020, NULL),
(1, 'Ateca', 2016, NULL),
-- Volkswagen (id: 2)
(2, 'Golf', 2019, NULL),
(2, 'Polo', 2017, NULL),
(2, 'Tiguan', 2016, NULL),
-- Renault (id: 3)
(3, 'Clio', 2019, NULL),
(3, 'Megane', 2016, NULL),
(3, 'Kadjar', 2015, NULL),
-- BMW (id: 4)
(4, 'Serie 3', 2019, NULL),
(4, 'Serie 1', 2019, NULL),
(4, 'X3', 2017, NULL),
-- Toyota (id: 5)
(5, 'Corolla', 2018, NULL),
(5, 'Yaris', 2020, NULL),
(5, 'RAV4', 2018, NULL);

-- --------------------------------------------
-- TIPOS DE MANTENIMIENTO POR MODELO
-- Seat Ibiza (modelo_id: 1)
-- --------------------------------------------
INSERT INTO tipos_mantenimiento (modelo_id, nombre, descripcion, intervalo_km, intervalo_meses) VALUES
(1, 'Cambio de aceite', 'Sustitución del aceite de motor y filtro de aceite', 10000, 12),
(1, 'Filtro de aire', 'Sustitución del filtro de aire del motor', 20000, 24),
(1, 'Filtro de habitáculo', 'Sustitución del filtro de aire del habitáculo', 15000, 12),
(1, 'Pastillas de freno delanteras', 'Revisión y sustitución de pastillas delanteras', 40000, NULL),
(1, 'Correa de distribución', 'Sustitución de la correa de distribución', 120000, NULL),
-- Seat Leon (modelo_id: 2)
(2, 'Cambio de aceite', 'Sustitución del aceite de motor y filtro de aceite', 15000, 12),
(2, 'Filtro de aire', 'Sustitución del filtro de aire del motor', 30000, 24),
(2, 'Filtro de habitáculo', 'Sustitución del filtro de aire del habitáculo', 15000, 12),
(2, 'Pastillas de freno delanteras', 'Revisión y sustitución de pastillas delanteras', 45000, NULL),
(2, 'Correa de distribución', 'Sustitución de la correa de distribución', 150000, NULL),
-- Volkswagen Golf (modelo_id: 4)
(4, 'Cambio de aceite', 'Sustitución del aceite de motor y filtro de aceite', 15000, 12),
(4, 'Filtro de aire', 'Sustitución del filtro de aire del motor', 30000, 24),
(4, 'Filtro de habitáculo', 'Sustitución del filtro de habitáculo', 15000, 12),
(4, 'Pastillas de freno delanteras', 'Revisión y sustitución de pastillas delanteras', 50000, NULL),
(4, 'Bujías', 'Sustitución de bujías de encendido', 60000, NULL),
-- Toyota Corolla (modelo_id: 13)
(13, 'Cambio de aceite', 'Sustitución del aceite de motor sintético y filtro', 10000, 12),
(13, 'Filtro de aire', 'Sustitución del filtro de aire del motor', 40000, 36),
(13, 'Filtro de habitáculo', 'Sustitución del filtro de habitáculo', 20000, 12),
(13, 'Pastillas de freno', 'Revisión y sustitución de pastillas', 60000, NULL),
(13, 'Líquido de frenos', 'Sustitución del líquido de frenos', NULL, 24),
-- BMW Serie 3 (modelo_id: 10)
(10, 'Cambio de aceite', 'Aceite sintético de alta gama y filtro', 15000, 12),
(10, 'Filtro de aire', 'Sustitución del filtro de aire', 30000, 24),
(10, 'Filtro de habitáculo', 'Sustitución del filtro de micropartículas', 20000, 12),
(10, 'Pastillas de freno delanteras', 'Revisión pastillas y discos delanteros', 40000, NULL),
(10, 'Bujías', 'Sustitución de bujías de iridio', 60000, NULL);

-- --------------------------------------------
-- FALLOS CONOCIDOS PRECARGADOS
-- --------------------------------------------
INSERT INTO fallos_conocidos (modelo_id, titulo, descripcion, km_inicio, km_fin, solucion, gravedad) VALUES
-- Seat Ibiza
(1, 'Fallo en bobina de encendido', 'Fallo intermitente en la bobina de encendido que causa tirones y pérdida de potencia.', 60000, 90000, 'Sustitución de la bobina de encendido. Coste aproximado 80-120€.', 'moderado'),
(1, 'Consumo elevado de aceite en motor TSI', 'Los motores TSI de 1.0 y 1.2 presentan consumo de aceite elevado entre revisiones.', 50000, NULL, 'Revisión de sellos de válvulas. Recomendable revisar nivel cada 2.000 km.', 'leve'),
-- Seat Leon
(2, 'Fallo sensor MAF', 'El sensor de masa de aire falla causando consumo elevado y ralentí inestable.', 80000, 120000, 'Limpieza o sustitución del sensor MAF. Coste 50-150€.', 'moderado'),
-- Volkswagen Golf
(4, 'Consumo de aceite DSG', 'Las cajas DSG de doble embrague pueden presentar fugas de aceite.', 60000, NULL, 'Revisión y sustitución de retenes de la caja DSG. Revisión en taller oficial.', 'moderado'),
(4, 'Fallo en módulo de control del motor', 'El ECU puede presentar errores de comunicación en motores TDI.', 100000, NULL, 'Actualización de firmware en taller oficial o sustitución del módulo.', 'grave'),
-- Toyota Corolla
(13, 'Ruido en motor híbrido en arranque en frío', 'Ruido metálico leve en el arranque cuando las temperaturas son bajas.', 0, NULL, 'Normal en motores híbridos. Si persiste revisar tensor de cadena.', 'leve'),
-- BMW Serie 3
(10, 'Fallo en bomba de refrigerante', 'La bomba de agua eléctrica puede fallar causando sobrecalentamiento.', 80000, 120000, 'Sustitución de la bomba de agua eléctrica. Coste 300-500€ en taller.', 'grave'),
(10, 'Consumo elevado de aceite N20', 'Los motores N20 de 4 cilindros son conocidos por consumir aceite entre revisiones.', 30000, NULL, 'Revisar nivel cada 3.000 km. Posible sustitución de anillos si es excesivo.', 'moderado');