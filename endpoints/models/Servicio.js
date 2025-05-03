const pool = require("../../config/db");

const Servicio = {
  async create(data) {
    const { nombre, descripcion, precio } = data;

    const result = await pool.query(
      "INSERT INTO servicios (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *",
      [nombre, descripcion, precio]
    );

    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      "SELECT * FROM servicios WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  async findAll(page = 1, pageSize = 10, orderBy = "nombre", orderDir = "ASC") {
    const offset = (page - 1) * pageSize;
    const validColumns = ["nombre", "precio"];
    const validDirections = ["ASC", "DESC"];

    orderBy = validColumns.includes(orderBy) ? orderBy : "nombre";
    orderDir = validDirections.includes(orderDir) ? orderDir : "ASC";

    const result = await pool.query(
      `SELECT * FROM servicios ORDER BY ${orderBy} ${orderDir} LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );
    return result.rows;
  },

  async countAll() {
    const result = await pool.query("SELECT COUNT(*) FROM servicios");
    return parseInt(result.rows[0].count, 10);
  },

  async update(id, data) {
    const campos = Object.keys(data);
    const valores = Object.values(data);
    if (campos.length === 0) return null;

    const columnas = campos.map((campo, i) => `${campo} = $${i + 1}`).join(", ");
    valores.push(id);

    const result = await pool.query(
      `UPDATE servicios SET ${columnas} WHERE id = $${valores.length} RETURNING *`,
      valores
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query("DELETE FROM servicios WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
};

module.exports = Servicio;