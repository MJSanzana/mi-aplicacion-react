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

exports.obtenerProductosPorProveedorId = async (req, res) => {
    const proveedorId = req.params.userId;

    try {
        // Asumiendo que tienes una tabla que relaciona proveedores y productos
        const sqlQuery = 'SELECT p.* FROM Productos p INNER JOIN ProveedoresProductos pp ON p.id = pp.producto_id WHERE pp.proveedor_id = ?';
        const productos = await db.query(sqlQuery, [proveedorId]);

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.registrarVentaAProveedor = async (productoVarianteId, cantidadVendida) => {
    try {
        // Obtén el ID del proveedor asociado con la variante del producto
        const [variante] = await db.query('SELECT Proveedor_Id FROM ProveedoresProductos WHERE ProductoVariante_Id = ?', [productoVarianteId]);
        
        if (!variante) {
            throw new Error("Proveedor no encontrado para la variante del producto");
        }

        const proveedorId = variante.Proveedor_Id;

        // Inserta un registro en una tabla de 'VentasAProveedores' o similar
        await db.query('INSERT INTO VentasAProveedores (Proveedor_Id, ProductoVariante_Id, CantidadVendida) VALUES (?, ?, ?)', [proveedorId, productoVarianteId, cantidadVendida]);

        // Opcional: Envía una notificación al proveedor (requiere integración con un sistema de notificaciones)
        NotificarProveedor(proveedorId, productoVarianteId, cantidadVendida);

        return { success: true, message: 'Venta registrada con éxito' };
    } catch (error) {
        console.error('Error al registrar venta al proveedor:', error);
        return { success: false, message: error.message };
    }
};

// Función ficticia para simular la notificación a un proveedor
const NotificarProveedor = (proveedorId, productoVarianteId, cantidadVendida) => {
    // Implementa tu propia lógica de notificación aquí
    console.log(`Notificando al proveedor ${proveedorId} sobre la venta de la variante ${productoVarianteId} en cantidad ${cantidadVendida}`);
};

// proveedoresProductosController.js
exports.actualizarStockYNotificar = async (productoVarianteId, cantidadVendida) => {
    try {
        // Actualizar stock
        const [variante] = await db.query('SELECT Cantidad FROM ProductosVariantes WHERE Id = ?', [productoVarianteId]);
        const nuevaCantidad = variante.Cantidad - cantidadVendida;
        await db.query('UPDATE ProductosVariantes SET Cantidad = ? WHERE Id = ?', [nuevaCantidad, productoVarianteId]);

        // Notificar al proveedor (simulación)
        const [proveedor] = await db.query('SELECT Proveedor_Id FROM ProveedoresProductos WHERE ProductoVariante_Id = ?', [productoVarianteId]);
        console.log(`Notificando al proveedor ${proveedor.Proveedor_Id} sobre la venta de ${cantidadVendida} unidades del producto ${productoVarianteId}`);

        // Aquí podrías incluir lógica adicional, como enviar un email o realizar una llamada a una API externa

        return { success: true, message: 'Stock actualizado y proveedor notificado' };
    } catch (error) {
        console.error('Error al actualizar stock y notificar al proveedor:', error);
        return { success: false, message: error.message };
    }
};


// Otros métodos para actualizar y eliminar asociaciones proveedor-producto
