const db = require('../db/db'); 

exports.crearPedido = async (req, res) => {
    const { usuario_id, total, metodo_pago } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Pedidos (Usuario_Id, Total, Metodo_Pago) VALUES (?, ?, ?)',
            [usuario_id, total, metodo_pago]
        );
        res.status(200).json({ message: "Pedido creado con éxito", pedidoId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPedidosUsuario = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const pedidos = await db.query('SELECT * FROM Pedidos WHERE Usuario_Id = ?', [usuario_id]);
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

