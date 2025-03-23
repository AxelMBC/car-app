import express, { json } from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
const port = 8080;

app.use(cors());
app.use(json());

const DBPATH = "vehiculos.db";
const db = new sqlite3.Database(DBPATH, (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS vehiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    anio INTEGER,
    color TEXT,
    imagen TEXT
  )`,
  (err) => {
    if (err) {
      console.error("Error al crear la tabla:", err.message);
    } else {
      console.log("Tabla 'vehiculos' creada o ya existe.");
      app.listen(port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
      });
    }
  }
);

app.get("/vehiculos", (req, res) => {
  const sql = "SELECT * FROM vehiculos";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

app.get("/vehiculos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM vehiculos WHERE id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    res.json({ data: row });
  });
});


app.post("/vehiculos", (req, res) => {
  const { tipo, marca, modelo, anio, color, imagen } = req.body;

  if (!tipo || !marca || !modelo) {
    return res.status(400).json({ error: "Los campos 'tipo', 'marca' y 'modelo' son requeridos" });
  }

  const sql = "INSERT INTO vehiculos (tipo, marca, modelo, anio, color, imagen) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [tipo, marca, modelo, anio, color, imagen || ""];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: "Vehículo agregado exitosamente",
      data: { id: this.lastID, tipo, marca, modelo, anio, color, imagen },
    });
  });
});

app.put("/vehiculos/:id", (req, res) => {
  const { tipo, marca, modelo, anio, color, imagen } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE vehiculos
    SET 
      tipo = COALESCE(?, tipo),
      marca = COALESCE(?, marca),
      modelo = COALESCE(?, modelo),
      anio = COALESCE(?, anio),
      color = COALESCE(?, color),
      imagen = COALESCE(?, imagen)
    WHERE id = ?
  `;
  const params = [tipo, marca, modelo, anio, color, imagen, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    res.json({ message: "Vehículo actualizado exitosamente" });
  });
});

app.delete("/vehiculos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM vehiculos WHERE id = ?";

  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    res.json({ message: "Vehículo eliminado exitosamente" });
  });
});
