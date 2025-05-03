const Cliente = require("../models/Cliente");

const postCliente = async (req, res) => {
  try {
    const newCliente = await Cliente.create(req.body);
    res.json({ mensaje: "Cliente creado con éxito.", cliente: newCliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el cliente." });
  }
};

const getClientes = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const cliente = await Cliente.findById(id);
      if (!cliente) return res.status(404).json({ error: "Cliente no encontrado." });
      return res.json(cliente);
    }

    let { page = 1, limit = 20, ...filters } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;

    const offset = (page - 1) * limit;

    const hayFiltros = Object.values(filters).some((v) => v && v.trim() !== "");

    const [clientes, totalClientes] = await Promise.all([
      hayFiltros ? Cliente.search(filters, limit, offset) : Cliente.findAll(limit, offset),
      hayFiltros ? Cliente.countFiltered(filters) : Cliente.countAll(),
    ]);

    const totalPages = Math.ceil(totalClientes / limit);

    res.json({
      data: clientes,
      totalClientes,
      totalPages,
      currentPage: page,
      perPage: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes." });
  }
};

const updateCliente = async (req, res) => {
  try {
    const clienteUpdated = await Cliente.update(req.params.id, req.body);
    if (!clienteUpdated) return res.status(404).json({ error: "El cliente no existe." });
    res.json({ mensaje: "Cliente actualizado con éxito.", cliente: clienteUpdated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar cliente." });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const clienteDeleted = await Cliente.delete(req.params.id);
    if (!clienteDeleted) return res.status(404).json({ error: "El cliente no existe." });
    res.json({ mensaje: "Cliente eliminado con éxito.", cliente: clienteDeleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el cliente." });
  }
};

module.exports = {
  postCliente,
  getClientes,
  updateCliente,
  deleteCliente,
};