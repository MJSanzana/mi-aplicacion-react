const jwt = require('jsonwebtoken');

const verificarAutenticacion = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ error: 'Token inválido' });
            } else {
                req.usuario = decodedToken; // Suponiendo que el token incluye el TipoUsuario y otros detalles del usuario
                next();
            }
        });
    } else {
        res.status(401).json({ error: 'No autorizado' });
    }
};

module.exports = verificarAutenticacion;