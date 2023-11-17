// colegiosUsuarios.js
const express = require('express');
const router = express.Router();
const colegiosUsuariosController = require('./controllers/colegiosUsuariosController');

// Asociar un usuario con un colegio
router.post('/colegios/:colegioId/usuarios/:usuarioId', colegiosUsuariosController.asociarUsuarioConColegio);

// Obtener todos los colegios asociados a un usuario
router.get('/usuarios/:usuarioId/colegios', colegiosUsuariosController.obtenerColegiosPorUsuario);

// Obtener todos los usuarios asociados a un colegio
router.get('/colegios/:colegioId/usuarios', colegiosUsuariosController.obtenerUsuariosPorColegio);

module.exports = router;

