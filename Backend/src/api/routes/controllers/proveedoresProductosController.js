//proveedoresProductosController.js
const db = require('../db/db'); 

exports.obtenerProveedoresProductos = async (req, res) => {
    try {
        const proveedoresProductos = await db.query('SELECT * FROM ProveedoresProductos');
        res.json(proveedoresProductos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearProveedorProducto = async (req, res) => {
    const { producto_id, proveedor_id } = req.body;
    try {
        const result = await db.query('INSERT INTO ProveedoresProductos (Producto_Id, Proveedor_Id) VALUES (?, ?)', [producto_id, proveedor_id]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Otros métodos para actualizar y eliminar asociaciones proveedor-producto
