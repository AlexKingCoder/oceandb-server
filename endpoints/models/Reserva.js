const pool = require("../../config/db");

const Reserva = {
  async create(data) {
    const { cliente_id, habitacion_id, fecha_entrada, fecha_salida, estado } = data;

    const clienteResult = await pool.query(
      "SELECT id FROM clientes WHERE CONCAT(nombre, ' ', apellidos) = $1 LIMIT 1",
      [cliente_id]
    );

    if (clienteResult.rows.length === 0) {
      throw new Error("Cliente no encontrado. Comprueba que el nombre y apellidos sean correctos.");
    }

    const clienteId = clienteResult.rows[0].id;

    const habitacionResult = await pool.query(
      "SELECT id FROM habitaciones WHERE numero = $1 LIMIT 1",
      [habitacion_id]
    );

    if (habitacionResult.rows.length === 0) {
      throw new Error("Habitación no encontrada. Comprueba que el número sea correcto.");
    }

    const habitacionId = habitacionResult.rows[0].id;

    const result = await pool.query(
      "INSERT INTO reservas (cliente_id, habitacion_id, fecha_entrada, fecha_salida, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [clienteId, habitacionId, fecha_entrada, fecha_salida, estado]
    );

    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT r.id, 
              c.nombre || ' ' || c.apellidos AS cliente_id, 
              h.numero AS habitacion_id, 
              TO_CHAR(r.fecha_entrada, 'DD-MM-YYYY') AS fecha_entrada, 
              TO_CHAR(r.fecha_salida, 'DD-MM-YYYY') AS fecha_salida, 
              r.estado
       FROM reservas r
       JOIN clientes c ON r.cliente_id = c.id
       JOIN habitaciones h ON r.habitacion_id = h.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findAll(limit = 20, offset = 0) {
    const result = await pool.query(
      `SELECT r.id, 
              c.nombre || ' ' || c.apellidos AS cliente_id, 
              h.numero AS habitacion_id, 
              TO_CHAR(r.fecha_entrada, 'DD-MM-YYYY') AS fecha_entrada, 
              TO_CHAR(r.fecha_salida, 'DD-MM-YYYY') AS fecha_salida,  
              r.estado
       FROM reservas r
       JOIN clientes c ON r.cliente_id = c.id
       JOIN habitaciones h ON r.habitacion_id = h.id
       ORDER BY r.fecha_entrada ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async countAll() {
    const result = await pool.query("SELECT COUNT(*) FROM reservas");
    return parseInt(result.rows[0].count, 10);
  },

  async update(id, data) {
    const campos = Object.keys(data);
    const valores = Object.values(data);
  
    if (data.cliente_id) {
      console.log("Verificando cliente_id:", data.cliente_id);
  
      const clienteResult = await pool.query(
        `SELECT id FROM clientes WHERE CONCAT(nombre, ' ', apellidos) = $1`,
        [data.cliente_id]
      );
  
      console.log("Resultado de búsqueda de cliente:", clienteResult.rows);
  
      if (clienteResult.rows.length === 0) {
        throw new Error("Cliente no encontrado.");
      }
  
      data.cliente_id = clienteResult.rows[0].id;
    }
  
    if (data.habitacion_id) {
      console.log("Verificando habitacion_id:", data.habitacion_id);
  
      const habitacionResult = await pool.query(
        `SELECT id FROM habitaciones WHERE numero = $1`,
        [data.habitacion_id]
      );
  
      console.log("Resultado de búsqueda de habitación:", habitacionResult.rows);
  
      if (habitacionResult.rows.length === 0) {
        throw new Error("Habitación no encontrada.");
      }
  
      data.habitacion_id = habitacionResult.rows[0].id;
    }
  
    if (campos.length === 0) return null;
  
    const valoresActualizados = campos.map(campo => data[campo]);
    valoresActualizados.push(id);
  
    console.log("Ejecutando consulta con los valores:", valoresActualizados);
  
    const columnas = campos.map((campo, i) => `${campo} = $${i + 1}`).join(", ");
  
    const result = await pool.query(
      `UPDATE reservas SET ${columnas} WHERE id = $${valoresActualizados.length} RETURNING *`,
      valoresActualizados
    );
  
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query("DELETE FROM reservas WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
};

module.exports = Reserva;