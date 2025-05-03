const express = require("express");
const router = express.Router();

const clientesController = require("../controllers/cliente");
const facturasController = require("../controllers/factura");
const habitacionesController = require("../controllers/habitacion");
const reservasController = require("../controllers/reserva");
const serviciosReservaController = require("../controllers/servicio_reserva");
const serviciosController = require("../controllers/servicio");
const authController = require("../controllers/usuario");

const { authenticateUser, authorizeRole } = require("../../middleware/auth");

router.post("/clientes/register", authenticateUser, authorizeRole(["recepcion", "gerente"]), clientesController.postCliente);
router.get("/clientes/search/:id?", authenticateUser, authorizeRole(["recepcion", "gerente"]), clientesController.getClientes);
router.put("/clientes/update/:id", authenticateUser, authorizeRole(["recepcion", "gerente"]), clientesController.updateCliente);
router.delete("/clientes/delete/:id", authenticateUser, authorizeRole(["recepcion", "gerente"]), clientesController.deleteCliente);

router.post("/facturas/register", authenticateUser, authorizeRole(["recepcion", "gerente"]), facturasController.postFactura);
router.get("/facturas/search/:id?", authenticateUser, authorizeRole(["recepcion", "gerente"]), facturasController.getFacturas);

router.post("/habitaciones/register", authenticateUser, authorizeRole(["gerente"]), habitacionesController.postHabitacion);
router.get("/habitaciones/search/:id?", authenticateUser, authorizeRole(["recepcion", "gerente"]), habitacionesController.getHabitaciones);
router.put("/habitaciones/update/:id", authenticateUser, authorizeRole(["gerente"]), habitacionesController.updateHabitacion);
router.delete("/habitaciones/delete/:id", authenticateUser, authorizeRole(["gerente"]), habitacionesController.deleteHabitacion);

router.post("/reservas/register", authenticateUser, authorizeRole(["recepcion", "gerente"]), reservasController.postReserva);
router.get("/reservas/search/:id?", authenticateUser, authorizeRole(["recepcion", "gerente"]), reservasController.getReservas);
router.put("/reservas/update/:id", authenticateUser, authorizeRole(["recepcion", "gerente"]), reservasController.updateReserva);
router.delete("/reservas/delete/:id", authenticateUser, authorizeRole(["recepcion", "gerente"]), reservasController.deleteReserva);

router.post("/servicios_reservas/register", authenticateUser, authorizeRole(["recepcion", "gerente"]), serviciosReservaController.postServicioReserva);
router.get("/servicios_reservas/search/:reserva_id?", authenticateUser, authorizeRole(["recepcion", "gerente"]), serviciosReservaController.getServiciosReserva);
router.put("/servicios_reservas/update/:id", authenticateUser, authorizeRole(["recepcion", "gerente"]), serviciosReservaController.updateServicioReserva);
router.delete("/servicios_reservas/delete/:id", authenticateUser, authorizeRole(["recepcion", "gerente"]), serviciosReservaController.deleteServicioReserva);

router.post("/servicios/register", authenticateUser, authorizeRole(["gerente"]), serviciosController.postServicio);
router.get("/servicios/search/:id?", authenticateUser, authorizeRole(["recepcion", "gerente"]), serviciosController.getServicios);
router.put("/servicios/update/:id", authenticateUser, authorizeRole(["gerente"]), serviciosController.updateServicio);
router.delete("/servicios/delete/:id", authenticateUser, authorizeRole(["gerente"]), serviciosController.deleteServicio);

router.post("/usuarios/login", authController.login);
router.post("/usuarios/register", authenticateUser, authorizeRole(["gerente"]), authController.registerUsuario);
router.get("/usuarios/search/:id?", authenticateUser, authorizeRole(["gerente"]), authController.getUsuarios);
router.put("/usuarios/update/:id", authenticateUser, authorizeRole(["gerente"]), authController.updateUsuario);
router.delete("/usuarios/delete/:id", authenticateUser, authorizeRole(["gerente"]), authController.deleteUsuario);

module.exports = router;