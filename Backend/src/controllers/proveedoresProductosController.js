//proveedoresProductosController.js
const db = require('../api/routes/db/db'); 

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
        // Verifica si ya existe la asociación
        const existente = await db.query('SELECT * FROM ProveedoresProductos WHERE Producto_Id = ? AND Proveedor_Id = ?', [producto_id, proveedor_id]);

        if (existente.length > 0) {
            // Si ya existe, envía un mensaje indicando que la asociación ya existe
            res.status(400).json({ message: "Esta asociación proveedor-producto ya existe" });
        } else {
            // Si no existe, realiza la inserción
            const result = await db.query('INSERT INTO ProveedoresProductos (Producto_Id, Proveedor_Id) VALUES (?, ?)', [producto_id, proveedor_id]);
            res.status(200).json({ id: result.insertId });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Otros métodos para actualizar y eliminar asociaciones proveedor-producto
