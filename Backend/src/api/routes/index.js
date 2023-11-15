// api/index.js
const express = require('express');
const router = express.Router();

// Importa los routers de otros archivos
const usuariosRouter = require('./Usuarios');


// Aquí usas los routers importados, montándolos en su ruta específica
router.use('/', usuariosRouter);

//router.use('/otroRecurso', otroRouter); // Cambia '/otroRecurso' por la ruta base que quieras para este recurso

// Exporta el router principal
module.exports = router;
