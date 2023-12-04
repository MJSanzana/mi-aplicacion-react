//enviosController.js
const db = require('../api/routes/db/db');
 
exports.crearEnvio = async (req, res) => {
    const { pedido_id, metodo_envio, costo, numero_seguimiento } = req.body;

    try {
        // Validar que el pedido existe
        const [pedidoExistente] = await db.query('SELECT Id FROM Pedidos WHERE Id = ?', [pedido_id]);
        if (!pedidoExistente) {
            return res.status(404).json({ error: "Pedido no encontrado." });
        }

        // Crear el envío
        const result = await db.query(
            'INSERT INTO Envios (Pedido_Id, Metodo_Envio, Costo, Numero_Seguimiento) VALUES (?, ?, ?, ?)',
            [pedido_id, metodo_envio, costo, numero_seguimiento]
        );

        res.status(200).json({ message: "Envío creado con éxito", envioId: result.insertId });
    } catch (error) {
        console.error('Error al crear el envío:', error);
        res.status(500).json({ error: 'Error al crear el envío: ' + error.message });
    }
};

