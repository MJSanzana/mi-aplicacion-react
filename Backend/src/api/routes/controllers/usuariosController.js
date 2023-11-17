// usuariosController.js
const { query } = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.getAllUsers = async (req, res) => {
  try {
    const results = await query('SELECT * FROM Usuarios');
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
    const results = await query('SELECT * FROM Usuarios WHERE Id = ?', [req.params.id]);
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

    const newUser = await query('INSERT INTO Usuarios (NombreUsuario, Apellido, Email, Contraseña, TipoUsuario) VALUES (?, ?, ?, ?, ?)', [NombreUsuario, Apellido, Email, hashedPassword, TipoUsuario]);

    function handleResponse(res, status, message, data = {}) {
      res.status(status).json({ message, ...data });
    }
    handleResponse(res, 201, 'Usuario creado con éxito', { userId: newUser.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  const { Email, Contraseña } = req.body;

  try {
    const users = await query('SELECT * FROM Usuarios WHERE Email = ?', [Email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(Contraseña, user.Contraseña);

    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Asegúrate de tener una clave secreta para firmar el token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // Firmar el token JWT si la contraseña es correcta
    const token = jwt.sign({ id: user.ID }, jwtSecret, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', userId: user.Id, token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  const {
    NombreUsuario, Apellido, Email, Contraseña,
    Perfil_Imagen, Documento_Numero, Celular_Numero,
    Direccion, Comuna
  } = req.body;

  if (!NombreUsuario || !Apellido || !Email || !Perfil_Imagen || !Documento_Numero || !Celular_Numero || !Direccion || !Comuna) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    let hashedPassword;
    if (Contraseña) {
      hashedPassword = await bcrypt.hash(Contraseña, 10);
    } else {
      //obtener la contraseña actual
      const [currentUser] = await query('SELECT Contraseña FROM Usuarios WHERE Id = ?', [req.params.id]);
      hashedPassword = currentUser.Contraseña;
    }

    await query('UPDATE Usuarios SET NombreUsuario = ?, Apellido = ?, Email = ?, Contraseña = ?, Perfil_Imagen = ?, Documento_Numero = ?, Celular_Numero = ?, Direccion = ?, Comuna = ? WHERE Id = ?', 
                [NombreUsuario, Apellido, Email, hashedPassword, Perfil_Imagen, Documento_Numero, Celular_Numero, Direccion, Comuna, req.params.id]);

    res.json({ message: 'Usuario actualizado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deactivateUser = async (req, res) => {
  const userId = req.params.id;
  const { CreadoPor } = req.body;
  try {
    const results = await query('INSERT INTO DesactivacionUsuario_Solicitud (Usuario_Id, CreadoPor) VALUES (?, ?)', [userId, CreadoPor]);
    res.json({ message: 'Solicitud de desactivación creada con éxito', solicitudId: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reactivateUser = async (req, res) => {
  const userId = req.params.id;
  const { CreadoPor } = req.body;
  try {
    const results = await query('INSERT INTO ReactivacionUsuario_Solicitud (Usuario_Id, CreadoPor) VALUES (?, ?)', [userId, CreadoPor]);
    res.json({ message: 'Solicitud de reactivación creada con éxito', solicitudId: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


