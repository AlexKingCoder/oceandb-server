const pool = require("../../config/db");

const Cliente = {
  async create(data) {
    const { nombre, apellidos, fecha_nacimiento, dni, nacionalidad, email, telefono, preferencias } = data;
    const result = await pool.query(
      "INSERT INTO clientes (nombre, apellidos, fecha_nacimiento, dni, nacionalidad, email, telefono, preferencias) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [nombre, apellidos, fecha_nacimiento, dni, nacionalidad, email, telefono, preferencias]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query("SELECT * FROM clientes WHERE id = $1", [id]);
    return result.rows[0];
  },

  async findAll(limit = 20, offset = 0) {
    limit = Math.max(1, parseInt(limit, 10));
    offset = Math.max(0, parseInt(offset, 10));

    const result = await pool.query(
      `SELECT id, nombre, apellidos, fecha_nacimiento, dni, nacionalidad, email, telefono, preferencias, 
          to_char(fecha_nacimiento, 'DD-MM-YYYY') AS fecha_nacimiento
      FROM clientes 
      ORDER BY id 
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async countAll() {
    const result = await pool.query("SELECT COUNT(*) FROM clientes");
    return parseInt(result.rows[0].count, 10);
  },

  async update(id, data) {
    const campos = Object.keys(data);
    const valores = Object.values(data);
    if (campos.length === 0) return null;

    const columnas = campos.map((campo, i) => `${campo} = $${i + 1}`).join(", ");
    valores.push(id);

    const result = await pool.query(
      `UPDATE clientes SET ${columnas} WHERE id = $${valores.length} RETURNING *`,
      valores
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query("DELETE FROM clientes WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
};

module.exports = Cliente;