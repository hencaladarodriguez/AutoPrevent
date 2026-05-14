<?php
// gestiona el registro y login — tanto usuarios normales como admins
// los admins tienen su propia tabla así que hay dos flujos separados

require_once 'config/database.php';
require_once 'config/jwt.php';

class AuthController {
    private $db;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // devuelve token directamente al registrarse para no obligar al usuario a hacer login después
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

        // usamos 409 para que el front distinga entre campos vacíos (400) y email duplicado (409)
        $query = "SELECT id FROM usuarios WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $data['email']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(["error" => "El email ya esta registrado"]);
            return;
        }

        // nunca guardamos la contraseña en plano, bcrypt gestiona el salt automáticamente
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

    // tanto si el email no existe como si la contraseña falla devolvemos el mismo mensaje
    // así no filtramos si un email está registrado o no (seguridad básica)
    public function login(){
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Email y contraseña son obligatorios"]);
            return;
        }

        //buscamso el usuario por email
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

        //Verificacmos la contraseña
        if (!password_verify($data['password'], $usuario['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas"]);
            return;
        }

        // el token lleva el rol 'user' para que el middleware lo distinga del admin
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

    // el admin usa la misma lógica de JWT pero con rol 'admin', tabla separada
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