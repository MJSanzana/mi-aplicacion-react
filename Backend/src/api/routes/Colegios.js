// colegioRoutes.js
const express = require('express');
const router = express.Router();
const colegioController = require('./controllers/colegioController');

router.get('/busqueda', colegioController.getAllColegios);
router.post('/create', colegioController.createColegio);

module.exports = router;
