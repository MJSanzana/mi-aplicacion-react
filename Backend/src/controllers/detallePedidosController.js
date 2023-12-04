//detallePedidosController.js
const db = require('../api/routes/db/db');
const proveedoresProductosController = require('./proveedoresProductosController');

exports.agregarDetallePedido = async (req, res) => {
    const { pedidoId, productoVarianteId, cantidad, precio } = req.body;

    if (typeof productoVarianteId === 'undefined') {
        return res.status(400).json({ error: 'ID de variante del producto no proporcionado.' });
    }

    try {
        // Inserta el detalle del pedido
        await db.query(
            'INSERT INTO DetallePedidos (Pedido_Id, ProductoVariante_Id, Cantidad, Precio) VALUES (?, ?, ?, ?)',
            [pedidoId, productoVarianteId, cantidad, precio]
        );
        // Busca la variante del producto para obtener la cantidad actual
        const variantes = await db.query('SELECT * FROM ProductosVariantes WHERE Id = ?', [productoVarianteId]);
        if (variantes.length === 0) {
            return res.status(400).json({ error: `No se encontró la variante del producto con ID ${productoVarianteId}` });
        }

        const variante = variantes[0];
        const nuevaCantidad = variante.Cantidad - cantidad;

        if (nuevaCantidad < 0) {
            throw new Error("Stock insuficiente para realizar el pedido");
        }

        // Actualiza el stock del producto variante
        await db.query('UPDATE ProductosVariantes SET Cantidad = ? WHERE Id = ?', [nuevaCantidad, productoVarianteId]);

        // Registra la venta con el proveedor
        await proveedoresProductosController.registrarVentaAProveedor(productoVarianteId, cantidad);

        res.status(200).json({ message: "Detalle de pedido agregado, stock actualizado y venta registrada con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};