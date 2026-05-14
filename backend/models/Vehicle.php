<?php
// modelo de vehiculo
// contiene las consultas a la base de datos

require_once 'config/database.php';

class Vehicle {
    private $db;
    private $table = 'vehiculos';

    public function __construct($db) {
        $this->db = $db;
    }

    // obtener todos los vehiculos de un usuario
    public function getAll($usuario_id) {
        $query  = "SELECT v.*, m.nombre as nombre_modelo, ma.id as marca_id, ma.nombre as nombre_marca ";
        $query .= "FROM " . $this->table . " v ";
        $query .= "JOIN modelos m ON v.modelo_id = m.id ";
        $query .= "JOIN marcas ma ON m.marca_id = ma.id ";
        $query .= "WHERE v.usuario_id = :usuario_id ";
        $query .= "AND v.activo = 1 ";
        $query .= "ORDER BY v.fecha_registro DESC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':usuario_id', $usuario_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // obtener un vehiculo por id
    public function getOne($id, $usuario_id) {
        $query  = "SELECT v.*, m.nombre as nombre_modelo, ma.id as marca_id, ma.nombre as nombre_marca ";
        $query .= "FROM " . $this->table . " v ";
        $query .= "JOIN modelos m ON v.modelo_id = m.id ";
        $query .= "JOIN marcas ma ON m.marca_id = ma.id ";
        $query .= "WHERE v.id = :id ";
        $query .= "AND v.usuario_id = :usuario_id ";
        $query .= "AND v.activo = 1";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id',         $id);
        $stmt->bindParam(':usuario_id', $usuario_id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // crear un vehiculo
    public function create($data, $usuario_id) {
        $query  = "INSERT INTO " . $this->table . " ";
        $query .= "(usuario_id, modelo_id, matricula, vin, anio, ";
        $query .= "kilometraje_actual, fecha_matriculacion, color) ";
        $query .= "VALUES ";
        $query .= "(:usuario_id, :modelo_id, :matricula, :vin, :anio, ";
        $query .= ":kilometraje_actual, :fecha_matriculacion, :color)";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':usuario_id',          $usuario_id);
        $stmt->bindParam(':modelo_id',           $data['modelo_id']);
        $stmt->bindParam(':matricula',           $data['matricula']);
        $stmt->bindParam(':vin',                 $data['vin']);
        $stmt->bindParam(':anio',                $data['anio']);
        $stmt->bindParam(':kilometraje_actual',  $data['kilometraje_actual']);
        $stmt->bindParam(':fecha_matriculacion', $data['fecha_matriculacion']);
        $stmt->bindParam(':color',               $data['color']);

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    // actualizar un vehiculo
    public function update($id, $data, $usuario_id) {
        $query  = "UPDATE " . $this->table . " SET ";
        $query .= "modelo_id = :modelo_id, ";
        $query .= "matricula = :matricula, ";
        $query .= "vin = :vin, ";
        $query .= "anio = :anio, ";
        $query .= "kilometraje_actual = :kilometraje_actual, ";
        $query .= "fecha_matriculacion = :fecha_matriculacion, ";
        $query .= "color = :color ";
        $query .= "WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':modelo_id',           $data['modelo_id']);
        $stmt->bindParam(':matricula',           $data['matricula']);
        $stmt->bindParam(':vin',                 $data['vin']);
        $stmt->bindParam(':anio',                $data['anio']);
        $stmt->bindParam(':kilometraje_actual',  $data['kilometraje_actual']);
        $stmt->bindParam(':fecha_matriculacion', $data['fecha_matriculacion']);
        $stmt->bindParam(':color',               $data['color']);
        $stmt->bindParam(':id',                  $id);
        $stmt->bindParam(':usuario_id',          $usuario_id);

        return $stmt->execute();
    }

    // borrado logico: desactivamos el vehiculo, no lo borramos de la BD
    public function delete($id, $usuario_id) {
        $query  = "UPDATE " . $this->table . " ";
        $query .= "SET activo = 0 ";
        $query .= "WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id',         $id);
        $stmt->bindParam(':usuario_id', $usuario_id);

        return $stmt->execute();
    }

    // obtener todas las marcas
    public function getMarcas() {
        $query = "SELECT * FROM marcas ORDER BY nombre ASC";
        $stmt  = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // obtener modelos de una marca
    public function getModelosByMarca($marca_id) {
        $query  = "SELECT * FROM modelos ";
        $query .= "WHERE marca_id = :marca_id ";
        $query .= "ORDER BY nombre ASC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':marca_id', $marca_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
