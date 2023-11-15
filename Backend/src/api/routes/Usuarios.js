const express = require('express');
const router = express.Router();
const usuariosController = require('../routes/controllers/usuariosController'); 

// Obtener todos los usuarios
router.get('/Users', usuariosController.getAllUsers);

// Obtener un usuario específico por ID
router.get('/Users/:id', usuariosController.getUserById); 

// Crear un nuevo usuario
router.post('/CreateUser', usuariosController.createUser);

// Iniciar sesión
router.post('/Login', usuariosController.loginUser);

// Actualizar un usuarios
router.put('/EditUsers/:id', usuariosController.updateUser); 

// Ruta para desactivar un usuario
router.post('/deactivate/:id', usuariosController.deactivateUser); 

// Ruta para reactivar un usuario
router.post('/reactivate/:id', usuariosController.reactivateUser); 

module.exports = router;