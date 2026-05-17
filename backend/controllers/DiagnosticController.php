<?php
// controlador del diagnostico colaborativo

require_once 'config/database.php';
require_once 'middleware/AuthMiddleware.php';
require_once 'models/Diagnostic.php';
require_once 'models/Vehicle.php';

class DiagnosticController {

    private $db;
    private $diagnostic;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->diagnostic = new Diagnostic($this->db);
    }

    // GET /diagnostico?modelo_id=1
    public function getAll() {
        $payload   = AuthMiddleware::verify();
        $modelo_id = $_GET['modelo_id'] ?? null;

        if (!$modelo_id) {
            http_response_code(400);
            echo json_encode(["error" => "modelo_id es obligatorio"]);
            return;
        }

        $fallos          = $this->diagnostic->getFallosConocidos($modelo_id);
        $incidencias     = $this->diagnostic->getIncidencias($modelo_id);
        $mis_incidencias = $this->diagnostic->getIncidenciasByUser($modelo_id, $payload['user_id']);

        echo json_encode([
            "fallos_conocidos" => $fallos,
            "incidencias"      => $incidencias,
            "mis_incidencias"  => $mis_incidencias
        ]);
    }

    // POST /diagnostico — crear incidencia
    public function create() {
        $payload = AuthMiddleware::verify();
        $data    = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data['vehiculo_id']) ||
            empty($data['titulo']) ||
            empty($data['descripcion']) ||
            empty($data['fecha'])
        ) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            return;
        }

        // verificamos que el vehiculo pertenece al usuario
        $vehicle  = new Vehicle($this->db);
        $vehiculo = $vehicle->getOne($data['vehiculo_id'], $payload['user_id']);

        if (!$vehiculo) {
            http_response_code(404);
            echo json_encode(["error" => "Vehiculo no encontrado"]);
            return;
        }

        $data['kilometraje'] = $data['kilometraje'] ?? null;

        $id = $this->diagnostic->createIncidencia($data, $payload['user_id']);

        if ($id) {
            http_response_code(201);
            echo json_encode([
                "mensaje"       => "Incidencia guardada",
                "incidencia_id" => $id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al guardar la incidencia"]);
        }
    }

    // PUT /diagnostico/{id} — editar incidencia (solo el creador)
    public function update($id) {
        $payload = AuthMiddleware::verify();
        $data    = json_decode(file_get_contents("php://input"), true);

        if (empty($data['titulo']) || empty($data['descripcion']) || empty($data['fecha'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            return;
        }

        $data['kilometraje'] = $data['kilometraje'] ?? null;

        $ok = $this->diagnostic->updateIncidencia($id, $data, $payload['user_id']);

        if ($ok) {
            echo json_encode(["mensaje" => "Incidencia actualizada"]);
        } else {
            http_response_code(403);
            echo json_encode(["error" => "No tienes permiso para editar esta incidencia"]);
        }
    }

    // DELETE /diagnostico/{id} — eliminar incidencia (solo el creador)
    public function delete($id) {
        $payload = AuthMiddleware::verify();
        $ok      = $this->diagnostic->deleteIncidencia($id, $payload['user_id']);

        if ($ok) {
            echo json_encode(["mensaje" => "Incidencia eliminada"]);
        } else {
            http_response_code(403);
            echo json_encode(["error" => "No tienes permiso para eliminar esta incidencia"]);
        }
    }

    // POST /diagnostico/{id}/votar
    public function votar($incidencia_id) {
        $payload   = AuthMiddleware::verify();
        $resultado = $this->diagnostic->votar($incidencia_id, $payload['user_id']);

        if ($resultado === "ya_votado") {
            http_response_code(409);
            echo json_encode(["error" => "Ya has votado esta incidencia"]);
        } else {
            echo json_encode(["mensaje" => "Voto añadido"]);
        }
    }
}