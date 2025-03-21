const ServiciosReserva = require("../models/Servicio_reserva");

const postServicioReserva = async (req, res) => {
  try {
    const { reserva_id, servicio_id, cantidad } = req.body;

    if (!reserva_id || !servicio_id || !cantidad) {
      return res.status(400).json({ error: "Faltan datos necesarios." });
    }

    const newServicioReserva = await ServiciosReserva.create({
      reserva_id,
      servicio_id,
      cantidad,
    });

    res.json({ mensaje: "Servicio cargado con éxito a la reserva.", servicio_cargado: newServicioReserva });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const getServiciosReserva = async (req, res) => {
  try {
    const { reserva_id } = req.params;
    if (reserva_id) {
      const serviciosReserva = await ServiciosReserva.findById(reserva_id);
      if (!serviciosReserva) {
        return res.status(404).json({ error: "No se encontraron servicios asociados a esta reserva." });
      }
      return res.json(serviciosReserva);
    }

    const { page = 1, pageSize = 10 } = req.query;
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedPageSize = Math.max(1, parseInt(pageSize, 10) || 10);

    const [serviciosReservas, total] = await Promise.all([
      ServiciosReserva.findAll(parsedPage, parsedPageSize),
      ServiciosReserva.countAll()
    ]);

    res.json({
      data: serviciosReservas,
      totalServiciosReservas: total,
      totalPages: Math.ceil(total / parsedPageSize),
      page: parsedPage,
      limit: parsedPageSize
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los servicios de reserva." });
  }
};

const updateServicioReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const servicioReservaUpdated = await ServiciosReserva.update(id, data);
    if (!servicioReservaUpdated) {
      return res.status(404).json({ error: "El servicio de reserva no existe." });
    }

    res.json({ mensaje: "Servicio actualizado con éxito.", servicio_actualizado: servicioReservaUpdated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el servicio de la reserva." });
  }
};

const deleteServicioReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const servicioReservaDeleted = await ServiciosReserva.delete(id);

    if (!servicioReservaDeleted) {
      return res.status(404).json({ error: "Servicio de la reserva no encontrado." });
    }

    res.json({ mensaje: "Servicio eliminado con éxito de la reserva.", servicio_eliminado: servicioReservaDeleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el servicio de la reserva." });
  }
};

module.exports = {
  postServicioReserva,
  getServiciosReserva,
  updateServicioReserva,
  deleteServicioReserva
};