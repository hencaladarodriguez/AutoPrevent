<?php
// punto de entrada principal de la API AutoPrevent
// todas las peticiones pasan por aqui

// en local apunta a localhost:5173, en Railway permite cualquier origen
// se puede restringir cuando se conozca la URL definitiva del frontend
header("Access-Control-Allow-Origin: *");
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