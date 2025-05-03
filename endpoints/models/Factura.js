const pool = require("../../config/db");

const Factura = {
  async create(reserva_id) {
    const result = await pool.query(
      `INSERT INTO facturas (reserva_id, nombre_cliente, total)
      SELECT 
          r.id, 
          c.nombre || ' ' || c.apellidos AS nombre_cliente,
          (h.precio * (r.fecha_salida - r.fecha_entrada)) + 
          COALESCE(SUM(sr.precio_total), 0) AS total
      FROM reservas r
      JOIN clientes c ON r.cliente_id = c.id
      JOIN habitaciones h ON r.habitacion_id = h.id
      LEFT JOIN servicios_reservas sr ON r.id = sr.reserva_id
      WHERE r.id = $1
      GROUP BY r.id, c.nombre, c.apellidos, h.precio, r.fecha_entrada, r.fecha_salida
      RETURNING *`,
      [reserva_id]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT f.id, 
              f.reserva_id, 
              f.nombre_cliente, 
              f.total, 
              TO_CHAR(f.fecha_emision, 'DD-MM-YYYY') AS fecha_emision
       FROM facturas f
       WHERE f.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findAll(limit = 20, offset = 0) {
    limit = Math.max(1, parseInt(limit, 10));
    offset = Math.max(0, parseInt(offset, 10));

    const result = await pool.query(
      `SELECT f.id, 
              f.reserva_id, 
              f.nombre_cliente, 
              f.total, 
              TO_CHAR(f.fecha_emision, 'DD-MM-YYYY') AS fecha_emision
       FROM facturas f
       ORDER BY f.fecha_emision DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async countAll() {
    const result = await pool.query("SELECT COUNT(*) FROM facturas");
    return parseInt(result.rows[0].count, 10);
  }
};

module.exports = Factura;