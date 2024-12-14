import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import actividadesRouter from "./actividades.js";


const app = express();
const port = 3000;

// interpretar JSON en body
app.use(express.json());

// Habilito cors
app.use(cors());

app.get("/", (req, res) => {
  
  res.send("Hola mundo!");
});
app.get("/ping",async (req, res) => {
  const [result] = await pool.query(`SELECT "Hola" as saludo`)
  console.log(result);
})
app.use("/api/actividades", actividadesRouter);

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});