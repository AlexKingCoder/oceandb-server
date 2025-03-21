const pool = require("../../config/db");

const Habitacion = {
  async create(data) {
    const { numero, tipo, precio, estado } = data;
    const result = await pool.query(
      "INSERT INTO habitaciones (numero, tipo, precio, estado) VALUES ($1, $2, $3, $4) RETURNING *",
      [numero, tipo, precio, estado]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query("SELECT * FROM habitaciones WHERE id = $1", [id]);
    return result.rows[0];
  },

  async findAll(limit = 20, offset = 0) {
    limit = Math.max(1, parseInt(limit, 10));
    offset = Math.max(0, parseInt(offset, 10));

    const result = await pool.query(
      "SELECT * FROM habitaciones ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    return result.rows;
  },

  async countAll() {
    const result = await pool.query("SELECT COUNT(*) FROM habitaciones");
    return parseInt(result.rows[0].count, 10);
  },

  async update(id, data) {
    const campos = Object.keys(data);
    const valores = Object.values(data);
    if (campos.length === 0) return null;

    const columnas = campos.map((campo, i) => `${campo} = $${i + 1}`).join(", ");
    valores.push(id);

    const result = await pool.query(
      `UPDATE habitaciones SET ${columnas} WHERE id = $${valores.length} RETURNING *`,
      valores
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query("DELETE FROM habitaciones WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
};

module.exports = Habitacion;