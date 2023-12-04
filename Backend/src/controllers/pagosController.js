// controllers/pagosController.js
const db = require('../api/routes/db/db');
const crypto = require('crypto');

exports.registrarPago = async (req, res) => {
    const { pedidoId, metodoPagoId, usuarioId, moneda, detalles } = req.body;
    let { monto } = req.body;

    if (!monto || isNaN(parseFloat(monto))) {
        return res.status(400).json({ error: 'El monto es inválido o está ausente.' });
    }
    
    monto = parseFloat(monto).toFixed(2); // Asegurar dos decimales

    // Simular una respuesta de la pasarela de pago
    const estadoPago = Math.random() < 0.9 ? 'exitoso' : 'fallido'; // 90% de probabilidad de éxito
    const proveedorPagoId = crypto.randomBytes(12).toString('hex'); // ID simulado del proveedor de pagos

    try {
        await db.query('INSERT INTO Pagos (Pedido_Id, MetodoPago_Id, Usuario_Id, Monto, Moneda, Estado, ProveedorPago_Id, Detalles) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                       [pedidoId, metodoPagoId, usuarioId, monto, moneda, estadoPago, proveedorPagoId, detalles]);
        
        res.status(200).json({ message: "Pago registrado con éxito", estado: estadoPago });
    } catch (error) {
        console.error('Error al registrar el pago:', error);
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

exports.crearPagoSimulado = async (req, res) => {
    const { pedidoId, monto, moneda, usuarioId } = req.body;

    try {
        const estadoPago = Math.random() < 0.9 ? 'exitoso' : 'fallido';
        const transaccionId = crypto.randomBytes(12).toString('hex');

        await db.query('INSERT INTO Pagos (Pedido_Id, Monto, Moneda, Estado, ProveedorPago_Id, Usuario_Id) VALUES (?, ?, ?, ?, ?, ?)', 
                       [pedidoId, monto, moneda, estadoPago, transaccionId, usuarioId ? usuarioId : null]);

        res.status(200).json({ message: "Pago simulado registrado con éxito", estado: estadoPago, transaccionId: transaccionId });
    } catch (error) {
        res.status(500).json({ error: 'Error al simular el pago: ' + error.message });
    }
};