const pool = require("../../config/db");

const ServiciosReserva = {
  async create(data) {
    const { reserva_id, servicio_id, cantidad } = data;

    const result = await pool.query(
      "INSERT INTO servicios_reservas (reserva_id, servicio_id, cantidad) VALUES ($1, $2, $3) RETURNING *",
      [reserva_id, servicio_id, cantidad]
    );

    return result.rows[0];
  },

  async findById(reserva_id) {
    const result = await pool.query(
      `SELECT sr.*, s.nombre, s.descripcion
       FROM servicios_reservas sr
       JOIN servicios s ON sr.servicio_id = s.id
       WHERE sr.reserva_id = $1`,
      [reserva_id]
    );
    return result.rows.length > 0 ? result.rows : null;
  },

  async findAll(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;

    const result = await pool.query(
      `SELECT sr.*, s.nombre, s.descripcion
       FROM servicios_reservas sr
       JOIN servicios s ON sr.servicio_id = s.id
       ORDER BY sr.reserva_id DESC
       LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );

    return result.rows;
  },

  async countAll() {
    const result = await pool.query("SELECT COUNT(*) FROM servicios_reservas");
    return parseInt(result.rows[0].count, 10);
  },

  async update(id, data) {
    const campos = Object.keys(data);
    const valores = Object.values(data);
    if (campos.length === 0) return null;

    const columnas = campos.map((campo, i) => `${campo} = $${i + 1}`).join(", ");
    valores.push(id);

    const result = await pool.query(
      `UPDATE servicios_reservas SET ${columnas} WHERE id = $${valores.length} RETURNING *`,
      valores
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM servicios_reservas WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
};

module.exports = ServiciosReserva;