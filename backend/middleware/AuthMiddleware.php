<?php
// verificacion del token centralizada aqui para no repetirla en cada controller

require_once 'config/jwt.php';

class AuthMiddleware {

    // si el token es valido devuelve el payload, sino corta con 401
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

    // igual que verify pero ademas comprueba que sea admin
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
