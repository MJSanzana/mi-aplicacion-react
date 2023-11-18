// controllers/logPagosController.js
const db = require('../api/routes/db/db'); 

exports.registrarEventoPago = async (req, res) => {
    const { pago_id, evento } = req.body;
    
    // Verificar si el usuario es administrador
    if (req.usuario && req.usuario.TipoUsuario === 'administrador') {
        try {
            const result = await db.query(
                'INSERT INTO LogPagos (Pago_Id, Evento) VALUES (?, ?)',
                [pago_id, evento]
            );
            res.status(200).json({ message: "Evento de pago registrado con éxito", logId: result.insertId });
        } catch (error) {
            console.error('Error al registrar el evento de pago:', error);
            res.status(500).json({ error: 'Error al registrar el evento de pago' });
        }
    } else {
        res.status(403).json({ error: 'Acceso denegado' });
    }
};

exports.obtenerLogPagos = async (req, res) => {
    // Verificar si el usuario es administrador
    if (req.usuario && req.usuario.TipoUsuario === 'administrador') {
        try {
            const logPagos = await db.query('SELECT * FROM LogPagos');
            res.json(logPagos);
        } catch (error) {
            console.error('Error al obtener los logs de pagos:', error);
            res.status(500).json({ error: 'Error al obtener los logs de pagos' });
        }
    } else {
        res.status(403).json({ error: 'Acceso denegado' });
    }
};
