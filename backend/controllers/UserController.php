<?php
// controlador del perfil de usuario — datos personales, contraseña y baja de cuenta

require_once 'config/database.php';
require_once 'middleware/AuthMiddleware.php';

class UserController {

    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // GET /perfil — devuelve los datos del usuario autenticado
    public function getProfile() {
        $payload = AuthMiddleware::verify();

        $query = "SELECT id, nombre, apellidos, email, fecha_nacimiento, fecha_registro FROM usuarios WHERE id = :id AND activo = 1";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':id', $payload['user_id']);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$usuario) {
            http_response_code(404);
            echo json_encode(["error" => "Usuario no encontrado"]);
            return;
        }

        echo json_encode(["usuario" => $usuario]);
    }

    // PUT /perfil — actualiza nombre, apellidos y fecha de nacimiento (email inmutable)
    public function updateProfile() {
        $payload = AuthMiddleware::verify();
        $data    = json_decode(file_get_contents("php://input"), true);

        if (empty($data['nombre']) || empty($data['apellidos'])) {
            http_response_code(400);
            echo json_encode(["error" => "Nombre y apellidos son obligatorios"]);
            return;
        }

        $fecha_nacimiento = !empty($data['fecha_nacimiento']) ? $data['fecha_nacimiento'] : null;

        // validaciones de fecha de nacimiento
        if ($fecha_nacimiento !== null) {
            $hoy       = new DateTime();
            $nacimiento = new DateTime($fecha_nacimiento);
            $edad      = (int) $hoy->diff($nacimiento)->y;

            if ($edad < 16) {
                http_response_code(400);
                echo json_encode(["error" => "Debes tener al menos 16 años para registrar una fecha de nacimiento"]);
                return;
            }

            if ($edad > 115) {
                http_response_code(400);
                echo json_encode(["error" => "La fecha de nacimiento no es valida (maxima edad: 115 años)"]);
                return;
            }
        }

        $query = "UPDATE usuarios SET nombre = :nombre, apellidos = :apellidos, fecha_nacimiento = :fecha_nacimiento WHERE id = :id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':nombre',           $data['nombre']);
        $stmt->bindParam(':apellidos',        $data['apellidos']);
        $stmt->bindParam(':fecha_nacimiento', $fecha_nacimiento);
        $stmt->bindParam(':id',               $payload['user_id']);
        $stmt->execute();

        // devolvemos el usuario actualizado para que el front refresque el contexto
        $query = "SELECT id, nombre, apellidos, email, fecha_nacimiento FROM usuarios WHERE id = :id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':id', $payload['user_id']);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "mensaje"  => "Perfil actualizado",
            "usuario"  => $usuario
        ]);
    }

    // PUT /perfil/password — cambia la contraseña verificando la actual
    public function updatePassword() {
        $payload = AuthMiddleware::verify();
        $data    = json_decode(file_get_contents("php://input"), true);

        if (empty($data['password_actual']) || empty($data['password_nuevo'])) {
            http_response_code(400);
            echo json_encode(["error" => "La contraseña actual y la nueva son obligatorias"]);
            return;
        }

        if (strlen($data['password_nuevo']) < 6) {
            http_response_code(400);
            echo json_encode(["error" => "La nueva contraseña debe tener al menos 6 caracteres"]);
            return;
        }

        if ($data['password_actual'] === $data['password_nuevo']) {
            http_response_code(400);
            echo json_encode(["error" => "La nueva contraseña no puede ser igual a la actual"]);
            return;
        }

        // verificamos la contraseña actual antes de cambiarla
        $query = "SELECT password FROM usuarios WHERE id = :id AND activo = 1";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':id', $payload['user_id']);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$usuario || !password_verify($data['password_actual'], $usuario['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "La contraseña actual no es correcta"]);
            return;
        }

        $nuevo_hash = password_hash($data['password_nuevo'], PASSWORD_BCRYPT);
        $query = "UPDATE usuarios SET password = :password WHERE id = :id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':password', $nuevo_hash);
        $stmt->bindParam(':id',       $payload['user_id']);
        $stmt->execute();

        echo json_encode(["mensaje" => "Contraseña actualizada"]);
    }

    // DELETE /perfil — borrado lógico (activo = 0) previa confirmación de contraseña
    public function deleteAccount() {
        $payload = AuthMiddleware::verify();
        $data    = json_decode(file_get_contents("php://input"), true);

        if (empty($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Debes confirmar tu contraseña para eliminar la cuenta"]);
            return;
        }

        $query = "SELECT password FROM usuarios WHERE id = :id AND activo = 1";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':id', $payload['user_id']);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$usuario || !password_verify($data['password'], $usuario['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "Contraseña incorrecta"]);
            return;
        }

        // borrado lógico: el usuario queda inactivo, sus datos siguen en BD
        $query = "UPDATE usuarios SET activo = 0 WHERE id = :id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':id', $payload['user_id']);
        $stmt->execute();

        echo json_encode(["mensaje" => "Cuenta desactivada"]);
    }
}
