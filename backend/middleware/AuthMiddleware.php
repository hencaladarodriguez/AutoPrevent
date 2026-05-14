<?php
// centralizo la verificación del token aquí para no repetir la lógica en cada controller
// si falla el token cortamos con exit() para que no continúe ejecutándose nada más

require_once 'config/jwt.php';

class AuthMiddleware {

    // devuelve el payload si todo va bien, o corta la ejecución con 401
    public static function verify() {
        $token = JWT::getFromHeader();

        if (!$token) {
            http_response_code(401);
            echo json_encode(["error" => "Token no proporcionado"]);
            exit();
        }

        $payload = JWT::validate($token);

        if (!$payload) {
            http_response_code(401);
            echo json_encode(["error" => "Token inválido o expirado"]);
            exit();
        }

        return $payload;
    }

    // las rutas de admin necesitan además que el rol sea 'admin', un token de usuario normal no vale
    public static function verifyAdmin() {
        $payload = self::verify();

        if ($payload['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["error" => "Acceso no autorizado"]);
            exit();
        }

        return $payload;
    }
}
