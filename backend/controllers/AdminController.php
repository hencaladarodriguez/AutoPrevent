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
                "mensaje" => "Marca añadida",
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
                "mensaje" => "Modelo añadido",
                "id"      => $this->db->lastInsertId()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al crear el modelo"]);
        }
    }

    // GET /admin/fallos — lista los fallos de un modelo
    public function getFallos() {
        AuthMiddleware::verifyAdmin();
        $modelo_id = $_GET['modelo_id'] ?? null;

        if (!$modelo_id) {
            http_response_code(400);
            echo json_encode(["error" => "modelo_id es obligatorio"]);
            return;
        }

        $query = "SELECT * FROM fallos_conocidos WHERE modelo_id = :modelo_id ORDER BY gravedad DESC";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':modelo_id', $modelo_id);
        $stmt->execute();
        echo json_encode(["fallos" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    // GET /admin/incidencias?modelo_id=X — lista incidencias de usuarios para moderar
    public function getIncidencias() {
        AuthMiddleware::verifyAdmin();
        $modelo_id = $_GET['modelo_id'] ?? null;

        if (!$modelo_id) {
            http_response_code(400);
            echo json_encode(["error" => "modelo_id es obligatorio"]);
            return;
        }

        $query  = "SELECT i.*, u.nombre as autor, u.email as autor_email, v.matricula ";
        $query .= "FROM incidencias_usuarios i ";
        $query .= "JOIN vehiculos v ON i.vehiculo_id = v.id ";
        $query .= "JOIN usuarios u ON i.usuario_id = u.id ";
        $query .= "WHERE v.modelo_id = :modelo_id ";
        $query .= "ORDER BY i.fecha_registro DESC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':modelo_id', $modelo_id);
        $stmt->execute();
        echo json_encode(["incidencias" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    // DELETE /admin/incidencias/{id} — borrado de incidencia spam por admin
    public function deleteIncidencia($id) {
        AuthMiddleware::verifyAdmin();

        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID de incidencia obligatorio"]);
            return;
        }

        $query = "DELETE FROM incidencias_usuarios WHERE id = :id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["mensaje" => "Incidencia eliminada"]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Incidencia no encontrada"]);
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
                "mensaje" => "Fallo añadido",
                "id"      => $this->db->lastInsertId()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al crear el fallo"]);
        }
    }
}