import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import actividadesRouter from "./actividades.js";
import { db } from "./db.js";
// Conectar a DB
conectarDB();
console.log("Conectado a base de datos");

const app = express();
const port = 3000;

// interpretar JSON en body
app.use(express.json());

// Habilito cors
app.use(cors({
  origin: 'https://dashboard.render.com/', // o '*' para permitir todas las fuentes
}));

app.get("/", async (req, res) => {
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
  res.send({ apiactividades });
});
app.use("/api/actividades", actividadesRouter);

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});