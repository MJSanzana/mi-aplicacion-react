const db = require('../api/routes/db/db'); 
exports.crearEnvio = async (req, res) => {
    const { pedido_id, metodo_envio, costo, numero_seguimiento } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Envios (Pedido_Id, Metodo_Envio, Costo, Numero_Seguimiento) VALUES (?, ?, ?, ?)',
            [pedido_id, metodo_envio, costo, numero_seguimiento]
        );
        res.status(200).json({ message: "Envío creado con éxito", envioId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

