const pool = require("../../config/db");

const Cliente = {
  async findAll(limit = 20, offset = 0) {
    const result = await pool.query(
      `SELECT id, nombre, apellidos, fecha_nacimiento, dni, nacionalidad, email, telefono, preferencias,
       to_char(fecha_nacimiento, 'DD-MM-YYYY') AS fecha_nacimiento
       FROM clientes ORDER BY id LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async countAll() {
    const result = await pool.query("SELECT COUNT(*) FROM clientes");
    return parseInt(result.rows[0].count, 10);
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT id, nombre, apellidos, fecha_nacimiento, dni, nacionalidad, email, telefono, preferencias,
       to_char(fecha_nacimiento, 'DD-MM-YYYY') AS fecha_nacimiento
       FROM clientes WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(cliente) {
    const {
      nombre,
      apellidos,
      fecha_nacimiento,
      dni,
      nacionalidad,
      email,
      telefono,
      preferencias,
    } = cliente;

    const result = await pool.query(
      `INSERT INTO clientes 
       (nombre, apellidos, fecha_nacimiento, dni, nacionalidad, email, telefono, preferencias)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        nombre,
        apellidos,
        fecha_nacimiento,
        dni,
        nacionalidad,
        email,
        telefono,
        preferencias,
      ]
    );

    return result.rows[0];
  },

  async update(id, cliente) {
    const {
      nombre,
      apellidos,
      fecha_nacimiento,
      dni,
      nacionalidad,
      email,
      telefono,
      preferencias,
    } = cliente;

    const result = await pool.query(
      `UPDATE clientes SET
        nombre = $1,
        apellidos = $2,
        fecha_nacimiento = $3,
        dni = $4,
        nacionalidad = $5,
        email = $6,
        telefono = $7,
        preferencias = $8
       WHERE id = $9
       RETURNING *`,
      [
        nombre,
        apellidos,
        fecha_nacimiento,
        dni,
        nacionalidad,
        email,
        telefono,
        preferencias,
        id,
      ]
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query("DELETE FROM clientes WHERE id = $1", [id]);
  },

  async search(filters = {}, limit = 20, offset = 0) {
    const condiciones = [];
    const valores = [];
    let index = 1;

    for (const key in filters) {
      if (filters[key]) {
        condiciones.push(`LOWER(${key}) LIKE LOWER($${index})`);
        valores.push(`%${filters[key]}%`);
        index++;
      }
    }

    let whereClause = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT id, nombre, apellidos, fecha_nacimiento, dni, nacionalidad, email, telefono, preferencias,
       to_char(fecha_nacimiento, 'DD-MM-YYYY') AS fecha_nacimiento
       FROM clientes
       ${whereClause}
       ORDER BY id
       LIMIT $${index} OFFSET $${index + 1}`,
      [...valores, limit, offset]
    );

    return result.rows;
  },

  async countFiltered(filters = {}) {
    const condiciones = [];
    const valores = [];
    let index = 1;

    for (const key in filters) {
      if (filters[key]) {
        condiciones.push(`LOWER(${key}) LIKE LOWER($${index})`);
        valores.push(`%${filters[key]}%`);
        index++;
      }
    }

    let whereClause = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT COUNT(*) FROM clientes ${whereClause}`,
      valores
    );

    return parseInt(result.rows[0].count, 10);
  },
};

module.exports = Cliente;