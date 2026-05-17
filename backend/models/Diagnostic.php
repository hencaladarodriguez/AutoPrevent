<?php
// modelo de diagnostico colaborativo

require_once 'config/database.php';

class Diagnostic {

    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // los fallos los precarga el admin, aquí solo los leemos ordenados por gravedad
    public function getFallosConocidos($modelo_id) {
        $query = "SELECT * FROM fallos_conocidos WHERE modelo_id = :modelo_id ORDER BY gravedad DESC";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':modelo_id', $modelo_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // incidencias de la comunidad para un modelo (todas, ordenadas por votos)
    public function getIncidencias($modelo_id) {
        $query  = "SELECT i.*, v.anio, u.nombre as autor ";
        $query .= "FROM incidencias_usuarios i ";
        $query .= "JOIN vehiculos v ON i.vehiculo_id = v.id ";
        $query .= "JOIN usuarios u ON i.usuario_id = u.id ";
        $query .= "WHERE v.modelo_id = :modelo_id ";
        $query .= "ORDER BY i.votos DESC, i.fecha_registro DESC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':modelo_id', $modelo_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // incidencias propias del usuario para un modelo (columna "mis incidencias")
    public function getIncidenciasByUser($modelo_id, $usuario_id) {
        $query  = "SELECT i.*, v.anio ";
        $query .= "FROM incidencias_usuarios i ";
        $query .= "JOIN vehiculos v ON i.vehiculo_id = v.id ";
        $query .= "WHERE v.modelo_id = :modelo_id ";
        $query .= "AND i.usuario_id = :usuario_id ";
        $query .= "ORDER BY i.fecha_registro DESC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':modelo_id',  $modelo_id);
        $stmt->bindParam(':usuario_id', $usuario_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // crear incidencia — guarda usuario_id para controlar autoría
    public function createIncidencia($data, $usuario_id) {
        $query  = "INSERT INTO incidencias_usuarios ";
        $query .= "(vehiculo_id, usuario_id, titulo, descripcion, kilometraje, fecha) ";
        $query .= "VALUES (:vehiculo_id, :usuario_id, :titulo, :descripcion, :kilometraje, :fecha)";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':vehiculo_id', $data['vehiculo_id']);
        $stmt->bindParam(':usuario_id',  $usuario_id);
        $stmt->bindParam(':titulo',      $data['titulo']);
        $stmt->bindParam(':descripcion', $data['descripcion']);
        $stmt->bindParam(':kilometraje', $data['kilometraje']);
        $stmt->bindParam(':fecha',       $data['fecha']);

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    // editar incidencia — solo el creador puede editarla
    public function updateIncidencia($id, $data, $usuario_id) {
        $query  = "UPDATE incidencias_usuarios ";
        $query .= "SET titulo = :titulo, descripcion = :descripcion, kilometraje = :kilometraje, fecha = :fecha ";
        $query .= "WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':titulo',      $data['titulo']);
        $stmt->bindParam(':descripcion', $data['descripcion']);
        $stmt->bindParam(':kilometraje', $data['kilometraje']);
        $stmt->bindParam(':fecha',       $data['fecha']);
        $stmt->bindParam(':id',          $id);
        $stmt->bindParam(':usuario_id',  $usuario_id);

        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // eliminar incidencia — solo el creador puede borrarla
    public function deleteIncidencia($id, $usuario_id) {
        $query = "DELETE FROM incidencias_usuarios WHERE id = :id AND usuario_id = :usuario_id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':id',         $id);
        $stmt->bindParam(':usuario_id', $usuario_id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // el voto es un proceso de dos pasos: primero comprobamos duplicado, luego insertamos y sumamos
    public function votar($incidencia_id, $usuario_id) {
        // la tabla votos_incidencias tiene un UNIQUE (incidencia_id, usuario_id) que lo blinda en BD
        // pero compruebo antes para devolver un error claro en lugar de dejar que falle el INSERT
        $query = "SELECT id FROM votos_incidencias WHERE incidencia_id = :incidencia_id AND usuario_id = :usuario_id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':incidencia_id', $incidencia_id);
        $stmt->bindParam(':usuario_id',    $usuario_id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return "ya_votado";
        }

        // insertamos el voto
        $query = "INSERT INTO votos_incidencias (incidencia_id, usuario_id) VALUES (:incidencia_id, :usuario_id)";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':incidencia_id', $incidencia_id);
        $stmt->bindParam(':usuario_id', $usuario_id);
        $stmt->execute();

        // actualizamos el contador de votos
        $query = "UPDATE incidencias_usuarios SET votos = votos + 1 WHERE id = :incidencia_id";
        $stmt  = $this->db->prepare($query);
        $stmt->bindParam(':incidencia_id', $incidencia_id);
        $stmt->execute();

        return "votado";
    }
}