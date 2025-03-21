const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Inserta un usuario y contraseña." });
        }

        const user = await Usuario.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Usuario o contraseña incorrecta." });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: "Usuario o contraseña incorrecta." });
        }

        const token = jwt.sign({ userId: user.id, nombre: user.nombre, rol: user.rol }, SECRET_KEY, { expiresIn: "1d" });

        res.json({ mensaje: "Login realizado con éxito.", token, rol: user.rol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor." });
    }
};

const registerUsuario = async (req, res) => {
    try {
        const { nombre, apellido_1, apellido_2, email, password, rol } = req.body;

        if (!nombre || !apellido_1 || !apellido_2 || !email || !password || !rol) {
            return res.status(400).json({ error: "Faltan campos por rellenar." });
        }

        const existingUser = await Usuario.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "El email ya está registrado. Utiliza uno diferente." });
        }

        const allowedRoles = ["recepcion", "gerente"];
        if (!allowedRoles.includes(rol)) {
            return res.status(400).json({ error: "Este rol no está permitido. Solo se permite 'recepcion' o 'gerente'." });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await Usuario.create({ nombre, apellido_1, apellido_2, email, password_hash, rol });

        res.status(201).json({ mensaje: "Usuario registrado con éxito.", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor." });
    }
};

const getUsuarios = async (req, res) => {
    try {
      const { id } = req.params;
      if (id) {
        const usuario = await Usuario.findById(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado. Comprueba la id." });
        return res.json(usuario);
      }
  
      const { page = 1, pageSize = 10, orderBy, orderDir } = req.query;
      const parsedPage = Math.max(1, parseInt(page, 10) || 1);
      const parsedPageSize = Math.max(1, parseInt(pageSize, 10) || 10);
  
      const [usuarios, total] = await Promise.all([
        Usuario.findAll(parsedPage, parsedPageSize, orderBy, orderDir),
        Usuario.countAll()
      ]);
  
      res.json({
        data: usuarios,
        totalUsuarios: total,
        totalPages: Math.ceil(total / parsedPageSize),
        page: parsedPage,
        limit: parsedPageSize
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los usuarios." });
    }
  };

const updateUsuario = async (req, res) => {
    try {
      const usuarioUpdated = await Usuario.update(req.params.id, req.body);
      if (!usuarioUpdated) return res.status(404).json({ error: "El usuario no existe. Comprueba la id." });
  
      res.json({ mensaje: "Usuario actualizado con éxito.", usuario: usuarioUpdated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el usuario." });
    }
  };

const deleteUsuario = async (req, res) => {
    try {
      const usuarioDeleted = await Usuario.delete(req.params.id);
      if (!usuarioDeleted) return res.status(404).json({ error: "El usuario no existe. Comprueba la id." });
  
      res.json({ mensaje: "Usuario eliminado con éxito.", usuario: usuarioDeleted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el usuario." });
    }
  };

module.exports = { login, registerUsuario, updateUsuario, getUsuarios, deleteUsuario };