<?php
// controlador del historial de mantenimiento

require_once 'config/database.php';
require_once 'middleware/AuthMiddleware.php';
require_once 'models/History.php';
require_once 'models/Vehicle.php';

class HistoryController {

    private $db;
    private $history;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->history = new History($this->db);
    }

    // GET /historial?vehiculo_id=1
    public function getAll() {
        $payload     = AuthMiddleware::verify();
        $vehiculo_id = $_GET['vehiculo_id'] ?? null;

        if (!$vehiculo_id) {
            http_response_code(400);
            echo json_encode(["error" => "vehiculo_id es obligatorio"]);
            return;
        }

        // comprobamos que el vehiculo pertenece al usuario
        $vehicle  = new Vehicle($this->db);
        $vehiculo = $vehicle->getOne($vehiculo_id, $payload['user_id']);

        if (!$vehiculo) {
            http_response_code(404);
            echo json_encode(["error" => "Vehiculo no encontrado"]);
            return;
        }

        $historial = $this->history->getAll($vehiculo_id);

        echo json_encode([
            "historial" => $historial,
            "total" => count($historial)
        ]);
    }

    // GET /historial/{id}
    public function getOne($id) {
        AuthMiddleware::verify();
        $registro = $this->history->getOne($id);

        if (!$registro) {
            http_response_code(404);
            echo json_encode(["error" => "Registro no encontrado"]);
            return;
        }

        echo json_encode(["registro" => $registro]);
    }

    // POST /historial
    public function create() {
        $payload = AuthMiddleware::verify();
        $data    = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data['vehiculo_id']) ||
            empty($data['descripcion']) ||
            empty($data['kilometraje']) ||
            empty($data['fecha'])
        ) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            return;
        }

        // comprobamos que el vehiculo pertenece al usuario
        $vehicle  = new Vehicle($this->db);
        $vehiculo = $vehicle->getOne($data['vehiculo_id'], $payload['user_id']);

        if (!$vehiculo) {
            http_response_code(404);
            echo json_encode(["error" => "Vehiculo no encontrado"]);
            return;
        }

        // campos opcionales
        $data['tipo_mantenimiento_id'] = $data['tipo_mantenimiento_id'] ?? null;
        $data['coste'] = $data['coste'] ?? null;
        $data['taller'] = $data['taller'] ?? null;
        $data['tipo_entrada'] = $data['tipo_entrada'] ?? 'manual';

        $id = $this->history->create($data);

        if ($id) {
            http_response_code(201);
            echo json_encode([
                "mensaje" => "Registro añadido al historial",
                "registro_id" => $id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al guardar el registro"]);
        }
    }

    // DELETE /historial/{id}
    public function delete($id) {
        AuthMiddleware::verify();
        $registro = $this->history->getOne($id);

        if (!$registro) {
            http_response_code(404);
            echo json_encode(["error" => "Registro no encontrado"]);
            return;
        }

        if ($this->history->delete($id)) {
            echo json_encode(["mensaje" => "Registro eliminado correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar el registro"]);
        }
    }
}