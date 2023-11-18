// controllers/pagosController.js
const db = require('../api/routes/db/db'); 
const jwt = require('jsonwebtoken');

exports.registrarPago = async (req, res) => {
    const { pedido_id, metodoPago_id, usuario_id, monto, moneda, estado, proveedorPago_id, detalles } = req.body;

    // Puedes decidir cifrar algunos detalles del pago aquí usando crypto
    const encryptedDetails = crypto.createHmac('sha256', process.env.PAYMENT_ENCRYPTION_KEY)
                           .update(detalles)
                           .digest('hex');

    try {
        const result = await db.query(
            'INSERT INTO Pagos (Pedido_Id, MetodoPago_Id, Usuario_Id, Monto, Moneda, Estado, ProveedorPago_Id, Detalles) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [pedido_id, metodoPago_id, usuario_id, monto, moneda, estado, proveedorPago_id, encryptedDetails]
        );
        res.status(200).json({ message: "Pago registrado con éxito", pagoId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPagos = async (req, res) => {
    const usuario_id = req.usuario.id; // Suponiendo que tienes autenticación y que el ID viene del token JWT

    try {
        const pagos = await db.query('SELECT * FROM Pagos WHERE Usuario_Id = ?', [usuario_id]);
        // Decidir si necesitas desencriptar los detalles aquí o enviarlos como están
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
