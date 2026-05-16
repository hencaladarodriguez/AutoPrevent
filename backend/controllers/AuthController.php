<?php
// controlador de autenticacion, usuarios y admins tienen tablas separadas

require_once 'config/database.php';
require_once 'config/jwt.php';

class AuthController {
    private $db;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // registro, devolvemos token directo para no tener que hacer login después
    public function register(){
        $data = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data['nombre']) ||
            empty($data['apellidos']) ||
            empty($data['email']) ||
            empty($data['password'])
        ){
        http_response_code(400);
        echo json_encode(["error" => "Todos los campos son obligatorios"]);
        return;
        }

        // 409 si el email ya existe, así el front lo distingue del 400
        $query = "SELECT id FROM usuarios WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $data['email']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(["error" => "El email ya esta registrado"]);
            return;
        }

        // hasheamos con bcrypt, nunca guardamos la contraseña en plano
        $password_hash = password_hash($data['password'], PASSWORD_BCRYPT);

        $query= "INSERT INTO usuarios (nombre, apellidos, email, password)
        VALUES (:nombre, :apellidos, :email, :password)";
        $stmt = $this -> db -> prepare($query);
        $stmt ->bindParam(':nombre', $data['nombre']); 
        $stmt ->bindParam(':apellidos', $data['apellidos']); 
        $stmt ->bindParam(':email', $data['email']); 
        $stmt ->bindParam(':password', $password_hash); 

        if ($stmt->execute()) {
            $user_id = $this -> db -> lastInsertId();
            $token = JWT::generate($user_id, $data['email'], 'user');

            http_response_code(201);
            echo json_encode([
                "mensaje" => "Usuario registrado correctamente",
                "token" => $token,
                "usuario" => [
                    "id" => $user_id,
                    "nombre" => $data['nombre'],
                    "apellidos" => $data['apellidos'],
                    "email" => $data['email']
                ]
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al registrar el usuario"]);
        }
    }

    // login, mismo error si no existe el email o si la contraseña falla
    public function login(){
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Email y contraseña son obligatorios"]);
            return;
        }

        // buscamos el usuario por email
        $query = "SELECT * FROM usuarios WHERE email = :email AND activo = 1";
        $stmt = $this -> db -> prepare($query);
        $stmt -> bindParam(':email', $data['email']);
        $stmt -> execute();

        if ($stmt->rowCount() === 0) {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas"]);
            return;
        }

        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        // verificamos la contraseña
        if (!password_verify($data['password'], $usuario['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas"]);
            return;
        }

        // generamos token con rol 'user'
        $token = JWT::generate($usuario['id'], $usuario['email'], 'user');

        echo json_encode([
            "mensaje" => "Login Correcto",
            "token" => $token,
            "usuario" => [
                "id" => $usuario['id'],
                "nombre" => $usuario['nombre'],
                "apellidos" => $usuario['apellidos'],
                "email" => $usuario['email'],
            ]
        ]);
    }

    // login de admin, mismo proceso pero con rol 'admin'
    public function adminLogin(){
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Email y contraseña son obligatorios"]);
            return;
        }

        $query = "SELECT * FROM admins WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $data['email']);
        $stmt->execute();

        if ($stmt->rowCount() === 0 ) {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas"]);
            return;
        }

        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!password_verify($data['password'], $admin['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas"]);
            return;
        }

        $token = JWT::generate($admin['id'], $admin['email'], 'admin');

        echo json_encode([
            "mensaje" => "Login de admin correcto",
            "token" => $token,
            "admin" => [
                "id" => $admin['id'],
                "nombre" => $admin['nombre'],
                "email" => $admin['email']
            ]
        ]);
    }

}
?>