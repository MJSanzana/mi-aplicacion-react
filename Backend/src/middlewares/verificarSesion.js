//verificarSesion.js

const verificarSesion = (req, res, next) => {
    if (req.session && req.session.userId) {
        req.usuario = { id: req.session.userId };
        next();
    } else {
        next(); // No hay sesión, pasa al siguiente middleware
    }
};

module.exports = verificarSesion;
