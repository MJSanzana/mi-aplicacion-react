//contollers/opinionesValoracionesController.js
const db = require('../api/routes/db/db'); 


exports.crearOpinionValoracion = async (req, res) => {
    const { usuario_id, producto_id, valoracion, comentario } = req.body;

    try {
        // Obtener el correo electrónico del usuario a partir del usuario_id
        const datosUsuario = await db.query('SELECT Correo FROM Usuarios WHERE Id = ?', [usuario_id]);
        const correo = datosUsuario[0]?.Correo;

        // Insertar la opinión y valoración en la base de datos
        const result = await db.query(
            'INSERT INTO OpinionesValoraciones (Usuario_Id, Producto_Id, Valoracion, Comentario, Correo) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, producto_id, valoracion, comentario, correo]
        );

        res.status(200).json({ message: "Opinión y valoración creadas con éxito", opinionValoracionId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.obtenerReseñasPorProductoId = async (req, res) => {
    const productoId = req.params.productoId;

    try {
        const reseñas = await db.query(
            'SELECT * FROM OpinionesValoraciones WHERE Producto_Id = ? ORDER BY Fecha DESC',
            [productoId]
        );
        res.json(reseñas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



