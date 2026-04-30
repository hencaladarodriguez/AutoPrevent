<?php
// configuracion de la conexion a la base de datos

class Database {
    private $host = "localhost";
    private $port = "3306";
    private $db_name = "autoprevent";
    private $username = "root";
    private $password = ""; // en xampp por defecto esta vacia
    private $conn;

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
            // si falla la conexion devolvemos el error
            echo json_encode([
                "error" => "Error de conexion: " . $e->getMessage()
            ]);
        }

        return $this->conn;
    }
}