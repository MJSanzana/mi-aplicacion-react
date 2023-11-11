// server/email.js

const nodemailer = require("nodemailer");


// Utiliza variables de entorno para almacenar información sensible
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true", // Puede ser "true" o "false"
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
function createMailOptions(Email, ticketId, errorList, Problema, Nombre) {
  const subject = `Confirmación de tu ticket de soporte ${ticketId}`;
  let message = `Hola ${Nombre},\nGracias por ponerte en contacto con Viasmae. Hemos recibido tu solicitud de soporte y la hemos registrado con el número de ticket [${ticketId}].\n`;
  message += `\nResumen de tu solicitud:\n`;
  message += `Error: ${errorList}\n`;
  message += `Descripción del Problema: ${Problema}\n`;

  message += `\nEstamos revisando tu solicitud y uno de nuestros representantes de soporte se pondrá en contacto contigo en las próximas 48 Horas para ayudarte a resolver tu problema.\nSi tienes alguna pregunta adicional o información que agregar a tu ticket, no dudes en responder a este correo.\nAgradecemos tu paciencia y comprensión.\nAtentamente,\n`;
  
  message += `\nEl equipo de soporte de Viasmae`;

  return {
      from: process.env.EMAIL_USER,
      to: Email,
      subject: subject,
      text: message,
  };
}

module.exports = {
  transporter,
  createMailOptions
};
