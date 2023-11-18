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
    const { producto_id, variantes } = req.body;

    try {
        for (const variante of variantes) {
            // Primero, verifica si ya existe una fila con el mismo producto_id y talla
            const existente = await db.query('SELECT * FROM ProductosVariantes WHERE Producto_Id = ? AND Talla = ?', [producto_id, variante.talla]);
            
            if (existente.length > 0) {
                // Si ya existe, actualiza la cantidad
                const nuevaCantidad = existente[0].Cantidad + variante.cantidad;
                await db.query('UPDATE ProductosVariantes SET Cantidad = ? WHERE Producto_Id = ? AND Talla = ?', [nuevaCantidad, producto_id, variante.talla]);
            } else {
                // Si no existe, inserta una nueva fila
                await db.query('INSERT INTO ProductosVariantes (Producto_Id, Talla, Cantidad) VALUES (?, ?, ?)', [producto_id, variante.talla, variante.cantidad]);
            }
        }

        res.status(200).json({ message: "Variantes actualizadas con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




