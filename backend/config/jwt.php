<?php
// configuracion y utilidades para JWT
// los tokens se usan para mantener la sesion del usuario

class JWT {
    private static $secret = "autoprevent_secret_key_2026";
    private static $expiration = 86400; // 24 horas en segundos

    // genera un token JWT para el usuario
    public static function generate($user_id, $email, $role = 'user') {
        $header = json_encode([
            "typ" => "JWT",
            "alg" => "HS256"
        ]);

        $payload = json_encode([
            "user_id" => $user_id,
            "email"   => $email,
            "role"    => $role,
            "iat"     => time(),
            "exp"     => time() + self::$expiration
        ]);

        $base64Header  = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac(
            'sha256',
            $base64Header . "." . $base64Payload,
            self::$secret,
            true
        );

        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }

    // valida el token y devuelve el payload si es correcto
    public static function validate($token) {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return false;
        }

        [$header, $payload, $signature] = $parts;

        $validSignature = str_replace(
            ['+', '/', '='],
            ['-', '_', ''],
            base64_encode(hash_hmac('sha256', $header . "." . $payload, self::$secret, true))
        );

        if ($signature !== $validSignature) {
            return false;
        }

        $decodedPayload = json_decode(base64_decode($payload), true);

        // comprobamos si el token ha expirado
        if ($decodedPayload['exp'] < time()) {
            return false;
        }

        return $decodedPayload;
    }

    // extrae el token del header Authorization
    // usa dos fuentes para cubrir Apache-module y CGI/FastCGI
    public static function getFromHeader() {
        $authHeader = null;

        // primera opcion: getallheaders() (Apache mod_php)
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            }
        }

        // segunda opcion: $_SERVER (CGI / FastCGI, o via RewriteRule en .htaccess)
        if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }

        if (!$authHeader) {
            return false;
        }

        // el header viene como "Bearer TOKEN"
        $parts = explode(' ', $authHeader);

        if (count($parts) !== 2 || $parts[0] !== 'Bearer') {
            return false;
        }

        return $parts[1];
    }
}