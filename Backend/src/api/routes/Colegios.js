// colegioRoutes.js
const express = require('express');
const router = express.Router();
const colegioController = require('./controllers/colegioController');

router.get('/colegios', colegioController.getAllColegios);
router.post('/create', colegioController.createColegio);

module.exports = router;
