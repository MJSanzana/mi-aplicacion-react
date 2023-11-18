// controllers/metodosPagoController.js
const db = require('../api/routes/db/db'); 
const crypto = require('crypto');
const { promisify } = require('util');
const randomBytesAsync = promisify(crypto.randomBytes);

exports.crearMetodoPago = async (req, res) => {
    const { nombre, descripcion } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del método de pago es obligatorio.' });
    }
    
    try {
        const result = await db.query(
            'INSERT INTO MetodosPago (Nombre, Descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        res.status(200).json({ message: "Método de pago creado con éxito", metodoPagoId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerMetodosPago = async (req, res) => {
    try {
        const metodosPago = await db.query('SELECT * FROM MetodosPago WHERE Activo = ?', [true]);
        res.json(metodosPago);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};