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
                    case 'POST modelos':
                        $admin->createModelo();
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

    // -- MARCAS Y MODELOS (publicas para el formulario de vehiculos) --
    case 'GET marcas':
        require_once 'config/database.php';
        require_once 'models/Vehicle.php';
        $database = new Database();
        $vehicle  = new Vehicle($database->getConnection());
        echo json_encode(["marcas" => $vehicle->getMarcas()]);
        break;

    case 'GET modelos':
        require_once 'config/database.php';
        require_once 'models/Vehicle.php';
        $database  = new Database();
        $vehicle   = new Vehicle($database->getConnection());
        $marca_id  = $_GET['marca_id'] ?? null;
        if (!$marca_id) {
            http_response_code(400);
            echo json_encode(["error" => "marca_id es obligatorio"]);
            break;
        }
        echo json_encode(["modelos" => $vehicle->getModelosByMarca($marca_id)]);
        break;

    // -- SEMAFORO --
    case 'GET semaforo':
        require_once 'config/database.php';
        require_once 'middleware/AuthMiddleware.php';
        require_once 'models/Vehicle.php';
        require_once 'utils/SemaphoreEngine.php';

        $payload  = AuthMiddleware::verify();
        $database = new Database();
        $db       = $database->getConnection();
        $vehicle  = new Vehicle($db);

        if ($id) {
            $vehiculo = $vehicle->getOne($id, $payload['user_id']);
            if (!$vehiculo) {
                http_response_code(404);
                echo json_encode(["error" => "Vehiculo no encontrado"]);
                break;
            }
            echo json_encode(SemaphoreEngine::calcularEstado($vehiculo, $db));
        } else {
            $vehiculos  = $vehicle->getAll($payload['user_id']);
            $resultados = [];
            foreach ($vehiculos as $vehiculo) {
                $resultados[] = [
                    "vehiculo_id" => $vehiculo['id'],
                    "matricula"   => $vehiculo['matricula'],
                    "marca"       => $vehiculo['nombre_marca'],
                    "modelo"      => $vehiculo['nombre_modelo'],
                    "semaforo"    => SemaphoreEngine::calcularEstado($vehiculo, $db)
                ];
            }
            echo json_encode(["vehiculos" => $resultados]);
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
        // si viene /historial/tipos devolvemos los tipos de mantenimiento del modelo
        if ($id === 'tipos') {
            require_once 'config/database.php';
            require_once 'models/History.php';
            $database  = new Database();
            $history   = new History($database->getConnection());
            $modelo_id = $_GET['modelo_id'] ?? null;
            if (!$modelo_id) {
                http_response_code(400);
                echo json_encode(["error" => "modelo_id es obligatorio"]);
                break;
            }
            echo json_encode(["tipos" => $history->getTiposMantenimiento($modelo_id)]);
            break;
        }
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
        break;
}
