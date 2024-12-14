import express from "express";
import { db } from "./db.js";

const router = express.Router();

// GET /actividades
// Consultar por todas las actividades
router.get("/", async (req, res) => {
  const [apiactividades] = await db.execute(`
    SELECT * FROM actividades;
  `);
  res.send({ apiactividades });
});

export default router;