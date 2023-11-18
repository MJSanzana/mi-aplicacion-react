// productosController.js
const db = require('../api/routes/db/db'); 

exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await db.query('SELECT * FROM Productos');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearProducto = async (req, res) => {
    const { nombre, descripcion, genero, precio, imagen, aprobado, estado, sku } = req.body;
    try {
        const result = await db.query('INSERT INTO Productos (Nombre, Descripcion, Genero, Precio, Imagen, Aprobado, Estado, SKU) VALUES (?, ?, ?, ?, ?, ?,  ?, ?)', [nombre, descripcion, genero, precio, imagen, aprobado, estado, sku]);
        res.status(200).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProductApproval = async (req, res) => {
    const productId = req.params.id;
    const { aprobado } = req.body; // Cambia 'estado' por 'aprobado' para que coincida con tu campo de base de datos
    
    // Verificar que 'aprobado' es un valor válido (0 o 1)
    if (aprobado !== 0 && aprobado !== 1) {
        return res.status(400).json({ message: 'El valor de aprobación es inválido' });
    }
    
    let sqlUpdateApproval = 'UPDATE productos SET Aprobado = ? WHERE id = ?';
    
    try {
        await db.query(sqlUpdateApproval, [aprobado, productId]);
        res.json({ message: 'Aprobación del producto actualizada con éxito' });
    } catch (err) {
        console.error('Error al actualizar la aprobación del producto:', err);
        return res.status(500).json({ message: 'Error interno del servidor al actualizar la aprobación' });
    }
};
// Otros métodos para actualizar y eliminar productos
