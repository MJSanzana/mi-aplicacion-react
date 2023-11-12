// api/routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuariosController = require('./controllers/usuariosController');

// Obtener todos los usuarios
router.get('/', usuariosController.getAllUsers);

// Obtener un usuario específico por ID
router.get('/:id', usuariosController.getUserById);

// Crear un nuevo usuario
router.post('/', usuariosController.createUser);

// Actualizar un usuario
router.put('/:id', usuariosController.updateUser);

// Ruta para desactivar un usuario
router.post('/:id/desactivar', usuariosController.deactivateUser);

// Ruta para reactivar un usuario
router.post('/:id/reactivar', usuariosController.reactivateUser);


module.exports = router;
