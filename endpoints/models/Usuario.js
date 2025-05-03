const pool = require("../../config/db");

const Usuario = {
    async findByEmail(email) {
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        return result.rows[0];
    },

    async create({ nombre, apellido_1, apellido_2, email, password_hash, rol }) {
        const result = await pool.query(
            "INSERT INTO usuarios (nombre, apellido_1, apellido_2, email, password_hash, rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [nombre, apellido_1, apellido_2, email, password_hash, rol]
        );
        return result.rows[0];
    },

    async findById(id) {
        const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
        return result.rows[0];
      },

    async findAll(page, pageSize, orderBy = "id", orderDir = "ASC") {
        const offset = (page - 1) * pageSize;
        const result = await pool.query(
            `SELECT id, nombre, apellido_1, apellido_2, email, rol
             FROM usuarios
             ORDER BY ${orderBy} ${orderDir}
             LIMIT $1 OFFSET $2`,
            [pageSize, offset]
        );
        return result.rows;
    },
    
    async countAll() {
        const result = await pool.query("SELECT COUNT(*) FROM usuarios");
        return parseInt(result.rows[0].count, 10);
    },

    async update(id, data) {
        const campos = Object.keys(data);
        const valores = Object.values(data);
        if (campos.length === 0) return null;
    
        const columnas = campos.map((campo, i) => `${campo} = $${i + 1}`).join(", ");
        valores.push(id);
    
        const result = await pool.query(
          `UPDATE usuarios SET ${columnas} WHERE id = $${valores.length} RETURNING *`,
          valores
        );
        return result.rows[0];
      },

    async delete(id) {
        const { rows } = await pool.query("DELETE FROM usuarios WHERE id = $1 RETURNING *", [id]);
        return rows[0];
    }
};

module.exports = Usuario;