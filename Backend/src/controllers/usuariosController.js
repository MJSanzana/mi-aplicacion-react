// usuariosController.js
const db = require('../api/routes/db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM Usuarios');
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios.' });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM Usuarios WHERE Id = ?', [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { NombreUsuario, Apellido, Email, Contraseña, TipoUsuario } = req.body;

  // Lista de tipos de usuario válidos
  const tiposValidos = ["Usuario", "Administrador", "Proveedor", "Soporte"];

  if (!NombreUsuario || !Apellido || !Email || !Contraseña) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  // Validar el valor de TipoUsuario
  if (!TipoUsuario || !tiposValidos.includes(TipoUsuario)) {
    return res.status(400).json({ error: "Tipo de usuario no válido o no proporcionado." });
  }

  try {
    const hashedPassword = await bcrypt.hash(Contraseña, 10);

    const newUser = await db.query('INSERT INTO Usuarios (NombreUsuario, Apellido, Email, Contraseña, TipoUsuario) VALUES (?, ?, ?, ?, ?)', [NombreUsuario, Apellido, Email, hashedPassword, TipoUsuario]);

    function handleResponse(res, status, message, data = {}) {
      res.status(status).json({ message, ...data });
    }
    handleResponse(res, 200, 'Usuario creado con éxito', { userId: newUser.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  const { Email, Contraseña } = req.body;

  try {
    // Asumiendo que 'TipoUsuario' es una columna en tu tabla 'Usuarios'
    const users = await db.query('SELECT * FROM Usuarios WHERE Email = ?', [Email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(Contraseña, user.Contraseña);

    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    const token = jwt.sign({ id: user.Id }, jwtSecret, { expiresIn: '4h' });

    // Agregar el tipo de usuario a la respuesta
    res.json({ message: 'Inicio de sesión exitoso', userId: user.Id, token, tipoUsuario: user.TipoUsuario , NombreUsuario: user.NombreUsuario});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  const {
    NombreUsuario, Apellido, Email,
    Documento_Numero, Celular_Numero,
    Direccion, Comuna
  } = req.body;

  if (!NombreUsuario || !Apellido || !Email ) {
    return res.status(400).json({ error: "Nombre de usuario, apellido y email son obligatorios." });
  }

  try {
    await db.query(
      'UPDATE Usuarios SET NombreUsuario = ?, Apellido = ?, Email = ?, Documento_Numero = IFNULL(?, Documento_Numero), Celular_Numero = IFNULL(?, Celular_Numero), Direccion = IFNULL(?, Direccion), Comuna = IFNULL(?, Comuna) WHERE Id = ?',
      [NombreUsuario, Apellido, Email, Documento_Numero, Celular_Numero, Direccion, Comuna, req.params.id]
    );

    res.json({ message: 'Usuario actualizado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deactivateUser = async (req, res) => {
  const userId = req.params.id;
  const { CreadoPor } = req.body;
  try {
    const results = await db.query('INSERT INTO DesactivacionUsuario_Solicitud (Usuario_Id, CreadoPor) VALUES (?, ?)', [userId, CreadoPor]);
    res.json({ message: 'Solicitud de desactivación creada con éxito', solicitudId: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reactivateUser = async (req, res) => {
  const userId = req.params.id;
  const { CreadoPor } = req.body;
  try {
    const results = await db.query('INSERT INTO ReactivacionUsuario_Solicitud (Usuario_Id, CreadoPor) VALUES (?, ?)', [userId, CreadoPor]);
    res.json({ message: 'Solicitud de reactivación creada con éxito', solicitudId: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Cambio de contraseña
exports.changeUserPassword = async (req, res) => {
  const userId = req.params.id;
  const { nuevaContraseña } = req.body;

  if (!nuevaContraseña) {
    return res.status(400).json({ error: "La nueva contraseña es obligatoria." });
  }

  try {
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    await db.query('UPDATE Usuarios SET Contraseña = ? WHERE Id = ?', [hashedPassword, userId]);

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};