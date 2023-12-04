//pedidosController.js
const db = require('../api/routes/db/db'); 

exports.crearPedido = (req, res) => {
    const usuarioId = req.usuario ? req.usuario.id : null; // Manejar usuarios no registrados
    const { total, metodo_pago } = req.body;

    db.pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: err.message });
            }

            const sql = 'INSERT INTO Pedidos (Usuario_Id, Total, Metodo_Pago) VALUES (?, ?, ?)';
            connection.query(sql, [usuarioId, total, metodo_pago], (err, result) => {
                if (err) {
                    connection.rollback(() => {
                        connection.release();
                        return res.status(500).json({ error: err.message });
                    });
                } else {
                    connection.commit(err => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                return res.status(500).json({ error: err.message });
                            });
                        } else {
                            connection.release();
                            res.status(200).json({ message: "Pedido creado con éxito", pedidoId: result.insertId });
                        }
                    });
                }
            });
        });
    });
};

exports.obtenerPedidosUsuario = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const resultados = await db.query('SELECT * FROM Pedidos WHERE Usuario_Id = ?', [usuario_id]);
        const pedidos = resultados.map(pedido => {
            return {
                ...pedido,
                Total: pedido.Total.toFixed(3)  // Convierte el decimal a string con 3 decimales
            };
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


