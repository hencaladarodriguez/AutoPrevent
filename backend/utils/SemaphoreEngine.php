<?php
// motor del semaforo de AutoPrevent
// calcula el estado de mantenimiento de cada vehiculo

class SemaphoreEngine {

    // si quedan menos del 20% de km → amarillo
    const UMBRAL_ADVERTENCIA = 0.20;

    // calcula el estado completo de un vehiculo
    public static function calcularEstado($vehiculo, $db) {
        $checks_mantenimiento = self::checkMantenimiento($vehiculo, $db);
        $check_itv            = self::checkITV($vehiculo);
        $resultados           = array_merge($checks_mantenimiento, [$check_itv]);

        return [
            "estado_global" => self::calcularEstadoGlobal($resultados),
            "checks"        => $resultados
        ];
    }

    // compara km actuales con intervalos del fabricante
    private static function checkMantenimiento($vehiculo, $db) {
        $checks = [];

        $query  = "SELECT * FROM tipos_mantenimiento ";
        $query .= "WHERE modelo_id = :modelo_id";
        $stmt   = $db->prepare($query);
        $stmt->bindParam(':modelo_id', $vehiculo['modelo_id']);
        $stmt->execute();
        $tipos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($tipos as $tipo) {
            // buscamos el ultimo registro de este tipo de mantenimiento
            $query  = "SELECT kilometraje, fecha ";
            $query .= "FROM historial_mantenimiento ";
            $query .= "WHERE vehiculo_id = :vehiculo_id ";
            $query .= "AND tipo_mantenimiento_id = :tipo_id ";
            $query .= "ORDER BY fecha DESC LIMIT 1";

            $stmt = $db->prepare($query);
            $stmt->bindParam(':vehiculo_id', $vehiculo['id']);
            $stmt->bindParam(':tipo_id',     $tipo['id']);
            $stmt->execute();
            $ultimo = $stmt->fetch(PDO::FETCH_ASSOC);

            $estado = self::calcularEstadoKm(
                $vehiculo['kilometraje_actual'],
                $ultimo ? $ultimo['kilometraje'] : 0,
                $tipo['intervalo_km'],
                $ultimo ? $ultimo['fecha'] : null,
                $tipo['intervalo_meses']
            );

            $checks[] = [
                "tipo"         => "mantenimiento",
                "nombre"       => $tipo['nombre'],
                "estado"       => $estado['estado'],
                "mensaje"      => $estado['mensaje'],
                "km_restantes" => $estado['km_restantes'],
                "ultimo_km"    => $ultimo ? $ultimo['kilometraje'] : null,
                "ultima_fecha" => $ultimo ? $ultimo['fecha'] : null
            ];
        }

        return $checks;
    }

    private static function calcularEstadoKm(
        $km_actual,
        $km_ultimo,
        $intervalo_km,
        $fecha_ultimo,
        $intervalo_meses
    ) {
        if (!$intervalo_km && $intervalo_meses) {
            return self::calcularEstadoMeses($fecha_ultimo, $intervalo_meses);
        }

        if (!$intervalo_km) {
            return ["estado" => "verde", "mensaje" => "Sin intervalo definido", "km_restantes" => null];
        }

        $km_desde_ultimo = $km_actual - $km_ultimo;
        $km_restantes    = $intervalo_km - $km_desde_ultimo;
        $umbral          = $intervalo_km * self::UMBRAL_ADVERTENCIA;

        if ($km_restantes <= 0) {
            return [
                "estado"       => "rojo",
                "mensaje"      => "Mantenimiento superado por " . abs($km_restantes) . " km",
                "km_restantes" => $km_restantes
            ];
        } elseif ($km_restantes <= $umbral) {
            return [
                "estado"       => "amarillo",
                "mensaje"      => "Mantenimiento próximo en " . $km_restantes . " km",
                "km_restantes" => $km_restantes
            ];
        } else {
            return [
                "estado"       => "verde",
                "mensaje"      => "Al día. Próximo en " . $km_restantes . " km",
                "km_restantes" => $km_restantes
            ];
        }
    }

    private static function calcularEstadoMeses($fecha_ultimo, $intervalo_meses) {
        if (!$fecha_ultimo) {
            return ["estado" => "rojo", "mensaje" => "Sin registro de este mantenimiento", "km_restantes" => null];
        }

        $fecha_ultimo    = new DateTime($fecha_ultimo);
        $hoy             = new DateTime();
        $meses_desde     = ($hoy->diff($fecha_ultimo)->days) / 30;
        $meses_restantes = $intervalo_meses - $meses_desde;
        $umbral          = $intervalo_meses * self::UMBRAL_ADVERTENCIA;

        if ($meses_restantes <= 0) {
            return ["estado" => "rojo",     "mensaje" => "Mantenimiento por meses superado",                              "km_restantes" => null];
        } elseif ($meses_restantes <= $umbral) {
            return ["estado" => "amarillo", "mensaje" => "Mantenimiento próximo en " . round($meses_restantes) . " meses", "km_restantes" => null];
        } else {
            return ["estado" => "verde",    "mensaje" => "Al día. Próximo en " . round($meses_restantes) . " meses",       "km_restantes" => null];
        }
    }

    // calcula el estado de la ITV segun la ley española
    private static function checkITV($vehiculo) {
        $hoy                 = new DateTime();
        $fecha_matriculacion = new DateTime($vehiculo['fecha_matriculacion']);
        $anios               = $hoy->diff($fecha_matriculacion)->y;

        // menos de 4 años → sin ITV obligatoria
        if ($anios < 4) {
            return [
                "tipo"         => "itv",
                "nombre"       => "ITV",
                "estado"       => "verde",
                "mensaje"      => "ITV no obligatoria hasta los 4 años",
                "km_restantes" => null
            ];
        }

        // 4-10 años → cada 2 años / más de 10 → cada año
        $frecuencia_meses = $anios <= 10 ? 24 : 12;

        $primera_itv = clone $fecha_matriculacion;
        $primera_itv->modify('+4 years');

        $proxima_itv = clone $primera_itv;
        while ($proxima_itv < $hoy) {
            $proxima_itv->modify('+' . $frecuencia_meses . ' months');
        }

        $dias_restantes = $hoy->diff($proxima_itv)->days;

        if ($dias_restantes <= 0) {
            return [
                "tipo"         => "itv",
                "nombre"       => "ITV",
                "estado"       => "rojo",
                "mensaje"      => "ITV vencida",
                "km_restantes" => null,
                "fecha_limite" => $proxima_itv->format('Y-m-d')
            ];
        } elseif ($dias_restantes <= 60) {
            return [
                "tipo"         => "itv",
                "nombre"       => "ITV",
                "estado"       => "amarillo",
                "mensaje"      => "ITV próxima en " . $dias_restantes . " días",
                "km_restantes" => null,
                "fecha_limite" => $proxima_itv->format('Y-m-d')
            ];
        } else {
            return [
                "tipo"         => "itv",
                "nombre"       => "ITV",
                "estado"       => "verde",
                "mensaje"      => "ITV al día. Próxima en " . $dias_restantes . " días",
                "km_restantes" => null,
                "fecha_limite" => $proxima_itv->format('Y-m-d')
            ];
        }
    }

    // devuelve el peor estado entre todos los checks
    private static function calcularEstadoGlobal($checks) {
        $prioridad = ["verde" => 0, "amarillo" => 1, "rojo" => 2];
        $peor      = "verde";

        foreach ($checks as $check) {
            if ($prioridad[$check['estado']] > $prioridad[$peor]) {
                $peor = $check['estado'];
            }
        }

        return $peor;
    }
}
