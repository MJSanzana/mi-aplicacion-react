//proveedoresProductosController.js
const db = require('../db/db');

exports.obtenerVariantes = async (req, res) => {
    try {
        const variantes = await db.query('SELECT * FROM ProductosVariantes');
        res.json(variantes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearVariante = async (req, res) => {
    const { producto_id, talla, cantidad } = req.body;
    try {
        const result = await db.query('INSERT INTO ProductosVariantes (Producto_Id, Talla, Cantidad) VALUES (?, ?, ?)', [producto_id, talla, cantidad]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


