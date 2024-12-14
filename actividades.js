import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// GET /actividades
// Consultar por todas las actividades
router.get("/", async (req, res) => {
  const [apiactividades] = await pool.query(`
    SELECT * FROM actividades;
  `);
  res.send({ apiactividades });
});

export default router;