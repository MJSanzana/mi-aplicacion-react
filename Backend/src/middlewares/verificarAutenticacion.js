const jwt = require('jsonwebtoken');

const verificarAutenticacion = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
            const token = tokenParts[1];
            // En tu middleware de autenticación
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    console.error("Error al verificar el token:", err.message);
                    return res.status(401).json({ error: 'Token inválido' });
                } else {
                    console.log("Decoded Token:", decodedToken);
                    // Asegúrate de que estás buscando la propiedad 'id'
                    if (decodedToken.id) {
                        req.usuario = decodedToken;
                        next();
                    } else {
                        console.error("El token decodificado no contiene 'id'");
                        return res.status(401).json({ error: 'Token inválido' });
                    }

                }
            });


        } else {
            return res.status(401).json({ error: 'Formato de token inválido' });
        }
    } else {
        return res.status(401).json({ error: 'No autorizado, token faltante' });
    }
};
module.exports = verificarAutenticacion;

