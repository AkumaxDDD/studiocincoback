import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import actividadesRouter from "./actividades.js";
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

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

app.use("/api/actividades", actividadesRouter);

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});