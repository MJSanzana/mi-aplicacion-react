//colegiosUsuariosController.js
const db = require('../api/routes/db/db'); 

exports.asociarUsuarioConColegio = async (req, res) => {
    const { colegioId, usuarioId } = req.params;
    try {
      const resultado = await db.query('INSERT INTO colegios_usuarios (colegio_id, usuario_id) VALUES (?, ?)',
        [colegioId, usuarioId]
      );
      res.status(200).json({ message: 'Asociación creada correctamente', data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.obtenerColegiosPorUsuario = async (req, res) => {
    const { usuarioId } = req.params;
    try {
      const colegios = await db.query('SELECT c.* FROM colegios_usuarios cu JOIN colegio c ON cu.colegio_id = c.id WHERE cu.usuario_id = ?',
      [usuarioId]
    );    
      res.status(200).json(colegios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.obtenerUsuariosPorColegio = async (req, res) => {
    const { colegioId } = req.params;
    try {
      const usuarios = await db.query(
        'SELECT u.* FROM colegios_usuarios cu JOIN usuarios u ON cu.usuario_id = u.Id WHERE cu.colegio_id = ?',
        [colegioId]
      );
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }; 