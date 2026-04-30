<?php
// rutas de la API AutoPrevent

$request_uri = $_SERVER['REQUEST_URI'];
$method      = $_SERVER['REQUEST_METHOD'];

// limpiamos la ruta
$base_path = '/AutoPrevent/backend';
$path      = str_replace($base_path, '', parse_url($request_uri, PHP_URL_PATH));

// separamos los segmentos de la ruta
$segments = explode('/', trim($path, '/'));
$resource = $segments[0] ?? '';
$id       = $segments[1] ?? null;

$action = $method . ' ' . $resource;

switch ($action) {

    // -- AUTENTICACION --
    case 'POST auth':
        $sub = $segments[1] ?? '';
        require_once 'controllers/AuthController.php';
        $controller = new AuthController();
        switch ($sub) {
            case 'register':
                $controller->register();
                break;
            case 'login':
                $controller->login();
                break;
            default:
                http_response_code(404);
                echo json_encode(["error" => "Ruta auth no encontrada"]);
        }
        break;

    // -- ADMIN --
    case 'POST admin':
    case 'GET admin':
        $sub = $segments[1] ?? '';
        switch ($sub) {
            case 'login':
                require_once 'controllers/AuthController.php';
                $controller = new AuthController();
                $controller->adminLogin();
                break;
            default:
                require_once 'controllers/AdminController.php';
                $admin = new AdminController();
                switch ($method . ' ' . $sub) {
                    case 'GET marcas':
                        $admin->getMarcas();
                        break;
                    case 'POST marcas':
                        $admin->createMarca();
                        break;
                    case 'GET fallos':
                        $admin->getFallos();
                        break;
                    case 'POST fallos':
                        $admin->createFallo();
                        break;
                    default:
                        http_response_code(404);
                        echo json_encode(["error" => "Ruta admin no encontrada"]);
                }
        }
        break;

    // -- VEHICULOS --
    case 'GET vehiculos':
        require_once 'controllers/VehicleController.php';
        $controller = new VehicleController();
        $id ? $controller->getOne($id) : $controller->getAll();
        break;

    case 'POST vehiculos':
        require_once 'controllers/VehicleController.php';
        $controller = new VehicleController();
        $controller->create();
        break;

    case 'PUT vehiculos':
        require_once 'controllers/VehicleController.php';
        $controller = new VehicleController();
        $controller->update($id);
        break;

    case 'DELETE vehiculos':
        require_once 'controllers/VehicleController.php';
        $controller = new VehicleController();
        $controller->delete($id);
        break;

    // -- HISTORIAL --
    case 'GET historial':
        require_once 'controllers/HistoryController.php';
        $controller = new HistoryController();
        $id ? $controller->getOne($id) : $controller->getAll();
        break;

    case 'POST historial':
        require_once 'controllers/HistoryController.php';
        $controller = new HistoryController();
        $controller->create();
        break;

    case 'DELETE historial':
        require_once 'controllers/HistoryController.php';
        $controller = new HistoryController();
        $controller->delete($id);
        break;

    // -- DIAGNOSTICO --
    case 'GET diagnostico':
        require_once 'controllers/DiagnosticController.php';
        $controller = new DiagnosticController();
        $id ? $controller->getOne($id) : $controller->getAll();
        break;

    case 'POST diagnostico':
        require_once 'controllers/DiagnosticController.php';
        $controller = new DiagnosticController();
        $sub = $segments[2] ?? null;
        $sub === 'votar' ? $controller->votar($id) : $controller->create();
        break;

    // -- RUTA NO ENCONTRADA --
    default:
        http_response_code(404);
        echo json_encode([
            "error"  => "Ruta no encontrada",
            "path"   => $path,
            "method" => $method
        ]);
}