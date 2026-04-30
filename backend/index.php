<?php
// punto de entrada principal de la API AutoPrevent
// todas las peticiones pasan por aqui

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// si es una peticion OPTIONS la dejamos pasar (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// cargamos las rutas
require_once 'routes/api.php';