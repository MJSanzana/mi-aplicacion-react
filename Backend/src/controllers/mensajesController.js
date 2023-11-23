//mensajesController.js
const db = require('../api/routes/db/db');

// Endpoint para obtener los mensajes del usuario actual
exports.obtenerMensajes = async (req, res) => {
    const usuarioId = req.params.usuarioId; // Debes obtener el ID del usuario actual desde la solicitud
    
    try {
        // Realiza una consulta para obtener los mensajes del usuario actual
        const sqlQuery = 'SELECT * FROM Mensajes WHERE Receptor_Id = ?';
        const mensajes = await db.query(sqlQuery, [usuarioId]);

        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Endpoint para marcar un mensaje como leído
exports.marcarMensajeLeido = async (req, res) => {
    const mensajeId = req.params.mensajeId; // Debes obtener el ID del mensaje desde la solicitud
    
    try {
        // Realiza una actualización para marcar el mensaje como leído
        const sqlUpdate = 'UPDATE Mensajes SET Leido = 1 WHERE Id = ?';
        await db.query(sqlUpdate, [mensajeId]);

        res.json({ message: 'Mensaje marcado como leído con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Endpoint para crear un nuevo mensaje
exports.crearMensaje = async (req, res) => {
    const { emisorId, receptorId, mensaje, productoId } = req.body; // Debes obtener los datos del mensaje desde la solicitud
    
    try {
        // Inserta un nuevo mensaje en la tabla de mensajes, incluyendo Producto_Id
        const sqlInsert = 'INSERT INTO Mensajes (Emisor_Id, Receptor_Id, Producto_Id, Mensaje, Leido) VALUES (?, ?, ?, ?, 0)';
        await db.query(sqlInsert, [emisorId, receptorId, productoId, mensaje]);

        res.status(200).json({ message: 'Mensaje enviado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.obtenerMensajesEnviados = async (req, res) => {
    const emisorId = req.params.emisorId; // Debes obtener el ID del usuario emisor desde la solicitud
    
    try {
        // Realiza una consulta para obtener los mensajes enviados por el usuario
        const sqlQuery = 'SELECT * FROM Mensajes WHERE Emisor_Id = ?';
        const mensajesEnviados = await db.query(sqlQuery, [emisorId]);

        res.json(mensajesEnviados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
