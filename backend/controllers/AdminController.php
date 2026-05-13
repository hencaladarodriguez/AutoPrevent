<?php
// controlador del panel de administracion
// solo accesible con token de admin

require_once 'config/database.php';
require_once 'middleware/AuthMiddleware.php';

class AdminController {

    private $db;

    public function __construct() {
        $database  = new Database();
        $this->db  = $database->getConnection();
    }

    // GET /admin/marcas
    public function getMarcas() {
        AuthMiddleware::verifyAdmin();
        $query = "SELECT * FROM marcas ORDER BY nombre ASC";
        $stmt  = $this->db->prepare($query);
        $stmt->execute();
        echo json_encode(["marcas" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    // POST /admin/marcas
    public function createMarca() {
        AuthMiddleware::verifyAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['nombre'])) {
            http_response_code(400);
            echo json_encode(["error" => "El nombre es obligatorio"]);
            return;
        }

        $query = "INSERT INTO marcas (nombre) VALUES (:nombre)";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':nombre', $data['nombre']);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "mensaje" => "Marca creada correctamente",
                "id"      => $this->db->lastInsertId()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al crear la marca"]);
        }
    }

    // POST /admin/modelos
    public function createModelo() {
        AuthMiddleware::verifyAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['marca_id']) || empty($data['nombre']) || empty($data['anio_inicio'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            return;
        }

        $query  = "INSERT INTO modelos (marca_id, nombre, anio_inicio, anio_fin) ";
        $query .= "VALUES (:marca_id, :nombre, :anio_inicio, :anio_fin)";
        $stmt   = $this->db->prepare($query);
        $stmt->bindParam(':marca_id',    $data['marca_id']);
        $stmt->bindParam(':nombre',      $data['nombre']);
        $stmt->bindParam(':anio_inicio', $data['anio_inicio']);
        $stmt->bindParam(':anio_fin',    $data['anio_fin'] ?? null);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "mensaje" => "Modelo creado correctamente",
                "id"      => $this->db->lastInsertId()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al crear el modelo"]);
        }
    }

    // POST /admin/fallos
    public function createFallo() {
        AuthMiddleware::verifyAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['modelo_id']) || empty($data['titulo']) || empty($data['descripcion'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            return;
        }

        $query  = "INSERT INTO fallos_conocidos ";
        $query .= "(modelo_id, titulo, descripcion, km_inicio, km_fin, solucion, gravedad) ";
        $query .= "VALUES (:modelo_id, :titulo, :descripcion, :km_inicio, :km_fin, :solucion, :gravedad)";
        $stmt   = $this->db->prepare($query);
        $stmt->bindParam(':modelo_id',   $data['modelo_id']);
        $stmt->bindParam(':titulo',      $data['titulo']);
        $stmt->bindParam(':descripcion', $data['descripcion']);
        $stmt->bindParam(':km_inicio',   $data['km_inicio']  ?? null);
        $stmt->bindParam(':km_fin',      $data['km_fin']     ?? null);
        $stmt->bindParam(':solucion',    $data['solucion']   ?? null);
        $stmt->bindParam(':gravedad',    $data['gravedad']   ?? 'moderado');

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "mensaje" => "Fallo conocido añadido correctamente",
                "id"      => $this->db->lastInsertId()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al crear el fallo"]);
        }
    }
}