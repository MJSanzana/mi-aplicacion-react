// controllers/pagosController.js
const db = require('../api/routes/db/db');
const crypto = require('crypto');

exports.registrarPago = async (req, res) => {
    const { pedido_id, metodoPago_id, usuario_id, moneda, estado, proveedorPago_id, detalles } = req.body;
    let { monto } = req.body;
    // Asegúrate de que monto es un número y conviértelo si es necesario
    if (monto === undefined || monto === null || monto === '') {
        return res.status(400).json({ error: 'El monto es obligatorio.' });
    }
    // Si monto es un string, reemplaza comas y puntos correctamente
    if (typeof monto === 'string') {
        monto = monto.replace(/\./g, '').replace(/,/g, '.');
    }
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico)) {
        return res.status(400).json({ error: 'El monto debe ser un número válido.' });
    }
    // Continúa con el cifrado de detalles
    const encryptedDetails = crypto.createHmac('sha256', process.env.PAYMENT_ENCRYPTION_KEY)
        .update(detalles)
        .digest('hex');
    try {
        const result = await db.query(
            'INSERT INTO Pagos (Pedido_Id, MetodoPago_Id, Usuario_Id, Monto, Moneda, Estado, ProveedorPago_Id, Detalles) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [pedido_id, metodoPago_id, usuario_id, montoNumerico, moneda, estado, proveedorPago_id, encryptedDetails]
        );
        res.status(200).json({ message: "Pago registrado con éxito", pagoId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el pago: ' + error.message });
    }
};

exports.obtenerPagos = async (req, res) => {
    const usuario_id = req.usuario.id;
    console.log("Usuario ID:", usuario_id);

    try {
        const pagos = await db.query('SELECT * FROM Pagos WHERE Usuario_Id = ?', [usuario_id]);
        console.log("Pagos encontrados:", pagos);
        res.json(pagos);
    } catch (error) {
        console.error("Error en la consulta:", error.message);
        res.status(500).json({ error: error.message });
    }
};