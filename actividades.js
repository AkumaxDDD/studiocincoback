import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// GET /actividades
// Consultar por todas las actividades
router.get("/", async (req, res) => {
  const [apiactividades] = await pool.query(`
    SELECT DISTINCT
      a.id_actividad AS id,
      a.nombre AS actividad, 
      u.nombre AS instructor, 
      GROUP_CONCAT(DISTINCT p.dias ORDER BY p.dias SEPARATOR ', ') AS dias, 
      GROUP_CONCAT(DISTINCT h.horario ORDER BY h.horario SEPARATOR ', ') AS horarios, 
      GROUP_CONCAT(DISTINCT c.costo ORDER BY c.costo SEPARATOR ', ') AS costos,
      a.imagen AS imagen
    FROM actividades a
    JOIN usuario_actividad ua ON a.id_actividad = ua.id_actividad
    JOIN usuarios u ON ua.id_usuario = u.id_usuario
    JOIN actividad_horarios ah ON a.id_actividad = ah.id_actividad
    JOIN planes p ON ah.id_plan = p.id_plan
    JOIN horarios h ON ah.id_horario = h.id_horario
    JOIN costos c ON ah.id_costo = c.id_costo
    GROUP BY a.id_actividad, a.nombre, u.nombre, a.imagen
    ORDER BY a.nombre, u.nombre;

  `);
  res.send({ apiactividades });
});

export default router;