<?php
// configuracion de la conexion a la base de datos
// en local usa los valores de XAMPP por defecto
// en Railway lee las variables que inyecta el plugin de MySQL automaticamente

class Database {
    private $host     = "";
    private $port     = "";
    private $db_name  = "";
    private $username = "";
    private $password = "";
    private $conn;

    public function __construct() {
        // Railway inyecta MYSQLHOST, MYSQLPORT, MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD
        // si no existen caemos al valor local de XAMPP
        $this->host     = getenv('MYSQLHOST')     ?: 'localhost';
        $this->port     = getenv('MYSQLPORT')     ?: '3306';
        $this->db_name  = getenv('MYSQLDATABASE') ?: 'autoprevent';
        $this->username = getenv('MYSQLUSER')     ?: 'root';
        $this->password = getenv('MYSQLPASSWORD') ?: '';
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8mb4");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch (PDOException $e) {
            echo json_encode([
                "error" => "Error de conexion: " . $e->getMessage()
            ]);
        }

        return $this->conn;
    }
}
