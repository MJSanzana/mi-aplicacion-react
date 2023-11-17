// api/index.js
const express = require('express');
const router = express.Router();
const usuariosRouter = require('./Usuarios');
const ticketsRoutes = require ('./Tickets')
const colegiosRoutes = require ('./Colegios')
const colegiosUsuarios = require ('./colegiosUsuarios')

router.use('/Users', usuariosRouter);
router.use('/Tickets', ticketsRoutes);
router.use('/colegios', colegiosRoutes);
router.use('/Asociar', colegiosUsuarios);

module.exports = router;
