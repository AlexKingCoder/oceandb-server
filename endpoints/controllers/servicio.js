const Servicio = require("../models/Servicio");

const postServicio = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    if (!nombre || !descripcion || precio === undefined) {
      return res.status(400).json({ error: "Faltan datos necesarios." });
    }

    const newServicio = await Servicio.create({ nombre, descripcion, precio });
    res.json({ mensaje: "Servicio creado con éxito.", servicio: newServicio });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const getServicios = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const servicio = await Servicio.findById(id);
      if (!servicio) return res.status(404).json({ error: "Servicio no encontrado. Comprueba la id." });
      return res.json(servicio);
    }

    const { page = 1, pageSize = 10, orderBy, orderDir } = req.query;
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedPageSize = Math.max(1, parseInt(pageSize, 10) || 10);

    const [servicios, total] = await Promise.all([
      Servicio.findAll(parsedPage, parsedPageSize, orderBy, orderDir),
      Servicio.countAll()
    ]);

    res.json({
      data: servicios,
      totalServicios: total,
      totalPages: Math.ceil(total / parsedPageSize),
      page: parsedPage,
      limit: parsedPageSize
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los servicios." });
  }
};

const updateServicio = async (req, res) => {
  try {
    const servicioUpdated = await Servicio.update(req.params.id, req.body);
    if (!servicioUpdated) return res.status(404).json({ error: "El servicio no existe. Comprueba la id." });

    res.json({ mensaje: "Servicio actualizado con éxito.", servicio: servicioUpdated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteServicio = async (req, res) => {
  try {
    const servicioDeleted = await Servicio.delete(req.params.id);
    if (!servicioDeleted) return res.status(404).json({ error: "El servicio no existe. Comprueba la id." });

    res.json({ mensaje: "Servicio eliminado con éxito.", servicio: servicioDeleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  postServicio,
  getServicios,
  updateServicio,
  deleteServicio
};