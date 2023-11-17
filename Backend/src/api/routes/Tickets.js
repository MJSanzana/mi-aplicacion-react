// Tu archivo de rutas (por ejemplo, ticketsRoutes.js)
const express = require('express');
const router = express.Router();
const ticketsController = require('../routes/controllers/ticketsController');

router.post('/Soporte', ticketsController.createTicket);
router.get('/', ticketsController.getTickets);

module.exports = router;
