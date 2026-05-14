<?php
// modelo de historial de mantenimiento

require_once 'config/database.php';

class History {

    private $db;
    private $table = 'historial_mantenimiento';

    public function __construct($db) {
        $this->db = $db;
    }

    // obtener todo el historial de un vehiculo
    public function getAll($vehiculo_id) {
        $query  = "SELECT h.*, t.nombre as tipo_nombre ";
        $query .= "FROM " . $this->table . " h ";
        $query .= "LEFT JOIN tipos_mantenimiento t ON h.tipo_mantenimiento_id = t.id ";
        $query .= "WHERE h.vehiculo_id = :vehiculo_id ";
        $query .= "ORDER BY h.fecha DESC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':vehiculo_id', $vehiculo_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // obtener un registro del historial
    public function getOne($id) {
        $query  = "SELECT h.*, t.nombre as tipo_nombre ";
        $query .= "FROM " . $this->table . " h ";
        $query .= "LEFT JOIN tipos_mantenimiento t ON h.tipo_mantenimiento_id = t.id ";
        $query .= "WHERE h.id = :id";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // crear un registro en el historial
    public function create($data) {
        $query  = "INSERT INTO " . $this->table . " ";
        $query .= "(vehiculo_id, tipo_mantenimiento_id, descripcion, ";
        $query .= "kilometraje, fecha, coste, taller) ";
        $query .= "VALUES (:vehiculo_id, :tipo_mantenimiento_id, :descripcion, ";
        $query .= ":kilometraje, :fecha, :coste, :taller)";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':vehiculo_id',          $data['vehiculo_id']);
        $stmt->bindParam(':tipo_mantenimiento_id',$data['tipo_mantenimiento_id']);
        $stmt->bindParam(':descripcion',          $data['descripcion']);
        $stmt->bindParam(':kilometraje',          $data['kilometraje']);
        $stmt->bindParam(':fecha',                $data['fecha']);
        $stmt->bindParam(':coste',                $data['coste']);
        $stmt->bindParam(':taller',               $data['taller']);

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    // eliminar un registro del historial
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    // obtener tipos de mantenimiento de un modelo
    public function getTiposMantenimiento($modelo_id) {
        $query = "SELECT * FROM tipos_mantenimiento WHERE modelo_id = :modelo_id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':modelo_id', $modelo_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}