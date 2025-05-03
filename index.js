const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const routes = require("./endpoints/routes/routes");

const server = express();
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.send("El servidor está funcionando.");
});

server.use("/api/v1", routes);

server.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada. Verifica la URL." });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});