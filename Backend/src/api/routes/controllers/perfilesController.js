const { query } = require('../db/db'); // Actualiza la ruta según corresponda

// perfilesController.js
exports.createProfile = (req, res) => {
    // Obtienes los datos del cuerpo de la solicitud (body)
    const { TipoUsuario, ImagenPerfil, DocumentoNumero, CelularNumero } = req.body;
  
    // Construyes tu consulta SQL para insertar el nuevo perfil
    const query = `INSERT INTO perfiles (TipoUsuario, ImagenPerfil, DocumentoNumero, CelularNumero) VALUES (?, ?, ?, ?)`;
  
    // Ejecutas la consulta con los valores proporcionados
    db.query(query, [TipoUsuario, ImagenPerfil, DocumentoNumero, CelularNumero], (err, results) => {
      if (err) {
        // Si hay un error, envías una respuesta con el error
        return res.status(500).json({ error: err.message });
      }
      // Si no hay error, envías una respuesta con el ID del perfil recién creado
      res.status(201).json({ message: 'Perfil creado con éxito', perfilId: results.insertId });
    });
  };