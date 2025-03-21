const Factura = require("../models/Factura");

const postFactura = async (req, res) => {
  try {
    const { reserva_id } = req.body;

    if (!reserva_id) {
      return res.status(400).json({ error: "Introduce el id de la reserva para generar la factura." });
    }

    const newFactura = await Factura.create(reserva_id);

    res.json({ mensaje: "Factura creada con éxito.", factura: newFactura });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const getFacturas = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const factura = await Factura.findById(id);
      if (!factura) return res.status(404).json({ error: "Factura no encontrada." });
      return res.json(factura);
    }

    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;

    const offset = (page - 1) * limit;

    const [facturas, totalFacturas] = await Promise.all([
      Factura.findAll(limit, offset),
      Factura.countAll(),
    ]);

    const totalPages = Math.ceil(totalFacturas / limit);

    res.json({
      data: facturas,
      totalFacturas,
      totalPages,
      currentPage: page,
      perPage: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las facturas." });
  }
};

module.exports = {
  postFactura,
  getFacturas,
};