<?php
// CRUD de vehiculos, siempre comprobamos que el vehiculo sea del usuario

require_once 'config/database.php';
require_once 'middleware/AuthMiddleware.php';
require_once 'models/Vehicle.php';

class VehicleController {

    private $db;
    private $vehicle;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->vehicle = new Vehicle($this->db);
    }

    // devuelve los vehiculos activos del usuario
    public function getAll() {
        $payload = AuthMiddleware::verify();

        $vehiculos = $this->vehicle->getAll($payload['user_id']);

        echo json_encode([
            "vehiculos" => $vehiculos,
            "total" => count($vehiculos)
        ]);
    }

    // obtener un vehiculo por id
    public function getOne($id) {
        $payload = AuthMiddleware::verify();
        $vehiculo = $this->vehicle->getOne($id, $payload['user_id']);

        if (!$vehiculo) {
            http_response_code(404);
            echo json_encode(["error" => "Vehiculo no encontrado"]);
            return;
        }

        echo json_encode(["vehiculo" => $vehiculo]);
    }

    // crear vehiculo
    public function create() {
        $payload = AuthMiddleware::verify();
        $data = json_decode(file_get_contents("php://input"), true);

        // vin y color son opcionales
        if (
            empty($data['modelo_id']) ||
            empty($data['matricula']) ||
            empty($data['anio']) ||
            empty($data['kilometraje_actual']) ||
            empty($data['fecha_matriculacion'])
        ) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            return;
        }

        $data['vin'] = $data['vin'] ?? null;
        $data['color'] = $data['color'] ?? null;

        $id = $this->vehicle->create($data, $payload['user_id']);

        if ($id) {
            http_response_code(201);
            echo json_encode([
                "mensaje"    => "Vehiculo registrado correctamente",
                "vehiculo_id" => $id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al registrar el vehiculo"]);
        }
    }

    // actualizar vehiculo, merge manual para no perder campos no enviados
    public function update($id) {
        $payload = AuthMiddleware::verify();
        $data = json_decode(file_get_contents("php://input"), true);

        $vehiculo = $this->vehicle->getOne($id, $payload['user_id']);

        if (!$vehiculo) {
            http_response_code(404);
            echo json_encode(["error" => "Vehiculo no encontrado"]);
            return;
        }

        // mantenemos los valores actuales si no vienen en la peticion
        $data['modelo_id'] = $data['modelo_id'] ?? $vehiculo['modelo_id'];
        $data['matricula'] = $data['matricula'] ?? $vehiculo['matricula'];
        $data['vin'] = $data['vin'] ?? $vehiculo['vin'];
        $data['anio'] = $data['anio'] ?? $vehiculo['anio'];
        $data['kilometraje_actual'] = $data['kilometraje_actual'] ?? $vehiculo['kilometraje_actual'];
        $data['fecha_matriculacion']= $data['fecha_matriculacion']?? $vehiculo['fecha_matriculacion'];
        $data['color'] = $data['color'] ?? $vehiculo['color'];

        if ($this->vehicle->update($id, $data, $payload['user_id'])) {
            echo json_encode(["mensaje" => "Vehiculo actualizado correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar el vehiculo"]);
        }
    }

    // borrado logico, ponemos activo=0
    public function delete($id) {
        $payload = AuthMiddleware::verify();
        $vehiculo = $this->vehicle->getOne($id, $payload['user_id']);

        if (!$vehiculo) {
            http_response_code(404);
            echo json_encode(["error" => "Vehiculo no encontrado"]);
            return;
        }

        if ($this->vehicle->delete($id, $payload['user_id'])) {
            echo json_encode(["mensaje" => "Vehiculo eliminado correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar el vehiculo"]);
        }
    }
}