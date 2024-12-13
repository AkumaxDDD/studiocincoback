const mysql = require('mysql2/promise');

// Configuración de la conexión
const connectionConfig = {
  host: process.env.DB_HOST, // Asegúrate de que esto esté bien configurado
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

const db = mysql.createPool(connectionConfig);

app.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT DISTINCT
        a.id_actividad AS id,
        a.nombre AS actividad,
        u.nombre AS instructor,
        GROUP_CONCAT(DISTINCT p.dias ORDER BY p.dias SEPARATOR ', ') AS dias,
        GROUP_CONCAT(DISTINCT h.horario ORDER BY h.horario SEPARATOR ', ') AS horarios,
        GROUP_CONCAT(DISTINCT c.costo ORDER BY c.costo SEPARATOR ', ') AS costos,
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

    res.json({ actividad: rows });
  } catch (error) {
    console.error('Error al ejecutar la consulta a la base de datos:', error);
    res.status(500).send('Error en la base de datos');
  }
});
