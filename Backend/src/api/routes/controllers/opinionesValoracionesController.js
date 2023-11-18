const db = require('../db/db');
exports.crearOpinionValoracion = async (req, res) => {
    const { usuario_id, producto_id, valoracion, comentario } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO OpinionesValoraciones (Usuario_Id, Producto_Id, Valoracion, Comentario) VALUES (?, ?, ?, ?)',
            [usuario_id, producto_id, valoracion, comentario]
        );
        res.status(200).json({ message: "Opinión y valoración creadas con éxito", opinionValoracionId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

