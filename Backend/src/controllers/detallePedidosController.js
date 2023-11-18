const db = require('../api/routes/db/db'); 
exports.agregarDetallePedido = async (req, res) => {
    const { pedido_id, productoVariante_id, cantidad, precio } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO DetallePedidos (Pedido_Id, ProductoVariante_Id, Cantidad, Precio) VALUES (?, ?, ?, ?)',
            [pedido_id, productoVariante_id, cantidad, precio]
        );
        res.status(200).json({ message: "Detalle de pedido agregado con éxito", detallePedidoId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};