// productosController.js
const db = require('../db/db'); 

exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await db.query('SELECT * FROM Productos');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearProducto = async (req, res) => {
    const { nombre, descripcion, precio, imagen, aprobado, estado, sku } = req.body;
    try {
        const result = await db.query('INSERT INTO Productos (Nombre, Descripcion, Precio, Imagen, Aprobado, Estado, SKU) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, descripcion, precio, imagen, aprobado, estado, sku]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Otros métodos para actualizar y eliminar productos
