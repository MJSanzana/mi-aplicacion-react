//proveedoresProductosController.js
const db = require('../api/routes/db/db');

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
            // Verifica si ya existe una fila con el mismo producto_id y talla
            const existente = await db.query('SELECT * FROM ProductosVariantes WHERE Producto_Id = ? AND Talla = ?', [producto_id, variante.talla]);

            // Si no existe, inserta una nueva fila
            if (existente.length === 0) {
                await db.query('INSERT INTO ProductosVariantes (Producto_Id, Talla, Cantidad) VALUES (?, ?, ?)', [producto_id, variante.talla, variante.cantidad]);
            }
        }

        res.status(200).json({ message: "Variantes creadas con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarVariante = async (req, res) => {
    const { producto_id, talla, cantidad } = req.body;

    try {
        // Primero, verifica si ya existe una fila con el mismo producto_id y talla
        const existente = await db.query('SELECT * FROM ProductosVariantes WHERE Producto_Id = ? AND Talla = ?', [producto_id, talla]);

        if (existente.length > 0) {
            // Si ya existe, actualiza la cantidad
            await db.query('UPDATE ProductosVariantes SET Cantidad = ? WHERE Producto_Id = ? AND Talla = ?', [cantidad, producto_id, talla]);
            res.status(200).json({ message: "Variante actualizada con éxito" });
        } else {
            // Si no existe, envía un mensaje de error
            res.status(404).json({ message: "Variante no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerVariantesPorProductoId = async (req, res) => {
    const productoId = req.params.productoId;

    try {
        const variantes = await db.query('SELECT * FROM ProductosVariantes WHERE Producto_Id = ?', [productoId]);
        res.json(variantes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarVarianteId = async (req, res) => {
    const { producto_id } = req.params;
    const { talla, cantidad } = req.body;
    try {
        // Primero, verifica si ya existe una fila con el mismo producto_id y talla
        const [existente] = await db.query('SELECT * FROM ProductosVariantes WHERE Producto_Id = ? AND Talla = ?', [producto_id, talla]);

        if (existente) {
            // Si ya existe, suma la cantidad proporcionada a la cantidad actual
            await db.query('UPDATE ProductosVariantes SET Cantidad = Cantidad + ? WHERE Producto_Id = ? AND Talla = ?', [cantidad, producto_id, talla]);
            res.status(200).json({ message: "Stock actualizado con éxito" });
        } else {
            // Si no existe, envía un mensaje de error
            res.status(404).json({ message: "Variante no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};