// verificarAutenticacion.js
const jwt = require('jsonwebtoken');

const verificarAutenticacion = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }
            req.usuario = decodedToken;
            next();
        });
    } else {
        next(); // No hay token, pasa al siguiente middleware
    }
};

module.exports = verificarAutenticacion;
