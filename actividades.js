import express from "express";
import { db } from "./db.js";

const router = express.Router();

const validarId = (req, res, next) => {
  const id_actividad = Number(req.params.id_actividad);

  // Verificar que id_actividad sea un numero
  if (isNaN(id_actividad)) {
    return res.status(400).send({ mensaje: "id_actividad no es un numero" });
  }

  // Verificar que id_actividad sea un entero
  if (!Number.isInteger(id_actividad)) {
    return res.status(400).send({ mensaje: "id_actividad no es un numero entero" });
  }

  // Verificar que id_actividad sea un positivo
  if (id_actividad <= 0) {
    return res.status(400).send({ mensaje: "id_actividad no es un numero positivo" });
  }

  next();
};

// middleware para verificar datos de actividad
const validaractividad = (req, res, next) => {
  // Validar nombre
  const nombre = req.body.nombre;

  // Validar que nombre este presente
  if (nombre == undefined) {
    return res.status(400).send({ mensaje: "El nombre es requerido" });
  }
  // Validar que nombre sea un string
  if (typeof nombre !== "string") {
    return res.status(400).send({ mensaje: "El nombre no es un texto" });
  }
  // Validar que nombre tenga entre 1 y 50 caracteres
  if (nombre.length < 1 || nombre.length > 50) {
    return res
      .status(400)
      .send({ mensaje: "El nombre tiene que tener entre 1 y 50 caracteres" });
  }

  // Validar apellido
  // Validar edad
  // Validar altura
  // Validar peso
  // Validar fecha de nacimiento

  next();
};

// GET /actividades
// Consultar por todas las actividades
router.get("/", async (req, res) => {
  const [apiactividades] = await db.execute(`
    SELECT DISTINCT
      a.id_actividad AS id,
      a.nombre AS actividad, 
      u.nombre AS instructor, 
      GROUP_CONCAT(DISTINCT p.dias ORDER BY p.dias SEPARATOR ', ') AS dias, 
      GROUP_CONCAT(DISTINCT h.horario ORDER BY h.horario SEPARATOR ', ') AS horarios, 
      GROUP_CONCAT(DISTINCT c.costo ORDER BY c.costo SEPARATOR ', ') AS costos,
      -- Convertir la imagen a base64
      IFNULL(TO_BASE64(a.imagen), '') AS imagen
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
  res.json({ actividad: apiactividades[0] });
});



// GET /actividades/:id_actividad
// Consultar por una actividad
router.get("/:id_actividad", validarId, async (req, res) => {
  const id_actividad = Number(req.params.id_actividad);

  // Ejecuto consulta con parametros
  const sql = "select * from actividades where id_actividad=?";
  const [actividades] = await db.execute(sql, [id_actividad]);

  // Si no hay tareas enviar un 204 (sin contenido)
  if (actividades.length === 0) {
    res.status(204).send();
  } else {
    res.send({ actividad: actividades[0] });
  }
});

// POST /actividades/
// Crear nueva actividad
router.post("/", validaractividad, async (req, res) => {
  /*
  const [result] = await db.execute(
    "insert into actividades (descripcion, completada) values (?,?)",
    [descripcion, completada]
  );
  res
    .status(201)
    .send({ actividad: { id_actividad: result.insertId, descripcion, completada } });
    */
  res.send("actividad creada");
});

// PUT /actividades/:id_actividad
// Modificar actividad
router.put("/:id_actividad", validarId, async (req, res) => {
  const id_actividad = Number(req.params.id_actividad);
  const descripcion = req.body.descripcion;
  const completada = req.body.completada;

  await db.execute(
    "update actividades set descripcion=?, completada=? where id_actividad=?",
    [descripcion, completada, id_actividad]
  );

  res.send({ actividad: { id_actividad: parseInt(id_actividad), descripcion, completada } });
});

// DELETE /actividades/:id_actividad
// Quitar tarea
router.delete("/:id_actividad", validarId, async (req, res) => {
  const id_actividad = Number(req.params.id_actividad);

  await db.execute("delete from actividades where id_actividad=?", [id_actividad]);

  res.send({ id_actividad });
});

export default router;