const express = require('express');
const db = require('../routes/db/db');

const router = express.Router();

// Habilitar logs de depuración para el transporte de correo electrónico
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Servidor listo para tomar mensajes");
  }
});

// Esta es la ruta que devuelve todos los tickets
router.get('/Tickets', (req, res) => {
  const sql = "SELECT * FROM tickets_soporte";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los tickets.' });
    }
    res.json(results);
  });
});
// Esta es la ruta que crea un nuevo ticket
router.post('/Soporte', (req, res) => {
  const { Nombre, Email, Problema, CommonErrors } = req.body;

  db.query(
    "INSERT INTO tickets_soporte (Nombre, Email, Problema, CommonErrors) VALUES (?, ?, ?, ?)",
    [Nombre, Email, Problema, CommonErrors.join(", ")],
    (err, results) => {
      if (err) {
        console.error(err); // Agrega el log del error
        return res.status(500).json({ error: 'Error al insertar en la base de datos' });
      }

      const ID = results.insertId;
      const mailOptions = createMailOptions(
        Email,
        ID,
        CommonErrors.join(", "),
        Problema,
        Nombre
      );

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error al enviar el correo:", error);
          return res.status(500).json({ error: 'Error al enviar el correo' });
        }
        console.log('Correo enviado: ', info);
        return res.status(200).json({ message: 'Ticket creado correctamente', ticketId: ID });
      });
    }
  );
});

module.exports = router;