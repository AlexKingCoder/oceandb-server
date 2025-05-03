const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. No se ha proporcionado el token." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "El token no es válido o ha expirado." });
    }
};

const authorizeRole = (permitedRoles) => {
    return (req, res, next) => {
        if (!req.user || !permitedRoles.includes(req.user.rol)) {
            return res.status(403).json({ error: "Acceso denegado. No tienes permisos." });
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRole };