  // ticketsController.js
  const db = require('../api/routes/db/db'); 
  const { transporter, createMailOptions } = require('../server/email');

exports.getTickets = async (req, res) => {
    try {
      const sql = "SELECT * FROM tickets_soporte";
      const results = await db.query(sql);
      res.json(results);
    } catch (err) {
      console.error("Error al obtener los tickets:", err);
      res.status(500).json({ error: 'Error al obtener los tickets.' });
    }
  };

exports.createTicket = async (req, res) => {
  const { Nombre, Email, Problema, CommonErrors } = req.body;

  try {
    const insertQuery = "INSERT INTO tickets_soporte (Nombre, Email, Problema, CommonErrors) VALUES (?, ?, ?, ?)";
    const results = await db.query(insertQuery, [Nombre, Email, Problema, CommonErrors.join(", ")]);

    const ID = results.insertId;
    const mailOptions = createMailOptions(Email, ID, CommonErrors.join(", "), Problema, Nombre);

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Ticket creado correctamente', ticketId: ID });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};