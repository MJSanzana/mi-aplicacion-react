// usuariosController.js
const { query } = require('../db/db'); // Actualiza la ruta según corresponda

exports.getAllUsers = async (req, res) => {
  try {
    const results = await query('SELECT * FROM Usuarios JOIN Perfiles ON Usuarios.Perfil_ID = Perfiles.ID');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const results = await query('SELECT * FROM Usuarios JOIN Perfiles ON Usuarios.Perfil_ID = Perfiles.ID WHERE Usuarios.ID = ?', [req.params.id]);
    res.json(results[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { NombreUsuario, Apellido, Email, Contrasena, Perfil_ID } = req.body;
  try {
    const results = await query('INSERT INTO Usuarios (NombreUsuario, Apellido, Email, Contrasena, Perfil_ID) VALUES (?, ?, ?, ?, ?)', [NombreUsuario, Apellido, Email, Contrasena, Perfil_ID]);
    res.json({ message: 'Usuario creado con éxito', userId: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { NombreUsuario, Apellido, Email, Contrasena, Perfil_ID } = req.body;
  try {
    await query('UPDATE Usuarios SET NombreUsuario = ?, Apellido = ?, Email = ?, Contrasena = ?, Perfil_ID = ? WHERE ID = ?', [NombreUsuario, Apellido, Email, Contrasena, Perfil_ID, req.params.id]);
    res.json({ message: 'Usuario actualizado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deactivateUser = async (req, res) => {
  const userId = req.params.id;
  const { CreadoPor } = req.body;
  try {
    const results = await query('INSERT INTO DesactivacionUsuario_Solicitud (Usuario_ID, CreadoPor) VALUES (?, ?)', [userId, CreadoPor]);
    res.json({ message: 'Solicitud de desactivación creada con éxito', solicitudId: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reactivateUser = async (req, res) => {
  const userId = req.params.id;
  const { CreadoPor } = req.body;
  try {
    const results = await query('INSERT INTO ReactivacionUsuario_Solicitud (Usuario_ID, CreadoPor) VALUES (?, ?)', [userId, CreadoPor]);
    res.json({ message: 'Solicitud de reactivación creada con éxito', solicitudId: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createProfile = async (req, res) => {
  try {
    const { TipoUsuario, ImagenPerfil, DocumentoNumero, CelularNumero } = req.body;
    const results = await query('INSERT INTO perfiles (TipoUsuario, ImagenPerfil, DocumentoNumero, CelularNumero) VALUES (?, ?, ?, ?)', [TipoUsuario, ImagenPerfil, DocumentoNumero, CelularNumero]);
    res.json({ message: 'Perfil creado con éxito', perfilId: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
