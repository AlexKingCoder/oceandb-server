const Reserva = require("../models/Reserva");

const postReserva = async (req, res) => {
  try {
    const newReserva = await Reserva.create(req.body);
    res.json({ mensaje: "Reserva creada con éxito.", reserva: newReserva });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const getReservas = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const reserva = await Reserva.findById(id);
      if (!reserva) return res.status(404).json({ error: "Reserva no encontrada. Comprueba la id." });
      return res.json(reserva);
    }

    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ error: "El parámetro 'page' debe ser un número positivo." });
    }

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ error: "El parámetro 'limit' debe ser un número positivo." });
    }

    const offset = (page - 1) * limit;

    const [reservas, totalReservas] = await Promise.all([
      Reserva.findAll(limit, offset),
      Reserva.countAll(),
    ]);

    const totalPages = Math.ceil(totalReservas / limit);

    res.json({
      data: reservas,
      totalReservas,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las reservas." });
  }
};

const updateReserva = async (req, res) => {
  try {
    const reservaUpdated = await Reserva.update(req.params.id, req.body);
    
    if (!reservaUpdated) {
      return res.status(404).json({ error: "La reserva no existe. Comprueba la id." });
    }

    res.json({ mensaje: "Reserva actualizada con éxito.", reserva: reservaUpdated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error al actualizar la reserva." });
  }
};

const deleteReserva = async (req, res) => {
  try {
    const reservaDeleted = await Reserva.delete(req.params.id);
    if (!reservaDeleted) return res.status(404).json({ error: "La reserva no existe. Comprueba la id." });

    res.json({ mensaje: "Reserva eliminada con éxito.", reserva: reservaDeleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la reserva." });
  }
};

module.exports = {
  postReserva,
  getReservas,
  updateReserva,
  deleteReserva,
};