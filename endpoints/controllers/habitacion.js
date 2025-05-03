const Habitacion = require("../models/Habitacion");

const postHabitacion = async (req, res) => {
  try {
    const newHabitacion = await Habitacion.create(req.body);
    res.json({ mensaje: "Habitación creada con éxito.", habitación: newHabitacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la habitación." });
  }
};

const getHabitaciones = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const habitacion = await Habitacion.findById(id);
      if (!habitacion) return res.status(404).json({ error: "Habitación no encontrada." });
      return res.json(habitacion);
    }

    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;

    const offset = (page - 1) * limit;

    const [habitaciones, totalHabitaciones] = await Promise.all([
      Habitacion.findAll(limit, offset),
      Habitacion.countAll(),
    ]);

    const totalPages = Math.ceil(totalHabitaciones / limit);

    res.json({
      data: habitaciones,
      totalHabitaciones,
      totalPages,
      currentPage: page,
      perPage: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las habitaciones." });
  }
};

const updateHabitacion = async (req, res) => {
  try {
    const habitacionUpdated = await Habitacion.update(req.params.id, req.body);
    if (!habitacionUpdated) return res.status(404).json({ error: "La habitación no existe." });
    res.json({ mensaje: "Habitación actualizada con éxito.", habitación: habitacionUpdated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la habitación." });
  }
};

const deleteHabitacion = async (req, res) => {
  try {
    const habitacionDeleted = await Habitacion.delete(req.params.id);
    if (!habitacionDeleted) return res.status(404).json({ error: "La habitación no existe." });
    res.json({ mensaje: "Habitación eliminada con éxito.", habitación: habitacionDeleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la habitación." });
  }
};

module.exports = {
  postHabitacion,
  getHabitaciones,
  updateHabitacion,
  deleteHabitacion,
};