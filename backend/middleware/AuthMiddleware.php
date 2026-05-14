<?php
// middleware de autenticacion
// protege las rutas que requieren token valido

require_once 'config/jwt.php';

class AuthMiddleware {

    // comprueba que el token es valido y devuelve el payload
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

    // comprobacion de que el token es de admin
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
